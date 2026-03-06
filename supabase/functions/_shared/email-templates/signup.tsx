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
  Link,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface SignupEmailProps {
  siteName: string
  siteUrl: string
  recipient: string
  confirmationUrl: string
}

export const SignupEmail = ({
  siteName,
  siteUrl,
  recipient,
  confirmationUrl,
}: SignupEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Confirm your email to activate your RedFlaq account 🛡️</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://redflaq.lovable.app/redflaq-logo-email.png"
          alt="RedFlaq"
          height="44"
          style={{ margin: '0 0 8px' }}
        />
        <Text style={subtitle}>Public Record Safety Check · South Africa</Text>
        <Heading style={h1}>Confirm your email</Heading>
        <Text style={text}>
          Thank you for joining{' '}
          <Link href={siteUrl} style={link}>
            <strong>RedFlaq</strong>
          </Link>
          . To activate your account, please confirm your email address (
          <Link href={`mailto:${recipient}`} style={link}>
            {recipient}
          </Link>
          ) by clicking the button below. It takes one second.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Confirm Your Email →
        </Button>
        <Text style={mutedNote}>
          If you did not create a RedFlaq account, you can safely ignore this email.
        </Text>
        <Text style={divider}>―</Text>
        <Text style={sectionHeading}>Once confirmed, you can:</Text>
        <Text style={listItem}>✅ Run a public-record safety check in under 60 seconds</Text>
        <Text style={listItem}>✅ Get a clear risk report for R99</Text>
        <Text style={listItem}>✅ Keep your search 100% confidential</Text>
        <Text style={footerBrand}>
          RedFlaq is operated by Setup A Startup (Pty) Ltd · South Africa ·{' '}
          <Link href="https://redflaq.com/privacy" style={footerLink}>Privacy</Link> ·{' '}
          <Link href="https://redflaq.com/terms" style={footerLink}>Terms</Link>
        </Text>
      </Container>
    </Body>
  </Html>
)

export default SignupEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Syne', 'Segoe UI', Arial, sans-serif" }
const container = { padding: '40px 28px' }
const subtitle = {
  fontSize: '13px',
  color: '#78716C',
  letterSpacing: '0.02em',
  margin: '0 0 28px',
}
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
const link = { color: '#7C3AED', textDecoration: 'underline' }
const button = {
  backgroundColor: '#7C3AED',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: '700' as const,
  borderRadius: '50px',
  padding: '14px 32px',
  textDecoration: 'none',
}
const mutedNote = { fontSize: '13px', color: '#78716C', margin: '28px 0 0', lineHeight: '1.6' }
const divider = { fontSize: '13px', color: '#D6D3D1', margin: '24px 0', textAlign: 'center' as const }
const sectionHeading = { fontSize: '14px', color: '#1a1a1a', fontWeight: '700' as const, margin: '0 0 8px' }
const listItem = { fontSize: '14px', color: '#4B4453', margin: '0 0 4px', lineHeight: '1.6' }
const footerBrand = { fontSize: '11px', color: '#A8A29E', margin: '28px 0 0', borderTop: '1px solid #E7E5E4', paddingTop: '16px' }
const footerLink = { color: '#A8A29E', textDecoration: 'underline' }
