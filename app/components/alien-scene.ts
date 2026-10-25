import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export interface AlienController { pause(value: boolean): void; dispose(): void }

// Cross-sections (width, height, depth) form one continuous bust, from shoulders to crown.
const PROFILE = [[.96,0,.38],[1.36,.10,.46],[1.48,.28,.49],[1.30,.49,.47],[.73,.72,.37],[.39,.98,.31],[.34,1.22,.30],[.40,1.46,.40],[.58,1.68,.51],[.82,1.99,.64],[1.00,2.34,.73],[1.05,2.70,.78],[.92,3.03,.72],[.62,3.30,.52],[.001,3.48,.001]];
const smooth = THREE.MathUtils.smoothstep;
export function createAlien(host: HTMLElement, ready: () => void, failure: () => void): AlienController {
  const renderer = new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
  renderer.setClearColor(0,0); renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.12;
  renderer.domElement.setAttribute('aria-hidden','true'); host.appendChild(renderer.domElement);
  const scene=new THREE.Scene(), camera=new THREE.PerspectiveCamera(34,1,.1,30);
  const room=new RoomEnvironment();
  // Broad luminous reflection cards are invisible to the page camera.
  const cardGeometry=new THREE.PlaneGeometry(5,8);
  const cardMaterial=new THREE.MeshBasicMaterial({color:new THREE.Color(3.8,3.8,3.8),side:THREE.DoubleSide});
  const card=new THREE.Mesh(cardGeometry,cardMaterial);card.position.set(-4,3,4);card.lookAt(0,2,0);room.add(card);
  const orangeMaterial=new THREE.MeshBasicMaterial({color:new THREE.Color(1.7,.32,.045),side:THREE.DoubleSide});
  const rim=new THREE.Mesh(new THREE.PlaneGeometry(1.3,6),orangeMaterial);rim.position.set(3,2,-1);rim.lookAt(0,2,0);room.add(rim);
  const pmrem=new THREE.PMREMGenerator(renderer), environment=pmrem.fromScene(room,.06);
  scene.environment=environment.texture;scene.environmentIntensity=1.05; room.dispose();cardGeometry.dispose();cardMaterial.dispose();rim.geometry.dispose();orangeMaterial.dispose();
  scene.add(new THREE.HemisphereLight(0xffffff,0x59554c,1.2));
  const key=new THREE.DirectionalLight(0xfffaf1,3);key.position.set(-3,5,5);scene.add(key);
  const fill=new THREE.DirectionalLight(0xe1eaff,1.5);fill.position.set(4,2,4);scene.add(fill);
  const orange=new THREE.DirectionalLight(0xff721f,2);orange.position.set(3,2,-3);scene.add(orange);
  const idle=new THREE.Group();scene.add(idle);
  const silver=new THREE.MeshStandardMaterial({color:0xd8dde0,metalness:.98,roughness:.235});
  const dark=new THREE.MeshStandardMaterial({color:0x11171c,metalness:.6,roughness:.18});
  const curve=new THREE.CatmullRomCurve3(PROFILE.map(v=>new THREE.Vector3(...v as [number,number,number])),false,'catmullrom',.25);
  const rows=112, segments=96, vertices:number[]=[], indices:number[]=[];
  const gaussian=(x:number,y:number,cx:number,cy:number,sx:number,sy:number)=>Math.exp(-(((x-cx)/sx)**2)-((y-cy)/sy)**2);
  for(let i=0;i<=rows;i++) {
    const p=curve.getPoint(i/rows);
    for(let j=0;j<=segments;j++) {
      const a=j/segments*Math.PI*2,x=p.x*Math.sin(a),y=p.y;
      let z=p.z*Math.cos(a);
      const front=smooth(Math.cos(a),.2,.8);
      // Integrated nose bridge, small tip, cheek planes, and a closed lip groove.
      z+=front*(.12*gaussian(x,y,0,2.17,.15,.30)+.13*gaussian(x,y,0,1.99,.17,.10)
        +.07*gaussian(Math.abs(x),y,.52,1.96,.25,.18)-.046*gaussian(x,y,0,1.78,.29,.026)
        +.033*gaussian(x,y,0,1.73,.25,.06));
      vertices.push(x,y,z);
      if(i<rows&&j<segments){const k=i*(segments+1)+j;indices.push(k,k+1,k+segments+1,k+1,k+segments+2,k+segments+1);}
    }
  }
  const geometry=new THREE.BufferGeometry(); geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geometry.setIndex(indices);geometry.computeVertexNormals();
  const original=new Float32Array(vertices), normals=new Float32Array(geometry.getAttribute('normal').array);
  const bust=new THREE.Mesh(geometry,silver);idle.add(bust);
  const face=new THREE.Group();face.position.y=1.22;idle.add(face);
  const eyeGeometries:THREE.BufferGeometry[]=[];
  for(const side of [-1,1]) {
    const points:number[]=[], ids:number[]=[];
    for(let r=0;r<=16;r++) for(let j=0;j<=64;j++) {
      const t=j/64*Math.PI*2,rad=r/16;
      const xx=.40*Math.cos(t)*rad, yy=.205*Math.sin(t)*Math.pow(Math.abs(Math.sin(t)),.35)*rad;
      const angle=side*.23, x=side*.47+xx*Math.cos(angle)-yy*Math.sin(angle), y=2.33+xx*Math.sin(angle)+yy*Math.cos(angle);
      const z=.73*Math.sqrt(Math.max(.01,1-x*x))+.027+.105*(1-rad*rad);
      points.push(x,y-1.22,z);
      if(r<16&&j<64){const k=r*65+j;ids.push(k,k+65,k+1,k+1,k+65,k+66);}
    }
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(points,3));g.setIndex(ids);g.computeVertexNormals();eyeGeometries.push(g);face.add(new THREE.Mesh(g,dark));
  }
  // A translucent contact ellipse anchors the bust without an opaque canvas backdrop.
  const shadowCanvas=document.createElement('canvas');shadowCanvas.width=128;shadowCanvas.height=128;
  const context=shadowCanvas.getContext('2d')!;const gradient=context.createRadialGradient(64,64,1,64,64,64);gradient.addColorStop(0,'rgba(35,30,25,.26)');gradient.addColorStop(1,'rgba(35,30,25,0)');context.fillStyle=gradient;context.fillRect(0,0,128,128);
  const shadowTexture=new THREE.CanvasTexture(shadowCanvas),shadowMaterial=new THREE.MeshBasicMaterial({map:shadowTexture,transparent:true,depthWrite:false});
  const shadowGeometry=new THREE.PlaneGeometry(3.8,1.4),shadow=new THREE.Mesh(shadowGeometry,shadowMaterial);shadow.rotation.x=-Math.PI/2;shadow.position.y=-.1;scene.add(shadow);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'), fine=matchMedia('(hover: hover) and (pointer: fine) and (min-width: 901px)');
  let disposed=false,failed=false,paused=false,visible=false,frame=0,last=0,time=0,tx=0,ty=0,rx=0,ry=0,first=true;
  const rotation=new THREE.Euler(),q=new THREE.Quaternion(),v=new THREE.Vector3();
  function pose(t:number) {
    rotation.set(rx,ry,0);face.quaternion.setFromEuler(rotation);
    const p=geometry.getAttribute('position') as THREE.BufferAttribute;
    for(let i=0;i<p.count;i++) {
      const k=i*3,x=original[k],y=original[k+1],z=original[k+2];
      const protectedFace=smooth(z,.1,.5)*(1-smooth(Math.abs(x),.75,1.05))*smooth(y,1.45,1.7)*(1-smooth(y,2.65,2.9));
      const ripple=.011*(fine.matches?1:.5)*(1-protectedFace)*Math.sin(y*4+x*2+t*.72)*Math.sin(z*3-y*1.7+t*.43);
      v.set(x+normals[k]*ripple,y+normals[k+1]*ripple-1.22,z+normals[k+2]*ripple);
      rotation.set(rx*smooth(y,.65,1.5),ry*smooth(y,.65,1.5),0);q.setFromEuler(rotation);v.applyQuaternion(q);p.setXYZ(i,v.x,v.y+1.22,v.z);
    }
    p.needsUpdate=true;geometry.computeVertexNormals();
    // Weld the angular seam's normals after deformation.
    const n=geometry.getAttribute('normal') as THREE.BufferAttribute;
    for(let i=0;i<=rows;i++){const a=i*(segments+1),b=a+segments;v.set(n.getX(a)+n.getX(b),n.getY(a)+n.getY(b),n.getZ(a)+n.getZ(b)).normalize();n.setXYZ(a,v.x,v.y,v.z);n.setXYZ(b,v.x,v.y,v.z);}n.needsUpdate=true;
    const intensity=(fine.matches?1:.5)*smooth(t,.7,1.5);
    idle.position.y=Math.sin(t*Math.PI*2/7)*.035*intensity;idle.rotation.z=Math.sin(t*.55)*.014*intensity;idle.rotation.y=-.07+Math.sin(t*.4)*.012*intensity;
  }
  function render(now:number) {
    frame=0;if(disposed||failed||!visible||document.hidden)return;
    if(last&&now-last<30){frame=requestAnimationFrame(render);return;}
    const dt=last?Math.min((now-last)/1000,.06):0;last=now;
    if(!paused&&!reduced.matches){time+=dt;const damping=1-Math.exp(-dt*6);rx+=(tx-rx)*damping;ry+=(ty-ry)*damping;pose(time);}else if(first)pose(0);
    renderer.render(scene,camera);if(first){first=false;ready();}
    if(!paused&&!reduced.matches)frame=requestAnimationFrame(render);
  }
  function request(){if(!disposed&&!failed&&!frame&&visible&&!document.hidden){last=0;frame=requestAnimationFrame(render);}}
  function resize(){const w=host.clientWidth,h=host.clientHeight;renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<=900?1:1.5));renderer.setSize(w,h,false);camera.aspect=w/h;camera.position.set(0,1.85,Math.max(7.5,5.3/camera.aspect));camera.lookAt(0,1.7,0);camera.updateProjectionMatrix();request();}
  const size=new ResizeObserver(resize);size.observe(host);
  const observer=new IntersectionObserver(([e])=>{visible=e.isIntersecting;if(!visible){cancelAnimationFrame(frame);frame=0;last=0;}else request();});observer.observe(host);
  function pointer(e:PointerEvent){if(!fine.matches||paused||reduced.matches)return;const r=host.getBoundingClientRect();ty=((e.clientX-r.left)/r.width-.5)*.28;tx=((e.clientY-r.top)/r.height-.5)*.175;}
  function leave(){tx=ty=0;}
  function visibility(){cancelAnimationFrame(frame);frame=0;request();}
  function preference(){tx=ty=rx=ry=0;pose(0);visibility();}
  function lost(e:Event){e.preventDefault();failed=true;cancelAnimationFrame(frame);frame=0;visible=false;failure();}
  host.addEventListener('pointermove',pointer);host.addEventListener('pointerleave',leave);document.addEventListener('visibilitychange',visibility);reduced.addEventListener('change',preference);fine.addEventListener('change',leave);renderer.domElement.addEventListener('webglcontextlost',lost);
  resize();
  return {pause(value){paused=value;tx=ty=0;cancelAnimationFrame(frame);frame=0;request();},dispose(){disposed=true;cancelAnimationFrame(frame);size.disconnect();observer.disconnect();host.removeEventListener('pointermove',pointer);host.removeEventListener('pointerleave',leave);document.removeEventListener('visibilitychange',visibility);reduced.removeEventListener('change',preference);fine.removeEventListener('change',leave);renderer.domElement.removeEventListener('webglcontextlost',lost);geometry.dispose();eyeGeometries.forEach(g=>g.dispose());silver.dispose();dark.dispose();shadowGeometry.dispose();shadowMaterial.dispose();shadowTexture.dispose();environment.dispose();pmrem.dispose();renderer.dispose();renderer.domElement.remove();}};
}
