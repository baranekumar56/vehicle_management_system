localStorage.setItem('vms_current_page', 'packages');

// Sample data for packages
let packagesData = [
    {
        id: "1",
        brand: "Toyota",
        model: "Corolla",
        fuel: "Petrol",
        type: "four-wheeler",
        packageName: "Basic Maintenance Package",
        dateCreated: "2023-01-01T00:00:00Z",
        lastDateDeactivated: null,
        totalPrice: 149.99,
        totalTime: 90,
        servicesCount: 3,
        services: [
            { id: "1", name: "Oil Change", price: 49.99, time: 30 },
            { id: "2", name: "Tire Rotation", price: 50.00, time: 30 },
            { id: "3", name: "Brake Inspection", price: 50.00, time: 30 }
        ],
        active: true
    },
    {
        id: "2",
        brand: "Honda",
        model: "Civic",
        fuel: "Diesel",
        type: "four-wheeler",
        packageName: "Premium Service Package",
        dateCreated: "2023-02-15T00:00:00Z",
        lastDateDeactivated: null,
        totalPrice: 299.99,
        totalTime: 180,
        servicesCount: 5,
        services: [
            { id: "1", name: "Oil Change", price: 49.99, time: 30 },
            { id: "2", name: "Tire Rotation", price: 50.00, time: 30 },
            { id: "3", name: "Brake Inspection", price: 50.00, time: 30 },
            { id: "4", name: "Battery Check", price: 75.00, time: 45 },
            { id: "5", name: "Wheel Alignment", price: 75.00, time: 45 }
        ],
        active: false,
    },
    {
        id: "3",
        brand: "Tesla",
        model: "Model 3",
        fuel: "EV",
        type: "four-wheeler",
        packageName: "EV Maintenance Package",
        dateCreated: "2023-03-10T00:00:00Z",
        lastDateDeactivated: null,
        totalPrice: 199.99,
        totalTime: 120,
        servicesCount: 3,
        services: [
            { id: "1", name: "Battery Check", price: 99.99, time: 60 },
            { id: "2", name: "Tire Rotation", price: 50.00, time: 30 },
            { id: "3", name: "Brake Inspection", price: 50.00, time: 30 }
        ],
        active: true,
    }
];

// Available services for packages
const availableServices = [
    { id: "1", name: "Oil Change", price: 49.99, time: 30 },
    { id: "2", name: "Tire Rotation", price: 50.00, time: 30 },
    { id: "3", name: "Brake Inspection", price: 50.00, time: 30 },
    { id: "4", name: "Battery Check", price: 75.00, time: 45 },
    { id: "5", name: "Wheel Alignment", price: 75.00, time: 45 },
    { id: "6", name: "Air Filter Replacement", price: 40.00, time: 20 },
    { id: "7", name: "Spark Plug Replacement", price: 80.00, time: 60 },
    { id: "8", name: "Transmission Fluid Change", price: 120.00, time: 90 }
];

// Brand-model data for autocomplete
const brandModels = {
    Toyota: ['Corolla', 'Camry', 'RAV4', 'Highlander'],
    Honda: ['Civic', 'Accord', 'CR-V', 'Pilot'],
    Tesla: ['Model S', 'Model 3', 'Model X', 'Model Y'],
    Ford: ['F-150', 'Mustang', 'Escape', 'Explorer']
};

// Unified data tracking
let filteredData = [...packagesData];
let selectedDesktop = new Set();
let selectedMobile = new Set();

// Edit modal variables - declared globally
let editingPackageId = null;
let editingServices = [];

const rowsPerPage = 10;
let currentPageDesktop = 1;
let currentPageMobile = 1;

// Elements
const packagesTableBodyDesktop = document.getElementById("packagesTableBodyDesktop");
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

const packagesListMobile = document.getElementById("packagesListMobile");
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

const addPackageModal = document.getElementById("add-package-modal");
const openAddPackageModalBtn = document.getElementById("openAddPackageModalBtn");
const closeAddPackageModal = document.getElementById("closeAddPackageModal");
const addPackageForm = document.getElementById("addPackageForm");

const editPackageModal = document.getElementById("edit-package-modal");
const closeEditPackageModal = document.getElementById("closeEditPackageModal");
const editPackageForm = document.getElementById("editPackageForm");

const toast = document.getElementById("toast");
const confirmModal = document.getElementById("confirmModal");
const confirmText = document.getElementById("confirmText");
const confirmYes = document.getElementById("confirmYes");
const confirmNo = document.getElementById("confirmNo");

// Global functions for edit modal
function renderEditSelectedServices() {
    const editSelectedServicesList = document.getElementById("editSelectedServicesList");
    editSelectedServicesList.innerHTML = "";

    if (editingServices.length === 0) {
        editSelectedServicesList.innerHTML = '<p class="text-gray-500 text-center py-4">No services added yet</p>';
        return;
    }

    editingServices.forEach(service => {
        const serviceItem = document.createElement("div");
        serviceItem.className = "service-item";
        serviceItem.innerHTML = `
                    <div>
                        <span class="font-medium">${service.name}</span>
                        <div class="text-sm text-gray-600">${service.price} | ${service.time} min</div>
                    </div>
                    <button type="button" class="text-red-600 hover:text-red-800" data-service-id="${service.id}">
                        Remove
                    </button>
                `;
        editSelectedServicesList.appendChild(serviceItem);
    });

    // Add event listeners to remove buttons
    editSelectedServicesList.querySelectorAll("button").forEach(button => {
        button.addEventListener("click", (e) => {
            const serviceId = e.target.closest("button").dataset.serviceId;
            removeServiceFromEditPackage(serviceId);
        });
    });
}

function updateEditTotals() {
    const totalPrice = editingServices.reduce((sum, service) => sum + service.price, 0);
    const totalTime = editingServices.reduce((sum, service) => sum + service.time, 0);

    document.getElementById("editTotalPrice").textContent = totalPrice.toFixed(2);
    document.getElementById("editTotalTime").textContent = totalTime;
    document.getElementById("editServicesCount").textContent = editingServices.length;
}

function addServiceToEditPackage(service) {
    if (!editingServices.some(s => s.id === service.id)) {
        editingServices.push(service);
        renderEditSelectedServices();
        updateEditTotals();
    }
}

function removeServiceFromEditPackage(serviceId) {
    editingServices = editingServices.filter(s => s.id !== serviceId);
    renderEditSelectedServices();
    updateEditTotals();
}

// Open edit package modal
function openEditPackageModal(packageId) {
    const packageToEdit = packagesData.find(p => p.id === packageId);
    if (!packageToEdit) return;

    editingPackageId = packageId;
    editingServices = [...packageToEdit.services];

    // Populate form fields
    document.getElementById("editPackageBrand").value = packageToEdit.brand;
    document.getElementById("editPackageModel").value = packageToEdit.model;
    document.getElementById("editPackageFuel").value = packageToEdit.fuel;
    document.getElementById("editPackageType").value = packageToEdit.type;
    document.getElementById("editPackageName").value = packageToEdit.packageName;

    // Render selected services and update totals
    renderEditSelectedServices();
    updateEditTotals();

    // Show modal
    editPackageModal.classList.remove("hidden");
}

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
    renderDesktopTable();
    renderMobileList();
    setupEventListeners();
    setupPackageModal();
    setupEditPackageModal();
});

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    searchBtnDesktop.addEventListener("click", () => handleSearch(searchInputDesktop.value));
    searchInputDesktop.addEventListener("keypress", (e) => {
        if (e.key === "Enter") handleSearch(searchInputDesktop.value);
    });

    searchBtnMobile.addEventListener("click", () => handleSearch(searchInputMobile.value));
    searchInputMobile.addEventListener("keypress", (e) => {
        if (e.key === "Enter") handleSearch(searchInputMobile.value);
    });

    // Filter functionality
    filterBtnDesktop.addEventListener("click", () => {
        filterPanelDesktop.classList.toggle("hidden");
    });

    filterBtnMobile.addEventListener("click", () => {
        filterPanelMobile.classList.toggle("hidden");
    });

    // Filter forms
    filterFormDesktop.addEventListener("submit", (e) => {
        e.preventDefault();
        applyFilters("desktop");
        filterPanelDesktop.classList.add("hidden");
    });

    filterFormMobile.addEventListener("submit", (e) => {
        e.preventDefault();
        applyFilters("mobile");
        filterPanelMobile.classList.add("hidden");
    });

    // Brand selection for model population
    document.getElementById("filterBrandDesktop").addEventListener("change", (e) => {
        populateModelDropdown("filterModelDesktop", e.target.value);
    });

    document.getElementById("filterBrandMobile").addEventListener("change", (e) => {
        populateModelDropdown("filterModelMobile", e.target.value);
    });

    // Pagination
    prevPageDesktop.addEventListener("click", () => {
        if (currentPageDesktop > 1) {
            currentPageDesktop--;
            renderDesktopTable();
        }
    });

    nextPageDesktop.addEventListener("click", () => {
        const totalPages = Math.ceil(filteredData.length / rowsPerPage);
        if (currentPageDesktop < totalPages) {
            currentPageDesktop++;
            renderDesktopTable();
        }
    });

    prevPageMobile.addEventListener("click", () => {
        if (currentPageMobile > 1) {
            currentPageMobile--;
            renderMobileList();
        }
    });

    nextPageMobile.addEventListener("click", () => {
        const totalPages = Math.ceil(filteredData.length / rowsPerPage);
        if (currentPageMobile < totalPages) {
            currentPageMobile++;
            renderMobileList();
        }
    });

    // Select all functionality
    selectAllDesktop.addEventListener("change", (e) => {
        const checkboxes = packagesTableBodyDesktop.querySelectorAll("input[type='checkbox']");
        checkboxes.forEach((checkbox) => {
            if (!checkbox.disabled) {
                checkbox.checked = e.target.checked;
                const packageId = checkbox.dataset.id;
                if (e.target.checked) {
                    selectedDesktop.add(packageId);
                } else {
                    selectedDesktop.delete(packageId);
                }
            }
        });
        updateBatchButtons();
    });

    selectAllFilteredData.addEventListener("change", (e) => {
        const checkboxes = packagesListMobile.querySelectorAll("input[type='checkbox']");
        checkboxes.forEach((checkbox) => {
            if (!checkbox.disabled) {
                checkbox.checked = e.target.checked;
                const packageId = checkbox.dataset.id;
                if (e.target.checked) {
                    selectedMobile.add(packageId);
                } else {
                    selectedMobile.delete(packageId);
                }
            }
        });
        updateBatchButtons();
    });

    // Batch actions
    batchActivateDesktop.addEventListener("click", () => handleBatchAction("activate"));
    batchDeactivateDesktop.addEventListener("click", () => handleBatchAction("deactivate"));
    batchActivateMobile.addEventListener("click", () => handleBatchAction("activate"));
    batchDeactivateMobile.addEventListener("click", () => handleBatchAction("deactivate"));

    // Modal open/close
    openAddPackageModalBtn.addEventListener("click", () => {
        addPackageModal.classList.remove("hidden");
    });

    closeAddPackageModal.addEventListener("click", () => {
        addPackageModal.classList.add("hidden");
        resetAddPackageForm();
    });

    closeEditPackageModal.addEventListener("click", () => {
        editPackageModal.classList.add("hidden");
    });

    // Confirmation modal
    confirmNo.addEventListener("click", () => {
        confirmModal.classList.add("hidden");
    });

    // Close modals when clicking outside
    document.addEventListener("click", (e) => {
        if (e.target === addPackageModal) {
            addPackageModal.classList.add("hidden");
            resetAddPackageForm();
        }
        if (e.target === editPackageModal) {
            editPackageModal.classList.add("hidden");
        }
        if (e.target === confirmModal) {
            confirmModal.classList.add("hidden");
        }
        if (e.target === filterPanelDesktop || e.target.closest("#filterPanelDesktop")) return;
        if (!e.target.closest("#filterBtnDesktop") && !filterPanelDesktop.classList.contains("hidden")) {
            filterPanelDesktop.classList.add("hidden");
        }
        if (e.target === filterPanelMobile || e.target.closest("#filterPanelMobile")) return;
        if (!e.target.closest("#filterBtnMobile") && !filterPanelMobile.classList.contains("hidden")) {
            filterPanelMobile.classList.add("hidden");
        }
    });

    // Close modals with Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            addPackageModal.classList.add("hidden");
            editPackageModal.classList.add("hidden");
            confirmModal.classList.add("hidden");
            resetAddPackageForm();
        }
    });
}

// Setup package modal functionality
function setupPackageModal() {
    const packageBrandInput = document.getElementById("packageBrandInput");
    const packageBrandSuggestionList = document.getElementById("packageBrandSuggestionList");
    const packageModelSelect = document.getElementById("packageModelSelect");
    const packageFuelSelect = document.getElementById("packageFuelSelect");
    const vehicleTypeRadios = document.querySelectorAll("input[name='vehicleType']");
    const serviceSearchInput = document.getElementById("serviceSearchInput");
    const serviceSuggestionList = document.getElementById("serviceSuggestionList");
    const selectedServicesList = document.getElementById("selectedServicesList");
    const totalPriceElement = document.getElementById("totalPrice");
    const totalTimeElement = document.getElementById("totalTime");
    const servicesCountElement = document.getElementById("servicesCount");
    const addPackageSubmitBtn = document.getElementById("addPackageSubmitBtn");

    let selectedServices = [];

    // Brand autocomplete
    packageBrandInput.addEventListener("input", (e) => {
        const value = e.target.value.toLowerCase();
        const suggestions = Object.keys(brandModels).filter(brand =>
            brand.toLowerCase().includes(value)
        );

        packageBrandSuggestionList.innerHTML = "";
        if (suggestions.length > 0 && value.length > 0) {
            suggestions.forEach(brand => {
                const li = document.createElement("li");
                li.textContent = brand;
                li.className = "px-3 py-2 hover:bg-gray-100 cursor-pointer";
                li.addEventListener("click", () => {
                    packageBrandInput.value = brand;
                    packageBrandSuggestionList.classList.add("hidden");
                    enableDependentFields();
                    populateModelDropdown("packageModelSelect", brand);
                });
                packageBrandSuggestionList.appendChild(li);
            });
            packageBrandSuggestionList.classList.remove("hidden");
        } else {
            packageBrandSuggestionList.classList.add("hidden");
        }
    });

    // Service search and selection
    serviceSearchInput.addEventListener("input", (e) => {
        const value = e.target.value.toLowerCase();
        const suggestions = availableServices.filter(service =>
            service.name.toLowerCase().includes(value) &&
            !selectedServices.some(s => s.id === service.id)
        );

        serviceSuggestionList.innerHTML = "";
        if (suggestions.length > 0 && value.length > 0) {
            suggestions.forEach(service => {
                const li = document.createElement("li");
                li.className = "px-3 py-2 hover:bg-gray-100 cursor-pointer flex justify-between";
                li.innerHTML = `
                            <span>${service.name}</span>
                            <span class="text-gray-500">${service.price} | ${service.time} min</span>
                        `;
                li.addEventListener("click", () => {
                    addServiceToPackage(service);
                    serviceSearchInput.value = "";
                    serviceSuggestionList.classList.add("hidden");
                });
                serviceSuggestionList.appendChild(li);
            });
            serviceSuggestionList.classList.remove("hidden");
        } else {
            serviceSuggestionList.classList.add("hidden");
        }
    });

    // Close suggestion lists when clicking outside
    document.addEventListener("click", (e) => {
        if (!e.target.closest("#packageBrandInput") && !e.target.closest("#packageBrandSuggestionList")) {
            packageBrandSuggestionList.classList.add("hidden");
        }
        if (!e.target.closest("#serviceSearchInput") && !e.target.closest("#serviceSuggestionList")) {
            serviceSuggestionList.classList.add("hidden");
        }
    });

    // Enable dependent fields after brand selection
    function enableDependentFields() {
        packageModelSelect.disabled = false;
        packageFuelSelect.disabled = false;
        vehicleTypeRadios.forEach(radio => radio.disabled = false);
    }

    // Add service to package
    function addServiceToPackage(service) {
        if (!selectedServices.some(s => s.id === service.id)) {
            selectedServices.push(service);
            renderSelectedServices();
            updateTotals();
            validateForm();
        }
    }

    // Remove service from package
    function removeServiceFromPackage(serviceId) {
        selectedServices = selectedServices.filter(s => s.id !== serviceId);
        renderSelectedServices();
        updateTotals();
        validateForm();
    }

    // Render selected services
    function renderSelectedServices() {
        selectedServicesList.innerHTML = "";

        if (selectedServices.length === 0) {
            selectedServicesList.innerHTML = '<p class="text-gray-500 text-center py-4">No services added yet</p>';
            return;
        }

        selectedServices.forEach(service => {
            const serviceItem = document.createElement("div");
            serviceItem.className = "service-item";
            serviceItem.innerHTML = `
                        <div>
                            <span class="font-medium">${service.name}</span>
                            <div class="text-sm text-gray-600">${service.price} | ${service.time} min</div>
                        </div>
                        <button type="button" class="text-red-600 hover:text-red-800" data-service-id="${service.id}">
                            Remove
                        </button>
                    `;
            selectedServicesList.appendChild(serviceItem);
        });

        // Add event listeners to remove buttons
        selectedServicesList.querySelectorAll("button").forEach(button => {
            button.addEventListener("click", (e) => {
                const serviceId = e.target.closest("button").dataset.serviceId;
                removeServiceFromPackage(serviceId);
            });
        });
    }

    // Update totals
    function updateTotals() {
        const totalPrice = selectedServices.reduce((sum, service) => sum + service.price, 0);
        const totalTime = selectedServices.reduce((sum, service) => sum + service.time, 0);

        totalPriceElement.textContent = totalPrice.toFixed(2);
        totalTimeElement.textContent = totalTime;
        servicesCountElement.textContent = selectedServices.length;
    }

    // Form validation
    function validateForm() {
        const brand = packageBrandInput.value.trim();
        const model = packageModelSelect.value;
        const fuel = packageFuelSelect.value;
        const vehicleType = document.querySelector("input[name='vehicleType']:checked");
        const packageName = document.getElementById("packageNameInput").value.trim();

        const isValid = brand && model && fuel && vehicleType && packageName && selectedServices.length > 0;
        addPackageSubmitBtn.disabled = !isValid;

        return isValid;
    }

    // Form submission
    addPackageForm.addEventListener("submit", (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const brand = packageBrandInput.value.trim();
        const model = packageModelSelect.value;
        const fuel = packageFuelSelect.value;
        const vehicleType = document.querySelector("input[name='vehicleType']:checked").value;
        const packageName = document.getElementById("packageNameInput").value.trim();

        // Create new package
        const newPackage = {
            id: (packagesData.length + 1).toString(),
            brand,
            model,
            fuel,
            type: vehicleType,
            packageName,
            dateCreated: new Date().toISOString(),
            lastDateDeactivated: null,
            totalPrice: selectedServices.reduce((sum, service) => sum + service.price, 0),
            totalTime: selectedServices.reduce((sum, service) => sum + service.time, 0),
            servicesCount: selectedServices.length,
            services: [...selectedServices],
            active: true
        };

        packagesData.push(newPackage);
        filteredData = [...packagesData];

        // Reset form and close modal
        resetAddPackageForm();
        addPackageModal.classList.add("hidden");

        // Update UI
        renderDesktopTable();
        renderMobileList();

        // Show success message
        showToast("Package created successfully!");
    });

    // Real-time validation for form fields
    addPackageForm.addEventListener("input", validateForm);
    addPackageForm.addEventListener("change", validateForm);
}

// Setup edit package modal functionality
function setupEditPackageModal() {
    const editServiceSearchInput = document.getElementById("editServiceSearchInput");
    const editServiceSuggestionList = document.getElementById("editServiceSuggestionList");

    // Service search and selection for edit modal
    editServiceSearchInput.addEventListener("input", (e) => {
        const value = e.target.value.toLowerCase();
        const suggestions = availableServices.filter(service =>
            service.name.toLowerCase().includes(value) &&
            !editingServices.some(s => s.id === service.id)
        );

        editServiceSuggestionList.innerHTML = "";
        if (suggestions.length > 0 && value.length > 0) {
            suggestions.forEach(service => {
                const li = document.createElement("li");
                li.className = "px-3 py-2 hover:bg-gray-100 cursor-pointer flex justify-between";
                li.innerHTML = `
                            <span>${service.name}</span>
                            <span class="text-gray-500">${service.price} | ${service.time} min</span>
                        `;
                li.addEventListener("click", () => {
                    addServiceToEditPackage(service);
                    editServiceSearchInput.value = "";
                    editServiceSuggestionList.classList.add("hidden");
                });
                editServiceSuggestionList.appendChild(li);
            });
            editServiceSuggestionList.classList.remove("hidden");
        } else {
            editServiceSuggestionList.classList.add("hidden");
        }
    });

    // Close suggestion list when clicking outside
    document.addEventListener("click", (e) => {
        if (!e.target.closest("#editServiceSearchInput") && !e.target.closest("#editServiceSuggestionList")) {
            editServiceSuggestionList.classList.add("hidden");
        }
    });

    // Form submission for edit
    editPackageForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const packageName = document.getElementById("editPackageName").value.trim();

        if (!packageName) {
            document.getElementById("editPackageNameError").classList.remove("hidden");
            return;
        }

        // Update package
        const packageIndex = packagesData.findIndex(p => p.id === editingPackageId);
        if (packageIndex !== -1) {
            packagesData[packageIndex].packageName = packageName;
            packagesData[packageIndex].services = [...editingServices];
            packagesData[packageIndex].totalPrice = editingServices.reduce((sum, service) => sum + service.price, 0);
            packagesData[packageIndex].totalTime = editingServices.reduce((sum, service) => sum + service.time, 0);
            packagesData[packageIndex].servicesCount = editingServices.length;

            filteredData = [...packagesData];

            // Close modal
            editPackageModal.classList.add("hidden");

            // Update UI
            renderDesktopTable();
            renderMobileList();

            // Show success message
            showToast("Package updated successfully!");
        }
    });
}

// Reset add package form
function resetAddPackageForm() {
    addPackageForm.reset();
    document.getElementById("packageModelSelect").disabled = true;
    document.getElementById("packageFuelSelect").disabled = true;
    document.querySelectorAll("input[name='vehicleType']").forEach(radio => radio.disabled = true);

    document.getElementById("selectedServicesList").innerHTML =
        '<p class="text-gray-500 text-center py-4">No services added yet</p>';
    document.getElementById("totalPrice").textContent = "0.00";
    document.getElementById("totalTime").textContent = "0";
    document.getElementById("servicesCount").textContent = "0";

    document.getElementById("addPackageSubmitBtn").disabled = true;
}

// Render desktop table
function renderDesktopTable() {
    const startIndex = (currentPageDesktop - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const pageData = filteredData.slice(startIndex, endIndex);

    packagesTableBodyDesktop.innerHTML = "";

    if (pageData.length === 0) {
        packagesTableBodyDesktop.innerHTML = `
                    <tr>
                        <td colspan="12" class="py-4 text-center text-gray-500">No packages found</td>
                    </tr>
                `;
        updatePaginationInfo("desktop");
        return;
    }

    pageData.forEach(pkg => {
        const row = document.createElement("tr");
        row.className = pkg.active ? "" : "bg-red-50";

        const lastDeactivated = pkg.lastDateDeactivated
            ? new Date(pkg.lastDateDeactivated).toLocaleDateString()
            : "N/A";

        row.innerHTML = `
                    <td class="py-2 px-3 border border-gray-300">
                        <input type="checkbox" data-id="${pkg.id}" ${!pkg.active ? 'disabled' : ''} />
                    </td>
                    <td class="py-2 px-4 border border-gray-300">${pkg.brand}</td>
                    <td class="py-2 px-4 border border-gray-300">${pkg.model}</td>
                    <td class="py-2 px-4 border border-gray-300">${pkg.fuel}</td>
                    <td class="py-2 px-4 border border-gray-300 capitalize">${pkg.type}</td>
                    <td class="py-2 px-4 border border-gray-300">${pkg.packageName}</td>
                    <td class="py-2 px-4 border border-gray-300">${new Date(pkg.dateCreated).toLocaleDateString()}</td>
                    <td class="py-2 px-4 border border-gray-300">${lastDeactivated}</td>
                    <td class="py-2 px-4 border border-gray-300">${pkg.totalPrice.toFixed(2)}</td>
                    <td class="py-2 px-4 border border-gray-300">${pkg.totalTime}</td>
                    <td class="py-2 px-4 border border-gray-300">${pkg.servicesCount}</td>
                    <td class="py-2 px-4 border border-gray-300">
                        <div class="flex space-x-2">
                            <button class="text-blue-600 hover:text-blue-800 edit-btn" data-id="${pkg.id}">Edit</button>
                            <button class="${pkg.active ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'} status-btn" data-id="${pkg.id}">
                                ${pkg.active ? 'Deactivate' : 'Activate'}
                            </button>
                        </div>
                    </td>
                `;

        packagesTableBodyDesktop.appendChild(row);
    });

    // Add event listeners to checkboxes and buttons
    packagesTableBodyDesktop.querySelectorAll("input[type='checkbox']").forEach(checkbox => {
        checkbox.addEventListener("change", (e) => {
            const packageId = e.target.dataset.id;
            if (e.target.checked) {
                selectedDesktop.add(packageId);
            } else {
                selectedDesktop.delete(packageId);
                selectAllDesktop.checked = false;
            }
            updateBatchButtons();
        });
    });

    packagesTableBodyDesktop.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const packageId = e.target.dataset.id;
            openEditPackageModal(packageId);
        });
    });

    packagesTableBodyDesktop.querySelectorAll(".status-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const packageId = e.target.dataset.id;
            const packagee = packagesData.find(p => p.id === packageId);
            if (packagee) {
                showConfirmModal(
                    `Are you sure you want to ${packagee.active ? 'deactivate' : 'activate'} this package?`,
                    () => togglePackageStatus(packageId)
                );
            }
        });
    });

    updatePaginationInfo("desktop");
    updateBatchButtons();
}

// Render mobile list
function renderMobileList() {
    const startIndex = (currentPageMobile - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const pageData = filteredData.slice(startIndex, endIndex);

    packagesListMobile.innerHTML = "";

    if (pageData.length === 0) {
        packagesListMobile.innerHTML = `
                    <div class="text-center py-4 text-gray-500">No packages found</div>
                `;
        updatePaginationInfo("mobile");
        return;
    }

    pageData.forEach(pkg => {
        const lastDeactivated = pkg.lastDateDeactivated
            ? new Date(pkg.lastDateDeactivated).toLocaleDateString()
            : "N/A";

        const card = document.createElement("div");
        card.className = `bg-white rounded-lg shadow p-4 ${pkg.active ? "" : "border-l-4 border-red-500"}`;

        card.innerHTML = `
                    <div class="flex justify-between items-center mb-2">
                        <div class="flex items-center">
                            <input type="checkbox" data-id="${pkg.id}" class="mr-2" ${!pkg.active ? 'disabled' : ''} />
                            <div>
                                <h3 class="font-semibold">${pkg.packageName}</h3>
                                <div class="text-xs text-gray-600">
                                    ${pkg.brand} ${pkg.model} | ${lastDeactivated} | ${pkg.totalPrice.toFixed(2)} | ${pkg.totalTime} min
                                </div>
                            </div>
                        </div>
                        <button class="expand-btn rotate-0" data-id="${pkg.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>
                    <div class="expandable-content" id="expandable-${pkg.id}">
                        <div class="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                            <div><span class="font-medium">Brand:</span> ${pkg.brand}</div>
                            <div><span class="font-medium">Model:</span> ${pkg.model}</div>
                            <div><span class="font-medium">Fuel:</span> ${pkg.fuel}</div>
                            <div><span class="font-medium">Type:</span> ${pkg.type}</div>
                            <div><span class="font-medium">Price:</span> ${pkg.totalPrice.toFixed(2)}</div>
                            <div><span class="font-medium">Time:</span> ${pkg.totalTime} min</div>
                            <div><span class="font-medium">Services:</span> ${pkg.servicesCount}</div>
                            <div><span class="font-medium">Created:</span> ${new Date(pkg.dateCreated).toLocaleDateString()}</div>
                        </div>
                        <div class="mb-3">
                            <h4 class="font-medium mb-1">Services Included:</h4>
                            <ul class="text-sm text-gray-600 list-disc list-inside">
                                ${pkg.services.map(service => `<li>${service.name} - ${service.price} (${service.time} min)</li>`).join('')}
                            </ul>
                        </div>
                        <div class="flex justify-between">
                            <button class="text-blue-600 hover:text-blue-800 text-sm edit-btn" data-id="${pkg.id}">Edit</button>
                            <button class="${pkg.active ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'} text-sm status-btn" data-id="${pkg.id}">
                                ${pkg.active ? 'Deactivate' : 'Activate'}
                            </button>
                        </div>
                    </div>
                `;

        packagesListMobile.appendChild(card);
    });

    // Add event listeners to checkboxes and buttons
    packagesListMobile.querySelectorAll("input[type='checkbox']").forEach(checkbox => {
        checkbox.addEventListener("change", (e) => {
            const packageId = e.target.dataset.id;
            if (e.target.checked) {
                selectedMobile.add(packageId);
            } else {
                selectedMobile.delete(packageId);
                selectAllFilteredData.checked = false;
            }
            updateBatchButtons();
        });
    });

    packagesListMobile.querySelectorAll(".expand-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const packageId = e.target.closest(".expand-btn").dataset.id;
            const expandableContent = document.getElementById(`expandable-${packageId}`);
            const expandBtn = e.target.closest(".expand-btn");

            if (expandableContent.classList.contains("expanded")) {
                expandableContent.classList.remove("expanded");
                expandBtn.classList.remove("rotate-180");
                expandBtn.classList.add("rotate-0");
            } else {
                expandableContent.classList.add("expanded");
                expandBtn.classList.remove("rotate-0");
                expandBtn.classList.add("rotate-180");
            }
        });
    });

    packagesListMobile.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const packageId = e.target.dataset.id;
            openEditPackageModal(packageId);
        });
    });

    packagesListMobile.querySelectorAll(".status-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const packageId = e.target.dataset.id;
            const packagee = packagesData.find(p => p.id === packageId);
            if (packagee) {
                showConfirmModal(
                    `Are you sure you want to ${packagee.active ? 'deactivate' : 'activate'} this package?`,
                    () => togglePackageStatus(packageId)
                );
            }
        });
    });

    updatePaginationInfo("mobile");
    updateBatchButtons();
}

// Update pagination info
function updatePaginationInfo(view) {
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    if (view === "desktop") {
        pageInfoDesktop.textContent = `Page ${currentPageDesktop} of ${totalPages || 1}`;
        prevPageDesktop.disabled = currentPageDesktop === 1;
        nextPageDesktop.disabled = currentPageDesktop === totalPages || totalPages === 0;
    } else {
        pageInfoMobile.textContent = `Page ${currentPageMobile} of ${totalPages || 1}`;
        prevPageMobile.disabled = currentPageMobile === 1;
        nextPageMobile.disabled = currentPageMobile === totalPages || totalPages === 0;
    }
}

// Update batch action buttons
function updateBatchButtons() {
    const hasSelectedDesktop = selectedDesktop.size > 0;
    const hasSelectedMobile = selectedMobile.size > 0;

    batchActivateDesktop.disabled = !hasSelectedDesktop;
    batchDeactivateDesktop.disabled = !hasSelectedDesktop;
    batchActivateMobile.disabled = !hasSelectedMobile;
    batchDeactivateMobile.disabled = !hasSelectedMobile;
}

// Handle search
function handleSearch(query) {
    if (!query.trim()) {
        filteredData = [...packagesData];
    } else {
        const lowerQuery = query.toLowerCase();
        filteredData = packagesData.filter(pkg =>
            pkg.packageName.toLowerCase().includes(lowerQuery) ||
            pkg.brand.toLowerCase().includes(lowerQuery) ||
            pkg.model.toLowerCase().includes(lowerQuery)
        );
    }

    currentPageDesktop = 1;
    currentPageMobile = 1;
    selectedDesktop.clear();
    selectedMobile.clear();
    selectAllDesktop.checked = false;
    selectAllFilteredData.checked = false;

    renderDesktopTable();
    renderMobileList();
}

// Apply filters
function applyFilters(view) {
    const form = view === "desktop" ? filterFormDesktop : filterFormMobile;
    const formData = new FormData(form);

    filteredData = packagesData.filter(pkg => {
        // Date filter
        const dateFrom = formData.get("dateFrom");
        const dateTo = formData.get("dateTo");
        const packageDate = new Date(pkg.dateCreated);

        if (dateFrom && packageDate < new Date(dateFrom)) return false;
        if (dateTo) {
            const toDate = new Date(dateTo);
            toDate.setDate(toDate.getDate() + 1); // Include the end date
            if (packageDate >= toDate) return false;
        }

        // Brand filter
        const brand = formData.get("brand");
        if (brand !== "All" && pkg.brand !== brand) return false;

        // Model filter
        const model = formData.get("model");
        if (model !== "All" && pkg.model !== model) return false;

        // Price filter
        const priceFrom = parseFloat(formData.get("priceFrom"));
        const priceTo = parseFloat(formData.get("priceTo"));
        if (priceFrom && pkg.totalPrice < priceFrom) return false;
        if (priceTo && pkg.totalPrice > priceTo) return false;

        // Time filter
        const timeFrom = parseInt(formData.get("timeFrom"));
        const timeTo = parseInt(formData.get("timeTo"));
        if (timeFrom && pkg.totalTime < timeFrom) return false;
        if (timeTo && pkg.totalTime > timeTo) return false;

        return true;
    });

    currentPageDesktop = 1;
    currentPageMobile = 1;
    selectedDesktop.clear();
    selectedMobile.clear();
    selectAllDesktop.checked = false;
    selectAllFilteredData.checked = false;

    renderDesktopTable();
    renderMobileList();
}

// Populate model dropdown based on brand
function populateModelDropdown(selectId, brand) {
    const select = document.getElementById(selectId);
    select.innerHTML = '<option value="All">All</option>';

    if (brand && brand !== "All" && brandModels[brand]) {
        brandModels[brand].forEach(model => {
            const option = document.createElement("option");
            option.value = model;
            option.textContent = model;
            select.appendChild(option);
        });
    }
}

// Handle batch actions
function handleBatchAction(action) {
    const selectedIds = [...selectedDesktop, ...selectedMobile];
    if (selectedIds.length === 0) return;

    showConfirmModal(
        `Are you sure you want to ${action} ${selectedIds.length} package(s)?`,
        () => {
            selectedIds.forEach(id => {
                if (action === "activate") {
                    activatePackage(id);
                } else {
                    deactivatePackage(id);
                }
            });

            selectedDesktop.clear();
            selectedMobile.clear();
            selectAllDesktop.checked = false;
            selectAllFilteredData.checked = false;

            renderDesktopTable();
            renderMobileList();

            showToast(`${selectedIds.length} package(s) ${action}d successfully!`);
        }
    );
}

// Toggle package status
function togglePackageStatus(packageId) {
    const packagee = packagesData.find(p => p.id === packageId);
    if (!packagee) return;

    if (packagee.active) {
        deactivatePackage(packageId);
    } else {
        activatePackage(packageId);
    }

    renderDesktopTable();
    renderMobileList();

    showToast(`Package ${packagee.active ? 'deactivated' : 'activated'} successfully!`);
}

// Activate package
function activatePackage(packageId) {
    const packagee = packagesData.find(p => p.id === packageId);
    if (packagee) {
        packagee.active = true;
        packagee.lastDateDeactivated = null;
    }
}

// Deactivate package
function deactivatePackage(packageId) {
    const packagee = packagesData.find(p => p.id === packageId);
    if (packagee) {
        packagee.active = false;
        packagee.lastDateDeactivated = new Date().toISOString();
    }
}

// Show confirmation modal
function showConfirmModal(message, onConfirm) {
    confirmText.textContent = message;
    confirmModal.classList.remove("hidden");

    confirmYes.onclick = () => {
        confirmModal.classList.add("hidden");
        onConfirm();
    };
}

// Show toast notification
function showToast(message) {
    toast.textContent = message;
    toast.classList.remove("opacity-0");

    setTimeout(() => {
        toast.classList.add("opacity-0");
    }, 3000);
}

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
      <button id="add-package-btn-mobile" class="block w-full text-left px-4 py-2 hover:bg-indigo-700 focus:outline-none" type="button">
        Add Package
      </button>
      <!-- Add more buttons here if needed -->
    `;

        menu_actions.parentElement.appendChild(dropdown);

        document.getElementById('add-package-btn-mobile').addEventListener('click', () => {
            document.getElementById('add-package-modal').classList.remove('hidden')
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
