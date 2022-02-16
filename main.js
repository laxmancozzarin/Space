import * as THREE from "https://unpkg.com/three@0.126.1/build/three.module.js";
import {OrbitControls} from "https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js";
 
//import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";

const mouse = {
    x: undefined,
    y: undefined
}
addEventListener('mousemove', (event) =>{
    //normalized mouse x y
    mouse.x = event.clientX / innerWidth * 2 - 1;
    mouse.y = -(event.clientY / innerHeight) * 2 + 1;
    //console.log(mouse);
})

//inizializzo scena, camera e renderer
const raycaster = new THREE.Raycaster();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 1, 2000);
camera.position.z = 15;
camera.position.y = 1;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement);


//mi permette di roteare: ricordati di importare OrbitControl
//new OrbitControls(camera, renderer.domElement);

//luce dietro con -1
const backLight = new THREE.DirectionalLight(0xffffff, 1);
backLight.position.set(0, 0, -1);
scene.add(backLight);

//luce frontale con 1
const frontLight = new THREE.DirectionalLight(0xffffff, 1);
frontLight.position.set(0, 0, 1);
scene.add(frontLight);

//pianeta di roccia
const planetGeometry = new THREE.SphereGeometry( 10, 10, 10 );
const planetTexture = new THREE.TextureLoader().load("texture3.jpeg");
const planetMaterial = new THREE.MeshPhongMaterial({
    map: planetTexture
});
const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
scene.add(planetMesh);
planetMesh.position.set(500, 600, -1100); 
planetMesh.scale.set(10.5, 10.5, 10.5);

//sole
const greenGeometry = new THREE.SphereGeometry( 10, 10, 10 );
const greenTexture = new THREE.TextureLoader().load("texture2.jpeg");
const greenMaterial = new THREE.MeshPhongMaterial({
    map: greenTexture
});
const greenMesh = new THREE.Mesh(greenGeometry, greenMaterial);
scene.add(greenMesh);
greenMesh.position.set(-200, 1000, -1500); 
greenMesh.scale.set(8.5, 8.5, 8.5);


//creo il piano
const planeGeometry = new THREE.PlaneGeometry(200, 200, 200, 200);
const planeTexture = new THREE.TextureLoader().load("texture2.jpeg");
const planeMaterial = new THREE.MeshPhongMaterial({
    map: planeTexture,
    side: THREE.DoubleSide,
    flatShading: THREE.FlatShading,
    vertexColors: true
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);

planeMesh.rotation.x -= 1.5;
//mi serve per capire la posizione della giometria del piano
console.log(planeMesh.geometry.attributes.position.array);


//stelle
var spheres = [];

const color = [];
for(let i = 0; i < planeMesh.geometry.attributes.position.count; i++){
    color.push(0.66, 0.135, 0.245);
}

//lavoro sulla giometria del piano
const {array} = planeMesh.geometry.attributes.position;
for(let i = 0; i < array.length; i += 3){
    const x = array[i];
    const y = array[i + 1];
    const z = array[i + 2];
    array[i + 2] = z + Math.random();
}

//aggiungo color attribute a planeMesh
planeMesh.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(color), 3));
console.log(planeMesh.geometry.attributes);

scene.add(planeMesh);


//funzione che anima 
function animate(){
    renderer.render(scene, camera);

    //raycaster e objectIntersect
    raycaster.setFromCamera(mouse, camera); //metto il laser
    const intersects = raycaster.intersectObject(planeMesh);

    if(intersects.length > 0){
        const {color} = intersects[0].object.geometry.attributes;
        //array composto [Red0, Green0, Blue0]
        //cambio il colore di tutti i vertici del piano

        //vertice 1
        color.setX(intersects[0].face.a, 0.1);
        color.setY(intersects[0].face.a, 0.5);
        color.setZ(intersects[0].face.b, 1);
        //vertice 2
        color.setX(intersects[0].face.b, 0.1);
        color.setY(intersects[0].face.b, 0.5);
        color.setZ(intersects[0].face.b, 1);
        //vertice 3
        color.setX(intersects[0].face.c, 0.1);
        color.setY(intersects[0].face.c, 0.5);
        color.setZ(intersects[0].face.c, 1);

        intersects[0].object.geometry.attributes.color.needsUpdate = true;
    }

    if(camera.position.y <= 6){
        camera.position.z -= 0.01;
        camera.position.y += 0.008;
        camera.rotation.x += 0.0003;


        // console.log(camera.position);
    }

    planetMesh.rotation.x += 0.0001;
    planetMesh.rotation.y += 0.007;
    greenMesh.rotation.x += 0.001;
    greenMesh.rotation.y += 0.01;

    window.requestAnimationFrame(animate);
}
animate();  

for(let i = 0; i < 1000; i++){
    const sphereGeometry = new THREE.SphereGeometry(0.1 * randomArbitrary(1, 0.1), 6, 6);
    const sphereMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(1, randomArbitrary(190, 220) / 255, Math.round(Math.random()))
    });

    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);
    spheres.push(sphere);
    sphere.position.setFromSpherical(new THREE.Spherical(70 + 100 * Math.random(), 2 * Math.PI * Math.random(), 2 * Math.PI * Math.random()));
}

function randomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}




