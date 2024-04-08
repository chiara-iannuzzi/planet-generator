import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js'
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'
import GUI from 'lil-gui'
import planetVertexShader from './shaders/planet/vertex.glsl'
import planetFragmentShader from './shaders/planet/fragment.glsl'

import atmosphereVertexShader from './shaders/atmosphere/vertex.glsl'
import atmosphereFragmentShader from './shaders/atmosphere/fragment.glsl'

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 325 })
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Loaders
const rgbeLoader = new RGBELoader()

/**
 * Planet
 */

debugObject.colorWaterDeep = '#002b3d'
debugObject.colorWaterSurface = '#66a8ff'
debugObject.colorSand = '#ffe894'
debugObject.colorGrass = '#85d534'
debugObject.colorSnow = '#ffffff'
debugObject.colorRock = '#bfbd8d'

const uniforms = {
    uTime: new THREE.Uniform(0),

    uColorWaterDeep : new THREE.Uniform(new THREE.Color(debugObject.colorWaterSurface)),
    uColorWaterSurface : new THREE.Uniform(new THREE.Color(debugObject.colorWaterSurface)),
    uColorSand : new THREE.Uniform(new THREE.Color(debugObject.colorSand)),
    uColorGrass : new THREE.Uniform(new THREE.Color(debugObject.colorGrass)),
    uColorSnow : new THREE.Uniform(new THREE.Color(debugObject.colorSnow)),
    uColorRock : new THREE.Uniform(new THREE.Color(debugObject.colorRock)),

    uStrength: new THREE.Uniform(1),
    uTimeFrequency: new THREE.Uniform(0.4),
    uPositionFrequency: new THREE.Uniform(0.5),
    uWaterQuantity: new THREE.Uniform(0),

    uWarpedStrength: new THREE.Uniform(1.7),
    uWarpedTimeFrequency: new THREE.Uniform(0.12),
    uWarpedPositionFrequency: new THREE.Uniform(0.38),
}

// Material
const material = new CustomShaderMaterial({
    // CSM
    baseMaterial: THREE.MeshPhysicalMaterial,
    vertexShader: planetVertexShader,
    fragmentShader: planetFragmentShader,
    uniforms: uniforms,
    silent: true,

    //MeshPhysical
    metalness: 0,
    roughness: 0.5,
    color: '#ffffff',
    transmission: 0,
    ior: 1.5,
    thickness: 1.5,
    transparent: true,
    wireframe: false
})

const depthMaterial = new CustomShaderMaterial({
    // CSM
    baseMaterial: THREE.MeshDepthMaterial,
    vertexShader: planetVertexShader,
    uniforms: uniforms,
    silent: true,

    //MeshDepthMaterial
    depthPacking: THREE.RGBADepthPacking
})

// Geometry
let geometry = new THREE.IcosahedronGeometry(2.5, 100)
geometry = mergeVertices(geometry)
geometry.computeTangents(geometry.attributes)

//Mesh
const planet = new THREE.Mesh(geometry, material)
planet.customDepthMaterial = depthMaterial;
planet.receiveShadow = true
planet.castShadow = true
scene.add(planet)

// Tweaks
gui.add(uniforms.uPositionFrequency, 'value', 0, 2, 0.001).name('uPositionFrequency')
gui.add(uniforms.uStrength, 'value', 0, 2, 0.001).name('uStrength')
gui.add(uniforms.uTimeFrequency, 'value', 0, 2, 0.001).name('uTimeFrequency')
gui.add(uniforms.uWaterQuantity, 'value', 0, 0.1, 0.0001).name('uWaterQuantity')

gui.add(material, 'metalness', 0, 1, 0.001)
gui.add(material, 'roughness', 0, 1, 0.001)
gui.add(material, 'transmission', 0, 1, 0.001)
gui.add(material, 'ior', 0, 10, 0.001)
gui.add(material, 'thickness', 0, 10, 0.001)

gui.addColor(debugObject, 'colorWaterDeep').onChange(() => {
    uniforms.uColorWaterDeep.value.set(debugObject.colorWaterDeep)
})
gui.addColor(debugObject, 'colorWaterSurface').onChange(() => {
    uniforms.uColorWaterSurface.value.set(debugObject.colorWaterSurface)
})
gui.addColor(debugObject, 'colorSand').onChange(() => {
    uniforms.uColorSand.value.set(debugObject.colorSand)
})
gui.addColor(debugObject, 'colorGrass').onChange(() => {
    uniforms.uColorGrass.value.set(debugObject.colorGrass)
})
gui.addColor(debugObject, 'colorSnow').onChange(() => {
    uniforms.uColorSnow.value.set(debugObject.colorSnow)
})
gui.addColor(debugObject, 'colorRock').onChange(() => {
    uniforms.uColorRock.value.set(debugObject.colorRock)
})

/**
 * Water
 */

const water = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({
        transmission: 1,
        roughness: 0.3,
        color: debugObject.colorWaterSurface,
        transparent: true,
        opacity: 0.8
    })
)
water.scale.set(0.98, 0.98, 0.98)
scene.add(water)

/**
 * Atmosphere
 */
debugObject.atmosphereColor = '#bfbd8d'

const atmosphereUniforms = {
    uAtmosphereColor: new THREE.Uniform(new THREE.Color('#ffffff'))
}
const atmosphereMaterial = new CustomShaderMaterial({
    // CSM
    baseMaterial: THREE.MeshPhysicalMaterial,
    uniforms: atmosphereUniforms,
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    silent: true,

    //MeshPhysical
    metalness: 0,
    roughness: 0.5,
    color: '#ffffff',
    transmission: 0,
    ior: 1.5,
    thickness: 1.5,
    transparent: true,
    wireframe: false,
    side: THREE.BackSide
})

const atmosphere = new THREE.Mesh(geometry, atmosphereMaterial)
atmosphere.scale.set(1.3, 1.3, 1.3);
scene.add(atmosphere)

//Tweaks
gui.addColor(debugObject, 'atmosphereColor').onChange(() => {
    atmosphereUniforms.uAtmosphereColor.value.set(debugObject.atmosphereColor)
})

/**
 * Sun
 */
// const sun = new Mesh

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 2, - 2.25)
scene.add(directionalLight)

const ambientLight = new THREE.AmbientLight('#ffffff', 3)
scene.add(ambientLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    sizes.pixelRatio = Math.min(window.devicePixelRatio, 2)

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(sizes.pixelRatio)
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.set(13, - 3, - 5)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(sizes.pixelRatio)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    //Material update
    uniforms.uTime.value = elapsedTime;

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()