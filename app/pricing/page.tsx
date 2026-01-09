export default function Pricing() {
  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: "40px 16px", fontFamily: "system-ui" }}>
      <h1>Pricing</h1>
      <p style={{ opacity: 0.85 }}>
        OneVow is offered as a B2B subscription service. Pricing depends on usage volume and integration scope.
      </p>

      <div style={{ marginTop: 18, border: "1px solid #eee", borderRadius: 14, padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>Enterprise Plan</h2>
        <ul style={{ lineHeight: 1.8 }}>
          <li>CX analytics & reporting</li>
          <li>AI-assisted insights</li>
          <li>Implementation support</li>
        </ul>
        <a href="/contact" style={{ display: "inline-block", marginTop: 10, padding: "10px 14px", border: "1px solid #999", borderRadius: 10 }}>
          Contact for a quote
        </a>
      </div>
    </main>
  );
}
