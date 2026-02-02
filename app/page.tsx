export default function Home() {
  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: "40px 16px", fontFamily: "system-ui" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 22, fontWeight: 700 }}>ONEVOW</div>
        <nav style={{ display: "flex", gap: 14, fontSize: 14 }}>
          <a href="/pricing">Pricing</a>
          <a href="/contact">Contact</a>
          <a href="/terms">Terms</a>
          <a href="/privacy">Privacy</a>
        </nav>
      </header>
      <section style={{ marginTop: 56 }}>
        <h1 style={{ fontSize: 40, lineHeight: 1.1, margin: 0 }}>
          B2B CX analytics to improve SL, CSAT and efficiency.
        </h1>
        <p style={{ marginTop: 16, fontSize: 16, opacity: 0.85 }}>
          OneVow is a software platform that analyzes existing customer support data and identifies operational pain points.
          AI-assisted analysis supervised by experienced CX directors supports measurable improvements in customer satisfaction and profitability.
        </p>
        <div style={{ marginTop: 22, display: "flex", gap: 12 }}>
          <a href="/pricing" style={{ padding: "10px 14px", border: "1px solid #999", borderRadius: 10 }}>
            View pricing
          </a>
          <a href="/contact" style={{ padding: "10px 14px", border: "1px solid #999", borderRadius: 10 }}>
            Contact sales
          </a>
        </div>
      </section>

      <section style={{ marginTop: 48, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
        {[
          { title: "Data-in, insights-out", body: "Use existing CX/CS data. No need to handle card details or collect sensitive payment data." },
          { title: "Operational improvements", body: "Support improvements across SL, AHT, CSAT, and compliance through actionable recommendations." },
          { title: "B2B billing", body: "Subscription-based software services for enterprise clients." },
        ].map((c) => (
          <div key={c.title} style={{ border: "1px solid #eee", borderRadius: 14, padding: 16 }}>
            <div style={{ fontWeight: 700 }}>{c.title}</div>
            <p style={{ marginTop: 8, opacity: 0.85, fontSize: 14 }}>{c.body}</p>
          </div>
        ))}
      </section>

      <footer style={{ marginTop: 60, borderTop: "1px solid #eee", paddingTop: 18, fontSize: 13, opacity: 0.8 }}>
        <div>© {new Date().getFullYear()} OneVow</div>
        <div style={{ marginTop: 6 }}>
          <a href="/refund">Refund Policy</a> · <a href="/tokusho">Specified Commercial Transaction Act</a>
            <a href="/terms">Terms</a> ·
  <a href="/privacy">Privacy</a> ·<a href="/refund">Refund Policy</a>

         </div>
      </footer>
    </main>
  );
}
