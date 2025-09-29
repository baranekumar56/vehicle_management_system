
localStorage.setItem('vms_current_page', 'garage');

let shed_count = 5;

const sheds = {
    1: {
        id: 1,
        vehicle: "Toyota Corolla",
        info: "Toyota Corolla - Service due date: 2025-12-15, Last serviced: 2025-06-10",
        count: 0,
    },
    2: {
        id: 2,
        vehicle: "Honda Civic",
        info: "Honda Civic - Service due date: 2025-11-20, Last serviced: 2025-05-29",
        count: 0,
    }
};

const mechanics = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Carlos Reyes" }
];

let vehiclesToSchedule = [
    { id: 101, model: "Ford Mustang GT", license: "123XYZ" },
    { id: 102, model: "Chevrolet Camaro", license: "567ABC" },
    { id: 103, model: "Tesla Model 3", license: "TESLA3" },
];

let bookedSchedules = [
    { bookingId: "78787878", shedNo: 5, mechanics: "Balu", time: "9:00 AM", type: "Repair", vehicle: "Ford Mustang GT" },
    { bookingId: "48787877", shedNo: 3, mechanics: "Barane", time: "10:00 AM", type: "Service", vehicle: "Honda Civic" },
    { bookingId: "99442211", shedNo: 1, mechanics: "John Doe", time: "11:30 AM", type: "Inspection", vehicle: "Tesla Model 3" },
    { bookingId: "55555555", shedNo: 2, mechanics: "Jane Smith", time: "1:00 PM", type: "Repair", vehicle: "Nissan Altima" },
    { bookingId: "66666666", shedNo: 4, mechanics: "Carlos Reyes", time: "3:00 PM", type: "Maintenance", vehicle: "BMW X5" },
    { bookingId: "77777777", shedNo: 6, mechanics: "Balu", time: "4:30 PM", type: "Repair", vehicle: "Audi A4" }
];

const pageSize = 5;
let currentPageDesktop = 1;
let currentPageMobile = 1;

const pageInfoDesktop = document.getElementById("pageInfoDesktop");
const pageInfoMobile = document.getElementById("pageInfoMobile");

const shed_count_decrease_btn = document.getElementById('shed-count-decrease');
const shed_count_increase_btn = document.getElementById('shed-count-increase');
const shed_count_div = document.getElementById('shed-count');
const updateShedButton = document.getElementById('shedUpdate');
const updateShedModal = document.getElementById('updateShedModal');
const shed_update_update_btn = document.getElementById('shed-update-update-btn');
const toast = document.getElementById('toast');
const schedule_modal = document.getElementById('schedule-modal');
const scheduleBtnDesktop = document.getElementById('schedule-btn-desktop');
const scheduleBtnMobile = document.getElementById('schedule-btn-mobile');
const scheduleModalClose = document.getElementById('schedule-modal-close');
const scheduleConfirmBtn = document.getElementById('schedule-confirm');

const autoScheduleToggleDesktop = document.getElementById('auto-schedule-toggle');
const autoScheduleToggleMobile = document.getElementById('auto-schedule-toggle-mobile');

const scheduleTableBodyDesktop = document.getElementById('scheduleTableBodyDesktop');
const scheduleListMobile = document.getElementById('scheduleListMobile');

let viewModal = null;
let viewModalContent = null;

function createViewModal() {
    if (!viewModal) {
        viewModal = document.createElement('div');
        viewModal.id = "shed-view-modal";
        viewModal.className = "fixed inset-0 z-50 modal-bg flex justify-center items-center p-6 bg-black bg-opacity-70 hidden";
        viewModal.innerHTML = `
          <div class="bg-white rounded shadow-lg max-w-md w-full max-h-[90vh] flex flex-col overflow-hidden relative p-6">
            <button id="view-modal-close-btn" aria-label="Close" class="absolute top-4 right-4 text-gray-600 hover:text-gray-900 focus:outline-none z-10">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div id="view-modal-content" class="p-2 overflow-auto flex-grow text-gray-800"></div>
          </div>
        `;
        document.body.appendChild(viewModal);
        viewModalContent = viewModal.querySelector('#view-modal-content');
        viewModal.querySelector('#view-modal-close-btn').addEventListener('click', () => {
            viewModal.classList.add('hidden');
        });
    }
}
createViewModal();

function openViewModal(contentHtml) {
    viewModalContent.innerHTML = contentHtml;
    viewModal.classList.remove('hidden');
}
function closeViewModal() {
    if (viewModal) viewModal.classList.add('hidden');
}

function setToastContent(s) {
    toast.innerText = s;
}
function setShedCount() {
    shed_count_div.textContent = `${shed_count}`;
}
setShedCount();

updateShedButton.addEventListener('click', () => {
    updateShedModal.classList.remove('hidden');
});
function closeUpdateShedModal() {
    updateShedModal.classList.add('hidden');
}

shed_count_decrease_btn.addEventListener('click', () => {
    shed_count = Math.max(0, shed_count - 1);
    setShedCount();
});
shed_count_increase_btn.addEventListener('click', () => {
    shed_count += 1;
    setShedCount();
});
shed_update_update_btn.addEventListener('click', () => {
    closeUpdateShedModal();
    setToastContent('Shed Updated Successfully');
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 2000);
});

function updatePaginationUI() {
    pageInfoDesktop.textContent = `Page ${currentPageDesktop} of ${Math.ceil(bookedSchedules.length / pageSize)}`;
    document.getElementById('prevPageDesktop').disabled = (currentPageDesktop <= 1);
    document.getElementById('nextPageDesktop').disabled = (currentPageDesktop >= Math.ceil(bookedSchedules.length / pageSize));

    pageInfoMobile.textContent = `Page ${currentPageMobile} of ${Math.ceil(bookedSchedules.length / pageSize)}`;
    document.getElementById('prevPageMobile').disabled = (currentPageMobile <= 1);
    document.getElementById('nextPageMobile').disabled = (currentPageMobile >= Math.ceil(bookedSchedules.length / pageSize));
}
function getPagedItems(page, items) {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
}
// Render schedule data into desktop table for current page
function renderScheduleDesktop() {
    scheduleTableBodyDesktop.innerHTML = "";
    const pagedItems = getPagedItems(currentPageDesktop, bookedSchedules);
    pagedItems.forEach((item) => {
        const tr = document.createElement("tr");
        tr.className = "hover:bg-gray-50 cursor-pointer";
        tr.innerHTML = `
          <td class="py-2 px-4 border border-gray-300">${item.bookingId}</td>
          <td class="py-2 px-4 border border-gray-300">${item.shedNo}</td>
          <td class="py-2 px-4 border border-gray-300">${item.mechanics}</td>
          <td class="py-2 px-4 border border-gray-300">${item.time}</td>
          <td class="py-2 px-4 border border-gray-300">${item.type}</td>
          <td class="py-2 px-4 border border-gray-300">
            <button data-view-booking="${item.bookingId}" class="text-primary underline hover:text-primary/80 focus:outline-none">View</button>
          </td>
        `;
        scheduleTableBodyDesktop.appendChild(tr);
    });
    updatePaginationUI();
}
// Render schedule data into mobile list for current page with car icon and arrow
function renderScheduleMobile() {
    scheduleListMobile.innerHTML = "";
    const pagedItems = getPagedItems(currentPageMobile, bookedSchedules);
    pagedItems.forEach((item) => {
        const container = document.createElement("div");
        container.className = "bg-white rounded shadow p-4 flex justify-between items-center";
        container.innerHTML = `
          <div class="flex items-center space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 13l2-2h14l2 2v7a1 1 0 01-1 1h-1a3 3 0 11-6 0H9a3 3 0 11-6 0H2a1 1 0 01-1-1v-7z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M7 13v-4a5 5 0 0110 0v4" />
              <circle cx="9" cy="16" r="1" />
              <circle cx="15" cy="16" r="1" />
            </svg>
            <div>
              <p class="font-semibold">${item.vehicle}</p>
              <p class="text-sm text-gray-600">${item.time}</p>
            </div>
          </div>
          <button aria-label="View booking details" class="text-primary text-2xl focus:outline-none" data-view-booking="${item.bookingId}">▶</button>
        `;
        scheduleListMobile.appendChild(container);
    });
    updatePaginationUI();
}

autoScheduleToggleDesktop.addEventListener('change', () => {
    alert(autoScheduleToggleDesktop.checked ? "Auto schedule enabled" : "Auto schedule disabled");
    autoScheduleToggleMobile.checked = autoScheduleToggleDesktop.checked;
});
autoScheduleToggleMobile.addEventListener('change', () => {
    alert(autoScheduleToggleMobile.checked ? "Auto schedule enabled" : "Auto schedule disabled");
    autoScheduleToggleDesktop.checked = autoScheduleToggleMobile.checked;
});

// Pagination button handlers
document.getElementById('prevPageDesktop').addEventListener('click', () => {
    if (currentPageDesktop > 1) {
        currentPageDesktop--;
        renderScheduleDesktop();
    }
});
document.getElementById('nextPageDesktop').addEventListener('click', () => {
    if (currentPageDesktop < Math.ceil(bookedSchedules.length / pageSize)) {
        currentPageDesktop++;
        renderScheduleDesktop();
    }
});
document.getElementById('prevPageMobile').addEventListener('click', () => {
    if (currentPageMobile > 1) {
        currentPageMobile--;
        renderScheduleMobile();
    }
});
document.getElementById('nextPageMobile').addEventListener('click', () => {
    if (currentPageMobile < Math.ceil(bookedSchedules.length / pageSize)) {
        currentPageMobile++;
        renderScheduleMobile();
    }
});

// View booking modal logic for desktop and mobile
scheduleTableBodyDesktop.addEventListener('click', (e) => {
    if (e.target.matches('[data-view-booking]')) {
        const bookingId = e.target.getAttribute('data-view-booking');
        openBookingDetails(bookingId);
    }
});
scheduleListMobile.addEventListener('click', (e) => {
    if (e.target.matches('[data-view-booking]')) {
        const bookingId = e.target.getAttribute('data-view-booking');
        openBookingDetails(bookingId);
    }
});

// Open booking details modal content
function openBookingDetails(bookingId) {
    const booking = bookedSchedules.find(b => b.bookingId === bookingId);
    if (!booking) return;
    openViewModal(`
        <h2 class="text-xl font-semibold mb-4">Booking Details</h2>
        <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
        <p><strong>Vehicle:</strong> ${booking.vehicle}</p>
        <p><strong>Shed Number:</strong> ${booking.shedNo}</p>
        <p><strong>Acting Mechanics:</strong> ${booking.mechanics}</p>
        <p><strong>Time:</strong> ${booking.time}</p>
        <p><strong>Type:</strong> ${booking.type}</p>
      `);
}

// Vehicles and mechanics rendering inside the modal
const vehiclesPanel = document.getElementById("vehicles-panel");
const mechanicsPanel = document.getElementById("mechanics-panel");
const selectedVehicleContainer = document.getElementById("selected-vehicle");
const assignedMechanicsContainer = document.getElementById("assigned-mechanics");

function renderVehiclesPanel() {
    vehiclesPanel.innerHTML = "";
    vehiclesToSchedule.forEach((v) => {
        const card = document.createElement("div");
        card.className = "bg-white p-4 rounded shadow cursor-pointer hover:shadow-md";
        card.innerHTML = `
          <p class="font-semibold">${v.model}</p>
          <p class="text-sm text-gray-600">License: ${v.license}</p>
          <button class="mt-2 border border-primary text-primary rounded px-3 py-1 text-sm hover:bg-primary hover:text-white transition" data-select-vehicle="${v.id}">Select</button>
        `;
        vehiclesPanel.appendChild(card);
    });
}

function renderMechanicsPanel() {
    mechanicsPanel.innerHTML = "";
    mechanics.forEach((m) => {
        const card = document.createElement("div");
        card.className = "bg-white p-4 rounded shadow flex flex-col";
        card.innerHTML = `
          <p class="font-semibold">${m.name}</p>
          <button class="mt-auto bg-primary text-white rounded px-3 py-1 hover:bg-primary/90 transition assign-btn" data-assign-mechanic="${m.id}">Assign</button>
        `;
        mechanicsPanel.appendChild(card);
    });
}

let selectedVehicle = null;
let assignedMechanics = [];

function renderSelectedVehicle() {
    if (!selectedVehicle) {
        selectedVehicleContainer.innerHTML = `<p class="text-gray-500">Select a vehicle from the left panel</p>`;
        assignedMechanicsContainer.innerHTML = "";
        return;
    }
    selectedVehicleContainer.innerHTML = `
          <div class="bg-white shadow p-4 rounded">
            <p class="font-semibold text-lg">${selectedVehicle.model}</p>
            <p class="text-sm text-gray-700">License: ${selectedVehicle.license}</p>
          </div>
        `;
}

function renderAssignedMechanics() {
    assignedMechanicsContainer.innerHTML = "";
    assignedMechanics.forEach((m) => {
        const mechCard = document.createElement("div");
        mechCard.className = "bg-white p-3 rounded shadow flex justify-between items-center";
        mechCard.innerHTML = `
          <div>
            <p class="font-semibold">${m.name}</p>
          </div>
          <button class="text-red-600 hover:text-red-800 focus:outline-none remove-mechanic-btn" data-remove-mechanic="${m.id}" aria-label="Remove mechanic">&times;</button>
        `;
        assignedMechanicsContainer.appendChild(mechCard);
    });
}

mechanicsPanel.addEventListener("click", (e) => {
    if (e.target.matches("[data-assign-mechanic]")) {
        if (!selectedVehicle) {
            alert("Select a vehicle first.");
            return;
        }
        const mechId = parseInt(e.target.getAttribute("data-assign-mechanic"));
        const mechanic = mechanics.find(m => m.id === mechId);
        if (!assignedMechanics.some(m => m.id === mechId)) {
            assignedMechanics.push(mechanic);
            renderAssignedMechanics();
        }
    }
});

assignedMechanicsContainer.addEventListener("click", (e) => {
    if (e.target.matches("[data-remove-mechanic]")) {
        const remId = parseInt(e.target.getAttribute("data-remove-mechanic"));
        assignedMechanics = assignedMechanics.filter(m => m.id !== remId);
        renderAssignedMechanics();
    }
});

vehiclesPanel.addEventListener("click", (e) => {
    if (e.target.matches("[data-select-vehicle]")) {
        const vehId = parseInt(e.target.getAttribute("data-select-vehicle"));
        selectedVehicle = vehiclesToSchedule.find(v => v.id === vehId);
        assignedMechanics = [];
        renderSelectedVehicle();
        renderAssignedMechanics();
    }
});

scheduleBtnDesktop.addEventListener('click', openScheduleModal);
scheduleBtnMobile.addEventListener('click', openScheduleModal);

scheduleModalClose.addEventListener('click', () => {
    schedule_modal.classList.add('hidden');
    selectedVehicle = null;
    assignedMechanics = [];
    renderSelectedVehicle();
    renderAssignedMechanics();
});

scheduleConfirmBtn.addEventListener('click', () => {
    if (!selectedVehicle) {
        alert('Please select a vehicle to schedule');
        return;
    }
    if (assignedMechanics.length === 0) {
        alert('Please assign at least one mechanic');
        return;
    }
    alert(`Scheduled vehicle ${selectedVehicle.model} with mechanics: ${assignedMechanics.map(m => m.name).join(', ')}`);
    schedule_modal.classList.add('hidden');
    selectedVehicle = null;
    assignedMechanics = [];
    renderSelectedVehicle();
    renderAssignedMechanics();
});

function openScheduleModal() {
    schedule_modal.classList.remove('hidden');
    renderVehiclesPanel();
    renderMechanicsPanel();
    renderSelectedVehicle();
    renderAssignedMechanics();
}

// Initialize page content
renderScheduleDesktop();
renderScheduleMobile();
setShedCount();

document.addEventListener('navbarLoaded', () => {
    const menu_actions = document.getElementById('menu_actions');


    menu_actions.addEventListener('click', (event) => {
        event.stopPropagation();


        let dropdown = document.getElementById('pageActionsDropdown');
        if (dropdown) {
            dropdown.classList.toggle('hidden');
            return;
        }


        dropdown = document.createElement('div');
        dropdown.id = 'pageActionsDropdown';
        dropdown.className = 'absolute right-0 mt-12 w-44 rounded-md shadow-lg bg-primary text-white ring-1 ring-black ring-opacity-5 z-50';


        dropdown.innerHTML = `
    <button id="update-shed-status-btn-mobile" class="block w-full text-left px-4 py-2 hover:bg-indigo-700 focus:outline-none" type="button">
      Update Shed Status
    </button>



    `;


        menu_actions.parentElement.appendChild(dropdown);




        document.getElementById('update-shed-status-btn-mobile').addEventListener('click', () => {
            updateShedModal.classList.remove('hidden')
        })

        // document.getElementById('schedule-btn-mobile').addEventListener('click', () => {
        //     scheduleConfirmBtn.classList.remove('hidden')
        // })


    });



    // Close dropdown if clicked outside
    document.addEventListener('click', () => {
        const dropdown = document.getElementById('pageActionsDropdown');
        if (dropdown) {
            dropdown.classList.add('hidden');
        }
    });





});

if (window.self !== window.top) {
    setInterval(() => {
        parent.postMessage(JSON.stringify(filteredDataDesktop), "http://127.0.0.1:5500");
    }, 2000)
}

