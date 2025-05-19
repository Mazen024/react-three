//Completed

import { useGLTF } from "@react-three/drei";
export default function LoadingModels({path, position, rotation, scale}){
    const {scene} = useGLTF(path);
    return (
        <primitive object={scene} position={position} rotation={rotation} scale={scale}/>
    );
}