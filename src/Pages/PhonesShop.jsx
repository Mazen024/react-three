import {PointerLockControls} from '@react-three/drei'
import LoadingModels from '../Utils/LoadingModels'
import { createXRStore } from '@react-three/xr'
import { 
    PATH_TO_PHONESSHOP_MODEL,
    PHONESSHOP_SHOP_POSITION,
    PHONESSHOP_SHOP_ROTATION,
    DIRECTIONAL_LIGHT_POSITION,
    AMBIENT_LIGHT_INTENSITY,
    PHONESSHOP_SHOP_SCALE,
} from '../Constants/PhonesShop'
import { Physics, RigidBody } from '@react-three/rapier'
import CameraControls from '../Utils/Camera'
export default function PhonesShop(){
    const store = createXRStore({});
    return (
        <>
            <ambientLight intensity={AMBIENT_LIGHT_INTENSITY} />
            <directionalLight position={DIRECTIONAL_LIGHT_POSITION} />
            <Physics gravity={[0, -9.81, 0]}>
                <CameraControls/>
                <RigidBody type='fixed' colliders='hull'>
                    <LoadingModels path={PATH_TO_PHONESSHOP_MODEL} position={PHONESSHOP_SHOP_POSITION} rotation={PHONESSHOP_SHOP_ROTATION} scale={PHONESSHOP_SHOP_SCALE}/>
                </RigidBody>
            </Physics>
            <PointerLockControls/>
        </>
    )
}