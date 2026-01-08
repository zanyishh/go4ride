import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './PageTransition.css'

export default function PageTransition({ isActive, targetPath, onComplete }) {
  const [stage, setStage] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isActive) {
      setStage(0)
      return
    }

    // Stage 1 - Fade in overlay
    setStage(1)

    // Stage 2 - Show logo
    const timer1 = setTimeout(() => {
      setStage(2)
    }, 400)

    // Navigate while still covered
    const timer2 = setTimeout(() => {
      navigate(targetPath)
    }, 800)

    // Stage 3 - Fade out
    const timer3 = setTimeout(() => {
      setStage(3)
    }, 1000)

    // Complete
    const timer4 = setTimeout(() => {
      setStage(0)
      if (onComplete) onComplete()
    }, 1600)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
    }
  }, [isActive, targetPath, navigate, onComplete])

  if (!isActive && stage === 0) return null

  return (
    <div className={`page-transition stage-${stage}`}>
      <div className="transition-overlay"></div>
      <div className="transition-logo-container">
        <span className="transition-logo">go4ride</span>
        <div className="transition-line"></div>
      </div>
    </div>
  )
}
