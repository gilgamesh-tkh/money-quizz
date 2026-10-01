/* ---------- Three.js : pièces 3D + dessins d'argent bien / mal géré ---------- */
(function(){
  const canvas=document.getElementById('bg');
  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  const scene=new THREE.Scene();
  const cam=new THREE.PerspectiveCamera(50,1,.1,100); cam.position.z=14;
  const still=matchMedia('(prefers-reduced-motion:reduce)').matches;
  const inkColor=()=>getComputedStyle(document.documentElement).getPropertyValue('--line').trim()||'#1e1e2e';
  const GREEN='#2f9e44',RED='#e03131',GOLD='#ffd43b';
  const J=(v,a=3)=>v+(Math.random()-.5)*a;

  /* outils de dessin "main levée" */
  function line(c,pts,close){for(let k=0;k<2;k++){c.beginPath();pts.forEach((p,i)=>i?c.lineTo(J(p[0]),J(p[1])):c.moveTo(J(p[0]),J(p[1])));if(close)c.closePath();c.stroke();}}
  function poly(c,pts,fill){c.fillStyle=fill;c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.fill();line(c,pts,true);}
  function ell(c,x,y,rx,ry,fill){c.fillStyle=fill;c.beginPath();c.ellipse(x,y,rx,ry,0,0,7);c.fill();for(let k=0;k<2;k++){c.beginPath();c.ellipse(J(x,2),J(y,2),rx,ry,0,0,7);c.stroke();}}
  function txt(c,t,x,y,size,col){c.fillStyle=col;c.font='bold '+size+'px Caveat,Kalam,"Comic Sans MS",cursive';c.textAlign='center';c.fillText(t,x,y);}
  const rect=(x,y,w,h)=>[[x,y],[x+w,y],[x+w,y+h],[x,y+h]];
  const axes=c=>line(c,[[38,28],[38,222],[232,222]]);
  const arrow=(c,x,y,dx,dy,col)=>{c.strokeStyle=col;const a=Math.atan2(dy,dx);line(c,[[x,y],[x+dx,y+dy]]);line(c,[[x+dx,y+dy],[x+dx-28*Math.cos(a-.5),y+dy-28*Math.sin(a-.5)]]);line(c,[[x+dx,y+dy],[x+dx-28*Math.cos(a+.5),y+dy-28*Math.sin(a+.5)]]);};

  const DRAWS=[
   {good:1,f:(c,ink)=>{axes(c);[[62,40],[108,80],[154,125]].forEach(([x,h])=>poly(c,rect(x,222-h,32,h),'#b2f2bb'));arrow(c,50,170,160,-110,GREEN);}},
   {good:0,f:(c,ink)=>{axes(c);[[62,125],[108,80],[154,40]].forEach(([x,h])=>poly(c,rect(x,222-h,32,h),'#ffc9c9'));arrow(c,50,60,165,120,RED);}},
   {good:1,f:(c,ink)=>{ell(c,118,150,70,48,'#ffc2d1');poly(c,[[70,112],[64,84],[92,104]],'#ffc2d1');line(c,[[80,190],[80,220]]);line(c,[[140,192],[140,220]]);ell(c,186,146,16,14,'#ff99b3');c.fillStyle=ink;c.beginPath();c.arc(150,136,4,0,7);c.fill();line(c,[[96,110],[130,110]]);ell(c,114,52,24,24,GOLD);txt(c,'€',114,64,36,ink);c.strokeStyle=GREEN;line(c,[[114,86],[114,104]]);}},
   {good:1,f:(c,ink)=>{ell(c,128,158,66,58,'#b2f2bb');poly(c,[[104,102],[152,102],[142,74],[114,74]],'#b2f2bb');line(c,[[100,100],[156,100]]);txt(c,'$',128,182,84,ink);}},
   {good:0,f:(c,ink)=>{c.save();c.translate(128,128);c.rotate(-.25);poly(c,rect(-55,-30,110,60),'#b2f2bb');ell(c,0,0,18,18,'#d8f5a2');txt(c,'€',0,10,28,ink);poly(c,[[-55,-10],[-105,-40],[-85,0],[-105,20],[-55,10]],'#ffffff');poly(c,[[55,-10],[105,-40],[85,0],[105,20],[55,10]],'#ffffff');c.restore();c.strokeStyle=RED;line(c,[[16,170],[70,190]]);line(c,[[10,200],[60,212]]);line(c,[[24,140],[60,160]]);}},
   {good:0,f:(c,ink)=>{poly(c,rect(34,76,188,112),'#ffc9c9');poly(c,rect(34,100,188,26),ink);txt(c,'-€€€',128,170,44,RED);c.strokeStyle=RED;line(c,[[52,140],[90,140]]);}},
   {good:0,f:(c,ink)=>{poly(c,rect(40,96,176,106),'#ffe8cc');line(c,[[40,120],[216,120]]);ell(c,190,160,14,14,'#fff');txt(c,'0',110,176,64,RED);c.strokeStyle=ink;line(c,[[216,96],[180,108],[216,126]]);line(c,[[216,96],[196,140]]);c.strokeStyle=RED;line(c,[[70,60],[90,80]]);line(c,[[90,60],[70,80]]);}},
   {good:1,f:(c,ink)=>{poly(c,[[88,228],[168,228],[158,182],[98,182]],'#ffd8a8');line(c,[[128,182],[128,100]]);ell(c,96,148,26,14,'#b2f2bb');ell(c,160,128,26,14,'#b2f2bb');ell(c,128,68,28,28,GOLD);txt(c,'€',128,80,38,ink);}},
   {good:0,f:(c,ink)=>{poly(c,[[60,20],[196,20],[196,228],[176,214],[156,228],[136,214],[116,228],[96,214],[76,228],[60,214]],'#fff9db');[50,74,98,122].forEach(y=>line(c,[[80,y],[176,y]]));txt(c,'-999',128,186,54,RED);}}
  ];
  const sprites=DRAWS.map((d,i)=>{
    const cv=document.createElement('canvas'); cv.width=cv.height=256;
    const tex=new THREE.CanvasTexture(cv);
    const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,opacity:.9,depthWrite:false}));
    sp.userData={d,cv,tex,nx:((i*.618)%1)*2-1,ny:((i*.381+.2)%1)*2-1,f:Math.random()*6,sp:.0007+Math.random()*.0012,dir:d.good?1:-1};
    scene.add(sp); return sp;
  });
  function paint(){
    const ink=inkColor();
    sprites.forEach(sp=>{const u=sp.userData,c=u.cv.getContext('2d');c.clearRect(0,0,256,256);c.lineWidth=6;c.lineCap=c.lineJoin='round';c.strokeStyle=ink;u.d.f(c,ink);u.tex.needsUpdate=true;});
    coinMats.forEach(m=>m.edge.color.set(ink)); coinTex.forEach(x=>{drawCoin(x.cv,x.sym,ink);x.tex.needsUpdate=true;});
  }

  /* pièces 3D */
  function drawCoin(cv,sym,ink){const c=cv.getContext('2d');c.clearRect(0,0,128,128);c.fillStyle=GOLD;c.beginPath();c.arc(64,64,60,0,7);c.fill();c.strokeStyle=ink;c.lineWidth=5;c.beginPath();c.arc(64,64,58,0,7);c.stroke();c.lineWidth=3;c.beginPath();c.arc(64,64,44,0,7);c.stroke();c.fillStyle=ink;c.font='bold 62px Caveat,Kalam,"Comic Sans MS",cursive';c.textAlign='center';c.fillText(sym,64,84);}
  const coinTex=[],coinMats=[],coins=[];
  const cgeo=new THREE.CylinderGeometry(.8,.8,.16,28), egeo=new THREE.EdgesGeometry(cgeo);
  ['€','$','€','$','€','$','€','$','€','$','€','$'].forEach((sym,i)=>{
    const cv=document.createElement('canvas');cv.width=cv.height=128;const tex=new THREE.CanvasTexture(cv);
    coinTex.push({cv,sym,tex});
    const side=new THREE.MeshBasicMaterial({color:'#f59f00'}),face=new THREE.MeshBasicMaterial({map:tex,transparent:false,color:0xffffff});
    const mesh=new THREE.Mesh(cgeo,[side,face,face]);
    const edge=new THREE.LineBasicMaterial({color:'#1e1e2e'});coinMats.push({edge});
    mesh.add(new THREE.LineSegments(egeo,edge));
    mesh.userData={nx:Math.random()*2-1,ny:Math.random()*2.3-1.15,z:-4+Math.random()*4,sp:.0012+Math.random()*.002,rx:.008+Math.random()*.012,ry:.01+Math.random()*.02,s:.7+Math.random()*.6};
    mesh.rotation.set(Math.random()*3,Math.random()*3,0);mesh.scale.setScalar(mesh.userData.s);
    scene.add(mesh);coins.push(mesh);
  });

  let halfW=10,halfH=6.5,base=2.6,kick=0,mx=0,my=0,mood=0,moodT=0,moodSum=0,moodN=0,jolt=0,joltDir=1;
  function render(){renderer.render(scene,cam);}
  function resize(){
    const w=innerWidth,h=innerHeight;renderer.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();
    halfH=14*Math.tan(25*Math.PI/180);halfW=halfH*cam.aspect;base=Math.max(1.7,Math.min(3.1,halfW*.4));
    if(still){place(0);render();}
  }
  function place(t){
    sprites.forEach(sp=>{const u=sp.userData,aff=u.dir*mood,same=u.dir===joltDir;
      const shake=(!same||u.dir>0)?0:Math.sin(t/25)*jolt*.35;
      sp.position.set(u.nx*halfW*.95+Math.sin(t/1500+u.f)*.25+shake,u.ny*halfH+(same&&u.dir>0?jolt*.3:0),-2);
      sp.scale.setScalar(base*(1+kick*.2+.35*aff+(same?jolt*.3:0)));
      sp.material.opacity=.3+.65*(aff+1)/2;
      sp.material.rotation=Math.sin(t/1200+u.f)*.12+(same&&u.dir<0?Math.sin(t/30)*jolt*.25:0);});
    coins.forEach((m,i)=>{const u=m.userData,target=(i/coins.length<(mood+1)/2+.2)?1:0;
      u.cs=(u.cs===undefined?1:u.cs)+(target-(u.cs===undefined?1:u.cs))*(still?1:.06);
      m.scale.setScalar(u.s*(.25+.75*u.cs));m.position.set(u.nx*halfW,u.ny*halfH,u.z);});
  }
  function loop(t){
    kick*=.94;jolt*=.93;mood+=(moodT-mood)*.05;
    sprites.forEach(sp=>{const u=sp.userData;u.ny+=u.dir*u.sp*(1+.9*Math.max(0,u.dir*mood));if(Math.abs(u.ny)>1.2){u.ny=-u.dir*1.2;u.nx=Math.random()*2-1;}});
    coins.forEach(m=>{const u=m.userData;u.ny-=u.sp;if(u.ny<-1.2){u.ny=1.2;u.nx=Math.random()*2-1;}m.rotation.x+=(u.rx+kick*.2)*(1+Math.max(0,mood));m.rotation.y+=(u.ry+kick*.25)*(1+Math.max(0,mood));});
    place(t);
    cam.position.x+=(mx*2-cam.position.x)*.03;cam.position.y+=(-my*1.5-cam.position.y)*.03;cam.lookAt(0,0,0);
    render();requestAnimationFrame(loop);
  }
  addEventListener('resize',resize);
  addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5;});
  addEventListener('qchange',()=>{kick=1;});
  addEventListener('qanswer',e=>{const p=e.detail.pts;moodSum+=(p-3)/2;moodN++;moodT=moodSum/moodN;joltDir=p>=4?1:-1;jolt=1;kick=Math.max(kick,.6);if(still){mood=moodT;place(0);render();}});
  addEventListener('qreset',()=>{moodSum=0;moodN=0;moodT=0;jolt=0;if(still){mood=0;place(0);render();}});
  addEventListener('themechange',()=>{paint();if(still)render();});
  (document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(paint);
  paint();resize();
  if(!still)requestAnimationFrame(loop);
})();
