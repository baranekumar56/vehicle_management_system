const bookings = [
    {
        id: 66886,
        bookerId: 45454,
        name: 'John Doe',
        date: '2025-10-12',
        time: '9:00 AM',
        category: 'Service',
        status: 'Booked',
        email: 'john@example.com',
        phone: '+1234567890',
        vehicle: 'Toyota Camry',
        vehicleNo: 'TN 01 AB 1234',
        notes: 'Regular service checkup',
        totalAmount: 4700,
        advancePaid: 1000,
        services: [
            { id: 1, name: "Oil Change", amount: 1200, required: true, active: true },
            { id: 2, name: "Wheel Alignment", amount: 3000, required: false, active: true },
            { id: 3, name: "Brake Check", amount: 500, required: false, active: true }
        ]
    },
    {
        id: 545454,
        bookerId: 44548,
        name: 'Barane Smith',
        date: '2025-10-13',
        time: '11:00 AM',
        category: 'Repair',
        status: 'Ongoing',
        email: 'barane@example.com',
        phone: '+1234567891',
        vehicle: 'Honda Civic',
        vehicleNo: 'TN 01 BC 1234',
        notes: 'Brake repair needed',
        totalAmount: 14000,
        advancePaid: 7000,
        services: [
            { id: 10, name: "Engine Repair", amount: 12000, required: true, active: true },
            { id: 11, name: "Battery Check", amount: 2000, required: false, active: true }
        ]
    },
    {
        id: 654646,
        bookerId: 78789,
        name: 'Kumar Patel',
        date: '2025-10-15',
        time: '2:00 PM',
        category: 'Service',
        status: 'Completed',
        email: 'kumar@example.com',
        phone: '+1234567892',
        vehicle: 'Ford Focus',
        vehicleNo: 'TN 99 XY 9876',
        notes: 'Oil change and inspection',
        totalAmount: 3500,
        advancePaid: 3500,
        services: [
            { id: 20, name: "General Service", amount: 3500, required: true, active: true }
        ]
    },
    {
        id: 789012,
        bookerId: 11111,
        name: 'Alice Johnson',
        date: '2025-10-16',
        time: '10:00 AM',
        category: 'Maintenance',
        status: 'Pending',
        email: 'alice@example.com',
        phone: '+1234567893',
        vehicle: 'BMW X3',
        vehicleNo: 'TN 02 CD 5678',
        notes: 'Scheduled maintenance',
        totalAmount: 3000,
        advancePaid: 0,
        services: [
            { id: 30, name: "AC Service", amount: 2500, required: true, active: true },
            { id: 31, name: "Car Wash", amount: 500, required: false, active: true }
        ]
    },
    {
        id: 890123,
        bookerId: 22222,
        name: 'Bob Wilson',
        date: '2025-10-17',
        time: '3:00 PM',
        category: 'Inspection',
        status: 'Halted',
        email: 'bob@example.com',
        phone: '+1234567894',
        vehicle: 'Mercedes C-Class',
        vehicleNo: 'TN 03 EF 9012',
        notes: 'Annual inspection',
        totalAmount: 15000,
        advancePaid: 0,
        services: [
            { id: 40, name: "Transmission Repair", amount: 15000, required: true, active: true }
        ]
    },
    {
        id: 901234,
        bookerId: 33333,
        name: 'Charlie Brown',
        date: '2025-10-18',
        time: '4:00 PM',
        category: 'Service',
        status: 'Canceled',
        email: 'charlie@example.com',
        phone: '+1234567895',
        vehicle: 'Audi A4',
        vehicleNo: 'TN 04 GH 3456',
        notes: 'Tire rotation and balance',
        totalAmount: 15000,
        advancePaid: 0,
        services: [
            { id: 50, name: "Suspension Repair", amount: 8000, required: true, active: true },
            { id: 51, name: "Tire Replacement", amount: 7000, required: false, active: true }
        ]
    }
];

let filteredBookings = [...bookings];

// Elements references
const tableBodyDesktop = document.getElementById("bookingTableBodyDesktop");
const prevBtnDesktop = document.getElementById("prevPageDesktop");
const nextBtnDesktop = document.getElementById("nextPageDesktop");
const pageInfoDesktop = document.getElementById("pageInfoDesktop");
const searchInputDesktop = document.getElementById("searchInputDesktop");
const searchBtnDesktop = document.getElementById("searchBtnDesktop");
const filterCategoryDesktop = document.getElementById("filterCategoryDesktop");
const filterStatusDesktop = document.getElementById("filterStatusDesktop");
const filterDateFromDesktop = document.getElementById("filterDateFromDesktop");
const filterDateToDesktop = document.getElementById("filterDateToDesktop");
const filterBtnDesktop = document.getElementById("filterBtnDesktop");
const filterPanelDesktop = document.getElementById("filterPanelDesktop");
const applyFilterDesktop = document.getElementById("applyFilterDesktop");
const clearFilterDesktop = document.getElementById("clearFilterDesktop");

const bookingListMobile = document.getElementById("bookingListMobile");
const prevBtnMobile = document.getElementById("prevPageMobile");
const nextBtnMobile = document.getElementById("nextPageMobile");
const pageInfoMobile = document.getElementById("pageInfoMobile");
const searchInputMobile = document.getElementById("searchInputMobile");
const searchBtnMobile = document.getElementById("searchBtnMobile");
const filterBtnMobile = document.getElementById("filterBtnMobile");
const filterPanelMobile = document.getElementById("filterPanelMobile");
const applyFilterMobile = document.getElementById("applyFilterMobile");
const clearFilterMobile = document.getElementById("clearFilterMobile");
const filterCategoryMobile = document.getElementById("filterCategoryMobile");
const filterStatusMobile = document.getElementById("filterStatusMobile");
const filterDateFromMobile = document.getElementById("filterDateFromMobile");
const filterDateToMobile = document.getElementById("filterDateToMobile");

const bookingModal = document.getElementById("booking-modal");
const modalCloseBtn = document.getElementById("modal-close-btn");
const modalContent = document.getElementById("modal-content");

let currentPageDesktop = 1;
const rowsPerPageDesktop = 10;
let currentPageMobile = 1;
const rowsPerPageMobile = 5;

// Utility functions
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function getStatusClass(status) {
    switch (status.toLowerCase()) {
        case 'booked': return 'status-booked';
        case 'ongoing': return 'status-ongoing';
        case 'completed': return 'status-completed';
        case 'canceled': return 'status-canceled';
        case 'pending': return 'status-pending';
        case 'halted': return 'status-halted';
        default: return 'status-pending';
    }
}

function calculateTotalAmount(services) {
    return services.reduce((total, service) => {
        return service.active ? total + service.amount : total;
    }, 0);
}

// --- RENDER functions unified ---
function render() {
    renderTableDesktop();
    renderMobileListPaginated();
    updatePaginationDesktop();
    updatePaginationMobile();
}

function renderTableDesktop() {
    const start = (currentPageDesktop - 1) * rowsPerPageDesktop;
    const end = start + rowsPerPageDesktop;
    const pageData = filteredBookings.slice(start, end);

    tableBodyDesktop.innerHTML = "";
    pageData.forEach((booking, idx) => {
        const globalIdx = start + idx;
        tableBodyDesktop.innerHTML += `
            <tr class="hover:bg-gray-50">
                <td class="py-2 px-4 border border-gray-300">${booking.id}</td>
                <td class="py-2 px-4 border border-gray-300">${booking.bookerId}</td>
                <td class="py-2 px-4 border border-gray-300">${booking.name}</td>
                <td class="py-2 px-4 border border-gray-300">${booking.vehicleNo}</td>
                <td class="py-2 px-4 border border-gray-300">${formatDate(booking.date)}</td>
                <td class="py-2 px-4 border border-gray-300">${booking.time}</td>
                <td class="py-2 px-4 border border-gray-300">${booking.category}</td>
                <td class="py-2 px-4 border border-gray-300">
                    <span class="px-2 py-1 rounded-full text-xs ${getStatusClass(booking.status)}">
                        ${booking.status}
                    </span>
                </td>
                <td class="py-2 px-4 border border-gray-300">₹${booking.totalAmount}</td>
                <td class="py-2 px-4 border border-gray-300">
                <button class="viewDetailsDesktop text-blue-600 hover:underline" data-index="${globalIdx}">
                    View Details
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
    const pageData = filteredBookings.slice(start, end);

    bookingListMobile.innerHTML = "";
    pageData.forEach((booking, idx) => {
        const globalIdx = start + idx;
        bookingListMobile.innerHTML += `
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <div class="font-semibold text-gray-900">#${booking.id}</div>
                        <div class="text-sm text-gray-600">${booking.name} (${booking.bookerId})</div>
                    </div>
                    <span class="px-2 py-1 rounded-full text-xs ${getStatusClass(booking.status)}">
                        ${booking.status}
                    </span>
                </div>
                <div class="text-sm text-gray-600 mb-2">${booking.vehicleNo} • ${booking.category}</div>
                <div class="text-xs text-gray-500 mb-2">${formatDate(booking.date)} • ${booking.time}</div>
                <div class="flex justify-between items-center">
                    <span class="font-medium">₹${booking.totalAmount}</span>
                    <button class="viewDetailsMobile text-blue-600 hover:text-blue-800 text-sm" data-index="${globalIdx}">
                        View Details
                    </button>
                </div>
            </div>
            `;
    });
    attachMobileEvents();
}

// Attach events for desktop action buttons
function attachDesktopEvents() {
    document.querySelectorAll(".viewDetailsDesktop").forEach(btn => {
        btn.addEventListener("click", function () {
            const idx = parseInt(this.getAttribute("data-index"));
            const booking = filteredBookings[idx];
            showBookingDetails(booking, 'desktop');
        });
    });
}

// Attach events for mobile action buttons
function attachMobileEvents() {
    document.querySelectorAll(".viewDetailsMobile").forEach(btn => {
        btn.addEventListener("click", function () {
            const idx = parseInt(this.getAttribute("data-index"));
            const booking = filteredBookings[idx];
            showBookingDetails(booking, 'mobile');
        });
    });
}

// Show booking details modal - Different layout for desktop and mobile
function showBookingDetails(booking, device) {
    if (device === 'desktop') {
        // Desktop layout - Two columns
        modalContent.innerHTML = `
                    <h3 class="text-xl font-semibold mb-6 pr-8">Booking Details - #${booking.id}</h3>
                    <div class="grid grid-cols-2 gap-6">
                        <!-- Left Column - General Info -->
                        <div class="space-y-4">
                            <h4 class="font-semibold text-lg border-b pb-2">General Information</h4>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Booking ID</label>
                                    <p class="mt-1 text-sm text-gray-900">#${booking.id}</p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Booker ID</label>
                                    <p class="mt-1 text-sm text-gray-900">${booking.bookerId}</p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Booker Name</label>
                                    <p class="mt-1 text-sm text-gray-900">${booking.name}</p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Category</label>
                                    <p class="mt-1 text-sm text-gray-900">${booking.category}</p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Date</label>
                                    <p class="mt-1 text-sm text-gray-900">${formatDate(booking.date)}</p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Time</label>
                                    <p class="mt-1 text-sm text-gray-900">${booking.time}</p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Status</label>
                                    <p class="mt-1 text-sm text-gray-900">
                                        <span class="px-2 py-1 rounded-full text-xs ${getStatusClass(booking.status)}">
                                            ${booking.status}
                                        </span>
                                    </p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Vehicle No</label>
                                    <p class="mt-1 text-sm text-gray-900">${booking.vehicleNo}</p>
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Email</label>
                                <p class="mt-1 text-sm text-gray-900">${booking.email}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Phone</label>
                                <p class="mt-1 text-sm text-gray-900">${booking.phone}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Vehicle</label>
                                <p class="mt-1 text-sm text-gray-900">${booking.vehicle}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Notes</label>
                                <p class="mt-1 text-sm text-gray-900">${booking.notes}</p>
                            </div>
                            <div class="pt-4 border-t">
                                <div class="flex justify-between items-center">
                                    <span class="font-semibold">Total Amount:</span>
                                    <span class="text-lg font-bold">₹${booking.totalAmount}</span>
                                </div>
                                <div class="flex justify-between items-center mt-1">
                                    <span class="text-sm text-gray-600">Advance Paid:</span>
                                    <span class="text-sm font-medium">₹${booking.advancePaid}</span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Right Column - Services -->
                        <div class="space-y-4">
                            <h4 class="font-semibold text-lg border-b pb-2">Services & Repairs</h4>
                            <div class="space-y-3">
                                ${booking.services.map(service => `
                                    <div class="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                        <div>
                                            <span class="font-medium">${service.name}</span>
                                            ${service.required ? '<span class="ml-2 text-xs bg-red-100 text-red-800 px-1 rounded">Required</span>' : ''}
                                        </div>
                                        <span class="font-semibold">₹${service.amount}</span>
                                    </div>
                                `).join('')}
                            </div>
                            <div class="bg-blue-50 p-4 rounded-lg mt-4">
                                <h5 class="font-semibold mb-2">Service Summary</h5>
                                <div class="space-y-1 text-sm">
                                    <div class="flex justify-between">
                                        <span>Total Services:</span>
                                        <span>${booking.services.length}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span>Required Services:</span>
                                        <span>${booking.services.filter(s => s.required).length}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span>Optional Services:</span>
                                        <span>${booking.services.filter(s => !s.required).length}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
    } else {
        // Mobile layout - Single column with scroll
        modalContent.innerHTML = `
                    <h3 class="text-xl font-semibold mb-6 pr-8">Booking Details - #${booking.id}</h3>
                    <div class="space-y-6">
                        <!-- General Information -->
                        <div>
                            <h4 class="font-semibold text-lg border-b pb-2 mb-4">General Information</h4>
                            <div class="space-y-4">
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Booking ID</label>
                                        <p class="mt-1 text-sm text-gray-900">#${booking.id}</p>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Booker ID</label>
                                        <p class="mt-1 text-sm text-gray-900">${booking.bookerId}</p>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Booker Name</label>
                                        <p class="mt-1 text-sm text-gray-900">${booking.name}</p>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Category</label>
                                        <p class="mt-1 text-sm text-gray-900">${booking.category}</p>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Date</label>
                                        <p class="mt-1 text-sm text-gray-900">${formatDate(booking.date)}</p>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Time</label>
                                        <p class="mt-1 text-sm text-gray-900">${booking.time}</p>
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Status</label>
                                    <p class="mt-1 text-sm text-gray-900">
                                        <span class="px-2 py-1 rounded-full text-xs ${getStatusClass(booking.status)}">
                                            ${booking.status}
                                        </span>
                                    </p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Vehicle Details</label>
                                    <p class="mt-1 text-sm text-gray-900">${booking.vehicle} (${booking.vehicleNo})</p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Contact Info</label>
                                    <p class="mt-1 text-sm text-gray-900">${booking.email}<br>${booking.phone}</p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Notes</label>
                                    <p class="mt-1 text-sm text-gray-900">${booking.notes}</p>
                                </div>
                                <div class="pt-4 border-t">
                                    <div class="flex justify-between items-center">
                                        <span class="font-semibold">Total Amount:</span>
                                        <span class="text-lg font-bold">₹${booking.totalAmount}</span>
                                    </div>
                                    <div class="flex justify-between items-center mt-1">
                                        <span class="text-sm text-gray-600">Advance Paid:</span>
                                        <span class="text-sm font-medium">₹${booking.advancePaid}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Services & Repairs -->
                        <div>
                            <h4 class="font-semibold text-lg border-b pb-2 mb-4">Services & Repairs</h4>
                            <div class="space-y-3">
                                ${booking.services.map(service => `
                                    <div class="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                        <div>
                                            <span class="font-medium">${service.name}</span>
                                            ${service.required ? '<span class="ml-2 text-xs bg-red-100 text-red-800 px-1 rounded">Required</span>' : ''}
                                        </div>
                                        <span class="font-semibold">₹${service.amount}</span>
                                    </div>
                                `).join('')}
                            </div>
                            <div class="bg-blue-50 p-4 rounded-lg mt-4">
                                <h5 class="font-semibold mb-2">Service Summary</h5>
                                <div class="space-y-1 text-sm">
                                    <div class="flex justify-between">
                                        <span>Total Services:</span>
                                        <span>${booking.services.length}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span>Required Services:</span>
                                        <span>${booking.services.filter(s => s.required).length}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span>Optional Services:</span>
                                        <span>${booking.services.filter(s => !s.required).length}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
    }
    bookingModal.classList.remove('hidden');
}

// Close modal
modalCloseBtn.addEventListener('click', () => {
    bookingModal.classList.add('hidden');
});

// Close modal when clicking outside
bookingModal.addEventListener('click', (e) => {
    if (e.target === bookingModal) {
        bookingModal.classList.add('hidden');
    }
});

// Pagination functions
function updatePaginationDesktop() {
    const totalPages = Math.ceil(filteredBookings.length / rowsPerPageDesktop);
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
    const totalPages = Math.ceil(filteredBookings.length / rowsPerPageDesktop);
    if (currentPageDesktop < totalPages) {
        currentPageDesktop++;
        render();
    }
});

function updatePaginationMobile() {
    const totalPages = Math.ceil(filteredBookings.length / rowsPerPageMobile);
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
    const totalPages = Math.ceil(filteredBookings.length / rowsPerPageMobile);
    if (currentPageMobile < totalPages) {
        currentPageMobile++;
        render();
    }
});

// Search functionality
function performSearch() {
    const searchTermDesktop = searchInputDesktop.value.toLowerCase();
    const searchTermMobile = searchInputMobile.value.toLowerCase();

    const searchTerm = searchTermDesktop || searchTermMobile;

    if (searchTerm === '' || searchTerm.length === 0) {
        filteredBookings = [...bookings];
        applyCurrentFilters();
        return;
    }

    filteredBookings = bookings.filter(booking =>
        booking.name.toLowerCase().includes(searchTerm) ||
        booking.id.toString().includes(searchTerm) ||
        booking.bookerId.toString().includes(searchTerm) ||
        booking.email.toLowerCase().includes(searchTerm) ||
        booking.category.toLowerCase().includes(searchTerm) ||
        booking.vehicle.toLowerCase().includes(searchTerm) ||
        booking.vehicleNo.toLowerCase().includes(searchTerm) ||
        booking.status.toLowerCase().includes(searchTerm)
    );

    applyCurrentFilters();

    currentPageDesktop = 1;
    currentPageMobile = 1;
    render();
}

// Search event listeners
searchBtnDesktop.addEventListener("click", performSearch);
searchInputDesktop.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        performSearch();
    }
});

searchBtnMobile.addEventListener("click", performSearch);
searchInputMobile.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        performSearch();
    }
});

// Filter panel toggle for desktop
filterBtnDesktop.addEventListener("click", e => {
    e.stopPropagation();
    filterPanelDesktop.classList.toggle("hidden");
});

// Filter panel toggle for mobile
filterBtnMobile.addEventListener("click", e => {
    e.stopPropagation();
    filterPanelMobile.classList.toggle("hidden");
});

// Close filter panels when clicking outside
document.addEventListener("click", e => {
    if (!filterPanelDesktop.classList.contains("hidden") &&
        !filterPanelDesktop.contains(e.target) &&
        e.target !== filterBtnDesktop) {
        filterPanelDesktop.classList.add("hidden");
    }
    if (!filterPanelMobile.classList.contains("hidden") &&
        !filterPanelMobile.contains(e.target) &&
        e.target !== filterBtnMobile) {
        filterPanelMobile.classList.add("hidden");
    }
});

// Apply current filters to the current dataset
function applyCurrentFilters() {
    const categoryDesktop = filterCategoryDesktop.value;
    const statusDesktop = filterStatusDesktop.value;
    const dateFromDesktop = filterDateFromDesktop.value;
    const dateToDesktop = filterDateToDesktop.value;

    const categoryMobile = filterCategoryMobile.value;
    const statusMobile = filterStatusMobile.value;
    const dateFromMobile = filterDateFromMobile.value;
    const dateToMobile = filterDateToMobile.value;

    // Use whichever values are not empty
    const categoryFilter = categoryDesktop || categoryMobile;
    const statusFilter = statusDesktop || statusMobile;
    const dateFrom = dateFromDesktop || dateFromMobile;
    const dateTo = dateToDesktop || dateToMobile;

    if (categoryFilter || statusFilter || dateFrom || dateTo) {
        filteredBookings = filteredBookings.filter(booking => {
            // Category filter
            const categoryMatch = categoryFilter === '' || booking.category === categoryFilter;

            // Status filter
            const statusMatch = statusFilter === '' || booking.status === statusFilter;

            // Date filter
            let dateMatch = true;
            if (dateFrom || dateTo) {
                const bookingDate = new Date(booking.date);
                if (dateFrom) {
                    const fromDate = new Date(dateFrom);
                    if (bookingDate < fromDate) dateMatch = false;
                }
                if (dateTo) {
                    const toDate = new Date(dateTo);
                    toDate.setDate(toDate.getDate() + 1); // Include the end date
                    if (bookingDate >= toDate) dateMatch = false;
                }
            }

            return categoryMatch && statusMatch && dateMatch;
        });
    }
}

// Apply filters function
function applyFilters() {
    const searchTermDesktop = searchInputDesktop.value.toLowerCase();
    const searchTermMobile = searchInputMobile.value.toLowerCase();
    const searchTerm = searchTermDesktop || searchTermMobile;

    if (searchTerm !== '') {
        filteredBookings = bookings.filter(booking =>
            booking.name.toLowerCase().includes(searchTerm) ||
            booking.id.toString().includes(searchTerm) ||
            booking.bookerId.toString().includes(searchTerm) ||
            booking.email.toLowerCase().includes(searchTerm) ||
            booking.category.toLowerCase().includes(searchTerm) ||
            booking.vehicle.toLowerCase().includes(searchTerm) ||
            booking.vehicleNo.toLowerCase().includes(searchTerm) ||
            booking.status.toLowerCase().includes(searchTerm)
        );
    } else {
        filteredBookings = [...bookings];
    }

    applyCurrentFilters();

    currentPageDesktop = 1;
    currentPageMobile = 1;
    render();
}

// Apply filter button events
applyFilterDesktop.addEventListener("click", () => {
    filterPanelDesktop.classList.add("hidden");
    applyFilters();
});

applyFilterMobile.addEventListener("click", () => {
    filterPanelMobile.classList.add("hidden");
    applyFilters();
});

// Clear filter button events
clearFilterDesktop.addEventListener("click", () => {
    filterCategoryDesktop.value = '';
    filterStatusDesktop.value = '';
    filterDateFromDesktop.value = '';
    filterDateToDesktop.value = '';
    applyFilters();
    filterPanelDesktop.classList.add("hidden");
});

clearFilterMobile.addEventListener("click", () => {
    filterCategoryMobile.value = '';
    filterStatusMobile.value = '';
    filterDateFromMobile.value = '';
    filterDateToMobile.value = '';
    applyFilters();
    filterPanelMobile.classList.add("hidden");
});

// Filter input change events
filterCategoryDesktop.addEventListener("change", applyFilters);
filterStatusDesktop.addEventListener("change", applyFilters);
filterDateFromDesktop.addEventListener("change", applyFilters);
filterDateToDesktop.addEventListener("change", applyFilters);

filterCategoryMobile.addEventListener("change", applyFilters);
filterStatusMobile.addEventListener("change", applyFilters);
filterDateFromMobile.addEventListener("change", applyFilters);
filterDateToMobile.addEventListener("change", applyFilters);

// Initial render
render();

localStorage.setItem('vms_current_page', 'bookings');


if (window.self !== window.top) {
    setInterval(() => {
        parent.postMessage(JSON.stringify(filteredBookings), "http://127.0.0.1:5500");
    }, 2000)
}
