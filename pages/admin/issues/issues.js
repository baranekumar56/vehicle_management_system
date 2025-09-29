localStorage.setItem('vms_current_page', 'issues');

const tickets = [
    { 
        id: 12123, 
        generatedBy: 'barane@gmail.com', 
        name: 'Barane', 
        date: '2025-09-10', 
        type: 'General', 
        status: 'Open',
        description: 'I time of ...', 
        thread: [{ from: 'Barane', content: 'I time of ...', timestamp: '2025-09-10' }] 
    },
    { 
        id: 3242342, 
        generatedBy: 'kumar@mailg.com', 
        name: 'Kumar', 
        date: '2025-09-11', 
        type: 'Payment', 
        status: 'In Progress',
        description: 'Status not up....', 
        thread: [{ from: 'Kumar', content: 'Status not updated for my recent payment.', timestamp: '2025-09-11' }] 
    }
];

let filteredTickets = [...tickets];
let currentPageDesktop = 1;
const rowsPerPageDesktop = 10;
let currentPageMobile = 1;
const rowsPerPageMobile = 5;

const tableBodyDesktop = document.getElementById("ticketTableBodyDesktop");
const prevBtnDesktop = document.getElementById("prevPageDesktop");
const nextBtnDesktop = document.getElementById("nextPageDesktop");
const pageInfoDesktop = document.getElementById("pageInfoDesktop");
const searchInputDesktop = document.getElementById("searchInputDesktop");
const searchBtnDesktop = document.getElementById("searchBtnDesktop");
const filterTypeDesktop = document.getElementById("filterTypeDesktop");
const filterStatusDesktop = document.getElementById("filterStatusDesktop");
const filterDateFromDesktop = document.getElementById("filterDateFromDesktop");
const filterDateToDesktop = document.getElementById("filterDateToDesktop");
const filterBtnDesktop = document.getElementById("filterBtnDesktop");
const filterPanelDesktop = document.getElementById("filterPanelDesktop");
const applyFilterDesktop = document.getElementById("applyFilterDesktop");

const ticketListMobile = document.getElementById("ticketListMobile");
const prevBtnMobile = document.getElementById("prevPageMobile");
const nextBtnMobile = document.getElementById("nextPageMobile");
const pageInfoMobile = document.getElementById("pageInfoMobile");
const searchInputMobile = document.getElementById("searchInputMobile");
const searchBtnMobile = document.getElementById("searchBtnMobile");
const filterBtnMobile = document.getElementById("filterBtnMobile");
const filterPanelMobile = document.getElementById("filterPanelMobile");
const applyFilterMobile = document.getElementById("applyFilterMobile");
const filterTypeMobile = document.getElementById("filterTypeMobile");
const filterStatusMobile = document.getElementById("filterStatusMobile");
const filterDateFromMobile = document.getElementById("filterDateFromMobile");
const filterDateToMobile = document.getElementById("filterDateToMobile");

const ticketModal = document.getElementById("ticket-modal");
const modalCloseBtn = document.getElementById("modal-close-btn");
const modalContent = document.getElementById("modal-content");

function render() {
    renderTableDesktop();
    renderMobileListPaginated();
    updatePaginationDesktop();
    updatePaginationMobile();
}

function renderTableDesktop() {
    const start = (currentPageDesktop - 1) * rowsPerPageDesktop;
    const end = start + rowsPerPageDesktop;
    const pageData = filteredTickets.slice(start, end);

    tableBodyDesktop.innerHTML = "";
    pageData.forEach((ticket, idx) => {
        const globalIdx = start + idx;
        tableBodyDesktop.innerHTML += `
      <tr class="hover:bg-gray-50">
        <td class="py-2 px-4 border border-gray-300">${ticket.id}</td>
        <td class="py-2 px-4 border border-gray-300">${ticket.generatedBy}</td>
        <td class="py-2 px-4 border border-gray-300">${ticket.name}</td>
        <td class="py-2 px-4 border border-gray-300">${ticket.date}</td>
        <td class="py-2 px-4 border border-gray-300">${ticket.type}</td>
        <td class="py-2 px-4 border border-gray-300">
          <select class="status-select border rounded px-2 py-1 text-xs w-full" data-index="${globalIdx}">
            <option value="Open" ${ticket.status === 'Open' ? 'selected' : ''}>Open</option>
            <option value="In Progress" ${ticket.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
            <option value="Resolved" ${ticket.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
            <option value="Closed" ${ticket.status === 'Closed' ? 'selected' : ''}>Closed</option>
          </select>
        </td>
        <td class="py-2 px-4 border border-gray-300 truncate" title="${ticket.description}">${ticket.description}</td>
        <td class="py-2 px-4 border border-gray-300">
          <button class="viewDetailsDesktop text-blue-600 hover:underline mr-2" data-index="${globalIdx}">
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
    const pageData = filteredTickets.slice(start, end);

    ticketListMobile.innerHTML = "";
    pageData.forEach((ticket, idx) => {
        const globalIdx = start + idx;
        ticketListMobile.innerHTML += `
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div class="flex items-center">
          <div class="mr-3 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="12" r="10" stroke-width="2" stroke="currentColor" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 12h8M8 16h8M8 8h8" />
            </svg>
          </div>
          <div class="flex-1">
            <div class="font-semibold text-gray-900">#${ticket.id}</div>
            <div class="text-sm text-gray-600">By: ${ticket.name}</div>
            <div class="text-xs text-gray-500 mt-1">${ticket.date} • ${ticket.type}</div>
            <div class="text-xs text-gray-500 mt-1 truncate"> ${ticket.description} </div>
          </div>
          <button class="viewDetailsMobile text-gray-400 hover:text-gray-600 ml-2"
                  data-index="${globalIdx}">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div class="mt-3 flex items-center justify-between">
          <span class="text-xs font-medium">Status:</span>
          <select class="status-select-mobile border rounded px-2 py-1 text-xs" data-index="${globalIdx}">
            <option value="Open" ${ticket.status === 'Open' ? 'selected' : ''}>Open</option>
            <option value="In Progress" ${ticket.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
            <option value="Resolved" ${ticket.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
            <option value="Closed" ${ticket.status === 'Closed' ? 'selected' : ''}>Closed</option>
          </select>
        </div>
      </div>
    `;
    });
    attachMobileEvents();
}

function attachDesktopEvents() {
    document.querySelectorAll(".viewDetailsDesktop").forEach(btn => {
        btn.addEventListener("click", function () {
            const idx = parseInt(this.getAttribute("data-index"));
            const ticket = filteredTickets[idx];
            showTicketModal(ticket);
        });
    });

    // Add status change events for desktop
    document.querySelectorAll(".status-select").forEach(select => {
        select.addEventListener("change", function () {
            const idx = parseInt(this.getAttribute("data-index"));
            const newStatus = this.value;
            updateTicketStatus(idx, newStatus);
        });
    });
}

function attachMobileEvents() {
    document.querySelectorAll(".viewDetailsMobile").forEach(btn => {
        btn.addEventListener("click", function () {
            const idx = parseInt(this.getAttribute("data-index"));
            const ticket = filteredTickets[idx];
            showTicketModal(ticket);
        });
    });

    // Add status change events for mobile
    document.querySelectorAll(".status-select-mobile").forEach(select => {
        select.addEventListener("change", function () {
            const idx = parseInt(this.getAttribute("data-index"));
            const newStatus = this.value;
            updateTicketStatus(idx, newStatus);
        });
    });
}

function updateTicketStatus(index, newStatus) {
    if (index >= 0 && index < filteredTickets.length) {
        const ticket = filteredTickets[index];
        
        // Find the original ticket in the main tickets array
        const originalTicketIndex = tickets.findIndex(t => t.id === ticket.id);
        if (originalTicketIndex !== -1) {
            tickets[originalTicketIndex].status = newStatus;
            filteredTickets[index].status = newStatus;
            
            // Add status update to thread
            const statusUpdate = {
                from: "Admin",
                content: `Status changed to: ${newStatus}`,
                timestamp: new Date().toISOString().slice(0, 10)
            };
            tickets[originalTicketIndex].thread.push(statusUpdate);
            filteredTickets[index].thread.push(statusUpdate);
            
            // Re-render to reflect changes
            render();
            
            // Show success message
            showStatusUpdateMessage(`Ticket #${ticket.id} status updated to ${newStatus}`);
        }
    }
}

function showStatusUpdateMessage(message) {
    // Create a temporary notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function showTicketModal(ticket) {
    let threadHtml = '';
    ticket.thread.forEach(entry => {
        const isStatusUpdate = entry.content.startsWith('Status changed to:');
        threadHtml += `<div class="mb-2">
      <div class="text-xs text-gray-500">${entry.timestamp} - <span class="font-semibold">${entry.from}</span></div>
      <div class="p-2 ${isStatusUpdate ? 'bg-yellow-100 border-l-4 border-yellow-400' : 'bg-gray-100'} rounded text-sm">${entry.content}</div>
    </div>`;
    });

    modalContent.innerHTML = `
    <h3 class="text-xl font-semibold mb-4 pr-8">Ticket #${ticket.id}</h3>
    <div class="mb-4">
      <div class="text-gray-700 text-sm">
        <b>Type: </b>${ticket.type}
        <b class="ml-6">Date: </b>${ticket.date}
      </div>
      <div class="text-gray-700 text-sm mt-1">
        <b>Status: </b>
        <select id="modalStatusSelect" class="border rounded px-2 py-1 text-sm ml-2">
          <option value="Open" ${ticket.status === 'Open' ? 'selected' : ''}>Open</option>
          <option value="In Progress" ${ticket.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
          <option value="Resolved" ${ticket.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
          <option value="Closed" ${ticket.status === 'Closed' ? 'selected' : ''}>Closed</option>
        </select>
      </div>
      <div class="text-gray-700 text-sm mt-1">
        <b>Raised By:</b> (${ticket.generatedBy}) ${ticket.name}
      </div>
    </div>
    <div class="mb-3">
      <label class="block font-medium text-gray-700 text-sm mb-2">Thread</label>
      <div class="space-y-1 max-h-60 overflow-y-auto">${threadHtml}</div>
    </div>
    <form id="respondForm" class="mt-7 pt-2 border-t">
      <label class="block text-sm font-medium text-gray-700 mb-1">Respond to Ticket</label>
      <textarea class="w-full border rounded px-3 py-2 text-sm mb-2" rows="3" placeholder="Type your response..." required></textarea>
      <button type="submit"
              class="w-full mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Send Response</button>
    </form>
  `;
    
    ticketModal.classList.remove('hidden');
    
    // Add status change event for modal
    const modalStatusSelect = document.getElementById("modalStatusSelect");
    modalStatusSelect.addEventListener("change", function() {
        const newStatus = this.value;
        const ticketIndex = filteredTickets.findIndex(t => t.id === ticket.id);
        if (ticketIndex !== -1) {
            updateTicketStatus(ticketIndex, newStatus);
            // Update the ticket object for the modal
            ticket.status = newStatus;
        }
    });
    
    const respondForm = document.getElementById("respondForm");
    respondForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const textarea = respondForm.querySelector("textarea");
        const response = textarea.value.trim();
        if (response) {
            ticket.thread.push({ from: "Admin", content: response, timestamp: (new Date()).toISOString().slice(0, 10) });
            
            // Update the main tickets array
            const originalTicketIndex = tickets.findIndex(t => t.id === ticket.id);
            if (originalTicketIndex !== -1) {
                tickets[originalTicketIndex].thread.push({ from: "Admin", content: response, timestamp: (new Date()).toISOString().slice(0, 10) });
            }
            
            showTicketModal(ticket); // rerender modal
        }
    });
}

modalCloseBtn.addEventListener('click', () => {
    ticketModal.classList.add('hidden');
});

ticketModal.addEventListener('click', (e) => {
    if (e.target === ticketModal) ticketModal.classList.add('hidden');
});

function updatePaginationDesktop() {
    const totalPages = Math.ceil(filteredTickets.length / rowsPerPageDesktop);
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
    const totalPages = Math.ceil(filteredTickets.length / rowsPerPageDesktop);
    if (currentPageDesktop < totalPages) {
        currentPageDesktop++;
        render();
    }
});

function updatePaginationMobile() {
    const totalPages = Math.ceil(filteredTickets.length / rowsPerPageMobile);
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
    const totalPages = Math.ceil(filteredTickets.length / rowsPerPageMobile);
    if (currentPageMobile < totalPages) {
        currentPageMobile++;
        render();
    }
});

// Search (only on icon click/enter)
function performSearch() {
    const searchTermDesktop = searchInputDesktop.value.toLowerCase();
    const searchTermMobile = searchInputMobile.value.toLowerCase();
    const searchTerm = searchTermDesktop || searchTermMobile;
    if (!searchTerm) {
        filteredTickets = [...tickets];
        applyCurrentFilters();
        return;
    }
    filteredTickets = tickets.filter(ticket =>
        ticket.name.toLowerCase().includes(searchTerm) ||
        ticket.id.toString().includes(searchTerm) ||
        ticket.generatedBy.toString().includes(searchTerm) ||
        ticket.type.toLowerCase().includes(searchTerm) ||
        ticket.description.toLowerCase().includes(searchTerm) ||
        ticket.status.toLowerCase().includes(searchTerm)
    );
    applyCurrentFilters();
    currentPageDesktop = 1;
    currentPageMobile = 1;
    render();
}

searchBtnDesktop.addEventListener("click", performSearch);
searchInputDesktop.addEventListener("keydown", e => { if (e.key === "Enter") performSearch(); });
searchBtnMobile.addEventListener("click", performSearch);
searchInputMobile.addEventListener("keydown", e => { if (e.key === "Enter") performSearch(); });

// Desktop filter toggle
filterBtnDesktop.addEventListener("click", e => {
    e.stopPropagation(); filterPanelDesktop.classList.toggle("hidden");
});

filterBtnMobile.addEventListener("click", e => {
    e.stopPropagation(); filterPanelMobile.classList.toggle("hidden");
});

document.addEventListener("click", e => {
    if (!filterPanelDesktop.classList.contains("hidden") &&
        !filterPanelDesktop.contains(e.target) && e.target !== filterBtnDesktop) {
        filterPanelDesktop.classList.add("hidden");
    }
    if (!filterPanelMobile.classList.contains("hidden") &&
        !filterPanelMobile.contains(e.target) && e.target !== filterBtnMobile) {
        filterPanelMobile.classList.add("hidden");
    }
});

function applyCurrentFilters() {
    const typeDesktop = filterTypeDesktop.value;
    const typeMobile = filterTypeMobile.value;
    const statusDesktop = filterStatusDesktop.value;
    const statusMobile = filterStatusMobile.value;
    const dateFromDesktop = filterDateFromDesktop.value;
    const dateToDesktop = filterDateToDesktop.value;
    const dateFromMobile = filterDateFromMobile.value;
    const dateToMobile = filterDateToMobile.value;
    
    const typeFilter = typeDesktop || typeMobile;
    const statusFilter = statusDesktop || statusMobile;
    const dateFrom = dateFromDesktop || dateFromMobile;
    const dateTo = dateToDesktop || dateToMobile;

    if (typeFilter || statusFilter || dateFrom || dateTo) {
        filteredTickets = filteredTickets.filter(ticket => {
            // Type filter
            const typeMatch = typeFilter === '' || ticket.type === typeFilter;
            // Status filter
            const statusMatch = statusFilter === '' || ticket.status === statusFilter;
            // Date filter
            let dateMatch = true;
            if (dateFrom || dateTo) {
                const ticketDate = new Date(ticket.date);
                if (dateFrom) {
                    const fromDate = new Date(dateFrom);
                    if (ticketDate < fromDate) dateMatch = false;
                }
                if (dateTo) {
                    const toDate = new Date(dateTo);
                    if (ticketDate > toDate) dateMatch = false;
                }
            }
            return typeMatch && statusMatch && dateMatch;
        });
    }
}

function applyFilters() {
    const searchTermDesktop = searchInputDesktop.value.toLowerCase();
    const searchTermMobile = searchInputMobile.value.toLowerCase();
    const searchTerm = searchTermDesktop || searchTermMobile;
    if (searchTerm !== '') {
        filteredTickets = tickets.filter(ticket =>
            ticket.name.toLowerCase().includes(searchTerm) ||
            ticket.id.toString().includes(searchTerm) ||
            ticket.generatedBy.toString().includes(searchTerm) ||
            ticket.type.toLowerCase().includes(searchTerm) ||
            ticket.description.toLowerCase().includes(searchTerm) ||
            ticket.status.toLowerCase().includes(searchTerm)
        );
    } else {
        filteredTickets = [...tickets];
    }
    applyCurrentFilters();
    currentPageDesktop = 1;
    currentPageMobile = 1;
    render();
}

applyFilterDesktop.addEventListener("click", () => {
    filterPanelDesktop.classList.add("hidden"); applyFilters();
});

applyFilterMobile.addEventListener("click", () => {
    filterPanelMobile.classList.add("hidden"); applyFilters();
});

filterTypeDesktop.addEventListener("change", applyFilters);
filterStatusDesktop.addEventListener("change", applyFilters);
filterDateFromDesktop.addEventListener("change", applyFilters);
filterDateToDesktop.addEventListener("change", applyFilters);
filterTypeMobile.addEventListener("change", applyFilters);
filterStatusMobile.addEventListener("change", applyFilters);
filterDateFromMobile.addEventListener("change", applyFilters);
filterDateToMobile.addEventListener("change", applyFilters);

// Initial render
render();

if (window.self !== window.top) {
    setInterval(() => {
        parent.postMessage(JSON.stringify(filteredTickets), "http://127.0.0.1:5500");
    }, 2000)
}