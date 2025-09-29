localStorage.setItem('vms_current_page', 'issues');

// Sample customer tickets data
const customerTickets = [
    { 
        id: 12123, 
        generatedBy: 'barane@gmail.com', 
        name: 'Barane', 
        date: '2025-09-10', 
        type: 'General', 
        subject: 'Login issue',
        description: 'I am having trouble logging into my account', 
        status: 'Open',
        thread: [
            { from: 'Barane', content: 'I am having trouble logging into my account', timestamp: '2025-09-10' },
            { from: 'Support', content: 'We are looking into this issue', timestamp: '2025-09-11' }
        ] 
    },
    { 
        id: 3242342, 
        generatedBy: 'kumar@mailg.com', 
        name: 'Kumar', 
        date: '2025-09-11', 
        type: 'Payment', 
        subject: 'Payment not processed',
        description: 'My recent payment shows as pending for 3 days', 
        status: 'In Progress',
        thread: [
            { from: 'Kumar', content: 'My recent payment shows as pending for 3 days', timestamp: '2025-09-11' },
            { from: 'Support', content: 'Our payment team is investigating this', timestamp: '2025-09-12' }
        ] 
    }
];

let filteredTickets = [...customerTickets];
let currentPageDesktop = 1;
const rowsPerPageDesktop = 10;
let currentPageMobile = 1;
const rowsPerPageMobile = 5;

// Desktop elements
const tableBodyDesktop = document.getElementById("ticketTableBodyDesktop");
const prevBtnDesktop = document.getElementById("prevPageDesktop");
const nextBtnDesktop = document.getElementById("nextPageDesktop");
const pageInfoDesktop = document.getElementById("pageInfoDesktop");
const searchInputDesktop = document.getElementById("searchInputDesktop");
const searchBtnDesktop = document.getElementById("searchBtnDesktop");
const filterTypeDesktop = document.getElementById("filterTypeDesktop");
const filterDateFromDesktop = document.getElementById("filterDateFromDesktop");
const filterDateToDesktop = document.getElementById("filterDateToDesktop");
const filterBtnDesktop = document.getElementById("filterBtnDesktop");
const filterPanelDesktop = document.getElementById("filterPanelDesktop");
const applyFilterDesktop = document.getElementById("applyFilterDesktop");

// Mobile elements
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
const filterDateFromMobile = document.getElementById("filterDateFromMobile");
const filterDateToMobile = document.getElementById("filterDateToMobile");

// Modal elements
const ticketModal = document.getElementById("ticket-modal");
const modalCloseBtn = document.getElementById("modal-close-btn");
const modalContent = document.getElementById("modal-content");

// Create issue modal elements
const createIssueModal = document.getElementById("create-issue-modal");
const createModalCloseBtn = document.getElementById("create-modal-close-btn");
const createModalContent = document.getElementById("create-modal-content");
const createIssueForm = document.getElementById("createIssueForm");
const createTicketBtn = document.getElementById("create-ticket");
// const createTicketMobileBtn = document.getElementById("create-ticket-mobile");

// Initialize the application
function init() {
    render();
    setupEventListeners();
}

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
        <td class="py-2 px-4 border border-gray-300">${ticket.date}</td>
        <td class="py-2 px-4 border border-gray-300">${ticket.type}</td>
        <td class="py-2 px-4 border border-gray-300 truncate" title="${ticket.subject}">${ticket.subject}</td>
        <td class="py-2 px-4 border border-gray-300">
          <span class="px-2 py-1 rounded-full text-xs font-medium ${
            ticket.status === 'Open' ? 'bg-yellow-100 text-yellow-800' :
            ticket.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
            ticket.status === 'Resolved' ? 'bg-green-100 text-green-800' :
            'bg-gray-100 text-gray-800'
          }">${ticket.status}</span>
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
    const pageData = filteredTickets.slice(start, end);

    ticketListMobile.innerHTML = "";
    pageData.forEach((ticket, idx) => {
        const globalIdx = start + idx;
        ticketListMobile.innerHTML += `
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center">
        <div class="mr-3 text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke-width="2" stroke="currentColor" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 12h8M8 16h8M8 8h8" />
          </svg>
        </div>
        <div class="flex-1">
          <div class="font-semibold text-gray-900">#${ticket.id}</div>
          <div class="text-sm text-gray-600">${ticket.subject}</div>
          <div class="text-xs text-gray-500 mt-1">${ticket.date} • ${ticket.type}</div>
          <div class="mt-1">
            <span class="px-2 py-1 rounded-full text-xs font-medium ${
              ticket.status === 'Open' ? 'bg-yellow-100 text-yellow-800' :
              ticket.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
              ticket.status === 'Resolved' ? 'bg-green-100 text-green-800' :
              'bg-gray-100 text-gray-800'
            }">${ticket.status}</span>
          </div>
        </div>
        <button class="viewDetailsMobile text-gray-400 hover:text-gray-600 ml-2"
                data-index="${globalIdx}">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
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
}

function attachMobileEvents() {
    document.querySelectorAll(".viewDetailsMobile").forEach(btn => {
        btn.addEventListener("click", function () {
            const idx = parseInt(this.getAttribute("data-index"));
            const ticket = filteredTickets[idx];
            showTicketModal(ticket);
        });
    });
}

function showTicketModal(ticket) {
    let threadHtml = '';
    ticket.thread.forEach(entry => {
        const isCustomer = entry.from === ticket.name;
        threadHtml += `<div class="mb-3 ${isCustomer ? 'bg-blue-50 p-3 rounded-lg' : 'bg-gray-50 p-3 rounded-lg'}">
      <div class="text-xs ${isCustomer ? 'text-blue-600' : 'text-gray-600'} font-medium mb-1">${entry.from} • ${entry.timestamp}</div>
      <div class="text-sm">${entry.content}</div>
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
        <span class="px-2 py-1 rounded-full text-xs font-medium ${
          ticket.status === 'Open' ? 'bg-yellow-100 text-yellow-800' :
          ticket.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
          ticket.status === 'Resolved' ? 'bg-green-100 text-green-800' :
          'bg-gray-100 text-gray-800'
        }">${ticket.status}</span>
      </div>
      <div class="text-gray-700 text-sm mt-2">
        <b>Subject:</b> ${ticket.subject}
      </div>
    </div>
    <div class="mb-3">
      <label class="block font-medium text-gray-700 text-sm mb-2">Conversation</label>
      <div class="space-y-2 max-h-60 overflow-y-auto">${threadHtml}</div>
    </div>
    <form id="respondForm" class="mt-7 pt-4 border-t">
      <label class="block text-sm font-medium text-gray-700 mb-1">Add to Conversation</label>
      <textarea class="w-full border rounded px-3 py-2 text-sm mb-2" rows="3" placeholder="Type your message..." required></textarea>
      <button type="submit"
              class="w-full mt-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Send Message</button>
    </form>
  `;
    ticketModal.classList.remove('hidden');
    
    const respondForm = document.getElementById("respondForm");
    respondForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const textarea = respondForm.querySelector("textarea");
        const response = textarea.value.trim();
        if (response) {
            // In a real app, this would send to a backend
            ticket.thread.push({ 
                from: "You", 
                content: response, 
                timestamp: (new Date()).toISOString().slice(0, 10) 
            });
            showTicketModal(ticket); // rerender modal
            textarea.value = ''; // Clear the textarea
        }
    });
}

function showCreateIssueModal() {
    createIssueModal.classList.remove('hidden');
}

function setupEventListeners() {
    // Modal close events
    modalCloseBtn.addEventListener('click', () => {
        ticketModal.classList.add('hidden');
    });
    
    createModalCloseBtn.addEventListener('click', () => {
        createIssueModal.classList.add('hidden');
    });

    ticketModal.addEventListener('click', (e) => {
        if (e.target === ticketModal) ticketModal.classList.add('hidden');
    });

    createIssueModal.addEventListener('click', (e) => {
        if (e.target === createIssueModal) createIssueModal.classList.add('hidden');
    });

    // Create issue button events
    createTicketBtn.addEventListener('click', showCreateIssueModal);
    // createTicketMobileBtn.addEventListener('click', showCreateIssueModal);

    // Create issue form submission
    createIssueForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const issueType = document.getElementById('issueType').value;
        const issueSubject = document.getElementById('issueSubject').value;
        const issueDescription = document.getElementById('issueDescription').value;
        
        // Create new ticket
        const newTicket = {
            id: Math.floor(Math.random() * 1000000),
            generatedBy: 'customer@example.com', // This would come from user session
            name: 'Customer', // This would come from user session
            date: new Date().toISOString().slice(0, 10),
            type: issueType,
            subject: issueSubject,
            description: issueDescription,
            status: 'Open',
            thread: [
                { 
                    from: 'Customer', 
                    content: issueDescription, 
                    timestamp: new Date().toISOString().slice(0, 10) 
                }
            ]
        };
        
        // Add to tickets array
        customerTickets.unshift(newTicket);
        filteredTickets = [...customerTickets];
        
        // Reset form and close modal
        createIssueForm.reset();
        createIssueModal.classList.add('hidden');
        
        // Reset to first page and render
        currentPageDesktop = 1;
        currentPageMobile = 1;
        render();
        
        // Show success message (in a real app)
        alert('Issue created successfully! Ticket ID: ' + newTicket.id);
    });

    // Pagination events
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

    // Search functionality
    searchBtnDesktop.addEventListener("click", performSearch);
    searchInputDesktop.addEventListener("keydown", e => { 
        if (e.key === "Enter") performSearch(); 
    });
    
    searchBtnMobile.addEventListener("click", performSearch);
    searchInputMobile.addEventListener("keydown", e => { 
        if (e.key === "Enter") performSearch(); 
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

    // Apply filter events
    applyFilterDesktop.addEventListener("click", () => {
        filterPanelDesktop.classList.add("hidden"); 
        applyFilters();
    });
    
    applyFilterMobile.addEventListener("click", () => {
        filterPanelMobile.classList.add("hidden"); 
        applyFilters();
    });
    
    // Auto-apply filters when filter values change
    filterTypeDesktop.addEventListener("change", applyFilters);
    filterDateFromDesktop.addEventListener("change", applyFilters);
    filterDateToDesktop.addEventListener("change", applyFilters);
    filterTypeMobile.addEventListener("change", applyFilters);
    filterDateFromMobile.addEventListener("change", applyFilters);
    filterDateToMobile.addEventListener("change", applyFilters);
}

function updatePaginationDesktop() {
    const totalPages = Math.ceil(filteredTickets.length / rowsPerPageDesktop);
    pageInfoDesktop.textContent = `Page ${currentPageDesktop} of ${totalPages}`;
    prevBtnDesktop.disabled = currentPageDesktop === 1;
    nextBtnDesktop.disabled = currentPageDesktop === totalPages || totalPages === 0;
}

function updatePaginationMobile() {
    const totalPages = Math.ceil(filteredTickets.length / rowsPerPageMobile);
    pageInfoMobile.textContent = `Page ${currentPageMobile} of ${totalPages}`;
    prevBtnMobile.disabled = currentPageMobile === 1;
    nextBtnMobile.disabled = currentPageMobile === totalPages || totalPages === 0;
}

function performSearch() {
    const searchTermDesktop = searchInputDesktop.value.toLowerCase();
    const searchTermMobile = searchInputMobile.value.toLowerCase();
    const searchTerm = searchTermDesktop || searchTermMobile;
    
    if (!searchTerm) {
        filteredTickets = [...customerTickets];
        applyCurrentFilters();
        return;
    }
    
    filteredTickets = customerTickets.filter(ticket =>
        ticket.subject.toLowerCase().includes(searchTerm) ||
        ticket.id.toString().includes(searchTerm) ||
        ticket.type.toLowerCase().includes(searchTerm) ||
        ticket.description.toLowerCase().includes(searchTerm) ||
        ticket.status.toLowerCase().includes(searchTerm)
    );
    
    applyCurrentFilters();
    currentPageDesktop = 1;
    currentPageMobile = 1;
    render();
}

function applyCurrentFilters() {
    const typeDesktop = filterTypeDesktop.value;
    const typeMobile = filterTypeMobile.value;
    const dateFromDesktop = filterDateFromDesktop.value;
    const dateToDesktop = filterDateToDesktop.value;
    const dateFromMobile = filterDateFromMobile.value;
    const dateToMobile = filterDateToMobile.value;
    
    const typeFilter = typeDesktop || typeMobile;
    const dateFrom = dateFromDesktop || dateFromMobile;
    const dateTo = dateToDesktop || dateToMobile;

    if (typeFilter || dateFrom || dateTo) {
        filteredTickets = filteredTickets.filter(ticket => {
            // Type filter
            const typeMatch = typeFilter === '' || ticket.type === typeFilter;
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
            return typeMatch && dateMatch;
        });
    }
}

function applyFilters() {
    const searchTermDesktop = searchInputDesktop.value.toLowerCase();
    const searchTermMobile = searchInputMobile.value.toLowerCase();
    const searchTerm = searchTermDesktop || searchTermMobile;
    
    if (searchTerm !== '') {
        filteredTickets = customerTickets.filter(ticket =>
            ticket.subject.toLowerCase().includes(searchTerm) ||
            ticket.id.toString().includes(searchTerm) ||
            ticket.type.toLowerCase().includes(searchTerm) ||
            ticket.description.toLowerCase().includes(searchTerm) ||
            ticket.status.toLowerCase().includes(searchTerm)
        );
    } else {
        filteredTickets = [...customerTickets];
    }
    
    applyCurrentFilters();
    currentPageDesktop = 1;
    currentPageMobile = 1;
    render();
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

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
        <button id="add-issue" class="block w-full text-left px-4 py-2 hover:bg-indigo-700 focus:outline-none" type="button">
            Raise New Issue
        </button>

        `;

        menu_actions.parentElement.appendChild(dropdown);

        document.getElementById('add-issue').addEventListener('click', () => {
            createIssueModal.classList.remove('hidden')
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