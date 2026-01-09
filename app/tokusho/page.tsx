export default function CommerceDisclosure() {
  const lastUpdated = "November 3, 2025";

  const content = `
Commercial Transaction Law Disclosure (Japan) & Commerce Disclosure
Last Updated: ${lastUpdated}

This document constitutes the mandatory disclosure under Japan’s Act on Specified Commercial Transactions (Tokutei Shōtorihiki-hō) and provides essential commerce-related information.

1. Provider Information
Business Name: OneVow
Representative: Founder & CEO, Akiko Antipova
Address: 2-2-1 Hokima, Adachi-ku, Tokyo 121-0064, Japan
Contact Email: info@onevow.io
Support Language: English and Japanese
Response Time: Within 5 business days

2. Services Offered
OneVow provides Xentrix, a subscription-based B2B customer experience (CX) analytics platform.
Xentrix enables organizations to analyze operational CX data, identify performance indicators, and generate actionable insights for service quality improvement.
All services are provided digitally.

3. Pricing and Payment
Pricing:
Service fees vary depending on the subscription plan and are displayed on the applicable pricing page.

Taxes:
All prices include applicable taxes unless otherwise stated.

Payment Methods:
Payments are processed via Stripe and support major credit and debit cards.

Timing of Payment:
Subscription fees are charged in advance at the beginning of each billing cycle (monthly or annual).

Service Delivery:
Access to the Services is granted immediately after successful payment unless otherwise specified.

4. Refund and Cancellation Policy
Refund Policy:
All payments are non-refundable, as described in our Refund and Cancellation Policy.

Cancellation:
Subscriptions may be cancelled at any time by contacting us. Cancellation becomes effective at the end of the current billing period.

5. Legal Provisions
Service Suspension:
We reserve the right to suspend or terminate Services in accordance with our Terms of Service.

Governing Law and Jurisdiction:
These transactions are governed by the laws of Japan.
Any disputes shall be subject to the exclusive jurisdiction of the Tokyo District Court.
`;

  return (
    <main
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "40px 16px",
        fontFamily: "system-ui",
        color: "#e5e7eb",
      }}
    >
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 28, color: "#ffffff" }}>
          Commercial Transaction Law Disclosure
        </h1>
        <p style={{ marginTop: 10, opacity: 0.85 }}>
          Disclosure under Japan’s Act on Specified Commercial Transactions
        </p>
      </header>

      <section
        style={{
          border: "1px solid #2a2a2a",
          borderRadius: 14,
          padding: 20,
          background: "#0f172a",
        }}
      >
        <pre
          style={{
            whiteSpace: "pre-wrap",
            lineHeight: 1.7,
            margin: 0,
            fontSize: 14,
            color: "#e5e7eb",
          }}
        >
          {content.trim()}
        </pre>
      </section>

      <footer style={{ marginTop: 28, fontSize: 13, opacity: 0.8 }}>
        <a href="/" style={{ marginRight: 12 }}>Home</a>
        <a href="/terms" style={{ marginRight: 12 }}>Terms</a>
        <a href="/privacy" style={{ marginRight: 12 }}>Privacy</a>
        <a href="/refund">Refund</a>
      </footer>
    </main>
  );
}
