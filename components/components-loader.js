document.addEventListener('DOMContentLoaded', async () => {
  async function injectComponent(file, rootId) {
    const res = await fetch(file);
    const html = await res.text();
    document.getElementById(rootId).innerHTML = html;
  }

  await Promise.all([
    injectComponent('../../../components/sidebar.html', 'sidebar-root'),
    injectComponent('../../../components/navbar.html', 'navbar-root'),
  ]);

  document.dispatchEvent(new CustomEvent('navbarLoaded'));

  // Mobile nav logic
  const hamburger = document.querySelector('.mobile-navbar__hamburger');
  const mobilePanel = document.querySelector('.mobile-nav-panel');
  const overlay = document.querySelector('.mobile-nav-overlay');
  let lastFocusedElement = null;

  function openMobileNav() {
    mobilePanel.classList.add('translate-x-0');
    mobilePanel.classList.remove('translate-x-full');
    overlay.classList.add('opacity-100', 'pointer-events-auto');
    overlay.classList.remove('opacity-0', 'pointer-events-none');
    mobilePanel.setAttribute('aria-hidden', 'false');
    overlay.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    lastFocusedElement = document.activeElement;
    const firstFocusable = mobilePanel.querySelector(
      'button,a,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'
    );
    if (firstFocusable) firstFocusable.focus();
    document.body.classList.add('overflow-hidden');
  }

  function closeMobileNav() {
    mobilePanel.classList.remove('translate-x-0');
    mobilePanel.classList.add('translate-x-full');
    overlay.classList.remove('opacity-100', 'pointer-events-auto');
    overlay.classList.add('opacity-0', 'pointer-events-none');
    mobilePanel.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    if (lastFocusedElement) lastFocusedElement.focus();
    document.body.classList.remove('overflow-hidden');
  }

  hamburger?.addEventListener('click', () => {
    if (mobilePanel.classList.contains('translate-x-0')) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  });

  overlay?.addEventListener('click', closeMobileNav);

  document.addEventListener('keydown', (e) => {
    if (mobilePanel.classList.contains('translate-x-0') && e.key === 'Escape') {
      closeMobileNav();
    }
    if (mobilePanel.classList.contains('translate-x-0') && e.key === 'Tab') {
      const focusables = mobilePanel.querySelectorAll(
        'button,a,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'
      );
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        last.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
  });

  // SIDEBAR: User and Service Management - Mutually Exclusive
  const sidebarUserBtn = document.querySelector('.sidebar-user-btn');
  const sidebarUserSubmenu = document.getElementById('sidebar-user-submenu');
  const sidebarServiceBtn = document.querySelector('.sidebar-service-btn');
  const sidebarServiceSubmenu = document.getElementById('sidebar-service-submenu');

  sidebarUserBtn?.addEventListener('click', () => {
    const isHidden = sidebarUserSubmenu.classList.contains('hidden');
    // Close Service Management if open
    sidebarServiceSubmenu.classList.add('hidden');
    sidebarServiceSubmenu.classList.remove('block');
    sidebarServiceBtn.setAttribute('aria-expanded', 'false');
    if (isHidden) {
      sidebarUserSubmenu.classList.remove('hidden');
      sidebarUserSubmenu.classList.add('block');
      sidebarUserBtn.setAttribute('aria-expanded', 'true');
    } else {
      sidebarUserSubmenu.classList.add('hidden');
      sidebarUserSubmenu.classList.remove('block');
      sidebarUserBtn.setAttribute('aria-expanded', 'false');
    }
  });

  sidebarServiceBtn?.addEventListener('click', () => {
    const isHidden = sidebarServiceSubmenu.classList.contains('hidden');
    // Close User Management if open
    sidebarUserSubmenu.classList.add('hidden');
    sidebarUserSubmenu.classList.remove('block');
    sidebarUserBtn.setAttribute('aria-expanded', 'false');
    if (isHidden) {
      sidebarServiceSubmenu.classList.remove('hidden');
      sidebarServiceSubmenu.classList.add('block');
      sidebarServiceBtn.setAttribute('aria-expanded', 'true');
    } else {
      sidebarServiceSubmenu.classList.add('hidden');
      sidebarServiceSubmenu.classList.remove('block');
      sidebarServiceBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // MOBILE: User and Service Management - Mutually Exclusive
  const mobileUserBtn = document.querySelector('.mobile-user-btn');
  const mobileUserSubmenu = document.getElementById('mobile-user-submenu');
  const mobileServiceBtn = document.querySelector('.mobile-service-btn');
  const mobileServiceSubmenu = document.getElementById('mobile-service-submenu');

  mobileUserBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isHidden = mobileUserSubmenu.classList.contains('hidden');
    // Close Service Management if open
    mobileServiceSubmenu.classList.add('hidden');
    mobileServiceSubmenu.classList.remove('block');
    mobileServiceBtn.setAttribute('aria-expanded', 'false');
    if (isHidden) {
      mobileUserSubmenu.classList.remove('hidden');
      mobileUserSubmenu.classList.add('block');
      mobileUserBtn.setAttribute('aria-expanded', 'true');
    } else {
      mobileUserSubmenu.classList.add('hidden');
      mobileUserSubmenu.classList.remove('block');
      mobileUserBtn.setAttribute('aria-expanded', 'false');
    }
  });

  mobileServiceBtn?.addEventListener('click', () => {
    const isHidden = mobileServiceSubmenu.classList.contains('hidden');
    // Close User Management if open
    mobileUserSubmenu.classList.add('hidden');
    mobileUserSubmenu.classList.remove('block');
    mobileUserBtn.setAttribute('aria-expanded', 'false');
    if (isHidden) {
      mobileServiceSubmenu.classList.remove('hidden');
      mobileServiceSubmenu.classList.add('block');
      mobileServiceBtn.setAttribute('aria-expanded', 'true');
    } else {
      mobileServiceSubmenu.classList.add('hidden');
      mobileServiceSubmenu.classList.remove('block');
      mobileServiceBtn.setAttribute('aria-expanded', 'false');
    }
  });

});
