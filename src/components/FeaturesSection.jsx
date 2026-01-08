import './FeaturesSection.css'

/* ============================
   FEATURE ICONS (SVG)
   ============================ */
const FeatureIcons = {
  speed: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  fuel: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 22V6a2 2 0 012-2h8a2 2 0 012 2v16M3 22h12M15 22v-4a2 2 0 012-2h1a2 2 0 012 2v1M7 10h4M21 10l-3-3v6"/>
    </svg>
  ),
  safety: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2l8 4v6c0 5.25-3.5 9.5-8 11-4.5-1.5-8-5.75-8-11V6l8-4z"/>
      <path d="M9 12l2 2 4-4"/>
    </svg>
  ),
  comfort: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16M3 21h18M9 7h6M9 11h6M9 15h4"/>
    </svg>
  ),
  tech: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="3" width="20" height="14" rx="2"/>
      <path d="M8 21h8M12 17v4"/>
    </svg>
  ),
  service: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  ),
}

const featuresLeft = [
  { icon: 'speed', title: 'High Performance', desc: '0-100 in 8.5 seconds' },
  { icon: 'fuel', title: 'Fuel Efficient', desc: '18 km/l mileage' },
  { icon: 'safety', title: 'Advanced Safety', desc: '5-star NCAP rating' },
]

const featuresRight = [
  { icon: 'comfort', title: 'Premium Comfort', desc: 'Leather interiors' },
  { icon: 'tech', title: 'Smart Tech', desc: 'Connected car features' },
  { icon: 'service', title: '24/7 Support', desc: 'Roadside assistance' },
]

/* ============================
   SIMPLE FEATURES SECTION - No GSAP
   ============================ */
export default function FeaturesSection() {
  return (
    <section className="features-section" id="features">
      <div className="features-header">
        <span className="features-tagline">WHY CHOOSE US</span>
        <h2 className="features-title">Premium Features</h2>
      </div>

      <div className="features-left">
        {featuresLeft.map((feature) => (
          <div key={feature.title} className="feature-item">
            <div className="feature-icon">
              {FeatureIcons[feature.icon]}
            </div>
            <div className="feature-text">
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="features-right">
        {featuresRight.map((feature) => (
          <div key={feature.title} className="feature-item">
            <div className="feature-icon">
              {FeatureIcons[feature.icon]}
            </div>
            <div className="feature-text">
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
