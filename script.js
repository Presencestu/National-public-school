(function () {
  var header = document.getElementById('siteHeader');
  var navToggle = document.getElementById('navToggle');
  var mobileNav = document.getElementById('mobileNav');
  var yearEl = document.getElementById('year');
  var form = document.getElementById('enquiryForm');
  var formStatus = document.getElementById('formStatus');
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  function updateHeaderState() {
    if (!header) return;
    if (window.scrollY > 24) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });

  function closeMobileNav() {
    if (!mobileNav || !navToggle) return;
    mobileNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('nav-open');
  }

  function openMobileNav() {
    if (!mobileNav || !navToggle) return;
    mobileNav.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Close menu');
    document.body.classList.add('nav-open');
  }

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = mobileNav.classList.contains('is-open');
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMobileNav);
    });

    window.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeMobileNav();
      }
    });
  }

  function prepareInkLines(scope) {
    var paths = scope.querySelectorAll('.ink-line');
    paths.forEach(function (path) {
      try {
        var length = path.getTotalLength();
        if (!length || isNaN(length)) return;
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
      } catch (err) {
        return;
      }
    });
    scope.classList.add('ink-ready');
  }

  var drawScopes = document.querySelectorAll('[data-draw]');
  if (prefersReducedMotion) {
    drawScopes.forEach(function (el) {
      el.classList.add('is-drawn');
    });
  } else {
    drawScopes.forEach(function (el) {
      prepareInkLines(el);
    });
  }

  var heroArch = document.getElementById('heroArch');
  if (heroArch) {
    window.setTimeout(function () {
      heroArch.classList.add('is-drawn');
    }, 350);
  }

  var revealTargets = document.querySelectorAll('.reveal');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach(function (el) {
      el.classList.add('is-visible');
      if (el.hasAttribute('data-draw')) {
        el.classList.add('is-drawn');
      }
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var delay = Number(entry.target.dataset.delay || 0);
            setTimeout(function () {
              entry.target.classList.add('is-visible');
              if (entry.target.hasAttribute('data-draw')) {
                entry.target.classList.add('is-drawn');
              }
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -40px 0px' }
    );

    revealTargets.forEach(function (el) {
      if (el !== heroArch) {
        observer.observe(el);
      }
    });
  }

if (form && formStatus) {
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var name = form.querySelector('#parentName').value.trim();
    var phone = form.querySelector('#parentPhone').value.trim();
    var admissionClass = form.querySelector('#admissionClass').value.trim();
    var message = form.querySelector('#enquiryMessage').value.trim();

    if (!name || !phone) {
      formStatus.textContent =
        'Please share your name and phone number so we can reach you.';
      return;
    }

    var whatsappMessage =
      'NEW ADMISSION ENQUIRY\n\n' +
      'Parent Name: ' + name + '\n' +
      'Phone: ' + phone + '\n' +
      'Class Applying For: ' +
      (admissionClass || 'Not specified') + '\n' +
      'Message: ' +
      (message || 'No message');

    var whatsappUrl =
      'https://wa.me/916207350490?text=' +
      encodeURIComponent(whatsappMessage);

    formStatus.textContent = 'Opening WhatsApp…';

    window.open(whatsappUrl, '_blank');
  });
}
})();
