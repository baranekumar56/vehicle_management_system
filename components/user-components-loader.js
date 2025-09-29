document.addEventListener('DOMContentLoaded', async () => {
  async function injectComponent(file, rootId) {
    const res = await fetch(file);
    const html = await res.text();
    document.getElementById(rootId).innerHTML = html;
  }

  await Promise.all([
    injectComponent('../../../components/user-side-bar.html', 'sidebar-root'),
    injectComponent('../../../components/user-nav-bar.html', 'navbar-root'),
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
//   const sidebarServiceBtn = document.querySelector('.sidebar-service-btn');
//   const sidebarServiceSubmenu = document.getElementById('sidebar-service-submenu');

  sidebarUserBtn?.addEventListener('click', () => {
    const isHidden = sidebarUserSubmenu.classList.contains('hidden');
    // Close Service Management if open
    if (isHidden) {
        sidebarUserSubmenu.classList.remove('hidden');
    }
    else {
        sidebarUserSubmenu.classList.add('hidden')
    }
  });

//   sidebarServiceBtn?.addEventListener('click', () => {
//     const isHidden = sidebarServiceSubmenu.classList.contains('hidden');
//     // Close User Management if open
//     sidebarUserSubmenu.classList.add('hidden');
//     sidebarUserSubmenu.classList.remove('block');
//     sidebarUserBtn.setAttribute('aria-expanded', 'false');
//     if (isHidden) {
//       sidebarServiceSubmenu.classList.remove('hidden');
//       sidebarServiceSubmenu.classList.add('block');
//       sidebarServiceBtn.setAttribute('aria-expanded', 'true');
//     } else {
//       sidebarServiceSubmenu.classList.add('hidden');
//       sidebarServiceSubmenu.classList.remove('block');
//       sidebarServiceBtn.setAttribute('aria-expanded', 'false');
//     }
//   });

  // MOBILE: User and Service Management - Mutually Exclusive
  const mobileUserBtn = document.querySelector('.mobile-user-btn');
  const mobileUserSubmenu = document.getElementById('mobile-user-submenu');
//   const mobileServiceBtn = document.querySelector('.mobile-service-btn');
//   const mobileServiceSubmenu = document.getElementById('mobile-service-submenu');

  mobileUserBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isHidden = mobileUserSubmenu.classList.contains('hidden');
    // Close Service Management if open
    
    if (isHidden) {
        mobileUserSubmenu.classList.remove('hidden');
    }else {
        mobileUserSubmenu.classList.add('hidden');
    }

  });

//   mobileServiceBtn?.addEventListener('click', () => {
//     const isHidden = mobileServiceSubmenu.classList.contains('hidden');
//     // Close User Management if open
//     mobileUserSubmenu.classList.add('hidden');
//     mobileUserSubmenu.classList.remove('block');
//     mobileUserBtn.setAttribute('aria-expanded', 'false');
//     if (isHidden) {
//       mobileServiceSubmenu.classList.remove('hidden');
//       mobileServiceSubmenu.classList.add('block');
//       mobileServiceBtn.setAttribute('aria-expanded', 'true');
//     } else {
//       mobileServiceSubmenu.classList.add('hidden');
//       mobileServiceSubmenu.classList.remove('block');
//       mobileServiceBtn.setAttribute('aria-expanded', 'false');
//     }
//   });

});


document.addEventListener('navbarLoaded', () => {


	// so when this gets executed we automatically highlight the current section which the user is currently at
	const current_page = localStorage.getItem('vms_current_page');

	// every page is mostly single except services and users , so i need to look on to that

	// lets check each element in the side bar with the value we got for current_page

	// lets get all anchor tag with data value
	const user_sidebar = document.getElementById('user_sidebar');
  console.log(user_sidebar)

	navBarHighlight(document.getElementById('user_navbar'), current_page);
	sideBarHighlight(user_sidebar, current_page)

})


function sideBarHighlight(admin_sidebar, current_page) {
	let links = {};

	document.getElementById('user_sidebar').querySelectorAll('a').forEach(link => {
		links[link.dataset.value] = link;
	})


	console.log(links);



	links[current_page].classList.add('bg-blue-700');
}
function navBarHighlight(nav_bar, current_page) {
	console.log("up here")
	let links = {}
	nav_bar.querySelector('aside').querySelectorAll('a').forEach(link => {
		links[link.dataset.value] = link;
	})

	
console.log(current_page)
	links[current_page].classList.add('bg-blue-700');
}