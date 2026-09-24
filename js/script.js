/* =================================================
   Portfolio JavaScript
   Handles: mobile menu, scroll reveal, active nav,
   smooth scroll, form validation, back-to-top
   ================================================= */

  function sendMail() {
    return emailjs.sendForm(
        "service_72fuefg",
        "template_d1222i1",
        "#contact-form"
    );
  }


(function () {
  'use strict';

  /* ----- Mobile Menu ----- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  function toggleMenu(open) {
    const isOpen = open ?? !navLinks.classList.contains('open');
    navLinks.classList.toggle('open', isOpen);
    overlay.classList.toggle('show', isOpen);
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  hamburger.addEventListener('click', () => toggleMenu());
  overlay.addEventListener('click', () => toggleMenu(false));

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) toggleMenu(false);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      toggleMenu(false);
    }
  });

  /* ----- Navbar scroll state ----- */
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('back-to-top');

  function onScroll() {
    const scrolled = window.scrollY > 40;
    navbar.classList.toggle('scrolled', scrolled);

    if (window.scrollY > 600) {
      backToTop.hidden = false;
      requestAnimationFrame(() => backToTop.classList.add('visible'));
    } else {
      backToTop.classList.remove('visible');
      setTimeout(() => {
        if (window.scrollY <= 600) backToTop.hidden = true;
      }, 300);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ----- Scroll Reveal (IntersectionObserver) ----- */
  const revealEls = document.querySelectorAll('.reveal');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion) {
    revealEls.forEach((el) => el.classList.add('visible'));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach((el) => observer.observe(el));
  }

  /* ----- Active nav link on scroll ----- */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navAnchors.forEach((link) => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === '#' + id
            );
          });
        }
      });
    },
    { threshold: 0.4, rootMargin: '-80px 0px -40% 0px' }
  );
  sections.forEach((s) => sectionObserver.observe(s));

  /* ----- Contact form validation ----- */
  /* ----- Contact form validation + EmailJS ----- */

const form = document.getElementById('contact-form');
const successMsg = document.getElementById('form-success');

function showError(fieldId, message) {
  const errorEl = document.getElementById(fieldId + '-error');

  if (errorEl) {
    errorEl.textContent = message;
  }
}

function clearErrors() {
  ['name', 'email', 'subject', 'message'].forEach((id) => {
    showError(id, '');
  });
}

function validateField(id, value) {

  if (id === 'name') {
    if (!value.trim()) {
      return 'Please enter your name.';
    }

    if (value.trim().length < 2) {
      return 'Name must be at least 2 characters.';
    }
  }

  if (id === 'email') {
    if (!value.trim()) {
      return 'Please enter your email.';
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRe.test(value.trim())) {
      return 'Please enter a valid email.';
    }
  }

  if (id === 'subject') {
    if (!value.trim()) {
      return 'Please enter a subject.';
    }

    if (value.trim().length < 3) {
      return 'Subject must be at least 3 characters.';
    }
  }

  if (id === 'message') {
    if (!value.trim()) {
      return 'Please enter a message.';
    }

    if (value.trim().length < 10) {
      return 'Message must be at least 10 characters.';
    }
  }

  return '';
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  clearErrors();

  const name = form.name.value;
  const email = form.email.value;
  const subject = form.subject.value;
  const message = form.message.value;

  const nameErr = validateField('name', name);
  const emailErr = validateField('email', email);
  const subjectErr = validateField('subject', subject);
  const messageErr = validateField('message', message);

  showError('name', nameErr);
  showError('email', emailErr);
  showError('subject', subjectErr);
  showError('message', messageErr);

  if (nameErr || emailErr || subjectErr || messageErr) {

    const firstError = form.querySelector(
      nameErr ? '#name' :
      emailErr ? '#email' :
      subjectErr ? '#subject' :
      '#message'
    );

    if (firstError) {
      firstError.focus();
    }

    return;
  }

  const submitButton = form.querySelector(
    'button[type="submit"]'
  );

  try {

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
    }

    await sendMail();

    successMsg.textContent =
      "Thanks! Your message has been sent. I'll get back to you soon.";

    successMsg.hidden = false;

    form.reset();

    setTimeout(() => {
      successMsg.hidden = true;
    }, 5000);

  } catch (error) {

    console.error('EmailJS Error:', error);

    alert(
      'Sorry, your message could not be sent. Please try again.'
    );

  } finally {

    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = 'Send Message';
    }

  }
});

/* ----- Clear individual field errors ----- */

['name', 'email', 'subject', 'message'].forEach((id) => {

  const field = document.getElementById(id);

  if (field) {
    field.addEventListener('input', () => {
      showError(id, '');
    });
  }

});

  /* ----- Footer year ----- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
