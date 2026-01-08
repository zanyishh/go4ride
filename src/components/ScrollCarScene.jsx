import { useRef, useEffect, useState, Suspense } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { useGLTF, Environment } from '@react-three/drei'
import * as THREE from 'three'

/* ============================
   CAMERA WITH SCROLL ANIMATION
   ============================ */
function CameraController({ scrollProgress }) {
  const { camera } = useThree()
  
  useFrame(() => {
    const progress = scrollProgress.current
    
    // Smoothstep easing
    const easedProgress = progress * progress * (3 - 2 * progress)
    
    // Camera position interpolation
    // Start: angled front view, End: elevated angled view
    const startPos = { x: 2, y: 2, z: 7 }
    const endPos = { x: 1, y: 4.5, z: 5 }
    
    camera.position.x = THREE.MathUtils.lerp(startPos.x, endPos.x, easedProgress)
    camera.position.y = THREE.MathUtils.lerp(startPos.y, endPos.y, easedProgress)
    camera.position.z = THREE.MathUtils.lerp(startPos.z, endPos.z, easedProgress)
    
    // Camera always looks at car
    camera.lookAt(1.5, 0, 0)
    camera.updateProjectionMatrix()
  })
  
  return null
}

/* ============================
   CAR MODEL WITH SCROLL ROTATION
   ============================ */
function CarModel({ onLoaded, scrollProgress }) {
  const { scene } = useGLTF('/scene-compressed.glb')
  const carRef = useRef()
  const initialized = useRef(false)
  const baseRotation = useRef(0)

  useEffect(() => {
    if (scene && !initialized.current) {
      initialized.current = true
      scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = false
          child.receiveShadow = false
        }
      })
      onLoaded()
    }
  }, [scene, onLoaded])

  // Auto-rotation + scroll-based rotation
  useFrame((state, delta) => {
    if (carRef.current) {
      const progress = scrollProgress.current
      
      // Continuous slow rotation
      baseRotation.current += delta * 0.1
      
      // Additional rotation based on scroll
      const scrollRotation = progress * Math.PI
      
      carRef.current.rotation.y = baseRotation.current + scrollRotation
    }
  })

  return (
    <primitive
      ref={carRef}
      object={scene}
      scale={1.1}
      position={[1.5, -0.6, 0]}
      rotation={[0, 0, 0]}
    />
  )
}

/* ============================
   MINIMAL LIGHTS
   ============================ */
function SimpleLights() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} />
      <directionalLight position={[-5, 5, -5]} intensity={0.6} />
    </>
  )
}

/* ============================
   LIGHTWEIGHT SCENE WITH SCROLL ANIMATION
   ============================ */
export default function ScrollCarScene({ onAnimationComplete, scrollProgress }) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (isLoaded && onAnimationComplete) {
      onAnimationComplete()
    }
  }, [isLoaded, onAnimationComplete])

  return (
    <div className="scroll-car-scene-container">
      <Canvas
        gl={{
          powerPreference: 'high-performance',
          antialias: false,
          alpha: true,
          stencil: false,
          depth: true,
        }}
        dpr={1}
        frameloop="always"
        performance={{ min: 0.3 }}
      >
        <CameraController scrollProgress={scrollProgress} />
        <SimpleLights />

        <Suspense fallback={null}>
          <CarModel onLoaded={() => setIsLoaded(true)} scrollProgress={scrollProgress} />
          <Environment preset="city" background={false} />
        </Suspense>
      </Canvas>

      {!isLoaded && (
        <div className="scene-loading">
          <div className="scene-loading-ring"></div>
        </div>
      )}
    </div>
  )
}
