import * as React from 'react'
import { useFrame } from '@react-three/fiber'
import { Vector3, Mesh, RepeatWrapping, Vector2 } from 'three'
import { MeshReflectorMaterial, useTexture, TorusKnot, Box, Environment } from '@react-three/drei'
import { Setup } from './Setup.js'
import './App.css';

function ReflectorScene({
  blur,
  depthScale,
  distortion,
  normalScale,
  reflectorOffset,
}) {
  const roughness = useTexture('./img/roughness_floor.jpeg')
  const normal = useTexture('./img/NORM.jpg')
  const distortionMap = useTexture('./img/dist_map.jpeg')
  const box = React.createRef<Mesh>(null)
  const _normalScale = React.useMemo(() => new Vector2(normalScale || 0), [normalScale])

  React.useEffect(() => {
    distortionMap.wrapS = distortionMap.wrapT = RepeatWrapping
    distortionMap.repeat.set(4, 4)
  }, [distortionMap])

  useFrame(({ clock }) => {
    if (!box.current) return; 

    box.current.position.y += Math.sin(clock.getElapsedTime()) / 25
    box.current.rotation.y = clock.getElapsedTime() / 2
  })

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <planeGeometry args={[10, 10]} />
        <MeshReflectorMaterial
          resolution={1024}
          mirror={0.75}
          mixBlur={10}
          mixStrength={2}
          blur={blur || [0, 0]}
          minDepthThreshold={0.8}
          maxDepthThreshold={1.2}
          depthScale={depthScale || 0}
          depthToBlurRatioBias={0.2}
          debug={0}
          distortion={distortion || 0}
          distortionMap={distortionMap}
          color="#a0a0a0"
          metalness={0.5}
          roughnessMap={roughness}
          roughness={1}
          normalMap={normal}
          normalScale={_normalScale}
          reflectorOffset={reflectorOffset}
        />
      </mesh>

      <Box args={[2, 3, 0.2]} position={[0, 1.6, -3]}>
        <meshPhysicalMaterial color="hotpink" />
      </Box>
      {/* <TorusKnot args={[0.5, 0.2, 128, 32]} ref={box} position={[0, 1, 0]}>
        <meshPhysicalMaterial color="hotpink" />
      </TorusKnot> */}
      <spotLight intensity={1} position={[10, 6, 10]} penumbra={1} angle={0.3} />
      <Environment preset="city" />
    </>
  )
}

export const ReflectorPlain = () => (
  <React.Suspense fallback={null}>
    <ReflectorScene />
  </React.Suspense>
)

const Plain = () => 
  <Setup cameraFov={20} cameraPosition={new Vector3(-2, 2, 6)}>
    <React.Suspense fallback={null}>
      <ReflectorScene />
    </React.Suspense>
  </Setup>;

export default Plain;