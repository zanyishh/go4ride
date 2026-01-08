import { useState, useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import CarScene from './components/CarScene'
import Footer from './components/Footer'
import CarAccordion from './components/CarAccordion'
import PageTransition from './components/PageTransition'
import './App.css'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const scrollProgress = useRef(0)
  const rafId = useRef(null)

  const handleAnimationComplete = () => {
    setIsLoading(false)
  }

  // Native scroll handler for camera animation - uses requestAnimationFrame for smooth updates
  useEffect(() => {
    if (isLoading) return

    const handleScroll = () => {
      // Cancel any pending animation frame
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }

      rafId.current = requestAnimationFrame(() => {
        const scrollTop = window.scrollY
        const windowHeight = window.innerHeight
        const isMobile = window.innerWidth <= 768
        
        // Mobile: moderate scroll progression - complete animation over merged section
        const scrollMultiplier = isMobile ? 0.8 : 0.5
        
        // Progress from 0 to 1 over the merged section (200vh)
        const progress = Math.min((scrollTop / windowHeight) * scrollMultiplier, 1)
        scrollProgress.current = progress
        
        if (isMobile) {
          // Mobile: Line by line disappear animation with upward movement
          // Tagline: starts fading at 0%, gone by 15% scroll
          const taglineProgress = Math.min(scrollTop / (windowHeight * 0.15), 1)
          const taglineOpacity = Math.max(1 - taglineProgress, 0)
          const taglineY = taglineProgress * -40 // moves up 40px (negative = up)
          document.documentElement.style.setProperty('--hero-tagline-opacity', taglineOpacity)
          document.documentElement.style.setProperty('--hero-tagline-y', `${taglineY}px`)
          
          // Title: starts fading at 10%, gone by 25% scroll
          const titleStart = windowHeight * 0.10
          const titleProgress = Math.min(Math.max((scrollTop - titleStart) / (windowHeight * 0.15), 0), 1)
          const titleOpacity = Math.max(1 - titleProgress, 0)
          const titleY = titleProgress * -40 // moves up 40px
          document.documentElement.style.setProperty('--hero-title-opacity', titleOpacity)
          document.documentElement.style.setProperty('--hero-title-y', `${titleY}px`)
          
          // Description: starts fading at 20%, gone by 35% scroll
          const descStart = windowHeight * 0.20
          const descProgress = Math.min(Math.max((scrollTop - descStart) / (windowHeight * 0.15), 0), 1)
          const descOpacity = Math.max(1 - descProgress, 0)
          const descY = descProgress * -40 // moves up 40px
          document.documentElement.style.setProperty('--hero-desc-opacity', descOpacity)
          document.documentElement.style.setProperty('--hero-desc-y', `${descY}px`)
          
          // About section fades in as hero fades out, then fades out
          // Appears from 25% scroll, fully visible at 40%, starts fading at 55%, gone by 70%
          const aboutFadeIn = Math.min(Math.max((scrollTop - windowHeight * 0.25) / (windowHeight * 0.15), 0), 1)
          const aboutFadeOut = Math.min(Math.max((scrollTop - windowHeight * 0.55) / (windowHeight * 0.15), 0), 1)
          const aboutOpacity = aboutFadeIn * (1 - aboutFadeOut)
          document.documentElement.style.setProperty('--about-opacity', aboutOpacity)
        } else {
          // Desktop: Original behavior
          const fadeMultiplier = 0.4
          const heroFadeProgress = Math.min(scrollTop / (windowHeight * fadeMultiplier), 1)
          document.documentElement.style.setProperty('--hero-opacity', 1 - heroFadeProgress)
          
          // Add class to hide hero content completely when scrolled
          const heroOverlay = document.querySelector('.hero-overlay')
          if (heroOverlay) {
            if (heroFadeProgress > 0.1) {
              heroOverlay.classList.add('scrolled-hidden')
            } else {
              heroOverlay.classList.remove('scrolled-hidden')
            }
          }
        }
      })
    }

    // Initial call to set values
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
    }
  }, [isLoading])

  return (
    <div className="app-scroll-wrapper">
      {/* Loading Overlay */}
      <div className={`loading-overlay ${!isLoading ? 'hidden' : ''}`}>
        <div className="loader">
          <div className="loader-ring"></div>
          <span className="loader-text">Loading</span>
        </div>
      </div>

      {/* Header / Navbar - Fixed, only BOOK NOW follows */}
      <header className="navbar">
        <nav className="nav-left">
          <Link to="/" className="nav-link">HOME</Link>
          <button className="nav-link" onClick={() => setIsTransitioning(true)}>CARS</button>
        </nav>
        
        <div className="logo">
          <span className="logo-text">GO4RIDE</span>
        </div>
        
        <nav className="nav-right">
          <a href="tel:9043797966" className="btn-book">BOOK NOW</a>
        </nav>
      </header>

      {/* 3D Car Scene - Fixed background that animates with scroll */}
      <div className="scene-wrapper-fixed">
        <CarScene 
          onAnimationComplete={handleAnimationComplete} 
          scrollProgress={scrollProgress}
        />
      </div>

      {/* Merged Hero + About Section */}
      <section className="hero-about-section" id="hero">
        {/* Hero Content - Left side, fades out on scroll */}
        <main className="hero-overlay hero-fade">
          <div className="hero-content">
            <p className="hero-tagline hero-tagline-underline">WELCOME TO GO4RIDE</p>
            <h1 className="hero-title">
              Premium <span className="hero-title-red">Car</span><br />
              <span className="hero-title-accent">Rental Service</span>
            </h1>
            <p className="hero-description">
              Drive the latest cars at the best prices. All-new, well-maintained 
              vehicles with flexible rental plans, instant booking, and zero hidden charges.
            </p>
          </div>
        </main>

        {/* About Content - Left side, fades in on scroll (Desktop only) */}
        <div className="about-content-side about-scroll-fade">
          <p className="about-tagline">WHO WE ARE</p>
          <h2 className="about-title">About <span className="about-title-accent">Us</span></h2>
          <p className="about-description">
            Go4Ride is a modern car rental platform designed for people who value comfort, convenience, and control. We make renting a car simple—whether it's for a city commute, a weekend getaway, or a long road trip.
          </p>
          <p className="about-description">
            With a carefully selected fleet, transparent pricing, and a seamless booking experience, Go4Ride ensures every journey starts smoothly and ends with satisfaction.
          </p>
          <p className="about-motto">
            Drive with confidence. Drive with Go4Ride.
          </p>
        </div>

        {/* Bottom Gradient */}
        <div className="bottom-gradient hero-fade"></div>
      </section>

      {/* Section 3: What We Focus On */}
      <section className="focus-section" id="focus">
        <div className="focus-container">
          <div className="focus-header">
            <h2 className="focus-title">What We <span className="focus-title-accent">Focus</span> On</h2>
            <p className="focus-subtitle">
              More than just car rentals, we focus on delivering a reliable, comfortable, and seamless mobility experience for every customer.
            </p>
          </div>

          <div className="focus-items">
            <div className="focus-item">
              <h3 className="focus-item-title">24/7 Customer Support</h3>
              <p className="focus-item-description">
                Always-on assistance to ensure a smooth and worry-free rental experience at any time.
              </p>
            </div>

            <div className="focus-item focus-item-featured">
              <h3 className="focus-item-title">Clean & Hygienic Vehicles</h3>
              <p className="focus-item-description">
                Every vehicle is thoroughly cleaned and sanitized before each ride for your safety and comfort.
              </p>
            </div>

            <div className="focus-item">
              <h3 className="focus-item-title">Well-Maintained Cars</h3>
              <p className="focus-item-description">
                Regular inspections and servicing to ensure top performance and reliability.
              </p>
            </div>

            <div className="focus-item">
              <h3 className="focus-item-title">Transparent Pricing</h3>
              <p className="focus-item-description">
                Clear pricing with no hidden charges, so you always know what you're paying for.
              </p>
            </div>

            <div className="focus-item">
              <h3 className="focus-item-title">Flexible Pickup & Drop</h3>
              <p className="focus-item-description">
                Convenient pickup and drop-off options designed around your schedule.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Car Accordion Section */}
      <CarAccordion onNavigate={() => setIsTransitioning(true)} />

      {/* Footer */}
      <Footer />

      {/* Explore Cars Button - Fixed at bottom, always visible */}
      <button 
        className="explore-btn-fixed"
        onClick={() => setIsTransitioning(true)}
      >
        Explore Cars
        <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </button>

      {/* Page Transition */}
      <PageTransition 
        isActive={isTransitioning} 
        targetPath="/cars"
        onComplete={() => setIsTransitioning(false)}
      />
    </div>
  )
}

export default App
