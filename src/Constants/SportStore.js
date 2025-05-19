const PATH_TO_SPORTSTORE_MODEL = '../../Assets/3D_Models/SportShop/Shop/Untitled.gltf';
const SPORTSTORE_SHOP_POSITION = [0, 0, 0];
const SPORTSTORE_SHOP_ROTATION = [0, 0, 0]; 
const AMBIENT_LIGHT_INTENSITY = 1.5;
const SPORTSTORE_SHOP_SCALE = [4.5, 4.5, 4.5];
const FLOOR_SIZE = [50, 50];
const FLOOR_COLOR = '#ffffff';
const DEFAULT_CAMERA_POSITION = [3,3,3];
const SPORTS_ITEMS_CONFIG = [
    {
        path: '../../Assets/3D_Models/SportShop/Dynamic_Objects/american_ball/scene.gltf',
        position: [-0.251, 0.1, -0.43],
        rotation: [0, 0, 0],
        scale: [0.00714, 0.00714, 0.00714]
    },
    {
      path: '../../Assets/3D_Models/SportShop/Dynamic_Objects/american_ball/scene.gltf',
      position: [-0.351, 0.1, -0.429],
      rotation: [0, Math.PI/2, 0],
      scale: [0.00714, 0.00714, 0.00714]
    },
    {
        path: '../../Assets/3D_Models/SportShop/Dynamic_Objects/dumbel/scene.gltf',
        position: [0.66, 0.6, -0.44],
        rotation: [0, 0, 0],
        scale: [0.08, 0.08, 0.08]
    },
    {
      path: '../../Assets/3D_Models/SportShop/Dynamic_Objects/dumbel/scene.gltf',
      position: [0.86, 0.6, -0.44],
      rotation: [0, 0, 0],
      scale: [0.08, 0.08, 0.08]
  },
  {
    path: '../../Assets/3D_Models/SportShop/Dynamic_Objects/dumble3/scene.gltf',
    position: [0.645, 0.33, -0.44],
    rotation: [0, 0, 0],
    scale: [0.59, 0.59, 0.59]
  },
  {
  path: '../../Assets/3D_Models/SportShop/Dynamic_Objects/bicycle/scene.gltf',
  position: [-1.044, 0.1, -0.30],
  rotation: [0,Math.PI/3, 0],
  scale: [0.03, 0.03, 0.03]
  },
 {
  path: '../../Assets/3D_Models/SportShop/Dynamic_Objects/bicycle/scene.gltf',
  position: [-0.97, 0.1, -0.30],
  rotation: [0,Math.PI/3, 0],
  scale: [0.03, 0.03, 0.03]
},
{
  path: '../../Assets/3D_Models/SportShop/Dynamic_Objects/bicycle/scene.gltf',
  position: [-0.89, 0.1, -0.30],
  rotation: [0,Math.PI/3, 0],
  scale: [0.03, 0.03, 0.03]
},
{
  path: '../../Assets/3D_Models/SportShop/Dynamic_Objects/bicycle_helmet/scene.gltf',
  position: [-0.83, 0.44, -0.43],
  rotation: [Math.PI/2,0, 0],
  scale: [0.019, 0.019, 0.019]
},
{
  path: '../../Assets/3D_Models/SportShop/Dynamic_Objects/bicycle_helmet/scene.gltf',
  position: [-0.9, 0.44, -0.43],
  rotation: [Math.PI/2,0, 0],
  scale: [0.019, 0.019, 0.019]
},
{
  path: '../../Assets/3D_Models/SportShop/Dynamic_Objects/bicycle_helmet/scene.gltf',
  position: [-0.97, 0.44, -0.43],
  rotation: [Math.PI/2,0, 0],
  scale: [0.019, 0.019, 0.019]
},
{
  path: '../../Assets/3D_Models/SportShop/Dynamic_Objects/bottle/scene.gltf',
  position: [-0.963, 0.59, -0.43],
  rotation: [0,0, 0],
  scale: [0.25, 0.25, 0.25]
},
{
  path: '../../Assets/3D_Models/SportShop/Dynamic_Objects/bottle/scene.gltf',
  position: [-0.94, 0.59, -0.455],
  rotation: [0, 0, 0],
  scale: [0.25, 0.25, 0.25]
},
{
  path: '../../Assets/3D_Models/SportShop/Dynamic_Objects/bottle/scene.gltf',
  position: [-0.92, 0.59, -0.43],
  rotation: [0,0, 0],
  scale: [0.25, 0.25, 0.25]
},
{
  path: '../../Assets/3D_Models/SportShop/Dynamic_Objects/bottle/scene.gltf',
  position: [-0.9, 0.59, -0.455],
  rotation: [0, 0, 0],
  scale: [0.25, 0.25, 0.25]
},
{
  path: '../../Assets/3D_Models/SportShop/Dynamic_Objects/bottle/scene.gltf',
  position: [-0.88, 0.59, -0.43],
  rotation: [0,0, 0],
  scale: [0.25, 0.25, 0.25]
},
{
  path: '../../Assets/3D_Models/SportShop/Dynamic_Objects/bottle/scene.gltf',
  position: [-0.86, 0.59, -0.455],
  rotation: [0, 0, 0],
  scale: [0.25, 0.25, 0.25]
},
{
  path: '../../Assets/3D_Models/SportShop/Dynamic_Objects/bottle/scene.gltf',
  position: [-0.84, 0.59, -0.43],
  rotation: [0,0, 0],
  scale: [0.25, 0.25, 0.25]
},
{
  path: '../../Assets/3D_Models/SportShop/Dynamic_Objects/skateboard/scene.gltf',
  position: [-0.7, 0.25, -0.43],
  rotation: [Math.PI/2,Math.PI/2, 0],
  scale: [0.1, 0.1, 0.1]
},
{
  path: '../../Assets/3D_Models/SportShop/Dynamic_Objects/skateboard/scene.gltf',
  position: [-0.7, 0.25, -0.42],
  rotation: [Math.PI/2,Math.PI/3, 0],
  scale: [0.1, 0.1, 0.1]
},
{
  path: '../../Assets/3D_Models/SportShop/Dynamic_Objects/skateboard/scene.gltf',
  position: [-0.57, 0.25, -0.43],
  rotation: [Math.PI/2,Math.PI/2, 0],
  scale: [0.1, 0.1, 0.1]
},
{
  path: '../../Assets/3D_Models/SportShop/Dynamic_Objects/skateboard/scene.gltf',
  position: [-0.6, 0.12, -0.39],
  rotation: [0,0, 0],
  scale: [0.1, 0.1, 0.1]
},
{
  path: '../../Assets/3D_Models/SportShop/Dynamic_Objects/5_kg_dumbells/scene.gltf',
  position: [0.6, 0.08, -0.39],
  rotation: [0,0, 0],
  scale: [0.007, 0.007, 0.007]
 },
 {
  path: '../../Assets/3D_Models/SportShop/Dynamic_Objects/helmet/scene.gltf',
  position: [0.28, 0.367, 0.77],
  rotation: [0,Math.PI/2, 0],
  scale: [0.019, 0.019, 0.019]
},
{
  path: '../../Assets/3D_Models/SportShop/Dynamic_Objects/helmet/scene.gltf',
  position: [0.3418, 0.367, 0.77],
  rotation: [0,Math.PI/2, 0],
  scale: [0.019, 0.019, 0.019]
},
{
  path: '../../Assets/3D_Models/SportShop/Dynamic_Objects/helmet/scene.gltf',
  position: [0.405, 0.367, 0.77],
  rotation: [0,Math.PI/2, 0],
  scale: [0.019, 0.019, 0.019]
},
 {
  path: '../../Assets/3D_Models/SportShop/Dynamic_Objects/sports_bag/scene.gltf',
  position: [-0.18, 0.07, 0.77],
  rotation: [0,0, 0],
  scale: [0.3, 0.3, 0.3]
},
{
  path: '../../Assets/3D_Models/SportShop/Dynamic_Objects/sports_bag/scene.gltf',
  position: [-0.18, 0.16, 0.77],
  rotation: [0,0, 0],
  scale: [0.3, 0.3, 0.3]
},
{
  path: '../../Assets/3D_Models/SportShop/Dynamic_Objects/tennis_ball/scene.gltf',
  position: [0.25, 0.08, 0.77],
  rotation: [0,0, 0],
  scale: [0.005,0.005, 0.005]
},
{
  path: '../../Assets/3D_Models/SportShop/Dynamic_Objects/tenniscontainer/scene.gltf',
  position: [0.2, 0.08, 0.77],
  rotation: [0,0, 0],
  scale: [0.00007,0.00007, 0.00007]
},
{
  path: '../../Assets/3D_Models/SportShop/Dynamic_Objects/freestyle_ski/scene.gltf',
  position: [0.59,0.28, 0.75],
  rotation: [0,Math.PI/2, Math.PI/10],
  scale: [0.081,0.081,0.081]
},
{
  path: '../../Assets/3D_Models/SportShop/Dynamic_Objects/freestyle_ski/scene.gltf',
  position: [0.68,0.28, 0.75],
  rotation: [0,Math.PI/2, Math.PI/10],
  scale: [0.081,0.081,0.081]
},

 {
  path: '../../Assets/3D_Models/SportShop/Dynamic_Objects/baseball_bat/scene.gltf',
  position: [0.943, 0.687, 0.62],
  rotation: [Math.PI/2 ,0, 0],
  scale: [0.2,0.2, 0.2]
 },
 {
  path: '../../Assets/3D_Models/SportShop/Dynamic_Objects/baseball_bat/scene.gltf',
  position: [0.943, 0.687, 0.6],
  rotation: [Math.PI/2 ,0, 0],
  scale: [0.2,0.2, 0.2]
 },
 {
  path: '../../Assets/3D_Models/SportShop/Dynamic_Objects/baseball_bat/scene.gltf',
  position: [0.943, 0.687, 0.58],
  rotation: [Math.PI/2 ,0, 0],
  scale: [0.2,0.2, 0.2]
 },
 {
  path: '../../Assets/3D_Models/SportShop/Dynamic_Objects/baseball_bat/scene.gltf',
  position: [0.943, 0.694, 0.61],
  rotation: [Math.PI/2 ,0, 0],
  scale: [0.2,0.2, 0.2]
 },
 {
  path: '../../Assets/3D_Models/SportShop/Dynamic_Objects/baseball_bat/scene.gltf',
  position: [0.943, 0.694, 0.59],
  rotation: [Math.PI/2 ,0, 0],
  scale: [0.2,0.2, 0.2]
 },
 {
  path: '../../Assets/3D_Models/SportShop/Dynamic_Objects/baseball_bat/scene.gltf',
  position: [0.943, 0.702, 0.6],
  rotation: [Math.PI/2 ,0, 0],
  scale: [0.2,0.2, 0.2]
 },
 {
  path: '../../Assets/3D_Models/SportShop/Dynamic_Objects/football_helmet/scene.gltf',
  position: [0.97, 0.35, 0.77],
  rotation: [-Math.PI/2 ,0, 0],
  scale: [0.02,0.02, 0.02]
 },
 {
  path: '../../Assets/3D_Models/SportShop/Dynamic_Objects/football_helmet/scene.gltf',
  position: [0.9, 0.35, 0.77],
  rotation: [-Math.PI/2 ,0, 0],
  scale: [0.02,0.02, 0.02]
 },
 {
  path: '../../Assets/3D_Models/SportShop/Dynamic_Objects/football_helmet/scene.gltf',
  position: [0.83, 0.35, 0.77],
  rotation: [-Math.PI/2 ,0, 0],
  scale: [0.02,0.02, 0.02]
 },
 {
  path: '../../Assets/3D_Models/SportShop/Dynamic_Objects/football_helmet/scene.gltf',
  position: [0.97, 0.45, 0.77],
  rotation: [-Math.PI/2 ,0, 0],
  scale: [0.02,0.02, 0.02]
 },
 {
  path: '../../Assets/3D_Models/SportShop/Dynamic_Objects/football_helmet/scene.gltf',
  position: [0.9, 0.45, 0.77],
  rotation: [-Math.PI/2 ,0, 0],
  scale: [0.02,0.02, 0.02]
 },
 {
  path: '../../Assets/3D_Models/SportShop/Dynamic_Objects/football_helmet/scene.gltf',
  position: [0.83, 0.45, 0.77],
  rotation: [-Math.PI/2 ,0, 0],
  scale: [0.02,0.02, 0.02]
 },
 {
  path: '../../Assets/3D_Models/SportShop/Dynamic_Objects/soccer_ball/scene.gltf',
  position: [-0.89, 0.635, 0.77],
  rotation: [-Math.PI/2 ,0, 0],
  scale: [0.3,0.3, 0.3]
 },
 {
  path: '../../Assets/3D_Models/SportShop/Dynamic_Objects/soccer_ball/scene.gltf',
  position: [-0.815, 0.635, 0.77],
  rotation: [-Math.PI/2 ,0, 0],
  scale: [0.3,0.3, 0.3]
 },
 {
  path: '../../Assets/3D_Models/SportShop/Dynamic_Objects/soccer_ball/scene.gltf',
  position: [-0.74, 0.635, 0.77],
  rotation: [-Math.PI/2 ,0, 0],
  scale: [0.3,0.3, 0.3]
 },
 {
  path: '../../Assets/3D_Models/SportShop/Dynamic_Objects/soccer_ball/scene.gltf',
  position: [-0.665, 0.635, 0.77],
  rotation: [-Math.PI/2 ,0, 0],
  scale: [0.3,0.3, 0.3]
 },
 {
  path: '../../Assets/3D_Models/SportShop/Dynamic_Objects/soccer_ball/scene.gltf',
  position: [-0.59, 0.635, 0.77],
  rotation: [-Math.PI/2 ,0, 0],
  scale: [0.3,0.3, 0.3]
 },
 {
  path: '../../Assets/3D_Models/SportShop/Dynamic_Objects/soccer_ball/scene.gltf',
  position: [-0.7, 0.69, 0.77],
  rotation: [-Math.PI/2 ,0, 0],
  scale: [0.3,0.3, 0.3]
 }
];

export {
    PATH_TO_SPORTSTORE_MODEL,
    SPORTSTORE_SHOP_POSITION,
    SPORTSTORE_SHOP_ROTATION,
    AMBIENT_LIGHT_INTENSITY,
    SPORTSTORE_SHOP_SCALE,
    FLOOR_SIZE,
    FLOOR_COLOR,
    SPORTS_ITEMS_CONFIG
}