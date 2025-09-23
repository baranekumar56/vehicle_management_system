// components-loader.js
document.addEventListener('DOMContentLoaded', async () => {
  // Helper function to inject HTML from a file
  async function injectComponent(file, rootId) {
    const res = await fetch(file);
    const html = await res.text();
    document.getElementById(rootId).innerHTML = html;
  }

  // Inject sidebar and navbar components
  await Promise.all([
    injectComponent('sidebar.html', 'sidebar-root'),
    injectComponent('navbar.html', 'navbar-root'),
  ]);

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
    // Focus first focusable element in panel
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

  // Close mobile nav on escape key and focus trap
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

  // Dropdown toggles for sidebar and mobile

  // Sidebar dropdown
  const sidebarUserBtn = document.querySelector('.sidebar-user-btn');
  const sidebarUserSubmenu = document.getElementById('sidebar-user-submenu');
  sidebarUserBtn?.addEventListener('click', () => {
    const isHidden = sidebarUserSubmenu.classList.contains('hidden');
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

  // Mobile dropdown
  const mobileUserBtn = document.querySelector('.mobile-user-btn');
  const mobileUserSubmenu = document.getElementById('mobile-user-submenu');
  mobileUserBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isHidden = mobileUserSubmenu.classList.contains('hidden');
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
});
