'use client'

import { Skateboard } from "@/components/Skateboard"
import { ContactShadows, Environment, Html, OrbitControls } from "@react-three/drei"
import { Canvas, ThreeEvent, useThree } from "@react-three/fiber"
import { Suspense, useEffect, useRef, useState } from "react"
import * as THREE from 'three'
import gsap from 'gsap'
import { Hotspot } from "./Hotspot"
import { WavyPaths } from "./WavyPaths"

const INITIAL_CAMERA_POSITION = [1.5, 1, 1.4] as const

type IProps = {
  deckTextureURL: string
  wheelTextureURL: string
  truckColor: string
  boltColor: string
}

export default function InteractiveSkateboard({ deckTextureURL, wheelTextureURL, truckColor, boltColor }: IProps) {
  return (
    <div className='absolute inset-0 z-10 flex items-center justify-center'>
      <Canvas
        className='min-h-[60rem] w-full'
        camera={{ position: INITIAL_CAMERA_POSITION, fov: 55 }}
      >
        <Suspense>
          <Scene
            deckTextureURL={deckTextureURL}
            wheelTextureURL={wheelTextureURL}
            truckColor={truckColor}
            boltColor={boltColor}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

function Scene({ deckTextureURL, wheelTextureURL, truckColor, boltColor }: IProps) {
  const containerRef = useRef<THREE.Group>(null)
  const originRef = useRef<THREE.Group>(null)
  
  const [animating, setAnimating] = useState(false)
  const [showHotspot, setShowHotspot] = useState({
    front: true,
    middle: true,
    back: true
  })

  const { camera } = useThree()

  useEffect(() => {
    if (!containerRef.current || !originRef.current) return

    gsap.to(
      containerRef.current.position,
      {
        x: .2,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      }
    )
    
    gsap.to(
      originRef.current.rotation,
      {
        y: Math.PI/64,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      }
    )
  }, [])

  useEffect(() => {
    camera.lookAt(new THREE.Vector3(-.2, .15, 0))

    setZoom()

    window.addEventListener('resize', setZoom)

    function setZoom() {
      const scale = Math.max(Math.min(1000/window.innerWidth, 2.2), 1)

      camera.position.x = INITIAL_CAMERA_POSITION[0] * scale
      camera.position.y = INITIAL_CAMERA_POSITION[1] * scale
      camera.position.z = INITIAL_CAMERA_POSITION[2] * scale
    }

    return () => window.removeEventListener('resize', setZoom)
  }, [camera])

  function onClick(e: ThreeEvent<MouseEvent>) {
    e.stopPropagation()

    const board = containerRef.current
    const origin = originRef.current

    if (!board || !origin || animating) return

    const { name } = e.object

    setShowHotspot(current => ({ ...current, [name]: false }))
    
    if (name === 'back') {
      ollie(board)
    } else if (name === 'middle') {
      kickflip(board)
    } else if (name === 'front') {
      frontside360(board, origin)
    }
  }

  function jumpBoard(board: THREE.Group) {
    setAnimating(true)

    gsap.timeline({ onComplete: () => setAnimating(false) })
    .to(
      board.position,
      {
        y: .8,
        duration: .51,
        ease: 'power2.out',
        delay: .26
      }
    )
    .to(
      board.position,
      {
        y: 0,
        duration: .43,
        ease: 'power2.in'
      }
    )
  }

  function ollie(board: THREE.Group) {
    jumpBoard(board)

    gsap.timeline()
      .to(
        board.rotation,
        {
          x: -.6,
          duration: .26,
          ease: 'none'
        }
      )
      .to(
        board.rotation,
        {
          x: .4,
          duration: .82,
          ease: 'power2.in'
        }
      )
      .to(
        board.rotation,
        {
          x: 0,
          duration: .12,
          ease: 'none'
        }
      )
  }

  function kickflip(board: THREE.Group) {
    jumpBoard(board)

    gsap.timeline()
      .to(
        board.rotation,
        {
          x: -.6,
          duration: .26,
          ease: 'none'
        }
      )
      .to(
        board.rotation,
        {
          x: .4,
          duration: .82,
          ease: 'power2.in'
        }
      )
      .to(
        board.rotation,
        {
          z: `+=${Math.PI * 2}`,
          duration: .78,
          ease: 'none'
        },
        .3
      )
      .to(
        board.rotation,
        {
          x: 0,
          duration: .12,
          ease: 'none'
        }
      )
  }

  function frontside360(board: THREE.Group, origin: THREE.Group) {
    jumpBoard(board)

    gsap.timeline()
      .to(
        board.rotation,
        {
          x: -.6,
          duration: .26,
          ease: 'none'
        }
      )
      .to(
        board.rotation,
        {
          x: .4,
          duration: .82,
          ease: 'power2.in'
        }
      )
      .to(
        origin.rotation,
        {
          y: `+=${Math.PI * 2}`,
          duration: .77,
          ease: 'none'
        },
        .3
      )
      .to(
        board.rotation,
        {
          x: 0,
          duration: .14,
          ease: 'none'
        }
      )
  }
  
  return (
    <group>
      <OrbitControls />
      <Environment files={'/hdr/warehouse-256.hdr'} />
      <group ref={originRef}>
        <group ref={containerRef} position={[-.25, 0, -.635]}>
          <group position={[0, .086, .635]}>
            <Skateboard
              wheelTextureURLs={[wheelTextureURL]}
              wheelTextureURL={wheelTextureURL}
              deckTextureURLs={[deckTextureURL]}
              deckTextureURL={deckTextureURL}
              truckColor={truckColor}
              boltColor={boltColor}
              constantWheelSpin
            />
            <Hotspot
              isVisible={!animating && showHotspot.front}
              position={[0, .38, 1]}
              color='#88FC39'
            />
            <mesh onClick={onClick} position={[0, .27, .9]} name='front'>
              <boxGeometry args={[.6, .2, .58]} />
              <meshStandardMaterial visible={false} />
            </mesh>
            <Hotspot
              isVisible={!animating && showHotspot.middle}
              position={[0, .33, 0]}
              color='#FF7A51'
            />
            <mesh onClick={onClick} position={[0, .27, 0]} name='middle'>
              <boxGeometry args={[.6, .1, 1.2]} />
              <meshStandardMaterial visible={false} />
            </mesh>
            <Hotspot
              isVisible={!animating && showHotspot.back}
              position={[0, .35, -.9]}
              color='#46ACFA'
            />
            <mesh onClick={onClick} position={[0, .27, -.9]} name='back'>
              <boxGeometry args={[.6, .2, .58]} />
              <meshStandardMaterial visible={false} />
            </mesh>
          </group>
        </group>
      </group>
      <ContactShadows opacity={.6} position={[0, -.08, 0]} />

      <group
        rotation={[-Math.PI/2, 0, -Math.PI/2]}
        position={[0, -.09, -.5]}
        scale={[.2, .2, .2]}
      >
        <Html wrapperClass='pointer-events-none' transform zIndexRange={[1, 0]} occlude='blending'>
          <WavyPaths />
        </Html>
      </group>
    </group>
  )
}