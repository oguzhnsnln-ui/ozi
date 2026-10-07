(function(){
  const start = () => {
    const audio = document.getElementById('site-music');
    const button = document.getElementById('music-control');
    if (!audio) return;
    let started = false;
    audio.preload = 'auto';
    audio.playsInline = true;
    function mark(on){
      started = on;
      if (button) {
        button.classList.toggle('is-playing', on);
        button.setAttribute('aria-label', on ? 'Müziği durdur' : 'Müziği aç');
      }
    }
    function play(){
      if (audio.dataset.enabled === '0') return;
      audio.muted = false;
      const p = audio.play();
      if (p && p.then) p.then(()=>mark(true)).catch(()=>mark(false));
      else mark(true);
    }
    if (audio.dataset.enabled !== '0') play();
    const unlock = () => {
      play();
      if (!audio.paused) {
        ['pointerdown','touchstart','click','keydown'].forEach(e=>window.removeEventListener(e, unlock, true));
      }
    };
    ['pointerdown','touchstart','click','keydown'].forEach(e=>window.addEventListener(e, unlock, true));
    window.addEventListener('pageshow', play);
    window.addEventListener('focus', ()=>{ if (audio.paused) play(); });
    if (button) button.addEventListener('click', e=>{
      e.stopPropagation();
      if (audio.paused) play(); else { audio.pause(); mark(false); }
    });
  };
  const ready = window.siteContentReady;
  if (ready && typeof ready.then === 'function') ready.then(start); else start();
})();
