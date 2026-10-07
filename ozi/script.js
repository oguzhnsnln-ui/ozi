const light=document.querySelector('.mouse-light');
if (light) window.addEventListener('pointermove',e=>{light.style.left=e.clientX+'px';light.style.top=e.clientY+'px'});
const reveal=[...document.querySelectorAll('.section,.feature,.quote,.cards article,.g')];
const io=new IntersectionObserver(es=>{es.forEach(x=>{if(x.isIntersecting){x.target.animate([{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'translateY(0)'}],{duration:650,easing:'cubic-bezier(.2,.7,.2,1)',fill:'forwards'});io.unobserve(x.target)}})},{threshold:.12});
reveal.forEach(x=>{x.style.opacity=0;io.observe(x)});
const lb=document.getElementById('lightbox'), lbImg=document.getElementById('lb-image'), lbCap=document.getElementById('lb-caption');
let items=[], lbIndex=0;
function collectItems(){ items=[...document.querySelectorAll('.lightbox-item')]; }
function showLightbox(i){
  collectItems();
  if(!items.length) return;
  lbIndex=(i+items.length)%items.length;
  const img=items[lbIndex].querySelector('img');
  lbImg.src=img.currentSrc||img.src; lbImg.alt=img.alt;
  lbCap.textContent=(items[lbIndex].querySelector('figcaption')?.textContent||'').trim();
  lb.classList.add('open'); lb.setAttribute('aria-hidden','false'); document.body.classList.add('no-scroll');
}
function closeLightbox(){lb.classList.remove('open');lb.setAttribute('aria-hidden','true');document.body.classList.remove('no-scroll')}
window.rebindLightbox=()=>{
  collectItems();
  items.forEach((it,i)=>{ if(it.dataset.lbBound) return; it.dataset.lbBound='1'; it.addEventListener('click',e=>{ if(e.target.closest('.image-download')) return; showLightbox(i); }); });
};
window.rebindLightbox();
document.querySelector('.lb-close').addEventListener('click',closeLightbox);
document.querySelector('.lb-prev').addEventListener('click',()=>showLightbox(lbIndex-1));
document.querySelector('.lb-next').addEventListener('click',()=>showLightbox(lbIndex+1));
lb.addEventListener('click',e=>{if(e.target===lb) closeLightbox()});
document.addEventListener('keydown',e=>{
  if(!lb.classList.contains('open')) return;
  if(e.key==='Escape') closeLightbox();
  if(e.key==='ArrowLeft') showLightbox(lbIndex-1);
  if(e.key==='ArrowRight') showLightbox(lbIndex+1);
});
