import { XROrigin } from '@react-three/xr'
import { Suspense } from 'react'
import { OrbitControls} from '@react-three/drei'
import LoadingModels from '../Utils/LoadingModels'
import { Physics, RigidBody } from '@react-three/rapier'
import { 
    AMBIENT_LIGHT_INTENSITY,
    DEFAULT_CAMERA_POSITION, 
    DIRECTIONAL_LIGHT_POSITION, 
    METAMALL_MODEL_POSITION, 
    PATH_TO_METAMALL_MODEL, 
    VIDEO1_SCREEN_SCALE_METAMALL, 
    VIDEO1_SCREEN_POSITION_METAMALL, 
    VIDEO1_SCREEN_ROTATION_METAMALL, 
    XRORIGIN_POSITION, 
    METAMALL_MODEL_ROTATION,
} from '../Constants/MetaMall'
export default function MetaMall(){
  return (
    <>
      <ambientLight intensity={AMBIENT_LIGHT_INTENSITY} />
      <directionalLight position={DIRECTIONAL_LIGHT_POSITION} />
      <Physics gravity={[0, -9.81, 0]}>
        <Suspense>
          <RigidBody type='fixed'>
            <LoadingModels path={PATH_TO_METAMALL_MODEL} position={METAMALL_MODEL_POSITION} rotation={METAMALL_MODEL_ROTATION} />
          </RigidBody>
        </Suspense>
      </Physics>
      <OrbitControls/>
    </>
  )
}