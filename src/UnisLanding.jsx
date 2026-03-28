import { useState, useEffect, useRef } from "react";

// Logo lives in /public/unisLogoThree.svg — Vite serves public files at root
const LOGO_SRC = "/unisLogoThree.svg";

const UNIS_BLUE = "#083d8c";
const UNIS_BLUE_LIGHT = "#1a5fc2";
const GOLD = "#d4a017";
const GOLD_LIGHT = "#f0c94d";

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function Reveal({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function Pill({ children }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "6px 16px",
      borderRadius: "999px",
      border: "1px solid rgba(212,160,23,0.4)",
      color: GOLD_LIGHT,
      fontSize: "12px",
      fontWeight: 600,
      letterSpacing: "2px",
      textTransform: "uppercase",
      background: "rgba(212,160,23,0.08)",
    }}>
      {children}
    </span>
  );
}

function StatCard({ number, label, delay = 0 }) {
  return (
    <Reveal delay={delay}>
      <div className="stat-card">
        <div className="stat-number">{number}</div>
        <div className="stat-label">{label}</div>
      </div>
    </Reveal>
  );
}

function FeatureCard({ icon, title, description, accent = false, delay = 0 }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Reveal delay={delay}>
      <div
        className="feature-card"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: accent
            ? "linear-gradient(135deg, rgba(8,61,140,0.25), rgba(8,61,140,0.08))"
            : "rgba(255,255,255,0.025)",
          border: `1px solid ${
            hovered
              ? accent ? GOLD : "rgba(255,255,255,0.15)"
              : accent ? UNIS_BLUE_LIGHT : "rgba(255,255,255,0.06)"
          }`,
          borderRadius: "20px",
          padding: "36px 28px",
          height: "100%",
          transition: "transform 0.3s ease, border-color 0.3s ease",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
          cursor: "default",
        }}
      >
        <div style={{ fontSize: "32px", marginBottom: "18px" }}>{icon}</div>
        <h3 className="feature-title">{title}</h3>
        <p className="feature-desc">{description}</p>
      </div>
    </Reveal>
  );
}

function CompRow({ feature, unis, others, delay = 0 }) {
  return (
    <Reveal delay={delay}>
      <div className="comp-row">
        <span className="comp-feature">{feature}</span>
        <span className="comp-unis">{unis}</span>
        <span className="comp-others">{others}</span>
      </div>
    </Reveal>
  );
}

export default function UnisLanding() {
  const [scrollY, setScrollY] = useState(0);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = () => {
    if (email.includes("@")) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
      setEmail("");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap');

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
        body {
          background: #08090c;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          overflow-x: hidden;
          min-width: 0;
        }
        img { max-width: 100%; height: auto; display: block; }
        ::selection { background: ${UNIS_BLUE}; color: #fff; }

        /* ── GRAIN OVERLAY ── */
        .grain {
          position: fixed; inset: 0; pointer-events: none; z-index: 9999; opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 256px;
        }

        /* ── GLOW ── */
        .hero-glow {
          position: absolute; width: 500px; height: 500px; border-radius: 50%;
          filter: blur(120px); opacity: 0.12; pointer-events: none;
        }

        /* ── NAV ── */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          padding: 14px 24px;
          display: flex; align-items: center; justify-content: space-between;
          transition: background 0.3s ease, backdrop-filter 0.3s ease, border-color 0.3s ease;
        }
        .nav-logo { height: 40px; width: auto; }
        .nav-links { display: flex; gap: 20px; align-items: center; }
        .nav-link {
          color: rgba(255,255,255,0.6); text-decoration: none; font-size: 14px;
          font-weight: 500; transition: color 0.2s;
        }
        .nav-link:hover { color: #fff; }
        .nav-cta {
          display: inline-flex; align-items: center; padding: 9px 20px; border-radius: 999px;
          font-weight: 600; font-size: 13px; font-family: 'Outfit', sans-serif;
          text-decoration: none; background: ${UNIS_BLUE}; color: #fff; border: none;
          cursor: pointer; transition: background 0.3s ease;
        }
        .nav-cta:hover { background: ${UNIS_BLUE_LIGHT}; }
        .hamburger {
          display: none; background: none; border: none; cursor: pointer; padding: 8px;
          color: #fff; font-size: 24px; line-height: 1;
        }

        /* ── SECTION WRAPPER ── */
        .section {
          padding: 100px 24px;
          max-width: 1100px;
          margin: 0 auto;
          position: relative;
          width: 100%;
        }
        .section-border { border-top: 1px solid rgba(255,255,255,0.05); }

        /* ── HERO ── */
        .hero {
          position: relative; min-height: 100vh; min-height: 100dvh;
          display: flex; align-items: center; overflow: hidden;
        }
        .hero-headline {
          font-size: clamp(38px, 7vw, 80px); font-weight: 900;
          font-family: 'Outfit', sans-serif; line-height: 1.05;
          margin-top: 24px; margin-bottom: 24px; max-width: 800px; letter-spacing: -2px;
        }
        .hero-sub {
          font-size: clamp(16px, 2vw, 20px); line-height: 1.7;
          color: rgba(255,255,255,0.5); max-width: 540px; margin-bottom: 36px;
        }
        .hero-buttons { display: flex; gap: 14px; align-items: center; flex-wrap: wrap; }
        .gold-text {
          background: linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD});
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* ── BUTTONS ── */
        .cta-btn {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 15px 32px; border-radius: 999px; font-weight: 600;
          font-size: 15px; font-family: 'Outfit', sans-serif; letter-spacing: 0.3px;
          text-decoration: none; transition: all 0.3s ease; cursor: pointer; border: none;
        }
        .cta-primary {
          background: ${UNIS_BLUE}; color: #fff;
          box-shadow: 0 0 40px rgba(8,61,140,0.3);
        }
        .cta-primary:hover {
          background: ${UNIS_BLUE_LIGHT};
          box-shadow: 0 0 60px rgba(8,61,140,0.5); transform: translateY(-2px);
        }
        .cta-outline {
          background: transparent; color: #fff;
          border: 1px solid rgba(255,255,255,0.15);
        }
        .cta-outline:hover { border-color: rgba(255,255,255,0.4); background: rgba(255,255,255,0.04); }

        /* ── STATS ── */
        .stats-grid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          padding: 32px 24px;
        }
        .stat-card { text-align: center; padding: 28px 16px; }
        .stat-number {
          font-size: clamp(36px, 5vw, 60px); font-weight: 800;
          color: ${GOLD}; line-height: 1; font-family: 'Outfit', sans-serif;
        }
        .stat-label {
          font-size: 13px; color: rgba(255,255,255,0.45); margin-top: 10px;
          letter-spacing: 1px; text-transform: uppercase; font-weight: 500;
        }

        /* ── FEATURES ── */
        .feature-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; margin-top: 56px; }
        .feature-title {
          font-size: 20px; font-weight: 700; color: #fff; margin-bottom: 12px;
          font-family: 'Outfit', sans-serif;
        }
        .feature-desc { font-size: 14px; line-height: 1.7; color: rgba(255,255,255,0.5); }

        /* ── SECTION HEADINGS ── */
        .section-heading {
          font-size: clamp(28px, 5vw, 52px); font-weight: 800;
          font-family: 'Outfit', sans-serif; margin-top: 18px; margin-bottom: 14px;
          letter-spacing: -1px; line-height: 1.1;
        }
        .section-sub {
          font-size: 16px; line-height: 1.7; color: rgba(255,255,255,0.42);
          max-width: 580px; margin-bottom: 44px;
        }

        /* ── VIDEO PLACEHOLDER ── */
        .video-placeholder {
          position: relative; width: 100%; aspect-ratio: 16/9;
          background: linear-gradient(135deg, #0d1117, #161b24);
          border-radius: 16px; border: 1px solid rgba(255,255,255,0.06);
          display: flex; align-items: center; justify-content: center;
          overflow: hidden; cursor: pointer; transition: border-color 0.3s ease;
        }
        .video-placeholder:hover { border-color: ${UNIS_BLUE_LIGHT}; }
        .video-placeholder::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse at center, rgba(8,61,140,0.12), transparent 70%);
        }
        .play-btn {
          width: 64px; height: 64px; border-radius: 50%;
          background: rgba(255,255,255,0.1); backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.2);
          display: flex; align-items: center; justify-content: center;
          z-index: 1; transition: all 0.3s ease;
        }
        .video-placeholder:hover .play-btn {
          background: ${UNIS_BLUE}; border-color: ${UNIS_BLUE_LIGHT}; transform: scale(1.08);
        }
        .video-label {
          position: absolute; bottom: 16px; left: 16px; font-size: 11px;
          color: rgba(255,255,255,0.25); font-weight: 500;
          letter-spacing: 1px; text-transform: uppercase;
        }

        /* ── COMPARISON TABLE ── */
        .comp-container {
          background: rgba(255,255,255,0.02); border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.06);
          padding: 28px 28px; max-width: 680px; margin: 0 auto;
          overflow-x: auto;
        }
        .comp-header {
          display: grid; grid-template-columns: 1fr 90px 90px; gap: 12px;
          padding-bottom: 14px; border-bottom: 1px solid rgba(255,255,255,0.1);
          margin-bottom: 6px; min-width: 320px;
        }
        .comp-header-label {
          font-size: 11px; color: rgba(255,255,255,0.3); text-transform: uppercase;
          letter-spacing: 1px; font-weight: 600;
        }
        .comp-row {
          display: grid; grid-template-columns: 1fr 90px 90px; gap: 12px;
          padding: 16px 0; border-bottom: 1px solid rgba(255,255,255,0.05);
          align-items: center; min-width: 320px;
        }
        .comp-feature { font-size: 14px; color: rgba(255,255,255,0.65); font-weight: 500; }
        .comp-unis { text-align: center; font-size: 18px; }
        .comp-others { text-align: center; font-size: 13px; color: rgba(255,255,255,0.3); }

        /* ── HOW IT WORKS ── */
        .steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
        .step-number {
          font-size: 44px; font-weight: 900; font-family: 'Outfit', sans-serif;
          color: rgba(255,255,255,0.04); margin-bottom: 14px; line-height: 1;
        }
        .step-title {
          font-size: 18px; font-weight: 700; font-family: 'Outfit', sans-serif;
          margin-bottom: 10px; color: #fff;
        }
        .step-desc { font-size: 14px; line-height: 1.7; color: rgba(255,255,255,0.42); }

        /* ── CTA SECTION ── */
        .cta-row { display: flex; gap: 12px; justify-content: center; align-items: center; flex-wrap: wrap; }
        .email-input {
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 999px; padding: 14px 22px; color: #fff; font-size: 15px;
          font-family: 'DM Sans', sans-serif; outline: none;
          width: 300px; max-width: 100%; transition: border-color 0.3s ease;
        }
        .email-input:focus { border-color: ${UNIS_BLUE_LIGHT}; }
        .email-input::placeholder { color: rgba(255,255,255,0.3); }

        /* ── FOOTER ── */
        .footer {
          border-top: 1px solid rgba(255,255,255,0.05); padding: 36px 24px;
        }
        .footer-inner {
          max-width: 1100px; margin: 0 auto; display: flex;
          justify-content: space-between; align-items: center;
          flex-wrap: wrap; gap: 16px;
        }
        .footer-links { display: flex; gap: 20px; }
        .footer-link { color: rgba(255,255,255,0.3); text-decoration: none; font-size: 13px; }
        .footer-copy { font-size: 12px; color: rgba(255,255,255,0.2); }

        /* ════════════════════════════════════════════
           MOBILE RESPONSIVE — 768px and below
           ════════════════════════════════════════════ */
        @media (max-width: 768px) {
          .section { padding: 64px 20px; }
          .hero .section { padding-top: 110px; padding-bottom: 60px; }

          /* Nav mobile */
          .nav { padding: 12px 16px; }
          .nav-logo { height: 32px; }
          .nav-links { display: none; }
          .nav-links.open {
            display: flex; flex-direction: column; position: absolute;
            top: 100%; left: 0; right: 0; background: rgba(8,9,12,0.97);
            backdrop-filter: blur(20px); padding: 20px 24px; gap: 16px;
            border-bottom: 1px solid rgba(255,255,255,0.06);
          }
          .nav-links.open .nav-link { font-size: 16px; }
          .hamburger { display: block; }

          /* Hero mobile */
          .hero { min-height: auto; min-height: auto; }
          .hero-headline { font-size: clamp(32px, 9vw, 52px); letter-spacing: -1px; }
          .hero-sub { font-size: 15px; margin-bottom: 28px; }
          .hero-buttons { flex-direction: column; align-items: stretch; gap: 12px; }
          .hero-buttons .cta-btn { justify-content: center; text-align: center; }
          .hero-glow { width: 300px; height: 300px; }

          /* Stats mobile */
          .stats-grid { grid-template-columns: repeat(2, 1fr); padding: 20px 16px; gap: 0; }
          .stat-card { padding: 20px 12px; }
          .stat-number { font-size: clamp(28px, 8vw, 44px); }
          .stat-label { font-size: 11px; }

          /* Features mobile */
          .feature-grid { grid-template-columns: 1fr; gap: 14px; margin-top: 40px; }

          /* Section headings mobile */
          .section-heading { font-size: clamp(26px, 7vw, 40px); }
          .section-sub { font-size: 15px; }

          /* Video mobile */
          .play-btn { width: 52px; height: 52px; }
          .video-label { font-size: 10px; bottom: 12px; left: 12px; }

          /* Comparison mobile */
          .comp-container { padding: 20px 16px; border-radius: 14px; }

          /* Steps mobile */
          .steps-grid { grid-template-columns: 1fr; gap: 32px; }

          /* CTA mobile */
          .cta-row { flex-direction: column; gap: 12px; }
          .email-input { width: 100%; }
          .cta-row .cta-btn { width: 100%; justify-content: center; }

          /* Footer mobile */
          .footer-inner { flex-direction: column; text-align: center; gap: 12px; }
          .footer-links { justify-content: center; }
        }

        /* Small phones */
        @media (max-width: 380px) {
          .hero-headline { font-size: 30px; }
          .section { padding: 48px 16px; }
          .nav { padding: 10px 12px; }
          .comp-container { padding: 16px 12px; }
        }
      `}</style>

      <div className="grain" />

      {/* ── NAV ── */}
      <nav
        className="nav"
        style={{
          background: scrollY > 50 ? "rgba(8,9,12,0.88)" : "transparent",
          backdropFilter: scrollY > 50 ? "blur(20px)" : "none",
          borderBottom: scrollY > 50 ? "1px solid rgba(255,255,255,0.05)" : "1px solid transparent",
        }}
      >
        <img src={LOGO_SRC} alt="Unis" className="nav-logo" />

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? "✕" : "☰"}
        </button>

        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <a href="#artists" className="nav-link" onClick={() => setMenuOpen(false)}>Artists</a>
          <a href="#fans" className="nav-link" onClick={() => setMenuOpen(false)}>Fans</a>
          <a href="#early-access" className="nav-cta" onClick={() => setMenuOpen(false)}>Get Early Access</a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-glow" style={{ top: "-200px", left: "-100px", background: UNIS_BLUE }} />
        <div className="hero-glow" style={{ bottom: "-200px", right: "-100px", background: GOLD, opacity: 0.06 }} />

        <div className="section" style={{ width: "100%" }}>
          <Reveal><Pill>Launching 2026</Pill></Reveal>

          <Reveal delay={0.1}>
            <h1 className="hero-headline">
              <span>Your music.</span><br />
              <span>Your masters.</span><br />
              <span className="gold-text">Your money.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="hero-sub">
              The community-powered music platform where artists keep 100% ownership,
              earn 50% of streaming revenue, and fans earn passive income just by listening.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="hero-buttons">
              <a href="#early-access" className="cta-btn cta-primary">
                Join Early Access <span>→</span>
              </a>
              <a href="#artists" className="cta-btn cta-outline">Learn More</a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="section-border">
        <div className="section stats-grid">
          <StatCard number="100%" label="Artist Ownership" delay={0} />
          <StatCard number="50%" label="Revenue Share" delay={0.1} />
          <StatCard number="$0" label="Cost to Join" delay={0.2} />
          <StatCard number="∞" label="Earning Potential" delay={0.3} />
        </div>
      </section>

      {/* ── FOR ARTISTS ── */}
      <section id="artists">
        <div className="section">
          <Reveal><Pill>For Artists</Pill></Reveal>
          <Reveal delay={0.1}>
            <h2 className="section-heading">
              Built for the ones who<br />
              <span style={{ color: GOLD }}>make the music.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="section-sub">
              Every other platform was built to profit off your talent. Unis was built to put
              that profit back in your hands — with complete ownership, fair pay, and a
              community that funds your career directly.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="video-placeholder">
              <div className="play-btn">
                <svg width="22" height="22" fill="#fff" viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21" /></svg>
              </div>
              <div className="video-label">Artist promo video — coming soon</div>
            </div>
          </Reveal>

          <div className="feature-grid">
            <FeatureCard icon="🔐" title="100% Ownership" description="You maintain complete ownership of every track. Download your ownership agreement anytime — for your entire catalog or each individual song. Your masters never leave your hands." delay={0} />
            <FeatureCard icon="💰" title="50% Revenue Share" description="Every stream earns you 50% of net income. Unis handles compulsory licensing payments on your behalf, for free. That's the best deal in the industry — and completely non-restrictive." accent delay={0.1} />
            <FeatureCard icon="🤝" title="Fan-Funded Income" description="Every user must choose an artist to support. When your supporters see or hear ads on Unis, you earn a portion of that revenue — even when they're not playing your music. Passive income, every single day." accent delay={0.15} />
            <FeatureCard icon="📍" title="Hyperlocal Discovery" description="No algorithm lottery. You're surfaced directly to your neighborhood, city, and community. Win real awards — song of the day, artist of the year — determined by the people who actually listen." delay={0.2} />
          </div>
        </div>
      </section>

      {/* ── COMPARISON ── */}
      <section className="section-border">
        <div className="section">
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "52px" }}>
              <Pill>The Difference</Pill>
              <h2 className="section-heading" style={{ marginTop: "18px" }}>
                Unis vs. <span style={{ color: "rgba(255,255,255,0.25)" }}>everything else.</span>
              </h2>
            </div>
          </Reveal>

          <div className="comp-container">
            <div className="comp-header">
              <span className="comp-header-label">Feature</span>
              <span className="comp-header-label" style={{ textAlign: "center", color: GOLD, fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "13px" }}>Unis</span>
              <span className="comp-header-label" style={{ textAlign: "center" }}>Others</span>
            </div>
            <CompRow feature="Artist Ownership" unis="✅" others="❌" delay={0} />
            <CompRow feature="Revenue per Stream" unis="50%" others="$0.003" delay={0.05} />
            <CompRow feature="Fan-Funded Income" unis="✅" others="❌" delay={0.1} />
            <CompRow feature="Local Discovery" unis="✅" others="❌" delay={0.15} />
            <CompRow feature="Community Awards" unis="✅" others="❌" delay={0.2} />
            <CompRow feature="Compulsory Fees Covered" unis="✅" others="❌" delay={0.25} />
            <CompRow feature="Lock-in / Penalties" unis="None" others="Varies" delay={0.3} />
            <CompRow feature="Cost to Artist" unis="Free" others="Varies" delay={0.35} />
          </div>
        </div>
      </section>

      {/* ── FOR FANS ── */}
      <section id="fans" className="section-border" style={{ position: "relative" }}>
        <div className="hero-glow" style={{ top: "100px", right: "-250px", background: UNIS_BLUE, opacity: 0.07 }} />
        <div className="section">
          <Reveal><Pill>For Fans</Pill></Reveal>
          <Reveal delay={0.1}>
            <h2 className="section-heading">
              Discover. Vote.<br />
              <span style={{ color: GOLD }}>Get paid.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="section-sub">
              Unis shows you what's actually fire in your neighborhood — not what a label
              paid to promote. Vote for the music you love, support artists directly, and earn
              passive income through referrals. No other app pays you for listening.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="video-placeholder">
              <div className="play-btn">
                <svg width="22" height="22" fill="#fff" viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21" /></svg>
              </div>
              <div className="video-label">Fan promo video — coming soon</div>
            </div>
          </Reveal>

          <div className="feature-grid">
            <FeatureCard icon="🎵" title="Discover Local Heat" description="See what's trending in your actual neighborhood. From Harlem to Brooklyn, every jurisdiction has its own leaderboard. Real music from real people around you." delay={0} />
            <FeatureCard icon="🗳️" title="You Decide Who Wins" description="Vote for song of the day, artist of the week, all the way up to artist of the year. No gatekeepers, no backroom deals. The community holds the keys." delay={0.1} />
            <FeatureCard icon="💸" title="Earn While You Listen" description="Unis splits ad revenue with its users. Refer friends and earn passive income whenever they use the app. 100 referrals means 100 people generating income for you, forever." accent delay={0.15} />
            <FeatureCard icon="🫶" title="Support Artists Directly" description="Choose an artist to support — your activity on the platform generates real income for them. Change artists anytime. Hold them accountable. We keep each other strong." delay={0.2} />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section-border">
        <div className="section">
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "56px" }}>
              <Pill>How It Works</Pill>
              <h2 className="section-heading" style={{ marginTop: "18px" }}>Simple by design.</h2>
            </div>
          </Reveal>

          <div className="steps-grid">
            {[
              { step: "01", title: "Join with a referral", desc: "Get invited by someone in the community. Select an artist to support. That's your entry into Unis." },
              { step: "02", title: "Discover & engage", desc: "Browse music by neighborhood. Play, like, vote. Every interaction shapes who rises and who wins awards." },
              { step: "03", title: "Everyone earns", desc: "Artists earn from streams, supporters, and referrals. Fans earn from their referral network. The community funds itself." },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div>
                  <div className="step-number">{item.step}</div>
                  <h3 className="step-title">{item.title}</h3>
                  <p className="step-desc">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section id="early-access" className="section-border" style={{ position: "relative" }}>
        <div className="hero-glow" style={{ bottom: "-200px", left: "50%", marginLeft: "-250px", background: UNIS_BLUE, opacity: 0.1 }} />
        <div className="section" style={{ textAlign: "center", paddingTop: "100px", paddingBottom: "100px" }}>
          <Reveal>
            <img src={LOGO_SRC} alt="Unis" style={{ height: "64px", width: "auto", margin: "0 auto 28px" }} />
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="section-heading" style={{ fontSize: "clamp(28px, 5vw, 52px)" }}>
              The future of music<br />starts in your neighborhood.
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.42)", maxWidth: "460px", margin: "0 auto 36px", lineHeight: 1.7 }}>
              Get early access. Whether you make music or love it, Unis was built for you.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="cta-row">
              <input
                className="email-input"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
              />
              <button className="cta-btn cta-primary" onClick={handleSubmit}>
                {submitted ? "You're in! ✓" : "Get Early Access"}
              </button>
            </div>
          </Reveal>
          {submitted && (
            <p style={{ marginTop: "14px", color: GOLD, fontSize: "14px", fontWeight: 500 }}>
              Welcome to Unis. We'll be in touch soon.
            </p>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-inner">
          <img src={LOGO_SRC} alt="Unis" style={{ height: "30px", width: "auto" }} />
          <p className="footer-copy">© 2026 Unis. Your music. Your masters. Your money.</p>
          <div className="footer-links">
            <a href="#" className="footer-link">Terms</a>
            <a href="#" className="footer-link">Privacy</a>
            <a href="#" className="footer-link">Contact</a>
          </div>
        </div>
      </footer>
    </>
  );
}