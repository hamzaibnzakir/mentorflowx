// ==========================================================================
// MentorFlowX — script.js
// ==========================================================================

document.getElementById('year').textContent = new Date().getFullYear();

/* --------------------------------------------------------------------
   1. Generate 10 screenshot proof cards
   Swap the placeholder <img> logic below with real <img src="..."> tags
   once you have your screenshots — see README for instructions.
-------------------------------------------------------------------- */
const shotGrid = document.getElementById('shotGrid');
const SHOT_COUNT = 10;
const shotLabels = [
  'Order confirmation', 'Ad account results', 'Payout received',
  'Store analytics', 'Customer DM', 'Revenue milestone',
  'Ad ROAS screenshot', 'Weekly payout', 'Student review',
  'Store dashboard'
];

for (let i = 1; i <= SHOT_COUNT; i++){
  const card = document.createElement('div');
  card.className = 'shot-card tilt-card';
  card.setAttribute('data-tilt', '');
  card.setAttribute('data-index', i);

  card.innerHTML = `
    <div class="shot-img-wrap">
      <img
        src="assets/screenshots/proof-${i}.jpg"
        alt="${shotLabels[i-1]}"
        loading="lazy"
        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
      >
      <div class="shot-placeholder" style="display:none;">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
        <span>Add proof-${i}.jpg<br>to assets/screenshots/</span>
      </div>
    </div>
    <div class="shot-meta">
      <span>PROOF_${String(i).padStart(3,'0')}.jpg</span>
      <span style="color:var(--green)">✓ verified</span>
    </div>
  `;

  // Show placeholder immediately if image fails on first paint
  const img = card.querySelector('img');
  img.addEventListener('error', () => {
    img.style.display = 'none';
    card.querySelector('.shot-placeholder').style.display = 'flex';
  });

  card.addEventListener('click', () => openLightbox(img.src, img.alt, img.style.display !== 'none'));

  shotGrid.appendChild(card);
}

/* --------------------------------------------------------------------
   2. 3D tilt effect (desktop / pointer devices only)
-------------------------------------------------------------------- */
const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (supportsHover){
  document.querySelectorAll('[data-tilt]').forEach(card => {
    let bounds;

    const rotateToMouse = (e) => {
      bounds = card.getBoundingClientRect();
      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;
      const centerX = bounds.width / 2;
      const centerY = bounds.height / 2;
      const rotateX = ((mouseY - centerY) / centerY) * -6;
      const rotateY = ((mouseX - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;
    };

    card.addEventListener('mouseenter', () => { bounds = card.getBoundingClientRect(); });
    card.addEventListener('mousemove', rotateToMouse);
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)';
    });
  });
}

/* --------------------------------------------------------------------
   3. Animated counters in hero glass card
-------------------------------------------------------------------- */
const counters = document.querySelectorAll('[data-count]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-count'), 10);
      let current = 0;
      const step = Math.max(1, Math.round(target / 40));
      const tick = () => {
        current += step;
        if (current >= target){ el.textContent = target; return; }
        el.textContent = current;
        requestAnimationFrame(tick);
      };
      tick();
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

counters.forEach(c => counterObserver.observe(c));

/* --------------------------------------------------------------------
   4. Screenshot lightbox
-------------------------------------------------------------------- */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

function openLightbox(src, alt, hasImage){
  if (!hasImage) return; // don't open lightbox for empty placeholders
  lightboxImg.src = src;
  lightboxImg.alt = alt;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox(){
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

/* --------------------------------------------------------------------
   5. Video modal (click a testimonial card to play larger, protected)
-------------------------------------------------------------------- */
const videoModal = document.getElementById('videoModal');
const videoModalPlayer = document.getElementById('videoModalPlayer');
const videoModalClose = document.getElementById('videoModalClose');

document.querySelectorAll('.video-wrap').forEach(wrap => {
  const sourceEl = wrap.querySelector('source');
  const playBtn = wrap.querySelector('.play-btn');

  playBtn.addEventListener('click', () => {
    videoModalPlayer.querySelector('source')?.remove();
    const newSource = document.createElement('source');
    newSource.src = sourceEl.src;
    newSource.type = 'video/mp4';
    videoModalPlayer.appendChild(newSource);
    videoModalPlayer.load();
    videoModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    videoModalPlayer.play().catch(() => {});
  });
});

function closeVideoModal(){
  videoModal.classList.remove('open');
  videoModalPlayer.pause();
  videoModalPlayer.currentTime = 0;
  document.body.style.overflow = '';
}
videoModalClose.addEventListener('click', closeVideoModal);
videoModal.addEventListener('click', (e) => { if (e.target === videoModal) closeVideoModal(); });

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape'){ closeLightbox(); closeVideoModal(); }
});

/* --------------------------------------------------------------------
   6. Formspree submission (AJAX so we can show a success state)
-------------------------------------------------------------------- */
const applyForm = document.getElementById('applyForm');
const submitBtn = document.getElementById('submitBtn');

applyForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const originalLabel = submitBtn.textContent;
  submitBtn.textContent = 'Submitting…';
  submitBtn.disabled = true;

  try {
    const res = await fetch(applyForm.action, {
      method: 'POST',
      body: new FormData(applyForm),
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok){
      applyForm.innerHTML = `
        <div style="text-align:center; padding: 30px 10px;">
          <div style="width:52px;height:52px;border-radius:50%;background:rgba(52,211,153,0.15);color:var(--green);display:flex;align-items:center;justify-content:center;margin:0 auto 18px;font-size:1.4rem;">✓</div>
          <h3 style="margin-bottom:10px;">Application received</h3>
          <p style="color:var(--text-dim); font-size:0.92rem;">We personally review every application. Expect to hear from us within 48 hours — check your WhatsApp and email.</p>
        </div>
      `;
    } else {
      throw new Error('Submission failed');
    }
  } catch (err) {
    submitBtn.textContent = originalLabel;
    submitBtn.disabled = false;
    alert("Something went wrong sending your application — please try again, or message us on WhatsApp.");
  }
});
