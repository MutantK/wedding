// ─────────────────────────────────────────────
//  Kaya & Kevin Wedding — main.js
// ─────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

  // ── Nav scroll effect ─────────────────────
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── Mobile nav toggle ─────────────────────
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ── Particle system (hero) ────────────────
  const particleContainer = document.getElementById('particles');
  if (particleContainer) {
    const count = 28;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 2.5 + 1;
      p.style.cssText = `
        left: ${Math.random() * 100}%;
        width: ${size}px;
        height: ${size}px;
        --dur: ${Math.random() * 8 + 6}s;
        --delay: ${Math.random() * 8}s;
        opacity: 0;
      `;
      particleContainer.appendChild(p);
    }
  }

  // ── Scroll reveal ─────────────────────────
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(el => observer.observe(el));
  }

  // ── Live countdown ────────────────────────
  const cdDays    = document.getElementById('cd-days');
  const cdHours   = document.getElementById('cd-hours');
  const cdMinutes = document.getElementById('cd-minutes');
  const cdSeconds = document.getElementById('cd-seconds');

  if (cdDays) {
    const weddingDate = new Date('2027-07-03T16:00:00-04:00'); // 4pm ET

    const pad = n => String(n).padStart(2, '0');

    const prevValues = { days: null, hours: null, minutes: null, seconds: null };

    const updateCountdown = () => {
      const now  = new Date();
      const diff = weddingDate - now;

      if (diff <= 0) {
        cdDays.textContent = cdHours.textContent = cdMinutes.textContent = cdSeconds.textContent = '00';
        return;
      }

      const days    = Math.floor(diff / 86400000);
      const hours   = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      const set = (el, key, val) => {
        const str = pad(val);
        if (str !== prevValues[key]) {
          el.classList.remove('flip');
          void el.offsetWidth; // reflow
          el.classList.add('flip');
          el.textContent = str;
          prevValues[key] = str;
        }
      };

      set(cdDays,    'days',    days);
      set(cdHours,   'hours',   hours);
      set(cdMinutes, 'minutes', minutes);
      set(cdSeconds, 'seconds', seconds);
    };

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // ── Toast helper ──────────────────────────
  const toastEl = document.getElementById('toast');
  const showToast = (msg, duration = 4000) => {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastEl._timer);
    toastEl._timer = setTimeout(() => toastEl.classList.remove('show'), duration);
  };

  // ── RSVP form ─────────────────────────────
  const form          = document.getElementById('rsvpForm');
  const rsvpConfirm   = document.getElementById('rsvpConfirm');
  const confirmMsg    = document.getElementById('confirmMessage');
  const mealGroup     = document.getElementById('mealGroup');
  const dietaryGroup  = document.getElementById('dietaryGroup');
  const songGroup     = document.getElementById('songGroup');
  const submitText    = document.getElementById('submitText');

  if (form) {
    // Show/hide meal + song fields based on attendance
    const attendanceRadios = form.querySelectorAll('input[name="attendance"]');
    const setAttendanceFields = (attending) => {
      [mealGroup, dietaryGroup, songGroup].forEach(el => {
        if (!el) return;
        el.style.transition = 'opacity 0.4s, transform 0.4s';
        if (attending) {
          el.style.opacity = '1';
          el.style.pointerEvents = 'auto';
          el.style.transform = 'translateY(0)';
        } else {
          el.style.opacity = '0.3';
          el.style.pointerEvents = 'none';
          el.style.transform = 'translateY(-4px)';
        }
      });
    };

    // Initial state: hidden
    [mealGroup, dietaryGroup, songGroup].forEach(el => {
      if (el) { el.style.opacity = '0.3'; el.style.pointerEvents = 'none'; }
    });

    attendanceRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        setAttendanceFields(radio.value === 'yes');
      });
    });

    // Subtle input focus line animation
    form.querySelectorAll('input, select, textarea').forEach(input => {
      input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
      });
      input.addEventListener('blur', () => {
        input.parentElement.classList.remove('focused');
      });
    });

    // Submit
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const firstName  = form.firstName.value.trim();
      const lastName   = form.lastName.value.trim();
      const email      = form.email.value.trim();
      const attendance = form.attendance ? [...form.querySelectorAll('input[name="attendance"]')].find(r => r.checked)?.value : null;

      if (!firstName || !lastName) {
        showToast('Please enter your name.');
        return;
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast('Please enter a valid email address.');
        return;
      }
      if (!attendance) {
        showToast('Please select your attendance.');
        return;
      }

      // Simulate submit
      if (submitText) submitText.textContent = 'Sending…';

      setTimeout(() => {
        form.style.transition = 'opacity 0.5s';
        form.style.opacity = '0';

        setTimeout(() => {
          form.style.display = 'none';
          if (rsvpConfirm) rsvpConfirm.style.display = 'block';

          if (confirmMsg) {
            if (attendance === 'yes') {
              confirmMsg.textContent = `Wonderful, ${firstName}! We've received your RSVP and we cannot wait to celebrate with you on July 3rd.`;
            } else {
              confirmMsg.textContent = `We're sorry you won't be able to make it, ${firstName}. You'll be missed dearly — we'll raise a glass to you.`;
            }
          }

          showToast('RSVP received — thank you!', 5000);
        }, 500);
      }, 900);
    });
  }

  // ── Cursor sparkle on hero ────────────────
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.addEventListener('mousemove', (e) => {
      if (Math.random() > 0.85) {
        const spark = document.createElement('div');
        const size  = Math.random() * 4 + 2;
        spark.style.cssText = `
          position: absolute;
          left: ${e.clientX + window.scrollX - hero.getBoundingClientRect().left}px;
          top: ${e.clientY + window.scrollY - hero.getBoundingClientRect().top}px;
          width: ${size}px;
          height: ${size}px;
          background: var(--gold);
          border-radius: 50%;
          pointer-events: none;
          opacity: 0.7;
          transform: translate(-50%, -50%);
          transition: opacity 0.8s, transform 0.8s;
          z-index: 1;
        `;
        hero.appendChild(spark);
        requestAnimationFrame(() => {
          spark.style.opacity = '0';
          spark.style.transform = `translate(-50%, -${20 + Math.random() * 30}px) scale(0.2)`;
        });
        setTimeout(() => spark.remove(), 900);
      }
    });
  }

});
