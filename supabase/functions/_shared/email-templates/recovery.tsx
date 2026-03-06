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
} from 'npm:@react-email/components@0.0.22'

interface RecoveryEmailProps {
  siteName: string
  confirmationUrl: string
}

export const RecoveryEmail = ({
  siteName,
  confirmationUrl,
}: RecoveryEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Reset your RedFlaq password</Preview>
    <Body style={main}>
      <Container style={outerWrapper}>
        <Container style={card}>
          <Section style={header}>
            <Img
              src="https://redflaq.lovable.app/redflaq-logo-email.png"
              alt="RedFlaq"
              height="44"
              style={{ margin: '0 auto 12px', display: 'block' }}
            />
            <Text style={headerSubtitle}>Password Reset</Text>
          </Section>

          <Section style={body}>
            <Heading style={h1}>Reset your password</Heading>
            <Text style={paragraph}>
              We received a request to reset your RedFlaq password. Click the button below to choose a new one.
            </Text>

            <Section style={buttonWrapper}>
              <Button style={ctaButton} href={confirmationUrl}>
                Reset Password →
              </Button>
            </Section>

            <Text style={mutedCenter}>
              If you didn't request this, you can safely ignore this email. Your password won't change.
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              Need help?{' '}
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

export default RecoveryEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }
const outerWrapper = { padding: '40px 20px' }
const card = { maxWidth: '560px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '16px', overflow: 'hidden' as const, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }
const header = { backgroundColor: '#1a0a2e', padding: '32px 40px 24px', textAlign: 'center' as const }
const headerSubtitle = { margin: '0', color: 'rgba(255,255,255,0.6)', fontSize: '13px', letterSpacing: '1px', textTransform: 'uppercase' as const }
const body = { padding: '40px 40px 32px' }
const h1 = { margin: '0 0 16px', fontSize: '26px', fontWeight: '700' as const, color: '#1a0a2e', lineHeight: '1.3' }
const paragraph = { margin: '0 0 24px', fontSize: '16px', color: '#444444', lineHeight: '1.6' }
const buttonWrapper = { textAlign: 'center' as const, padding: '8px 0 32px' }
const ctaButton = { display: 'inline-block' as const, backgroundColor: '#7C3AED', color: '#ffffff', fontSize: '16px', fontWeight: '600' as const, textDecoration: 'none', padding: '16px 40px', borderRadius: '50px' }
const mutedCenter = { margin: '0', fontSize: '13px', color: '#999999', textAlign: 'center' as const }
const footer = { backgroundColor: '#f3f0ff', padding: '24px 40px', borderTop: '1px solid #e8e4f4' }
const footerText = { margin: '0 0 6px', fontSize: '13px', color: '#666666', textAlign: 'center' as const }
const footerLink = { color: '#7C3AED', textDecoration: 'none' }
const footerMuted = { margin: '0', fontSize: '12px', color: '#999999', textAlign: 'center' as const }
