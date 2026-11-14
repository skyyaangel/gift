const $=(s,e=document)=>e.querySelector(s),$$=(s,e=document)=>[...e.querySelectorAll(s)];

/* ---- Пелюстки та блискітки (canvas) ---- */
const cv=$('#fx'),cx=cv.getContext('2d'),cols=['#c21f4b','#a3173b','#e0476f','#f6c1cc','#8e1233'];
let W,H,P=[];
const size=()=>{W=cv.width=innerWidth;H=cv.height=innerHeight};size();addEventListener('resize',size);
const R=Math.random;
const petal=(b,x,y)=>({t:'p',b,x:x??R()*W,y:y??-20,vx:b?(R()-.5)*9:(R()-.5)*.6,vy:b?-R()*11-3:R()*.8+.5,r:R()*6.3,vr:(R()-.5)*.05,s:6+R()*9,c:cols[R()*5|0],sw:R()*6.3});
const spark=(b,x,y)=>({t:'s',b,x:x??R()*W,y:y??R()*H,vx:b?(R()-.5)*8:(R()-.5)*.2,vy:b?-R()*9:-R()*.3,s:1+R()*2.4,ph:R()*6.3,life:1});
for(let i=0;i<22;i++)P.push(petal(0,undefined,R()*H));
for(let i=0;i<45;i++)P.push(spark(0));
const burst=(x,y)=>{for(let i=0;i<70;i++)P.push(petal(1,x,y));for(let i=0;i<90;i++)P.push(spark(1,x,y))};
(function draw(){
  cx.clearRect(0,0,W,H);
  P=P.filter(p=>{
    if(p.t=='p'){
      p.sw+=.02;p.x+=p.vx+(p.b?0:Math.sin(p.sw)*.6);p.y+=p.vy;p.r+=p.vr;
      if(p.b){p.vy+=.18;p.vx*=.99}
      cx.save();cx.translate(p.x,p.y);cx.rotate(p.r);cx.scale(1,.55+Math.abs(Math.sin(p.sw))*.45);
      cx.globalAlpha=.85;cx.fillStyle=p.c;cx.beginPath();cx.ellipse(0,0,p.s,p.s*.6,0,0,6.3);cx.fill();cx.restore();
      if(p.y>H+30){if(p.b)return false;p.y=-20;p.x=R()*W}
    }else{
      p.ph+=.05;p.x+=p.vx;p.y+=p.vy;
      if(p.b){p.vy+=.15;p.life-=.012;if(p.life<=0)return false}else if(p.y<-5)p.y=H+5;
      cx.globalAlpha=Math.max(0,(.4+Math.sin(p.ph)*.4)*p.life);cx.fillStyle='#f1dba0';
      cx.shadowColor='#e8c682';cx.shadowBlur=8;cx.beginPath();cx.arc(p.x,p.y,p.s,0,6.3);cx.fill();cx.shadowBlur=0;
    }
    return true;
  });
  requestAnimationFrame(draw);
})();

/* ---- Подарункова коробка ---- */
const box=$('#box');
box.onclick=()=>{
  if(box.classList.contains('open'))return;
  box.classList.add('open');
  const r=box.getBoundingClientRect();
  burst(r.left+r.width/2,r.top+30);
  setTimeout(()=>burst(innerWidth/2,innerHeight*.55),600);
  setTimeout(()=>burst(innerWidth/2,innerHeight*.7),1200);
  $('#hint').textContent='З нашими 9 місяцями…';
  setTimeout(()=>{$('#intro').classList.add('gone');document.body.classList.remove('lock');scrollTo(0,0)},3000);
};

/* ---- Поява при скролі ---- */
$$('.tp,.card,.wish').forEach((e,i)=>e.style.setProperty('--dl',(i%3)*.15+'s'));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});
$$('.rv').forEach(e=>io.observe(e));

/* ---- Сад: троянди, тюльпани, ромашки ---- */
const bed=$('#bed'),kinds=['r','t','d','r','d','t','r'],N=innerWidth<600?9:15;
for(let i=0;i<N;i++){
  const k=kinds[i%kinds.length],f=document.createElement('div');
  f.className='fl';
  f.style.cssText=`--h:${130+R()*170|0}px;--d:${(i*.12).toFixed(2)}s`;
  const head=k=='r'?'<div class="rose"></div>':k=='t'?'<div class="tu"></div>'
    :'<div class="dz">'+Array.from({length:12},(_,j)=>`<i style="transform:rotate(${j*30}deg)"></i>`).join('')+'<b></b></div>';
  f.innerHTML=`<div class="sw" style="animation-delay:-${(R()*5).toFixed(1)}s"><div class="st"></div><div class="hd">${head}</div></div>`;
  bed.appendChild(f);
}
io.observe(bed);

/* ---- Галерея ---- */
$$('.ph').forEach(p=>{
  const src=p.dataset.photo;
  if(src){p.style.backgroundImage=`url("${src}")`;p.classList.add('has')}
  p.onclick=()=>{
    $('#lbi').style.backgroundImage=src?`url("${src}")`:'';
    $('#lbc').textContent=src?p.dataset.cap:p.dataset.cap+' — тут буде ваше фото';
    $('#lb').classList.add('on');
  };
});
$('#lb').onclick=()=>$('#lb').classList.remove('on');
