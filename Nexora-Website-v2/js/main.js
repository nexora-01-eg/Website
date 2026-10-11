(function(){
"use strict";

/* SHARED LOGO — single base64 source reused by the loader, header and footer <img> tags
   instead of embedding the same ~40KB image three times in the HTML (was ~120KB of duplication). */
(function(){
  var LOGO_SRC = document.getElementById('logoSourceData').textContent;
  ['ldLogoImg','headerLogoImg','footerLogoImg'].forEach(function(id){
    var el = document.getElementById(id);
    if(el) el.src = LOGO_SRC;
  });
})();

const WHATSAPP = '201062264302';
const WHATSAPP_ALT = '201000025168';
const EMAIL = 'Nexora01.eg@outlook.com';

/* LOADER */
let loaderDismissed = false;
const ldPctEl = document.getElementById('ldPct');
let ldPctVal = 0;
const ldPctTimer = setInterval(function(){
  if(loaderDismissed){ clearInterval(ldPctTimer); return; }
  const remaining = 92 - ldPctVal;
  ldPctVal += Math.max(0.4, remaining*0.09);
  if(ldPctVal > 92) ldPctVal = 92;
  if(ldPctEl) ldPctEl.textContent = Math.round(ldPctVal)+'%';
}, 90);
function dismissLoader(){
  if(loaderDismissed) return;
  loaderDismissed = true;
  if(ldPctEl) ldPctEl.textContent = '100%';
  const l = document.getElementById('loader');
  if(l) l.classList.add('out');
  document.body.classList.add('hero-ready');
}
window.addEventListener('load', function(){
  setTimeout(dismissLoader, 1700);
});
/* Safety net: never let a slow asset (fonts, etc.) leave the loader — and the hero — stuck indefinitely */
setTimeout(dismissLoader, 3200);
/* J4 fix: also guarantee the percentage-counter interval is cleared if the person navigates away
   (closes the tab, goes back) before the loader naturally finishes, instead of relying only on
   loaderDismissed being set on a future tick. */
window.addEventListener('pagehide', function(){ clearInterval(ldPctTimer); });

/* CURSOR */
(function(){
  const hero = document.getElementById('hero');
  const spot = document.getElementById('heroSpotlight');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  if(!hero || !spot || prefersReduced || coarsePointer) return;
  hero.addEventListener('mousemove', function(e){
    const r = hero.getBoundingClientRect();
    spot.style.setProperty('--sx', ((e.clientX-r.left)/r.width*100)+'%');
    spot.style.setProperty('--sy', ((e.clientY-r.top)/r.height*100)+'%');
    spot.classList.add('show');
  });
  hero.addEventListener('mouseleave', function(){ spot.classList.remove('show'); });
})();

const dot = document.getElementById('curDot');
const ring = document.getElementById('curRing');
let mx=0,my=0,rx=0,ry=0;
const coarsePointerGlobal = window.matchMedia('(pointer: coarse)').matches;
window.addEventListener('mousemove', function onFirstMove(e){
  /* Only now do we know the custom cursor is actually tracking the pointer, so only now do we
     hide the native cursor (see cursor:none fallback fix, C13). */
  if(!coarsePointerGlobal) document.documentElement.classList.add('custom-cursor-ready');
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx+'px'; dot.style.top = my+'px';
});
function ringLoop(){
  rx += (mx-rx)*0.1; ry += (my-ry)*0.1;
  ring.style.left = rx+'px'; ring.style.top = ry+'px';
  requestAnimationFrame(ringLoop);
}
ringLoop();
window.addEventListener('mousedown', ()=>document.body.classList.add('c-click'));
window.addEventListener('mouseup', ()=>document.body.classList.remove('c-click'));
/* HOVER STATE for custom cursor — delegated on document instead of bound per-element, so calling
   this again after a language switch never stacks duplicate listeners on the same elements (J1). */
const HOVER_SEL = 'a,button,input,select,textarea,.assess-opt,.f-check,.gs-tab,.faq-q';
document.addEventListener('mouseover', function(e){
  if(e.target.closest && e.target.closest(HOVER_SEL)) document.body.classList.add('c-hover');
});
document.addEventListener('mouseout', function(e){
  const to = e.relatedTarget;
  if(!(to && to.closest && to.closest(HOVER_SEL))) document.body.classList.remove('c-hover');
});
function bindHover(){ /* kept as a no-op call site so existing call sites (e.g. applyLang) don't need to change */ }

/* PREMIUM CARD SHEEN — cursor-tracked glass reflection, delegated for performance */
const SHEEN_SEL = '.pkg,.rcard,.ind-card,.val,.tcard,.form-card,.why-card,.eco-card,.assess-card';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
if(!reduceMotion && !isCoarsePointer){
  document.addEventListener('pointermove', function(e){
    const card = e.target.closest ? e.target.closest(SHEEN_SEL) : null;
    document.querySelectorAll(SHEEN_SEL+'.sheen-on').forEach(function(c){ if(c!==card) c.classList.remove('sheen-on'); });
    if(!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', ((e.clientX-r.left)/r.width*100)+'%');
    card.style.setProperty('--my', ((e.clientY-r.top)/r.height*100)+'%');
    card.classList.add('sheen-on');
  }, {passive:true});

  /* MAGNETIC BUTTONS — very subtle pull toward cursor */
  document.addEventListener('pointermove', function(e){
    const btn = e.target.closest ? e.target.closest('.btn-gold,.btn-outline,.nav-links a') : null;
    document.querySelectorAll('.magnetic').forEach(function(b){ if(b!==btn){ b.style.transform=''; b.classList.remove('magnetic'); } });
    if(!btn) return;
    const r = btn.getBoundingClientRect();
    const dx = (e.clientX-r.left-r.width/2)*(btn.matches('.nav-links a')?0.18:0.12);
    const dy = (e.clientY-r.top-r.height/2)*(btn.matches('.nav-links a')?0.35:0.25);
    btn.style.transform = 'translate('+dx+'px,'+dy+'px)';
    btn.classList.add('magnetic');
  }, {passive:true});
}

/* RIPPLE ON CLICK — buttons only */
document.addEventListener('click', function(e){
  const btn = e.target.closest ? e.target.closest('.btn') : null;
  if(!btn) return;
  const r = btn.getBoundingClientRect();
  const ripple = document.createElement('span');
  const size = Math.max(r.width, r.height)*1.4;
  ripple.className = 'ripple';
  ripple.style.width = ripple.style.height = size+'px';
  ripple.style.left = (e.clientX - r.left - size/2)+'px';
  ripple.style.top = (e.clientY - r.top - size/2)+'px';
  btn.appendChild(ripple);
  setTimeout(function(){ ripple.remove(); }, 650);
});

/* PROGRESS BAR + STORY SPINE — one scroll-position source of truth */
const progBar = document.getElementById('progBar');
const spineFill = document.getElementById('storySpineFill');
const spineNode = document.getElementById('storySpineNode');
window.addEventListener('scroll', function(){
  const h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const p = h > 0 ? (window.scrollY/h)*100 : 0;
  progBar.style.width = p+'%';
  if(spineFill){ spineFill.style.height = p+'%'; spineNode.style.top = p+'%'; }
}, {passive:true});

/* AMBIENT PARTICLES — a few dozen soft gold specks drifting upward, paused off-screen and under reduced-motion */
(function(){
  if(reduceMotion) return;
  const pCanvas = document.getElementById('ambient-particles');
  if(!pCanvas) return;
  const pCtx = pCanvas.getContext('2d');
  let particles = [], pw=0, ph=0;
  function pResize(){
    pw = pCanvas.width = window.innerWidth;
    ph = pCanvas.height = window.innerHeight;
  }
  function pBuild(){
    const count = window.innerWidth < 760 ? 16 : 34;
    particles = [];
    for(let i=0;i<count;i++){
      particles.push({
        x: Math.random()*pw, y: Math.random()*ph,
        r: 1.0 + Math.random()*1.8,
        s: 0.12 + Math.random()*0.25,
        drift: (Math.random()-0.5)*0.15,
        o: 0.25 + Math.random()*0.5
      });
    }
  }
  function pDraw(){
    pCtx.clearRect(0,0,pw,ph);
    for(let i=0;i<particles.length;i++){
      const p = particles[i];
      p.y -= p.s; p.x += p.drift;
      if(p.y < -6){ p.y = ph+6; p.x = Math.random()*pw; }
      if(p.x < -6) p.x = pw+6; if(p.x > pw+6) p.x = -6;
      pCtx.beginPath(); pCtx.arc(p.x,p.y,p.r,0,Math.PI*2);
      pCtx.fillStyle = 'rgba(214,195,165,'+p.o+')'; pCtx.fill();
    }
    requestAnimationFrame(pDraw);
  }
  let visible = true;
  document.addEventListener('visibilitychange', function(){ visible = !document.hidden; });
  pResize(); pBuild(); requestAnimationFrame(pDraw);
  window.addEventListener('resize', debounce(function(){ pResize(); pBuild(); }, 150));
})();

/* HEADER — scrolled state + hide on scroll-down, show on scroll-up */
const header = document.getElementById('siteHeader');
let lastScrollY = window.scrollY, navHideAccum = 0;
window.addEventListener('scroll', function(){
  const y = window.scrollY;
  if(y > 60) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
  if(mob.classList.contains('open')){ lastScrollY = y; return; }
  const delta = y - lastScrollY;
  if(y > 140){
    if(delta > 0){ navHideAccum += delta; if(navHideAccum > 24) header.classList.add('hide-nav'); }
    else { navHideAccum = 0; header.classList.remove('hide-nav'); }
  } else {
    header.classList.remove('hide-nav'); navHideAccum = 0;
  }
  lastScrollY = y;
}, {passive:true});

/* NAV ACTIVE INDICATOR — slides under the link matching the section in view */
(function(){
  const navLinksWrap = document.querySelector('.nav-links');
  const indicator = document.getElementById('navIndicator');
  if(!navLinksWrap || !indicator) return;
  const navLinks = Array.from(navLinksWrap.querySelectorAll('a'));
  function moveIndicatorTo(link){
    if(!link){ indicator.classList.remove('show'); return; }
    const wrapRect = navLinksWrap.getBoundingClientRect();
    const r = link.getBoundingClientRect();
    indicator.style.width = r.width+'px';
    indicator.style.transform = 'translateX('+(r.left - wrapRect.left)+'px)';
    indicator.classList.add('show');
  }
  const navSections = navLinks.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
  let activeNavLink = null;
  const navObs = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        const idx = navSections.indexOf(entry.target);
        if(idx>-1){ activeNavLink = navLinks[idx]; moveIndicatorTo(activeNavLink); }
      }
    });
  }, {rootMargin:'-45% 0px -45% 0px'});
  navSections.forEach(s=>navObs.observe(s));
  window.addEventListener('resize', debounce(function(){ if(activeNavLink) moveIndicatorTo(activeNavLink); }, 150));
})();

/* MOBILE MENU */
const burger = document.getElementById('burger');
const mob = document.getElementById('mobMenu');
burger.addEventListener('click', function(){
  const open = mob.classList.toggle('open');
  burger.setAttribute('aria-expanded', open ? 'true':'false');
  document.body.style.overflow = open ? 'hidden' : '';
  if(open) header.classList.remove('hide-nav');
});
mob.querySelectorAll('a').forEach(function(a){
  a.addEventListener('click', function(){
    mob.classList.remove('open');
    burger.setAttribute('aria-expanded','false');
    document.body.style.overflow = '';
  });
});

/* REVEAL */
const revealObs = new IntersectionObserver(function(entries){
  entries.forEach(function(entry){
    if(entry.isIntersecting){
      entry.target.classList.add('in');
      revealObs.unobserve(entry.target);
    }
  });
}, {threshold:0.1});
function observeReveal(){
  document.querySelectorAll('.reveal:not(.in),.reveal-l:not(.in)').forEach(el=>revealObs.observe(el));
}
observeReveal();

/* C9 fix: purely decorative elements with `animation:...infinite` keep animating even while
   scrolled far off-screen unless the browser happens to optimize it. Pausing them explicitly
   while out of view saves CPU/battery on long scrolls, especially on mobile. Limited to elements
   whose animation is decoration-only (no entrance/reveal logic depends on their play-state). */
(function(){
  if(!('IntersectionObserver' in window)) return;
  const decorEls = document.querySelectorAll('.orb-a,.orb-b,.light-beam,.orbit-ring-spin,.eco-center-pulse,.fc-spark,.pkg-badge,.core-glow');
  if(!decorEls.length) return;
  const decorObs = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      entry.target.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
    });
  }, {rootMargin:'200px'});
  decorEls.forEach(function(el){ decorObs.observe(el); });
})();

/* STAT COUNTERS */
function easeOutCubic(t){ return 1 - Math.pow(1-t,3); }
function animateCount(el){
  const target = parseFloat(el.getAttribute('data-count'));
  const suffix = el.getAttribute('data-suffix')||'';
  const dur = 1500;
  const start = performance.now();
  function step(now){
    const t = Math.min(1,(now-start)/dur);
    const val = target * easeOutCubic(t);
    el.textContent = Math.round(val) + suffix;
    if(t<1) requestAnimationFrame(step);
    else {
      el.textContent = target + suffix;
      el.classList.add('count-pop');
      setTimeout(function(){ el.classList.remove('count-pop'); }, 500);
    }
  }
  requestAnimationFrame(step);
}
const countObs = new IntersectionObserver(function(entries){
  entries.forEach(function(entry){
    if(entry.isIntersecting){
      animateCount(entry.target);
      countObs.unobserve(entry.target);
    }
  });
}, {threshold:0.3});
document.querySelectorAll('[data-count]').forEach(el=>countObs.observe(el));

/* ICON STROKE DRAW-IN — icon-c SVGs draw themselves once when their card reveals */
(function(){
  if(reduceMotion) return;
  document.querySelectorAll('.icon-c svg').forEach(function(svg){
    const shapes = svg.querySelectorAll('path,circle,polygon,rect');
    let total = 0;
    const lens = [];
    shapes.forEach(function(sh){
      let len = 40;
      try{ len = sh.getTotalLength ? sh.getTotalLength() : 40; }catch(e){ console.warn('icon stroke draw-in: getTotalLength failed, using fallback length', e); }
      lens.push(len); total += len;
    });
    shapes.forEach(function(sh,i){
      sh.style.strokeDasharray = lens[i];
      sh.style.strokeDashoffset = lens[i];
      sh.style.transition = 'stroke-dashoffset .7s var(--ease)';
    });
    const card = svg.closest('.reveal,.reveal-l') || svg.closest('.ap-step');
    const target = card || svg;
    const io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          shapes.forEach(function(sh,i){ setTimeout(function(){ sh.style.strokeDashoffset = 0; }, i*80); });
          io.unobserve(entry.target);
        }
      });
    }, {threshold:0.3});
    io.observe(target);
  });
})();

/* INDUSTRIES — inject a real numbered element into each card (replaces the CSS counter approach) */
(function(){
  const cards = document.querySelectorAll('#industries .ind-card');
  cards.forEach(function(card, i){
    const num = document.createElement('span');
    num.className = 'ind-num';
    num.textContent = String(i+1).padStart(2,'0');
    card.insertBefore(num, card.firstChild);
  });
})();

/* SHARED DEBOUNCE — one small utility for resize handlers instead of every feature reacting to
   every intermediate resize event (see review item J6). */
function debounce(fn, wait){
  let t;
  return function(){
    clearTimeout(t);
    const args = arguments, ctx = this;
    t = setTimeout(function(){ fn.apply(ctx, args); }, wait);
  };
}

/* HOW WE WORK — pinned cinematic sequence: scroll position drives which step is active */
(function(){
  const wrap = document.getElementById('howPinWrap');
  if(!wrap) return;
  const slides = Array.from(wrap.querySelectorAll('.how-slide'));
  const dots = Array.from(wrap.querySelectorAll('.how-progress-dots span'));
  const fill = document.getElementById('howProgressFill');
  const n = slides.length;
  let ticking = false;
  /* Cache the wrap's document-relative top and height instead of calling getBoundingClientRect()
     on every scroll frame (which forces a synchronous layout) — recompute only on resize (J3). */
  let wrapDocTop = 0, wrapHeight = 0;
  function measure(){
    wrapDocTop = wrap.getBoundingClientRect().top + window.scrollY;
    wrapHeight = wrap.offsetHeight;
  }
  function update(){
    ticking = false;
    const top = wrapDocTop - window.scrollY;
    const total = wrapHeight - window.innerHeight;
    let progress = total > 0 ? (-top) / total : 0;
    progress = Math.max(0, Math.min(1, progress));
    let idx = Math.floor(progress * n);
    if(idx >= n) idx = n-1;
    if(idx < 0) idx = 0;
    slides.forEach(function(s,i){ s.classList.toggle('active', i===idx); });
    dots.forEach(function(d,i){ d.classList.toggle('active', i===idx); });
    if(fill) fill.style.width = (progress*100)+'%';
  }
  window.addEventListener('scroll', function(){
    if(!ticking){ ticking = true; requestAnimationFrame(update); }
  }, {passive:true});
  window.addEventListener('resize', debounce(function(){ measure(); update(); }, 150));
  measure();
  update();
})();

/* ROADMAP — line fills and nodes light up in sequence once the section is in view */
(function(){
  const roadLine = document.querySelector('.road-line');
  if(!roadLine) return;
  const nodes = Array.from(roadLine.querySelectorAll('.road-node'));
  const io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        roadLine.classList.add('filled');
        nodes.forEach(function(n,i){ setTimeout(function(){ n.classList.add('active'); }, 200+i*220); });
        io.unobserve(entry.target);
      }
    });
  }, {threshold:0.35});
  io.observe(roadLine);
})();

/* FOOTER CURTAIN REVEAL */
const footerEl = document.querySelector('footer');
if(footerEl){
  const footerObs = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){ footerEl.classList.add('in'); footerObs.unobserve(entry.target); }
    });
  }, {threshold:0.1});
  footerObs.observe(footerEl);
}

/* SHARED SCROLL UTILITY — one easing + smooth-scroll implementation reused by "back to top"
   and in-page anchor links, instead of two copy-pasted versions (see review item J8). */
function easeInOutCubic(t){ return t<0.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2; }
function smoothScrollTo(targetY, dur){
  const startY = window.scrollY;
  const diff = targetY - startY;
  const start = performance.now();
  function step(now){
    const t = Math.min(1,(now-start)/dur);
    window.scrollTo(0, startY + diff*easeInOutCubic(t));
    if(t<1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* BACK-TO-TOP + MOBILE STICKY CTA */
(function(){
  const backTop = document.getElementById('backTop');
  const stickyCta = document.getElementById('mobileStickyCta');
  const heroEl = document.getElementById('hero');
  const contactEl = document.getElementById('contact');
  window.addEventListener('scroll', function(){
    const y = window.scrollY;
    if(backTop) backTop.classList.toggle('show', y > 500);
    if(stickyCta && heroEl && contactEl){
      const heroBottom = heroEl.offsetTop + heroEl.offsetHeight;
      const contactTop = contactEl.offsetTop;
      const show = y > heroBottom && (y + window.innerHeight) < contactTop;
      stickyCta.classList.toggle('show', show);
    }
  }, {passive:true});
  if(backTop) backTop.addEventListener('click', function(){ smoothScrollTo(0, 700); });
})();

/* ANCHOR SCROLL — custom eased smooth-scroll for in-page links */
(function(){
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      const id = a.getAttribute('href');
      if(!id || id.charAt(0) !== '#' || id.length<2) return;
      const target = document.querySelector(id);
      if(!target) return;
      e.preventDefault();
      const headerH = document.getElementById('siteHeader').offsetHeight;
      const y = target.getBoundingClientRect().top + window.scrollY - headerH - 8;
      smoothScrollTo(Math.max(0,y), 650);
    });
  });
})();

/* CLICK BURST — subtle feedback for any click that isn't already handled by a button ripple */
document.addEventListener('click', function(e){
  if(reduceMotion) return;
  if(e.target.closest('.btn')) return;
  const b = document.createElement('span');
  b.className = 'click-burst';
  b.style.left = e.clientX+'px'; b.style.top = e.clientY+'px';
  document.body.appendChild(b);
  setTimeout(function(){ b.remove(); }, 520);
});

/* HERO CANVAS — interactive engineered system: draggable nodes, proximity glow, tap-to-reveal services */
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');
const heroEl2 = document.getElementById('hero');
const nodeTip = document.getElementById('heroNodeTip');
let nodes = [], edges = [], pulses = [];
let hmx=0, hmy=0, thmx=0, thmy=0;
let pmx=null, pmy=null;
let draggedNode = null, dragMoved = false, dragStartX=0, dragStartY=0;
const HERO_SERVICES = [
  {en:'More Customers', ar:'جذب عملاء أكثر'},
  {en:'More Sales', ar:'زيادة المبيعات'},
  {en:'Strong Brand', ar:'علامة تجارية قوية'},
  {en:'Website & Store', ar:'مواقع ومتاجر'},
  {en:'Expansion', ar:'توسيع المشروع'},
  {en:'Smart Automation', ar:'تشغيل ذكي وأتمتة'}
];
function resizeCanvas(){
  canvas.width = Math.max(1, canvas.offsetWidth);
  canvas.height = Math.max(1, canvas.offsetHeight);
}
function buildNetwork(){
  nodes = []; edges = [];
  const cols = Math.max(6, Math.round(canvas.width/140));
  const rows = Math.max(4, Math.round(canvas.height/140));
  const cw = canvas.width/cols, rh = canvas.height/rows;
  for(let r=0;r<=rows;r++){
    for(let c=0;c<=cols;c++){
      const x = c*cw + (Math.random()-0.5)*cw*0.5, y = r*rh + (Math.random()-0.5)*rh*0.5;
      nodes.push({ x:x, y:y, ox:x, oy:y, vx:0, vy:0, phase: Math.random()*Math.PI*2, hub:false, service:null });
    }
  }
  const perRow = cols+1;
  for(let i=0;i<nodes.length;i++){
    const row = Math.floor(i/perRow), col = i%perRow;
    if(col < cols && Math.random() > 0.25){ edges.push([i, i+1]); }
    if(row < rows && Math.random() > 0.35){ edges.push([i, i+perRow]); }
  }
  pulses = [];
  const pulseCount = Math.min(40, Math.round(edges.length*0.5));
  for(let i=0;i<pulseCount;i++){ spawnPulse(); }
  /* assign hub nodes spread across the canvas, one per service */
  const regions = [[.16,.28],[.5,.16],[.84,.28],[.16,.74],[.5,.86],[.84,.74]];
  const used = new Set();
  HERO_SERVICES.forEach(function(svc,i){
    const rx = regions[i][0]*canvas.width, ry = regions[i][1]*canvas.height;
    let best=-1, bestD=Infinity;
    for(let n=0;n<nodes.length;n++){
      if(used.has(n)) continue;
      const dx=nodes[n].x-rx, dy=nodes[n].y-ry, d=dx*dx+dy*dy;
      if(d<bestD){ bestD=d; best=n; }
    }
    if(best>-1){ used.add(best); nodes[best].hub=true; nodes[best].service=svc; }
  });
}
function spawnPulse(fromNode){
  const candidateEdges = fromNode===undefined ? edges : edges.filter(e=>e[0]===fromNode||e[1]===fromNode);
  const pool = candidateEdges.length ? candidateEdges : edges;
  const e = pool[Math.floor(Math.random()*pool.length)];
  if(!e) return;
  pulses.push({ edge:e, t: fromNode===undefined ? Math.random() : 0, speed: 0.0035 + Math.random()*0.004, reverse: fromNode===e[1] });
}
function drawNetwork(time){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  thmx += (hmx-thmx)*0.04; thmy += (hmy-thmy)*0.04;
  const ox = thmx*14, oy = thmy*10;

  /* spring physics — every non-dragged node eases back to its resting position */
  for(let i=0;i<nodes.length;i++){
    const n = nodes[i];
    if(n===draggedNode) continue;
    const dx = n.ox-n.x, dy = n.oy-n.y;
    n.vx = (n.vx + dx*0.025)*0.82;
    n.vy = (n.vy + dy*0.025)*0.82;
    n.x += n.vx; n.y += n.vy;
  }

  ctx.lineWidth = 1.3;
  for(let i=0;i<edges.length;i++){
    const a = nodes[edges[i][0]], b = nodes[edges[i][1]];
    ctx.beginPath(); ctx.moveTo(a.x+ox, a.y+oy); ctx.lineTo(b.x+ox, b.y+oy);
    ctx.strokeStyle = 'rgba(214,195,165,0.16)'; ctx.stroke();
  }
  for(let i=0;i<nodes.length;i++){
    const n = nodes[i];
    const s = 0.5 + Math.sin(time*0.0006 + n.phase)*0.35;
    const nx = n.x+ox, ny = n.y+oy;
    let boost = 0;
    if(pmx!==null){
      const ddx = nx-pmx, ddy = ny-pmy;
      const dist = Math.sqrt(ddx*ddx+ddy*ddy);
      boost = Math.max(0, 1 - dist/115);
    }
    if(n.hub){
      const ringR = 8+Math.sin(time*0.0018+n.phase)*1.8+boost*3;
      ctx.beginPath(); ctx.arc(nx,ny,ringR,0,Math.PI*2);
      ctx.strokeStyle = 'rgba(214,195,165,'+(0.28+boost*0.4)+')'; ctx.lineWidth = 1; ctx.stroke();
    }
    ctx.beginPath(); ctx.arc(nx, ny, 1.6+s*0.9+boost*2.4, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(214,195,165,'+Math.min(1,(0.32+s*0.28+boost*0.55))+')'; ctx.fill();
  }
  for(let i=pulses.length-1;i>=0;i--){
    const p = pulses[i];
    p.t += p.speed;
    if(p.t >= 1){
      const endNode = p.reverse ? p.edge[0] : p.edge[1];
      pulses.splice(i,1); spawnPulse(endNode); continue;
    }
    const te = p.t*p.t*(3-2*p.t);
    const a = nodes[p.reverse ? p.edge[1] : p.edge[0]];
    const b = nodes[p.reverse ? p.edge[0] : p.edge[1]];
    const px = a.x + (b.x-a.x)*te + ox, py = a.y + (b.y-a.y)*te + oy;
    /* Defense-in-depth for the non-finite-value crash: if px/py ever end up NaN/Infinity
       (e.g. from an unexpected zero-size layout moment), skip this pulse instead of crashing
       createRadialGradient. */
    if(!Number.isFinite(px) || !Number.isFinite(py)) continue;
    const grad = ctx.createRadialGradient(px,py,0,px,py,10);
    grad.addColorStop(0,'rgba(232,213,181,1)'); grad.addColorStop(1,'rgba(232,213,181,0)');
    ctx.beginPath(); ctx.arc(px,py,10,0,Math.PI*2); ctx.fillStyle = grad; ctx.fill();
    ctx.beginPath(); ctx.arc(px,py,2.2,0,Math.PI*2); ctx.fillStyle = '#f3e4c8'; ctx.fill();
  }
  requestAnimationFrame(drawNetwork);
}
heroEl2.addEventListener('mousemove', function(e){
  const rect = canvas.getBoundingClientRect();
  /* Bug fix: dividing by rect.width/height when the canvas is momentarily zero-sized (e.g. before
     layout settles, or hidden at some breakpoint) produced Infinity, which then propagated into
     drawNetwork()'s pulse positions and crashed createRadialGradient with a non-finite value. */
  if(rect.width <= 0 || rect.height <= 0) return;
  hmx = (e.clientX - rect.left - rect.width/2)/rect.width;
  hmy = (e.clientY - rect.top - rect.height/2)/rect.height;
});

/* INTERACTIVE NODES — drag with spring release, tap a glowing hub to reveal the service it represents */
function nearestNode(localX, localY, radius){
  let best=-1, bestD=radius*radius;
  const ox = thmx*14, oy = thmy*10;
  for(let i=0;i<nodes.length;i++){
    const dx=(nodes[i].x+ox)-localX, dy=(nodes[i].y+oy)-localY, d=dx*dx+dy*dy;
    if(d<bestD){ bestD=d; best=i; }
  }
  return best;
}
function showNodeTip(node, localX, localY){
  const lang = currentLang;
  nodeTip.textContent = lang==='en' ? node.service.en : node.service.ar;
  nodeTip.style.left = localX+'px';
  nodeTip.style.top = localY+'px';
  nodeTip.classList.add('show');
  clearTimeout(nodeTip._hideTimer);
  nodeTip._hideTimer = setTimeout(function(){ nodeTip.classList.remove('show'); }, 2200);
}
canvas.addEventListener('pointerdown', function(e){
  const rect = canvas.getBoundingClientRect();
  const lx = e.clientX-rect.left, ly = e.clientY-rect.top;
  const idx = nearestNode(lx, ly, 26);
  if(idx>-1){
    draggedNode = nodes[idx]; dragMoved = false;
    dragStartX = lx; dragStartY = ly;
    canvas.classList.add('grabbing');
    canvas.setPointerCapture(e.pointerId);
    e.preventDefault();
  }
});
canvas.addEventListener('pointermove', function(e){
  const rect = canvas.getBoundingClientRect();
  const lx = e.clientX-rect.left, ly = e.clientY-rect.top;
  pmx = lx; pmy = ly;
  if(draggedNode){
    e.preventDefault();
    const ox = thmx*14, oy = thmy*10;
    draggedNode.x = lx-ox; draggedNode.y = ly-oy;
    draggedNode.vx = 0; draggedNode.vy = 0;
    if(Math.abs(lx-dragStartX)>5 || Math.abs(ly-dragStartY)>5) dragMoved = true;
  }
});
function endDrag(e){
  if(draggedNode){
    if(!dragMoved && draggedNode.hub){
      const rect = canvas.getBoundingClientRect();
      showNodeTip(draggedNode, draggedNode.x+thmx*14, draggedNode.y+thmy*10);
    }
    draggedNode = null;
    canvas.classList.remove('grabbing');
  }
}
canvas.addEventListener('pointerup', endDrag);
canvas.addEventListener('pointercancel', endDrag);
canvas.addEventListener('pointerleave', function(){ if(!draggedNode) pmx = pmy = null; });
canvas.addEventListener('mouseleave', function(){ pmx = pmy = null; });

/* J5 fix: debounce the resize so mid-drag/rotate resize events (e.g. mobile orientation change)
   don't rebuild the whole node network dozens of times in a row. */
window.addEventListener('resize', debounce(function(){ resizeCanvas(); buildNetwork(); }, 200));
resizeCanvas(); buildNetwork(); requestAnimationFrame(drawNetwork);

/* ECOSYSTEM SVG (Solution section) — 6 nodes connected to center, animated flow */
(function(){
  const svg = document.getElementById('ecoSvg');
  const cx=200, cy=200, R=140;
  const icons = [
    'M12 2l7 4v6c0 5-3 8-7 10-4-2-7-5-7-10V6z', // shield (identity)
    'M4 6h16v12H4z M4 10h16', // browser (website)
    'M4 5h16v14H4z M8 9h8M8 13h5', // content
    'M3 11l18-8-8 18-2-8-8-2z', // ads
    'M12 8a4 4 0 100 8 4 4 0 000-8z M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1', // automation
    'M4 19h4V9H4zM10 19h4V5h-4zM16 19h4v-7h-4z' // reports
  ];
  let html = '<circle cx="200" cy="200" r="46" fill="none" stroke="#D6C3A5" stroke-opacity="0.5" stroke-width="1.2" class="eco-center-pulse"/>';
  html += '<circle cx="200" cy="200" r="185" fill="none" stroke="#D6C3A5" stroke-opacity="0.16" stroke-width="1" stroke-dasharray="3 9" class="orbit-ring-spin"/>';
  html += '<circle r="4" fill="#f3e4c8" class="orbit-satellite"><animateMotion dur="14s" repeatCount="indefinite" path="M385,200 A185,185 0 1,1 15,200 A185,185 0 1,1 385,200"/><animate attributeName="opacity" values="0.9;0.3;0.9" dur="2.6s" repeatCount="indefinite"/></circle>';
  html += '<path d="M180 226V174L220 226V174" stroke="#D6C3A5" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>';
  const positions = [];
  for(let i=0;i<6;i++){
    const angle = (Math.PI*2/6)*i - Math.PI/2;
    const nx = cx + Math.cos(angle)*R, ny = cy + Math.sin(angle)*R;
    positions.push({x:nx,y:ny});
    html += '<line x1="'+cx+'" y1="'+cy+'" x2="'+nx+'" y2="'+ny+'" stroke="#D6C3A5" stroke-opacity="0.18" stroke-width="1"/>';
  }
  for(let i=0;i<6;i++){
    const p = positions[i];
    html += '<circle cx="'+p.x+'" cy="'+p.y+'" r="30" fill="#0B0B0B" stroke="#CBB89D" stroke-opacity="0.4" stroke-width="1"/>';
    html += '<g transform="translate('+(p.x-11)+','+(p.y-11)+')"><path d="'+icons[i]+'" fill="none" stroke="#D6C3A5" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" transform="scale(0.92)"/></g>';
  }
  for(let i=0;i<6;i++){
    html += '<circle class="eco-pulse" r="3" fill="#e8d5b5"><animateMotion dur="'+(3.4+i*0.4)+'s" repeatCount="indefinite" path="M'+cx+','+cy+' L'+positions[i].x+','+positions[i].y+'"/><animate attributeName="opacity" values="0;1;0" dur="'+(3.4+i*0.4)+'s" repeatCount="indefinite"/></circle>';
  }
  svg.innerHTML = html;
})();

/* ORBIT SVG (About section) — icons orbiting the logo */
(function(){
  const svg = document.getElementById('orbitSvg');
  const cx=200, cy=200, R=155;
  const icons = [
    'M12 20l9-5-9-5-9 5z M3 15l9 5 9-5 M12 4v6', // strategy/design
    'M8 9l-4 3 4 3M16 9l4 3-4 3M13 5l-2 14', // development
    'M3 11l18-8-8 18-2-8-8-2z', // marketing
    'M12 8a4 4 0 100 8 4 4 0 000-8zM12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1', // AI & automation
    'M4 19h16M4 15l4-6 4 3 4-7 4 5', // growth
    'M4 19h4V9H4zM10 19h4V5h-4zM16 19h4v-7h-4z' // analytics
  ];
  let html = '<circle cx="200" cy="200" r="150" fill="none" stroke="#D6C3A5" stroke-opacity="0.15" stroke-width="1"/>';
  html += '<circle cx="200" cy="200" r="192" fill="none" stroke="#D6C3A5" stroke-opacity="0.14" stroke-width="1" stroke-dasharray="3 9" class="orbit-ring-spin"/>';
  html += '<circle r="4" fill="#f3e4c8" class="orbit-satellite"><animateMotion dur="16s" repeatCount="indefinite" path="M392,200 A192,192 0 1,1 8,200 A192,192 0 1,1 392,200"/><animate attributeName="opacity" values="0.9;0.3;0.9" dur="2.8s" repeatCount="indefinite"/></circle>';
  html += '<circle cx="200" cy="200" r="55" fill="none" stroke="#D6C3A5" stroke-opacity="0.5" stroke-width="1.2" class="eco-center-pulse"/>';
  html += '<path d="M178 228V172L222 228V172" stroke="#D6C3A5" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none"/>';
  for(let i=0;i<6;i++){
    const angle = (Math.PI*2/6)*i - Math.PI/2;
    const nx = cx + Math.cos(angle)*R, ny = cy + Math.sin(angle)*R;
    html += '<circle cx="'+nx+'" cy="'+ny+'" r="26" fill="#0B0B0B" stroke="#CBB89D" stroke-opacity="0.45" stroke-width="1"/>';
    html += '<g transform="translate('+(nx-10)+','+(ny-10)+')"><path d="'+icons[i]+'" fill="none" stroke="#D6C3A5" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" transform="scale(0.85)"/></g>';
  }
  svg.innerHTML = html;
})();

/* TABS (goal-based solutions) */
const tabs = document.querySelectorAll('.gs-tab');
const panels = document.querySelectorAll('.gs-panel');
tabs.forEach(function(tab){
  tab.addEventListener('click', function(){
    tabs.forEach(t=>t.classList.remove('active'));
    panels.forEach(p=>p.classList.remove('active'));
    tab.classList.add('active');
    const target = tab.getAttribute('data-tab');
    document.querySelector('.gs-panel[data-panel="'+target+'"]').classList.add('active');
    document.querySelectorAll('.gs-panel[data-panel="'+target+'"] .reveal,.gs-panel[data-panel="'+target+'"] .reveal-l').forEach(function(el){ el.classList.add('in'); });
  });
});

/* FAQ — build list bilingually */
const faqData = [
  {qEn:'Can I request just one service?', qAr:'هل ممكن أطلب خدمة واحدة فقط؟', aEn:'Sure. You can start with any single service, and as your project grows we help you add more solutions at the right time.', aAr:'أكيد. تقدر تبدأ بأي خدمة، ومع نمو مشروعك نساعدك تضيف حلول تانية في الوقت المناسب.'},
  {qEn:'Do I need to already have a company?', qAr:'هل لازم أكون عندي شركة؟', aEn:'No. We work with idea owners, entrepreneurs, and small, medium and large companies alike.', aAr:'لا. بنشتغل مع أصحاب الأفكار، ورواد الأعمال، والشركات الصغيرة والمتوسطة والكبيرة.'},
  {qEn:'Are prices fixed?', qAr:'هل الأسعار ثابتة؟', aEn:'Since every project is different, we set the price after understanding your needs and present a matching offer.', aAr:'لأن كل مشروع مختلف، بنحدد السعر بعد فهم احتياجاتك ونقدم عرض مناسب ليها.'},
  {qEn:'Is there support after delivery?', qAr:'هل فيه دعم بعد التسليم؟', aEn:'Yes. We provide technical support and follow-up plans depending on the type of project.', aAr:'أيوه. بنقدم دعم فني وخطط متابعة حسب نوع المشروع.'},
  {qEn:'Do you work outside Egypt?', qAr:'هل بتشتغلوا خارج مصر؟', aEn:'Yes. We serve clients inside and outside Egypt, and all the work happens online.', aAr:'نعم. بنقدم خدماتنا لعملاء داخل مصر وخارجها، وكل الشغل بيتم أونلاين.'},
  {qEn:'Can I develop the project further later?', qAr:'هل أقدر أطور المشروع بعدين؟', aEn:'Of course. Every solution we build is scalable and grows with your business.', aAr:'طبعًا. كل الحلول اللي بنبنيها قابلة للتطوير والتوسع مع نمو البيزنس.'},
  {qEn:'What is the first step?', qAr:'إيه أول خطوة؟', aEn:'Book a free consultation, tell us about your project, and we\'ll recommend the best plan for your goals.', aAr:'احجز استشارة مجانية، واحكيلنا عن مشروعك، وإحنا هنرشحلك أفضل خطة تناسب أهدافك.'},
  {qEn:'Is there a long-term contract I have to sign?', qAr:'هل في عقد طويل الأجل لازم أوقعه؟', aEn:'No, we work on flexible monthly contracts. We prove results first before talking about any longer commitment.', aAr:'لأ، بنشتغل بعقود شهرية مرنة. بنثبت النتيجة الأول قبل ما نتكلم عن التزام أطول.'},
  {qEn:'How long until I see real results?', qAr:'هستنى قد إيه لحد ما أشوف نتائج فعلية؟', aEn:'You\'ll usually see early indicators within 30 days, with clear and stable results within 60 to 90 days.', aAr:'غالبًا بتبدأ تشوف مؤشرات أولية خلال 30 يوم، ونتائج واضحة ومستقرة خلال 60 إلى 90 يوم.'},
  {qEn:'Can you work with my in-house team?', qAr:'هل هتقدروا تشتغلوا مع الفريق الداخلي عندي؟', aEn:'Absolutely, we work as an extension of your team, not a replacement, and coordinate continuously with any internal team you have.', aAr:'طبعًا، إحنا بنشتغل كامتداد لفريقك، مش بديل عنه. بنتنسق باستمرار مع أي فريق داخلي عندك.'},
  {qEn:'How will I know the money I\'m spending is paying off?', qAr:'إزاي هعرف إن الفلوس اللي بصرفها بترجع فعليًا؟', aEn:'You\'ll have a live dashboard and regular reports showing exactly where every pound goes and what it returns. Everything is designed specifically for you and your business.', aAr:'هتكون عندك لوحة بيانات مباشرة وتقارير دورية، بتوريك بالظبط كل جنيه رايح فين وعائده إيه. مصممة خصيصًا لك أنت وعلى حسب البيزنس بتاعك.'}
];
const faqList = document.getElementById('faqList');
let faqHtml = '';
faqData.forEach(function(f,i){
  faqHtml += '<div class="faq-item"><button type="button" class="faq-q" aria-expanded="false"><span data-en="'+f.qEn+'" data-ar="'+f.qAr+'">'+f.qAr+'</span><span class="faq-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 5v14M5 12h14"/></svg></span></button><div class="faq-a"><p data-en="'+f.aEn+'" data-ar="'+f.aAr+'">'+f.aAr+'</p></div></div>';
});
faqList.innerHTML = faqHtml;
function bindFaq(){
  document.querySelectorAll('.faq-item').forEach(function(item){
    const btn = item.querySelector('.faq-q');
    const ans = item.querySelector('.faq-a');
    btn.addEventListener('click', function(){
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(function(other){
        other.classList.remove('open');
        other.querySelector('.faq-q').setAttribute('aria-expanded','false');
        other.querySelector('.faq-a').style.maxHeight = null;
      });
      if(!isOpen){
        item.classList.add('open');
        btn.setAttribute('aria-expanded','true');
        ans.style.maxHeight = ans.scrollHeight+'px';
      }
    });
  });
}
bindFaq();

/* ASSESSMENT — 6 questions, capped at 60% */
let aStep = 0;
let aScore = 0;
const aSteps = document.querySelectorAll('.assess-step');
const aSegs = document.querySelectorAll('.ap-seg');
function showAssessStep(n){
  const current = document.querySelector('.assess-step.active');
  const next = document.querySelector('.assess-step[data-step="'+n+'"]');
  aSegs.forEach(function(seg,i){ if(i < n) seg.classList.add('done'); else seg.classList.remove('done'); });
  if(current && current!==next){
    current.classList.add('exiting');
    setTimeout(function(){
      current.classList.remove('active','exiting');
      next.classList.add('active');
    }, 300);
  } else if(next){
    next.classList.add('active');
  }
}
document.querySelectorAll('.assess-step[data-step]').forEach(function(stepEl){
  const opts = stepEl.querySelectorAll('.assess-opt');
  opts.forEach(function(opt){
    opt.addEventListener('click', function(){
      opts.forEach(o=>o.classList.remove('sel'));
      opt.classList.add('sel');
      aScore += parseInt(opt.getAttribute('data-val'),10);
      setTimeout(function(){
        aStep++;
        if(aStep < 6){
          showAssessStep(aStep);
        } else {
          aSegs.forEach(seg=>seg.classList.add('done'));
          const avg = aScore/12; // max raw score 12 (6 questions x 2)
          const pct = Math.min(60, Math.round(avg*60));
          const lang = currentLang;
          document.getElementById('aScoreVal').textContent = pct+'%';
          let msgAr, msgEn;
          if(pct < 25){
            msgAr = 'مشروعك محتاج نظام نمو كامل من الصفر، وده وقته الصح دلوقتي قبل ما تخسر فرص أكتر.';
            msgEn = 'Your project needs a complete growth system from scratch — the right time to start is now, before you lose more opportunities.';
          } else if(pct < 45){
            msgAr = 'عندك أساس، لكن فيه فجوات كبيرة بتخليك تخسر عملاء ومبيعات كل شهر من غير ما تحس.';
            msgEn = 'You have a foundation, but there are real gaps costing you customers and sales every month without you noticing.';
          } else {
            msgAr = 'وضعك أحسن من كتير، لكن لسه في مساحة كبيرة للنمو محتاجة نظام يوصلك للمرحلة الجاية.';
            msgEn = 'You\'re ahead of many, but there\'s still real room to grow that needs a system to get you to the next stage.';
          }
          document.getElementById('aMsgVal').textContent = lang==='en' ? msgEn : msgAr;
          document.getElementById('aMsgVal').setAttribute('data-en', msgEn);
          document.getElementById('aMsgVal').setAttribute('data-ar', msgAr);
          const sendMsg = 'Hello NEXORA, I just completed the readiness assessment and got '+pct+'%. Code: QZR';
          const bookMsg = 'Hello NEXORA, I completed the assessment and would like to book a free consultation. Code: QZC';
          document.getElementById('aSendResult').href = 'https://wa.me/'+WHATSAPP+'?text='+encodeURIComponent(sendMsg);
          document.getElementById('aBookConsult').href = 'https://wa.me/'+WHATSAPP+'?text='+encodeURIComponent(bookMsg);
          showAssessStep(6);
        }
      }, 260);
    });
  });
});
document.getElementById('aRestart').addEventListener('click', function(e){
  e.preventDefault();
  aStep = 0; aScore = 0;
  document.querySelectorAll('.assess-opt.sel').forEach(o=>o.classList.remove('sel'));
  showAssessStep(0);
});

/* PACKAGES — WhatsApp deep links with per-package code */
document.querySelectorAll('.pkg-wa').forEach(function(btn){
  btn.addEventListener('click', function(e){
    e.preventDefault();
    const code = btn.getAttribute('data-code');
    const name = btn.getAttribute('data-name');
    const msg = 'Hello NEXORA! I\'m interested in the '+name+' package — Code: '+code+'. I\'d love to know more about the details and pricing.';
    window.open('https://wa.me/'+WHATSAPP+'?text='+encodeURIComponent(msg), '_blank');
  });
});

/* form goal multi-select */
let selectedGoals = [];
document.querySelectorAll('.f-check').forEach(function(chk){
  chk.addEventListener('click', function(){
    chk.classList.toggle('sel');
    const enVal = chk.getAttribute('data-goal-en');
    const idx = selectedGoals.findIndex(g=>g.en===enVal);
    if(chk.classList.contains('sel') && idx===-1){
      selectedGoals.push({en:enVal, ar:chk.getAttribute('data-goal-ar')});
    } else if(!chk.classList.contains('sel') && idx>-1){
      selectedGoals.splice(idx,1);
    }
  });
});

/* CONTACT FORM — mailto submission */
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', function(e){
  e.preventDefault();
  const name = document.getElementById('fName').value.trim();
  const phone = document.getElementById('fPhone').value.trim();
  const email = document.getElementById('fEmail').value.trim();
  const company = document.getElementById('fCompany').value.trim();
  const sector = document.getElementById('fSector').value.trim();
  const msg = document.getElementById('fMsg').value.trim();
  const lang = currentLang;

  const nameGroup = document.getElementById('fName').closest('.f-group');
  const phoneGroup = document.getElementById('fPhone').closest('.f-group');
  [nameGroup, phoneGroup].forEach(function(g){
    g.classList.remove('invalid');
    let err = g.querySelector('.f-error');
    if(!err){ err = document.createElement('span'); err.className='f-error'; g.appendChild(err); }
  });
  let hasError = false;
  if(!name){
    nameGroup.classList.add('invalid');
    nameGroup.querySelector('.f-error').textContent = lang==='en' ? 'Please enter your name.' : 'من فضلك اكتب الاسم.';
    hasError = true;
  }
  if(!phone){
    phoneGroup.classList.add('invalid');
    phoneGroup.querySelector('.f-error').textContent = lang==='en' ? 'Please enter your phone number.' : 'من فضلك اكتب رقم الهاتف.';
    hasError = true;
  }
  if(hasError){
    (nameGroup.classList.contains('invalid') ? nameGroup : phoneGroup).querySelector('input').focus();
    return;
  }

  const goalsText = selectedGoals.length ? selectedGoals.map(g=>lang==='en'?g.en:g.ar).join(', ') : '-';
  let body = (lang==='en' ? 'Name: ' : 'الاسم: ')+name+'\\n';
  body += (lang==='en' ? 'Phone: ' : 'رقم الهاتف: ')+phone+'\\n';
  if(email) body += (lang==='en' ? 'Email: ' : 'البريد الإلكتروني: ')+email+'\\n';
  if(company) body += (lang==='en' ? 'Company: ' : 'اسم الشركة: ')+company+'\\n';
  if(sector) body += (lang==='en' ? 'Industry: ' : 'المجال: ')+sector+'\\n';
  body += (lang==='en' ? 'Goals: ' : 'الأهداف: ')+goalsText+'\\n';
  if(msg) body += (lang==='en' ? 'Details: ' : 'التفاصيل: ')+msg;

  const subject = lang==='en' ? 'Free Consultation Request — '+name : 'طلب استشارة مجانية — '+name;
  const mailLink = 'mailto:'+EMAIL+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);

  const submitBtnEl = document.getElementById('submitBtn');
  submitBtnEl.classList.add('is-loading');
  setTimeout(function(){
    window.location.href = mailLink;
    submitBtnEl.classList.remove('is-loading');
    submitBtnEl.classList.add('is-success');
    setTimeout(function(){
      contactForm.style.display = 'none';
      document.getElementById('fSuccess').classList.add('show');
    }, 500);
  }, 550);
});

/* ============ LANGUAGE SYSTEM ============ */
let currentLang = document.body.dataset.lang || 'ar';
function applyLang(lang){
  currentLang = lang;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.body.dataset.lang = lang;
  document.querySelectorAll('[data-en]').forEach(function(el){
    const val = el.getAttribute(lang === 'ar' ? 'data-ar' : 'data-en');
    if(val !== null) el.textContent = val;
  });
  document.querySelectorAll('#langSw button, #langSwM button').forEach(function(b){
    b.classList.toggle('active', b.getAttribute('data-lang')===lang);
  });
  localStorage.setItem('nexora-lang', lang);
  bindHover();
  observeReveal();
}
document.querySelectorAll('#langSw button, #langSwM button').forEach(function(b){
  b.addEventListener('click', function(){ applyLang(b.getAttribute('data-lang')); });
});
const savedLang = localStorage.getItem('nexora-lang') || 'ar';
applyLang(savedLang);

/* IMAGE PARALLAX — subtle drift for the upgraded visuals (hero media + solution photos) */
(function(){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const heroMedia = document.querySelector('.hero-media');
  const photos = Array.prototype.slice.call(document.querySelectorAll('.gs-visual .gs-photo'));
  if(!heroMedia && !photos.length) return;
  let ticking = false;
  function update(){
    ticking = false;
    const sy = window.scrollY;
    if(heroMedia && window.innerWidth > 1100){
      const heroTop = heroMedia.closest('#hero').getBoundingClientRect().top;
      if(heroTop < window.innerHeight && heroTop > -window.innerHeight){
        heroMedia.style.transform = 'translateY(calc(-50% + ' + (sy*0.06) + 'px))';
      }
    }
    photos.forEach(function(img){
      const r = img.getBoundingClientRect();
      if(r.top < window.innerHeight && r.bottom > 0){
        const drift = (r.top + r.height/2 - window.innerHeight/2) * 0.02;
        img.style.transform = 'translateY(' + drift.toFixed(1) + 'px) scale(1.14)';
      }
    });
  }
  window.addEventListener('scroll', function(){
    if(!ticking){ ticking = true; requestAnimationFrame(update); }
  }, {passive:true});
})();

})();
