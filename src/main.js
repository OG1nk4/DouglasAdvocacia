/* ================================================
   DOUGLAS FERRAZ ADVOCACIA - MAIN JS
   ================================================ */

import './style.css';

// ============================================
// 1. EMAILJS CONFIGURATION
// ============================================
// To set up EmailJS:
// 1. Go to https://www.emailjs.com/ and create a free account
// 2. Add an email service (Gmail, Outlook, etc.) and note the SERVICE_ID
// 3. Create TWO email templates:
//    a) "contact_notification" - sends the form data to the lawyer
//    b) "auto_reply" - sends a confirmation to the client
// 4. Replace the values below with your actual IDs

const EMAILJS_CONFIG = {
  publicKey: 'YOUR_PUBLIC_KEY',       // Replace with your EmailJS public key
  serviceId: 'YOUR_SERVICE_ID',       // Replace with your EmailJS service ID
  templateNotify: 'contact_notification', // Template for notifying the lawyer
  templateAutoReply: 'auto_reply',    // Template for auto-reply to client
};

// Initialize EmailJS
function initEmailJS() {
  if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_CONFIG.publicKey);
  }
}

// ============================================
// 2. HEADER SCROLL EFFECT
// ============================================
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ============================================
// 3. MOBILE MENU
// ============================================
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');
  if (!hamburger || !nav) return;

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  function toggleMenu() {
    const isOpen = nav.classList.contains('open');
    nav.classList.toggle('open');
    hamburger.classList.toggle('active');
    overlay.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', !isOpen);
    document.body.style.overflow = isOpen ? '' : 'hidden';
  }

  function closeMenu() {
    nav.classList.remove('open');
    hamburger.classList.remove('active');
    overlay.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', closeMenu);

  // Close menu when clicking nav links
  nav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

// ============================================
// 4. ACTIVE NAVIGATION LINK
// ============================================
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    },
    {
      rootMargin: '-30% 0px -70% 0px',
    }
  );

  sections.forEach((section) => observer.observe(section));
}

// ============================================
// 5. SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  elements.forEach((el, index) => {
    el.style.transitionDelay = `${index % 5 * 0.1}s`;
    observer.observe(el);
  });
}

// ============================================
// 6. CONTACT FORM WITH EMAILJS
// ============================================
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  // ─── Recipient is read from data-recipient attribute on the form.
  // To change the destination email, just update index.html:
  //   data-recipient="newemail@example.com"
  // No JS changes needed.
  const recipientEmail = form.dataset.recipient || 'ginkasanches@gmail.com';
  const emailSubject   = form.dataset.subject   || 'Novo contato pelo site - Douglas Ferraz Advocacia';

  // ─── Phone mask
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 6)      v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
      else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
      else if (v.length > 0) v = `(${v}`;
      e.target.value = v;
    });
  }

  // ─── Helpers
  function setFieldError(id, msg) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add('is-error');
    let err = el.parentElement.querySelector('.field-error');
    if (!err) {
      err = document.createElement('span');
      err.className = 'field-error';
      el.parentElement.appendChild(err);
    }
    err.textContent = msg;
  }

  function clearErrors() {
    form.querySelectorAll('.is-error').forEach(el => el.classList.remove('is-error'));
    form.querySelectorAll('.field-error').forEach(el => el.remove());
  }

  function showMsg(type) {
    document.getElementById('form-success')?.classList.toggle('show', type === 'success');
    document.getElementById('form-error')?.classList.toggle('show', type === 'error');
  }

  function setLoading(loading) {
    const btn    = document.getElementById('contact-submit');
    const text   = btn?.querySelector('.btn__text');
    const loader = btn?.querySelector('.btn__loader');
    if (!btn) return;
    btn.disabled             = loading;
    text.style.display       = loading ? 'none'   : 'inline';
    loader.style.display     = loading ? 'inline-flex' : 'none';
  }

  // ─── Submit handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();
    showMsg(null);

    const data = {
      name:    document.getElementById('name')?.value.trim()    || '',
      email:   document.getElementById('email')?.value.trim()   || '',
      phone:   document.getElementById('phone')?.value.trim()   || '',
      message: document.getElementById('message')?.value.trim() || '',
    };

    // ─── Validation
    let hasError = false;
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.name)              { setFieldError('name',    'Por favor, informe seu nome.');      hasError = true; }
    if (!emailRe.test(data.email)){ setFieldError('email',  'Informe um e-mail válido.');         hasError = true; }
    if (data.phone.length < 10)  { setFieldError('phone',   'Informe um telefone com DDD.');      hasError = true; }
    if (!data.message)           { setFieldError('message', 'Por favor, escreva uma mensagem.'); hasError = true; }
    if (hasError) return;

    setLoading(true);

    try {
      const ejsReady = typeof emailjs !== 'undefined' && EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY';

      if (ejsReady) {
        // ── Live mode: send via EmailJS ──────────────────────
        await emailjs.send(
          EMAILJS_CONFIG.serviceId,
          EMAILJS_CONFIG.templateNotify,
          {
            from_name:  data.name,
            from_email: data.email,
            phone:      data.phone,
            message:    data.message,
            to_email:   recipientEmail,
            subject:    emailSubject,
          }
        );
      } else {
        // ── Demo / test mode (EmailJS not yet configured) ────
        await new Promise(r => setTimeout(r, 1400));
        console.group('📧 Formulário de contato [DEMO]');
        console.info('Destinatário:', recipientEmail);
        console.info('Assunto:',      emailSubject);
        console.table(data);
        console.info('Configure EMAILJS_CONFIG em main.js para envios reais.');
        console.groupEnd();
      }

      showMsg('success');
      form.reset();
    } catch (err) {
      console.error('Erro ao enviar formulário:', err);
      const errText = document.getElementById('form-error-text');
      if (errText) errText.textContent = 'Ocorreu um erro ao enviar. Tente novamente ou fale pelo WhatsApp.';
      showMsg('error');
    } finally {
      setLoading(false);
    }
  });
}

// ============================================
// 7. TOAST NOTIFICATION
// ============================================
function showToast() {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 5000);
}

// ============================================
// 8. SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// ============================================
// 9. CASOS DE ATUAÇÃO – EXPAND / COLLAPSE
// ============================================
function initCasosToggle() {
  document.querySelectorAll('.caso-card__toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.caso-card');
      const details = card.querySelector('.caso-card__details');
      const isOpen = !details.hidden;

      details.hidden = isOpen;
      btn.setAttribute('aria-expanded', !isOpen);
    });
  });
}

// ============================================
// 10. BLOG TOGGLE
// ============================================
function initBlogToggle() {
  const btn = document.getElementById('btn-ver-todos');
  if (!btn) return;
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const hiddenCards = document.querySelectorAll('.blog-card--hidden');
    hiddenCards.forEach(card => {
      card.classList.remove('blog-card--hidden');
      void card.offsetWidth; // trigger reflow
      card.classList.add('visible');
    });
    btn.parentElement.style.display = 'none';
  });
}

// ============================================
// 11. DIRECTIONAL ANIMATIONS (advogado section)
// ============================================
function initDirectionalAnimations() {
  const elements = document.querySelectorAll(
    '.animate-from-left, .animate-from-right, .animate-fade-up'
  );
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach((el) => observer.observe(el));
}

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initEmailJS();
  initHeaderScroll();
  initMobileMenu();
  initActiveNav();
  initScrollAnimations();
  initContactForm();
  initSmoothScroll();
  initCasosToggle();
  initBlogToggle();
  initDirectionalAnimations();
});

