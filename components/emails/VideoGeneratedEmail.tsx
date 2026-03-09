import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface VideoGeneratedEmailProps {
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
}

export const VideoGeneratedEmail = ({
  title,
  videoUrl,
  thumbnailUrl,
}: VideoGeneratedEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your video &quot;{title}&quot; is ready!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Video Generation Complete 🎉</Heading>
          <Text style={text}>
            Great news! Your video <strong>{title}</strong> has finished generating and is ready for you to view and download.
          </Text>
          <Section style={thumbnailSection}>
            <Img
              src={thumbnailUrl}
              width="300"
              alt="Video Thumbnail"
              style={thumbnail}
            />
          </Section>
          <Section style={buttonContainer}>
            <Button style={button} href={videoUrl}>
              View / Download Video
            </Button>
          </Section>
          <Text style={footer}>
            If the button doesn&apos;t work, you can copy and paste this link into your browser:
            <br />
            <Link href={videoUrl} style={link}>
              {videoUrl}
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  borderRadius: "8px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  maxWidth: "600px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "0 0 20px",
};

const text = {
  color: "#555",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 20px",
};

const thumbnailSection = {
  textAlign: "center" as const,
  margin: "20px 0",
};

const thumbnail = {
  borderRadius: "8px",
  margin: "0 auto",
  maxWidth: "100%",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "30px 0",
};

const button = {
  backgroundColor: "#007ee6",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
};

const footer = {
  color: "#8898aa",
  fontSize: "14px",
  lineHeight: "20px",
  marginTop: "30px",
};

const link = {
  color: "#007ee6",
  textDecoration: "underline",
};

export default VideoGeneratedEmail;
