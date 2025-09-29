localStorage.setItem('vms_current_page', 'service_history')
// Sample service history data with detailed transaction information
const serviceHistory = [
    {
        id: 66886,
        bookingId: 48898,
        vehicleNo: "TN 01 AB 1234",
        date: '2025-09-13',
        time: '9:00 AM',
        amount: 4700,
        status: 'Completed',
        category: 'Service',
        email: 'john@example.com',
        phone: '+1234567890',
        vehicle: 'Toyota Camry',
        notes: 'Regular service checkup',
        paymentStatus: 'completed',
        advancePaid: 600,
        services: [
            { id: 1, name: "Oil Change", amount: 1200, required: true, active: true },
            { id: 2, name: "Wheel Alignment", amount: 3000, required: false, active: true },
            { id: 3, name: "Brake Check", amount: 500, required: false, active: true }
        ],
        transactionId: 'TXN_66886_001',
        paymentMethod: 'Credit Card',
        paymentDate: '2025-09-13'
    },
    {
        id: 545454,
        bookingId: 545688,
        vehicleNo: "TN 01 BC 1234",
        date: '2025-09-19',
        time: '11:00 AM',
        amount: 14000,
        status: 'OnGoing',
        category: 'Repair',
        email: 'barane@example.com',
        phone: '+1234567891',
        vehicle: 'Honda Civic',
        notes: 'Engine repair and battery check',
        paymentStatus: 'pending',
        advancePaid: 7000,
        services: [
            { id: 10, name: "Engine Repair", amount: 12000, required: true, active: true },
            { id: 11, name: "Battery Check", amount: 2000, required: false, active: true }
        ],
        transactionId: 'TXN_545454_001',
        paymentMethod: 'Bank Transfer',
        paymentDate: '2025-09-19'
    },
    {
        id: 654646,
        bookingId: 123456,
        vehicleNo: "TN 99 XY 9876",
        date: '2025-09-25',
        time: '2:00 PM',
        amount: 3500,
        status: 'Completed',
        category: 'Service',
        email: 'kumar@example.com',
        phone: '+1234567892',
        vehicle: 'Ford Focus',
        notes: 'General service completed',
        paymentStatus: 'completed',
        advancePaid: 1750,
        services: [
            { id: 20, name: "General Service", amount: 3500, required: true, active: true }
        ],
        transactionId: 'TXN_654646_001',
        paymentMethod: 'Cash',
        paymentDate: '2025-09-25'
    },
    {
        id: 789012,
        bookingId: 789012,
        vehicleNo: "TN 02 CD 5678",
        date: '2025-09-20',
        time: '10:00 AM',
        amount: 3000,
        status: 'Canceled',
        category: 'Service',
        email: 'alice@example.com',
        phone: '+1234567893',
        vehicle: 'BMW X3',
        notes: 'Scheduled maintenance canceled',
        paymentStatus: 'canceled',
        advancePaid: 0,
        services: [
            { id: 30, name: "AC Service", amount: 2500, required: true, active: true },
            { id: 31, name: "Car Wash", amount: 500, required: false, active: true }
        ],
        transactionId: 'TXN_789012_001',
        paymentMethod: 'N/A',
        paymentDate: 'N/A'
    },
    {
        id: 890123,
        bookingId: 345678,
        vehicleNo: "TN 03 EF 9012",
        date: '2025-09-18',
        time: '3:00 PM',
        amount: 15000,
        status: 'Completed',
        category: 'Repair',
        email: 'bob@example.com',
        phone: '+1234567894',
        vehicle: 'Mercedes C-Class',
        notes: 'Transmission inspection and repair',
        paymentStatus: 'completed',
        advancePaid: 7500,
        services: [
            { id: 40, name: "Transmission Repair", amount: 15000, required: true, active: true }
        ],
        transactionId: 'TXN_890123_001',
        paymentMethod: 'Debit Card',
        paymentDate: '2025-09-18'
    },
    {
        id: 901234,
        bookingId: 987654,
        vehicleNo: "TN 04 GH 3456",
        date: '2025-09-22',
        time: '4:00 PM',
        amount: 15000,
        status: 'Completed',
        category: 'Service',
        email: 'charlie@example.com',
        phone: '+1234567895',
        vehicle: 'Audi A4',
        notes: 'Suspension repair and tire replacement',
        paymentStatus: 'completed',
        advancePaid: 7500,
        services: [
            { id: 50, name: "Suspension Repair", amount: 8000, required: true, active: true },
            { id: 51, name: "Tire Replacement", amount: 7000, required: false, active: true }
        ],
        transactionId: 'TXN_901234_001',
        paymentMethod: 'Credit Card',
        paymentDate: '2025-09-22'
    }
];

let filteredBookings = [...serviceHistory];

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

const bookingListMobile = document.getElementById("bookingListMobile");
const prevBtnMobile = document.getElementById("prevPageMobile");
const nextBtnMobile = document.getElementById("nextPageMobile");
const pageInfoMobile = document.getElementById("pageInfoMobile");
const searchInputMobile = document.getElementById("searchInputMobile");
const searchBtnMobile = document.getElementById("searchBtnMobile");
const filterBtnMobile = document.getElementById("filterBtnMobile");
const filterPanelMobile = document.getElementById("filterPanelMobile");
const applyFilterMobile = document.getElementById("applyFilterMobile");
const filterCategoryMobile = document.getElementById("filterCategoryMobile");
const filterStatusMobile = document.getElementById("filterStatusMobile");
const filterDateFromMobile = document.getElementById("filterDateFromMobile");
const filterDateToMobile = document.getElementById("filterDateToMobile");

const bookingModal = document.getElementById("booking-modal");
const modalCloseBtn = document.getElementById("modal-close-btn");
const modalContent = document.getElementById("modal-content");

const invoiceModal = document.getElementById("invoice-modal");
const invoiceModalCloseBtn = document.getElementById("invoice-modal-close-btn");
const invoiceContent = document.getElementById("invoice-content");
const downloadPdfBtn = document.getElementById("download-pdf-btn");

let currentPageDesktop = 1;
const rowsPerPageDesktop = 10;
let currentPageMobile = 1;
const rowsPerPageMobile = 5;
let currentInvoiceBooking = null;

// Utility functions
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function getStatusClass(status) {
    switch (status) {
        case 'Completed': return 'status-completed';
        case 'OnGoing': return 'status-ongoing';
        case 'Pending': return 'status-pending';
        case 'Canceled': return 'status-canceled';
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
                <td class="py-2 px-4 border border-gray-300">${booking.bookingId}</td>
                <td class="py-2 px-4 border border-gray-300">${booking.vehicleNo}</td>
                <td class="py-2 px-4 border border-gray-300">${formatDate(booking.date)}</td>
                <td class="py-2 px-4 border border-gray-300">${booking.time}</td>
                <td class="py-2 px-4 border border-gray-300">₹${booking.amount}</td>
                <td class="py-2 px-4 border border-gray-300">
                    <span class="px-2 py-1 rounded-full text-xs ${getStatusClass(booking.status)}">
                        ${booking.status}
                    </span>
                </td>
                <td class="py-2 px-4 border border-gray-300">${booking.category}</td>
                <td class="py-2 px-4 border border-gray-300">
                    <button class="viewDetailsDesktop text-blue-600 hover:underline mr-2" data-index="${globalIdx}">
                        View Details
                    </button>
                    ${booking.status === 'Completed' ?
                `<button class="downloadInvoiceDesktop text-green-600 hover:underline" data-index="${globalIdx}">
                        Download Invoice
                    </button>` : ''}
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
                <div class="flex items-center mb-3">
                    <div class="mr-3 text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    
                    <div class="flex-1">
                        <div class="font-semibold text-gray-900">#${booking.bookingId}</div>
                        <div class="text-sm text-gray-600">${booking.vehicleNo}</div>
                        <div class="text-xs text-gray-500 mt-1">${formatDate(booking.date)} • ${booking.time}</div>
                    </div>
                    
                    <span class="px-2 py-1 rounded-full text-xs ${getStatusClass(booking.status)}">
                        ${booking.status}
                    </span>
                </div>
                
                <div class="flex justify-between items-center text-sm mb-2">
                    <span>Category: ${booking.category}</span>
                    <span class="font-semibold">₹${booking.amount}</span>
                </div>
                
                <div class="flex justify-between mt-3">
                    <button class="viewDetailsMobile text-blue-600 hover:underline text-sm" data-index="${globalIdx}">
                        View Details
                    </button>
                    ${booking.status === 'Completed' ?
                `<button class="downloadInvoiceMobile text-green-600 hover:underline text-sm" data-index="${globalIdx}">
                        Download Invoice
                    </button>` : ''}
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
            showBookingDetails(booking);
        });
    });

    document.querySelectorAll(".downloadInvoiceDesktop").forEach(btn => {
        btn.addEventListener("click", function () {
            const idx = parseInt(this.getAttribute("data-index"));
            const booking = filteredBookings[idx];
            showInvoiceModal(booking);
        });
    });
}

// Attach events for mobile action buttons
function attachMobileEvents() {
    document.querySelectorAll(".viewDetailsMobile").forEach(btn => {
        btn.addEventListener("click", function () {
            const idx = parseInt(this.getAttribute("data-index"));
            const booking = filteredBookings[idx];
            showBookingDetails(booking);
        });
    });

    document.querySelectorAll(".downloadInvoiceMobile").forEach(btn => {
        btn.addEventListener("click", function () {
            const idx = parseInt(this.getAttribute("data-index"));
            const booking = filteredBookings[idx];
            showInvoiceModal(booking);
        });
    });
}

// Show booking details modal
function showBookingDetails(booking) {
    const totalAmount = calculateTotalAmount(booking.services);

    modalContent.innerHTML = `
                <h3 class="text-xl font-semibold mb-6 pr-8">Service Details</h3>
                <div class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Booking ID</label>
                            <p class="mt-1 text-sm text-gray-900">#${booking.bookingId}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Service Status</label>
                            <p class="mt-1 text-sm text-gray-900"><span class="px-2 py-1 rounded-full text-xs ${getStatusClass(booking.status)}">${booking.status}</span></p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Category</label>
                            <p class="mt-1 text-sm text-gray-900">${booking.category}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Vehicle No</label>
                            <p class="mt-1 text-sm text-gray-900">${booking.vehicleNo}</p>
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
                        <label class="block text-sm font-medium text-gray-700">Transaction Details</label>
                        <div class="mt-2 bg-gray-50 p-3 rounded">
                            <div class="grid grid-cols-2 gap-2 text-sm">
                                <div>Transaction ID:</div><div>${booking.transactionId}</div>
                                <div>Payment Method:</div><div>${booking.paymentMethod}</div>
                                <div>Payment Date:</div><div>${formatDate(booking.paymentDate)}</div>
                                <div>Payment Status:</div><div>${booking.paymentStatus}</div>
                                <div>Advance Paid:</div><div>₹${booking.advancePaid}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Services Provided</label>
                        <div class="mt-2 space-y-2">
                            ${booking.services.map(service => `
                                <div class="flex justify-between items-center bg-white border p-2 rounded">
                                    <span>${service.name}</span>
                                    <span class="font-medium">₹${service.amount}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="flex justify-between items-center pt-4 border-t">
                        <span class="font-semibold">Total Amount:</span>
                        <span class="text-lg font-bold">₹${totalAmount}</span>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Notes</label>
                        <p class="mt-1 text-sm text-gray-900">${booking.notes}</p>
                    </div>
                </div>
            `;
    bookingModal.classList.remove('hidden');
}

// Show invoice modal for PDF generation
function showInvoiceModal(booking) {
    currentInvoiceBooking = booking;
    const totalAmount = calculateTotalAmount(booking.services);

    invoiceContent.innerHTML = `
                <div class="invoice-header mb-8 border-b pb-4">
                    <div class="flex justify-between items-start">
                        <div>
                            <h1 class="text-2xl font-bold">INVOICE</h1>
                            <p class="text-gray-600">AutoCare Service Center</p>
                        </div>
                        <div class="text-right">
                            <p class="font-semibold">Invoice #: ${booking.transactionId}</p>
                            <p class="text-sm">Date: ${formatDate(booking.paymentDate)}</p>
                        </div>
                    </div>
                </div>
                
                <div class="grid grid-cols-2 gap-8 mb-8">
                    <div>
                        <h2 class="font-semibold mb-2">Bill To:</h2>
                        <p>${booking.email}</p>
                        <p>${booking.phone}</p>
                    </div>
                    <div>
                        <h2 class="font-semibold mb-2">Service Details:</h2>
                        <p>Booking ID: #${booking.bookingId}</p>
                        <p>Vehicle: ${booking.vehicle} (${booking.vehicleNo})</p>
                        <p>Service Date: ${formatDate(booking.date)}</p>
                    </div>
                </div>
                
                <table class="w-full mb-6">
                    <thead>
                        <tr class="border-b">
                            <th class="text-left py-2">Service Description</th>
                            <th class="text-right py-2">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${booking.services.map(service => `
                            <tr class="border-b">
                                <td class="py-2">${service.name}</td>
                                <td class="text-right py-2">₹${service.amount}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <div class="flex justify-end mb-6">
                    <div class="w-64">
                        <div class="flex justify-between py-2">
                            <span>Subtotal:</span>
                            <span>₹${totalAmount}</span>
                        </div>
                        <div class="flex justify-between py-2">
                            <span>Tax (10%):</span>
                            <span>₹${Math.round(totalAmount * 0.1)}</span>
                        </div>
                        <div class="flex justify-between py-2 border-t font-bold">
                            <span>Total:</span>
                            <span>₹${totalAmount + Math.round(totalAmount * 0.1)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="border-t pt-4 text-center text-sm text-gray-600">
                    <p>Thank you for choosing AutoCare Service Center</p>
                    <p>For any queries, contact: support@autocare.com | +1 (555) 123-4567</p>
                </div>
            `;

    invoiceModal.classList.remove('hidden');
}

// Generate PDF from invoice content
function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');

    // Capture the invoice content as an image
    html2canvas(invoiceContent, {
        scale: 2,
        useCORS: true,
        logging: false
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 295; // A4 height in mm
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;

        let position = 0;

        // Add first page
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Add additional pages if content is too long
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            doc.addPage();
            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        // Download the PDF
        doc.save(`invoice-${currentInvoiceBooking.bookingId}.pdf`);
    });
}

// Close modal
modalCloseBtn.addEventListener('click', () => {
    bookingModal.classList.add('hidden');
});

// Close invoice modal
invoiceModalCloseBtn.addEventListener('click', () => {
    invoiceModal.classList.add('hidden');
});

// Download PDF button
downloadPdfBtn.addEventListener('click', generatePDF);

// Close modals when clicking outside
bookingModal.addEventListener('click', (e) => {
    if (e.target === bookingModal) {
        bookingModal.classList.add('hidden');
    }
});

invoiceModal.addEventListener('click', (e) => {
    if (e.target === invoiceModal) {
        invoiceModal.classList.add('hidden');
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

    // Use whichever search term is not empty, or combine both
    const searchTerm = searchTermDesktop || searchTermMobile;

    if (searchTerm === '' || searchTerm.length === 0) {
        filteredBookings = [...serviceHistory];
        applyCurrentFilters();
        return;
    }

    filteredBookings = serviceHistory.filter(booking =>
        booking.bookingId.toString().includes(searchTerm) ||
        booking.vehicleNo.toLowerCase().includes(searchTerm) ||
        booking.status.toLowerCase().includes(searchTerm) ||
        booking.category.toLowerCase().includes(searchTerm) ||
        booking.vehicle.toLowerCase().includes(searchTerm) ||
        booking.transactionId.toLowerCase().includes(searchTerm)
    );

    // Apply any active filters to the search results
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

// Apply current filters to the current dataset (search results or full dataset)
function applyCurrentFilters() {
    const categoryDesktop = filterCategoryDesktop.value;
    const categoryMobile = filterCategoryMobile.value;
    const statusDesktop = filterStatusDesktop.value;
    const statusMobile = filterStatusMobile.value;
    const dateFromDesktop = filterDateFromDesktop.value;
    const dateToDesktop = filterDateToDesktop.value;
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
    // Start with full dataset or current search results
    const searchTermDesktop = searchInputDesktop.value.toLowerCase();
    const searchTermMobile = searchInputMobile.value.toLowerCase();
    const searchTerm = searchTermDesktop || searchTermMobile;

    if (searchTerm !== '') {
        filteredBookings = serviceHistory.filter(booking =>
            booking.bookingId.toString().includes(searchTerm) ||
            booking.vehicleNo.toLowerCase().includes(searchTerm) ||
            booking.status.toLowerCase().includes(searchTerm) ||
            booking.category.toLowerCase().includes(searchTerm) ||
            booking.vehicle.toLowerCase().includes(searchTerm) ||
            booking.transactionId.toLowerCase().includes(searchTerm)
        );
    } else {
        filteredBookings = [...serviceHistory];
    }

    // Apply filters to the current dataset
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
