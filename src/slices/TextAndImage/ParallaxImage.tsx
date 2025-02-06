'use client'

import { ImageField } from "@prismicio/client"
import { PrismicNextImage } from "@prismicio/next"
import clsx from "clsx"
import { useEffect, useRef } from "react"

type Props = {
  foregroundImage: ImageField
  backgroundImage: ImageField
  className?: string
}

export function ParallaxImage({ foregroundImage, backgroundImage, className }: Props) {
  const backgroundRef = useRef<HTMLDivElement>(null)
  const foregroundRef = useRef<HTMLDivElement>(null)
  
  const targetPosition = useRef({ x: 0, y: 0 })
  const currentPosition = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const frameId = requestAnimationFrame(animationFrame)

    function onMouseMove(e: MouseEvent) {
      const { innerWidth, innerHeight } = window
      const xPercent = (e.clientX / innerWidth - .5) * 2
      const yPercent = (e.clientY / innerHeight - .5) * 2
      
      targetPosition.current = {
        x: xPercent * -20,
        y: yPercent * -20
      }
    }

    function animationFrame() {
      const { x: targetX, y: targetY } = targetPosition.current
      const { x: currentX, y: currentY } = currentPosition.current

      const newX = currentX + (targetX - currentX) * .1
      const newY = currentY + (targetY - currentY) * .1

      currentPosition.current = { x: newX, y: newY }

      if (backgroundRef.current) {
        backgroundRef.current.style.transform = `translate(${newX}px, ${newY}px)`
      }

      if (foregroundRef.current) {
        foregroundRef.current.style.transform = `translate(${newX * 2.5}px, ${newY * 2.5}px)`
      }

      requestAnimationFrame(animationFrame)
    }

    window.addEventListener('mousemove', onMouseMove)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(frameId)
    }
  }, [])

  return (
    <div className={clsx('grid grid-cols-1 place-items-center', className)}>
      <div ref={backgroundRef} className='col-start-1 row-start-1 transition-transform'>
        <PrismicNextImage field={backgroundImage} alt='' className='w-11/12' />
      </div>
      <div ref={foregroundRef} className='col-start-1 row-start-1 transition-transform h-full w-full place-items-center'>
        <PrismicNextImage
          field={foregroundImage}
          alt=''
          imgixParams={{
            height: 600
          }}
          className='h-full max-h-[500px] w-auto'
        />
      </div>
    </div>
  )
}