(function () {
  'use strict';

  // ===== ELEMENTS =====
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  const scrollBar = document.getElementById('scroll-bar');
  const scrollTopBtn = document.getElementById('scroll-top');
  const allNavLinks = document.querySelectorAll('.nav-link');

  // ===== SCROLL EVENTS =====
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = (scrollY / docHeight) * 100;

    // Progress bar
    if (scrollBar) scrollBar.style.width = percent + '%';

    // Navbar shadow
    if (navbar) navbar.classList.toggle('scrolled', scrollY > 60);

    // Scroll top
    if (scrollTopBtn) scrollTopBtn.classList.toggle('visible', scrollY > 500);
  });

  // ===== MOBILE NAV =====
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    allNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  // ===== SCROLL TO TOP =====
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===== REVEAL ON SCROLL =====
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ===== COUNTER ANIMATION =====
  function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('[data-count]').forEach(animateCounter);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.querySelector('.stats-bar');
  if (statsSection) counterObserver.observe(statsSection);

  // ===== TICKER GENERATION =====
  const tickerTrack = document.getElementById('ticker-track');
  if (tickerTrack) {
    const reviews = [
      { n: "Rajesh K.", s: "5.0", t: "Finest Civil Works!" },
      { n: "Anitha Rao", s: "4.5", t: "Safe electrical team." },
      { n: "Suresh Iyer", s: "4.0", t: "Reliable materials." },
      { n: "Priya Mani", s: "5.0", t: "Stunning teak woodwork." },
      { n: "Manoj S.", s: "4.5", t: "Safe packers & movers." },
      { n: "Divya K.", s: "4.0", t: "Perfect painting finish." },
      { n: "Vikram R.", s: "5.0", t: "Best in Chennai!" },
      { n: "Lakshmi P.", s: "4.5", t: "Very professional team." }
    ];

    const allReviews = [...reviews, ...reviews]; // duplicate for seamless loop
    let html = '';
    allReviews.forEach(r => {
      html += `
        <div class="ticker-card">
          <span class="ticker-name">${r.n}</span>
          <span class="ticker-text">"${r.t}"</span>
          <span class="ticker-stars">${r.s} ★</span>
        </div>
      `;
    });
    tickerTrack.innerHTML = html;
  }

  // ===== WHATSAPP HELPER =====
  window.wa = function (subject) {
    window.open(
      'https://wa.me/918925285928?text=' + encodeURIComponent('Hi Honest Hammer! Inquiry about: ' + subject),
      '_blank'
    );
  };

  // ===== SERVICE CARD TILT =====
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-10px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

})();
