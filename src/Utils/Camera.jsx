//Completed

import { useFrame } from '@react-three/fiber';
import { useState, useEffect, useRef } from 'react';
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';

function CameraControls() {
  const [moveForward, setMoveForward] = useState(false);
  const [moveBackward, setMoveBackward] = useState(false);
  const [moveLeft, setMoveLeft] = useState(false);
  const [moveRight, setMoveRight] = useState(false);
  const speed = 0.03;
  const direction = new THREE.Vector3();
  const velocity = new THREE.Vector3();
  const cameraRef = useRef();
  const { camera, scene } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  useEffect(() => {
    camera.position.set(0, 0.5, 0); 
  }, [camera]);
  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'w':
          setMoveForward(true);
          break;
        case 's':
          setMoveBackward(true);
          break;
        case 'a':
          setMoveLeft(true);
          break;
        case 'd':
          setMoveRight(true);
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (event) => {
      switch (event.key) {
        case 'w':
          setMoveForward(false);
          break;
        case 's':
          setMoveBackward(false);
          break;
        case 'a':
          setMoveLeft(false);
          break;
        case 'd':
          setMoveRight(false);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame(({ camera }) => {
    direction.set(0, 0, 0);
    if (moveForward) direction.z -= 1;
    if (moveBackward) direction.z += 1;
    if (moveLeft) direction.x -= 1;
    if (moveRight) direction.x += 1;

    direction.normalize();
    direction.applyEuler(camera.rotation);

    velocity.x = direction.x * speed;
    velocity.z = direction.z * speed;

    const newPosition = {
      x: camera.position.x + velocity.x,
      y: 0.5,
      z: camera.position.z + velocity.z,
    };

    raycaster.current.set(camera.position, direction);
    const intersects = raycaster.current.intersectObjects(scene.children, true);

    if (intersects.length === 0 || intersects[0].distance > 1) {
      camera.position.set(newPosition.x, newPosition.y, newPosition.z);
    }
  });

  return <RigidBody ref={cameraRef} type='dynamic' colliders='hull'/>
}
export default CameraControls;