import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Landing.css";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">

      {/* ================= HEADER ================= */}
      <header className="landing-header">
  <img src={logo} alt="DocuVault AI" className="landing-logo" />
  <nav className="landing-nav">
    <a href="#features">Features</a>
    <a href="#how-it-works">How it works</a>
  </nav>
</header>


      {/* ================= HERO ================= */}
      <section className="landing-hero">

        <h1>
          Ask your documents anything.
        </h1>

        <p className="landing-subhead">
          Upload your company's files and get instant, accurate answers —
          grounded in your own data, with sources cited every time.
        </p>


        {/* ================= ACTION BUTTONS ================= */}
        <div className="landing-hero-actions">

          <button
            className="btn-primary btn-large"
            onClick={() => navigate("/signup")}
          >
            Get Started
          </button>

          <button
            className="btn-ghost btn-large"
            onClick={() => navigate("/login")}
          >
            Log In
          </button>

        </div>


        {/* ================= DEMO CHAT ================= */}
        <div className="hero-mockup">

          {/* Demo Chat Header */}
          <div className="demo-chat-header">

            <div className="demo-chat-badge">

              {/* Chat Icon */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 11.5C20 15.6421 16.4183 19 12 19C10.6805 19 9.43855 18.696 8.34698 18.1588L4 20L5.42452 16.2075C4.52331 14.8995 4 13.2706 4 11.5C4 7.35786 7.58172 4 12 4C16.4183 4 20 7.35786 20 11.5Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 11.5H9.01M12 11.5H12.01M15 11.5H15.01"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>

              <span>Demo Chat</span>

            </div>


            {/* Sparkle */}
            <div className="demo-sparkle">
              ✦
            </div>

          </div>


          {/* ================= USER MESSAGE ================= */}
          <div className="demo-message-row">

            <div className="demo-avatar user-avatar">

              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="8"
                  r="3.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />

                <path
                  d="M5 20C5.8 16.7 8.1 15 12 15C15.9 15 18.2 16.7 19 20"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>

            </div>


            <div className="demo-bubble user-bubble">

              <span className="mockup-label">
                You
              </span>

              <p>
                How many vacation days do new employees get?
              </p>

              <span className="demo-time">
                10:30 AM
              </span>

            </div>

          </div>


          {/* ================= AI MESSAGE ================= */}
          <div className="demo-message-row">

            <div className="demo-avatar ai-avatar">

              <svg
                width="23"
                height="23"
                viewBox="0 0 24 24"
                fill="none"
              >
                <rect
                  x="5"
                  y="7"
                  width="14"
                  height="12"
                  rx="3"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />

                <path
                  d="M12 4V7"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />

                <circle
                  cx="9"
                  cy="12"
                  r="1"
                  fill="currentColor"
                />

                <circle
                  cx="15"
                  cy="12"
                  r="1"
                  fill="currentColor"
                />

                <path
                  d="M9 15C10.5 16 13.5 16 15 15"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>

            </div>


            <div className="demo-bubble ai-bubble">

              <span className="mockup-label">
                DocuVault AI
              </span>

              <p>
                New employees accrue 15 vacation days in their first
                year, increasing to 20 after two years of service.
              </p>

              {/* Citation */}
              <div className="mockup-citation">

                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M6 3H14L18 7V21H6V3Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M14 3V8H18"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinejoin="round"
                  />
                </svg>

                <span>
                  Cited from:
                  <strong> employee-handbook.pdf</strong>
                </span>

              </div>

              <span className="demo-time">
                10:30 AM
              </span>

            </div>

          </div>


          {/* ================= DEMO FOOTER ================= */}
          <div className="demo-chat-footer">

            <span className="footer-sparkle">
              ✦
            </span>

            <span>
              This is a demo of DocuVault AI in action.
            </span>

          </div>

        </div>

      </section>


      {/* ================= FEATURES ================= */}
      <section className="landing-features" id="features">

        <div className="feature">
  <span className="feature-badge">S</span>
  <h3>Isolated by design</h3>

          <p>
            Every company's documents live in their own secure space —
            never mixed, never visible to anyone else.
          </p>
        </div>


        <div className="feature">
          <span className="feature-badge">F</span>
          <h3>Any file, any format</h3>

          <p>
            PDFs, Word documents, plain text, or a link to a webpage —
            upload it, and it's ready to query in seconds.
          </p>
        </div>


        <div className="feature">
          <span className="feature-badge">G</span>
          <h3>Answers you can verify</h3>

          <p>
            Every response points back to the exact document it came
            from, so you can trust — and check — what you're told.
          </p>
        </div>


        <div className="feature">
          <span className="feature-badge">A</span>
          <h3>Built for developers</h3>

          <p>
            Generate an API key and call DocuVault AI directly from
            your own product or scripts, no dashboard required.
          </p>
        </div>

      </section>

      <section className="how-it-works" id="how-it-works">
  <h2>How it works</h2>
  <div className="steps">
    <div className="step">
      <span className="step-number">1</span>
      <h3>Upload</h3>
      <p>Add a file or paste a link</p>
    </div>
    <div className="step-arrow">→</div>
    <div className="step">
      <span className="step-number">2</span>
      <h3>Process</h3>
      <p>Chunked and embedded automatically</p>
    </div>
    <div className="step-arrow">→</div>
    <div className="step">
      <span className="step-number">3</span>
      <h3>Ask</h3>
      <p>Type a question in plain language</p>
    </div>
    <div className="step-arrow">→</div>
    <div className="step">
      <span className="step-number">4</span>
      <h3>Answer</h3>
      <p>Grounded, with sources cited</p>
    </div>
  </div>
</section>

<section className="final-cta">
  <h2>Ready to talk to your documents?</h2>
  <button className="btn-primary btn-large" onClick={() => navigate("/signup")}>
    Get Started
  </button>
</section>

      {/* ================= FOOTER ================= */}
      <footer className="landing-footer">
        <p>DocuVault AI</p>
      </footer>

    </div>
  );
}

export default Landing;