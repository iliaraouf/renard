/* ============================================================
   RENARD BARBER SHOP — script.js
   ============================================================ */

(function () {
  'use strict';

  /* ── TAB NAVIGATION ── */
  const tabs    = document.querySelectorAll('.nav-tab');
  const sections = document.querySelectorAll('.section');

  function showSection(targetId) {
    sections.forEach(sec => {
      const isTarget = sec.id === targetId;
      sec.hidden = !isTarget;
      if (isTarget) {
        // Re-trigger animation
        sec.classList.remove('section--active');
        // Force reflow
        void sec.offsetWidth;
        sec.classList.add('section--active');
      }
    });

    tabs.forEach(tab => {
      const isActive = tab.dataset.section === targetId;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => showSection(tab.dataset.section));
  });

  /* ── SERVICE CARD RIPPLE ── */
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const rect = card.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      Object.assign(ripple.style, {
        position:  'absolute',
        width:     size + 'px',
        height:    size + 'px',
        left:      x + 'px',
        top:       y + 'px',
        background: 'rgba(212,168,83,0.15)',
        borderRadius: '50%',
        transform: 'scale(0)',
        animation: 'rippleAnim 0.5s ease-out forwards',
        pointerEvents: 'none',
      });

      card.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  /* Inject ripple keyframes dynamically */
  const style = document.createElement('style');
  style.textContent = `
    @keyframes rippleAnim {
      to { transform: scale(2.5); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  /* ── CONTACT CARD HOVER SOUND EFFECT (optional visual pulse) ── */
  document.querySelectorAll('.contact-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.querySelector('.contact-card__icon').style.transform = 'scale(1.1)';
    });
    card.addEventListener('mouseleave', () => {
      card.querySelector('.contact-card__icon').style.transform = 'scale(1)';
    });
  });

  /* ── SCISSOR CLICK EASTER EGG ── */
  const scissorIcon = document.querySelector('.scissors-icon');
  if (scissorIcon) {
    let snipCount = 0;
    scissorIcon.style.cursor = 'pointer';
    scissorIcon.addEventListener('click', () => {
      snipCount++;
      scissorIcon.style.transition = 'transform 0.1s';
      scissorIcon.style.transform = 'rotate(-25deg) scale(1.2)';
      setTimeout(() => {
        scissorIcon.style.transform = 'rotate(0deg) scale(1)';
      }, 150);
      if (snipCount === 5) {
        showToast('✂️ Snip snip! You found the fox\'s secret.');
        snipCount = 0;
      }
    });
  }

  /* ── TOAST NOTIFICATION ── */
  function showToast(message) {
    const existing = document.querySelector('.renard-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'renard-toast';
    toast.textContent = message;

    Object.assign(toast.style, {
      position:        'fixed',
      bottom:          '2rem',
      left:            '50%',
      transform:       'translateX(-50%) translateY(20px)',
      background:      '#d4a853',
      color:           '#0f0d0b',
      fontFamily:      "'Josefin Sans', sans-serif",
      fontWeight:      '600',
      fontSize:        '0.85rem',
      padding:         '0.7rem 1.4rem',
      borderRadius:    '99px',
      boxShadow:       '0 8px 32px rgba(0,0,0,0.5)',
      zIndex:          '9999',
      opacity:         '0',
      transition:      'opacity 0.3s, transform 0.3s',
      whiteSpace:      'nowrap',
    });

    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(10px)';
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  }

  /* ── SCROLL-AWARE HERO ── */
  const hero = document.querySelector('.hero');
  const foxSil = document.querySelector('.fox-silhouette');

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (foxSil) {
      foxSil.style.opacity = Math.max(0, 0.06 - scrolled * 0.0001);
    }
  }, { passive: true });

  /* ── KEYBOARD NAV FOR TABS ── */
  tabs.forEach((tab, index) => {
    tab.addEventListener('keydown', (e) => {
      let nextIndex = index;
      if (e.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
      if (e.key === 'ArrowLeft')  nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (nextIndex !== index) {
        tabs[nextIndex].focus();
        tabs[nextIndex].click();
      }
    });
  });

  /* ── INIT ── */
  showSection('services');

})();
