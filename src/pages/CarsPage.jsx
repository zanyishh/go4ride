import { Link } from 'react-router-dom'
import { useState, useEffect, useRef, useCallback } from 'react'
import MagniteShowcase from '../components/MagniteShowcase'
import MagniteBlackShowcase from '../components/MagniteBlackShowcase'
import DzireShowcase from '../components/DzireShowcase'
import BalenoShowcase from '../components/BalenoShowcase'
import ErtigaShowcase from '../components/ErtigaShowcase'
import KigerShowcase from '../components/KigerShowcase'
import TriberShowcase from '../components/TriberShowcase'
import TharShowcase from '../components/TharShowcase'
import PageTransition from '../components/PageTransition'
import './CarsPage.css'

export default function CarsPage() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const containerRef = useRef(null)
  const currentSlideRef = useRef(0)

  // Keep ref in sync with state
  useEffect(() => {
    currentSlideRef.current = currentSlide
  }, [currentSlide])

  const carsBySeats = {
    4: ['thar'],
    5: ['baleno', 'magnite', 'magniteblack', 'dzire', 'kiger'],
    7: ['ertiga', 'triber']
  }

  const shouldShowCar = (carName) => {
    if (activeFilter === 'all') return true
    const seaterType = parseInt(activeFilter)
    return carsBySeats[seaterType].includes(carName)
  }

  // Get visible cars based on filter
  const getVisibleCars = useCallback(() => {
    const allCars = ['baleno', 'magnite', 'magniteblack', 'dzire', 'ertiga', 'kiger', 'triber', 'thar']
    return allCars.filter(car => shouldShowCar(car))
  }, [activeFilter])

  const visibleCars = getVisibleCars()
  const totalSlides = visibleCars.length // Cars only

  // Parallax scroll handler
  useEffect(() => {
    // Disable parallax for 4 seater (only 1 car)
    if (totalSlides <= 1) return

    const scrollSensitivity = 30
    const slideDuration = 600
    let ticking = false
    let isAtFooter = false

    const handleWheel = (evt) => {
      let delta
      const isFirefox = /Firefox/i.test(navigator.userAgent)
      
      if (isFirefox) {
        delta = evt.detail * (-120)
      } else {
        delta = evt.wheelDelta || -evt.deltaY * 40
      }

      const pageScrollTop = window.scrollY || document.documentElement.scrollTop

      // Check if we're viewing the footer (page scrolled down)
      if (pageScrollTop > 50) {
        isAtFooter = true
      }

      // If at footer and scrolling up, go back to parallax
      if (isAtFooter && delta >= scrollSensitivity) {
        evt.preventDefault()
        isAtFooter = false
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }

      // If at footer, allow normal scroll behavior within footer
      if (isAtFooter) {
        return
      }

      // Not at footer - we're in parallax mode
      // Only allow scroll to footer on LAST slide and scrolling DOWN
      if (currentSlideRef.current >= totalSlides - 1 && delta <= -scrollSensitivity) {
        // Allow scroll to footer
        isAtFooter = true
        return
      }

      // Prevent all page scroll during parallax
      evt.preventDefault()

      if (!ticking) {
        if (delta <= -scrollSensitivity) {
          // Down scroll - next slide
          ticking = true
          setCurrentSlide(prev => Math.min(prev + 1, totalSlides - 1))
          setTimeout(() => { ticking = false }, slideDuration)
        }
        if (delta >= scrollSensitivity) {
          // Up scroll - previous slide
          ticking = true
          setCurrentSlide(prev => Math.max(prev - 1, 0))
          setTimeout(() => { ticking = false }, slideDuration)
        }
      }
    }

    const isFirefox = /Firefox/i.test(navigator.userAgent)
    const mousewheelEvent = isFirefox ? 'DOMMouseScroll' : 'wheel'
    
    window.addEventListener(mousewheelEvent, handleWheel, { passive: false })

    // Touch handling for mobile
    let touchStartY = 0
    let touchEndY = 0
    const touchSensitivity = 50

    const handleTouchStart = (evt) => {
      touchStartY = evt.touches[0].clientY
      touchEndY = evt.touches[0].clientY
    }

    const handleTouchMove = (evt) => {
      touchEndY = evt.touches[0].clientY
      
      const pageScrollTop = window.scrollY || document.documentElement.scrollTop
      
      // If not at footer and not on last slide, prevent scroll
      if (pageScrollTop <= 50 && currentSlideRef.current < totalSlides - 1) {
        evt.preventDefault()
      }
    }

    const handleTouchEnd = () => {
      const deltaY = touchStartY - touchEndY
      const pageScrollTop = window.scrollY || document.documentElement.scrollTop

      // Check if we're at footer
      if (pageScrollTop > 50) {
        isAtFooter = true
      }

      // If at footer and swiping down (to go up), scroll back to top
      if (isAtFooter && deltaY < -touchSensitivity) {
        isAtFooter = false
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }

      // If at footer, don't interfere
      if (isAtFooter) {
        return
      }

      // On last slide swiping up, allow scroll to footer
      if (currentSlideRef.current >= totalSlides - 1 && deltaY > touchSensitivity) {
        isAtFooter = true
        return
      }

      if (!ticking) {
        if (deltaY > touchSensitivity) {
          // Swipe up - next slide
          ticking = true
          setCurrentSlide(prev => Math.min(prev + 1, totalSlides - 1))
          setTimeout(() => { ticking = false }, slideDuration)
        }
        if (deltaY < -touchSensitivity) {
          // Swipe down - previous slide
          ticking = true
          setCurrentSlide(prev => Math.max(prev - 1, 0))
          setTimeout(() => { ticking = false }, slideDuration)
        }
      }
    }

    // Add touch listeners to window for mobile
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    
    return () => {
      window.removeEventListener(mousewheelEvent, handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [totalSlides])

  // Reset to first slide when filter changes
  useEffect(() => {
    setCurrentSlide(0)
  }, [activeFilter])

  // Keyboard navigation
  useEffect(() => {
    // Disable keyboard navigation for 4 seater (only 1 car)
    if (totalSlides <= 1) return

    let ticking = false
    const slideDuration = 600

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault()
        if (!ticking) {
          ticking = true
          setCurrentSlide(prev => Math.min(prev + 1, totalSlides - 1))
          setTimeout(() => { ticking = false }, slideDuration)
        }
      }
      if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        if (!ticking) {
          ticking = true
          setCurrentSlide(prev => Math.max(prev - 1, 0))
          setTimeout(() => { ticking = false }, slideDuration)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [totalSlides])

  return (
    <div className="cars-page">
      {/* Filter Navigation */}
      <nav className="cars-filter-nav">
        <div className="filter-container">
          <button 
            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All Cars
          </button>
          <button 
            className={`filter-btn ${activeFilter === '4' ? 'active' : ''}`}
            onClick={() => setActiveFilter('4')}
          >
            4 Seater
          </button>
          <button 
            className={`filter-btn ${activeFilter === '5' ? 'active' : ''}`}
            onClick={() => setActiveFilter('5')}
          >
            5 Seater
          </button>
          <button 
            className={`filter-btn ${activeFilter === '7' ? 'active' : ''}`}
            onClick={() => setActiveFilter('7')}
          >
            7 Seater
          </button>
        </div>
        <button className="back-home-btn" onClick={() => setIsTransitioning(true)}>
          <svg className="back-arrow-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          <span className="back-text">Back to Home</span>
        </button>
      </nav>

      {/* Car Showcases with Parallax */}
      <div className="parallax-container" ref={containerRef}>
        {visibleCars.map((car, index) => {
          let slideClass = 'car-slide'
          // For single slide (4 seater), always show active
          if (visibleCars.length === 1) {
            slideClass += ' active'
          } else {
            // Ensure currentSlide is within bounds
            const safeCurrentSlide = Math.min(currentSlide, visibleCars.length - 1)
            if (index < safeCurrentSlide) {
              slideClass += ' down-scroll'
            } else if (index === safeCurrentSlide) {
              slideClass += ' active'
            } else {
              slideClass += ' up-scroll'
            }
          }

          return (
            <div key={`${activeFilter}-${car}`} className={slideClass}>
              {car === 'magnite' && <MagniteShowcase />}
              {car === 'magniteblack' && <MagniteBlackShowcase />}
              {car === 'dzire' && <DzireShowcase />}
              {car === 'baleno' && <BalenoShowcase />}
              {car === 'ertiga' && <ErtigaShowcase />}
              {car === 'kiger' && <KigerShowcase />}
              {car === 'triber' && <TriberShowcase />}
              {car === 'thar' && <TharShowcase />}
            </div>
          )
        })}
      </div>

      {/* Page Transition */}
      <PageTransition 
        isActive={isTransitioning} 
        targetPath="/"
        onComplete={() => setIsTransitioning(false)}
      />
    </div>
  )
}
