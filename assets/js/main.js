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

// ===== PRICE CALCULATOR =====
// Market rates (actual) → marked up 30% for "MRP" → 20% discount = Honest Hammer price
// The discount price ends up being 1.3 × 0.8 = 1.04× market (4% above market)
const SERVICE_RATES = {
  civil:      { name: 'Complete Civil Works',       low: 1800, high: 2500, unit: 'sq.ft' },
  electrical: { name: 'Electrical Hardware & Labour', low: 55,   high: 85,   unit: 'sq.ft' },
  plumbing:   { name: 'Plumbing & Waterproofing',    low: 45,   high: 70,   unit: 'sq.ft' },
  painting:   { name: 'Painting & Tiling',            low: 18,   high: 35,   unit: 'sq.ft' },
  carpentry:  { name: 'Flooring, Carpentry & Doors',  low: 800,  high: 1500, unit: 'sq.ft' },
  windows:    { name: 'Window Install & Grills',      low: 350,  high: 650,  unit: 'sq.ft' },
  interior:   { name: 'Complete Interior Design',     low: 1200, high: 2800, unit: 'sq.ft' }
};

const MARKUP = 1.30;   // 30% above market for "MRP"
const DISCOUNT = 0.80; // 20% off the MRP = Honest Hammer price

function formatINR(num) {
  // Indian number formatting: 12,34,567
  const str = Math.round(num).toString();
  let result = '';
  const len = str.length;
  if (len <= 3) return '₹' + str;
  result = str.substring(len - 3);
  let remaining = str.substring(0, len - 3);
  while (remaining.length > 2) {
    result = remaining.substring(remaining.length - 2) + ',' + result;
    remaining = remaining.substring(0, remaining.length - 2);
  }
  if (remaining.length > 0) result = remaining + ',' + result;
  return '₹' + result;
}

function calculatePrice() {
  const serviceKey = document.getElementById('calc-service').value;
  const area = parseFloat(document.getElementById('calc-area').value);

  if (!serviceKey) {
    alert('Please select a service.');
    return;
  }
  if (!area || area <= 0) {
    alert('Please enter a valid area in sq.ft.');
    return;
  }

  const rate = SERVICE_RATES[serviceKey];

  // MRP = market rate × 1.30 (30% markup)
  const mrpLow = rate.low * MARKUP * area;
  const mrpHigh = rate.high * MARKUP * area;

  // Honest Hammer Price = MRP × 0.80 (20% discount)
  const hhLow = mrpLow * DISCOUNT;
  const hhHigh = mrpHigh * DISCOUNT;

  // Average savings
  const savingsLow = mrpLow - hhLow;
  const savingsHigh = mrpHigh - hhHigh;
  const avgSavings = (savingsLow + savingsHigh) / 2;

  // Update UI
  document.getElementById('calc-result-service').textContent = rate.name;
  document.getElementById('calc-result-area').textContent = area.toLocaleString() + ' sq.ft';

  document.getElementById('calc-mrp-low').textContent = formatINR(mrpLow);
  document.getElementById('calc-mrp-high').textContent = formatINR(mrpHigh);

  document.getElementById('calc-hh-low').textContent = formatINR(hhLow);
  document.getElementById('calc-hh-high').textContent = formatINR(hhHigh);

  document.getElementById('calc-savings-amount').textContent = formatINR(avgSavings);

  // WhatsApp button with pre-filled message
  const waBtn = document.getElementById('calc-wa-btn');
  const msg = `Hi Honest Hammer! I need a quote for:\n\nService: ${rate.name}\nArea: ${area} sq.ft\nEstimate: ${formatINR(hhLow)} - ${formatINR(hhHigh)}\n\nPlease provide an exact quote.`;
  waBtn.href = 'https://wa.me/918925285928?text=' + encodeURIComponent(msg);
  waBtn.setAttribute('target', '_blank');

  // Show result
  const resultPanel = document.getElementById('calc-result');
  resultPanel.style.display = 'block';
  resultPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
