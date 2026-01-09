export default function TermsOfService() {
  const lastUpdated = "January 2026";

  const content = `
Terms of Service
Last Revised: ${lastUpdated}

Welcome to the services provided by OneVow (“we,” “our,” or “us”).
These Terms of Service (“Terms”) govern your access to and use of the Xentrix platform and related services (collectively, the “Services”) provided by OneVow.
By accessing or using the Services, you agree to be bound by these Terms.

1. Services Description
OneVow provides Xentrix, a B2B customer experience (CX) analytics platform designed for contact centers and enterprise teams.
Xentrix enables customers to analyze operational data (such as CSV-based CX data), identify performance indicators (including KPIs), and generate actionable insights to support service quality and business improvement.
All Services are provided digitally and do not involve the delivery of physical goods.

2. Agreement and Modifications
By accessing or using the Services, you enter into a legally binding agreement with OneVow.
If you do not agree to these Terms, you must not use the Services.
We reserve the right to modify these Terms at any time.
Material changes will be communicated via the website or by other reasonable means.
Continued use of the Services after such changes constitutes acceptance of the revised Terms.

3. Subscription, Fees, and Payment
A. Subscription Plans
Access to the Services requires a paid subscription, billed on a monthly or annual basis depending on the plan selected.

B. Billing and Auto-Renewal
Subscriptions automatically renew unless cancelled prior to the next billing date.

C. Payment Processing
All payments are processed through our third-party payment provider, Stripe.
Prices are exclusive of applicable taxes unless otherwise stated.

D. No Refunds
All fees are non-refundable, as described in our Refund and Cancellation Policy.
Fees cover immediate access to the Services and associated processing resources.

4. Customer Data and AI Processing
A. Customer Content Ownership
You retain ownership of all data and materials you upload to the Services (“Customer Content”).

B. Use of Customer Content
OneVow processes Customer Content solely for the purpose of providing, maintaining, and operating the Services.

C. AI and Analytics Processing
Customer Content is not used for AI model training.
Any analytics or model improvements are conducted using aggregated and anonymized operational data only and never in a manner that identifies individual customers or datasets.

5. Disclaimer of Warranties
The Services are provided on an “as is” and “as available” basis.
OneVow disclaims all warranties, express or implied, including but not limited to accuracy, reliability, fitness for a particular purpose, and non-infringement.
Analytical outputs are provided for decision-support purposes only and should be independently reviewed before use.

6. Limitation of Liability
To the maximum extent permitted by law, OneVow shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Services.
In no event shall OneVow’s total liability exceed the total fees paid by you to OneVow in the twelve (12) months preceding the event giving rise to the claim.

7. User Responsibilities
You agree to use the Services in compliance with all applicable laws and regulations.
You are solely responsible for the accuracy, legality, and appropriateness of Customer Content submitted to the Services.

8. General Provisions
A. Privacy
Our handling of personal data is governed by our Privacy Policy.

B. Intellectual Property
All software, technology, and proprietary content of the Services (excluding Customer Content) are the exclusive property of OneVow.

C. Indemnification
You agree to indemnify and hold harmless OneVow from any claims, damages, or liabilities arising from your use of the Services or violation of these Terms.

D. Governing Law and Jurisdiction
These Terms are governed by the laws of Japan.
Any disputes shall be subject to the exclusive jurisdiction of the Tokyo District Court.

9. Contact Information
Business Name: OneVow
Support Email: info@onevow.io
Address: 2-2-1 Hokima, Adachi-ku, Tokyo 121-0064, Japan
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
          Terms of Service
        </h1>
        <p style={{ marginTop: 10, opacity: 0.85 }}>
          These Terms govern the use of OneVow&apos;s Xentrix platform.
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
        <a href="/privacy" style={{ marginRight: 12 }}>Privacy</a>
        <a href="/refund" style={{ marginRight: 12 }}>Refund</a>
        <a href="/tokusho">Commerce Disclosure</a>
      </footer>
    </main>
  );
}
