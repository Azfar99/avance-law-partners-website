// Offline Three.js source: no Three.js code or WebGL context ships to visitors.
// Original procedural geometry; reference photos guide proportions/camera only.
import * as THREE from "/node_modules/three/build/three.module.js";

const size = 512;
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true });
renderer.setSize(size, size);
renderer.setPixelRatio(1);
renderer.setClearColor(0x000000);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;
document.body.append(renderer.domElement);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
// View from the head end: positive-X handle recedes away from the audience.
camera.position.set(-6.0, 4.0, 10.8);
camera.lookAt(0.7, 1.65, 0);

// Reflection cards give the curved gold its bright cream / antique bronze bands.
const environment = document.createElement("canvas");
environment.width = 1024;
environment.height = 512;
const ec = environment.getContext("2d");
ec.fillStyle = "#12100c";
ec.fillRect(0, 0, 1024, 512);
for (const [x, width, color] of [[70, 120, "#fff4da"], [360, 54, "#c99850"], [615, 145, "#fffaf0"], [900, 36, "#b16f2c"]]) {
  const gradient = ec.createLinearGradient(x - 35, 0, x + width + 35, 0);
  gradient.addColorStop(0, "#12100c");
  gradient.addColorStop(.22, color);
  gradient.addColorStop(.78, color);
  gradient.addColorStop(1, "#12100c");
  ec.fillStyle = gradient;
  ec.fillRect(x - 35, 45, width + 70, 370);
}
const texture = new THREE.CanvasTexture(environment);
texture.mapping = THREE.EquirectangularReflectionMapping;
texture.colorSpace = THREE.SRGBColorSpace;
const pmrem = new THREE.PMREMGenerator(renderer);
const envMap = pmrem.fromEquirectangular(texture);
scene.environment = envMap.texture;
scene.add(new THREE.HemisphereLight(0xfff3d9, 0x241307, 2.0));
for (const [position, color, intensity] of [[[1, 6, 5], 0xffe6b0, 55], [[-4, 3, 2], 0xffefce, 35], [[3, 4, -4], 0xffffff, 65]]) {
  const light = new THREE.PointLight(color, intensity, 30, 2);
  light.position.set(...position);
  scene.add(light);
}
const gold = new THREE.MeshStandardMaterial({ color: 0xc99a43, metalness: .94, roughness: .25, envMapIntensity: 1.8 });
const edge = new THREE.MeshStandardMaterial({ color: 0xe7bf6a, metalness: .95, roughness: .19, envMapIntensity: 1.65 });
const bronze = new THREE.MeshStandardMaterial({ color: 0x624018, metalness: .87, roughness: .3 });
const ebony = new THREE.MeshStandardMaterial({ color: 0x24180f, metalness: .28, roughness: .24, envMapIntensity: 1.3 });
const gavel = new THREE.Group();
gavel.scale.set(1.16, 1.02, 1.16);
scene.add(gavel);
function lathe(profile, material, parent = gavel) {
  const mesh = new THREE.Mesh(new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), 80), material);
  parent.add(mesh);
  return mesh;
}
function ring(radius, tube, y, material = edge, parent = gavel) {
  const mesh = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 8, 80), material);
  mesh.rotation.x = Math.PI / 2;
  mesh.position.y = y;
  parent.add(mesh);
  return mesh;
}
const profile = [[0,-1.13],[.59,-1.13],[.69,-1.10],[.74,-1.04],[.75,-.98],[.72,-.91],[.63,-.88],[.61,-.83],[.54,-.76],[.49,-.62],[.5,-.56],[.59,-.52],[.6,-.46],[.53,-.42],[.52,-.37],[.52,.37],[.53,.42],[.6,.46],[.59,.52],[.5,.56],[.49,.62],[.54,.76],[.61,.83],[.63,.88],[.72,.91],[.75,.98],[.74,1.04],[.69,1.10],[.59,1.13],[0,1.13]];
lathe(profile, gold);
for (const y of [-1.07,-.96,-.88,.88,.96,1.07]) ring(Math.abs(y)>.9?.728:.63,.018,y);
for (const y of [-.51,-.43,.43,.51]) ring(.572,.015,y,bronze);
// Raised fluting and small beaded rims create a rounded, ceremonial head.
for (let i=0;i<40;i++) {
  const a=i*Math.PI*2/40;
  for (const y of [-.995,.995]) {
    const bead=new THREE.Mesh(new THREE.SphereGeometry(.022,6,4),edge);
    bead.position.set(Math.cos(a)*.752,y,Math.sin(a)*.752);
    gavel.add(bead);
  }
  if (i%2===0) {
    const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(Math.cos(a)*.529,-.32,Math.sin(a)*.529),new THREE.Vector3(Math.cos(a+.07)*.536,0,Math.sin(a+.07)*.536),new THREE.Vector3(Math.cos(a)*.529,.32,Math.sin(a)*.529)]);
    gavel.add(new THREE.Mesh(new THREE.TubeGeometry(curve,12,.008,5,false),bronze));
  }
}
// Front cartouche with geometric engraving; no invented replacement brand mark.
const medallion=new THREE.Mesh(new THREE.CylinderGeometry(.23,.23,.035,48),bronze);
medallion.rotation.x=Math.PI/2;
medallion.position.set(0,0,.539);
gavel.add(medallion);
const medallionRim=new THREE.Mesh(new THREE.TorusGeometry(.222,.018,8,64),edge);
medallionRim.position.set(0,0,.563);
gavel.add(medallionRim);
const diamond=new THREE.Mesh(new THREE.OctahedronGeometry(.125),edge);
diamond.scale.set(.65,1,.16);
diamond.position.set(0,0,.576);
gavel.add(diamond);
const handle=new THREE.Group();
handle.rotation.z=-Math.PI/2-.12;
handle.position.set(.38,0,0);
gavel.add(handle);
lathe([[0,0],[.2,0],[.22,.08],[.19,.18],[.15,.28],[.125,.42],[.12,1.1],[.14,1.8],[.19,2.26],[.22,2.5],[.2,2.7],[.15,2.8],[0,2.84]],ebony,handle);
for (const [y,r] of [[.08,.225],[.21,.178],[.4,.13],[2.25,.19],[2.61,.211],[2.72,.185]]) ring(r,.025,y,edge,handle);
// Small ferrule and rounded finial echo the moulded head.
lathe([[0,2.72],[.18,2.72],[.19,2.78],[.17,2.85],[.12,2.9],[0,2.92]],gold,handle);

// A real fixed grip pivot, derived from the actual end of the handle geometry.
// Rotation is followed by the exact compensating translation, never a guessed arc.
handle.updateMatrix();
const localGrip = new THREE.Vector3(0, 2.92, 0).applyMatrix4(handle.matrix);
const scaledGrip = localGrip.clone().multiply(gavel.scale);
const restRotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -.12, 0));
const restHead = new THREE.Vector3(-.5, 1.13 * gavel.scale.y, 0);
const fixedGrip = scaledGrip.clone().applyQuaternion(restRotation).add(restHead);
// Frame the actual strike on the logo's centre line. Reframing preserves the
// approved viewing angle, swing and fixed rear pivot while moving the whole gavel.
camera.updateMatrixWorld(true);
const restContact = new THREE.Vector3(0, -1.13, 0).multiply(gavel.scale)
  .applyQuaternion(restRotation).add(restHead).project(camera);
const centreShift = -restContact.x * size / 2;
camera.setViewOffset(size, size, -centreShift, 0, size, size);
const swingAxis = new THREE.Vector3(0, 0, 1);
const ease=(a,b,t)=>a+(b-a)*t;
function setGavelPose(ms) {
  // The head winds UP around the stationary rear grip, strikes at 540ms,
  // rebounds once, then settles. There is no movement of the handle-end anchor.
  let angle;
  if(ms<260){const u=Math.max(0,ms/260);angle=ease(-.22,-.48,1-(1-u)**3);}
  else if(ms<540){const u=(ms-260)/280;angle=ease(-.48,0,u**3);}
  else if(ms<635){const u=(ms-540)/95;angle=-.09*Math.sin(u*Math.PI/2);}
  else if(ms<790){const u=(ms-635)/155;angle=ease(-.09,0,1-(1-u)**2);}
  else angle=0;
  gavel.quaternion.setFromAxisAngle(swingAxis,angle).multiply(restRotation);
  gavel.position.copy(fixedGrip).sub(scaledGrip.clone().applyQuaternion(gavel.quaternion));
  scene.updateMatrixWorld(true);
  camera.updateMatrixWorld(true);
}
window.getGavelPoseMetrics = (ms) => {
  setGavelPose(ms);
  const head=gavel.localToWorld(new THREE.Vector3());
  const grip=gavel.localToWorld(localGrip.clone());
  const contact=gavel.localToWorld(new THREE.Vector3(0,-1.13,0));
  const screen=point=>{const p=point.clone().project(camera);return [(p.x+1)*size/2,(1-p.y)*size/2];};
  return {ms,head:head.toArray(),grip:grip.toArray(),gripScreen:screen(grip),contact:contact.toArray(),contactScreen:screen(contact),headCameraDistance:camera.position.distanceTo(head),gripCameraDistance:camera.position.distanceTo(grip)};
};
window.renderGavelFrame = (ms) => {
  setGavelPose(ms);
  renderer.render(scene,camera);
  return renderer.domElement.toDataURL("image/png").split(",")[1];
};
window.renderGavelFrame(0);
window.gavelRendererReady=true;
