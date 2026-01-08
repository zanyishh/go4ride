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

  useEffect(() => {
    if (scene && !initialized.current) {
      initialized.current = true
      const toRemove = []
      
      scene.traverse((child) => {
        if (child.isMesh) {
          const name = (child.name || '').toLowerCase()
          const matName = (child.material?.name || '').toLowerCase()
          
          // ULTRA AGGRESSIVE REMOVAL - Everything not visible from outside
          // Interior - ALL interior parts
          if (name.includes('seat') || name.includes('interior') || 
              name.includes('dashboard') || name.includes('steering') ||
              name.includes('floor') || name.includes('carpet') ||
              name.includes('pedal') || name.includes('console') ||
              name.includes('airbag') || name.includes('belt') ||
              name.includes('mirror_int') || name.includes('trim_int') ||
              name.includes('headrest') || name.includes('armrest') ||
              name.includes('glovebox') || name.includes('sunvisor') ||
              name.includes('speaker') || name.includes('vent') ||
              name.includes('gauge') || name.includes('dial') ||
              name.includes('button') || name.includes('switch') ||
              name.includes('knob') || name.includes('lever') ||
              name.includes('shifter') || name.includes('gear') ||
              name.includes('cup') || name.includes('holder') ||
              name.includes('pocket') || name.includes('storage') ||
              name.includes('mat') || name.includes('liner') ||
              matName.includes('interior') || matName.includes('seat') ||
              matName.includes('fabric') || matName.includes('leather') ||
              matName.includes('cloth') || matName.includes('carpet') ||
              matName.includes('dashboard') || matName.includes('vinyl')) {
            toRemove.push(child)
            return
          }
          
          // Undercarriage - ALL mechanical parts
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
              name.includes('disc') || name.includes('pad') ||
              name.includes('motor') || name.includes('pump') ||
              name.includes('compressor') || name.includes('alternator') ||
              name.includes('starter') || name.includes('flywheel') ||
              name.includes('clutch') || name.includes('oil') ||
              name.includes('filter') || name.includes('coolant') ||
              name.includes('radiator') || name.includes('intercooler') ||
              name.includes('turbo') || name.includes('manifold') ||
              name.includes('intake') || name.includes('air_box') ||
              name.includes('throttle') || name.includes('injector') ||
              name.includes('spark') || name.includes('coil') ||
              name.includes('distributor') || name.includes('ecu') ||
              name.includes('abs') || name.includes('esp') ||
              name.includes('steering_rack') || name.includes('power_steering')) {
            toRemove.push(child)
            return
          }
          
          // Structural/hidden parts
          if (name.includes('inner') || name.includes('inside') ||
              name.includes('cavity') || name.includes('behind') ||
              name.includes('hidden') || name.includes('internal') ||
              name.includes('frame') || name.includes('structure') ||
              name.includes('support') || name.includes('bracket') ||
              name.includes('mount') || name.includes('hinge') ||
              name.includes('latch') || name.includes('lock') ||
              name.includes('wire') || name.includes('cable') ||
              name.includes('harness') || name.includes('connector') ||
              name.includes('bolt') || name.includes('screw') ||
              name.includes('nut') || name.includes('washer') ||
              name.includes('clip') || name.includes('fastener') ||
              name.includes('rivet') || name.includes('weld') ||
              name.includes('panel_inner') || name.includes('insulation') ||
              name.includes('foam') || name.includes('gasket') ||
              name.includes('weather') || name.includes('drain') ||
              name.includes('duct') || name.includes('tube') ||
              name.includes('hose') || name.includes('battery') ||
              name.includes('fuse') || name.includes('relay') ||
              name.includes('sensor') || name.includes('reservoir') ||
              matName.includes('inner') || matName.includes('hidden') ||
              matName.includes('underbody') || matName.includes('structural')) {
            toRemove.push(child)
            return
          }
          
          // Remove small geometry (not visible at distance) - more aggressive
          if (child.geometry) {
            child.geometry.computeBoundingSphere()
            if (child.geometry.boundingSphere && child.geometry.boundingSphere.radius < 0.05) {
              toRemove.push(child)
              return
            }
          }
          
          // Disable shadows on meshes for performance
          child.castShadow = false
          child.receiveShadow = false
          
          // ULTRA GLOSSY REALISTIC - Wet showroom finish
          if (child.material) {
            child.material = child.material.clone()
            const mat = child.material
            mat.needsUpdate = true
            
            // Body panels - Premium automotive paint (showroom finish)
            if (matName.includes('body') || matName.includes('paint') ||
                matName.includes('car') || matName.includes('metal') ||
                name.includes('body') || name.includes('door') ||
                name.includes('hood') || name.includes('trunk') ||
                name.includes('fender') || name.includes('bumper') ||
                name.includes('roof') || name.includes('pillar')) {
              mat.color = new THREE.Color('#0d0d0d')
              mat.metalness = 0.9
              mat.roughness = 0.08
              mat.envMapIntensity = 2.0
              if (mat.clearcoat !== undefined) {
                mat.clearcoat = 0.8
                mat.clearcoatRoughness = 0.1
              }
            }
            // Windows - tinted glass with subtle reflections
            else if (matName.includes('glass') || matName.includes('window') ||
                     name.includes('glass') || name.includes('window') ||
                     name.includes('windshield')) {
              mat.color = new THREE.Color('#1a2530')
              mat.metalness = 0.0
              mat.roughness = 0.05
              mat.transparent = true
              mat.opacity = 0.35
              mat.envMapIntensity = 2.5
              mat.side = THREE.DoubleSide
            }
            // Tires - glossy rubber
            else if (matName.includes('tire') || matName.includes('tyre') ||
                     name.includes('tire') || name.includes('tyre')) {
              mat.color = new THREE.Color('#080808')
              mat.metalness = 0.1
              mat.roughness = 0.4
              mat.envMapIntensity = 2.0
            }
            // Rims - polished alloy finish
            else if (matName.includes('wheel') || matName.includes('rim') ||
                     name.includes('wheel') || name.includes('rim') ||
                     name.includes('alloy')) {
              mat.color = new THREE.Color('#d0d0d0')
              mat.metalness = 0.95
              mat.roughness = 0.15
              mat.envMapIntensity = 2.5
            }
            // Headlights/taillights - polished lens
            else if (matName.includes('light') || matName.includes('lamp') ||
                     name.includes('headlight') || name.includes('taillight') ||
                     name.includes('fog')) {
              mat.color = new THREE.Color('#f5f5f5')
              mat.metalness = 0.3
              mat.roughness = 0.1
              mat.envMapIntensity = 3.0
            }
            // Chrome parts - polished chrome
            else if (matName.includes('chrome') || name.includes('chrome') ||
                     name.includes('mirror') || name.includes('handle')) {
              mat.color = new THREE.Color('#e8e8e8')
              mat.metalness = 0.95
              mat.roughness = 0.1
              mat.envMapIntensity = 3.5
            }
            // Grille/trim - glossy dark
            else if (matName.includes('grille') || matName.includes('grill') ||
                     matName.includes('trim') || name.includes('grille') ||
                     name.includes('badge') || name.includes('emblem')) {
              mat.color = new THREE.Color('#0a0a0a')
              mat.metalness = 0.85
              mat.roughness = 0.15
              mat.envMapIntensity = 2.0
            }
            // Plastic parts - matte black trim
            else if (matName.includes('plastic') || matName.includes('rubber') ||
                     name.includes('wiper') || name.includes('seal') ||
                     name.includes('molding')) {
              mat.color = new THREE.Color('#080808')
              mat.metalness = 0.05
              mat.roughness = 0.6
              mat.envMapIntensity = 0.5
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
    }
  }, [scene, onLoaded, isMobile])

  // Scroll-driven rotation: car rotates as user scrolls (cinematic reveal)
  useFrame(() => {
    if (carRef.current) {
      const progress = scrollProgress?.current || 0
      const eased = 1 - Math.pow(1 - progress, 2.5)
      
      // Rotate from front 3/4 to rear 3/4 view (about 120 degrees)
      const startRotation = -0.4
      const endRotation = -2.5
      carRef.current.rotation.y = THREE.MathUtils.lerp(startRotation, endRotation, eased)
    }
  })

  return (
    <primitive
      ref={carRef}
      object={scene}
      scale={0.95}
      position={[0.4, -0.5, 0]}
      rotation={[0, -0.4, 0]}
    />
  )
}

/* ============================
   LIGHTS - Premium Studio Lighting
   ============================ */
function SceneLights() {
  return (
    <>
      {/* Ambient for base visibility */}
      <ambientLight intensity={0.6} color="#ffffff" />
      
      {/* Key light - main illumination */}
      <directionalLight
        position={[5, 10, 8]}
        intensity={1.8}
        color="#ffffff"
      />
      
      {/* Fill light - soften shadows */}
      <directionalLight
        position={[-5, 6, -3]}
        intensity={1.2}
        color="#ffffff"
      />
      
      {/* Rim light - edge definition */}
      <directionalLight
        position={[-6, 4, -6]}
        intensity={1.5}
        color="#ffffff"
      />
      
      {/* Top light - roof highlights */}
      <directionalLight
        position={[0, 12, 0]}
        intensity={1.0}
        color="#ffffff"
      />
    </>
  )
}

/* ============================
   SCROLL-ANIMATED CAMERA (CINEMATIC ORBIT)
   ============================ */
function ScrollCamera({ scrollProgress, isMobile }) {
  const { camera } = useThree()

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
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.6,
          stencil: false,
          depth: true,
          alpha: true,
        }}
        dpr={isMobile ? 1.5 : 2}
        frameloop="always"
        style={{ background: 'transparent' }}
      >
        <ScrollCamera scrollProgress={scrollRef} isMobile={isMobile} />
        <SceneLights />

        <Suspense fallback={null}>
          <CarModel onLoaded={() => setIsLoaded(true)} scrollProgress={scrollRef} isMobile={isMobile} />
          <ContactShadows
            position={[0, -0.5, 0]}
            opacity={0.4}
            scale={10}
            blur={2}
            far={4}
            color="#000000"
            resolution={512}
          />
          <Environment preset="studio" background={false} />
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
