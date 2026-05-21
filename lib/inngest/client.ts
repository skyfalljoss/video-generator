
import { Inngest } from "inngest";

const isDev =
  process.env.INNGEST_DEV === "1" ||
  process.env.INNGEST_DEV === "true" ||
  process.env.NODE_ENV === "development";

// Create a client to send and receive events
export const inngest = new Inngest({
  id: "short-video-generator",
  isDev,
});
