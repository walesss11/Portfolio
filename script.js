/**
 * PRODUCT MANAGER & BUILDER PORTFOLIO - CORE LOGIC & INTERACTION
 * Minimal, Fast, Accessible Vanilla JS
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initCaseStudyToggles();
  initLightbox();
  initCertificateViewer();
  initContactCopy();
  initScrollAnimations();
});

/* ==========================================================================
   Expandable Case Study Drawers
   ========================================================================== */
function initCaseStudyToggles() {
  const toggleBtns = document.querySelectorAll('[data-toggle-study]');
  const collapseBtns = document.querySelectorAll('[data-collapse-study]');

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-toggle-study');
      const drawer = document.getElementById(targetId);
      if (!drawer) return;

      const isOpen = drawer.classList.toggle('open');
      btn.classList.toggle('expanded', isOpen);
      btn.setAttribute('aria-expanded', String(isOpen));

      const labelSpan = btn.querySelector('.btn-toggle-label');
      if (labelSpan) {
        labelSpan.textContent = isOpen ? 'Collapse Case Study' : 'View Full Case Study';
      }

      if (isOpen) {
        // Smoothly scroll down slightly to focus on the expanded content
        drawer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });

  collapseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-collapse-study');
      const drawer = document.getElementById(targetId);
      if (!drawer) return;

      drawer.classList.remove('open');
      const parentCard = drawer.closest('.project-card');
      const mainToggleBtn = parentCard?.querySelector('[data-toggle-study]');
      if (mainToggleBtn) {
        mainToggleBtn.classList.remove('expanded');
        mainToggleBtn.setAttribute('aria-expanded', 'false');
        const labelSpan = mainToggleBtn.querySelector('.btn-toggle-label');
        if (labelSpan) labelSpan.textContent = 'View Full Case Study';
      }

      // Scroll back up to the card header
      parentCard?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ==========================================================================
   Navigation & Active Scroll Spy
   ========================================================================== */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  const sections = document.querySelectorAll('section[id]');
  const toggleBtn = document.querySelector('.nav-toggle-btn');
  const navMenu = document.querySelector('.nav-menu');

  // Sticky header shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
    highlightCurrentSection();
  }, { passive: true });

  // Mobile navigation drawer toggle
  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close when window resized to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    }, { passive: true });
  }

  // Active section scroll spy
  function highlightCurrentSection() {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }
}

/* ==========================================================================
   Interactive Lightbox for Screenshots
   ========================================================================== */
function initLightbox() {
  const overlay = document.getElementById('lightbox-overlay');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');

  if (!overlay || !lightboxImg || !closeBtn) return;

  const clickableScreenshots = document.querySelectorAll('.device-screen-img');

  clickableScreenshots.forEach(img => {
    img.addEventListener('click', () => {
      const src = img.getAttribute('src');
      const alt = img.getAttribute('alt') || '';
      const caption = img.closest('.device-frame')?.querySelector('.screenshot-caption')?.textContent?.trim() || alt;

      lightboxImg.setAttribute('src', src);
      lightboxImg.setAttribute('alt', alt);
      if (lightboxCaption) {
        lightboxCaption.textContent = caption;
      }
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  closeBtn.addEventListener('click', closeLightbox);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* ==========================================================================
   Certificate PDF Preview Modal
   ========================================================================== */
function initCertificateViewer() {
  const modal = document.getElementById('cert-modal');
  const modalIframe = document.getElementById('cert-iframe');
  const modalTitle = document.getElementById('cert-modal-title');
  const closeBtn = document.getElementById('cert-modal-close');
  const openExternalBtn = document.getElementById('cert-modal-external');

  if (!modal || !modalIframe || !closeBtn) return;

  const viewBtns = document.querySelectorAll('[data-view-cert]');

  viewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const pdfPath = btn.getAttribute('data-cert-path');
      const title = btn.getAttribute('data-cert-title') || 'Certificate Document';

      if (pdfPath) {
        modalIframe.setAttribute('src', pdfPath);
        if (modalTitle) modalTitle.textContent = title;
        if (openExternalBtn) openExternalBtn.setAttribute('href', pdfPath);

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    modalIframe.setAttribute('src', '');
    document.body.style.overflow = '';
  };

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   Contact Email Copy & Toast Notification
   ========================================================================== */
function initContactCopy() {
  const copyBtns = document.querySelectorAll('[data-copy-email]');
  const toast = document.getElementById('toast-notice');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-copy-email') || 'olawalebadmos2017@gmail.com';

      if (navigator.clipboard) {
        navigator.clipboard.writeText(email).then(() => {
          showToast(`Copied ${email} to clipboard!`);
        }).catch(() => {
          fallbackCopyText(email);
        });
      } else {
        fallbackCopyText(email);
      }
    });
  });

  function fallbackCopyText(text) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showToast(`Copied ${text} to clipboard!`);
  }

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }
}

/* ==========================================================================
   Subtle Scroll Reveal Observer
   ========================================================================== */
function initScrollAnimations() {
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.project-card, .capability-card, .cert-card, .decision-card').forEach(el => {
    observer.observe(el);
  });
}
