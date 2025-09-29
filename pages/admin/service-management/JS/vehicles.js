localStorage.setItem('vms_current_page', 'services');

// Data and unified filtered list and selection
const vehicles = [
    { id: "V001", brand: "Toyota", model: "Camry", fuel: "Petrol", type: "four-wheeler", dateAdded: "2023-01-15", lastDeactivated: "", active: true },
    { id: "V002", brand: "Honda", model: "CBR500R", fuel: "Petrol", type: "two-wheeler", dateAdded: "2023-05-20", lastDeactivated: "", active: true },
    { id: "V003", brand: "Tesla", model: "Model 3", fuel: "EV", type: "four-wheeler", dateAdded: "2024-03-10", lastDeactivated: "2025-01-01", active: false },
    { id: "V004", brand: "Yamaha", model: "R15", fuel: "Petrol", type: "two-wheeler", dateAdded: "2022-11-05", lastDeactivated: "", active: true }
];


let filteredVehicles = [...vehicles];
let selected = [];


// Elements references
const tableBodyDesktop = document.getElementById("vehicleTableBodyDesktop");
const selectAllDesktop = document.getElementById("selectAllDesktop");
const prevBtnDesktop = document.getElementById("prevPageDesktop");
const nextBtnDesktop = document.getElementById("nextPageDesktop");
const pageInfoDesktop = document.getElementById("pageInfoDesktop");
const searchInputDesktop = document.getElementById("searchInputDesktop");
const searchBtnDesktop = document.getElementById("searchBtnDesktop");
const filterFuelDesktop = document.getElementById("filterFuelDesktop");
const filterTypeDesktop = document.getElementById("filterTypeDesktop");
const filterBtnDesktop = document.getElementById("filterBtnDesktop");
const filterPanelDesktop = document.getElementById("filterPanelDesktop");
const applyFilterDesktop = document.getElementById("applyFilterDesktop");
const batchActivateDesktop = document.getElementById("batchActivateDesktop");
const batchDeactivateDesktop = document.getElementById("batchDeactivateDesktop");


const vehicleListMobile = document.getElementById("vehicleListMobile");
const prevBtnMobile = document.getElementById("prevPageMobile");
const nextBtnMobile = document.getElementById("nextPageMobile");
const pageInfoMobile = document.getElementById("pageInfoMobile");
const searchInputMobile = document.getElementById("searchInputMobile");
const searchBtnMobile = document.getElementById("searchBtnMobile");
const batchActivateMobile = document.getElementById("batchActivateMobile");
const batchDeactivateMobile = document.getElementById("batchDeactivateMobile");
const filterBtnMobile = document.getElementById("filterBtnMobile");
const filterPanelMobile = document.getElementById("filterPanelMobile");
const applyFilterMobile = document.getElementById("applyFilterMobile");
const filterFuelMobile = document.getElementById("filterFuelMobile");
const filterTypeMobile = document.getElementById("filterTypeMobile");
const selectAllFilteredData = document.getElementById("select-all-filtered-data");


const confirmModal = document.getElementById("confirmModal");
const confirmText = document.getElementById("confirmText");
let confirmYes = document.getElementById("confirmYes");
let confirmNo = document.getElementById("confirmNo");


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
    const pageData = filteredVehicles.slice(start, end);


    let allChecked = pageData.length > 0 && pageData.every((_, idx) => selected.includes(start + idx));
    selectAllDesktop.checked = allChecked;


    tableBodyDesktop.innerHTML = "";
    pageData.forEach((v, idx) => {
        const globalIdx = start + idx;
        const checked = selected.includes(globalIdx) ? "checked" : "";
        tableBodyDesktop.innerHTML += `
            <tr class="hover:bg-gray-50">
                <td class="py-2 px-3 border border-gray-300 text-center">
                <input type="checkbox" class="selectVehicleDesktop" data-index="${globalIdx}" ${checked} />
                </td>
                <td class="py-2 px-4 border border-gray-300">${v.brand}</td>
                <td class="py-2 px-4 border border-gray-300">${v.model}</td>
                <td class="py-2 px-4 border border-gray-300">${v.fuel}</td>
                <td class="py-2 px-4 border border-gray-300 capitalize">${v.type.replace("-", " ")}</td>
                <td class="py-2 px-4 border border-gray-300">${v.dateAdded}</td>
                <td class="py-2 px-4 border border-gray-300">${v.lastDeactivated || "-"}</td>
                <td class="py-2 px-4 border border-gray-300">
                <button class="toggleStateBtnDesktop text-blue-600 hover:underline" data-index="${globalIdx}">
                    ${v.active ? "Deactivate" : "Activate"}
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
    const pageData = filteredVehicles.slice(start, end);


    vehicleListMobile.innerHTML = "";
    pageData.forEach((v, idx) => {
        const globalIdx = start + idx;
        const checked = selected.includes(globalIdx) ? "checked" : "";
        vehicleListMobile.innerHTML += `
            <div class="border-b border-gray-300 py-3 px-4 flex flex-col space-y-1">
                <div class="flex items-center mb-1">
                <input type="checkbox" class="selectVehicleMobile mr-1" data-index="${globalIdx}" ${checked} />
                <div class="flex-1 ml-1.5">
                    <span class="font-semibold">${v.brand} ${v.model}</span><br>
                    <span class="text-xs text-gray-500 capitalize ml-0.5">${v.type.replace("-", " ")} | ${v.fuel}</span>
                </div>
                <button class="toggleStateBtnMobile text-sm ml-2 text-blue-600 hover:underline" data-index="${globalIdx}">
                    ${v.active ? "Deactivate" : "Activate"}
                </button>
                </div>
                <div class="text-xs text-gray-600 pl-6">
                <span>Date Added: ${v.dateAdded}</span> ·
                <span>Last Deactivated: ${v.lastDeactivated || "-"}</span>
                </div>
            </div>
            `;
    });
    attachMobileEvents();
}


// Attach events for desktop checkboxes and action buttons
function attachDesktopEvents() {
    document.querySelectorAll(".selectVehicleDesktop").forEach(cb => {
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
            const v = filteredVehicles[idx];
            showConfirmModal(
                `Are you sure you want to ${v.active ? "deactivate" : "activate"} ${v.brand} ${v.model}?`,
                () => {
                    if (v.active) {
                        // Deactivating: set lastDeactivated date only if not already set

                        v.active = false;
                        v.lastDeactivated = new Date().toISOString().split("T")[0];
                    } else {
                        // Activating: do not clear lastDeactivated
                        v.active = true;
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
            for (let i = start; i < end && i < filteredVehicles.length; i++) {
                if (!selected.includes(i)) selected.push(i);
            }
        } else {
            for (let i = start; i < end && i < filteredVehicles.length; i++) {
                selected = selected.filter(s => s !== i);
            }
        }
        render();
    });
}


// Attach events for mobile checkboxes and action buttons
function attachMobileEvents() {
    document.querySelectorAll(".selectVehicleMobile").forEach(cb => {
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
            const v = filteredVehicles[idx];
            showConfirmModal(
                `Are you sure you want to ${v.active ? "deactivate" : "activate"} ${v.brand} ${v.model}?`,
                () => {
                    if (v.active) {
                        // Deactivating: set lastDeactivated date only if not already set
                        v.lastDeactivated = new Date().toISOString().split("T")[0];
                        v.active = false;
                    } else {
                        // Activating: do not clear lastDeactivated
                        v.active = true;
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
        const vehicle = filteredVehicles[i];
        if (vehicle) {
            if (vehicle.active) hasActive = true;
            else hasInactive = true;
        }
    }
    batchActivateDesktop.disabled = batchActivateMobile.disabled = !hasInactive;
    batchDeactivateDesktop.disabled = batchDeactivateMobile.disabled = !hasActive;
}


function updateSelectAllCheckboxes() {
    // Update mobile select all filtered checkbox according to selection
    const allSelected = filteredVehicles.length > 0 && filteredVehicles.every((_, idx) => selected.includes(idx));
    selectAllFilteredData.checked = allSelected;
}


// Pagination functions
function updatePaginationDesktop() {
    const totalPages = Math.ceil(filteredVehicles.length / rowsPerPageDesktop);
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
    const totalPages = Math.ceil(filteredVehicles.length / rowsPerPageDesktop);
    if (currentPageDesktop < totalPages) {
        currentPageDesktop++;
        render();
    }
});


function updatePaginationMobile() {
    const totalPages = Math.ceil(filteredVehicles.length / rowsPerPageMobile);
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
    const totalPages = Math.ceil(filteredVehicles.length / rowsPerPageMobile);
    if (currentPageMobile < totalPages) {
        currentPageMobile++;
        render();
    }
});


// Search, filter and applyFilter unify
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


filterBtnDesktop.addEventListener("click", e => {
    e.stopPropagation();
    filterPanelDesktop.classList.toggle("hidden");
});
applyFilterDesktop.addEventListener("click", () => {
    filterPanelDesktop.classList.add("hidden");
    currentPageDesktop = 1;
    currentPageMobile = 1;
    applyFilters();
});
document.addEventListener("click", e => {
    if (!filterPanelDesktop.classList.contains("hidden") && !filterPanelDesktop.contains(e.target) && e.target.id !== "filterBtnDesktop") {
        filterPanelDesktop.classList.add("hidden");
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


filterBtnMobile.addEventListener("click", e => {
    e.stopPropagation();
    filterPanelMobile.classList.toggle("hidden");
});
applyFilterMobile.addEventListener("click", () => {
    filterPanelMobile.classList.add("hidden");
    currentPageMobile = 1;
    currentPageDesktop = 1;
    applyFilters();
});
document.addEventListener("click", e => {
    if (!filterPanelMobile.classList.contains("hidden") && !filterPanelMobile.contains(e.target) && e.target !== filterBtnMobile) {
        filterPanelMobile.classList.add("hidden");
    }
});


function applyFilters() {
    const searchDesktop = searchInputDesktop.value.trim().toLowerCase();
    const fuelDesktop = filterFuelDesktop.value;
    const typeDesktop = filterTypeDesktop.value;
    const searchMobile = searchInputMobile.value.trim().toLowerCase();
    const fuelMobile = filterFuelMobile.value;
    const typeMobile = filterTypeMobile.value;


    // Filter union of desktop and mobile filter values to one filtered list
    filteredVehicles = vehicles.filter(v => {
        // Search match for desktop or mobile - unify with OR logic
        const searchMatch = (
            v.brand.toLowerCase().includes(searchDesktop) ||
            v.model.toLowerCase().includes(searchDesktop) ||
            v.fuel.toLowerCase().includes(searchDesktop) ||
            v.type.toLowerCase().includes(searchDesktop) ||
            v.brand.toLowerCase().includes(searchMobile) ||
            v.model.toLowerCase().includes(searchMobile) ||
            v.fuel.toLowerCase().includes(searchMobile) ||
            v.type.toLowerCase().includes(searchMobile)
        );
        // Fuel filters: desktop OR mobile, if either has a filter, it applies
        const fuelFilter = fuelDesktop || fuelMobile;
        const fuelMatch = fuelFilter === "" || v.fuel === fuelFilter;
        // Type filters: desktop OR mobile combined 
        const typeFilterActive = (typeDesktop !== "") || (typeMobile !== "");
        const typeMatch = !typeFilterActive || (v.type === typeDesktop) || (v.type === typeMobile);
        return searchMatch && fuelMatch && typeMatch;
    });
    // Clear invalid selections
    selected = selected.filter(i => i < filteredVehicles.length);
    render();
}


// Mobile select all checkbox for all filtered data
selectAllFilteredData.addEventListener("change", () => {
    if (selectAllFilteredData.checked) {
        selected = [];
        for (let i = 0; i < filteredVehicles.length; i++) selected.push(i);
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


// Add Vehicle modal logic
const add_vehicle_button = document.getElementById("add-vehicle");
const vehicle_add_modal = document.getElementById("add-vehicle-modal");
const toastDesktop = document.getElementById("toastDesktop");


add_vehicle_button.addEventListener("click", () => {
    vehicle_add_modal.classList.remove("hidden");
});
function closeVehicleAddModal() {
    vehicle_add_modal.classList.add("hidden");
}
vehicle_add_modal.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault();
    const brand = this.brand.value.trim();
    const model = this.model.value.trim();
    const fuel = this.fuel.value;
    const type = this.type.value;
    vehicles.push({
        id: "V" + (vehicles.length + 1).toString().padStart(3, "0"),
        brand,
        model,
        fuel,
        type,
        dateAdded: new Date().toISOString().split("T")[0],
        lastDeactivated: "",
        active: true,
    });
    applyFilters();
    toastDesktop.classList.remove("hidden");
    setTimeout(() => toastDesktop.classList.add("hidden"), 3000);
    vehicle_add_modal.classList.add("hidden");
    this.reset();
});


// Batch buttons click handlers unified
batchActivateDesktop.addEventListener("click", () => {
    showConfirmModal("Activate all selected vehicles?", () => {
        for (let i of selected) {
            const v = filteredVehicles[i];
            if (v && !v.active) {
                v.active = true;
            }
        }
        render();
    });
});
batchDeactivateDesktop.addEventListener("click", () => {
    showConfirmModal("Deactivate all selected vehicles?", () => {
        for (let i of selected) {
            const v = filteredVehicles[i];
            if (v && v.active) {
                // Set lastDeactivated only if empty
                if (!v.lastDeactivated) {
                    v.lastDeactivated = new Date().toISOString().split("T")[0];
                }
                v.active = false;
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
        <button id="add-vehicle-btn-mobile" class="block w-full text-left px-4 py-2 hover:bg-indigo-700 focus:outline-none" type="button">
            Add Vehicle
        </button>

        `;

        menu_actions.parentElement.appendChild(dropdown);

        document.getElementById('add-vehicle-btn-mobile').addEventListener('click', () => {
            vehicle_add_modal.classList.remove('hidden')
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
