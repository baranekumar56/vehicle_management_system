localStorage.setItem('vms_current_page', 'notifications');

// Sample notification data
const notifications = [
    {
        id: 'N001',
        recipientType: 'Customer',
        recipients: 'All',
        specificIds: [],
        date: '24/09/2025',
        time: '09:30',
        status: 'Sent',
        content: 'Your vehicle service has been completed. Please collect your car from our garage.',
        sentTo: 'All Customers (245 users)'
    },
    {
        id: 'N002',
        recipientType: 'Mechanic',
        recipients: 'Specific',
        specificIds: ['M123', 'M456'],
        date: '24/09/2025',
        time: '10:15',
        status: 'Sent',
        content: 'New urgent repair request assigned. Please check your dashboard for details.',
        sentTo: 'Mechanics: M123, M456'
    },
    {
        id: 'N003',
        recipientType: 'All',
        recipients: 'All',
        specificIds: [],
        date: '23/09/2025',
        time: '14:20',
        status: 'Pending',
        content: 'System maintenance scheduled for tonight from 11 PM to 2 AM. Services may be temporarily unavailable.',
        sentTo: 'All Users (378 users)'
    },
    {
        id: 'N004',
        recipientType: 'Customer',
        recipients: 'Specific',
        specificIds: ['C789', 'C012'],
        date: '23/09/2025',
        time: '16:45',
        status: 'Failed',
        content: 'Reminder: Your vehicle inspection is due next week. Please schedule an appointment.',
        sentTo: 'Customers: C789, C012'
    },
    {
        id: 'N005',
        recipientType: 'Mechanic',
        recipients: 'All',
        specificIds: [],
        date: '22/09/2025',
        time: '11:30',
        status: 'Sent',
        content: 'New safety protocols have been updated. Please review the latest guidelines in your portal.',
        sentTo: 'All Mechanics (28 users)'
    },
    {
        id: 'N006',
        recipientType: 'Customer',
        recipients: 'Specific',
        specificIds: ['C345'],
        date: '22/09/2025',
        time: '13:15',
        status: 'Sent',
        content: 'Your service appointment has been confirmed for tomorrow at 2 PM. Please arrive 15 minutes early.',
        sentTo: 'Customer: C345'
    }
];

let filteredNotifications = [...notifications];

// Elements references
const tableBodyDesktop = document.getElementById("notificationTableBodyDesktop");
const prevBtnDesktop = document.getElementById("prevPageDesktop");
const nextBtnDesktop = document.getElementById("nextPageDesktop");
const pageInfoDesktop = document.getElementById("pageInfoDesktop");
const searchInputDesktop = document.getElementById("searchInputDesktop");
const searchBtnDesktop = document.getElementById("searchBtnDesktop");
const filterRecipientDesktop = document.getElementById("filterRecipientDesktop");
const filterStatusDesktop = document.getElementById("filterStatusDesktop");
const filterDateFromDesktop = document.getElementById("filterDateFromDesktop");
const filterDateToDesktop = document.getElementById("filterDateToDesktop");
const filterBtnDesktop = document.getElementById("filterBtnDesktop");
const filterPanelDesktop = document.getElementById("filterPanelDesktop");
const applyFilterDesktop = document.getElementById("applyFilterDesktop");

const notificationListMobile = document.getElementById("notificationListMobile");
const prevBtnMobile = document.getElementById("prevPageMobile");
const nextBtnMobile = document.getElementById("nextPageMobile");
const pageInfoMobile = document.getElementById("pageInfoMobile");
const searchInputMobile = document.getElementById("searchInputMobile");
const searchBtnMobile = document.getElementById("searchBtnMobile");
const filterBtnMobile = document.getElementById("filterBtnMobile");
const filterPanelMobile = document.getElementById("filterPanelMobile");
const applyFilterMobile = document.getElementById("applyFilterMobile");
const filterRecipientMobile = document.getElementById("filterRecipientMobile");
const filterStatusMobile = document.getElementById("filterStatusMobile");
const filterDateFromMobile = document.getElementById("filterDateFromMobile");
const filterDateToMobile = document.getElementById("filterDateToMobile");

const notificationModal = document.getElementById("notification-modal");
const modalCloseBtn = document.getElementById("modal-close-btn");
const modalContent = document.getElementById("modal-content");

// Create notification modal elements
const createNotificationModal = document.getElementById("create-notification-modal");
const createModalCloseBtn = document.getElementById("create-modal-close-btn");
const createNotificationBtn = document.getElementById("create-notification-btn");
const createNotificationBtnMobile = document.getElementById("create-notification-btn-mobile");
const notificationForm = document.getElementById("notification-form");
const recipientSelect = document.getElementById("notification-recipient");
const specificRecipientsDiv = document.getElementById("specific-recipients");
const cancelNotificationBtn = document.getElementById("cancel-notification");

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
        case 'sent': return 'text-green-600 bg-green-100';
        case 'pending': return 'text-yellow-600 bg-yellow-100';
        case 'failed': return 'text-red-600 bg-red-100';
        default: return 'text-gray-600 bg-gray-100';
    }
}

function renderTableDesktop() {
    const start = (currentPageDesktop - 1) * rowsPerPageDesktop;
    const end = start + rowsPerPageDesktop;
    const pageData = filteredNotifications.slice(start, end);

    tableBodyDesktop.innerHTML = "";
    pageData.forEach((notification, idx) => {
        const globalIdx = start + idx;
        const statusColor = getStatusColor(notification.status);
        tableBodyDesktop.innerHTML += `
                <tr class="hover:bg-gray-50">
                    <td class="py-2 px-4 border border-gray-300">${notification.id}</td>
                    <td class="py-2 px-4 border border-gray-300">${notification.recipientType}</td>
                    <td class="py-2 px-4 border border-gray-300">${notification.sentTo}</td>
                    <td class="py-2 px-4 border border-gray-300">${notification.date}</td>
                    <td class="py-2 px-4 border border-gray-300">${notification.time}</td>
                    <td class="py-2 px-4 border border-gray-300">
                        <span class="px-2 py-1 rounded-full text-xs ${statusColor}">${notification.status}</span>
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
    const pageData = filteredNotifications.slice(start, end);

    notificationListMobile.innerHTML = "";
    pageData.forEach((notification, idx) => {
        const globalIdx = start + idx;
        const statusColor = getStatusColor(notification.status);
        notificationListMobile.innerHTML += `
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center">
                    <div class="mr-3 text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM4 7h16M4 12h16M4 17h7" />
                        </svg>
                    </div>
                    
                    <div class="flex-1">
                        <div class="font-semibold text-gray-900">To: ${notification.recipientType}</div>
                        <div class="text-sm text-gray-600">${notification.date} • ${notification.time}</div>
                        <span class="inline-block mt-1 px-2 py-1 rounded-full text-xs ${statusColor}">${notification.status}</span>
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

// Attach events for desktop and mobile action buttons
function attachDesktopEvents() {
    document.querySelectorAll(".viewDetailsDesktop").forEach(btn => {
        btn.addEventListener("click", function () {
            const idx = parseInt(this.getAttribute("data-index"));
            const notification = filteredNotifications[idx];
            showNotificationDetails(notification);
        });
    });
}

function attachMobileEvents() {
    document.querySelectorAll(".viewDetailsMobile").forEach(btn => {
        btn.addEventListener("click", function () {
            const idx = parseInt(this.getAttribute("data-index"));
            const notification = filteredNotifications[idx];
            showNotificationDetails(notification);
        });
    });
}

// Show notification details modal
function showNotificationDetails(notification) {
    const statusColor = getStatusColor(notification.status);
    modalContent.innerHTML = `
                <h3 class="text-xl font-semibold mb-6 pr-8">Notification Details</h3>
                <div class="space-y-4">
                    <div class="grid grid-cols-1 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Notification ID</label>
                            <p class="mt-1 text-sm text-gray-900">${notification.id}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Recipient Type</label>
                            <p class="mt-1 text-sm text-gray-900">${notification.recipientType}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Sent To</label>
                            <p class="mt-1 text-sm text-gray-900">${notification.sentTo}</p>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Date</label>
                                <p class="mt-1 text-sm text-gray-900">${notification.date}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Time</label>
                                <p class="mt-1 text-sm text-gray-900">${notification.time}</p>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Status</label>
                            <span class="inline-block mt-1 px-3 py-1 rounded-full text-sm ${statusColor}">${notification.status}</span>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Message Content</label>
                            <div class="mt-1 p-3 bg-gray-50 rounded border text-sm text-gray-900">${notification.content}</div>
                        </div>
                    </div>
                </div>
            `;
    notificationModal.classList.remove('hidden');
}

// Close modals
modalCloseBtn.addEventListener('click', () => {
    notificationModal.classList.add('hidden');
});

createModalCloseBtn.addEventListener('click', () => {
    createNotificationModal.classList.add('hidden');
});

cancelNotificationBtn.addEventListener('click', () => {
    createNotificationModal.classList.add('hidden');
});

// Close modal when clicking outside
notificationModal.addEventListener('click', (e) => {
    if (e.target === notificationModal) {
        notificationModal.classList.add('hidden');
    }
});

createNotificationModal.addEventListener('click', (e) => {
    if (e.target === createNotificationModal) {
        createNotificationModal.classList.add('hidden');
    }
});

// Show/hide specific recipients field based on selection
recipientSelect.addEventListener('change', (e) => {
    if (e.target.value === 'customer' || e.target.value === 'mechanic') {
        specificRecipientsDiv.classList.remove('hidden');
    } else {
        specificRecipientsDiv.classList.add('hidden');
    }
});

// Open create notification modal
createNotificationBtn.addEventListener('click', () => {
    createNotificationModal.classList.remove('hidden');
});

createNotificationBtnMobile.addEventListener('click', () => {
    createNotificationModal.classList.remove('hidden');
});

// Handle form submission
notificationForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const recipientType = document.getElementById('notification-recipient').value;
    const recipientIds = document.getElementById('recipient-ids').value.trim();
    const content = document.getElementById('notification-content').value.trim();

    if (!recipientType || !content) {
        alert('Please fill in all required fields');
        return;
    }

    // Create new notification
    const newNotification = {
        id: 'N' + String(Math.floor(Math.random() * 1000)).padStart(3, '0'),
        recipientType: recipientType.charAt(0).toUpperCase() + recipientType.slice(1),
        recipients: recipientIds ? 'Specific' : 'All',
        specificIds: recipientIds ? recipientIds.split(' ').filter(id => id.trim()) : [],
        date: new Date().toLocaleDateString('en-GB'),
        time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        status: 'Sent',
        content: content,
        sentTo: recipientIds ?
            `${recipientType.charAt(0).toUpperCase() + recipientType.slice(1)}s: ${recipientIds}` :
            `All ${recipientType.charAt(0).toUpperCase() + recipientType.slice(1)}s`
    };

    // Add to notifications array
    notifications.unshift(newNotification);
    filteredNotifications = [...notifications];

    // Reset form and close modal
    notificationForm.reset();
    specificRecipientsDiv.classList.add('hidden');
    createNotificationModal.classList.add('hidden');

    // Reset pagination and re-render
    currentPageDesktop = 1;
    currentPageMobile = 1;
    render();

    alert('Notification sent successfully!');
});

// Pagination functions
function updatePaginationDesktop() {
    const totalPages = Math.ceil(filteredNotifications.length / rowsPerPageDesktop);
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
    const totalPages = Math.ceil(filteredNotifications.length / rowsPerPageDesktop);
    if (currentPageDesktop < totalPages) {
        currentPageDesktop++;
        render();
    }
});

function updatePaginationMobile() {
    const totalPages = Math.ceil(filteredNotifications.length / rowsPerPageMobile);
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
    const totalPages = Math.ceil(filteredNotifications.length / rowsPerPageMobile);
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
        filteredNotifications = [...notifications];
        applyCurrentFilters();
        return;
    }

    filteredNotifications = notifications.filter(notification =>
        notification.id.toLowerCase().includes(searchTerm) ||
        notification.recipientType.toLowerCase().includes(searchTerm) ||
        notification.sentTo.toLowerCase().includes(searchTerm) ||
        notification.content.toLowerCase().includes(searchTerm) ||
        notification.date.toLowerCase().includes(searchTerm) ||
        notification.status.toLowerCase().includes(searchTerm)
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
    const recipientDesktop = filterRecipientDesktop.value;
    const recipientMobile = filterRecipientMobile.value;
    const statusDesktop = filterStatusDesktop.value;
    const statusMobile = filterStatusMobile.value;
    const dateFromDesktop = filterDateFromDesktop.value;
    const dateToDesktop = filterDateToDesktop.value;
    const dateFromMobile = filterDateFromMobile.value;
    const dateToMobile = filterDateToMobile.value;

    const recipientFilter = recipientDesktop || recipientMobile;
    const statusFilter = statusDesktop || statusMobile;
    const dateFrom = dateFromDesktop || dateFromMobile;
    const dateTo = dateToDesktop || dateToMobile;

    if (recipientFilter || statusFilter || dateFrom || dateTo) {
        filteredNotifications = filteredNotifications.filter(notification => {
            // Recipient type filter
            const recipientMatch = recipientFilter === '' || notification.recipientType === recipientFilter;

            // Status filter
            const statusMatch = statusFilter === '' || notification.status === statusFilter;

            // Date filter
            let dateMatch = true;
            if (dateFrom || dateTo) {
                const notificationDate = new Date(notification.date.split('/').reverse().join('-'));
                if (dateFrom) {
                    const fromDate = new Date(dateFrom);
                    if (notificationDate < fromDate) dateMatch = false;
                }
                if (dateTo) {
                    const toDate = new Date(dateTo);
                    if (notificationDate > toDate) dateMatch = false;
                }
            }

            return recipientMatch && statusMatch && dateMatch;
        });
    }
}

// Apply filters function
function applyFilters() {
    const searchTermDesktop = searchInputDesktop.value.toLowerCase();
    const searchTermMobile = searchInputMobile.value.toLowerCase();
    const searchTerm = searchTermDesktop || searchTermMobile;

    if (searchTerm !== '') {
        filteredNotifications = notifications.filter(notification =>
            notification.id.toLowerCase().includes(searchTerm) ||
            notification.recipientType.toLowerCase().includes(searchTerm) ||
            notification.sentTo.toLowerCase().includes(searchTerm) ||
            notification.content.toLowerCase().includes(searchTerm) ||
            notification.date.toLowerCase().includes(searchTerm) ||
            notification.status.toLowerCase().includes(searchTerm)
        );
    } else {
        filteredNotifications = [...notifications];
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

// Filter input change events
filterRecipientDesktop.addEventListener("change", applyFilters);
filterStatusDesktop.addEventListener("change", applyFilters);
filterDateFromDesktop.addEventListener("change", applyFilters);
filterDateToDesktop.addEventListener("change", applyFilters);
filterRecipientMobile.addEventListener("change", applyFilters);
filterStatusMobile.addEventListener("change", applyFilters);
filterDateFromMobile.addEventListener("change", applyFilters);
filterDateToMobile.addEventListener("change", applyFilters);

// Initial render
render();

if (window.self !== window.top) {
    setInterval(() => {
        parent.postMessage(JSON.stringify(filteredDataDesktop), "http://127.0.0.1:5500");
    }, 2000)
}
