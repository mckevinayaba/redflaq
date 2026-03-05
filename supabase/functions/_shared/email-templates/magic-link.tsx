/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface MagicLinkEmailProps {
  siteName: string
  confirmationUrl: string
}

export const MagicLinkEmail = ({
  siteName,
  confirmationUrl,
}: MagicLinkEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your RedFlaq login link</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://redflaq.lovable.app/redflaq-logo-email.png"
          alt="RedFlaq"
          height="44"
          style={{ margin: '0 0 28px' }}
        />
        <Heading style={h1}>Your login link</Heading>
        <Text style={text}>
          Click the button below to sign in to RedFlaq. This link will expire shortly.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Sign in to RedFlaq →
        </Button>
        <Text style={footer}>
          If you didn't request this link, you can safely ignore this email.
        </Text>
        <Text style={footerBrand}>
          RedFlaq · South African Background Checks
        </Text>
      </Container>
    </Body>
  </Html>
)

export default MagicLinkEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Syne', 'Segoe UI', Arial, sans-serif" }
const container = { padding: '40px 28px' }
const h1 = {
  fontSize: '24px',
  fontWeight: 'bold' as const,
  fontFamily: "'DM Serif Display', Georgia, serif",
  color: '#0F0A1A',
  margin: '0 0 16px',
}
const text = {
  fontSize: '15px',
  color: '#4B4453',
  lineHeight: '1.7',
  margin: '0 0 28px',
}
const button = {
  backgroundColor: '#7C3AED',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: '700' as const,
  borderRadius: '50px',
  padding: '14px 32px',
  textDecoration: 'none',
}
const footer = { fontSize: '13px', color: '#78716C', margin: '32px 0 0', lineHeight: '1.6' }
const footerBrand = { fontSize: '11px', color: '#A8A29E', margin: '24px 0 0', borderTop: '1px solid #E7E5E4', paddingTop: '16px' }
