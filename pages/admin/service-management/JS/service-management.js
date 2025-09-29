localStorage.setItem('vms_current_page', 'services');

let servicesData = [
    {
        id: "1",
        brand: "Toyota",
        model: "Corolla",
        fuel: "Petrol",
        type: "four-wheeler",
        serviceName: "Oil Change",
        dateAdded: "2023-01-01T00:00:00Z",
        lastDateDeactivated: null,
        price: 49.99,
        timeToComplete: 30,
        active: true
    },
    {
        id: "2",
        brand: "Honda",
        model: "Civic",
        fuel: "Diesel",
        type: "four-wheeler",
        serviceName: "Brake Inspection",
        dateAdded: "2023-02-15T00:00:00Z",
        lastDateDeactivated: null,
        price: 99.99,
        timeToComplete: 45,
        active: false,
    },
    {
        id: "3",
        brand: "Tesla",
        model: "Model 3",
        fuel: "EV",
        type: "four-wheeler",
        serviceName: "Battery Check",
        dateAdded: "2023-03-10T00:00:00Z",
        lastDateDeactivated: null,
        price: 0,
        timeToComplete: 20,
        active: true,
    }
];

// Unified data tracking
let filteredData = [...servicesData];
let selectedDesktop = new Set();
let selectedMobile = new Set();

const rowsPerPage = 10;
let currentPageDesktop = 1;
let currentPageMobile = 1;

// Elements
const servicesTableBodyDesktop = document.getElementById("servicesTableBodyDesktop");
const selectAllDesktop = document.getElementById("selectAllDesktop");
const batchActivateDesktop = document.getElementById("batchActivateDesktop");
const batchDeactivateDesktop = document.getElementById("batchDeactivateDesktop");
const batchActivateMobile = document.getElementById("batchActivateMobile");
const batchDeactivateMobile = document.getElementById("batchDeactivateMobile");

const prevPageDesktop = document.getElementById("prevPageDesktop");
const nextPageDesktop = document.getElementById("nextPageDesktop");
const pageInfoDesktop = document.getElementById("pageInfoDesktop");
const prevPageMobile = document.getElementById("prevPageMobile");
const nextPageMobile = document.getElementById("nextPageMobile");
const pageInfoMobile = document.getElementById("pageInfoMobile");

const servicesListMobile = document.getElementById("servicesListMobile");
const selectAllFilteredData = document.getElementById("select-all-filtered-data");

const searchInputDesktop = document.getElementById("searchInputDesktop");
const searchBtnDesktop = document.getElementById("searchBtnDesktop");
const searchInputMobile = document.getElementById("searchInputMobile");
const searchBtnMobile = document.getElementById("searchBtnMobile");

const filterBtnDesktop = document.getElementById("filterBtnDesktop");
const filterPanelDesktop = document.getElementById("filterPanelDesktop");
const filterFormDesktop = document.getElementById("filterFormDesktop");

const filterBtnMobile = document.getElementById("filterBtnMobile");
const filterPanelMobile = document.getElementById("filterPanelMobile");
const filterFormMobile = document.getElementById("filterFormMobile");

const confirmModal = document.getElementById("confirmModal");
const confirmText = document.getElementById("confirmText");
let confirmYes = document.getElementById("confirmYes");
let confirmNo = document.getElementById("confirmNo");

// State
let currentSearchText = "";
let currentFilters = {
    dateFrom: null,
    dateTo: null,
    priceOp: "option",
    price: null,
    timeOp: "option",
    time: null,
    fuel: "All",
    type: "All",
};

// Toast element
const toastElem = document.getElementById("toast");

function showToast(msg, duration = 3000) {
    toastElem.textContent = msg;
    toastElem.classList.remove("opacity-0", "pointer-events-none");
    toastElem.classList.add("opacity-100");
    setTimeout(() => {
        toastElem.classList.remove("opacity-100");
        toastElem.classList.add("opacity-0", "pointer-events-none");
    }, duration);
}

function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString();
}

function serviceMatchesFilters(service, filters) {
    if (filters.dateFrom && new Date(service.dateAdded) < new Date(filters.dateFrom)) return false;
    if (filters.dateTo && new Date(service.dateAdded) > new Date(filters.dateTo)) return false;
    if (filters.priceOp && filters.price !== null && filters.price !== undefined && filters.price !== "" && filters.priceOp !== "option") {
        const price = parseFloat(service.price);
        const filterPrice = parseFloat(filters.price);
        if (filters.priceOp === "=" && price !== filterPrice) return false;
        if (filters.priceOp === "<" && !(price < filterPrice)) return false;
        if (filters.priceOp === ">" && !(price > filterPrice)) return false;
    }
    if (filters.timeOp && filters.time !== null && filters.time !== undefined && filters.time !== "" && filters.timeOp !== "option") {
        const time = parseInt(service.timeToComplete, 10);
        const filterTime = parseInt(filters.time, 10);
        if (filters.timeOp === "=" && time !== filterTime) return false;
        if (filters.timeOp === "<" && !(time < filterTime)) return false;
        if (filters.timeOp === ">" && !(time > filterTime)) return false;
    }
    if (filters.fuel !== "All" && service.fuel !== filters.fuel) return false;
    if (filters.type !== "All" && service.type !== filters.type) return false;
    return true;
}

function applyFiltersAndSearch(data, searchText, filters) {
    const s = searchText.toLowerCase();
    return data.filter(service => {
        if (!serviceMatchesFilters(service, filters)) return false;
        if (
            service.brand.toLowerCase().includes(s) ||
            service.model.toLowerCase().includes(s) ||
            service.serviceName.toLowerCase().includes(s)
        ) return true;
        return false;
    });
}

function updatePaginationControls(totalItems, currentPage, prevBtn, nextBtn, pageInfo) {
    const totalPages = Math.ceil(totalItems / rowsPerPage);
    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= totalPages || totalPages === 0;
    pageInfo.textContent = `Page ${Math.min(Math.max(currentPage, 1), totalPages || 1)} of ${totalPages || 1}`;
}

function renderDesktopTable(data, page, rows) {
    const tbody = servicesTableBodyDesktop;
    tbody.innerHTML = "";
    const start = (page - 1) * rows;
    const end = start + rows;
    const chunk = data.slice(start, end);

    chunk.forEach(service => {
        const isChecked = selectedDesktop.has(service.id);
        const deactivateButtonClass = service.active ? "text-red-600 hover:underline" : "text-green-600 hover:underline";
        const deactivateButtonText = service.active ? "Deactivate" : "Activate";
        const tr = document.createElement("tr");
        tr.className = "hover:bg-gray-50";

        tr.innerHTML = `
                    <td class="py-2 px-3 border border-gray-300 text-center">
                        <input type="checkbox" data-id="${service.id}" ${isChecked ? "checked" : ""} class="select-service-desktop" aria-label="Select service ${service.serviceName}" />
                    </td>
                    <td class="py-2 px-4 border border-gray-300">${service.brand}</td>
                    <td class="py-2 px-4 border border-gray-300">${service.model}</td>
                    <td class="py-2 px-4 border border-gray-300">${service.fuel}</td>
                    <td class="py-2 px-4 border border-gray-300 capitalize">${service.type.replace("-", " ")}</td>
                    <td class="py-2 px-4 border border-gray-300">${service.serviceName}</td>
                    <td class="py-2 px-4 border border-gray-300">${formatDate(service.dateAdded)}</td>
                    <td class="py-2 px-4 border border-gray-300">${formatDate(service.lastDateDeactivated)}</td>
                    <td class="py-2 px-4 border border-gray-300">
                        <span class="price-text">${service.price.toFixed(2)}</span>
                        <input type="number" min="0" step="0.01" class="edit-price-input hidden border rounded px-1 py-0.5 w-20" value="${service.price.toFixed(2)}" />
                    </td>
                    <td class="py-2 px-4 border border-gray-300">
                        <span class="time-text">${service.timeToComplete}</span>
                        <input type="number" min="0" class="edit-time-input hidden border rounded px-1 py-0.5 w-16" value="${service.timeToComplete}" />
                    </td>
                    <td class="py-2 px-4 border border-gray-300">
                        <button class="edit-btn text-blue-600 hover:underline mr-2" data-id="${service.id}">
                            Edit
                        </button>
                        <button class="deactivate-btn ${deactivateButtonClass}" data-id="${service.id}">
                            ${deactivateButtonText}
                        </button>
                    </td>
                `;
        tbody.appendChild(tr);
    });
}

function renderMobileList(data, page, rows) {
    const list = servicesListMobile;
    list.innerHTML = "";
    const start = (page - 1) * rows;
    const end = start + rows;
    const chunk = data.slice(start, end);

    chunk.forEach(service => {
        const isChecked = selectedMobile.has(service.id);
        const div = document.createElement("div");
        div.className = "border-b border-gray-300 py-3 px-4 flex flex-col space-y-1";
        div.innerHTML = `
                    <div class="flex items-center mb-1">
                        <input type="checkbox" data-id="${service.id}" ${isChecked ? "checked" : ""} class="select-service-mobile mr-1" aria-label="Select service ${service.serviceName}" />
                        <div class="flex-1 ml-1.5">
                            <span class="font-semibold">${service.serviceName}</span><br>
                            <span class="text-xs text-gray-500 capitalize ml-0.5">${service.brand} ${service.model} | ${service.type.replace("-", " ")} | ${service.fuel}</span>
                        </div>
                        <button class="deactivate-btn-mobile text-sm ml-2 ${service.active ? 'text-red-600' : 'text-green-600'} hover:underline" data-id="${service.id}">
                            ${service.active ? "Deactivate" : "Activate"}
                        </button>
                    </div>
                    <div class="text-xs text-gray-600 pl-6">
                        <span>Date Added: ${formatDate(service.dateAdded)}</span> ·
                        <span>Last Deactivated: ${formatDate(service.lastDateDeactivated) || "-"}</span> ·
                        <span>Price: ${service.price.toFixed(2)}</span> ·
                        <span>Time: ${service.timeToComplete} mins</span>
                    </div>
                `;
        list.appendChild(div);
    });
}

function renderCurrentPage() {
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / rowsPerPage);

    if (currentPageDesktop > totalPages) currentPageDesktop = totalPages || 1;
    if (currentPageDesktop < 1) currentPageDesktop = 1;
    if (currentPageMobile > totalPages) currentPageMobile = totalPages || 1;
    if (currentPageMobile < 1) currentPageMobile = 1;

    renderDesktopTable(filteredData, currentPageDesktop, rowsPerPage);
    updatePaginationControls(totalItems, currentPageDesktop, prevPageDesktop, nextPageDesktop, pageInfoDesktop);
    renderMobileList(filteredData, currentPageMobile, rowsPerPage);
    updatePaginationControls(totalItems, currentPageMobile, prevPageMobile, nextPageMobile, pageInfoMobile);

    updateSelectAllCheckbox();
    updateBatchButtonsState();
    updateSelectAllFilteredData();
}

// Helper: debounce function
function debounce(func, wait) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Update batch buttons enabled state
function updateBatchButtonsState() {
    const hasDesktopSelection = selectedDesktop.size > 0;
    const hasMobileSelection = selectedMobile.size > 0;

    batchActivateDesktop.disabled = !hasDesktopSelection;
    batchDeactivateDesktop.disabled = !hasDesktopSelection;
    batchActivateMobile.disabled = !hasMobileSelection;
    batchDeactivateMobile.disabled = !hasMobileSelection;
}

// Update "select all" checkbox
function updateSelectAllCheckbox() {
    const checkboxes = document.querySelectorAll(".select-service-desktop");
    const checkedCount = [...checkboxes].filter(cb => cb.checked).length;
    selectAllDesktop.checked = checkedCount === checkboxes.length && checkboxes.length > 0;
}

// Update mobile select all checkbox
function updateSelectAllFilteredData() {
    const allSelected = filteredData.length > 0 && filteredData.every(service => selectedMobile.has(service.id));
    selectAllFilteredData.checked = allSelected;
}

// Apply filters & search, then render
function applyFiltersAndRender() {
    filteredData = applyFiltersAndSearch(servicesData, currentSearchText, currentFilters);
    selectedDesktop.forEach(id => {
        if (!filteredData.find(s => s.id === id)) selectedDesktop.delete(id);
    });
    selectedMobile.forEach(id => {
        if (!filteredData.find(s => s.id === id)) selectedMobile.delete(id);
    });
    renderCurrentPage();
}

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

// Event listeners...

// Filter panel toggle
filterBtnDesktop.addEventListener("click", (e) => {
    e.stopPropagation();
    filterPanelDesktop.classList.toggle("hidden");
});

filterBtnMobile.addEventListener("click", (e) => {
    e.stopPropagation();
    filterPanelMobile.classList.toggle("hidden");
});

// Close filter panels when clicking outside
document.addEventListener("click", (e) => {
    if (!filterPanelDesktop.classList.contains("hidden") && !filterPanelDesktop.contains(e.target) && e.target.id !== "filterBtnDesktop") {
        filterPanelDesktop.classList.add("hidden");
    }
    if (!filterPanelMobile.classList.contains("hidden") && !filterPanelMobile.contains(e.target) && e.target !== filterBtnMobile) {
        filterPanelMobile.classList.add("hidden");
    }
});

// Filter forms submit
filterFormDesktop.addEventListener("submit", e => {
    e.preventDefault();
    const formData = new FormData(filterFormDesktop);
    currentFilters = {
        dateFrom: formData.get("dateFrom") || null,
        dateTo: formData.get("dateTo") || null,
        priceOp: formData.get("priceOp") || "option",
        price: formData.get("price") || null,
        timeOp: formData.get("timeOp") || "option",
        time: formData.get("time") || null,
        fuel: formData.get("fuel") || "All",
        type: formData.get("type") || "All",
    };
    filterPanelDesktop.classList.add("hidden");
    currentPageDesktop = 1;
    currentPageMobile = 1;
    applyFiltersAndRender();
});

filterFormMobile.addEventListener("submit", e => {
    e.preventDefault();
    const formData = new FormData(filterFormMobile);
    currentFilters = {
        dateFrom: formData.get("dateFrom") || null,
        dateTo: formData.get("dateTo") || null,
        priceOp: formData.get("priceOp") || "option",
        price: formData.get("price") || null,
        timeOp: formData.get("timeOp") || "option",
        time: formData.get("time") || null,
        fuel: formData.get("fuel") || "All",
        type: formData.get("type") || "All",
    };
    filterPanelMobile.classList.add("hidden");
    currentPageDesktop = 1;
    currentPageMobile = 1;
    applyFiltersAndRender();
});

// Search inputs and buttons
searchBtnDesktop.addEventListener("click", () => {
    currentSearchText = searchInputDesktop.value.trim();
    currentPageDesktop = 1;
    currentPageMobile = 1;
    applyFiltersAndRender();
});

searchBtnMobile.addEventListener("click", () => {
    currentSearchText = searchInputMobile.value.trim();
    currentPageDesktop = 1;
    currentPageMobile = 1;
    applyFiltersAndRender();
});

searchInputDesktop.addEventListener("input", debounce(e => {
    currentSearchText = e.target.value.trim();
    currentPageDesktop = 1;
    currentPageMobile = 1;
    searchInputMobile.value = currentSearchText;
    applyFiltersAndRender();
}, 300));

searchInputMobile.addEventListener("input", debounce(e => {
    currentSearchText = e.target.value.trim();
    currentPageDesktop = 1;
    currentPageMobile = 1;
    searchInputDesktop.value = currentSearchText;
    applyFiltersAndRender();
}, 300));

searchInputDesktop.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        currentSearchText = searchInputDesktop.value.trim();
        currentPageDesktop = 1;
        currentPageMobile = 1;
        applyFiltersAndRender();
    }
});

searchInputMobile.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        currentSearchText = searchInputMobile.value.trim();
        currentPageDesktop = 1;
        currentPageMobile = 1;
        applyFiltersAndRender();
    }
});

// Pagination buttons
prevPageDesktop.addEventListener("click", () => {
    if (currentPageDesktop > 1) {
        currentPageDesktop--;
        renderCurrentPage();
    }
});

nextPageDesktop.addEventListener("click", () => {
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    if (currentPageDesktop < totalPages) {
        currentPageDesktop++;
        renderCurrentPage();
    }
});

prevPageMobile.addEventListener("click", () => {
    if (currentPageMobile > 1) {
        currentPageMobile--;
        renderCurrentPage();
    }
});

nextPageMobile.addEventListener("click", () => {
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    if (currentPageMobile < totalPages) {
        currentPageMobile++;
        renderCurrentPage();
    }
});

// Select all desktop checkbox
selectAllDesktop.addEventListener("change", e => {
    const checked = e.target.checked;
    const checkboxes = document.querySelectorAll(".select-service-desktop");
    checkboxes.forEach(cb => {
        cb.checked = checked;
        const id = cb.getAttribute("data-id");
        if (checked) selectedDesktop.add(id);
        else selectedDesktop.delete(id);
    });
    updateBatchButtonsState();
});

// Mobile select all checkbox
selectAllFilteredData.addEventListener("change", () => {
    if (selectAllFilteredData.checked) {
        filteredData.forEach(service => selectedMobile.add(service.id));
    } else {
        selectedMobile.clear();
    }
    renderCurrentPage();
});

// Event delegation for desktop service checkbox
servicesTableBodyDesktop.addEventListener("change", e => {
    if (e.target.classList.contains("select-service-desktop")) {
        const id = e.target.getAttribute("data-id");
        if (e.target.checked) selectedDesktop.add(id);
        else selectedDesktop.delete(id);
        updateBatchButtonsState();
        updateSelectAllCheckbox();
    }
});

// Event delegation for mobile service checkbox
servicesListMobile.addEventListener("change", e => {
    if (e.target.classList.contains("select-service-mobile")) {
        const id = e.target.getAttribute("data-id");
        if (e.target.checked) selectedMobile.add(id);
        else selectedMobile.delete(id);
        updateBatchButtonsState();
        updateSelectAllFilteredData();
    }
});

// Batch activate/deactivate
batchActivateDesktop.addEventListener("click", () => {
    batchUpdateStatus(selectedDesktop, true);
});

batchDeactivateDesktop.addEventListener("click", () => {
    batchUpdateStatus(selectedDesktop, false);
});

batchActivateMobile.addEventListener("click", () => {
    batchUpdateStatus(selectedMobile, true);
});

batchDeactivateMobile.addEventListener("click", () => {
    batchUpdateStatus(selectedMobile, false);
});

function batchUpdateStatus(selectedSet, activate) {
    if (selectedSet.size === 0) return;

    const actionText = activate ? "activate" : "deactivate";
    const count = selectedSet.size;

    showConfirmModal(
        `Are you sure you want to ${actionText} ${count} service${count !== 1 ? 's' : ''}?`,
        () => {
            let updatedCount = 0;
            servicesData.forEach(service => {
                if (selectedSet.has(service.id)) {
                    service.active = activate;
                    if (!activate) service.lastDateDeactivated = new Date().toISOString();
                    updatedCount++;
                }
            });
            showToast(`${updatedCount} service${updatedCount !== 1 ? "s" : ""} ${activate ? "activated" : "deactivated"}.`);
            selectedSet.clear();
            currentPageDesktop = 1;
            currentPageMobile = 1;
            applyFiltersAndRender();
            updateBatchButtonsState();
            if (selectedSet === selectedDesktop) selectAllDesktop.checked = false;
        }
    );
}

// Event delegation for edit/save/deactivate buttons desktop
servicesTableBodyDesktop.addEventListener("click", function (e) {
    const target = e.target;
    if (target.classList.contains("edit-btn")) {
        const tr = target.closest("tr");
        const id = target.getAttribute("data-id");
        const service = servicesData.find(s => s.id === id);
        if (!service) return;

        let editing = target.textContent.trim().toLowerCase() === "edit";
        const priceInput = tr.querySelector(".edit-price-input");
        const timeInput = tr.querySelector(".edit-time-input");
        const priceText = tr.querySelector(".price-text");
        const timeText = tr.querySelector(".time-text");

        if (editing) {
            target.textContent = "Save";
            priceInput.classList.remove("hidden");
            timeInput.classList.remove("hidden");
            priceText.classList.add("hidden");
            timeText.classList.add("hidden");
        } else {
            const newPrice = parseFloat(priceInput.value);
            const newTime = parseInt(timeInput.value);
            if (isNaN(newPrice) || newPrice < 0) {
                alert("Please enter a valid price (>=0).");
                return;
            }
            if (isNaN(newTime) || newTime <= 0) {
                alert("Please enter a valid time (>0).");
                return;
            }

            service.price = newPrice;
            service.timeToComplete = newTime;

            priceText.textContent = newPrice.toFixed(2);
            timeText.textContent = newTime;

            priceInput.classList.add("hidden");
            timeInput.classList.add("hidden");
            priceText.classList.remove("hidden");
            timeText.classList.remove("hidden");

            target.textContent = "Edit";

            showToast(`Service "${service.serviceName}" updated successfully!`);
        }
    }

    if (target.classList.contains("deactivate-btn")) {
        const id = target.getAttribute("data-id");
        const service = servicesData.find(s => s.id === id);
        if (service) {
            const actionText = service.active ? "deactivate" : "activate";
            showConfirmModal(
                `Are you sure you want to ${actionText} "${service.serviceName}"?`,
                () => {
                    service.active = !service.active;
                    if (!service.active) {
                        service.lastDateDeactivated = new Date().toISOString();
                    }
                    showToast(`Service "${service.serviceName}" ${service.active ? "activated" : "deactivated"} successfully!`);
                    applyFiltersAndRender();
                }
            );
        }
    }
});

// Event delegation for mobile deactivate buttons
servicesListMobile.addEventListener("click", function (e) {
    if (e.target.classList.contains("deactivate-btn-mobile")) {
        const id = e.target.getAttribute("data-id");
        const service = servicesData.find(s => s.id === id);
        if (service) {
            const actionText = service.active ? "deactivate" : "activate";
            showConfirmModal(
                `Are you sure you want to ${actionText} "${service.serviceName}"?`,
                () => {
                    service.active = !service.active;
                    if (!service.active) {
                        service.lastDateDeactivated = new Date().toISOString();
                    }
                    showToast(`Service "${service.serviceName}" ${service.active ? "activated" : "deactivated"} successfully!`);
                    applyFiltersAndRender();
                }
            );
        }
    }
});

// form for adding service to vehicle
const addServiceModal = document.getElementById("add-service-modal");
const openAddServiceModalBtn = document.getElementById("openAddServiceModalBtn");
const closeAddServiceModalBtn = document.getElementById("closeAddServiceModal");
const addServiceForm = document.getElementById("addServiceForm");

const brandInput = document.getElementById("brandInput");
const brandSuggestionList = document.getElementById("brandSuggestionList");
const modelSelect = document.getElementById("modelSelect");
const fuelSelect = document.getElementById("fuelSelect");
const serviceNameInput = document.getElementById("serviceNameInput");
const serviceSuggestionList = document.getElementById("serviceSuggestionList");
const timeToCompleteInput = document.getElementById("timeToCompleteInput");
const priceInput = document.getElementById("priceInput");
const addServiceSubmitBtn = document.getElementById("addServiceSubmitBtn");

const brandError = document.getElementById("brandError");
const modelError = document.getElementById("modelError");
const fuelError = document.getElementById("fuelError");
const typeError = document.getElementById("typeError");
const serviceError = document.getElementById("serviceError");
const timeError = document.getElementById("timeError");
const priceError = document.getElementById("priceError");

// Example brand-model data for autocomplete
const brandModels = {
    Toyota: ['Corolla', 'Camry', 'RAV4', 'Highlander'],
    Honda: ['Civic', 'Accord', 'CR-V', 'Pilot'],
    Tesla: ['Model S', 'Model 3', 'Model X', 'Model Y'],
    Ford: ['F-150', 'Mustang', 'Escape', 'Explorer']
};

// Example services list for service name autocomplete
const servicesList = [
    "Oil Change",
    "Tire Rotation",
    "Brake Inspection",
    "Battery Check",
    "Wheel Alignment",
    "Air Filter Replacement"
];

// Open modal
openAddServiceModalBtn.addEventListener("click", () => {
    addServiceModal.classList.remove("hidden");
    brandInput.focus();
    resetAddServiceForm();
});

// Close modal
closeAddServiceModalBtn.addEventListener("click", () => {
    addServiceModal.classList.add("hidden");
    resetAddServiceForm();
});

// Reset modal form and errors
function resetAddServiceForm() {
    addServiceForm.reset();
    modelSelect.innerHTML = '<option value="">Select brand first</option>';
    modelSelect.disabled = true;
    fuelSelect.value = "";
    fuelSelect.disabled = true;
    serviceNameInput.value = "";
    serviceNameInput.disabled = true;
    timeToCompleteInput.value = "";
    timeToCompleteInput.disabled = true;
    priceInput.value = "";
    priceInput.disabled = true;
    addServiceSubmitBtn.disabled = true;

    hideAllErrors();
    brandSuggestionList.innerHTML = "";
    brandSuggestionList.classList.add("hidden");
    serviceSuggestionList.innerHTML = "";
    serviceSuggestionList.classList.add("hidden");

    const radios = addServiceForm.querySelectorAll('input[name="vehicleType"]');
    radios.forEach(r => (r.disabled = true));
}

// Hide all error messages
function hideAllErrors() {
    [brandError, modelError, fuelError, typeError, serviceError, timeError, priceError].forEach(el => el.classList.add("hidden"));
}

// Brand input autocomplete logic
brandInput.addEventListener("input", e => {
    const value = e.target.value.toLowerCase().trim();
    if (!value) {
        brandSuggestionList.classList.add("hidden");
        brandSuggestionList.innerHTML = "";
        modelSelect.disabled = true;
        fuelSelect.disabled = true;
        serviceNameInput.disabled = true;
        timeToCompleteInput.disabled = true;
        priceInput.disabled = true;
        addServiceForm.querySelectorAll('input[name="vehicleType"]').forEach(r => (r.disabled = true));
        return;
    }
    const matches = Object.keys(brandModels).filter(b => b.toLowerCase().includes(value));
    if (matches.length === 0) {
        brandSuggestionList.innerHTML = "<li>No matches</li>";
        brandSuggestionList.classList.remove("hidden");
        modelSelect.disabled = true;
        fuelSelect.disabled = true;
        serviceNameInput.disabled = true;
        timeToCompleteInput.disabled = true;
        priceInput.disabled = true;
        addServiceForm.querySelectorAll('input[name="vehicleType"]').forEach(r => (r.disabled = true));
    } else {
        brandSuggestionList.innerHTML = matches.map(b => `<li tabindex="0" role="option" class="px-2 py-1 cursor-pointer hover:bg-gray-100">${b}</li>`).join("");
        brandSuggestionList.classList.remove("hidden");
    }
});

// Brand suggestion selection
brandSuggestionList.addEventListener("click", e => {
    if (e.target.tagName === "LI") {
        brandInput.value = e.target.textContent;
        brandSuggestionList.classList.add("hidden");
        populateModelSelect(e.target.textContent);
        enableNextFields();
    }
});

// Keyboard navigation for brand suggestions
brandInput.addEventListener("keydown", e => {
    const items = brandSuggestionList.querySelectorAll("li");
    let current = Array.from(items).find(item => item === document.activeElement);

    if (e.key === "ArrowDown") {
        e.preventDefault();
        if (!current) {
            items[0]?.focus();
        } else {
            const next = current.nextElementSibling;
            next?.focus();
        }
    } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (!current) {
            items[items.length - 1]?.focus();
        } else {
            const prev = current.previousElementSibling;
            prev?.focus();
        }
    } else if (e.key === "Enter" && current) {
        e.preventDefault();
        brandInput.value = current.textContent;
        brandSuggestionList.classList.add("hidden");
        populateModelSelect(current.textContent);
        enableNextFields();
    }
});

function populateModelSelect(brand) {
    modelSelect.innerHTML = '<option value="">Select model</option>';
    if (brandModels[brand]) {
        brandModels[brand].forEach(model => {
            const option = document.createElement("option");
            option.value = model;
            option.textContent = model;
            modelSelect.appendChild(option);
        });
    }
    modelSelect.disabled = false;
}

function enableNextFields() {
    fuelSelect.disabled = false;
    addServiceForm.querySelectorAll('input[name="vehicleType"]').forEach(r => (r.disabled = false));
    serviceNameInput.disabled = false;
    timeToCompleteInput.disabled = false;
    priceInput.disabled = false;
    validateForm();
}

// Service name autocomplete
serviceNameInput.addEventListener("input", e => {
    const value = e.target.value.toLowerCase().trim();
    if (!value) {
        serviceSuggestionList.classList.add("hidden");
        serviceSuggestionList.innerHTML = "";
        return;
    }
    const matches = servicesList.filter(s => s.toLowerCase().includes(value));
    if (matches.length === 0) {
        serviceSuggestionList.innerHTML = "<li>No matches</li>";
        serviceSuggestionList.classList.remove("hidden");
    } else {
        serviceSuggestionList.innerHTML = matches.map(s => `<li tabindex="0" role="option" class="px-2 py-1 cursor-pointer hover:bg-gray-100">${s}</li>`).join("");
        serviceSuggestionList.classList.remove("hidden");
    }
});

// Service suggestion selection
serviceSuggestionList.addEventListener("click", e => {
    if (e.target.tagName === "LI") {
        serviceNameInput.value = e.target.textContent;
        serviceSuggestionList.classList.add("hidden");
        validateForm();
    }
});

// Keyboard navigation for service suggestions
serviceNameInput.addEventListener("keydown", e => {
    const items = serviceSuggestionList.querySelectorAll("li");
    let current = Array.from(items).find(item => item === document.activeElement);

    if (e.key === "ArrowDown") {
        e.preventDefault();
        if (!current) {
            items[0]?.focus();
        } else {
            const next = current.nextElementSibling;
            next?.focus();
        }
    } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (!current) {
            items[items.length - 1]?.focus();
        } else {
            const prev = current.previousElementSibling;
            prev?.focus();
        }
    } else if (e.key === "Enter" && current) {
        e.preventDefault();
        serviceNameInput.value = current.textContent;
        serviceSuggestionList.classList.add("hidden");
        validateForm();
    }
});

// Form validation
function validateForm() {
    let isValid = true;
    hideAllErrors();

    // Brand validation
    if (!brandInput.value.trim() || !Object.keys(brandModels).includes(brandInput.value.trim())) {
        brandError.classList.remove("hidden");
        isValid = false;
    }

    // Model validation
    if (!modelSelect.value) {
        modelError.classList.remove("hidden");
        isValid = false;
    }

    // Fuel validation
    if (!fuelSelect.value) {
        fuelError.classList.remove("hidden");
        isValid = false;
    }

    // Vehicle type validation
    const selectedType = addServiceForm.querySelector('input[name="vehicleType"]:checked');
    if (!selectedType) {
        typeError.classList.remove("hidden");
        isValid = false;
    }

    // Service name validation
    if (!serviceNameInput.value.trim()) {
        serviceError.classList.remove("hidden");
        isValid = false;
    }

    // Time validation
    const timeValue = parseInt(timeToCompleteInput.value);
    if (isNaN(timeValue) || timeValue <= 0) {
        timeError.classList.remove("hidden");
        isValid = false;
    }

    // Price validation
    const priceValue = parseFloat(priceInput.value);
    if (isNaN(priceValue) || priceValue < 0) {
        priceError.classList.remove("hidden");
        isValid = false;
    }

    addServiceSubmitBtn.disabled = !isValid;
    return isValid;
}

// Real-time validation
[brandInput, modelSelect, fuelSelect, serviceNameInput, timeToCompleteInput, priceInput].forEach(element => {
    element.addEventListener("input", validateForm);
    element.addEventListener("change", validateForm);
});

addServiceForm.querySelectorAll('input[name="vehicleType"]').forEach(radio => {
    radio.addEventListener("change", validateForm);
});

// Form submission
addServiceForm.addEventListener("submit", e => {
    e.preventDefault();

    if (!validateForm()) {
        return;
    }

    const newService = {
        id: (servicesData.length + 1).toString(),
        brand: brandInput.value.trim(),
        model: modelSelect.value,
        fuel: fuelSelect.value,
        type: addServiceForm.querySelector('input[name="vehicleType"]:checked').value,
        serviceName: serviceNameInput.value.trim(),
        dateAdded: new Date().toISOString(),
        lastDateDeactivated: null,
        price: parseFloat(priceInput.value),
        timeToComplete: parseInt(timeToCompleteInput.value),
        active: true
    };

    servicesData.unshift(newService);

    showToast(`Service "${newService.serviceName}" added successfully!`);
    addServiceModal.classList.add("hidden");
    resetAddServiceForm();

    // Reset filters and search to show new service
    currentSearchText = "";
    currentFilters = {
        dateFrom: null,
        dateTo: null,
        priceOp: "option",
        price: null,
        timeOp: "option",
        time: null,
        fuel: "All",
        type: "All",
    };
    searchInputDesktop.value = "";
    searchInputMobile.value = "";
    filterFormDesktop.reset();
    filterFormMobile.reset();

    currentPageDesktop = 1;
    currentPageMobile = 1;
    applyFiltersAndRender();
});

// Close suggestions when clicking outside
document.addEventListener("click", e => {
    if (!brandInput.contains(e.target) && !brandSuggestionList.contains(e.target)) {
        brandSuggestionList.classList.add("hidden");
    }
    if (!serviceNameInput.contains(e.target) && !serviceSuggestionList.contains(e.target)) {
        serviceSuggestionList.classList.add("hidden");
    }
});

// Mobile modal functionality
const vehicleModal = document.getElementById("vehicle-modal");
const modalCloseBtn = document.getElementById("modal-close-btn");
const modalContent = document.getElementById("modal-content");

// Function to open mobile modal with service details
function openMobileModal(service) {
    modalContent.innerHTML = `
                        <h3 class="text-xl font-bold mb-4">${service.serviceName}</h3>
                        <div class="space-y-3">
                            <p><strong>Brand:</strong> ${service.brand}</p>
                            <p><strong>Model:</strong> ${service.model}</p>
                            <p><strong>Fuel Type:</strong> ${service.fuel}</p>
                            <p><strong>Vehicle Type:</strong> ${service.type.replace("-", " ")}</p>
                            <p><strong>Date Added:</strong> ${formatDate(service.dateAdded)}</p>
                            <p><strong>Last Deactivated:</strong> ${formatDate(service.lastDateDeactivated) || "-"}</p>
                            <p><strong>Price:</strong> $${service.price.toFixed(2)}</p>
                            <p><strong>Time to Complete:</strong> ${service.timeToComplete} minutes</p>
                            <p><strong>Status:</strong> ${service.active ? "Active" : "Inactive"}</p>
                        </div>
                        <div class="mt-6 flex space-x-3">
                            <button class="edit-service-mobile flex-1 bg-blue-600 text-white py-2 rounded" data-id="${service.id}">
                                Edit
                            </button>
                            <button class="deactivate-service-mobile flex-1 ${service.active ? "bg-red-600" : "bg-green-600"} text-white py-2 rounded" data-id="${service.id}">
                                ${service.active ? "Deactivate" : "Activate"}
                            </button>
                        </div>
                    `;
    vehicleModal.classList.remove("hidden");
}

// Event delegation for mobile service items (open modal on click)
servicesListMobile.addEventListener("click", function (e) {
    if (e.target.classList.contains("select-service-mobile") ||
        e.target.classList.contains("deactivate-btn-mobile")) {
        return; // Don't open modal for checkbox or deactivate button clicks
    }

    const serviceItem = e.target.closest(".border-b");
    if (serviceItem) {
        const checkbox = serviceItem.querySelector(".select-service-mobile");
        const id = checkbox.getAttribute("data-id");
        const service = servicesData.find(s => s.id === id);
        if (service) {
            openMobileModal(service);
        }
    }
});

// Mobile modal close
modalCloseBtn.addEventListener("click", () => {
    vehicleModal.classList.add("hidden");
});

// Mobile modal button handlers
modalContent.addEventListener("click", function (e) {
    if (e.target.classList.contains("edit-service-mobile")) {
        const id = e.target.getAttribute("data-id");
        const service = servicesData.find(s => s.id === id);
        if (service) {
            // For mobile, we'll use a simple prompt-based edit
            const newPrice = prompt("Enter new price:", service.price);
            const newTime = prompt("Enter new time (minutes):", service.timeToComplete);

            if (newPrice !== null && newTime !== null) {
                const priceNum = parseFloat(newPrice);
                const timeNum = parseInt(newTime);

                if (!isNaN(priceNum) && priceNum >= 0 && !isNaN(timeNum) && timeNum > 0) {
                    service.price = priceNum;
                    service.timeToComplete = timeNum;
                    showToast(`Service "${service.serviceName}" updated successfully!`);
                    applyFiltersAndRender();
                    vehicleModal.classList.add("hidden");
                } else {
                    alert("Please enter valid values (price >= 0, time > 0)");
                }
            }
        }
    }

    if (e.target.classList.contains("deactivate-service-mobile")) {
        const id = e.target.getAttribute("data-id");
        const service = servicesData.find(s => s.id === id);
        if (service) {
            const actionText = service.active ? "deactivate" : "activate";
            showConfirmModal(
                `Are you sure you want to ${actionText} "${service.serviceName}"?`,
                () => {
                    service.active = !service.active;
                    if (!service.active) {
                        service.lastDateDeactivated = new Date().toISOString();
                    }
                    showToast(`Service "${service.serviceName}" ${service.active ? "activated" : "deactivated"} successfully!`);
                    applyFiltersAndRender();
                    vehicleModal.classList.add("hidden");
                }
            );
        }
    }
});

// Close modal when clicking outside
vehicleModal.addEventListener("click", (e) => {
    if (e.target === vehicleModal) {
        vehicleModal.classList.add("hidden");
    }
});

// Initial render
renderCurrentPage();

// Export functions for potential external use
window.serviceManagement = {
    getServices: () => servicesData,
    addService: (service) => {
        service.id = (servicesData.length + 1).toString();
        servicesData.unshift(service);
        applyFiltersAndRender();
    },
    updateService: (id, updates) => {
        const index = servicesData.findIndex(s => s.id === id);
        if (index !== -1) {
            servicesData[index] = { ...servicesData[index], ...updates };
            applyFiltersAndRender();
        }
    }
};

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
      <a href="./vehicles.html" class="block w-full text-left px-4 py-2 hover:bg-indigo-700 focus:outline-none" type="button">
        Add / Deactivate Vehicle
      </a>
      <a href="./services.html" class="block w-full text-left px-4 py-2 hover:bg-indigo-700 focus:outline-none" type="button">
        Add / Deactivate Service
      </a>
      <button id="add-service-vehicle-btn-mobile" class="block w-full text-left px-4 py-2 hover:bg-indigo-700 focus:outline-none" type="button">
        Add Service to Vehicle
      </button>
      <!-- Add more buttons here if needed -->
    `;

        menu_actions.parentElement.appendChild(dropdown);

        document.getElementById('add-service-vehicle-btn-mobile').addEventListener('click', () => {
            document.getElementById('add-service-modal').classList.remove('hidden');
        })

        document.getElementById('')
    });

    // Close dropdown if clicked outside
    document.addEventListener('click', () => {
        const dropdown = document.getElementById('pageActionsDropdown');
        if (dropdown) {
            dropdown.classList.add('hidden');
        }
    });




});