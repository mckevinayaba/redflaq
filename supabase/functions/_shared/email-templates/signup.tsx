/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Button,
  Hr,
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
    <Preview>Welcome to RedFlaq — one click to activate your account 💜</Preview>
    <Body style={main}>
      <Container style={outerWrapper}>
        <Container style={card}>
          {/* HEADER */}
          <Section style={header}>
            <Img
              src="https://redflaq.lovable.app/redflaq-logo-email.png"
              alt="RedFlaq"
              height="44"
              style={{ margin: '0 auto 12px', display: 'block' }}
            />
            <Text style={headerSubtitle}>Public Record Safety Check · South Africa</Text>
          </Section>

          {/* BODY */}
          <Section style={body}>
            <Heading style={h1}>Welcome! 💜</Heading>
            <Text style={paragraph}>
              Thank you for joining RedFlaq. Click the button below to confirm your email and activate your account — it takes one second.
            </Text>

            {/* CTA BUTTON */}
            <Section style={buttonWrapper}>
              <Button style={ctaButton} href={confirmationUrl}>
                Confirm Your Email →
              </Button>
            </Section>

            <Text style={mutedCenter}>
              If you did not create a RedFlaq account, you can safely ignore this email.
            </Text>

            <Hr style={divider} />

            {/* WHAT YOU CAN DO */}
            <Text style={sectionLabel}>Once confirmed, you can:</Text>
            <Section style={benefitsBox}>
              <Text style={benefitItem}>✅ &nbsp;Run a public-record safety check in under 60 seconds</Text>
              <Text style={benefitItem}>✅ &nbsp;Get a clear risk report for R99</Text>
              <Text style={benefitItem}>✅ &nbsp;Keep your search 100% confidential</Text>
            </Section>
          </Section>

          {/* FOOTER */}
          <Section style={footer}>
            <Text style={footerText}>
              Questions? Reply to this email or visit{' '}
              <Link href="https://redflaq.com" style={footerLink}>redflaq.com</Link>
            </Text>
            <Text style={footerMuted}>
              RedFlaq is operated by Setup A Startup (Pty) Ltd · Johannesburg, South Africa
            </Text>
          </Section>
        </Container>
      </Container>
    </Body>
  </Html>
)

export default SignupEmail

/* ─── Styles ─── */
const main = {
  backgroundColor: '#f9f7f5',
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
}

const outerWrapper = {
  padding: '40px 20px',
}

const card = {
  maxWidth: '560px',
  margin: '0 auto',
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  overflow: 'hidden' as const,
  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
}

const header = {
  backgroundColor: '#1a0a2e',
  padding: '32px 40px 24px',
  textAlign: 'center' as const,
}

const headerSubtitle = {
  margin: '0',
  color: 'rgba(255,255,255,0.6)',
  fontSize: '13px',
  letterSpacing: '1px',
  textTransform: 'uppercase' as const,
}

const body = {
  padding: '40px 40px 32px',
}

const h1 = {
  margin: '0 0 16px',
  fontSize: '26px',
  fontWeight: '700' as const,
  color: '#1a0a2e',
  lineHeight: '1.3',
}

const paragraph = {
  margin: '0 0 24px',
  fontSize: '16px',
  color: '#444444',
  lineHeight: '1.6',
}

const buttonWrapper = {
  textAlign: 'center' as const,
  padding: '8px 0 32px',
}

const ctaButton = {
  display: 'inline-block' as const,
  backgroundColor: '#7C3AED',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600' as const,
  textDecoration: 'none',
  padding: '16px 40px',
  borderRadius: '50px',
  letterSpacing: '0.3px',
}

const mutedCenter = {
  margin: '0 0 32px',
  fontSize: '13px',
  color: '#999999',
  textAlign: 'center' as const,
}

const divider = {
  border: 'none',
  borderTop: '1px solid #eeeeee',
  margin: '0 0 28px',
}

const sectionLabel = {
  margin: '0 0 14px',
  fontSize: '14px',
  fontWeight: '700' as const,
  color: '#1a0a2e',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
}

const benefitsBox = {
  backgroundColor: '#f3f0ff',
  borderRadius: '12px',
  padding: '20px 24px',
}

const benefitItem = {
  padding: '6px 0',
  fontSize: '15px',
  color: '#333333',
  margin: '0',
}

const footer = {
  backgroundColor: '#f3f0ff',
  padding: '24px 40px',
  borderTop: '1px solid #e8e4f4',
}

const footerText = {
  margin: '0 0 6px',
  fontSize: '13px',
  color: '#666666',
  textAlign: 'center' as const,
}

const footerLink = {
  color: '#7C3AED',
  textDecoration: 'none',
}

const footerMuted = {
  margin: '0',
  fontSize: '12px',
  color: '#999999',
  textAlign: 'center' as const,
}
