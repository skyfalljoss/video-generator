
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { createAdminClient } from '@/utils/supabase/admin'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  const payload = await req.json()
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    })
  }

  const eventType = evt.type;
  console.log(`Webhook received: ${eventType}`);

  // Only handle user creation to insert the initial Supabase user row.
  // Subscription tiers are read directly from Clerk — no sync needed here.
  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    const email = email_addresses[0]?.email_address;
    const fullName = `${first_name || ''} ${last_name || ''}`.trim();

    console.log(`Creating Supabase user row for: ${id}, ${email}`);

    const supabase = createAdminClient();

    const { error } = await supabase.from('users').upsert({
      id,
      email,
      full_name: fullName,
      image_url,
    });

    if (error) {
      console.error('Error creating user in Supabase:', error);
      return new Response('Error inserting user', { status: 500 });
    }

    console.log(`Successfully created Supabase user row for ${id}`);
  }

  return new Response('', { status: 200 })
}
