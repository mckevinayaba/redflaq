/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface ReauthenticationEmailProps {
  token: string
}

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your RedFlaq verification code</Preview>
    <Body style={main}>
      <Container style={outerWrapper}>
        <Container style={card}>
          <Section style={header}>
            <Img src="https://redflaq.lovable.app/redflaq-logo-email.png" alt="RedFlaq" height="44" style={{ margin: '0 auto 12px', display: 'block' }} />
          </Section>
          <Section style={body}>
            <Heading style={h1}>Your verification code</Heading>
            <Text style={paragraph}>Use the code below to confirm your identity:</Text>
            <Text style={codeStyle}>{token}</Text>
            <Text style={mutedCenter}>
              This code will expire shortly. If you didn't request this, you can safely ignore this email.
            </Text>
          </Section>
          <Section style={footer}>
            <Text style={footerMuted}>RedFlaq · Johannesburg, South Africa</Text>
          </Section>
        </Container>
      </Container>
    </Body>
  </Html>
)

export default ReauthenticationEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }
const outerWrapper = { padding: '40px 20px' }
const card = { maxWidth: '560px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '16px', overflow: 'hidden' as const, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }
const header = { backgroundColor: '#1a0a2e', padding: '32px 40px 24px', textAlign: 'center' as const }
const body = { padding: '40px 40px 32px' }
const h1 = { margin: '0 0 16px', fontSize: '26px', fontWeight: '700' as const, color: '#1a0a2e', lineHeight: '1.3' }
const paragraph = { margin: '0 0 24px', fontSize: '16px', color: '#444444', lineHeight: '1.6' }
const codeStyle = { fontFamily: 'Courier, monospace', fontSize: '32px', fontWeight: 'bold' as const, color: '#7C3AED', margin: '0 0 30px', textAlign: 'center' as const, letterSpacing: '6px' }
const mutedCenter = { margin: '0', fontSize: '13px', color: '#999999', textAlign: 'center' as const }
const footer = { backgroundColor: '#f3f0ff', padding: '24px 40px', borderTop: '1px solid #e8e4f4' }
const footerMuted = { margin: '0', fontSize: '12px', color: '#999999', textAlign: 'center' as const }
