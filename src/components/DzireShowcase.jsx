import './DzireShowcase.css'

export default function DzireShowcase() {
  return (
    <section className="dzire-showcase" id="dzire">
      {/* Oversized Background Text - Repeated */}
      <div className="bg-text" aria-hidden="true"></div>
      
      {/* Main Content Container */}
      <div className="showcase-container">

        {/* Center Car Image */}
        <div className="car-showcase">
          <img 
            src="/cars/dzire.png" 
            alt="Suzuki Dzire" 
            className="dzire-image"
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
        <h2 className="model-name">SUZUKI DZIRE</h2>
        <span className="model-variant">PETROL</span>
      </div>
    </section>
  )
}
