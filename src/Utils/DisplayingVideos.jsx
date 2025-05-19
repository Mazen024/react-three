//Not Completed yet

import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { PositionalAudio } from '@react-three/drei';
export default function VideoMesh({position, rotation, scale, isPlayed}) {
  const meshRef = useRef();
  const audioRef = useRef();
  const video = document.createElement('video');
  audio.src = '../../Assets/Audio/Audio2.mp3';
  audio.volume = 0.5;
  video.src = '../../Assets/Video/video2.mp4';
  video.crossOrigin = 'anonymous';
  video.muted = true;
  useEffect(() => {
    const audio = audioRef.current;
    if(audio){
      console.log()
    }
    if(isPlayed && video){
      setInterval(() => {
        video.play();
        console.log(video.duration);
      }, video.duration * 1000)
    }
  }, [])
  const texture = new THREE.VideoTexture(video);
  return (
    <>
      <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
        <boxGeometry args={[3, 3, 0]} />
        <meshBasicMaterial map={texture} color="white" />
        <PositionalAudio
          ref={audioRef}
          url="../../Assets/Audio/Audio2.mp3"
          distanceModel='linear'
          maxDistance={1}
          refDistance={1}
        />
      </mesh>
    </>
  );
}