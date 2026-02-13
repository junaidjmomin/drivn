/* ============================================
   DRIVN — Cyberpunk Script
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Scroll Reveal ---------- */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  /* ---------- Smooth Scroll for Anchor Links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  /* ---------- Animated Wellness Score ---------- */
  const scoreEl = document.getElementById('heroScore');
  if (scoreEl) {
    let currentScore = 87;
    const minScore = 74;
    const maxScore = 96;
    let direction = 1;

    setInterval(() => {
      currentScore += direction * (Math.random() > 0.5 ? 1 : 2);
      if (currentScore >= maxScore) direction = -1;
      if (currentScore <= minScore) direction = 1;
      currentScore = Math.max(minScore, Math.min(maxScore, currentScore));
      scoreEl.textContent = currentScore;
    }, 1800);
  }


  /* ---------- Stat Number Counter Animation ---------- */
  const statNumbers = document.querySelectorAll('.stat-number');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent.trim();
        counterObserver.unobserve(el);

        if (text.includes('Billion')) {
          animateText(el, '1 Billion+', 1400);
        } else if (text.includes('%')) {
          const num = parseInt(text);
          animateCounter(el, 0, num, 1400, '%');
        }
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));

  function animateCounter(el, start, end, duration, suffix = '') {
    const startTime = performance.now();
    const step = (timestamp) => {
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function animateText(el, finalText, duration) {
    el.textContent = '0';
    const startTime = performance.now();
    const step = (timestamp) => {
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const num = Math.round(eased * 1);
      if (progress < 1) {
        el.textContent = num + ' Billion+';
        requestAnimationFrame(step);
      } else {
        el.textContent = finalText;
      }
    };
    requestAnimationFrame(step);
  }


  /* ---------- Waitlist Form ---------- */
  const waitlistForm = document.getElementById('waitlistForm');
  const waitlistEmail = document.getElementById('waitlistEmail');

  if (waitlistForm) {
    waitlistForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = waitlistEmail.value.trim();
      if (email) {
        const btn = waitlistForm.querySelector('.btn-gold');
        const originalText = btn.textContent;
        btn.textContent = '✓ YOU\'RE IN';
        btn.style.background = 'linear-gradient(135deg, #00e6a0, #00b37a)';
        btn.style.boxShadow = '0 0 40px rgba(0, 230, 160, 0.4)';
        waitlistEmail.value = '';

        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.style.boxShadow = '';
        }, 3000);
      }
    });
  }


  /* ---------- Interactive Parallax Blobs ---------- */
  const blobs = document.querySelectorAll('.blob');
  let mouseX = 0, mouseY = 0;
  let blobX = 0, blobY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function animateBlobs() {
    blobX += (mouseX - blobX) * 0.025;
    blobY += (mouseY - blobY) * 0.025;

    blobs.forEach((blob, i) => {
      const factor = (i + 1) * 10;
      blob.style.transform = `translate(${blobX * factor}px, ${blobY * factor}px)`;
    });

    requestAnimationFrame(animateBlobs);
  }

  if (window.matchMedia('(hover: hover)').matches) {
    animateBlobs();
  }


  /* ---------- Tilt Effect on Glass Cards ---------- */
  const glassCards = document.querySelectorAll('.glass-card, .feature-card, .competitor-card');

  glassCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -4;
      const rotateY = (x - centerX) / centerX * 4;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });


  /* ---------- Typing Effect on Tagline ---------- */
  const tagline = document.querySelector('.tagline');
  if (tagline) {
    const text = tagline.textContent;
    tagline.textContent = '';
    tagline.style.opacity = '1';
    tagline.style.transform = 'translateY(0)';
    let i = 0;

    const typeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          typeObserver.unobserve(entry.target);
          function typeChar() {
            if (i < text.length) {
              tagline.textContent += text.charAt(i);
              i++;
              setTimeout(typeChar, 35);
            }
          }
          setTimeout(typeChar, 600);
        }
      });
    }, { threshold: 0.5 });

    typeObserver.observe(tagline);
  }

});
