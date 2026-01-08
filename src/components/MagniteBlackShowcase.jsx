import './MagniteBlackShowcase.css'

export default function MagniteBlackShowcase() {
  return (
    <section className="magniteblack-showcase" id="magniteblack">
      {/* Oversized Background Text - Repeated */}
      <div className="bg-text" aria-hidden="true"></div>
      
      {/* Main Content Container */}
      <div className="showcase-container">

        {/* Center Car Image */}
        <div className="car-showcase">
          <img 
            src="/cars/magniteblack.png" 
            alt="Nissan Magnite Black" 
            className="magniteblack-image"
          />
          <div className="car-shadow"></div>

        </div>

        {/* Price CTA - Bottom */}
        <aside className="price-column">
          <a href="tel:9043797966" className="price-btn">
            <span className="price-amount">₹2199</span>
            <span className="price-period">/day</span>
            <svg className="price-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </aside>
      </div>

      {/* Section Title - Model Name */}
      <div className="section-header">
        <h2 className="model-name">NISSAN MAGNITE</h2>
        <span className="model-variant">BLACK EDITION (PETROL)</span>
      </div>
    </section>
  )
}
