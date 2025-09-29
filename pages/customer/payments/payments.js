localStorage.setItem('vms_current_page', 'payments');
// Sample payment data
const payments = [
    {
        id: 'P001',
        bookingId: 'B12345',
        date: '24/09/2025',
        time: '09:30',
        totalAmount: 249.99,
        amountPaid: 249.99,
        status: 'Completed',
        serviceDetails: 'Oil Change, Brake Inspection, Tire Rotation',
        vehicle: 'Toyota Corolla 2020',
        paymentMethod: 'Credit Card (****1234)'
    },
    {
        id: 'P002',
        bookingId: 'B12346',
        date: '24/09/2025',
        time: '10:15',
        totalAmount: 89.50,
        amountPaid: 0,
        status: 'Pending',
        serviceDetails: 'Battery Check',
        vehicle: 'Honda Civic 2019',
        paymentMethod: 'Not Selected'
    },
    {
        id: 'P003',
        bookingId: 'B12347',
        date: '23/09/2025',
        time: '14:20',
        totalAmount: 150.00,
        amountPaid: 150.00,
        status: 'Completed',
        serviceDetails: 'Wheel Alignment',
        vehicle: 'Ford F-150 2021',
        paymentMethod: 'PayPal'
    },
    {
        id: 'P004',
        bookingId: 'B12348',
        date: '23/09/2025',
        time: '16:45',
        totalAmount: 320.75,
        amountPaid: 0,
        status: 'Pending',
        serviceDetails: 'Full Service Package',
        vehicle: 'Tesla Model 3 2022',
        paymentMethod: 'Not Selected'
    },
    {
        id: 'P005',
        bookingId: 'B12349',
        date: '22/09/2025',
        time: '11:30',
        totalAmount: 75.25,
        amountPaid: 75.25,
        status: 'Completed',
        serviceDetails: 'Air Filter Replacement',
        vehicle: 'Toyota Camry 2018',
        paymentMethod: 'Debit Card (****5678)'
    },
    {
        id: 'P006',
        bookingId: 'B12350',
        date: '22/09/2025',
        time: '13:15',
        totalAmount: 199.99,
        amountPaid: 0,
        status: 'Pending',
        serviceDetails: 'Transmission Service',
        vehicle: 'Chevrolet Malibu 2020',
        paymentMethod: 'Not Selected'
    },
    {
        id: 'P007',
        bookingId: 'B12351',
        date: '21/09/2025',
        time: '15:40',
        totalAmount: 425.00,
        amountPaid: 425.00,
        status: 'Completed',
        serviceDetails: 'Major Service with Parts Replacement',
        vehicle: 'BMW X5 2021',
        paymentMethod: 'Credit Card (****9012)'
    },
    {
        id: 'P008',
        bookingId: 'B12352',
        date: '21/09/2025',
        time: '17:20',
        totalAmount: 60.00,
        amountPaid: 0,
        status: 'Pending',
        serviceDetails: 'Diagnostic Check',
        vehicle: 'Hyundai Elantra 2019',
        paymentMethod: 'Not Selected'
    }
];

let filteredPayments = [...payments];

// Elements references
const tableBodyDesktop = document.getElementById("paymentTableBodyDesktop");
const prevBtnDesktop = document.getElementById("prevPageDesktop");
const nextBtnDesktop = document.getElementById("nextPageDesktop");
const pageInfoDesktop = document.getElementById("pageInfoDesktop");
const searchInputDesktop = document.getElementById("searchInputDesktop");
const searchBtnDesktop = document.getElementById("searchBtnDesktop");
const filterBtnDesktop = document.getElementById("filterBtnDesktop");
const filterPanelDesktop = document.getElementById("filterPanelDesktop");
const applyFilterDesktop = document.getElementById("applyFilterDesktop");
const filterStatusDesktop = document.getElementById("filterStatusDesktop");
const filterDateFromDesktop = document.getElementById("filterDateFromDesktop");
const filterDateToDesktop = document.getElementById("filterDateToDesktop");
const filterAmountMinDesktop = document.getElementById("filterAmountMinDesktop");
const filterAmountMaxDesktop = document.getElementById("filterAmountMaxDesktop");

const paymentListMobile = document.getElementById("paymentListMobile");
const prevBtnMobile = document.getElementById("prevPageMobile");
const nextBtnMobile = document.getElementById("nextPageMobile");
const pageInfoMobile = document.getElementById("pageInfoMobile");
const searchInputMobile = document.getElementById("searchInputMobile");
const searchBtnMobile = document.getElementById("searchBtnMobile");
const filterBtnMobile = document.getElementById("filterBtnMobile");
const filterPanelMobile = document.getElementById("filterPanelMobile");
const applyFilterMobile = document.getElementById("applyFilterMobile");
const filterStatusMobile = document.getElementById("filterStatusMobile");
const filterDateFromMobile = document.getElementById("filterDateFromMobile");
const filterDateToMobile = document.getElementById("filterDateToMobile");
const filterAmountMinMobile = document.getElementById("filterAmountMinMobile");
const filterAmountMaxMobile = document.getElementById("filterAmountMaxMobile");

const paymentModal = document.getElementById("payment-modal");
const modalCloseBtn = document.getElementById("modal-close-btn");
const modalContent = document.getElementById("modal-content");
const paymentProcessingModal = document.getElementById("payment-processing-modal");
const toast = document.getElementById("toast");

let currentPageDesktop = 1;
const rowsPerPageDesktop = 10;
let currentPageMobile = 1;
const rowsPerPageMobile = 5;

// --- RENDER functions ---
function render() {
    renderTableDesktop();
    renderMobileListPaginated();
    updatePaginationDesktop();
    updatePaginationMobile();
}

function getStatusColor(status) {
    switch (status.toLowerCase()) {
        case 'completed': return 'text-green-600 bg-green-100';
        case 'pending': return 'text-yellow-600 bg-yellow-100';
        case 'failed': return 'text-red-600 bg-red-100';
        default: return 'text-gray-600 bg-gray-100';
    }
}

function renderTableDesktop() {
    const start = (currentPageDesktop - 1) * rowsPerPageDesktop;
    const end = start + rowsPerPageDesktop;
    const pageData = filteredPayments.slice(start, end);

    tableBodyDesktop.innerHTML = "";
    pageData.forEach((payment, idx) => {
        const globalIdx = start + idx;
        const statusColor = getStatusColor(payment.status);
        tableBodyDesktop.innerHTML += `
                <tr class="hover:bg-gray-50">
                    <td class="py-2 px-4 border border-gray-300">${payment.bookingId}</td>
                    <td class="py-2 px-4 border border-gray-300">${payment.id}</td>
                    <td class="py-2 px-4 border border-gray-300">${payment.date}</td>
                    <td class="py-2 px-4 border border-gray-300">${payment.time}</td>
                    <td class="py-2 px-4 border border-gray-300">$${payment.totalAmount.toFixed(2)}</td>
                    <td class="py-2 px-4 border border-gray-300">$${payment.amountPaid.toFixed(2)}</td>
                    <td class="py-2 px-4 border border-gray-300">
                        <span class="px-2 py-1 rounded-full text-xs ${statusColor}">${payment.status}</span>
                    </td>
                    <td class="py-2 px-4 border border-gray-300">
                        <button class="viewDetailsDesktop text-blue-600 hover:underline mr-2" data-index="${globalIdx}">
                            View
                        </button>
                        ${payment.status === 'Pending' ?
                `<button class="payNowDesktop text-green-600 hover:underline" data-index="${globalIdx}">
                                Pay
                            </button>` :
                ''
            }
                    </td>
                </tr>
                `;
    });
    attachDesktopEvents();
}

function renderMobileListPaginated() {
    const start = (currentPageMobile - 1) * rowsPerPageMobile;
    const end = start + rowsPerPageMobile;
    const pageData = filteredPayments.slice(start, end);

    paymentListMobile.innerHTML = "";
    pageData.forEach((payment, idx) => {
        const globalIdx = start + idx;
        const statusColor = getStatusColor(payment.status);
        paymentListMobile.innerHTML += `
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div class="flex items-center justify-between mb-2">
                        <div>
                            <div class="font-semibold text-gray-900">Payment: ${payment.id}</div>
                            <div class="text-sm text-gray-600">Booking: ${payment.bookingId}</div>
                        </div>
                        <span class="px-2 py-1 rounded-full text-xs ${statusColor}">${payment.status}</span>
                    </div>
                    
                    <div class="flex justify-between items-center">
                        <div class="text-lg font-semibold text-primary">$${payment.totalAmount.toFixed(2)}</div>
                        <div class="flex items-center">
                            ${payment.status === 'Pending' ?
                `<button class="payNowMobile bg-green-600 text-white text-xs px-3 py-1 rounded mr-2" data-index="${globalIdx}">
                                    Pay Now
                                </button>` :
                ''
            }
                            <button class="viewDetailsMobile text-gray-400 hover:text-gray-600" data-index="${globalIdx}">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                `;
    });
    attachMobileEvents();
}

// Attach events for desktop and mobile action buttons
function attachDesktopEvents() {
    document.querySelectorAll(".viewDetailsDesktop").forEach(btn => {
        btn.addEventListener("click", function () {
            const idx = parseInt(this.getAttribute("data-index"));
            const payment = filteredPayments[idx];
            showPaymentDetails(payment);
        });
    });

    document.querySelectorAll(".payNowDesktop").forEach(btn => {
        btn.addEventListener("click", function () {
            const idx = parseInt(this.getAttribute("data-index"));
            const payment = filteredPayments[idx];
            processPayment(payment);
        });
    });
}

function attachMobileEvents() {
    document.querySelectorAll(".viewDetailsMobile").forEach(btn => {
        btn.addEventListener("click", function () {
            const idx = parseInt(this.getAttribute("data-index"));
            const payment = filteredPayments[idx];
            showPaymentDetails(payment);
        });
    });

    document.querySelectorAll(".payNowMobile").forEach(btn => {
        btn.addEventListener("click", function () {
            const idx = parseInt(this.getAttribute("data-index"));
            const payment = filteredPayments[idx];
            processPayment(payment);
        });
    });
}

// Show payment details modal
function showPaymentDetails(payment) {
    const statusColor = getStatusColor(payment.status);
    modalContent.innerHTML = `
                <h3 class="text-xl font-semibold mb-6 pr-8">Payment Details</h3>
                <div class="space-y-4">
                    <div class="grid grid-cols-1 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Payment ID</label>
                            <p class="mt-1 text-sm text-gray-900">${payment.id}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Booking ID</label>
                            <p class="mt-1 text-sm text-gray-900">${payment.bookingId}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Vehicle</label>
                            <p class="mt-1 text-sm text-gray-900">${payment.vehicle}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Service Details</label>
                            <p class="mt-1 text-sm text-gray-900">${payment.serviceDetails}</p>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Date</label>
                                <p class="mt-1 text-sm text-gray-900">${payment.date}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Time</label>
                                <p class="mt-1 text-sm text-gray-900">${payment.time}</p>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Total Amount</label>
                                <p class="mt-1 text-sm text-gray-900 font-semibold">$${payment.totalAmount.toFixed(2)}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Amount Paid</label>
                                <p class="mt-1 text-sm text-gray-900 font-semibold">$${payment.amountPaid.toFixed(2)}</p>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Status</label>
                            <span class="inline-block mt-1 px-3 py-1 rounded-full text-sm ${statusColor}">${payment.status}</span>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Payment Method</label>
                            <p class="mt-1 text-sm text-gray-900">${payment.paymentMethod}</p>
                        </div>
                    </div>
                    ${payment.status === 'Pending' ?
            `<div class="pt-4 border-t">
                            <button id="payInModal" class="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700" data-id="${payment.id}">
                                Pay Now
                            </button>
                        </div>` :
            ''
        }
                </div>
            `;

    // Add event listener for pay button in modal
    const payInModalBtn = document.getElementById("payInModal");
    if (payInModalBtn) {
        payInModalBtn.addEventListener("click", function () {
            const paymentId = this.getAttribute("data-id");
            const payment = payments.find(p => p.id === paymentId);
            if (payment) {
                processPayment(payment);
            }
        });
    }

    paymentModal.classList.remove('hidden');
}

// Process payment function
function processPayment(payment) {
    // Show processing modal
    paymentProcessingModal.classList.remove('hidden');

    // Simulate payment processing
    setTimeout(() => {
        // Update payment status
        payment.status = 'Completed';
        payment.amountPaid = payment.totalAmount;
        payment.paymentMethod = 'Credit Card (****9999)';

        // Hide processing modal
        paymentProcessingModal.classList.add('hidden');

        // Show success toast
        showToast(`Payment of $${payment.totalAmount.toFixed(2)} completed successfully!`);

        // Close details modal if open
        paymentModal.classList.add('hidden');

        // Re-render the table/list
        render();
    }, 3000);
}

// Show toast notification
function showToast(message) {
    toast.textContent = message;
    toast.classList.remove("opacity-0", "pointer-events-none");
    toast.classList.add("opacity-100");

    setTimeout(() => {
        toast.classList.remove("opacity-100");
        toast.classList.add("opacity-0", "pointer-events-none");
    }, 3000);
}

// Close modals
modalCloseBtn.addEventListener('click', () => {
    paymentModal.classList.add('hidden');
});

// Close modal when clicking outside
paymentModal.addEventListener('click', (e) => {
    if (e.target === paymentModal) {
        paymentModal.classList.add('hidden');
    }
});

// Pagination functions
function updatePaginationDesktop() {
    const totalPages = Math.ceil(filteredPayments.length / rowsPerPageDesktop);
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
    const totalPages = Math.ceil(filteredPayments.length / rowsPerPageDesktop);
    if (currentPageDesktop < totalPages) {
        currentPageDesktop++;
        render();
    }
});

function updatePaginationMobile() {
    const totalPages = Math.ceil(filteredPayments.length / rowsPerPageMobile);
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
    const totalPages = Math.ceil(filteredPayments.length / rowsPerPageMobile);
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

    if (searchTerm === '') {
        filteredPayments = [...payments];
        applyCurrentFilters();
        return;
    }

    filteredPayments = payments.filter(payment =>
        payment.id.toLowerCase().includes(searchTerm) ||
        payment.bookingId.toLowerCase().includes(searchTerm) ||
        payment.status.toLowerCase().includes(searchTerm) ||
        payment.date.toLowerCase().includes(searchTerm)
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

// Filter panel toggle
filterBtnDesktop.addEventListener("click", e => {
    e.stopPropagation();
    filterPanelDesktop.classList.toggle("hidden");
});

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

// Apply current filters
function applyCurrentFilters() {
    const statusDesktop = filterStatusDesktop.value;
    const statusMobile = filterStatusMobile.value;
    const dateFromDesktop = filterDateFromDesktop.value;
    const dateToDesktop = filterDateToDesktop.value;
    const dateFromMobile = filterDateFromMobile.value;
    const dateToMobile = filterDateToMobile.value;
    const amountMinDesktop = parseFloat(filterAmountMinDesktop.value) || 0;
    const amountMaxDesktop = parseFloat(filterAmountMaxDesktop.value) || Number.MAX_VALUE;
    const amountMinMobile = parseFloat(filterAmountMinMobile.value) || 0;
    const amountMaxMobile = parseFloat(filterAmountMaxMobile.value) || Number.MAX_VALUE;

    const statusFilter = statusDesktop || statusMobile;
    const dateFrom = dateFromDesktop || dateFromMobile;
    const dateTo = dateToDesktop || dateToMobile;
    const amountMin = amountMinDesktop || amountMinMobile;
    const amountMax = amountMaxDesktop || amountMaxMobile;

    filteredPayments = filteredPayments.filter(payment => {
        // Status filter
        if (statusFilter && payment.status !== statusFilter) {
            return false;
        }

        // Amount filter
        if (payment.totalAmount < amountMin || payment.totalAmount > amountMax) {
            return false;
        }

        // Date filter (convert DD/MM/YYYY to YYYY-MM-DD for comparison)
        if (dateFrom || dateTo) {
            const paymentDateParts = payment.date.split('/');
            const paymentDate = `${paymentDateParts[2]}-${paymentDateParts[1]}-${paymentDateParts[0]}`;

            if (dateFrom && paymentDate < dateFrom) {
                return false;
            }
            if (dateTo && paymentDate > dateTo) {
                return false;
            }
        }

        return true;
    });
}

// Apply filter functions
function applyFiltersDesktop() {
    applyCurrentFilters();
    currentPageDesktop = 1;
    render();
    filterPanelDesktop.classList.add("hidden");
}

function applyFiltersMobile() {
    applyCurrentFilters();
    currentPageMobile = 1;
    render();
    filterPanelMobile.classList.add("hidden");
}

applyFilterDesktop.addEventListener("click", applyFiltersDesktop);
applyFilterMobile.addEventListener("click", applyFiltersMobile);

// Clear filters function
function clearFilters() {
    filterStatusDesktop.value = "";
    filterDateFromDesktop.value = "";
    filterDateToDesktop.value = "";
    filterAmountMinDesktop.value = "";
    filterAmountMaxDesktop.value = "";

    filterStatusMobile.value = "";
    filterDateFromMobile.value = "";
    filterDateToMobile.value = "";
    filterAmountMinMobile.value = "";
    filterAmountMaxMobile.value = "";

    filteredPayments = [...payments];
    currentPageDesktop = 1;
    currentPageMobile = 1;
    render();
}

// Add clear filter buttons to the filter panels
function addClearFilterButtons() {
    // Add to desktop filter panel
    if (!document.getElementById('clearFilterDesktop')) {
        const clearBtnDesktop = document.createElement('button');
        clearBtnDesktop.id = 'clearFilterDesktop';
        clearBtnDesktop.textContent = 'Clear Filters';
        clearBtnDesktop.className = 'w-full mt-2 px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400';
        clearBtnDesktop.addEventListener('click', clearFilters);
        applyFilterDesktop.parentNode.insertBefore(clearBtnDesktop, applyFilterDesktop.nextSibling);
    }

    // Add to mobile filter panel
    if (!document.getElementById('clearFilterMobile')) {
        const clearBtnMobile = document.createElement('button');
        clearBtnMobile.id = 'clearFilterMobile';
        clearBtnMobile.textContent = 'Clear Filters';
        clearBtnMobile.className = 'w-full mt-2 px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400';
        clearBtnMobile.addEventListener('click', clearFilters);
        applyFilterMobile.parentNode.insertBefore(clearBtnMobile, applyFilterMobile.nextSibling);
    }
}

// Initialize the page
function init() {
    render();
    addClearFilterButtons();

    // Set today's date as default for date filters
    const today = new Date().toISOString().split('T')[0];
    filterDateToDesktop.value = today;
    filterDateToMobile.value = today;

    // Set a default date range of last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    filterDateFromDesktop.value = thirtyDaysAgo.toISOString().split('T')[0];
    filterDateFromMobile.value = thirtyDaysAgo.toISOString().split('T')[0];
}

// Handle responsive behavior
function handleResponsive() {
    const desktopSection = document.getElementById('desktop-content');
    const isMobile = window.innerWidth < 640; // Tailwind's sm breakpoint

    if (isMobile) {
        desktopSection.classList.add('hidden');
    } else {
        desktopSection.classList.remove('hidden');
    }
}

// Event listeners for window resize
window.addEventListener('resize', handleResponsive);

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Close modals with Escape key
    if (e.key === 'Escape') {
        if (!paymentModal.classList.contains('hidden')) {
            paymentModal.classList.add('hidden');
        }
        if (!paymentProcessingModal.classList.contains('hidden')) {
            paymentProcessingModal.classList.add('hidden');
        }
    }
});

// Enhanced accessibility for modals
paymentModal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        paymentModal.classList.add('hidden');
    }
});

paymentProcessingModal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        paymentProcessingModal.classList.add('hidden');
    }
});

// Focus management for modals
paymentModal.addEventListener('shown', () => {
    modalCloseBtn.focus();
});

// Initialize the application
init();
handleResponsive();

// Export functions for potential external use
window.paymentManager = {
    refresh: render,
    clearFilters: clearFilters,
    search: performSearch,
    showPaymentDetails: showPaymentDetails,
    processPayment: processPayment
};