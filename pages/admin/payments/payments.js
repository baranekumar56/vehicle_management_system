localStorage.setItem('vms_current_page', 'payments');

// Sample payment data - dynamically loaded
const payments = [
    { id: 12123, payeeId: 2343423, payeeName: 'Barane', totalAmount: 54545, amount: 11500, status: 'Pending', date: '12/10/2025', paymentMethod: 'Credit Card', transactionId: 'TXN001', description: 'Service payment for Toyota Camry' },
    { id: 3242342, payeeId: 243243, payeeName: 'Kumar', totalAmount: 2344, amount: 2344, status: 'Completed', date: '13/10/2025', paymentMethod: 'Debit Card', transactionId: 'TXN002', description: 'Repair payment for Honda Civic' },
    { id: 456789, payeeId: 789012, payeeName: 'Alice', totalAmount: 7500, amount: 7500, status: 'Completed', date: '14/10/2025', paymentMethod: 'Bank Transfer', transactionId: 'TXN003', description: 'Maintenance service payment' },
    { id: 567890, payeeId: 890123, payeeName: 'Bob', totalAmount: 3200, amount: 3200, status: 'Failed', date: '15/10/2025', paymentMethod: 'Credit Card', transactionId: 'TXN004', description: 'Inspection service payment' },
    { id: 678901, payeeId: 901234, payeeName: 'Charlie', totalAmount: 8900, amount: 8900, status: 'Pending', date: '16/10/2025', paymentMethod: 'PayPal', transactionId: 'TXN005', description: 'Premium service package' },
    { id: 789012, payeeId: 123456, payeeName: 'Diana', totalAmount: 1500, amount: 1500, status: 'Refunded', date: '17/10/2025', paymentMethod: 'Credit Card', transactionId: 'TXN006', description: 'Cancelled service refund' }
];

let filteredPayments = [...payments];

// Elements references
const tableBodyDesktop = document.getElementById("paymentTableBodyDesktop");
const prevBtnDesktop = document.getElementById("prevPageDesktop");
const nextBtnDesktop = document.getElementById("nextPageDesktop");
const pageInfoDesktop = document.getElementById("pageInfoDesktop");
const searchInputDesktop = document.getElementById("searchInputDesktop");
const searchBtnDesktop = document.getElementById("searchBtnDesktop");
const filterStatusDesktop = document.getElementById("filterStatusDesktop");
const filterAmountMinDesktop = document.getElementById("filterAmountMinDesktop");
const filterAmountMaxDesktop = document.getElementById("filterAmountMaxDesktop");
const filterDateFromDesktop = document.getElementById("filterDateFromDesktop");
const filterDateToDesktop = document.getElementById("filterDateToDesktop");
const filterBtnDesktop = document.getElementById("filterBtnDesktop");
const filterPanelDesktop = document.getElementById("filterPanelDesktop");
const applyFilterDesktop = document.getElementById("applyFilterDesktop");

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
const filterAmountMinMobile = document.getElementById("filterAmountMinMobile");
const filterAmountMaxMobile = document.getElementById("filterAmountMaxMobile");
const filterDateFromMobile = document.getElementById("filterDateFromMobile");
const filterDateToMobile = document.getElementById("filterDateToMobile");

const paymentModal = document.getElementById("payment-modal");
const modalCloseBtn = document.getElementById("modal-close-btn");
const modalContent = document.getElementById("modal-content");

// Tab elements
const billingTab = document.getElementById("billingTab");
const refundTab = document.getElementById("refundTab");
const billingTabMobile = document.getElementById("billingTabMobile");
const refundTabMobile = document.getElementById("refundTabMobile");

let currentPageDesktop = 1;
const rowsPerPageDesktop = 10;
let currentPageMobile = 1;
const rowsPerPageMobile = 5;
let currentTab = 'billing';

// Tab functionality
function switchTab(tab) {
    currentTab = tab;
    // Update tab styles
    if (tab === 'billing') {
        billingTab.className = "px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors";
        refundTab.className = "px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors";
        billingTabMobile.className = "px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm";
        refundTabMobile.className = "px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm";
    } else {
        billingTab.className = "px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors";
        refundTab.className = "px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors";
        billingTabMobile.className = "px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm";
        refundTabMobile.className = "px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm";
    }
    applyFilters();
}

// Tab event listeners
// billingTab.addEventListener('click', (e) => { e.preventDefault(); switchTab('billing'); });
// refundTab.addEventListener('click', (e) => { e.preventDefault(); switchTab('refund'); });
// billingTabMobile.addEventListener('click', (e) => { e.preventDefault(); switchTab('billing'); });
// refundTabMobile.addEventListener('click', (e) => { e.preventDefault(); switchTab('refund'); });

// --- RENDER functions unified ---
function render() {
    renderTableDesktop();
    renderMobileListPaginated();
    updatePaginationDesktop();
    updatePaginationMobile();
}

function getStatusColor(status) {
    switch (status.toLowerCase()) {
        case 'pending': return 'text-yellow-600 bg-yellow-100';
        case 'completed': return 'text-green-600 bg-green-100';
        case 'failed': return 'text-red-600 bg-red-100';
        case 'refunded': return 'text-blue-600 bg-blue-100';
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
                <td class="py-2 px-4 border border-gray-300">${payment.id}</td>
                <td class="py-2 px-4 border border-gray-300">${payment.payeeId}</td>
                <td class="py-2 px-4 border border-gray-300">${payment.payeeName}</td>
                <td class="py-2 px-4 border border-gray-300">$${payment.totalAmount.toLocaleString()}</td>
                <td class="py-2 px-4 border border-gray-300">$${payment.amount.toLocaleString()}</td>
                <td class="py-2 px-4 border border-gray-300">
                    <span class="px-2 py-1 rounded-full text-xs ${statusColor}">${payment.status}</span>
                </td>
                <td class="py-2 px-4 border border-gray-300">
                <button class="viewDetailsDesktop text-blue-600 hover:underline" data-index="${globalIdx}">
                    View
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
    const pageData = filteredPayments.slice(start, end);

    paymentListMobile.innerHTML = "";
    pageData.forEach((payment, idx) => {
        const globalIdx = start + idx;
        const statusColor = getStatusColor(payment.status);
        paymentListMobile.innerHTML += `
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center">
                <div class="mr-3 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                </div>
                
                <div class="flex-1">
                    <div class="font-semibold text-gray-900">#${payment.id}</div>
                    <div class="text-sm text-gray-600">Payee: ${payment.payeeName}</div>
                    <div class="text-xs text-gray-500 mt-1">$${payment.amount.toLocaleString()} • ${payment.date}</div>
                    <span class="inline-block mt-1 px-2 py-1 rounded-full text-xs ${statusColor}">${payment.status}</span>
                </div>
                
                <button class="viewDetailsMobile text-gray-400 hover:text-gray-600 ml-2" data-index="${globalIdx}">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
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
            const payment = filteredPayments[idx];
            showPaymentDetails(payment);
        });
    });
}

// Attach events for mobile action buttons
function attachMobileEvents() {
    document.querySelectorAll(".viewDetailsMobile").forEach(btn => {
        btn.addEventListener("click", function () {
            const idx = parseInt(this.getAttribute("data-index"));
            const payment = filteredPayments[idx];
            showPaymentDetails(payment);
        });
    });
}

// Show payment details modal
function showPaymentDetails(payment) {
    const statusColor = getStatusColor(payment.status);
    modalContent.innerHTML = `
                <h3 class="text-xl font-semibold mb-6 pr-8">Payment Details</h3>
                <div class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Payment ID</label>
                            <p class="mt-1 text-sm text-gray-900">#${payment.id}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Transaction ID</label>
                            <p class="mt-1 text-sm text-gray-900">${payment.transactionId}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Payee ID</label>
                            <p class="mt-1 text-sm text-gray-900">${payment.payeeId}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Payee Name</label>
                            <p class="mt-1 text-sm text-gray-900">${payment.payeeName}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Total Amount</label>
                            <p class="mt-1 text-sm text-gray-900">$${payment.totalAmount.toLocaleString()}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Amount Paid</label>
                            <p class="mt-1 text-sm text-gray-900">$${payment.amount.toLocaleString()}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Date</label>
                            <p class="mt-1 text-sm text-gray-900">${payment.date}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Payment Method</label>
                            <p class="mt-1 text-sm text-gray-900">${payment.paymentMethod}</p>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Status</label>
                        <span class="inline-block mt-1 px-3 py-1 rounded-full text-sm ${statusColor}">${payment.status}</span>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Description</label>
                        <p class="mt-1 text-sm text-gray-900">${payment.description}</p>
                    </div>
                </div>
            `;
    paymentModal.classList.remove('hidden');
}

// Close modal
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

// Search functionality - Only on search button click
function performSearch() {
    const searchTermDesktop = searchInputDesktop.value.toLowerCase();
    const searchTermMobile = searchInputMobile.value.toLowerCase();

    // Use whichever search term is not empty, or combine both
    const searchTerm = searchTermDesktop || searchTermMobile;

    if (searchTerm === '') {
        filteredPayments = [...payments];
        applyCurrentFilters();
        return;
    }

    filteredPayments = payments.filter(payment =>
        payment.payeeName.toLowerCase().includes(searchTerm) ||
        payment.id.toString().includes(searchTerm) ||
        payment.payeeId.toString().includes(searchTerm) ||
        payment.amount.toString().includes(searchTerm) ||
        payment.totalAmount.toString().includes(searchTerm) ||
        payment.status.toLowerCase().includes(searchTerm) ||
        payment.date.toLowerCase().includes(searchTerm) ||
        payment.paymentMethod.toLowerCase().includes(searchTerm)
    );

    // Apply any active filters to the search results
    applyCurrentFilters();

    currentPageDesktop = 1;
    currentPageMobile = 1;
    render();
}

// Search event listeners - ONLY on button click
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
    const statusDesktop = filterStatusDesktop.value;
    const statusMobile = filterStatusMobile.value;
    const amountMinDesktop = parseFloat(filterAmountMinDesktop.value) || 0;
    const amountMinMobile = parseFloat(filterAmountMinMobile.value) || 0;
    const amountMaxDesktop = parseFloat(filterAmountMaxDesktop.value) || Infinity;
    const amountMaxMobile = parseFloat(filterAmountMaxMobile.value) || Infinity;
    const dateFromDesktop = filterDateFromDesktop.value;
    const dateToDesktop = filterDateToDesktop.value;
    const dateFromMobile = filterDateFromMobile.value;
    const dateToMobile = filterDateToMobile.value;

    // Use whichever values are not empty
    const statusFilter = statusDesktop || statusMobile;
    const amountMin = Math.max(amountMinDesktop, amountMinMobile);
    const amountMax = Math.min(amountMaxDesktop, amountMaxMobile);
    const dateFrom = dateFromDesktop || dateFromMobile;
    const dateTo = dateToDesktop || dateToMobile;

    if (statusFilter || amountMin > 0 || amountMax < Infinity || dateFrom || dateTo) {
        filteredPayments = filteredPayments.filter(payment => {
            // Status filter
            const statusMatch = statusFilter === '' || payment.status === statusFilter;

            // Amount filter
            const amountMatch = payment.amount >= amountMin && payment.amount <= amountMax;

            // Date filter
            let dateMatch = true;
            if (dateFrom || dateTo) {
                const paymentDate = new Date(payment.date.split('/').reverse().join('-'));
                if (dateFrom) {
                    const fromDate = new Date(dateFrom);
                    if (paymentDate < fromDate) dateMatch = false;
                }
                if (dateTo) {
                    const toDate = new Date(dateTo);
                    if (paymentDate > toDate) dateMatch = false;
                }
            }

            // Tab filter
            let tabMatch = true;
            if (currentTab === 'refund') {
                tabMatch = payment.status === 'Refunded';
            } else {
                tabMatch = payment.status !== 'Refunded';
            }

            return statusMatch && amountMatch && dateMatch && tabMatch;
        });
    } else {
        // Apply tab filter even when no other filters are active
        if (currentTab === 'refund') {
            filteredPayments = filteredPayments.filter(payment => payment.status === 'Refunded');
        } else {
            filteredPayments = filteredPayments.filter(payment => payment.status !== 'Refunded');
        }
    }
}

// Apply filters function
function applyFilters() {
    // Start with full dataset or current search results
    const searchTermDesktop = searchInputDesktop.value.toLowerCase();
    const searchTermMobile = searchInputMobile.value.toLowerCase();
    const searchTerm = searchTermDesktop || searchTermMobile;

    if (searchTerm !== '') {
        filteredPayments = payments.filter(payment =>
            payment.payeeName.toLowerCase().includes(searchTerm) ||
            payment.id.toString().includes(searchTerm) ||
            payment.payeeId.toString().includes(searchTerm) ||
            payment.amount.toString().includes(searchTerm) ||
            payment.totalAmount.toString().includes(searchTerm) ||
            payment.status.toLowerCase().includes(searchTerm) ||
            payment.date.toLowerCase().includes(searchTerm) ||
            payment.paymentMethod.toLowerCase().includes(searchTerm)
        );
    } else {
        filteredPayments = [...payments];
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
filterStatusDesktop.addEventListener("change", applyFilters);
filterAmountMinDesktop.addEventListener("input", applyFilters);
filterAmountMaxDesktop.addEventListener("input", applyFilters);
filterDateFromDesktop.addEventListener("change", applyFilters);
filterDateToDesktop.addEventListener("change", applyFilters);
filterStatusMobile.addEventListener("change", applyFilters);
filterAmountMinMobile.addEventListener("input", applyFilters);
filterAmountMaxMobile.addEventListener("input", applyFilters);
filterDateFromMobile.addEventListener("change", applyFilters);
filterDateToMobile.addEventListener("change", applyFilters);

// Initial render
render();

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
       <a href="billing.html" class="block w-full text-left px-4 py-2 hover:bg-indigo-700 focus:outline-none" type="button">
        Billing
      </a>



    `;

        menu_actions.parentElement.appendChild(dropdown);


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
        parent.postMessage(JSON.stringify(filteredPayments), "http://127.0.0.1:5500");
    }, 2000)
}
