export default function RefundPolicy() {
  const lastUpdated = "January 2026";

  const content = `
Refund & Cancellation Policy
Last updated: ${lastUpdated}

This Refund and Cancellation Policy applies to the services provided by OneVow (“we,” “our,” or “us”).

1. Services Covered
OneVow provides B2B software and analytics services, including subscription-based access to digital platforms and related professional services.
All services are provided electronically and do not involve the delivery of physical goods.

2. Subscription Fees and Payments
- Subscription fees are billed in advance on a monthly or annual basis, depending on the plan selected.
- All prices are exclusive of applicable taxes unless otherwise stated.
- Once a payment has been successfully processed, access to the service is granted immediately.

3. Refund Policy
Due to the nature of digital and subscription-based services:
- All payments are non-refundable once the service has been activated.
- We do not provide refunds or credits for:
  - Partial subscription periods
  - Unused time
  - Downgrades
  - Early termination by the customer

4. Exceptions
Refunds may be considered only in the following exceptional cases, at our sole discretion:
- Duplicate charges caused by a system error
- Billing errors clearly attributable to OneVow
If a refund is approved, it will be processed using the original payment method.

5. Cancellation
- Customers may cancel their subscription at any time.
- Cancellation will take effect at the end of the current billing period.
- No further charges will be made after cancellation becomes effective.

6. Service Suspension or Termination
We reserve the right to suspend or terminate access to the service if:
- The customer violates our Terms of Service
- Payment obligations are not fulfilled
In such cases, no refunds will be issued.

7. Contact Information
OneVow
Email: info@onevow.io
Address: 2-2-1 Hokima, Adachi-ku, Tokyo 121-0064, Japan

8. Changes to This Policy
We may update this Refund and Cancellation Policy from time to time.
Any changes will be posted on this page and will become effective immediately upon publication.
`;

  return (
    <main
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "40px 16px",
        fontFamily: "system-ui",
        color: "#e5e7eb",          // ← 全体の文字色（薄いグレー）
      }}
    >
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 28, lineHeight: 1.2, color: "#ffffff" }}>
          Refund &amp; Cancellation Policy
        </h1>
        <p style={{ marginTop: 10, opacity: 0.85 }}>
          This policy explains refunds and cancellations for OneVow&apos;s B2B subscription services.
        </p>
      </header>

      <section
        style={{
          border: "1px solid #2a2a2a",
          borderRadius: 14,
          padding: 20,
          background: "#0f172a",   // ← ダーク背景（他ページと合わせる）
        }}
      >
        <pre
          style={{
            whiteSpace: "pre-wrap",
            lineHeight: 1.7,
            margin: 0,
            fontSize: 14,
            color: "#e5e7eb",       // ← 明示的に文字色指定
          }}
        >
          {content.trim()}
        </pre>
      </section>

      <footer style={{ marginTop: 28, fontSize: 13, opacity: 0.8 }}>
        <a href="/" style={{ marginRight: 12 }}>Home</a>
        <a href="/privacy" style={{ marginRight: 12 }}>Privacy</a>
        <a href="/terms" style={{ marginRight: 12 }}>Terms</a>
        <a href="/tokusho">Commerce Disclosure</a>
      </footer>
    </main>
  );
}
