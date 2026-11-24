(function(){
const $=i=>document.getElementById(i);
// Repartos de Patricia (agente / oficina)
const PLANS=[{k:'rapp',n:'Rapp',ag:45},{k:'alto',n:'Alto',ag:60},{k:'puro',n:'Puro',ag:80}];
const st={tab:'alq',plan:'rapp',cur:'$',pct1:4,iva1:false,pv:3,pc:4,iva:'none'};
const D={};
const num=v=>{v=String(v||'').trim().replace(/\./g,'').replace(',','.');const n=parseFloat(v);return isFinite(n)&&n>0?n:0};
const money=(n,c)=>c+' '+n.toLocaleString('es-AR',{minimumFractionDigits:0,maximumFractionDigits:2});
const plan=()=>PLANS.find(p=>p.k===st.plan);
const ap=()=>plan().ag/100;
document.querySelectorAll('#calc input[data-m]').forEach(el=>el.addEventListener('input',()=>{
  const raw=el.value.replace(/[^\d,]/g,'');const [i,d]=raw.split(',');
  const s=(i||'').replace(/^0+(?=\d)/,'').replace(/\B(?=(\d{3})+(?!\d))/g,'.');
  el.value=d!==undefined?s+','+d.slice(0,2):s;calc()}));
document.querySelectorAll('#calc input:not([data-m])').forEach(el=>el.addEventListener('input',calc));
function seg(id,key,vals,fmt){const box=$(id);box.innerHTML='';vals.forEach(v=>{const b=document.createElement('button');b.type='button';b.innerHTML=fmt?fmt(v):v;b.onclick=()=>{st[key]=v;paint();calc()};b.dataset.v=v;box.append(b)})}
seg('sAg','plan',PLANS.map(p=>p.k),k=>{const p=PLANS.find(x=>x.k===k);return `${p.n}<small>${p.ag}% agente · ${100-p.ag}% oficina</small>`});
seg('sCur','cur',['$','US$'],v=>v==='$'?'Pesos':'Dólares');
seg('sP1','pct1',[1,2,3,4,5],v=>v+'%');
seg('sIva1','iva1',[false,true],v=>v?'Con IVA':'Sin IVA');
seg('sPv','pv',[1,2,3,4,5],v=>v+'%');
seg('sPc','pc',[1,2,3,4,5],v=>v+'%');
seg('sIva','iva',['none','buyer','seller'],v=>({none:'Sin IVA',buyer:'Comprador',seller:'Vendedor'})[v]);
const map={sAg:'plan',sCur:'cur',sP1:'pct1',sIva1:'iva1',sPv:'pv',sPc:'pc',sIva:'iva'};
function paint(){for(const id in map)$(id).querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v)===String(st[map[id]])));
  document.querySelectorAll('.ctab').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.t===st.tab)));
  $('cAlq').hidden=st.tab!=='alq';$('cVen').hidden=st.tab!=='ven';
  document.querySelectorAll('.curs').forEach(e=>e.textContent=st.cur)}
document.querySelectorAll('.ctab').forEach(b=>b.onclick=()=>{st.tab=b.dataset.t;paint();calc()});
function rows(a,c){return a.filter(r=>r.v>0).map(r=>`<div class="crow${r.neg?' neg':''}"><div>${r.l}${r.s?`<small>${r.s}</small>`:''}</div><b>${r.neg?'− ':''}${money(r.v,c)}</b></div>`).join('')||'<p class="cempty">Completá los datos para ver el detalle.</p>'}
function rep(el,base,c){const a=plan().ag;$(el).innerHTML=base>0?`<div class="rbar"><i style="width:${100-a}%"></i><i style="width:${a}%"></i></div><div class="rl"><span>Oficina ${100-a}%<b>${money(base*(1-ap()),c)}</b></span><span>Agente ${a}%<b>${money(base*ap(),c)}</b></span></div>`:''}
function mk(n,b){const a=plan().ag;return{name:n,base:b,o:b*(1-ap()),a:b*ap(),lo:'Oficina '+(100-a)+'%',la:'Agente '+a+'% ('+plan().n+')'}}
function calc(){
  const c=st.cur,rent=num($('rent').value),m=num($('months').value),dep=num($('dep').value),pct=st.pct1,firm=num($('firm').value),inf=num($('inf').value),res=num($('res').value),own=num($('own').value);
  const hon=rent*m*pct/100,ownV=rent*own,iv=st.iva1?hon*.21:0,tot=Math.max(rent+dep+hon+iv+firm+inf-res,0);
  const list=[{l:'Mes de ingreso',v:rent},{l:'Depósito',v:dep},{l:'Honorarios inmobiliarios',s:pct+'% sobre '+m+' meses',v:hon},{l:'Certificación de firmas',v:firm},{l:'Informes',v:inf},{l:'Reserva ya abonada',v:res,neg:true}];
  if(iv)list.splice(3,0,{l:'IVA 21%',s:'sobre honorarios inmobiliarios',v:iv});
  const ol=[{l:'Honorarios inmobiliarios',s:own+' '+(own===1?'mes':'meses')+' de alquiler',v:ownV}];
  $('r1').innerHTML=rows(list,c);$('t1').textContent=money(tot,c);$('r1o').innerHTML=rows(ol,c);$('t1o').textContent=money(ownV,c);
  rep('rp1',hon,c);rep('rp1o',ownV,c);
  D.alq={title:'Gastos de alquiler',cur:c,extra:[['Alquiler mensual',money(rent,c)],['Duración',m+' meses']],sections:[{name:'Inquilino',lines:list,tot},{name:'Propietario',lines:ol,tot:ownV}],
    reparto:[mk('Reparto · punta inquilino',hon),mk('Reparto · punta propietario',ownV)].filter(g=>g.base>0)};
  const U='US$',p=num($('price').value),pv=st.pv,pc=st.pc,hv=p*pv/100,hc=p*pc/100,net=hv+hc,ivaB=st.iva==='buyer'?hc*.21:0,ivaS=st.iva==='seller'?hv*.21:0;
  const side=(n,h,pp,v)=>{const L=[{l:'Honorarios inmobiliarios',s:pp+'% del valor',v:h}];if(v)L.push({l:'IVA 21%',s:'sobre honorarios',v});return{name:n,lines:L,tot:h+v}};
  const sb=side('Comprador',hc,pc,ivaB),ss=side('Vendedor',hv,pv,ivaS);
  $('r2c').innerHTML=rows(sb.lines,U);$('t2c').textContent=money(sb.tot,U);$('r2v').innerHTML=rows(ss.lines,U);$('t2v').textContent=money(ss.tot,U);
  $('t2').textContent=money(sb.tot+ss.tot,U);rep('rp2',net,U);
  D.ven={title:'Compra y venta',cur:U,extra:[['Valor de la propiedad',money(p,U)]],sections:[sb,ss],reparto:[mk('Reparto · honorarios sin IVA',net)].filter(g=>g.base>0)};
  for(const k in D)D[k].totAg=D[k].reparto.reduce((t,g)=>t+g.a,0);
  $('bt1l').textContent=st.tab==='alq'?'Al inquilino':'Al comprador';$('bt2l').textContent=st.tab==='alq'?'Al propietario':'Al vendedor';
}
// imagen para WhatsApp (estilo RE/MAX)
function fit(c,t,w){const o=t;while(t.length>2&&c.measureText(t).width>w)t=t.slice(0,-1);return t===o?t:t.trim()+'…'}
function ls(c,v){if('letterSpacing' in c)c.letterSpacing=v}
function rr(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
async function render(d){
  const W=1080,X=96,R=W-96,F='Montserrat,system-ui,sans-serif',NV='#000E35',BL='#0043FF',RD='#FF1200',BG='#FFFFFF',MUT='#4A5068',TX='#000E35',LN='#DCE2EF';
  const logo=await window.__logoImg();
  const secs=d.sections.map(s=>({name:s.name,tot:s.tot,L:s.lines.filter(r=>r.v>0)})).filter(s=>s.tot>0);
  let H=520+d.info.length*58+20;secs.forEach(s=>{H+=50;s.L.forEach(r=>H+=r.s?106:84);H+=146});
  if(d.reparto){d.reparto.forEach(()=>H+=50+84*3+36);H+=146}H+=170;
  const cv=document.createElement('canvas');cv.width=W;cv.height=H;const c=cv.getContext('2d');
  c.fillStyle=BG;c.fillRect(0,0,W,H);
  const g=c.createLinearGradient(0,0,W,320);g.addColorStop(0,NV);g.addColorStop(1,'#00187A');c.fillStyle=g;c.fillRect(0,0,W,320);
  c.fillStyle=RD;c.fillRect(0,320,W*.5,8);c.fillStyle=BL;c.fillRect(W*.5,320,W*.5,8);
  c.fillStyle='#fff';rr(c,W/2-290,70,580,120,18);c.fill();
  if(logo){const lw=300,lh=lw*27.9/101.6;c.drawImage(logo,W/2-262,130-lh/2,lw,lh)}
  c.fillStyle='#C9D3E8';c.fillRect(W/2+56,98,2,64);c.fillStyle=NV;c.textAlign='left';c.font='800 30px '+F;ls(c,'6px');c.fillText("CUORE",W/2+78,141);ls(c,'0px');
  c.textAlign='center';c.fillStyle='#fff';c.font='700 25px '+F;ls(c,'8px');c.fillText('CALCULADORA DE HONORARIOS',W/2+4,262);ls(c,'0px');
  c.textAlign='left';c.fillStyle=NV;c.font='800 56px '+F;c.fillText(d.title,X,410);
  c.fillStyle=MUT;c.font='500 25px '+F;c.fillText(new Date().toLocaleDateString('es-AR',{day:'numeric',month:'long',year:'numeric'}),X,454);
  if(d.internal){c.textAlign='right';c.fillStyle=RD;c.font='800 22px '+F;ls(c,'5px');c.fillText('USO INTERNO',R,454);ls(c,'0px')}
  let y=520;
  d.info.forEach(r=>{c.textAlign='left';c.fillStyle=MUT;c.font='500 26px '+F;c.fillText(r[0],X,y);c.textAlign='right';c.fillStyle=TX;c.font='600 28px '+F;c.fillText(fit(c,r[1],560),R,y);y+=58});y+=20;
  secs.forEach(s=>{c.textAlign='left';c.fillStyle=BL;c.font='800 24px '+F;ls(c,'6px');c.fillText(s.name.toUpperCase(),X,y+30);ls(c,'0px');y+=50;
    s.L.forEach(r=>{const rh=r.s?106:84;c.textAlign='left';c.fillStyle=TX;c.font='500 30px '+F;c.fillText(r.l,X,y+38);
      if(r.s){c.fillStyle=MUT;c.font='500 22px '+F;c.fillText(r.s,X,y+76)}
      c.textAlign='right';c.fillStyle=r.neg?RD:TX;c.font='700 32px '+F;c.fillText((r.neg?'− ':'')+money(r.v,d.cur),R,y+38);
      c.fillStyle=LN;c.fillRect(X,y+rh-14,R-X,2);y+=rh});
    c.fillStyle=BL;c.fillRect(X,y+10,R-X,4);c.textAlign='left';c.fillStyle=MUT;c.font='700 22px '+F;ls(c,'5px');c.fillText('TOTAL A PAGAR',X,y+70);ls(c,'0px');
    c.textAlign='right';c.fillStyle=BL;c.font='900 58px '+F;c.fillText(money(s.tot,d.cur),R,y+80);y+=146});
  if(d.reparto){d.reparto.forEach(g=>{c.textAlign='left';c.fillStyle=BL;c.font='800 24px '+F;ls(c,'6px');c.fillText(g.name.toUpperCase(),X,y+30);ls(c,'0px');y+=50;
      [['Honorarios cobrados',g.base,0],[g.lo,g.o,0],[g.la,g.a,1]].forEach(r=>{c.textAlign='left';c.fillStyle=TX;c.font=(r[2]?'800 ':'500 ')+'30px '+F;c.fillText(r[0],X,y+38);
        c.textAlign='right';c.font=(r[2]?'800 ':'600 ')+'32px '+F;c.fillText(money(r[1],d.cur),R,y+38);c.fillStyle=LN;c.fillRect(X,y+70,R-X,2);y+=84});y+=36});
    c.fillStyle=RD;c.fillRect(X,y+10,R-X,4);c.textAlign='left';c.fillStyle=MUT;c.font='700 22px '+F;ls(c,'5px');c.fillText('TOTAL PARA EL AGENTE',X,y+70);ls(c,'0px');
    c.textAlign='right';c.fillStyle=BL;c.font='900 58px '+F;c.fillText(money(d.totAg,d.cur),R,y+80);y+=146}
  y+=40;c.textAlign='center';c.fillStyle=MUT;c.font='500 22px '+F;c.fillText('Valores estimados. Confirmá los montos finales con tu agente.',W/2,y+24);
  if(d.ag){c.fillStyle=NV;c.font='700 27px '+F;c.fillText('Preparado por '+fit(c,d.ag,700),W/2,y+70)}
  c.fillStyle=RD;c.fillRect(0,H-10,W*.5,10);c.fillStyle=BL;c.fillRect(W*.5,H-10,W*.5,10);
  return new Promise(r=>cv.toBlob(r,'image/png'));
}
const draw=d=>Promise.all(['500 24px Montserrat','700 24px Montserrat','800 24px Montserrat','900 40px Montserrat'].map(f=>document.fonts.load(f))).catch(()=>{}).then(()=>render(d));
function send(idx,internal){calc();const x=D[st.tab];const secs=idx==null?x.sections:[x.sections[idx]];
  if(!secs.some(s=>s.tot>0)){window.toast('Cargá los valores primero.');return}
  const ttl=internal?'Liquidación completa':idx==null?x.title:('Gastos del '+secs[0].name.toLowerCase());
  const info=[],cli=$('cli').value.trim(),dir=$('cdir').value.trim(),ag=$('cag').value.trim();
  if(cli)info.push(['Para',cli]);if(dir)info.push(['Propiedad',dir]);info.push(...x.extra);
  const n=(internal?'liquidacion-completa':'honorarios')+'.png';
  draw({title:ttl,sections:secs,reparto:internal?x.reparto:null,totAg:x.totAg,internal,cur:x.cur,info,ag}).then(b=>window.shareFile(new File([b],n,{type:'image/png'}),ttl,!internal))}
$('bt1').onclick=()=>send(0);$('bt2').onclick=()=>send(1);$('btL').onclick=()=>send(null,true);
paint();calc();
})();
