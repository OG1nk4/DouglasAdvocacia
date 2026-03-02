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

  // Phone mask
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 11) value = value.slice(0, 11);

      if (value.length > 6) {
        value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
      } else if (value.length > 2) {
        value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
      } else if (value.length > 0) {
        value = `(${value}`;
      }

      e.target.value = value;
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById('contact-submit');
    const btnText = submitBtn.querySelector('.btn__text');
    const btnLoader = submitBtn.querySelector('.btn__loader');

    // Get form data
    const formData = {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      message: document.getElementById('message').value.trim(),
    };

    // Validate
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      return;
    }

    // Show loading state
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline';

    try {
      if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY') {
        // ---- REAL EmailJS integration ----

        // 1. Send notification to the lawyer
        await emailjs.send(
          EMAILJS_CONFIG.serviceId,
          EMAILJS_CONFIG.templateNotify,
          {
            from_name: formData.name,
            from_email: formData.email,
            phone: formData.phone,
            message: formData.message,
            to_email: 'douglassferraz@adv.oabsp.org.br',
          }
        );

        // 2. Send auto-reply to the client
        await emailjs.send(
          EMAILJS_CONFIG.serviceId,
          EMAILJS_CONFIG.templateAutoReply,
          {
            to_name: formData.name,
            to_email: formData.email,
            reply_message:
              'Recebemos seu contato e retornaremos em breve. Obrigado por confiar na Douglas Ferraz Advocacia e Consultoria Jurídica.',
          }
        );
      } else {
        // ---- Demo mode (no EmailJS configured) ----
        // Simulate a network request
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log('📧 [DEMO] Dados do formulário:', formData);
        console.log('📧 [DEMO] Configure o EmailJS para enviar e-mails reais.');
        console.log('📧 [DEMO] Edite as constantes EMAILJS_CONFIG no main.js');
      }

      // Show success toast
      showToast();

      // Reset form
      form.reset();
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      alert(
        'Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente ou entre em contato pelo WhatsApp.'
      );
    } finally {
      // Reset button
      submitBtn.disabled = false;
      btnText.style.display = 'inline';
      btnLoader.style.display = 'none';
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
});
