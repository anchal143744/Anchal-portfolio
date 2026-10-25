import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

// Procedural objects: edit dimensions, positions and materials here; no external models.
export function createGalleryScene(host: HTMLElement) {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, .1, 50); camera.position.set(0, 1.4, 8);
  camera.lookAt(0, 0, 0);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x67615a, 3));
  const key = new THREE.DirectionalLight(0xffffff, 5); key.position.set(-3, 5, 4); scene.add(key);
  const rim = new THREE.DirectionalLight(0xff8a3a, 2); rim.position.set(4, 0, 2); scene.add(rim);
  const materials = [new THREE.MeshStandardMaterial({ color: 0xd9dbde, metalness: .55, roughness: .32 }), new THREE.MeshStandardMaterial({ color: 0xf4f0e5, roughness: .5 }), new THREE.MeshStandardMaterial({ color: 0x262624, roughness: .38 }), new THREE.MeshStandardMaterial({ color: 0xff6800, roughness: .4 })];
  const groups = Array.from({ length: 4 }, () => new THREE.Group()); groups.forEach(g => scene.add(g));
  function box(g: THREE.Group, size: number[], pos: number[], material = 0) {
    const mesh = new THREE.Mesh(new RoundedBoxGeometry(size[0], size[1], size[2], 2, Math.min(.06, size[2] / 3)), materials[material]);
    mesh.position.set(...pos as [number,number,number]); g.add(mesh); return mesh;
  }
  for (let i = 0; i < 3; i++) {
    box(groups[0], [2.6, 1.7, .12], [i * .24 - .2, i * .3 - .4, -i * .5], i === 0 ? 1 : 0);
  }
  box(groups[0], [.14, .14, 1.2], [.92, .5, -.4], 3);
  box(groups[0], [2.35, .15, .1], [0, .24, .12], 2);
  box(groups[0], [.68, .8, .14], [-.68, -.4, .14], 3);
  for(let i=0;i<3;i++) box(groups[0],[1,.09,.1],[.45,-.2-i*.24,.14],2);
  const frame = new THREE.Mesh(new THREE.TorusGeometry(1.3,.15,12,64),materials[0]); frame.scale.set(1.12,.83,1); groups[1].add(frame);
  const triangle = new THREE.Shape(); triangle.moveTo(-.3,-.45); triangle.lineTo(.5,0); triangle.lineTo(-.3,.45); triangle.closePath();
  groups[1].add(new THREE.Mesh(new THREE.ExtrudeGeometry(triangle,{depth:.2,bevelEnabled:true,bevelSize:.04,bevelThickness:.04,bevelSegments:3,steps:1}),materials[3]));
  [1,2,3].forEach((m,i)=>{const sphere=new THREE.Mesh(new THREE.SphereGeometry(.26,24,16),materials[m]);sphere.position.set(-.65+i*.65,-1.15,.45);groups[1].add(sphere);});
  box(groups[2],[2.8,.22,2],[0,-1,0],0); box(groups[2],[1.65,1.5,1.4],[0,-.1,0],1);box(groups[2],[.25,1.52,1.42],[0,-.1,0],3);box(groups[2],[.45,.32,.04],[-.45,-.1,.72],2);
  [[-1,-.65,0],[0,-.65,0],[1,-.65,0],[-.5,.4,0],[.5,.4,0],[0,1.3,0]].forEach((p,i)=>box(groups[3],[.74,.74,.74],p,i===4?3:i%3));
  box(groups[3],[2.7,.1,.1],[0,-.65,-.5],3);box(groups[3],[.1,2.1,.1],[0,.3,-.5],3);
  groups.forEach(g=>g.traverse(o=>{if(o instanceof THREE.Mesh){o.material=o.material.clone();o.material.transparent=true;}}));
  const resize=()=>{const {width,height}=host.getBoundingClientRect();if(width<1||height<1)return;renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();renderer.render(scene,camera);};
  const observer=new ResizeObserver(resize);observer.observe(host);resize();
  return {
    draw(index:number,time:number,progress:number){groups.forEach((g,i)=>{const weight=progress<0?(i===index?1:0):Math.max(0,1-Math.abs(progress*3-i));g.visible=weight>0;g.traverse(o=>{if(o instanceof THREE.Mesh){o.material.opacity=weight;o.material.depthWrite=weight>.99;}});g.rotation.set(.08+Math.sin(time*.35)*.025,-.28+Math.sin(time*.25)*.06,.04);g.position.y=Math.sin(time*.7)*.045+Math.max(0,progress)*.08;});renderer.render(scene,camera);},
    dispose(){observer.disconnect();scene.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();o.material.dispose();}});materials.forEach(m=>m.dispose());renderer.dispose();renderer.domElement.remove();},
    canvas:renderer.domElement,
  };
}
