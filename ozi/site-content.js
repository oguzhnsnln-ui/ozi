(() => {
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const getState = async () => {
    if (window.OguzhanCMS?.getSite) return window.OguzhanCMS.getSite();
    try { return await fetch(`data/site-content.json?t=${Date.now()}`, {cache:'no-store'}).then(r=>r.json()); } catch { return null; }
  };
  const mediaUrl = async (item, fallback='') => {
    if (item?.mediaId && window.OguzhanCMS?.getMediaUrl) return await window.OguzhanCMS.getMediaUrl(item.mediaId) || fallback;
    return item?.image || item?.src || fallback;
  };
  async function loadSiteContent() {
    const data = await getState();
    if (!data) return null;
    const hero = document.querySelector('.hero-bg');
    const heroSrc = await mediaUrl(data.hero, 'photos/hero-background.jpg');
    if (hero && heroSrc) hero.style.backgroundImage = `url("${heroSrc}")`;
    if (data.profile) {
      const img = document.getElementById('profile-photo');
      const src = await mediaUrl(data.profile, 'photos/profile.jpg');
      if (img && src) { img.src = src; img.alt = data.profile.alt || 'Oğuzhan Şanalan'; }
      const dl = document.getElementById('profile-download');
      if (dl && src) { dl.href = src; }
    }
    const audio = document.getElementById('site-music');
    const button = document.getElementById('music-control');
    if (audio && data.music) {
      audio.pause();
      audio.loop = data.music.loop !== false;
      audio.volume = Number.isFinite(Number(data.music.volume)) ? Math.min(1, Math.max(0, Number(data.music.volume))) : 1;
      audio.dataset.enabled = data.music.enabled !== false ? '1' : '0';
      const musicSrc = await mediaUrl(data.music, 'media/music/sabah-bes.mp3');
      if (musicSrc) { audio.src = musicSrc; audio.load(); }
      audio.setAttribute('aria-label', [data.music.artist, data.music.title].filter(Boolean).join(' - ') || 'Site müziği');
      if (button) {
        const span = button.querySelector('span');
        if (span) span.textContent = data.music.title || 'Müzik';
        button.style.display = data.music.enabled === false ? 'none' : '';
      }
    }
    const grid = document.getElementById('gallery-grid');
    if (grid && Array.isArray(data.gallery)) {
      const rows = [];
      for (let i=0;i<data.gallery.length;i++) {
        const item=data.gallery[i];
        const src=await mediaUrl(item);
        const cls=['g','lightbox-item']; if(i%4===0)cls.push('big'); if(i%4===2)cls.push('tall'); if(i%4===3)cls.push('wide');
        rows.push(`<figure class="${cls.join(' ')}"><img src="${esc(src)}" alt="${esc(item.alt||item.title||'Oğuzhan fotoğrafı')}" loading="lazy"><figcaption>${esc(item.title||'')}</figcaption><a class="image-download" href="${esc(src)}" download>İNDİR ↓</a></figure>`);
      }
      grid.innerHTML=rows.join(''); window.rebindLightbox?.();
    }
    return data;
  }
  window.siteContentReady = loadSiteContent();
  document.addEventListener('DOMContentLoaded',()=>{ if(!window.siteContentReady) window.siteContentReady=loadSiteContent(); });
  window.addEventListener('os-cms-updated',()=>{ loadSiteContent(); });
})();
