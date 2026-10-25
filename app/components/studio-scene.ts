import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export interface StudioController { select(index: number): void; pause(value: boolean): void; dispose(): void }
export function createStudio(host: HTMLElement, onFailure: () => void): StudioController {
  const landing=host.closest<HTMLElement>(".creative-studio")!;
  const visual=landing.querySelector<HTMLElement>(".studio-visual")!;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 761 ? 1.25 : 1.75));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.VSMShadowMap;
  renderer.setClearColor(0xf4f3ef, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, .1, 60);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, .04);
  scene.environment = environment.texture;
  scene.environmentIntensity = .65;
  room.dispose();
  const ceramic = new THREE.MeshStandardMaterial({ color: 0xf1f0e9, roughness: .42, metalness: .08 });
  const silver = new THREE.MeshStandardMaterial({ color: 0xb5bcbd, roughness: .32, metalness: .8 });
  const graphite = new THREE.MeshStandardMaterial({ color: 0x20282c, roughness: .36, metalness: .5 });
  const stage = new THREE.Group(); scene.add(stage);
  function box(w: number,h: number,d: number, material: THREE.Material, parent: THREE.Object3D, x=0,y=0,z=0) {
    const mesh = new THREE.Mesh(new RoundedBoxGeometry(w,h,d,3,Math.min(w,h,d)*.2),material);
    mesh.position.set(x,y,z); mesh.castShadow=true; mesh.receiveShadow=true; parent.add(mesh); return mesh;
  }
  const monitor = new THREE.Group(); stage.add(monitor);
  box(4.45,2.95,.22,silver,monitor);
  box(4.29,2.79,.06,new THREE.MeshPhysicalMaterial({color:0xe2ded2,metalness:.15,roughness:.2,transmission:.2,thickness:.1}),monitor,0,0,.13);
  const screenCanvas=document.createElement("canvas"); screenCanvas.width=700; screenCanvas.height=900;
  const ctx=screenCanvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  const texture=new THREE.CanvasTexture(screenCanvas); texture.colorSpace=THREE.SRGBColorSpace;
  const screen=new THREE.Mesh(new THREE.PlaneGeometry(4.12,2.60),new THREE.MeshBasicMaterial({map:texture}));
  screen.position.z=.17; monitor.add(screen);
  // Independent interface surfaces sit in front of the browser, not in a flat collage.
  const extraTextures: THREE.Texture[] = [];
  function layer(width:number,height:number,kind:number) {
    const group=new THREE.Group(); stage.add(group);
    box(width,height,.12,kind===1?graphite:kind===2?new THREE.MeshPhysicalMaterial({color:0xdbe4df,roughness:.18,transmission:.35,thickness:.15,metalness:.1}):ceramic,group);
    const canvas=document.createElement("canvas");canvas.width=640;canvas.height=360;
    const c=canvas.getContext("2d")!;
    c.fillStyle=kind===1?"#202625":"#f7f7f2";c.fillRect(0,0,640,360);
    c.fillStyle=kind===1?"#bfc7c2":"#65716a";c.font="18px Arial";
    c.fillText(["LAYOUT / TYPOGRAPHY","CONNECTED THINKING","INTERFACE / COMPONENT"][kind],30,42);
    if(kind===0){c.fillStyle="#202625";c.font="bold 76px Arial";c.fillText("Ideas,",30,146);c.fillText("made real.",30,232);c.fillStyle="#ff6a00";c.fillRect(30,285,190,9);}
    if(kind===1){["Input","Process","Output"].forEach((word,i)=>{c.fillStyle=i===1?"#ff6a00":"#424c46";c.beginPath();c.roundRect(28+i*204,120,174,112,16);c.fill();c.fillStyle="#f7f7f2";c.font="25px Arial";c.fillText(word,48+i*204,185);if(i<2){c.fillStyle="#9eaba3";c.fillRect(204+i*204,173,25,3);}});c.fillStyle="#bfc7c2";c.font="20px Arial";c.fillText("A clear path from idea to outcome.",30,306);}
    if(kind===2){c.fillStyle="#202625";c.font="bold 40px Arial";c.fillText("Make it happen.",30,120);c.fillStyle="#dde2dd";c.beginPath();c.roundRect(30,161,570,62,14);c.fill();c.fillStyle="#ff6a00";c.beginPath();c.roundRect(30,250,275, 70,14);c.fill();c.fillStyle="#202625";c.font="25px Arial";c.fillText("Start creating  ↗",48,295);}
    const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;extraTextures.push(map);
    const face=new THREE.Mesh(new THREE.PlaneGeometry(width-.08,height-.08),new THREE.MeshBasicMaterial({map}));face.position.z=.067;group.add(face);
    return group;
  }
  const layers=[layer(2.25,1.35,0),layer(2.3,1.3,1),layer(1.6,1,2)];
  const objects=[monitor,...layers];
  layers.forEach(layer=>{layer.visible=false;});
  // A broad twisted ribbon catches the environment light behind the workspace.
  const vertices:number[]=[],indices:number[]=[];
  for(let i=0;i<=100;i++){const t=i/100*Math.PI*1.8;const x=2.8*Math.cos(t),y=2+1.8*Math.sin(t);for(const side of [-1,1])vertices.push(x+side*.16*Math.cos(t),y+side*.16*Math.sin(t),-.9+Math.sin(t*2)*.35);if(i<100){const k=i*2;indices.push(k,k+1,k+2,k+1,k+3,k+2);}}
  const ribbonGeometry=new THREE.BufferGeometry();ribbonGeometry.setAttribute("position",new THREE.Float32BufferAttribute(vertices,3));ribbonGeometry.setIndex(indices);ribbonGeometry.computeVertexNormals();
  const ribbonMaterial=silver.clone();ribbonMaterial.side=THREE.DoubleSide;
  const ribbon=new THREE.Mesh(ribbonGeometry,ribbonMaterial);stage.add(ribbon);ribbon.visible=false;
  const shadowCanvas=document.createElement("canvas");shadowCanvas.width=128;shadowCanvas.height=128;
  const sc=shadowCanvas.getContext("2d")!;const gradient=sc.createRadialGradient(64,64,0,64,64,64);gradient.addColorStop(0,"rgba(25,31,28,.24)");gradient.addColorStop(1,"rgba(25,31,28,0)");sc.fillStyle=gradient;sc.fillRect(0,0,128,128);
  const shadowTexture=new THREE.CanvasTexture(shadowCanvas);extraTextures.push(shadowTexture);
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(7,3),new THREE.MeshBasicMaterial({map:shadowTexture,transparent:true,depthWrite:false}));floor.rotation.x=-Math.PI/2;floor.position.y=-.12;scene.add(floor);
  // Continuous floor-to-wall sweep: a flat floor joins a quarter-circle cyclorama.
  const sweepVertices:number[]=[], sweepIndices:number[]=[];
  const profile:Array<[number,number]>=[[-.15,28],[-.15,-3]];
  for(let i=1;i<=32;i++){const t=i/32*Math.PI/2;profile.push([2.85-3*Math.cos(t),-3-3*Math.sin(t)]);}
  profile.push([22,-6]);
  profile.forEach(([y,z],i)=>{sweepVertices.push(-45,y,z,45,y,z);if(i<profile.length-1){const k=i*2;sweepIndices.push(k,k+2,k+1,k+1,k+2,k+3);}});
  const sweepGeometry=new THREE.BufferGeometry();sweepGeometry.setAttribute("position",new THREE.Float32BufferAttribute(sweepVertices,3));sweepGeometry.setIndex(sweepIndices);sweepGeometry.computeVertexNormals();
  const cyclorama=new THREE.Mesh(sweepGeometry,new THREE.MeshStandardMaterial({color:0xdcd3c3,roughness:.8,side:THREE.DoubleSide}));cyclorama.receiveShadow=false;scene.add(cyclorama);
  const silverArcMaterial=new THREE.MeshPhysicalMaterial({color:0x838f95,metalness:.8,roughness:.38,anisotropy:.6});
  const glassArcMaterial=new THREE.MeshPhysicalMaterial({color:0xb9cec9,roughness:.38,transmission:.4,thickness:.5,ior:1.45,transparent:true,opacity:.85});
  const silverArc=new THREE.Mesh(new THREE.TorusGeometry(4.3,.32,10,72,Math.PI*1.5),silverArcMaterial);
  silverArc.position.set(2.6,1.3,-3.2);silverArc.rotation.set(.15,.48,-.55);silverArc.castShadow=true;scene.add(silverArc);silverArc.visible=false;
  const glassArc=new THREE.Mesh(new THREE.TorusGeometry(3.8,.52,10,64,Math.PI*1.65),glassArcMaterial);
  glassArc.position.set(.9,1.6,-2.1);glassArc.rotation.set(-.18,-.35,.35);scene.add(glassArc);
  // Low architectural plinth and a distant wall arch make the room readable as space.
  const plinth=box(3.25,.24,2.15,new THREE.MeshStandardMaterial({color:0xe8e2d5,roughness:.6,metalness:.04}),scene,-1.45,0,1.05);
  plinth.rotation.y=-.12;plinth.receiveShadow=false;
  floor.position.set(-1.45,-.13,1.05);floor.scale.set(.64,1,.85);
  const footShadow=new THREE.Mesh(new THREE.PlaneGeometry(1.7,.65),new THREE.MeshBasicMaterial({map:shadowTexture,transparent:true,opacity:.75,depthWrite:false}));
  footShadow.rotation.x=-Math.PI/2;footShadow.position.set(-1.55,.125,1.42);scene.add(footShadow);
  const characterMaterial=new THREE.MeshBasicMaterial({transparent:true,alphaTest:.16,side:THREE.DoubleSide});
  const character=new THREE.Mesh(new THREE.PlaneGeometry(3.33,5),characterMaterial);character.visible=false;
  character.position.set(-1.55,2.42,1.42);scene.add(character);
  const characterTexture=new THREE.TextureLoader().load("/studio-character.png",map=>{
    if(disposed){map.dispose();return;}map.colorSpace=THREE.SRGBColorSpace;characterMaterial.map=map;characterMaterial.needsUpdate=true;character.visible=true;landing.dataset.characterLoaded="true";request();
  });extraTextures.push(characterTexture);
  const artwork=new Image();artwork.src="/bg2.png";artwork.onload=()=>{if(!disposed){lastDraw=-1;request();}};
  const wallArch=new THREE.Mesh(new THREE.TorusGeometry(5.7,.12,8,64,Math.PI*1.3),new THREE.MeshStandardMaterial({color:0xd1cabe,roughness:.72}));
  wallArch.position.set(-7.5,1.1,-4.7);wallArch.rotation.z=-.2;scene.add(wallArch);
  function arch(width:number,height:number,radius:number,color:number,z:number){
    const shape=new THREE.Shape();const x=-width/2,y=-height/2;
    shape.moveTo(x,y);shape.lineTo(x+width,y);shape.lineTo(x+width,y+height-radius);
    shape.quadraticCurveTo(x+width,y+height,x+width-radius,y+height);shape.lineTo(x+radius,y+height);shape.quadraticCurveTo(x,y+height,x,y+height-radius);shape.closePath();
    const mesh=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:.16,bevelEnabled:true,bevelSize:.045,bevelThickness:.04,bevelSegments:3,steps:1,curveSegments:16}),new THREE.MeshStandardMaterial({color,roughness:.85}));mesh.position.set(3,2.55,z);scene.add(mesh);
  }
  arch(5,5.4,1.1,0xc0b19a,-3.85);arch(4.45,4.9,.95,0xd7cdbb,-3.62);
  const plantMaterial=new THREE.MeshBasicMaterial({transparent:true,alphaTest:.15,side:THREE.DoubleSide});
  const plant=new THREE.Mesh(new THREE.PlaneGeometry(1.9,2.85),plantMaterial);plant.position.set(3.95,1.25,-1.7);scene.add(plant);
  const plantTexture=new THREE.TextureLoader().load("/studio-olive.png",map=>{if(disposed){map.dispose();return;}map.colorSpace=THREE.SRGBColorSpace;plantMaterial.map=map;plantMaterial.needsUpdate=true;request();});extraTextures.push(plantTexture);
  const accent=box(.85,.85,.85,new THREE.MeshPhysicalMaterial({color:0xff6400,metalness:.1,roughness:.12,transmission:.6,thickness:.9,ior:1.45}),scene,2.65,.35,1.35);accent.rotation.y=.3;
  const orangeBounce=new THREE.PointLight(0xff7a24,8,10,2);orangeBounce.position.set(3,.6,1.4);scene.add(orangeBounce);
  scene.add(new THREE.HemisphereLight(0xffffff,0x807c73,1.15));
  const light=new THREE.DirectionalLight(0xfff5e8,2.8);
  light.position.set(-4,6,4); light.castShadow=true; light.shadow.mapSize.set(1024,1024);
  Object.assign(light.shadow.camera,{left:-5,right:5,top:6,bottom:-4,near:.1,far:20});
  light.shadow.bias=-.0005; light.shadow.normalBias=.04; light.shadow.radius=4; scene.add(light);
  const rim=new THREE.DirectionalLight(0xffffff,1.6); rim.position.set(4,4,-4); scene.add(rim);
  let selected=-1, frame=0, disposed=false, visible=true, paused=false, start=performance.now(), progress=0;
  let px=0,py=0,cx=0,cy=0,hovered=-1,arcTime=0,lastTime=0,lastDraw=-1;
  const raycaster=new THREE.Raycaster();
  const overview=[[.35,2.3,-.25,-.18],[-1.6,1.5,1.1,.12],[1.45,.75,1.35,-.12],[2.15,3.15,.65,-.2]];
  const poses=[
    [[.35,2.3,-.25,-.12],[-1.5,1.6,.65,-.12],[.9,.75,.8,-.12],[2.25,2.9,.65,-.12]],
    [[.35,2.35,-.5,-.2],[-1.7,1.3,.9,.12],[.55,1.15,1.6,0],[2.3,2.8,.8,-.15]],
    [[.35,2.3,-.4,-.15],[-1.55,2,1.2,.08],[1.4,.7,.8,-.12],[2.1,2.8,1,.08]],
    [[.35,2.4,-.4,-.16],[-1.7,1.5,1,.1],[.55,.7,1.3,0],[2.15,2.6,1,-.08]]
  ];
  objects.forEach((o,i)=>{o.position.set(overview[i][0],overview[i][1]-.5,overview[i][2]);o.rotation.y=overview[i][3];});
  const motion=matchMedia("(prefers-reduced-motion: reduce)");
  const fine=matchMedia("(hover: hover) and (pointer: fine)");
  function panel(x:number,y:number,w:number,h:number,color:string) { ctx!.fillStyle=color; ctx!.beginPath(); ctx!.roundRect(x,y,w,h,12); ctx!.fill(); }
  function label(text:string,x:number,y:number,size=24,color="#26312f") { ctx!.fillStyle=color; ctx!.font=`500 ${size}px Arial`; ctx!.fillText(text,x,y); }
  function draw(p:number) {
    ctx!.fillStyle="#eeeae1";ctx!.fillRect(0,0,700,900);
    label("ANCHAL",36,58,20);label("SHARMA",36,83,20);
    if(artwork.complete&&artwork.naturalWidth){ctx!.save();ctx!.beginPath();ctx!.roundRect(335,145,325,350,8);ctx!.clip();ctx!.drawImage(artwork,335,145,325,350);ctx!.restore();}
    label(["Build for", "Connect", "Design for", "Ideas into"][selected]??"Build",36,255,54);
    label(["people.", "the dots.", "clarity.", "action."][selected]??"What's Next.",36,325,48);
    panel(36,370,95,7,"#ff6a00");
    label(selected===2&&p<.6?"STRUCTURE / EXPLORE":"DESIGN / DEVELOP / LAUNCH",36,536,16,"#7c776d");
    const words=selected===1?["Input","Process","Output"]:selected===3?["Idea","Plan","Launch"]:["Design","Develop","Launch"];
    words.forEach((word,i)=>{panel(36+i*213,590,197,235,"#e0ddd4");label("0"+(i+1),53+i*213,636,22,"#b05a24");label(word,53+i*213,706,25);panel(53+i*213,750,135,5,"#c0bdb4");panel(53+i*213,770,98,5,"#c0bdb4");});
    texture.needsUpdate=true;
  }
  function render(now:number) {
    frame=0;
    if(disposed || !visible || document.hidden) return;
    progress=motion.matches || paused ? 1 : Math.min(1,(now-start)/1600);
    cx += (px-cx)*.08; cy += (py-cy)*.08;
    const mobile=innerWidth<761;
    if(!paused&&!motion.matches&&!mobile&&lastTime)arcTime+=Math.min(now-lastTime,50)/1000;
    lastTime=now;
    silverArc.rotation.z=-.55+Math.sin(arcTime/12)*.025;accent.rotation.y=.3+Math.sin(arcTime/12)*.025;plant.visible=!mobile&&!!plantMaterial.map;
    glassArc.visible=false;wallArch.visible=false;
    glassArcMaterial.transmission=mobile?0:.4;
    const distance=Math.max(8.3,(visual.clientWidth<500?10.2:5.8)/Math.max(.6,visual.clientWidth/visual.clientHeight));
    camera.position.set(1.7+(motion.matches||paused?0:cx*.25),3.1+(motion.matches||paused?0:cy*.16),distance);
    camera.lookAt(.1,1.95,0);
    character.rotation.y=Math.atan2(camera.position.x-character.position.x,camera.position.z-character.position.z)*.35;
    let unsettled=false;
    objects.forEach((o,i)=>{
      const pose=i===0?[1.3,2.3,-.45,-.2]:(poses[selected]??overview)[i];
      if(i===0)o.scale.set(.78,1.4,1);
      const lift=hovered===i&&!paused&&!motion.matches?.14:0;
      const target=new THREE.Vector3(pose[0],pose[1]+lift,pose[2]);
      if(motion.matches||paused)o.position.copy(target);else o.position.lerp(target,.1);
      const turn=pose[3]+(lift? .045:0);o.rotation.y+=(turn-o.rotation.y)*(motion.matches||paused?1:.1);
      o.rotation.z+=( (i===0?.025:i===1?-.07:.05)-o.rotation.z)*.1;
      unsettled ||= o.position.distanceTo(target)>.002 || Math.abs(turn-o.rotation.y)>.002;
    });
    if(progress!==lastDraw){draw(progress);lastDraw=progress;}
    renderer.render(scene,camera);
    if(!paused && !motion.matches && (!mobile || unsettled || progress<1 || Math.abs(cx-px)+Math.abs(cy-py)>.002)) request();
  }
  function request(){if(!frame && !disposed && visible && !document.hidden) frame=requestAnimationFrame(render);}
  function resize(){
    const r=host.getBoundingClientRect(),v=visual.getBoundingClientRect();
    renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<761?1.25:1.75));renderer.setSize(r.width,r.height);
    // Extend the original visual frustum across the hero without moving its workspace.
    camera.setViewOffset(v.width,v.height,-(v.left-r.left),-(v.top-r.top),r.width,r.height);
    camera.updateProjectionMatrix();request();
  }
  function move(e:PointerEvent){if(!fine.matches || motion.matches || paused || innerWidth<761)return;
    const r=host.getBoundingClientRect(),v=visual.getBoundingClientRect();
    px=Math.max(-1,Math.min(1,(e.clientX-v.left)/v.width*2-1));py=Math.max(-1,Math.min(1,(e.clientY-v.top)/v.height*2-1));
    raycaster.setFromCamera(new THREE.Vector2((e.clientX-r.left)/r.width*2-1,-((e.clientY-r.top)/r.height*2-1)),camera);
    const hit=raycaster.intersectObjects(objects,true)[0];hovered=hit?objects.findIndex(o=>o===hit.object||o.children.includes(hit.object)):-1;request();
  }
  function leave(){hovered=-1;px=py=0;request();}
  function visibility(){lastTime=0;if(document.hidden){cancelAnimationFrame(frame);frame=0;}else{start=performance.now()-progress*1600;request();}}
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;lastTime=0;if(!visible){cancelAnimationFrame(frame);frame=0;}else{start=performance.now()-progress*1600;request();}},{threshold:.01});
  observer.observe(host);
  const resizer=new ResizeObserver(resize);resizer.observe(host);resizer.observe(visual);
  landing.addEventListener("pointermove",move);landing.addEventListener("pointerleave",leave);
  document.addEventListener("visibilitychange",visibility);motion.addEventListener("change",request);
  const failure=(e:Event)=>{e.preventDefault();cancelAnimationFrame(frame);onFailure();};
  renderer.domElement.addEventListener("webglcontextlost",failure);
  resize();
  return {
    select(index){selected=index;lastDraw=-1;start=performance.now();request();},
    pause(value){paused=value;request();},
    dispose(){disposed=true;cancelAnimationFrame(frame);observer.disconnect();resizer.disconnect();landing.removeEventListener("pointermove",move);landing.removeEventListener("pointerleave",leave);document.removeEventListener("visibilitychange",visibility);motion.removeEventListener("change",request);renderer.domElement.removeEventListener("webglcontextlost",failure);scene.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material])m.dispose();}});texture.dispose();extraTextures.forEach(t=>t.dispose());environment.dispose();pmrem.dispose();renderer.dispose();delete landing.dataset.characterLoaded;renderer.domElement.remove();}
  };
}
