export default function PrivacyPolicy() {
  const lastUpdated = "January 2026";

  const content = `
Privacy Policy
Last Revised: ${lastUpdated}

OneVow (“we,” “our,” or “us”) provides the Xentrix platform and related services (collectively, the “Services”).
Protecting your privacy is important to us. This Privacy Policy explains how we collect, use, and safeguard information when you use the Services.

This policy applies to all Services provided by OneVow.

1. Information We Collect
When you use the Services, we may collect the following categories of information:

Account Information:
Name, email address, and contact details provided when creating or managing an account.

Usage and Technical Data:
Information about how the Services are accessed and used, including interaction data, device information, IP address, and system performance metrics.

Customer Content:
Operational data and materials uploaded by customers for analysis within Xentrix (such as CSV-based CX data and configuration inputs).

Payment Information:
Subscription and transaction details processed by our third-party payment provider. OneVow does not store full payment card details.

2. How We Use Information
We use the collected information solely for the following purposes:

Service Provision:
To operate, maintain, and deliver the core functionality of the Xentrix platform.

Service Improvement:
To monitor performance, improve usability, and enhance platform reliability using aggregated and anonymized data.

Security and Compliance:
To protect the Services, prevent misuse, and comply with applicable legal and regulatory obligations.

Communication:
To send service-related notices, updates, and essential administrative messages.

3. Data Sharing and Disclosure
We do not sell personal data to third parties.

We may share information only in the following circumstances:

Service Providers:
With trusted third-party service providers who assist in operating the Services, subject to confidentiality and data protection obligations.

Legal Requirements:
When required by law, regulation, or valid legal process.

4. AI and Analytics Processing
Customer Content is processed exclusively to provide analytics and insights within the Xentrix platform.

Customer Content is not used for AI model training.
Any system improvements or analytical enhancements are based solely on aggregated and anonymized operational data and do not identify individual customers, users, or datasets.

5. Data Retention and Deletion
We retain personal information only for as long as necessary to provide the Services and fulfill legitimate business and legal purposes.

Customers may request deletion of their account and associated data by contacting us using the information below, subject to applicable legal retention requirements.

6. User Rights
Depending on your jurisdiction, you may have the right to:

Access the personal data we hold about you  
Request correction or deletion of your data  
Restrict or object to certain processing activities  
Request data portability  

Requests may be submitted using the contact information below.

7. Security Measures
We implement reasonable administrative, technical, and organizational safeguards designed to protect information against unauthorized access, loss, or misuse.

8. Changes to This Policy
We may update this Privacy Policy from time to time.
Any changes will be posted on this page and become effective upon publication.

9. Contact Information
Business Name: OneVow  
Email: info@onevow.io  
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
          Privacy Policy
        </h1>
        <p style={{ marginTop: 10, opacity: 0.85 }}>
          This Privacy Policy explains how OneVov handles information related to the Xentrix platform.
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
        <a href="/refund" style={{ marginRight: 12 }}>Refund</a>
        <a href="/tokusho">Commerce Disclosure</a>
      </footer>
    </main>
  );
}
