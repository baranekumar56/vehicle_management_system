function loadComponent(id, filepath, callback) {
  fetch(filepath)
    .then((response) => response.text())
    .then((data) => {
      document.getElementById(id).innerHTML = data;
      if (callback) callback(); // run callback after load
    })
    .catch((error) => console.error("Error loading component:", error));
}

loadComponent("admin-sidebar", "/components/admin-sidebar.html", initSidebar);
loadComponent("nav-bar", "/components/navbar.html", initSidebar);

function initSidebar() {
  const menuBtn = document.getElementById("menu-btn");
  const sidebar = document.getElementById("sidebar");
  let sidebar_flag = true;
  sidebar.style.transition = `all 0.3s ease-in`;
  if (menuBtn && sidebar) {
    menuBtn.addEventListener("click", () => {
      if (sidebar_flag) {
        sidebar.style.right = '0px';
      }
      else {
        sidebar.style.right = '-300px';

      }
      sidebar_flag = !sidebar_flag;
      console.log("Sidebar toggled");
    });
  }
}