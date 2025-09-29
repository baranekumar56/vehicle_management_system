 localStorage.setItem('vms_current_page', 'dashboard')
    // Example notifications and appointments. In practice, fetch these from your API
    const notifications = [
      {id: 1, title: "Appointment Confirmed", body: "Your service for Suzuki Zicker on 25/9/2025 is confirmed.", read: false},
      {id: 2, title: "Service Reminder", body: "Don’t forget your Benz A2 service on 31/9/2025.", read: false},
      {id: 3, title: "Thank You!", body: "Your Tata Safari service completed successfully.", read: true}
    ];
    const appointments = [
      {bookingId: "34242424", date: "25/9/2025", time: "9:00 AM", brand: "Suzuki", model: "Zicker", fuel: "Petrol"},
      {bookingId: "878845445", date: "31/9/2025", time: "3:00 PM", brand: "Benz", model: "A2", fuel: "Diesel"}
    ];

    // Responsive logic
    function handleResponsive() {
      const desktop = document.getElementById("desktop-appointments");
      const mobile = document.getElementById("mobile-appointments");
      if (window.innerWidth < 640) {
        desktop.classList.add("hidden");
        mobile.classList.remove("hidden");
      } else {
        desktop.classList.remove("hidden");
        mobile.classList.add("hidden");
      }
    }

    // Notification panel logic
    const notifPanel = document.getElementById('notification-panel');
    const bellBtn = document.getElementById('bell-btn');
    const notifDot = document.getElementById('notif-dot');
    const notifList = document.getElementById('notification-list');
    const closeNotifPanel = document.getElementById('close-notif-panel');

    function renderNotifications() {
      notifList.innerHTML = '';
      let unread = false;
      notifications.forEach((n, idx) => {
        if (!n.read) unread = true;
        const li = document.createElement("li");
        li.className = `p-3 rounded cursor-pointer mb-2 ${n.read ? "notification-read" : "notification-unread"}`;
        li.innerHTML = `<div class="font-semibold">${n.title}</div>
                        <div class="text-sm mt-1 ${n.read ? '' : 'hidden'}" id="notification-body-${idx}">${n.body}</div>`;
        li.addEventListener('click', () => {
          showNotificationDetails(idx);
        });
        notifList.appendChild(li);
      });
      notifDot.style.display = unread ? '' : 'none';
    }

    // Show notification details modal
    function showNotificationDetails(idx) {
      const modal = document.getElementById('notification-modal');
      const content = document.getElementById('notification-modal-content');
      const n = notifications[idx];
      n.read = true;
      content.innerHTML = `
        <h3 class="text-xl font-semibold mb-3 pr-8">${n.title}</h3>
        <div class="text-gray-700 mb-8">${n.body}</div>
      `;
      modal.classList.remove('hidden');
      renderNotifications();
    }
    document.getElementById('close-notification-modal').onclick = function() {
      document.getElementById('notification-modal').classList.add('hidden');
    };
    document.getElementById('notification-modal').onclick = function(e) {
      if (e.target === this) this.classList.add('hidden');
    };

    bellBtn.onclick = () => {
      notifPanel.classList.add('open', 'animate-slide-in');
      renderNotifications();
    };
    closeNotifPanel.onclick = () => {
      notifPanel.classList.remove('open', 'animate-slide-in');
    };
    window.onclick = (e) => {
      if (!notifPanel.contains(e.target) && !bellBtn.contains(e.target)) {
        notifPanel.classList.remove('open', 'animate-slide-in');
      }
    };

    // Appointments logic
    function renderAppointmentsDesktop() {
      const table = document.getElementById('appointments-table');
      table.innerHTML = '';
      appointments.forEach((a, idx) => {
        table.innerHTML += `<tr class="hover:bg-gray-50">
          <td class="py-2 px-4">${a.bookingId}</td>
          <td class="py-2 px-4">${a.date}</td>
          <td class="py-2 px-4">${a.time}</td>
          <td class="py-2 px-4">${a.brand}</td>
          <td class="py-2 px-4">${a.model}</td>
          <td class="py-2 px-4">${a.fuel}</td>
          <td class="py-2 px-4">
            <button class="text-blue-600 hover:underline" onclick="showAppointmentDetails(${idx})">View</button>
          </td>
        </tr>`;
      });
    }
    function renderAppointmentsMobile() {
      const list = document.getElementById('appointments-list');
      list.innerHTML = '';
      appointments.forEach((a, idx) => {
        list.innerHTML += `<div class="bg-white rounded-lg shadow border border-gray-200 p-4 flex justify-between items-center">
          <div>
            <div class="font-semibold text-gray-900">${a.brand} ${a.model}</div>
            <div class="text-sm text-gray-500 mb-2">Booking: ${a.bookingId}</div>
            <div class="text-sm text-gray-700">${a.date}, ${a.time}</div>
            <div class="text-xs text-gray-600 mt-2">Fuel: ${a.fuel}</div>
          </div>
          <button class="p-2 text-blue-600 hover:underline text-sm rounded-md" onclick="showAppointmentDetails(${idx})">Details</button>
        </div>`;
      });
    }

    // Appointment modal logic
    function showAppointmentDetails(idx) {
      const modal = document.getElementById('appointment-modal');
      const content = document.getElementById('appointment-modal-content');
      const a = appointments[idx];
      content.innerHTML = `
        <h3 class="text-xl font-semibold mb-6 pr-8">Appointment Details</h3>
        <div class="space-y-4">
          <div><span class="font-medium text-gray-700">Booking ID:</span> ${a.bookingId}</div>
          <div><span class="font-medium text-gray-700">Date:</span> ${a.date}</div>
          <div><span class="font-medium text-gray-700">Time:</span> ${a.time}</div>
          <div><span class="font-medium text-gray-700">Brand & Model:</span> ${a.brand} ${a.model}</div>
          <div><span class="font-medium text-gray-700">Fuel:</span> ${a.fuel}</div>
        </div>`;
      modal.classList.remove('hidden');
    }
    document.getElementById('close-appointment-modal').onclick = function() {
      document.getElementById('appointment-modal').classList.add('hidden');
    };
    document.getElementById('appointment-modal').onclick = function(e) {
      if (e.target === this) this.classList.add('hidden');
    };

    window.addEventListener('resize', handleResponsive);

    // Initial rendering
    handleResponsive();
    renderAppointmentsDesktop();
    renderAppointmentsMobile();
