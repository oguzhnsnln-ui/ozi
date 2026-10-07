/* OŞ Admin — static, PHP'siz yönetim paneli. Değişiklikleri tarayıcıdaki IndexedDB'de saklar. */
(() => {
  const DB_NAME = 'oguzhan_sanalan_cms';
  const DB_VERSION = 1;
  const STORE_SETTINGS = 'settings';
  const STORE_PRODUCTS = 'products';
  const STORE_MEDIA = 'media';
  const ADMIN_PASSWORD = 'OSAdmin!2026';
  let dbPromise = null;
  const objectUrls = new Set();
const DEFAULT_SITE = {"version":1,"profile":{"image":"photos/profile.jpg","full":"photos/profil-full.jpg","alt":"Oğuzhan Şanalan profil fotoğrafı"},"hero":{"image":"photos/hero-background.jpg"},"gallery":[{"id":"g1","image":"photos/oguzhan-style-outdoor.jpg","title":"01 · OUTDOOR EDITORIAL","alt":"Oğuzhan — yeni dış mekân stili"},{"id":"g2","image":"photos/oguzhan-style-mirror.jpg","title":"02 · MIRROR EDITORIAL","alt":"Oğuzhan — yeni ayna stili"},{"id":"g3","image":"photos/photo-original-4.jpg","title":"03 · SUNSET","alt":"Oğuzhan — gün batımında"},{"id":"g4","image":"photos/generated-night.png","title":"06 · NIGHT / CITY","alt":"Oğuzhan — gece şehir portresi"}],"music":{"enabled":true,"src":"media/music/sabah-bes.mp3","title":"Sabah Beş","artist":"Noma","loop":true,"volume":1}};
  const DEFAULT_PRODUCTS = [{"name":"iPhone 18 Pro","brand":"Apple","type":"phone","price":137999,"summary":"A20 Pro · 6.3 inç Super Retina XDR · değişken diyaframlı 48 MP Pro Fusion","specs":[["İşlemci","A20 Pro"],["Ekran","6.3\" Super Retina XDR OLED"],["Kamera","48 MP Pro Fusion / değişken diyafram"],["Depolama","256 GB–2 TB"],["Ön kamera","18 MP Center Stage"]],"url":"https://www.apple.com/tr/shop/buy-iphone/iphone-18-pro","source":"Apple Türkiye","image":"https://iphonekaitori.tokyo/upload/goods/20260911/iPhone%2018%20Pro%20256GB%20Silver.png","id":"p001","managed":false},{"name":"iPhone 17","brand":"Apple","type":"phone","price":99999,"summary":"A19 · 6.3 inç ProMotion · 48 MP Dual Fusion","specs":[["İşlemci","A19"],["Ekran","6.3\" Super Retina XDR • 120 Hz"],["Kamera","48 MP Dual Fusion"],["Depolama","256 / 512 GB"],["Pil","30 saate kadar video"]],"url":"https://www.apple.com/tr/shop/buy-iphone/iphone-17","source":"Apple Türkiye","image":"https://media.power-cdn.net/images/h-0acac243530744f0b9abf159dc3c440f/products/4157285/4157285_2_1200x1200_w_g.jpg","id":"p002","managed":false},{"name":"iPhone Air","brand":"Apple","type":"phone","price":84999,"summary":"A19 Pro · ultra ince tasarım · 48 MP Fusion","specs":[["İşlemci","A19 Pro"],["Ekran","6.5\" OLED"],["Kamera","48 MP Fusion"],["Tasarım","Titanyum / ultra ince"],["Video","4K Dolby Vision"]],"url":"https://www.apple.com/tr/shop/buy-iphone","source":"Apple Türkiye","image":"https://i-system.gr/storage/i3commerce/images/i/p/iphone_air_cloud_white_3_up_screen_usen_img_03.jpg","id":"p003","managed":false},{"name":"Galaxy S26 Ultra","brand":"Samsung","type":"phone","price":132999,"summary":"6.9 inç · 200 MP · Snapdragon 8 Elite Gen 5","specs":[["İşlemci","Snapdragon 8 Elite Gen 5"],["Ekran","6.9\" AMOLED"],["Kamera","200 MP"],["RAM","12 / 16 GB"],["Depolama","256 GB–1 TB"]],"url":"https://www.samsung.com/tr/smartphones/galaxy-s26-ultra/buy/","source":"Samsung Türkiye","image":"https://www.powerplanetonline.com/cdnassets/products/102888/samsung-galaxy-s26-ultra-cobalt-violet-rendimiento-snapdragon-8-elite-gen5_l.webp","id":"p004","managed":false},{"name":"Galaxy S26+","brand":"Samsung","type":"phone","price":103999,"summary":"6.7 inç · 12 GB RAM · Galaxy S26 serisi","specs":[["RAM","12 GB"],["Ekran","6.7\" AMOLED"],["Depolama","256 / 512 GB"],["Pil","4900 mAh"],["Seri","Galaxy S26"]],"url":"https://www.samsung.com/tr/smartphones/galaxy-s26/buy/","source":"Samsung Türkiye","image":"https://microless.com/cdn/products/9995f5de2a9b54d198fe4a52323a0e32-hi.jpg","id":"p005","managed":false},{"name":"Galaxy S26","brand":"Samsung","type":"phone","price":86999,"summary":"6.3 inç · 12 GB RAM · Galaxy S26 serisi","specs":[["RAM","12 GB"],["Ekran","6.3\" AMOLED"],["Depolama","256 / 512 GB"],["Pil","4300 mAh"],["Seri","Galaxy S26"]],"url":"https://www.samsung.com/tr/smartphones/galaxy-s26/buy/","source":"Samsung Türkiye","image":"https://api.technopolis.bg/medias/Product-details-main-509884.jpg?context=bWFzdGVyfHJvb3R8MjIzNjU4fGltYWdlL2pwZWd8YURjMkwyZ3pZaTgyTVRZME56WXhOVFE1TWpFeU5pOVFjbTlrZFdOMExXUmxkR0ZwYkhNdGJXRnBibDgxTURrNE9EUXVhbkJufGEyMzI5YTIwZTI5NDk0NzE0MGZjMWFmM2MxMjlkMDQ5YTI4YTZkODBhNWE1ZTMyNDcwMmUzMmMzZTE4NWUyZGY","id":"p006","managed":false},{"name":"HONOR Magic V6","brand":"HONOR","type":"phone","price":129999,"summary":"Katlanabilir · 16 GB + 512 GB · 6660 mAh · 100W","specs":[["İşlemci","Snapdragon 8 Elite Gen 5"],["Ekran","7.95\" iç / 6.52\" dış"],["RAM","16 GB"],["Depolama","512 GB"],["Pil","6660 mAh"]],"url":"https://trshop.honor.com/products/honor-magic-v6","source":"HONOR Türkiye","image":"https://admin.mob.hr/uploads/blog/thumbs/thumb2_honor-Magic-V6-red-images-1-1.png","id":"p007","managed":false},{"name":"MacBook Air 13\" M5","brand":"Apple","type":"computer","price":84999,"summary":"M5 · 13.6 inç Liquid Retina · 16 GB · 512 GB","specs":[["Çip","Apple M5"],["Ekran","13.6\" Liquid Retina"],["Bellek","16 GB temel"],["Depolama","512 GB temel"],["Pil","18 saate kadar video"]],"url":"https://www.apple.com/tr/macbook-air/","source":"Apple Türkiye","image":"https://proinside.net/wa-data/public/shop/products/57/26/2657/images/12973/12973.970.jpg","id":"p008","managed":false},{"name":"MacBook Pro 14\" M5","brand":"Apple","type":"computer","price":129999,"summary":"M5 · 14.2 inç Liquid Retina XDR · profesyonel kullanım","specs":[["Çip","Apple M5"],["Ekran","14.2\" Liquid Retina XDR"],["Bellek","16 GB temel"],["Depolama","512 GB temel"],["Portlar","Thunderbolt 4 / HDMI / SDXC"]],"url":"https://www.apple.com/tr/shop/buy-mac/macbook-pro","source":"Apple Türkiye","image":"https://image.vandenborre.be/WEB/images/products/superzoom/apple_mbp14-m5-32-1tb-sl_7626606_1.jpg","id":"p009","managed":false},{"name":"MacBook Pro 14\" M5 Pro","brand":"Apple","type":"computer","price":174374,"summary":"M5 Pro · 14.2 inç Liquid Retina XDR · yüksek performans","specs":[["Çip","Apple M5 Pro"],["Ekran","14.2\" Liquid Retina XDR"],["Bellek","24 GB temel"],["Depolama","1 TB temel"],["Portlar","Thunderbolt 5 / HDMI / SDXC"]],"url":"https://www.apple.com/tr/shop/buy-mac/macbook-pro","source":"Apple Türkiye","image":"https://image.vandenborre.be/WEB/images/products/superzoom/apple_mbp14-m5-32-1tb-sl_7626606_1.jpg","id":"p010","managed":false},{"name":"ROG Zephyrus G16 (2026)","brand":"ASUS","type":"computer","price":166880.68,"summary":"Core Ultra 9 386H · RTX 5070 · 16\" 2.5K 240Hz OLED","specs":[["CPU","Core Ultra 9 386H"],["GPU","RTX 5070 Laptop"],["Ekran","16\" 2.5K 240Hz OLED"],["SSD","2 TB NVMe"],["NPU","50 TOPS’e kadar"]],"url":"https://rog.asus.com/tr/laptops/rog-zephyrus/rog-zephyrus-g16-2026/","source":"ASUS Türkiye","image":"https://cdn.hstatic.net/products/200000507631/28106_laptop_asus_rog_zephyrus_g16_gu605cm_qr078w_b972bc1ad64240a5ac93693c4b83f807.jpg","id":"p011","managed":false},{"name":"ROG Zephyrus G16 RTX 5090","brand":"ASUS","type":"computer","price":306314.77,"summary":"Core Ultra 9 386H · RTX 5090 · 16\" 2.5K 240Hz OLED","specs":[["CPU","Core Ultra 9 386H"],["GPU","RTX 5090 Laptop"],["Ekran","16\" 2.5K 240Hz OLED"],["SSD","2 TB NVMe"],["RAM","Konfigürasyona göre"]],"url":"https://rog.asus.com/tr/laptops/rog-zephyrus/rog-zephyrus-g16-2026/","source":"ASUS Türkiye","image":"https://cdn.hstatic.net/products/200000507631/28106_laptop_asus_rog_zephyrus_g16_gu605cm_qr078w_b972bc1ad64240a5ac93693c4b83f807.jpg","id":"p012","managed":false},{"name":"HP OMEN 16 RTX 5070","brand":"HP","type":"computer","price":116795,"summary":"Core Ultra 7 255H · RTX 5070 · 32 GB · 1.5 TB","specs":[["CPU","Core Ultra 7 255H"],["GPU","RTX 5070 8 GB GDDR7"],["RAM","32 GB DDR5"],["SSD","1 TB + 512 GB"],["Ekran","16\" 1920×1200 144Hz IPS"]],"url":"https://www.hp.com/tr-tr/products/laptops/","source":"HP Türkiye","image":"https://productimages.hepsiburada.net/s/777/424-600/110001292210345.jpg","id":"p013","managed":false}];


  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const money = v => `${new Intl.NumberFormat('tr-TR', {maximumFractionDigits:0}).format(Number(v)||0)} TL`;

  function openDb(){
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve,reject)=>{
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE_SETTINGS)) db.createObjectStore(STORE_SETTINGS, {keyPath:'key'});
        if (!db.objectStoreNames.contains(STORE_PRODUCTS)) db.createObjectStore(STORE_PRODUCTS, {keyPath:'id'});
        if (!db.objectStoreNames.contains(STORE_MEDIA)) db.createObjectStore(STORE_MEDIA, {keyPath:'id'});
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return dbPromise;
  }
  function tx(store, mode='readonly'){
    return openDb().then(db => db.transaction(store, mode).objectStore(store));
  }
  function idbGet(store,key){return tx(store).then(s=>new Promise((res,rej)=>{const r=s.get(key);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)}));}
  function idbGetAll(store){return tx(store).then(s=>new Promise((res,rej)=>{const r=s.getAll();r.onsuccess=()=>res(r.result||[]);r.onerror=()=>rej(r.error)}));}
  function idbPut(store,value){return tx(store,'readwrite').then(s=>new Promise((res,rej)=>{const r=s.put(value);r.onsuccess=()=>res(value);r.onerror=()=>rej(r.error)}));}
  function idbDelete(store,key){return tx(store,'readwrite').then(s=>new Promise((res,rej)=>{const r=s.delete(key);r.onsuccess=()=>res();r.onerror=()=>rej(r.error)}));}

  function uuid(prefix='id') { return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`; }

  async function seed(){
    const seeded = await idbGet(STORE_SETTINGS,'seeded');
    if (seeded) return;
    await idbPut(STORE_SETTINGS,{key:'site',value:DEFAULT_SITE});
    for (const p of DEFAULT_PRODUCTS) await idbPut(STORE_PRODUCTS,p);
    await idbPut(STORE_SETTINGS,{key:'seeded',value:true});
  }
  async function getSite(){ await seed(); const x=await idbGet(STORE_SETTINGS,'site'); return x?.value || {}; }
  async function saveSite(site){ await idbPut(STORE_SETTINGS,{key:'site',value:site}); window.dispatchEvent(new CustomEvent('os-cms-updated',{detail:{kind:'site'}})); }
  async function getProducts(){ await seed(); return idbGetAll(STORE_PRODUCTS); }
  async function saveProduct(p){ await idbPut(STORE_PRODUCTS,p); window.dispatchEvent(new CustomEvent('os-cms-updated',{detail:{kind:'products'}})); }
  async function deleteProduct(id){ const p=await idbGet(STORE_PRODUCTS,id); if(p?.imageMediaId) await idbDelete(STORE_MEDIA,p.imageMediaId); await idbDelete(STORE_PRODUCTS,id); window.dispatchEvent(new CustomEvent('os-cms-updated',{detail:{kind:'products'}})); }
  async function putMedia(file){ const id=uuid('media'); await idbPut(STORE_MEDIA,{id,blob:file,name:file.name,type:file.type,size:file.size,createdAt:Date.now()}); return id; }
  async function getMediaUrl(id){ const item=await idbGet(STORE_MEDIA,id); if(!item?.blob) return ''; const url=URL.createObjectURL(item.blob); objectUrls.add(url); return url; }
  async function deleteMedia(id){ if(id) await idbDelete(STORE_MEDIA,id); }

  const UI = {
    overlay: null,
    toast(msg, bad=false){
      const t=document.createElement('div'); t.className='os-toast '+(bad?'bad':''); t.textContent=msg; document.body.appendChild(t); setTimeout(()=>t.remove(),2600);
    },
    open(){ UI.overlay?.classList.add('is-open'); document.body.classList.add('os-admin-open'); if(sessionStorage.getItem('os_admin_auth')==='1') showApp(); else showLogin(); },
    close(){ UI.overlay?.classList.remove('is-open'); document.body.classList.remove('os-admin-open'); },
  };

  function icon(name){
    const icons={
      home:'<svg viewBox="0 0 24 24"><path d="M3 11.5 12 4l9 7.5"/><path d="M5 10.5V20h14v-9.5"/><path d="M9 20v-5h6v5"/></svg>',
      box:'<svg viewBox="0 0 24 24"><path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5z"/><path d="M4 7.5 12 12l8-4.5M12 12v9"/></svg>',
      plus:'<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
      image:'<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8" cy="9" r="1.5"/><path d="m4.5 17 5-5 3.5 3 2.5-2.5 4 4.5"/></svg>',
      music:'<svg viewBox="0 0 24 24"><path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/></svg>',
      user:'<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3"/><path d="M5 20c.6-3.5 3.2-5 7-5s6.4 1.5 7 5"/></svg>',
      settings:'<svg viewBox="0 0 24 24"><path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z"/><path d="m19.4 15 .2 2.2-2 1.2-1.8-1.2-2 .8-.4 2.1h-2.8l-.4-2.1-2-.8-1.8 1.2-2-1.2.2-2.2-1.5-1.5L2 13l1.1-2.5 2.1-.4.8-2-1.2-1.8 1.2-2 1.9.2L9.4 3l2.5-1.1L13 3l1.5 1.5 1.9-.2 1.2 2-1.2 1.8.8 2 2.1.4L20 13z"/></svg>',
      logout:'<svg viewBox="0 0 24 24"><path d="M14 5V3H4v18h10v-2"/><path d="M10 12h10M17 8l3 4-3 4"/></svg>',
      back:'<svg viewBox="0 0 24 24"><path d="m14 6-6 6 6 6"/><path d="M8 12h12"/></svg>',
      trash:'<svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5"/></svg>',
      play:'<svg viewBox="0 0 24 24"><path d="m9 6 9 6-9 6z"/></svg>'
    };
    return `<span class="os-icon">${icons[name]||icons.home}</span>`;
  }

  function baseMarkup(){
    const root=document.createElement('div'); root.id='os-admin'; root.innerHTML=`
      <div class="os-admin-backdrop"></div>
      <section class="os-admin-shell" role="dialog" aria-modal="true">
        <aside class="os-side" id="os-side"></aside>
        <div class="os-main" id="os-main"></div>
      </section>`;
    document.body.appendChild(root);
    UI.overlay=root;
    $('.os-admin-backdrop',root).addEventListener('click',UI.close);
    window.addEventListener('keydown',e=>{ if(e.key==='Escape' && root.classList.contains('is-open')) UI.close(); });
  }

  function showLogin(){
    const main=$('#os-main');
    $('#os-side').innerHTML=`<div class="os-side-brand"><img src="photos/os-logo.png" alt="OŞ"></div><div class="os-side-caption">YÖNETİM</div>`;
    main.innerHTML=`<div class="os-login-wrap"><div class="os-login-card"><div class="os-login-mark"><img src="photos/os-logo.png" alt="OŞ"></div><div class="os-kicker">OĞUZHAN ŞANALAN</div><h2>Site yönetimi</h2><p>Fotoğraf, müzik ve ürünlerini buradan kolayca değiştir.</p><form id="os-login-form"><label>Kullanıcı adı<input id="os-user" autocomplete="username" value="admin" required></label><label>Şifre<input id="os-pass" type="password" autocomplete="current-password" required></label><button class="os-primary">Giriş yap ${icon('back')}</button></form><div class="os-smallnote">Bu PHP'siz sürümde yönetim verileri yalnızca kullandığın tarayıcıda saklanır.</div></div></div>`;
    $('#os-login-form').addEventListener('submit',e=>{e.preventDefault(); if($('#os-user').value==='admin' && $('#os-pass').value===ADMIN_PASSWORD){sessionStorage.setItem('os_admin_auth','1'); showApp(); } else UI.toast('Kullanıcı adı veya şifre hatalı.',true);});
  }

  let currentPage='home';
  async function showApp(){
    await seed();
    buildSidebar();
    await renderPage('home');
  }
  function buildSidebar(){
    const side=$('#os-side');
    side.innerHTML=`<div class="os-side-brand"><img src="photos/os-logo.png" alt="OŞ"></div>
      <div class="os-side-label">YÖNETİM</div>
      <nav class="os-nav">
        <button data-page="home" title="Ana sayfa">${icon('home')}<span>Ana sayfa</span></button>
        <button data-page="products" title="Ürünler">${icon('box')}<span>Ürünler</span></button>
        <button data-page="add" title="Ürün ekle">${icon('plus')}<span>Ürün ekle</span></button>
        <button data-page="photos" title="Fotoğraflar">${icon('image')}<span>Fotoğraflar</span></button>
        <button data-page="music" title="Müzik">${icon('music')}<span>Müzik</span></button>
        <button data-page="site" title="Site">${icon('user')}<span>Site</span></button>
        <button data-page="settings" title="Ayarlar">${icon('settings')}<span>Ayarlar</span></button>
      </nav>
      <div class="os-side-bottom"><button id="os-site-view" title="Siteye dön">${icon('back')}</button><button id="os-logout" title="Çıkış">${icon('logout')}</button></div>`;
    $$('.os-nav button',side).forEach(b=>b.addEventListener('click',()=>renderPage(b.dataset.page)));
    $('#os-logout').addEventListener('click',()=>{sessionStorage.removeItem('os_admin_auth');showLogin();});
    $('#os-site-view').addEventListener('click',UI.close);
    setActiveNav();
  }
  function setActiveNav(){ $$('.os-nav button').forEach(b=>b.classList.toggle('active',b.dataset.page===currentPage)); }

  function header(title,sub=''){
    return `<div class="os-page-head"><div><div class="os-kicker">OŞ · YÖNETİM</div><h1>${esc(title)}</h1>${sub?`<p>${esc(sub)}</p>`:''}</div><button class="os-icon-btn os-site-back" id="os-close-app" title="Siteye dön">${icon('back')}<span>Siteye dön</span></button></div>`;
  }
  function actionCard(page, ico, title, text){
    return `<button class="os-action-card" data-action-page="${page}">${icon(ico)}<strong>${title}</strong><span>${text}</span><b>›</b></button>`;
  }

  async function renderPage(page){
    currentPage=page; setActiveNav();
    const main=$('#os-main');
    if(!main) return;
    if(page==='home'){
      const site=await getSite(), ps=await getProducts();
      const gallery=(site.gallery||[]).length;
      main.innerHTML=header('Hoş geldin, Oğuzhan.','Ne yapmak istiyorsan aşağıdan tek dokunuşla aç.');
      main.innerHTML+=`<div class="os-dashboard-grid">${actionCard('add','plus','Ürün ekle','Fotoğrafını seç, fiyatını yaz, yayınla.')}${actionCard('photos','image','Fotoğraf yükle','Profil, kapak veya galeri fotoğrafı.')}${actionCard('music','music','Müziği değiştir','MP3 seç, adını yaz, kaydet.')}${actionCard('site','user','Profil & kapak','Sitede görünen ana görselleri yönet.')}</div>`;
      main.innerHTML+=`<div class="os-stats-row"><div><b>${ps.length}</b><span>Ürün</span></div><div><b>${ps.filter(p=>p.type==='phone').length}</b><span>Telefon</span></div><div><b>${ps.filter(p=>p.type==='computer').length}</b><span>Bilgisayar</span></div><div><b>${gallery}</b><span>Fotoğraf</span></div></div>`;
      main.innerHTML+=`<div class="os-mini-grid"><div class="os-mini"><div>${icon('music')}</div><section><strong>${esc(site.music?.title||'Sabah Beş')}</strong><span>${esc(site.music?.artist||'Noma')} · ${site.music?.enabled===false?'Kapalı':'Aktif'}</span></section><button data-action-page="music">Yönet</button></div><div class="os-mini"><div>${icon('box')}</div><section><strong>Ürün vitrini</strong><span>${ps.length ? 'Ürünler hazır' : 'Henüz ürün eklenmedi'}</span></section><button data-action-page="products">Aç</button></div></div>`;
      $$('[data-action-page]').forEach(b=>b.addEventListener('click',()=>renderPage(b.dataset.actionPage)));
    } else if(page==='products') await renderProducts();
    else if(page==='add') renderProductForm();
    else if(page==='photos') await renderPhotos();
    else if(page==='music') await renderMusic();
    else if(page==='site') await renderSitePage();
    else if(page==='settings') renderSettings();
    $('#os-close-app')?.addEventListener('click',UI.close);
    setActiveNav();
  }

  async function resolveImage(mediaId,fallback){ return mediaId ? await getMediaUrl(mediaId) : (fallback||''); }

  async function renderProducts(){
    const ps=await getProducts();
    const items=await Promise.all(ps.map(async p=>({...p, _image:await resolveImage(p.imageMediaId,p.image)})));
    const main=$('#os-main');
    main.innerHTML=header('Ürünler','Resimli kartlardan ürünü seç ve düzenle.')+`<div class="os-toolbar"><div class="os-search"><input id="os-psearch" placeholder="Ürün ara…"><select id="os-ptype"><option value="all">Tümü</option><option value="phone">Telefon</option><option value="computer">Bilgisayar</option></select></div><button class="os-primary" id="os-add-product">${icon('plus')} Ürün ekle</button></div><div class="os-product-grid" id="os-product-grid"></div>`;
    const draw=()=>{ const q=($('#os-psearch').value||'').toLocaleLowerCase('tr-TR'), f=$('#os-ptype').value; const list=items.filter(p=>(f==='all'||p.type===f)&&(`${p.brand} ${p.name} ${p.summary}`.toLocaleLowerCase('tr-TR').includes(q))); $('#os-product-grid').innerHTML=list.length?list.map(p=>`<article class="os-product-card"><div class="os-product-img">${p._image?`<img src="${esc(p._image)}" alt="">`:'<span>📦</span>'}</div><div class="os-product-info"><small>${p.type==='computer'?'BİLGİSAYAR':'TELEFON'} · ${esc(p.brand||'')}</small><strong>${esc(p.name)}</strong><b>${money(p.price)}</b><span>${esc(p.summary||'')}</span><div><button class="os-small-btn edit" data-edit="${esc(p.id)}">Düzenle</button><button class="os-small-btn del" data-del="${esc(p.id)}">Sil</button></div></div></article>`).join(''):`<div class="os-empty">Ürün bulunamadı.</div>`;};
    $('#os-psearch').addEventListener('input',draw); $('#os-ptype').addEventListener('change',draw); $('#os-add-product').addEventListener('click',()=>renderPage('add')); draw();
    $('#os-product-grid').addEventListener('click',async e=>{const ed=e.target.closest('[data-edit]');const del=e.target.closest('[data-del]');if(ed){const p=ps.find(x=>x.id===ed.dataset.edit);renderProductForm(p);}if(del){if(confirm('Bu ürünü silmek istiyor musun?')){await deleteProduct(del.dataset.del);UI.toast('Ürün silindi.');renderProducts();}}});
  }

  function productFormHtml(p={}){
    const specs=p.specs||[];
    return header(p.id?'Ürünü düzenle':'Yeni ürün','Sadece gerekli bilgileri gir. Teknik alan yok.')+
      `<form id="os-product-form" class="os-form-card">
        <div class="os-upload-large" id="os-product-drop"><input id="os-product-image" type="file" accept="image/jpeg,image/png,image/webp"><div class="os-upload-icon">${icon('image')}</div><strong>${p.image||p.imageMediaId?'Fotoğrafı değiştirmek için seç':'Ürün fotoğrafını buraya bırak'}</strong><span>JPG · PNG · WEBP</span><img id="os-product-preview" class="os-upload-preview" ${p.image||p.imageMediaId?'':'hidden'}></div>
        <div class="os-form-grid two"><label>Ürün adı<input id="os-name" value="${esc(p.name||'')}" placeholder="iPhone 18 Pro" required></label><label>Marka<input id="os-brand" value="${esc(p.brand||'')}" placeholder="Apple"></label></div>
        <div class="os-type-pills"><label><input type="radio" name="ptype" value="phone" ${p.type!=='computer'?'checked':''}><span>📱 Telefon</span></label><label><input type="radio" name="ptype" value="computer" ${p.type==='computer'?'checked':''}><span>💻 Bilgisayar</span></label></div>
        <label>Fiyat<input id="os-price" inputmode="decimal" value="${p.price?esc(new Intl.NumberFormat('tr-TR').format(p.price)):''}" placeholder="137.999 TL"></label>
        <label>Kısa bilgi<textarea id="os-summary" rows="3" placeholder="Ürünle ilgili kısa bilgi">${esc(p.summary||'')}</textarea></label>
        <div class="os-spec-editor"><div class="os-spec-head"><strong>Özellikler</strong><button type="button" id="os-add-spec">＋ Özellik ekle</button></div><div id="os-specs"></div></div>
        <div class="os-form-actions"><button type="button" class="os-secondary" id="os-back">Geri</button><button class="os-primary">${p.id?'Değişiklikleri kaydet':'Ürünü yayınla'}</button></div>
      </form>`;
  }
  function parseMoney(v){ const s=String(v||'').replace(/TL/gi,'').trim().replace(/\./g,'').replace(',','.'); return Number(s)||0; }
  function renderProductForm(existing){
    const main=$('#os-main'); main.innerHTML=productFormHtml(existing||{});
    let selectedFile=null;
    const specsBox=$('#os-specs');
    const addSpec=(a='',b='')=>{const row=document.createElement('div');row.className='os-spec-row';row.innerHTML=`<input placeholder="Örn. RAM" value="${esc(a)}"><input placeholder="Örn. 12 GB" value="${esc(b)}"><button type="button">×</button>`;row.querySelector('button').onclick=()=>row.remove();specsBox.appendChild(row)};
    (existing?.specs||[]).forEach(s=>addSpec(s?.[0],s?.[1])); if(!specsBox.children.length) addSpec();
    const input=$('#os-product-image'), preview=$('#os-product-preview');
    const showPreview=file=>{if(!file)return;selectedFile=file;preview.hidden=false;preview.src=URL.createObjectURL(file)};
    input.addEventListener('change',()=>showPreview(input.files[0]));
    $('#os-product-drop').addEventListener('click',()=>input.click());
    ['dragover','dragenter'].forEach(ev=>$('#os-product-drop').addEventListener(ev,e=>{e.preventDefault();$('#os-product-drop').classList.add('drag')}));
    ['dragleave','drop'].forEach(ev=>$('#os-product-drop').addEventListener(ev,e=>{e.preventDefault();$('#os-product-drop').classList.remove('drag')}));
    $('#os-product-drop').addEventListener('drop',e=>showPreview(e.dataTransfer.files[0]));
    $('#os-add-spec').onclick=()=>addSpec(); $('#os-back').onclick=()=>renderPage('products');
    if(existing?.imageMediaId) getMediaUrl(existing.imageMediaId).then(u=>{preview.src=u;preview.hidden=false}); else if(existing?.image) preview.src=existing.image;
    $('#os-product-form').addEventListener('submit',async e=>{e.preventDefault(); const id=existing?.id||uuid('product'); let imageMediaId=existing?.imageMediaId||''; if(selectedFile){ if(imageMediaId) await deleteMedia(imageMediaId); imageMediaId=await putMedia(selectedFile); }
      const specs=$$('.os-spec-row',specsBox).map(r=>[r.children[0].value.trim(),r.children[1].value.trim()]).filter(x=>x[0]&&x[1]);
      const p={id,name:$('#os-name').value.trim(),brand:$('#os-brand').value.trim(),type:$('input[name="ptype"]:checked').value,price:parseMoney($('#os-price').value),summary:$('#os-summary').value.trim(),specs,imageMediaId,image: existing?.image||'',managed:true};
      await saveProduct(p); UI.toast(existing?'Ürün güncellendi.':'Ürün yayınlandı.'); renderPage('products');
    });
  }

  async function renderPhotos(){
    const site=await getSite(); const gallery=site.gallery||[]; const main=$('#os-main');
    const profile=await resolveImage(site.profile?.mediaId,site.profile?.image), hero=await resolveImage(site.hero?.mediaId,site.hero?.image);
    const gitems=await Promise.all(gallery.map(async g=>({...g,_image:await resolveImage(g.mediaId,g.image)})));
    main.innerHTML=header('Fotoğraflar','Sitede görünen görselleri tek ekrandan değiştir.')+
      `<div class="os-photo-tools"><div class="os-media-card"><div class="os-media-preview"><img src="${esc(profile)}" alt=""></div><strong>Profil fotoğrafı</strong><span>Hakkımda bölümündeki fotoğraf</span><button class="os-secondary" id="os-change-profile">Değiştir</button></div>
      <div class="os-media-card"><div class="os-media-preview wide"><img src="${esc(hero)}" alt=""></div><strong>Kapak fotoğrafı</strong><span>Ana ekran arka planı</span><button class="os-secondary" id="os-change-hero">Değiştir</button></div>
      <button class="os-media-card os-media-add" id="os-add-gallery">${icon('plus')}<strong>Galeriye fotoğraf ekle</strong><span>Bir fotoğraf seç ve başlığını yaz.</span></button></div>
      <div class="os-section-line"><strong>Galeri</strong><span>${gallery.length} fotoğraf</span></div><div class="os-gallery-grid" id="os-gallery-grid">${gitems.map(g=>`<article class="os-gallery-card"><img src="${esc(g._image)}" alt=""><div><strong>${esc(g.title||'Fotoğraf')}</strong><span>${esc(g.alt||'')}</span><button class="os-small-btn del" data-gdel="${esc(g.id)}">${icon('trash')} Sil</button></div></article>`).join('')}</div>`;
    $('#os-change-profile').onclick=()=>chooseFile(async file=>{site.profile=site.profile||{}; if(site.profile.mediaId) await deleteMedia(site.profile.mediaId); site.profile.mediaId=await putMedia(file); site.profile.image=''; await saveSite(site); UI.toast('Profil fotoğrafı değişti.'); renderPhotos();});
    $('#os-change-hero').onclick=()=>chooseFile(async file=>{site.hero=site.hero||{}; if(site.hero.mediaId) await deleteMedia(site.hero.mediaId); site.hero.mediaId=await putMedia(file); site.hero.image=''; await saveSite(site); UI.toast('Kapak fotoğrafı değişti.'); renderPhotos();});
    $('#os-add-gallery').onclick=()=>showGalleryAdd(site);
    $('#os-gallery-grid').addEventListener('click',async e=>{const b=e.target.closest('[data-gdel]'); if(!b)return; if(confirm('Bu fotoğrafı silmek istiyor musun?')){const i=gallery.findIndex(g=>g.id===b.dataset.gdel);if(i>=0){if(gallery[i].mediaId)await deleteMedia(gallery[i].mediaId);gallery.splice(i,1);await saveSite(site);UI.toast('Fotoğraf silindi.');renderPhotos();}}});
  }

  function chooseFile(cb){ const i=document.createElement('input'); i.type='file'; i.accept='image/jpeg,image/png,image/webp'; i.onchange=()=>{if(i.files[0])cb(i.files[0])}; i.click(); }
  function showGalleryAdd(site){
    const main=$('#os-main'); const old=main.innerHTML;
    main.innerHTML=header('Galeriye fotoğraf ekle','Fotoğrafı seç, başlık yaz ve kaydet.')+`<form id="os-gform" class="os-form-card"><div class="os-upload-large" id="os-gdrop"><input id="os-gimage" type="file" accept="image/jpeg,image/png,image/webp"><div class="os-upload-icon">${icon('image')}</div><strong>Fotoğrafı bırak veya seç</strong><span>JPG · PNG · WEBP</span><img id="os-gpreview" class="os-upload-preview" hidden></div><label>Başlık<input id="os-gtitle" placeholder="01 · OUTDOOR"></label><label>Kısa açıklama<input id="os-galt" placeholder="Oğuzhan — dış mekân fotoğrafı"></label><div class="os-form-actions"><button type="button" class="os-secondary" id="os-gback">Geri</button><button class="os-primary">Galeriye ekle</button></div></form>`;
    let f=null; const i=$('#os-gimage'), p=$('#os-gpreview');const show=x=>{if(x){f=x;p.src=URL.createObjectURL(x);p.hidden=false}};$('#os-gdrop').onclick=()=>i.click();i.onchange=()=>show(i.files[0]);$('#os-gback').onclick=()=>renderPhotos();
    $('#os-gform').onsubmit=async e=>{e.preventDefault();if(!f){UI.toast('Önce bir fotoğraf seç.',true);return}const mid=await putMedia(f);site.gallery=site.gallery||[];site.gallery.push({id:uuid('gallery'),mediaId:mid,image:'',title:$('#os-gtitle').value.trim()||'Yeni Fotoğraf',alt:$('#os-galt').value.trim()||'Oğuzhan Şanalan fotoğrafı'});await saveSite(site);UI.toast('Fotoğraf eklendi.');renderPhotos();};
  }

  async function renderMusic(){
    const site=await getSite(); const m=site.music||{}; const audioSrc=await resolveImage(m.mediaId,m.src); const main=$('#os-main');
    main.innerHTML=header('Müzik','Siteye girecek şarkıyı buradan değiştir.')+`<div class="os-music-card"><div class="os-music-now"><div class="os-vinyl">♫</div><div><small>ŞU ANKİ MÜZİK</small><h3>${esc(m.title||'Sabah Beş')}</h3><span>${esc(m.artist||'Noma')} · ${m.enabled===false?'Kapalı':'Aktif'}</span></div></div><audio controls src="${esc(audioSrc)}"></audio></div><form class="os-form-card" id="os-music-form"><div class="os-upload-large compact" id="os-music-drop"><input id="os-music-input" type="file" accept="audio/mpeg,audio/mp3,audio/wav,audio/mp4,audio/x-m4a,audio/ogg,audio/webm"><div class="os-upload-icon">${icon('music')}</div><strong>Yeni müzik seç</strong><span>MP3 önerilir</span><div id="os-music-file"></div></div><div class="os-form-grid two"><label>Müzik adı<input id="os-mtitle" value="${esc(m.title||'Sabah Beş')}"></label><label>Sanatçı<input id="os-martist" value="${esc(m.artist||'Noma')}"></label></div><label class="os-switch"><input type="checkbox" id="os-menabled" ${m.enabled!==false?'checked':''}><span>Site müziği aktif olsun</span></label><div class="os-form-actions"><button type="button" class="os-secondary" id="os-mback">Geri</button><button class="os-primary">Müziği kaydet</button></div></form>`;
    let file=null;$('#os-music-input').onchange=()=>{file=$('#os-music-input').files[0];$('#os-music-file').textContent=file?file.name:''};$('#os-music-drop').onclick=()=>$('#os-music-input').click();$('#os-mback').onclick=()=>renderPage('home');
    $('#os-music-form').onsubmit=async e=>{e.preventDefault();if(file){if(m.mediaId)await deleteMedia(m.mediaId);m.mediaId=await putMedia(file);m.src=''}m.title=$('#os-mtitle').value.trim()||'Yeni Müzik';m.artist=$('#os-martist').value.trim();m.enabled=$('#os-menabled').checked;m.loop=true;m.volume=1;await saveSite(site);UI.toast('Müzik güncellendi.');renderMusic();};
  }

  async function renderSitePage(){ const site=await getSite(); const main=$('#os-main'); const p=await resolveImage(site.profile?.mediaId,site.profile?.image), h=await resolveImage(site.hero?.mediaId,site.hero?.image); main.innerHTML=header('Site görselleri','Ziyaretçilerin ilk gördüğü alanları değiştir.')+`<div class="os-site-grid"><div class="os-site-preview"><img src="${esc(p)}" alt=""><div><strong>Profil</strong><span>Hikâye bölümündeki fotoğraf</span></div><button class="os-secondary" id="os-site-profile">Değiştir</button></div><div class="os-site-preview wide"><img src="${esc(h)}" alt=""><div><strong>Kapak</strong><span>Ana sayfanın arka planı</span></div><button class="os-secondary" id="os-site-hero">Değiştir</button></div></div><div class="os-site-links"><a href="#home" onclick="document.getElementById('os-admin').classList.remove('is-open');document.body.classList.remove('os-admin-open')">Siteye dön ↗</a></div>`;$('#os-site-profile').onclick=()=>chooseFile(async f=>{if(site.profile.mediaId)await deleteMedia(site.profile.mediaId);site.profile.mediaId=await putMedia(f);site.profile.image='';await saveSite(site);UI.toast('Profil fotoğrafı değişti.');renderSitePage()});$('#os-site-hero').onclick=()=>chooseFile(async f=>{if(site.hero.mediaId)await deleteMedia(site.hero.mediaId);site.hero.mediaId=await putMedia(f);site.hero.image='';await saveSite(site);UI.toast('Kapak fotoğrafı değişti.');renderSitePage()}); }

  function renderSettings(){ const main=$('#os-main'); main.innerHTML=header('Ayarlar','Basit ve güvenli kullanım için birkaç seçenek.')+`<div class="os-settings-grid"><div class="os-setting-card"><div>${icon('settings')}</div><strong>Yönetici şifresi</strong><span>Bu sürüm PHP'siz olduğu için şifre güvenlik duvarı değildir; sadece panel erişimini gizler.</span><button class="os-secondary" id="os-show-pass">Şifreyi değiştir</button></div><div class="os-setting-card"><div>${icon('box')}</div><strong>Yedekle</strong><span>Ürün ve site ayarlarının tarayıcıdaki kopyasını JSON olarak indir.</span><button class="os-secondary" id="os-backup">Yedeği indir</button></div><div class="os-setting-card"><div>${icon('back')}</div><strong>Siteyi sıfırla</strong><span>Tarayıcıdaki değişiklikleri kaldırıp başlangıç verisine dön.</span><button class="os-secondary danger" id="os-reset">Başlangıca dön</button></div></div>`;
    $('#os-show-pass').onclick=()=>{const n=prompt('Yeni panel şifresi:');if(n){localStorage.setItem('os_admin_pw',n);UI.toast('Panel şifresi bu tarayıcı için değiştirildi.');}};
    $('#os-backup').onclick=async()=>{const payload={site:await getSite(),products:await getProducts()};const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='oguzhan-sanalan-yedek.json';a.click();};
    $('#os-reset').onclick=async()=>{if(confirm('Bu tarayıcıdaki yönetim değişiklikleri silinsin mi?')){const db=await openDb();db.close();indexedDB.deleteDatabase(DB_NAME).onsuccess=()=>location.reload();}};
  }

  // Local override password if user changed it in settings.
  const originalShowLogin = showLogin;
  showLogin = function(){
    const pw = localStorage.getItem('os_admin_pw') || ADMIN_PASSWORD;
    const main=$('#os-main'); $('#os-side').innerHTML=`<div class="os-side-brand"><img src="photos/os-logo.png" alt="OŞ"></div><div class="os-side-caption">YÖNETİM</div>`;
    main.innerHTML=`<div class="os-login-wrap"><div class="os-login-card"><div class="os-login-mark"><img src="photos/os-logo.png" alt="OŞ"></div><div class="os-kicker">OĞUZHAN ŞANALAN</div><h2>Site yönetimi</h2><p>Fotoğraf, müzik ve ürünlerini buradan kolayca değiştir.</p><form id="os-login-form"><label>Kullanıcı adı<input id="os-user" autocomplete="username" value="admin" required></label><label>Şifre<input id="os-pass" type="password" autocomplete="current-password" required></label><button class="os-primary">Giriş yap ${icon('back')}</button></form><div class="os-smallnote">Bu PHP'siz panelde yaptığın değişiklikler bu tarayıcıda saklanır. Sunucuya kod yazmaz.</div></div></div>`;
    $('#os-login-form').addEventListener('submit',e=>{e.preventDefault(); if($('#os-user').value==='admin' && $('#os-pass').value===pw){sessionStorage.setItem('os_admin_auth','1'); showApp();} else UI.toast('Kullanıcı adı veya şifre hatalı.',true);});
  };

  window.OguzhanCMS = {seed,getSite,saveSite,getProducts,saveProduct,deleteProduct,getMediaUrl,putMedia,deleteMedia};
  window.addEventListener('DOMContentLoaded',()=>{
    const trigger=$('#admin-trigger');
    if(!trigger)return;
    baseMarkup();
    trigger.addEventListener('click',e=>{e.preventDefault();UI.open();});
    seed();
  });
})();
