import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css"; // Newly added premium design styles

export default function Home() {
  const navigate = useNavigate();
  // Using try-catch to safely parse the user from local storage
  let user = null;
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      user = JSON.parse(userStr);
    }
  } catch (error) {
    console.error("Failed to parse user from local storage.");
  }

  // If already logged in → go to dashboard
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate, user]);

  return (
    <div className="home-container animate-fade-in">
      {/* Navigation */}
      <nav className="home-nav glass-nav">
        <div className="home-logo">AlumniConnect</div>
        <div className="home-nav-links">
          <button className="btn-nav hover-card-effect" onClick={() => navigate("/login")}>
            Login
          </button>
          <button
            className="btn-nav btn-nav-primary hover-card-effect"
            onClick={() => navigate("/register")}
          >
            Sign Up
          </button>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="home-hero animate-slide-up delay-100">
          <div className="hero-badge transition-all hover-card-effect">Next-Gen Investment Network</div>
          <h1 className="hero-title">
            Where Student Innovation
            <br />
            Meets Alumni Capital
          </h1>
          <p className="hero-subtitle">
            A premium platform accelerating the growth of student startups. Connect with alumni investors, raise capital, and scale your ideas into industry-leading companies.
          </p>
          <div className="hero-actions">
            <button className="btn-primary hover-card-effect transition-all" onClick={() => navigate("/register")}>
              Start Building
            </button>
            <button className="btn-secondary hover-card-effect transition-all" onClick={() => navigate("/login")}>
              Explore Projects
            </button>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="home-section animate-slide-up delay-200">
          <div className="section-head">
            <h2 className="section-title">How it works</h2>
            <p className="section-desc">
              A streamlined workflow from bold idea to successful exit, designed for the modern campus ecosystem.
            </p>
          </div>

          <div className="how-it-works-grid">
            <div className="feature-card hover-card-effect transition-all">
              <div className="feature-icon">🎓</div>
              <h3 className="feature-title">1. Build & Launch</h3>
              <p className="feature-desc">
                Students create profiles for their startup projects, detailing their vision, market opportunity, and funding needs.
              </p>
            </div>

            <div className="feature-card hover-card-effect transition-all">
              <div className="feature-icon">🤝</div>
              <h3 className="feature-title">2. Connect & Capital</h3>
              <p className="feature-desc">
                Alumni discover promising ventures, conduct due diligence, and provide strategic capital and mentorship.
              </p>
            </div>

            <div className="feature-card hover-card-effect transition-all">
              <div className="feature-icon">📈</div>
              <h3 className="feature-title">3. Grow & Exit</h3>
              <p className="feature-desc">
                Projects leverage the alumni network to accelerate growth, hit milestones, and achieve successful valuations.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Projects Preview Section */}
        <section className="home-section animate-slide-up delay-300">
          <div className="section-head">
            <h2 className="section-title">Featured Ventures</h2>
            <p className="section-desc">
              Discover the next breakout startups founded by our brightest students.
            </p>
          </div>

          <div className="featured-grid">
            {/* Project Card 1 */}
            <div className="project-card hover-card-effect transition-all">
              <div className="project-image">🤖</div>
              <div className="project-content">
                <div className="project-category">Artificial Intelligence</div>
                <h3 className="project-title">NexusAI</h3>
                <p className="project-desc">
                  Autonomous workflow automation for remote enterprise teams leveraging machine learning.
                </p>
                <div className="project-footer">
                  <div className="project-stat">
                    $45k <span>Raised</span>
                  </div>
                  <div className="project-stat" style={{ textAlign: "right" }}>
                    7 <span>Investors</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Card 2 */}
            <div className="project-card hover-card-effect transition-all">
              <div className="project-image">🌱</div>
              <div className="project-content">
                <div className="project-category">Climate Tech</div>
                <h3 className="project-title">Verdant Energy</h3>
                <p className="project-desc">
                  Next-generation portable solar panels with integrated high-density solid-state batteries.
                </p>
                <div className="project-footer">
                  <div className="project-stat">
                    $120k <span>Raised</span>
                  </div>
                  <div className="project-stat" style={{ textAlign: "right" }}>
                    14 <span>Investors</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Card 3 */}
            <div className="project-card hover-card-effect transition-all">
              <div className="project-image">📱</div>
              <div className="project-content">
                <div className="project-category">Consumer Social</div>
                <h3 className="project-title">VibeCheck</h3>
                <p className="project-desc">
                  Location-based social discovery app focused on spontaneous, interest-aligned meetups.
                </p>
                <div className="project-footer">
                  <div className="project-stat">
                    $15k <span>Raised</span>
                  </div>
                  <div className="project-stat" style={{ textAlign: "right" }}>
                    3 <span>Investors</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Minimal Footer */}
      <footer className="home-footer">
        <p className="footer-text">
          © {new Date().getFullYear()} AlumniConnect. Empowering the next generation of founders.
        </p>
      </footer>
    </div>
  );
}
