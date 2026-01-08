import { useState, useEffect, useCallback, useRef, memo } from 'react'
import { Link } from 'react-router-dom'
import './CarAccordion.css'

const cars = [
  {
    id: 'baleno',
    name: 'Maruti Baleno',
    label: 'Baleno',
    image: '/cars/baleno.png',
    price: '₹1799',
    seats: '5 Seater',
    fuel: 'Petrol'
  },
  {
    id: 'magnite',
    name: 'Nissan Magnite (White Edition)',
    label: 'Magnite (White)',
    image: '/cars/magnite.png',
    price: '₹2199',
    seats: '5 Seater',
    fuel: 'Petrol'
  },
  {
    id: 'magniteblack',
    name: 'Nissan Magnite (Black Edition)',
    label: 'Magnite (Black)',
    image: '/cars/magniteblack.png',
    price: '₹2199',
    seats: '5 Seater',
    fuel: 'Petrol'
  },
  {
    id: 'dzire',
    name: 'Maruti Dzire',
    label: 'Dzire',
    image: '/cars/dzire.png',
    price: '₹2199',
    seats: '5 Seater',
    fuel: 'Petrol'
  },
  {
    id: 'ertiga',
    name: 'Maruti Ertiga',
    label: 'Ertiga',
    image: '/cars/ertiga.png',
    price: '₹2199',
    seats: '7 Seater',
    fuel: 'Petrol'
  },
  {
    id: 'kiger',
    name: 'Renault Kiger',
    label: 'Kiger',
    image: '/cars/kiger.png',
    price: '₹2199',
    seats: '5 Seater',
    fuel: 'Petrol'
  },
  {
    id: 'triber',
    name: 'Renault Triber',
    label: 'Triber',
    image: '/cars/triber.png',
    price: '₹2999',
    seats: '7 Seater',
    fuel: 'Petrol'
  },
  {
    id: 'thar',
    name: 'Mahindra Thar',
    label: 'Thar',
    image: '/cars/thar.png',
    price: '₹3499',
    seats: '4 Seater',
    fuel: 'Petrol'
  }
]

export default function CarAccordion({ onNavigate }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const isAutoPlayingRef = useRef(true)
  const autoPlayTimerRef = useRef(null)

  const startAutoPlay = useCallback(() => {
    if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current)
    isAutoPlayingRef.current = true
    autoPlayTimerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % cars.length)
    }, 4000)
  }, [])

  const stopAutoPlay = useCallback(() => {
    isAutoPlayingRef.current = false
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current)
      autoPlayTimerRef.current = null
    }
  }, [])

  const setActiveSlide = useCallback((index) => {
    setActiveIndex(index)
    stopAutoPlay()
  }, [stopAutoPlay])

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % cars.length)
  }, [])

  const previousSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + cars.length) % cars.length)
    stopAutoPlay()
  }, [stopAutoPlay])

  // Start auto-play on mount
  useEffect(() => {
    startAutoPlay()
    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current)
    }
  }, [startAutoPlay])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') previousSlide()
      if (e.key === 'ArrowRight') {
        nextSlide()
        stopAutoPlay()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [nextSlide, previousSlide, stopAutoPlay])

  return (
    <section className="car-accordion-section">
      <div className="accordion-header">
        <p className="accordion-tagline">OUR FLEET</p>
        <h2 className="accordion-title">
          Explore Our <span className="accordion-title-accent">Cars</span>
        </h2>
        <p className="accordion-subtitle">
          Choose from our carefully curated selection of premium vehicles for your perfect journey.
        </p>
        <button className="fleet-detailed-cta" onClick={onNavigate}>
          View Detailed Fleet
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>

      <div className="accordion-container">
        <div className="accordion-slider">
          {cars.map((car, index) => (
            <div
              key={car.id}
              className={`slide ${activeIndex === index ? 'active' : ''}`}
              onClick={() => setActiveSlide(index)}
            >
              <div className="slide-bg">
                <img src={car.image} alt={car.name} />
              </div>
              <div className="slide-content">
                <span className="slide-number">0{index + 1}</span>
                <h3 className="slide-title">{car.name}</h3>
                <div className="slide-details">
                  <span className="slide-price">{car.price}<small>/day</small></span>
                  <span className="slide-seats">{car.seats}</span>
                  <span className="slide-fuel">{car.fuel}</span>
                </div>
                <a href="tel:9043797966" className="slide-cta">
                  Book Now
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </a>
              </div>
              <div className="slide-label">
                <span>{car.label || car.name.split(' ')[1] || car.name.split(' ')[0]}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="accordion-nav">
          <button className="nav-prev" onClick={previousSlide} aria-label="Previous slide">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <button className="nav-next" onClick={nextSlide} aria-label="Next slide">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
