localStorage.setItem('vms_current_page', 'services');

// Data and unified filtered list and selection
const services = [
    { id: "S001", name: "Oil Change", dateAdded: "2023-01-15", lastDeactivated: "", active: true },
    { id: "S002", name: "Tire Rotation", dateAdded: "2023-05-20", lastDeactivated: "", active: true },
    { id: "S003", name: "Battery Check", dateAdded: "2024-03-10", lastDeactivated: "2025-01-01", active: false },
    { id: "S004", name: "Brake Inspection", dateAdded: "2022-11-05", lastDeactivated: "", active: true }
];

let filteredServices = [...services];
let selected = [];

// Elements references
const tableBodyDesktop = document.getElementById("serviceTableBodyDesktop");
const selectAllDesktop = document.getElementById("selectAllDesktop");
const prevBtnDesktop = document.getElementById("prevPageDesktop");
const nextBtnDesktop = document.getElementById("nextPageDesktop");
const pageInfoDesktop = document.getElementById("pageInfoDesktop");
const searchInputDesktop = document.getElementById("searchInputDesktop");
const searchBtnDesktop = document.getElementById("searchBtnDesktop");
const batchActivateDesktop = document.getElementById("batchActivateDesktop");
const batchDeactivateDesktop = document.getElementById("batchDeactivateDesktop");

const serviceListMobile = document.getElementById("serviceListMobile");
const prevBtnMobile = document.getElementById("prevPageMobile");
const nextBtnMobile = document.getElementById("nextPageMobile");
const pageInfoMobile = document.getElementById("pageInfoMobile");
const searchInputMobile = document.getElementById("searchInputMobile");
const searchBtnMobile = document.getElementById("searchBtnMobile");
const batchActivateMobile = document.getElementById("batchActivateMobile");
const batchDeactivateMobile = document.getElementById("batchDeactivateMobile");
const selectAllFilteredData = document.getElementById("select-all-filtered-data");

const confirmModal = document.getElementById("confirmModal");
const confirmText = document.getElementById("confirmText");
let confirmYes = document.getElementById("confirmYes");
let confirmNo = document.getElementById("confirmNo");

const add_service_button = document.getElementById("add-service");
const service_add_modal = document.getElementById("add-service-modal");
const toastDesktop = document.getElementById("toastDesktop");

let currentPageDesktop = 1;
const rowsPerPageDesktop = 5;
let currentPageMobile = 1;
const rowsPerPageMobile = 5;

// --- RENDER functions unified ---
function render() {
    renderTableDesktop();
    renderMobileListPaginated();
    updateBatchButtons();
    updatePaginationDesktop();
    updatePaginationMobile();
    updateSelectAllCheckboxes();
}

function renderTableDesktop() {
    const start = (currentPageDesktop - 1) * rowsPerPageDesktop;
    const end = start + rowsPerPageDesktop;
    const pageData = filteredServices.slice(start, end);

    let allChecked = pageData.length > 0 && pageData.every((_, idx) => selected.includes(start + idx));
    selectAllDesktop.checked = allChecked;

    tableBodyDesktop.innerHTML = "";
    pageData.forEach((s, idx) => {
        const globalIdx = start + idx;
        const checked = selected.includes(globalIdx) ? "checked" : "";
        tableBodyDesktop.innerHTML += `
          <tr class="hover:bg-gray-50">
            <td class="py-2 px-3 border border-gray-300 text-center">
              <input type="checkbox" class="selectServiceDesktop" data-index="${globalIdx}" ${checked} />
            </td>
            <td class="py-2 px-4 border border-gray-300">${s.name}</td>
            <td class="py-2 px-4 border border-gray-300">${s.dateAdded}</td>
            <td class="py-2 px-4 border border-gray-300">${s.lastDeactivated || "-"}</td>
            <td class="py-2 px-4 border border-gray-300">
              <button class="toggleStateBtnDesktop text-blue-600 hover:underline" data-index="${globalIdx}">
                ${s.active ? "Deactivate" : "Activate"}
              </button>
            </td>
          </tr>
        `;
    });
    attachDesktopEvents();
}

function renderMobileListPaginated() {
    const start = (currentPageMobile - 1) * rowsPerPageMobile;
    const end = start + rowsPerPageMobile;
    const pageData = filteredServices.slice(start, end);

    serviceListMobile.innerHTML = "";
    pageData.forEach((s, idx) => {
        const globalIdx = start + idx;
        const checked = selected.includes(globalIdx) ? "checked" : "";
        serviceListMobile.innerHTML += `
          <div class="border-b border-gray-300 py-3 px-4 flex flex-col space-y-1">
            <div class="flex items-center mb-1">
              <input type="checkbox" class="selectServiceMobile mr-1" data-index="${globalIdx}" ${checked} />
              <div class="flex-1 ml-1.5">
                <span class="font-semibold">${s.name}</span><br>
              </div>
              <button class="toggleStateBtnMobile text-sm ml-2 text-blue-600 hover:underline" data-index="${globalIdx}">
                ${s.active ? "Deactivate" : "Activate"}
              </button>
            </div>
            <div class="text-xs text-gray-600 pl-6">
              <span>Date Added: ${s.dateAdded}</span> ·
              <span>Last Deactivated: ${s.lastDeactivated || "-"}</span>
            </div>
          </div>
        `;
    });
    attachMobileEvents();
}

// Attach events for desktop checkboxes and action buttons
function attachDesktopEvents() {
    document.querySelectorAll(".selectServiceDesktop").forEach(cb => {
        cb.addEventListener("change", function () {
            const idx = parseInt(this.getAttribute("data-index"));
            if (this.checked && !selected.includes(idx)) selected.push(idx);
            else if (!this.checked) selected = selected.filter(i => i !== idx);
            updateBatchButtons();
            updateSelectAllCheckboxes();
        });
    });
    document.querySelectorAll(".toggleStateBtnDesktop").forEach(btn => {
        btn.addEventListener("click", function () {
            const idx = parseInt(this.getAttribute("data-index"));
            const s = filteredServices[idx];
            showConfirmModal(
                `Are you sure you want to ${s.active ? "deactivate" : "activate"} ${s.name}?`,
                () => {
                    if (s.active) {
                        s.lastDeactivated = new Date().toISOString().split("T")[0];

                        s.active = false;
                    } else {
                        s.active = true;
                    }
                    render();
                }
            );
        });
    });
    selectAllDesktop.addEventListener("change", function () {
        const start = (currentPageDesktop - 1) * rowsPerPageDesktop;
        const end = start + rowsPerPageDesktop;
        if (this.checked) {
            for (let i = start; i < end && i < filteredServices.length; i++) {
                if (!selected.includes(i)) selected.push(i);
            }
        } else {
            for (let i = start; i < end && i < filteredServices.length; i++) {
                selected = selected.filter(s => s !== i);
            }
        }
        render();
    });
}

// Attach events for mobile checkboxes and action buttons
function attachMobileEvents() {
    document.querySelectorAll(".selectServiceMobile").forEach(cb => {
        cb.addEventListener("change", function () {
            const idx = parseInt(this.getAttribute("data-index"));
            if (this.checked && !selected.includes(idx)) selected.push(idx);
            else if (!this.checked) selected = selected.filter(i => i !== idx);
            updateBatchButtons();
            updateSelectAllCheckboxes();
        });
    });
    document.querySelectorAll(".toggleStateBtnMobile").forEach(btn => {
        btn.addEventListener("click", function () {
            const idx = parseInt(this.getAttribute("data-index"));
            const s = filteredServices[idx];
            showConfirmModal(
                `Are you sure you want to ${s.active ? "deactivate" : "activate"} ${s.name}?`,
                () => {
                    if (s.active) {
                        // if (!s.lastDeactivated) {
                        //     s.lastDeactivated = new Date().toISOString().slice(0, 10);
                        // }
                        s.lastDeactivated = new Date().toISOString().split("T")[0];
                        s.active = false;
                    } else {
                        s.active = true;
                    }
                    render();
                }
            );
        });
    });
}

// Update batch button enable/disable state unified for Desktop and Mobile
function updateBatchButtons() {
    if (selected.length === 0) {
        batchActivateDesktop.disabled = batchDeactivateDesktop.disabled = batchActivateMobile.disabled = batchDeactivateMobile.disabled = true;
        return;
    }
    let hasActive = false;
    let hasInactive = false;
    for (let i of selected) {
        const service = filteredServices[i];
        if (service) {
            if (service.active) hasActive = true;
            else hasInactive = true;
        }
    }
    batchActivateDesktop.disabled = batchActivateMobile.disabled = !hasInactive;
    batchDeactivateDesktop.disabled = batchDeactivateMobile.disabled = !hasActive;
}

function updateSelectAllCheckboxes() {
    const allSelected = filteredServices.length > 0 && filteredServices.every((_, idx) => selected.includes(idx));
    selectAllFilteredData.checked = allSelected;
}

// Pagination functions
function updatePaginationDesktop() {
    const totalPages = Math.ceil(filteredServices.length / rowsPerPageDesktop);
    pageInfoDesktop.textContent = `Page ${currentPageDesktop} of ${totalPages}`;
    prevBtnDesktop.disabled = currentPageDesktop === 1;
    nextBtnDesktop.disabled = currentPageDesktop === totalPages || totalPages === 0;
}
prevBtnDesktop.addEventListener("click", () => {
    if (currentPageDesktop > 1) {
        currentPageDesktop--;
        render();
    }
});
nextBtnDesktop.addEventListener("click", () => {
    const totalPages = Math.ceil(filteredServices.length / rowsPerPageDesktop);
    if (currentPageDesktop < totalPages) {
        currentPageDesktop++;
        render();
    }
});

function updatePaginationMobile() {
    const totalPages = Math.ceil(filteredServices.length / rowsPerPageMobile);
    pageInfoMobile.textContent = `Page ${currentPageMobile} of ${totalPages}`;
    prevBtnMobile.disabled = currentPageMobile === 1;
    nextBtnMobile.disabled = currentPageMobile === totalPages || totalPages === 0;
}
prevBtnMobile.addEventListener("click", () => {
    if (currentPageMobile > 1) {
        currentPageMobile--;
        render();
    }
});
nextBtnMobile.addEventListener("click", () => {
    const totalPages = Math.ceil(filteredServices.length / rowsPerPageMobile);
    if (currentPageMobile < totalPages) {
        currentPageMobile++;
        render();
    }
});

// Search unify (search by service name only)
searchBtnDesktop.addEventListener("click", () => {
    currentPageDesktop = 1;
    currentPageMobile = 1;
    applyFilters();
});
searchInputDesktop.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        currentPageDesktop = 1;
        currentPageMobile = 1;
        applyFilters();
    }
});
searchBtnMobile.addEventListener("click", () => {
    currentPageMobile = 1;
    currentPageDesktop = 1;
    applyFilters();
});
searchInputMobile.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        currentPageMobile = 1;
        currentPageDesktop = 1;
        applyFilters();
    }
});

function applyFilters() {
    const searchDesktop = searchInputDesktop.value.trim().toLowerCase();
    const searchMobile = searchInputMobile.value.trim().toLowerCase();

    filteredServices = services.filter(s => {
        const searchMatch = s.name.toLowerCase().includes(searchDesktop) || s.name.toLowerCase().includes(searchMobile);
        return searchMatch;
    });

    selected = selected.filter(i => i < filteredServices.length);
    render();
}

// Mobile select all checkbox for all filtered data
selectAllFilteredData.addEventListener("change", () => {
    if (selectAllFilteredData.checked) {
        selected = [];
        for (let i = 0; i < filteredServices.length; i++) selected.push(i);
    } else {
        selected = [];
    }
    render();
});

// Confirmation modal logic
function showConfirmModal(msg, onYes) {
    confirmText.textContent = msg;
    confirmModal.classList.remove("hidden");
    let newYes = confirmYes.cloneNode(true);
    let newNo = confirmNo.cloneNode(true);
    confirmYes.replaceWith(newYes);
    confirmNo.replaceWith(newNo);
    confirmYes = newYes;
    confirmNo = newNo;
    confirmYes.onclick = () => {
        confirmModal.classList.add("hidden");
        if (typeof onYes === "function") onYes();
    };
    confirmNo.onclick = () => confirmModal.classList.add("hidden");
}

// Add Service modal logic
add_service_button.addEventListener("click", () => {
    service_add_modal.classList.remove("hidden");
});
function closeServiceAddModal() {
    service_add_modal.classList.add("hidden");
}
service_add_modal.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault();
    const serviceName = this.serviceName.value.trim();
    if (!serviceName) return;
    services.push({
        id: "S" + (services.length + 1).toString().padStart(3, "0"),
        name: serviceName,
        dateAdded: new Date().toISOString().slice(0, 10),
        lastDeactivated: "",
        active: true,
    });
    applyFilters();
    toastDesktop.classList.remove("hidden");
    setTimeout(() => toastDesktop.classList.add("hidden"), 3000);
    service_add_modal.classList.add("hidden");
    this.reset();
});

// Batch buttons click handlers unified
batchActivateDesktop.addEventListener("click", () => {
    showConfirmModal("Activate all selected services?", () => {
        for (let i of selected) {
            const s = filteredServices[i];
            if (s && !s.active) {
                s.active = true;
            }
        }
        render();
    });
});
batchDeactivateDesktop.addEventListener("click", () => {
    showConfirmModal("Deactivate all selected services?", () => {
        for (let i of selected) {
            const s = filteredServices[i];
            if (s && s.active) {
                if (!s.lastDeactivated) s.lastDeactivated = new Date().toISOString().slice(0, 10);
                s.active = false;
            }
        }
        render();
    });
});
batchActivateMobile.addEventListener("click", () => batchActivateDesktop.click());
batchDeactivateMobile.addEventListener("click", () => batchDeactivateDesktop.click());

// Initial render
applyFilters();

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
      <button id="add-service-btn-mobile" class="block w-full text-left px-4 py-2 hover:bg-indigo-700 focus:outline-none" type="button">
        Add Service
      </button>
      <!-- Add more buttons here if needed -->
    `;

        menu_actions.parentElement.appendChild(dropdown);

        document.getElementById('add-service-btn-mobile').addEventListener('click', () => {
            service_add_modal.classList.remove('hidden')
        })
    });

    // Close dropdown if clicked outside
    document.addEventListener('click', () => {
        const dropdown = document.getElementById('pageActionsDropdown');
        if (dropdown) {
            dropdown.classList.add('hidden');
        }
    });




});
