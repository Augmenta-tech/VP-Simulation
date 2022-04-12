import * as THREE from 'three';

import { OrbitControls } from 'three-controls/OrbitControls.js';
import { TransformControls } from 'three-controls/TransformControls.js';

import { cameras, camMeshes } from './Camera.js';
import { dummies, dummiesMeshes } from './Dummy.js';
import { initScene } from './projection-area.js';


let SCREEN_WIDTH = window.innerWidth;
let SCREEN_HEIGHT = window.innerHeight;
let aspect = SCREEN_WIDTH / SCREEN_HEIGHT;

let container;
export let scene = new THREE.Scene();
let renderer;

let camera;

export let transformControl;
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const onUpPosition = new THREE.Vector2();
const onDownPosition = new THREE.Vector2();


init();
animate();

/* SCENE INITIALIZATION */

function init() {

    container = document.createElement( 'div' );
    let viewport = document.getElementById('viewport');
    viewport.insertBefore(container, viewport.firstChild);

    initScene(scene);

    /*
    //CHANGE HEIGHT DETECTED
        heightDetected = value;
    //MOVE WALL X
        wallXDepth = value;
        wallX.position.x = wallXDepth - 0.01;
    
    //MOVE WALL Z
        wallZDepth = value;
        wallZ.position.z = wallZDepth - 0.01;
    */
   
    // Renderer
    renderer = new THREE.WebGLRenderer( { logarithmicDepthBuffer: true, antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
    container.appendChild( renderer.domElement );

    renderer.shadowMap.enabled = true;

    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;

    renderer.autoClear = false;


    // Creation of user's camera
    camera = new THREE.PerspectiveCamera( 70, aspect, 1, 10000 );
    camera.position.set(6,6,6); //height and retreat

    // Controls
    const controls = new OrbitControls( camera, renderer.domElement );
    controls.damping = 0.2;
    controls.addEventListener( 'change', render );

    transformControl = new TransformControls( camera, renderer.domElement );
    transformControl.addEventListener( 'change', render );
    transformControl.addEventListener( 'dragging-changed', function ( event ) {

        controls.enabled = ! event.value;

    } );
    scene.add( transformControl );

    transformControl.addEventListener( 'objectChange', function (obj) {

        cameras.forEach(c => c.updatePosition());
        dummies.forEach(d => d.updatePosition());

    } );

    
    document.addEventListener( 'pointerdown', onPointerDown );
    document.addEventListener( 'pointerup', onPointerUp );
    document.addEventListener( 'pointermove', onPointerMove );
    
    window.addEventListener( 'resize', onWindowResize );

    //DEBUG
    document.addEventListener( 'keydown', onKeyDown );

}

/* USER'S ACTIONS */

function onPointerDown( event ) {
    onDownPosition.x = event.clientX;
    onDownPosition.y = event.clientY;

}

function onPointerUp() {
    onUpPosition.x = event.clientX;
    onUpPosition.y = event.clientY;

    if ( onDownPosition.distanceTo( onUpPosition ) === 0 ) transformControl.detach();
}

function onPointerMove( event ) {

    pointer.x = (event.clientX / document.getElementById('viewport').offsetWidth) * 2 - 1;
    pointer.y = - ((event.clientY - document.getElementById('header').offsetHeight) / document.getElementById('viewport').offsetHeight) * 2 + 1;
    
    raycaster.setFromCamera( pointer, camera );

    const meshes = camMeshes.concat(dummiesMeshes);

    const intersects = raycaster.intersectObjects( meshes, false );

    if(intersects.length > 0) {
        const object = intersects[ 0 ].object;
        if (object !== transformControl.object) {
            transformControl.attach( object );
            if(object.name === 'Dummy') transformControl.showY = false;
            if(object.name === 'Camera') transformControl.showY = true;
        }
    }
}

function onWindowResize() {

    SCREEN_WIDTH = window.innerWidth;
    SCREEN_HEIGHT = window.innerHeight;
    aspect = SCREEN_WIDTH / SCREEN_HEIGHT;

    renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );

    camera.aspect = aspect;
    camera.updateProjectionMatrix();
}

/* RESET CAMERAS */
document.getElementById('delete-cameras').onclick = resetCams;
function resetCams()
{
    let camerasUIdivs = document.getElementsByClassName("cameraUI");
    for(let i = camerasUIdivs.length - 1; i >= 0; i--)
    {
        camerasUIdivs[i].remove();
    }
    cameras.forEach(c => c.remove());
    cameras.splice(0, cameras.length);
    camMeshes.splice(0, camMeshes.length);
}

//DEBUG
function onKeyDown( event ) {

    switch ( event.keyCode ) {

        case 80: /*P*/
            
            console.log(totalAreaCovered());
            break;

    }

}

/* RENDER */
function animate() {

    requestAnimationFrame( animate );

    render();

}

function render() {
    cameras.forEach(c => c.render());
    //cameras.forEach(c => c.displayOverlaps());

    renderer.clear();

    renderer.setViewport( 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT );
    renderer.render( scene, camera )
}

