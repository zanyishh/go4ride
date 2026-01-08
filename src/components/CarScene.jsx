import { useRef, useEffect, useState, Suspense } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { useGLTF, Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

// Configure Draco loader for useGLTF
useGLTF.preload('/scene-compressed.glb')

/* ============================
   CAR MODEL (SCROLL-CONTROLLED ROTATION)
   ============================ */
function CarModel({ onLoaded, scrollProgress, isMobile }) {
  const { scene } = useGLTF('/scene-compressed.glb')
  const carRef = useRef()
  const initialized = useRef(false)
  const { invalidate } = useThree()

  useEffect(() => {
    if (scene && !initialized.current) {
      initialized.current = true
      const toRemove = []
      
      scene.traverse((child) => {
        if (child.isMesh) {
          const name = (child.name || '').toLowerCase()
          const matName = (child.material?.name || '').toLowerCase()
          
          // AGGRESSIVE REMOVAL - Interior parts (both desktop and mobile)
          if (name.includes('seat') || name.includes('interior') || 
              name.includes('dashboard') || name.includes('steering') ||
              name.includes('floor') || name.includes('carpet') ||
              name.includes('pedal') || name.includes('console') ||
              name.includes('airbag') || name.includes('belt') ||
              name.includes('mirror_int') || name.includes('trim_int') ||
              name.includes('headrest') || name.includes('armrest') ||
              name.includes('glovebox') || name.includes('sunvisor') ||
              name.includes('speaker') || name.includes('vent') ||
              matName.includes('interior') || matName.includes('seat') ||
              matName.includes('fabric') || matName.includes('leather') ||
              matName.includes('cloth') || matName.includes('carpet')) {
            toRemove.push(child)
            return
          }
          
          // AGGRESSIVE REMOVAL - Bottom/undercarriage (both desktop and mobile)
          if (name.includes('under') || name.includes('chassis') ||
              name.includes('exhaust') || name.includes('suspension') ||
              name.includes('axle') || name.includes('brake') ||
              name.includes('engine') || name.includes('transmission') ||
              name.includes('fuel') || name.includes('tank') ||
              name.includes('pipe') || name.includes('muffler') ||
              name.includes('catalytic') || name.includes('diff') ||
              name.includes('driveshaft') || name.includes('subframe') ||
              name.includes('control_arm') || name.includes('strut') ||
              name.includes('shock') || name.includes('spring') ||
              name.includes('sway') || name.includes('bushing') ||
              name.includes('caliper') || name.includes('rotor') ||
              name.includes('disc') || name.includes('pad')) {
            toRemove.push(child)
            return
          }
          
          // MOBILE ONLY: Extra aggressive removal of hidden internal geometry
          if (isMobile) {
            // Remove any geometry that's typically internal or not visible from exterior
            if (name.includes('inner') || name.includes('inside') ||
                name.includes('cavity') || name.includes('behind') ||
                name.includes('back_') || name.includes('_back') ||
                name.includes('hidden') || name.includes('internal') ||
                name.includes('frame') || name.includes('structure') ||
                name.includes('support') || name.includes('bracket') ||
                name.includes('mount') || name.includes('hinge') ||
                name.includes('latch') || name.includes('lock') ||
                name.includes('wire') || name.includes('cable') ||
                name.includes('harness') || name.includes('connector') ||
                matName.includes('inner') || matName.includes('hidden')) {
              toRemove.push(child)
              return
            }
          }
          
          // Disable shadows on meshes for performance
          child.castShadow = false
          child.receiveShadow = false
          
          // ENHANCE EXTERIOR - Realistic PBR materials
          if (child.material) {
            child.material = child.material.clone()
            const mat = child.material
            mat.needsUpdate = true
            
            // Mobile: Slightly enhanced material settings for sharper look
            const envIntensityBoost = isMobile ? 0.5 : 0
            
            // Body panels - realistic automotive paint
            if (matName.includes('body') || matName.includes('paint') ||
                matName.includes('car') || matName.includes('metal') ||
                name.includes('body') || name.includes('door') ||
                name.includes('hood') || name.includes('trunk') ||
                name.includes('fender') || name.includes('bumper') ||
                name.includes('roof') || name.includes('pillar')) {
              mat.color = new THREE.Color('#1a1a1a')
              mat.metalness = isMobile ? 0.5 : 0.4
              mat.roughness = isMobile ? 0.3 : 0.35
              mat.envMapIntensity = 3.5 + envIntensityBoost
              mat.reflectivity = 1.0
            }
            // Windows - realistic automotive glass
            else if (matName.includes('glass') || matName.includes('window') ||
                     name.includes('glass') || name.includes('window') ||
                     name.includes('windshield')) {
              mat.color = new THREE.Color('#1a2530')
              mat.metalness = 0.0
              mat.roughness = 0.0
              mat.transparent = true
              mat.opacity = isMobile ? 0.35 : 0.4
              mat.envMapIntensity = 4.0 + envIntensityBoost
              mat.side = THREE.DoubleSide
            }
            // Wheels - rubber tires
            else if (matName.includes('tire') || matName.includes('tyre') ||
                     name.includes('tire') || name.includes('tyre')) {
              mat.color = new THREE.Color('#1a1a1a')
              mat.metalness = 0.0
              mat.roughness = 0.9
              mat.envMapIntensity = 0.5
            }
            // Rims - polished alloy
            else if (matName.includes('wheel') || matName.includes('rim') ||
                     name.includes('wheel') || name.includes('rim') ||
                     name.includes('alloy')) {
              mat.color = new THREE.Color('#c8c8c8')
              mat.metalness = isMobile ? 1.0 : 0.95
              mat.roughness = isMobile ? 0.08 : 0.1
              mat.envMapIntensity = 4.0 + envIntensityBoost
            }
            // Headlights/taillights - polished reflector
            else if (matName.includes('light') || matName.includes('lamp') ||
                     name.includes('headlight') || name.includes('taillight') ||
                     name.includes('fog')) {
              mat.metalness = 0.9
              mat.roughness = 0.05
              mat.envMapIntensity = 5.0 + envIntensityBoost
            }
            // Chrome parts - mirror finish
            else if (matName.includes('chrome') || name.includes('chrome') ||
                     name.includes('mirror') || name.includes('handle')) {
              mat.color = new THREE.Color('#e8e8e8')
              mat.metalness = 1.0
              mat.roughness = isMobile ? 0.01 : 0.02
              mat.envMapIntensity = 5.0 + envIntensityBoost
            }
            // Grille/trim - dark chrome
            else if (matName.includes('grille') || matName.includes('grill') ||
                     matName.includes('trim') || name.includes('grille') ||
                     name.includes('badge') || name.includes('emblem')) {
              mat.color = new THREE.Color('#2a2a2a')
              mat.metalness = isMobile ? 0.9 : 0.85
              mat.roughness = isMobile ? 0.12 : 0.15
              mat.envMapIntensity = 4.0 + envIntensityBoost
            }
            // Plastic parts - matte black
            else if (matName.includes('plastic') || matName.includes('rubber') ||
                     name.includes('wiper') || name.includes('seal') ||
                     name.includes('molding')) {
              mat.color = new THREE.Color('#1f1f1f')
              mat.metalness = 0.0
              mat.roughness = 0.7
              mat.envMapIntensity = 1.0
            }
          }
        }
      })
      
      // Remove all collected non-visible parts
      toRemove.forEach(obj => {
        if (obj.parent) obj.parent.remove(obj)
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach(m => m.dispose())
          } else {
            obj.material.dispose()
          }
        }
      })
      
      onLoaded()
      invalidate()
    }
  }, [scene, onLoaded, invalidate, isMobile])

  // Scroll-driven rotation: car rotates as user scrolls (cinematic reveal)
  useFrame(() => {
    if (carRef.current) {
      const progress = scrollProgress?.current || 0
      const eased = 1 - Math.pow(1 - progress, 2.5)
      
      // Rotate from front 3/4 to rear 3/4 view (about 120 degrees)
      const startRotation = -0.4
      const endRotation = -2.5
      carRef.current.rotation.y = THREE.MathUtils.lerp(startRotation, endRotation, eased)
      invalidate()
    }
  })

  return (
    <primitive
      ref={carRef}
      object={scene}
      scale={0.95}
      position={[0, -0.5, 0]}
      rotation={[0, -0.4, 0]}
    />
  )
}

/* ============================
   LIGHTS
   ============================ */
function SceneLights() {
  return (
    <>
      {/* Soft ambient fill */}
      <ambientLight intensity={0.3} color="#e8f0ff" />
      
      {/* Key light - main illumination */}
      <directionalLight
        position={[8, 12, 8]}
        intensity={3.0}
        color="#fff8f0"
      />
      
      {/* Fill light - soften shadows */}
      <directionalLight
        position={[-6, 8, -4]}
        intensity={1.5}
        color="#f0f4ff"
      />
      
      {/* Rim light - edge definition */}
      <directionalLight
        position={[-8, 5, 8]}
        intensity={2.0}
        color="#ffffff"
      />
      
      {/* Top light - roof highlights */}
      <directionalLight
        position={[0, 15, 0]}
        intensity={1.0}
        color="#ffffff"
      />
      
      {/* Front accent - grille and bumper */}
      <spotLight
        position={[0, 3, 10]}
        angle={0.4}
        penumbra={0.5}
        intensity={1.5}
        color="#ffffff"
      />
    </>
  )
}

/* ============================
   SCROLL-ANIMATED CAMERA (CINEMATIC ORBIT)
   ============================ */
function ScrollCamera({ scrollProgress, isMobile }) {
  const { camera, invalidate } = useThree()

  useFrame(() => {
    const progress = scrollProgress.current || 0
    
    // Custom easing for smooth cinematic feel
    const eased = 1 - Math.pow(1 - progress, 3)
    
    // Mobile: adjusted camera settings for better framing
    if (isMobile) {
      // Mobile camera - more centered, slightly further back
      const startAngle = Math.PI * 0.15
      const endAngle = Math.PI * 0.6
      const angle = THREE.MathUtils.lerp(startAngle, endAngle, eased)
      
      const radius = THREE.MathUtils.lerp(10, 8.5, eased)
      const height = THREE.MathUtils.lerp(3.2, 2, eased)
      
      camera.position.x = Math.sin(angle) * radius
      camera.position.z = Math.cos(angle) * radius
      camera.position.y = height
      
      const lookAtY = THREE.MathUtils.lerp(0.4, 0.1, eased)
      camera.lookAt(0, lookAtY, 0)
    } else {
      // Desktop camera - original settings
      const startAngle = Math.PI * 0.1
      const endAngle = Math.PI * 0.65
      const angle = THREE.MathUtils.lerp(startAngle, endAngle, eased)
      
      const startRadius = 9
      const endRadius = 7.5
      const radius = THREE.MathUtils.lerp(startRadius, endRadius, eased)
      
      const startHeight = 2.8
      const endHeight = 1.6
      const height = THREE.MathUtils.lerp(startHeight, endHeight, eased)
      
      camera.position.x = Math.sin(angle) * radius
      camera.position.z = Math.cos(angle) * radius
      camera.position.y = height
      
      const lookAtY = THREE.MathUtils.lerp(0.3, 0, eased)
      camera.lookAt(0, lookAtY, 0)
    }
    
    camera.updateProjectionMatrix()
    invalidate()
  })

  return null
}

/* ============================
   MAIN SCENE
   ============================ */
export default function CarScene({ onAnimationComplete, scrollProgress }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const defaultScrollRef = useRef(0)
  
  // Use provided scrollProgress or default
  const scrollRef = scrollProgress || defaultScrollRef

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (isLoaded && onAnimationComplete) {
      onAnimationComplete()
    }
  }, [isLoaded, onAnimationComplete])

  return (
    <div className="car-scene-container">
      <Canvas
        gl={{
          powerPreference: 'high-performance',
          antialias: !isMobile,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.4,
          stencil: false,
          depth: true,
          alpha: true,
        }}
        dpr={isMobile ? 1 : 1.5}
        performance={{ min: isMobile ? 0.5 : 0.3 }}
        frameloop="demand"
        style={{ background: 'transparent' }}
      >
        <ScrollCamera scrollProgress={scrollRef} isMobile={isMobile} />
        <SceneLights />

        <Suspense fallback={null}>
          <CarModel onLoaded={() => setIsLoaded(true)} scrollProgress={scrollRef} isMobile={isMobile} />
          {!isMobile && (
            <ContactShadows
              position={[0, -0.5, 0]}
              opacity={0.45}
              scale={14}
              blur={2}
              far={5}
              color="#000000"
            />
          )}
          <Environment preset="sunset" background={false} />
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
