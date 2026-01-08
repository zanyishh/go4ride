import './Footer.css'

export default function Footer() {
  return (
    <footer className="premium-footer">
      {/* Top Section - Deep Red */}
      <div className="footer-top">
        <div className="footer-top-divider"></div>
        <div className="footer-top-content">
          <div className="footer-stat">
            <span className="stat-label">YEAR FOUNDED</span>
            <span className="stat-value">2025</span>
          </div>
          <div className="footer-stat">
            <span className="stat-label">LOCATION</span>
            <span className="stat-value">Nallur, Tiruppur</span>
          </div>
        </div>
      </div>

      {/* Bottom Section - Dark */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          {/* Column 1 - Get in touch */}
          <div className="footer-column">
            <h4 className="footer-column-title">Get in touch</h4>
            <a href="mailto:business@go4ride.com" className="footer-email">
              business@go4ride.com
            </a>
            <a href="tel:9043797966" className="footer-phone">
              +91 90437 97966
            </a>
            <a href="tel:8124189991" className="footer-phone">
              +91 81241 89991
            </a>
          </div>

          {/* Column 2 - Connect */}
          <div className="footer-column">
            <h4 className="footer-column-title">Connect</h4>
            <a 
              href="https://www.instagram.com/go4ride__?igsh=MXJpOXppZXc2bnp3eQ==" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-social-link"
            >
              Instagram
            </a>
          </div>

          {/* Column 3 - Safety Quote */}
          <div className="footer-column footer-quote-column">
            <p className="footer-quote">
              "Drive responsibly. Every journey matters."
            </p>
          </div>

          {/* Column 4 - CTA */}
          <div className="footer-column footer-cta-column">
            <a href="tel:9043797966" className="footer-cta-btn">
              Contact Us →
            </a>
          </div>
        </div>

        {/* Footer Credits */}
        <div className="footer-credits">
          <div className="footer-credits-row">
            <span className="footer-developer">
              Website developed by <strong>Toman Technologies Pvt Ltd</strong>
            </span>
          </div>
          <div className="footer-credits-row footer-attribution">
            <p>
              "MAHINDRA THAR 4X4" (<a href="https://skfb.ly/op9DI" target="_blank" rel="noopener noreferrer">https://skfb.ly/op9DI</a>) by NEYCER<br />
              Licensed under Creative Commons Attribution 4.0<br />
              <a href="http://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">http://creativecommons.org/licenses/by/4.0/</a>
            </p>
          </div>
          <div className="footer-credits-row">
            <span className="footer-copyright">
              Copyright © 2026 Go4Ride. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
