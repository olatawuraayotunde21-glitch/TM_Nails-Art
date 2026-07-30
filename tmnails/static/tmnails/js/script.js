/**
 * ~TM_Nails Art - Main JavaScript
 * Features: Sidebar toggle, Booking system, Scroll animations, Mobile nav
 */

document.addEventListener('DOMContentLoaded', function () {
  // ============================================
  // SIDEBAR TOGGLE
  // ============================================
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const mainContent = document.getElementById('mainContent');

  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', function () {
      sidebar.classList.toggle('sidebar-collapsed');
      sidebarToggle.classList.toggle('collapsed');
      mainContent.classList.toggle('expanded');

      // Toggle icon
      const icon = sidebarToggle.querySelector('i');
      if (sidebar.classList.contains('sidebar-collapsed')) {
        icon.classList.remove('fa-chevron-left');
        icon.classList.add('fa-chevron-right');
      } else {
        icon.classList.remove('fa-chevron-right');
        icon.classList.add('fa-chevron-left');
      }
    });
  }

  // ============================================
  // ACTIVE NAV LINK
  // ============================================
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.sidebar-menu li a, .offcanvas .nav-link');

  navLinks.forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ============================================
  // SCROLL ANIMATIONS (Fade In)
  // ============================================
  const fadeElements = document.querySelectorAll('.fade-in');

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  fadeElements.forEach(el => fadeObserver.observe(el));

  // ============================================
  // BOOKING SYSTEM - DYNAMIC TIME SLOTS
  // ============================================
  const daySelect = document.getElementById('bookingDay');
  const timeSelect = document.getElementById('bookingTime');
  const serviceSelect = document.getElementById('bookingService');
  const bookingForm = document.getElementById('bookingForm');
  const bookingModal = document.getElementById('bookingModal');

  // Time slots (8am - 5pm, 1-hour intervals)
  const timeSlots = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
  ];

  // Service duration mapping
  const serviceDurations = {
    'manicure': '45 minutes - 1 hour',
    'pedicure': '1 hour - 1 hour 15 mins',
    'nail_art': '1.5 - 2 hours',
    'training': '3 - 4 hours'
  };

  // Populate time slots when day is selected
  if (daySelect && timeSelect) {
    daySelect.addEventListener('change', function () {
      const selectedDay = this.value;

      // Clear existing options
      timeSelect.innerHTML = '<option value="" selected disabled>Select a time slot</option>';

      if (selectedDay) {
        // Enable time select
        timeSelect.disabled = false;

        // Add time slots
        timeSlots.forEach(time => {
          const option = document.createElement('option');
          option.value = time;
          option.textContent = time;
          timeSelect.appendChild(option);
        });
      } else {
        timeSelect.disabled = true;
      }
    });
  }

  // Show duration hint when service is selected
  if (serviceSelect) {
    serviceSelect.addEventListener('change', function () {
      const durationHint = document.getElementById('durationHint');
      const duration = serviceDurations[this.value];

      if (durationHint && duration) {
        durationHint.textContent = `Estimated duration: ${duration}`;
        durationHint.style.display = 'block';
      }
    });
  }

  // Handle form submission
  if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const formData = new FormData(bookingForm);
      const bookingData = Object.fromEntries(formData);

      // Store booking in localStorage
      const bookings = JSON.parse(localStorage.getItem('tmNailsBookings') || '[]');
      bookings.push({
        ...bookingData,
        id: Date.now(),
        status: 'confirmed',
        bookedAt: new Date().toISOString()
      });
      localStorage.setItem('tmNailsBookings', JSON.stringify(bookings));

      // Show success modal
      if (typeof bootstrap !== 'undefined' && bookingModal) {
        const modal = new bootstrap.Modal(bookingModal);
        modal.show();
      }

      // Reset form
      bookingForm.reset();
      if (timeSelect) {
        timeSelect.innerHTML = '<option value="" selected disabled>Select a time slot</option>';
        timeSelect.disabled = true;
      }
      const durationHint = document.getElementById('durationHint');
      if (durationHint) durationHint.style.display = 'none';
    });
  }

  // ============================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ============================================
  // GALLERY LIGHTBOX (Simple)
  // ============================================
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(item => {
    item.addEventListener('click', function () {
      const img = this.querySelector('img');
      const title = this.querySelector('h5')?.textContent || '~TM_Nails Art Gallery';

      if (img) {
        // Create lightbox
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox-overlay';
        lightbox.innerHTML = `
          <div class="lightbox-content">
            <button class="lightbox-close">&times;</button>
            <img src="${img.src}" alt="${img.alt}">
            <p>${title}</p>
          </div>
        `;

        // Add styles
        lightbox.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.9);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.3s ease;
        `;

        const lightboxContent = lightbox.querySelector('.lightbox-content');
        lightboxContent.style.cssText = `
          position: relative;
          max-width: 90%;
          max-height: 90%;
          text-align: center;
        `;

        const lightboxImg = lightbox.querySelector('img');
        lightboxImg.style.cssText = `
          max-width: 100%;
          max-height: 80vh;
          border-radius: 10px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        `;

        const lightboxClose = lightbox.querySelector('.lightbox-close');
        lightboxClose.style.cssText = `
          position: absolute;
          top: -40px;
          right: 0;
          background: none;
          border: none;
          color: #D4AF37;
          font-size: 2.5rem;
          cursor: pointer;
          transition: color 0.3s;
        `;

        const lightboxTitle = lightbox.querySelector('p');
        lightboxTitle.style.cssText = `
          color: #D4AF37;
          margin-top: 15px;
          font-family: 'Playfair Display', serif;
          font-size: 1.2rem;
        `;

        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';

        // Close on click
        lightboxClose.addEventListener('click', () => {
          lightbox.remove();
          document.body.style.overflow = '';
        });

        lightbox.addEventListener('click', (e) => {
          if (e.target === lightbox) {
            lightbox.remove();
            document.body.style.overflow = '';
          }
        });
      }
    });
  });

  // ============================================
  // ANIMATE STATS COUNTER
  // ============================================
  const statNumbers = document.querySelectorAll('.stat-number');

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const finalValue = parseInt(target.getAttribute('data-count'));
        animateCounter(target, finalValue);
        statsObserver.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(stat => statsObserver.observe(stat));

  function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target + '+';
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current) + '+';
      }
    }, 30);
  }

  // ============================================
  // NAVBAR BACKGROUND ON SCROLL (Mobile)
  // ============================================
  const mobileNavbar = document.querySelector('.mobile-navbar');

  if (mobileNavbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        mobileNavbar.style.background = 'rgba(26, 26, 26, 0.98)';
        mobileNavbar.style.backdropFilter = 'blur(10px)';
      } else {
        mobileNavbar.style.background = 'linear-gradient(135deg, #2C2C2C 0%, #1a1a1a 100%)';
        mobileNavbar.style.backdropFilter = 'none';
      }
    });
  }

  // ============================================
  // LOADING ANIMATION
  // ============================================
  const loader = document.querySelector('.page-loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
          loader.style.display = 'none';
        }, 500);
      }, 800);
    });
  }
});

// ============================================
// CSS ANIMATION KEYFRAMES (injected via JS)
// ============================================
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }

  .lightbox-overlay {
    animation: fadeIn 0.3s ease !important;
  }
`;
document.head.appendChild(styleSheet);
