const PATH_TO_BAGSSTORE_MODEL = '../../Assets/3D_Models/BagsShop/scene.gltf';

const BAGSSTORE_SHOP_POSITION = [0, 1.5, 0];
const BAGSSTORE_SHOP_ROTATION = [0, 0, 0]; 
const AMBIENT_LIGHT_INTENSITY = 1.5;
const BAGSSTORE_SHOP_SCALE = [4.5, 4.5, 4.5];
const FLOOR_SIZE = [50, 50];
const FLOOR_COLOR = '#ffffff';
const DEFAULT_CAMERA_POSITION = [3,3,3];
const BAGS_ITEMS_CONFIG = [
    
    {
        path: '../../Assets/3D_Models/Bags/Bag13/scene.gltf',
        position: [0, 0.83, 2.6],
        rotation: [0, -Math.PI/6, 0],
        scale: [0.38, 0.38,0.38]
    },
    {
        path: '../../Assets/3D_Models/Bags/Bag10/scene.gltf',
        position: [0,  0.8, 3.1],
        rotation: [0, -Math.PI/6, 0],
        scale: [0.16, 0.16, 0.16]
    },
    {
path: '../../Assets/3D_Models/Bags/Bag12/scene.gltf',
position: [0,  0.85, 3.5],
rotation: [0, -Math.PI/6, 0],
scale: [0.13, 0.13, 0.13]
},
  //   {
  //     path: '../../Assets/3D_Models/Bags/Bag5/scene.gltf',
  //     position: [1.75 ,1.344, 1.25],
  //     rotation: [0, -Math.PI/6, 0],
  //     scale: [0.3, 0.3, 0.3]
  // },
//   {
//     path: '../../Assets/3D_Models/Bags/Bag7/scene.gltf',
//     position: [1.75 ,1.344, 2],
//     rotation: [0, -Math.PI/6, 0],
//     scale: [0.3, 0.3, 0.3]
// },
// {
//   path: '../../Assets/3D_Models/Bags/Bag1/scene.gltf',
//   position: [1.75 ,1.344, 2.7],
//   rotation: [0, -Math.PI/6, 0],
//   scale: [0.3, 0.3, 0.3]
// },
{
  path: '../../Assets/3D_Models/Bags/Bag5/scene.gltf',
  position: [1.75 ,1.344, 3.4],
  rotation: [0, -Math.PI/6, 0],
  scale: [0.3, 0.3, 0.3]
},

// {
// path: '../../Assets/3D_Models/Bags/Bag1/scene.gltf',
// position: [1.75 ,1.344, 3.5],
// rotation: [0, -Math.PI/6, 0],
// scale: [0.3, 0.3, 0.3]
// },
{
path: '../../Assets/3D_Models/Bags/Bag8/scene.gltf',
position: [1.75 ,1.0, 3.6],
rotation: [0, -Math.PI/6, 0],
scale: [0.13, 0.13, 0.13]
},
{
path: '../../Assets/3D_Models/Bags/Bag9/scene.gltf',
position: [1.75 ,1.0, 2.8],
rotation: [0, -Math.PI/6, 0],
scale: [0.13, 0.13, 0.13]
},
{
path: '../../Assets/3D_Models/Bags/Bag11 (2)/scene.gltf',
position: [1.3 ,0.025, 1.9],
rotation: [0, -Math.PI/6, 0],
scale: [0.3, 0.3, 0.3]
},
{
  path: '../../Assets/3D_Models/Bags/Bag1/scene.gltf',
  position: [1.75 ,0.83, 1.4],
  rotation: [0, -Math.PI/6, 0],
  scale: [0.3, 0.3, 0.3]
},
// {
// path: '../../Assets/3D_Models/Bags/Bag9/scene.gltf',
// position: [-3.9 ,1.37, 1.5],
// rotation: [0, Math.PI/6, 0],
// scale: [0.13, 0.13, 0.13]
// },
// {
// path: '../../Assets/3D_Models/Bags/Bag8/scene.gltf',
// position: [-3.9 ,1.37, 2.8],
// rotation: [0, Math.PI/6, 0],
// scale: [0.13, 0.13, 0.13]
// },
{
path: '../../Assets/3D_Models/Bags/Bag7/scene.gltf',
position: [-3.9 ,1.2, 2.24],
rotation: [0, Math.PI/6, 0],
scale: [0.3, 0.3, 0.3]
},
{
  path: '../../Assets/3D_Models/Bags/planta/scene.gltf',
  position: [1.6 ,0.2, 0.6],
  rotation: [0, 0, 0],
  scale: [0.45, 0.45, 0.45]
},
{
  path: '../../Assets/3D_Models/Bags/planta/scene.gltf',
  position: [-3 ,0.2, 0.6],
  rotation: [0, 0, 0],
  scale: [0.45, 0.45, 0.45]
}
    
];

export {
    PATH_TO_BAGSSTORE_MODEL,
    BAGSSTORE_SHOP_POSITION,
    BAGSSTORE_SHOP_ROTATION,
    AMBIENT_LIGHT_INTENSITY,
    BAGSSTORE_SHOP_SCALE,
    FLOOR_SIZE,
    FLOOR_COLOR,
    BAGS_ITEMS_CONFIG
}