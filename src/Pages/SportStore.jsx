import { OrbitControls, useGLTF } from '@react-three/drei'
import { createXRStore } from '@react-three/xr'
import { 
    PATH_TO_SPORTSTORE_MODEL,
    SPORTSTORE_SHOP_POSITION,
    SPORTSTORE_SHOP_ROTATION,
    AMBIENT_LIGHT_INTENSITY,
    SPORTSTORE_SHOP_SCALE,
    FLOOR_SIZE,
    FLOOR_COLOR,
    SPORTS_ITEMS_CONFIG
} from '../Constants/SportStore'
import { Physics, RigidBody } from '@react-three/rapier'
import { Suspense, useMemo } from 'react'

const SportsItem = ({ path, position, rotation, scale }) => {
    const { scene } = useGLTF(path);
    
    const clonedScene = useMemo(() => {
        const clone = scene.clone();
        clone.traverse(child => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        return clone;
    }, [scene]);

    return (
        <primitive
            object={clonedScene}
            position={position}
            rotation={rotation}
            scale={scale}
            castShadow
            receiveShadow
        />
    );
};

const SportsItemsDisplay = () => {
    const uniquePaths = [...new Set(SPORTS_ITEMS_CONFIG.map(item => item.path))];
    uniquePaths.forEach(path => useGLTF.preload(path));
    useGLTF.preload(PATH_TO_SPORTSTORE_MODEL);

    return (
        <>
            {SPORTS_ITEMS_CONFIG.map((item, index) => (
                <Suspense key={`sport-item-${index}`} fallback={null}>
                    <SportsItem 
                        path={item.path}
                        position={item.position}
                        rotation={item.rotation}
                        scale={item.scale}
                    />
                </Suspense>
            ))}
        </>
    );
};

export default function SportStore(){
    const store = createXRStore({});
    const { scene } = useGLTF(PATH_TO_SPORTSTORE_MODEL);

    scene.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    return (
        <>
            <ambientLight intensity={AMBIENT_LIGHT_INTENSITY * 0.7} color="#ffffff" />
            <pointLight position={[0, 5, 0]} intensity={30} distance={12} decay={2} color="#ffffff" castShadow />
            <pointLight position={[3, 4, 3]} intensity={15} distance={8} decay={2} color="#ffffff" />
            <pointLight position={[-3, 4, 3]} intensity={15} distance={8} decay={2} color="#ffffff" />
            <pointLight position={[3, 4, -3]} intensity={15} distance={8} decay={2} color="#ffffff" />
            <pointLight position={[-3, 4, -3]} intensity={15} distance={8} decay={2} color="#ffffff" />
            <spotLight position={[2, 3, 0]} intensity={15} angle={Math.PI/5} penumbra={0.5} distance={10} color="#ffffff" castShadow />
            <spotLight position={[-2, 3, 0]} intensity={15} angle={Math.PI/5} penumbra={0.5} distance={10} color="#ffffff" castShadow />

            <Physics gravity={[0, -9.81, 0]}>
                <Suspense fallback={null}>
                    <RigidBody type="fixed">
                        <primitive 
                            object={scene} 
                            position={SPORTSTORE_SHOP_POSITION} 
                            rotation={SPORTSTORE_SHOP_ROTATION} 
                            scale={SPORTSTORE_SHOP_SCALE} 
                            castShadow 
                            receiveShadow 
                        />
                    </RigidBody>

                    <SportsItemsDisplay />

                    <RigidBody type="fixed">
                        <mesh receiveShadow position={[0, -0.01, 0]} rotation={[-Math.PI/2, 0, 0]}>
                            <planeGeometry args={FLOOR_SIZE} />
                            <meshStandardMaterial color={FLOOR_COLOR} roughness={0.3} metalness={0.1} />
                        </mesh>
                    </RigidBody>
                </Suspense>
            </Physics>

            <fog attach="fog" args={['#e0e0e0', 10, 50]} />
            <color attach="background" args={['#D9D9D9']} />
            <OrbitControls />
        </>
    )
}