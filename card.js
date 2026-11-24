(function(){
const P={nombre:'Patricia López',corto:'Patricia',cargo:'Agente inmobiliaria',oficina:'RE/MAX Cuore',dir:'Rivadavia 430, Local 1',tel:'11 6616-5131',wa:'5491166165131',telI:'+5491166165131',mail:'patricial@remax.com.ar',web:'https://www.remax.com.ar/agent/patricia-lopez'};
const $=s=>document.querySelector(s);
const msg=()=>`¡Hola! Soy ${P.nombre}, ${P.cargo.toLowerCase()} de ${P.oficina}. Te dejo mi tarjeta con mis datos de contacto.\nMis propiedades: ${P.web}`;
$('#kWa').href='https://wa.me/'+P.wa;$('#kTel').href='tel:'+P.telI;$('#kWeb').href=P.web;$('#kMail').href='mailto:'+P.mail;
function ls(c,v){if('letterSpacing' in c)c.letterSpacing=v}
function rr(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
async function img(){
  await Promise.all(['900 80px Montserrat','800 30px Montserrat','600 30px Montserrat','500 30px Montserrat'].map(f=>document.fonts.load(f))).catch(()=>{});
  const ph=new Image();ph.src='patricia.jpg';await ph.decode().catch(()=>{});
  const logo=await window.__logoImg();
  const W=1080,H=1350,F='Montserrat,sans-serif',cv=document.createElement('canvas');cv.width=W;cv.height=H;const c=cv.getContext('2d');
  const g=c.createRadialGradient(W*.9,0,40,W*.55,H*.45,H);g.addColorStop(0,'#0B3BD6');g.addColorStop(.45,'#00134A');g.addColorStop(1,'#000A28');c.fillStyle=g;c.fillRect(0,0,W,H);
  const g2=c.createRadialGradient(0,H,20,0,H,700);g2.addColorStop(0,'rgba(255,18,0,.28)');g2.addColorStop(1,'rgba(255,18,0,0)');c.fillStyle=g2;c.fillRect(0,0,W,H);
  c.strokeStyle='rgba(255,255,255,.03)';c.lineWidth=4;for(let x=-H;x<W;x+=30){c.beginPath();c.moveTo(x,0);c.lineTo(x+H,H);c.stroke()}
  c.fillStyle='#fff';rr(c,W/2-290,90,580,120,18);c.fill();
  if(logo){const lw=300,lh=lw*27.9/101.6;c.drawImage(logo,W/2-262,150-lh/2,lw,lh)}
  c.fillStyle='#C9D3E8';c.fillRect(W/2+56,118,2,64);c.fillStyle='#000E35';c.textAlign='left';c.font='800 30px '+F;ls(c,'6px');c.fillText("CUORE",W/2+78,161);ls(c,'0px');
  const cx=W/2,cy=500,r=190;const rg=c.createLinearGradient(cx-r,cy-r,cx+r,cy+r);rg.addColorStop(0,'#FF1200');rg.addColorStop(.5,'#ffffff');rg.addColorStop(1,'#0043FF');
  c.beginPath();c.arc(cx,cy,r+12,0,7);c.fillStyle=rg;c.fill();c.beginPath();c.arc(cx,cy,r+3,0,7);c.fillStyle='#000E35';c.fill();
  c.save();c.beginPath();c.arc(cx,cy,r-6,0,7);c.clip();if(ph.naturalWidth){const s=Math.min(ph.naturalWidth,ph.naturalHeight);c.drawImage(ph,(ph.naturalWidth-s)/2,(ph.naturalHeight-s)/2,s,s,cx-r,cy-r,2*r,2*r)}c.restore();
  c.textAlign='center';c.fillStyle='#fff';c.font='900 84px '+F;c.fillText(P.nombre,W/2,810);
  c.fillStyle='#C9D3E8';c.font='700 27px '+F;ls(c,'8px');c.fillText((P.cargo+' · '+P.oficina).toUpperCase(),W/2+4,870);ls(c,'0px');
  c.fillStyle='#FF1200';c.fillRect(W/2-60,915,60,4);c.fillStyle='#0043FF';c.fillRect(W/2,915,60,4);
  c.fillStyle='rgba(255,255,255,.94)';c.font='600 36px '+F;c.fillText('WhatsApp  '+P.tel,W/2,1000);c.fillText(P.mail,W/2,1062);
  c.fillStyle='#C9D3E8';c.font='500 30px '+F;c.fillText(P.dir,W/2,1124);
  c.fillStyle='#FF1200';c.fillRect(0,H-10,W*.5,10);c.fillStyle='#0043FF';c.fillRect(W*.5,H-10,W*.5,10);
  return new Promise(res=>cv.toBlob(b=>res(new File([b],'Tarjeta_Patricia_Lopez.png',{type:'image/png'})),'image/png'));
}
$('#kSend').onclick=async()=>{try{window.shareFile(await img(),msg(),true,msg())}catch(e){window.toast('No se pudo preparar la tarjeta. Probá de nuevo.')}};
$('#kSave').onclick=async()=>{let photo='';try{const b=await fetch('patricia.jpg').then(r=>r.blob());photo=await new Promise(r=>{const fr=new FileReader();fr.onload=()=>r(fr.result.split(',')[1]);fr.readAsDataURL(b)})}catch(e){}
  const v=['BEGIN:VCARD','VERSION:3.0','N:López;Patricia;;;','FN:'+P.nombre,'ORG:'+P.oficina,'TITLE:'+P.cargo,'TEL;TYPE=CELL:'+P.telI,'EMAIL;TYPE=WORK:'+P.mail,'ADR;TYPE=WORK:;;'+P.dir+';;;;Argentina','URL:'+P.web,photo?'PHOTO;ENCODING=b;TYPE=JPEG:'+photo:'','END:VCARD'].filter(Boolean).join('\r\n');
  window.saveFile(new File([v],'Patricia_Lopez.vcf',{type:'text/vcard'}),'Abrí el archivo descargado para guardar el contacto.')};
})();
