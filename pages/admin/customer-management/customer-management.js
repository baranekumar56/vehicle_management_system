localStorage.setItem('vms_current_page', 'customer_management');
const customers = [
    { id: "68686", name: "John", email: "john-44@a.in", phone: "96565464855", address: "xxx, yyy, zzz", services: 7 },
    { id: "545454", name: "Barane", email: "bk@gmail.com", phone: "4894848458", address: "aaa, zzz", services: 3 },
    { id: "565468", name: "Kumar", email: "kumar@a.com", phone: "4186468681", address: "ttt, uuu, zzz", services: 1 },
    { id: "111111", name: "Alice", email: "alice@mail.com", phone: "999888777", address: "abc street", services: 5 },
    { id: "222222", name: "Bob", email: "bob@mail.com", phone: "111222333", address: "def road", services: 2 },
    { id: "333333", name: "Charlie", email: "charlie@mail.com", phone: "444555666", address: "ghi ave", services: 9 },
    { id: "444444", name: "David", email: "david@mail.com", phone: "777888999", address: "jkl lejfhgbherjgbj ergrge grgerge rgergerger errekjerkt hrktwhrkjth    gwrjghrjwghane", services: 4 },
    { id: "555555", name: "Eva", email: "eva@mail.com", phone: "123123123", address: "mno park", services: 6 }
];

// Desktop Variables
const tableBodyDesktop = document.getElementById("customerTableBodyDesktop");
const prevBtnDesktop = document.getElementById("prevPageDesktop");
const nextBtnDesktop = document.getElementById("nextPageDesktop");
const pageInfoDesktop = document.getElementById("pageInfoDesktop");
const searchInputDesktop = document.getElementById("searchInputDesktop");
const searchBtnDesktop = document.getElementById("searchBtnDesktop");
const filterBtnDesktop = document.getElementById("filterBtnDesktop");
const filterPanelDesktop = document.getElementById("filterPanelDesktop");
const applyFilterDesktop = document.getElementById("applyFilterDesktop");
const filterServicesDesktop = document.getElementById("filterServicesDesktop");
const toastDesktop = document.getElementById("toastDesktop");
const modalCloseDesktop = document.getElementById('desktop-modal-close-btn');

// Mobile Variables
const customerListMobile = document.getElementById("customerListMobile");
const searchInputMobile = document.getElementById("searchInputMobile");
const searchBtnMobile = document.getElementById("searchBtnMobile");
const filterBtnMobile = document.getElementById("filterBtnMobile");
const filterPanelMobile = document.getElementById("filterPanelMobile");
const applyFilterMobile = document.getElementById("applyFilterMobile");
const filterServicesMobile = document.getElementById("filterServicesMobile");
const customerModalMobile = document.getElementById("customer-modal");
const modalCloseBtnMobile = document.getElementById("modal-close-btn");
const modalContentMobile = document.getElementById("modal-content");
const addMechanicModalMobile = document.getElementById('add-mechanic-modal-mobile');
const addMechanicFormMobile = document.getElementById('addMechanicFormMobile');
const closeAddMechMobileBtn = document.getElementById('closeAddMechMobile');
const menuActions = document.getElementById('menu_actions');

// Desktop Modals
const desktopViewModal = document.getElementById("desktop-viewModal");
const desktopModalContent = document.getElementById("desktop-modalContent");

// Mobile Pagination Variables
const prevBtnMobile = document.getElementById("prevPageMobile");
const nextBtnMobile = document.getElementById("nextPageMobile");
const pageInfoMobile = document.getElementById("pageInfoMobile");

// Desktop Pagination
let currentPageDesktop = 1;
const rowsPerPageDesktop = 5;
let filteredDataDesktop = [...customers];

// Mobile Pagination
let currentPageMobile = 1;
const rowsPerPageMobile = 5;
const fullDataMobile = [...customers];
let filteredDataMobile = [...fullDataMobile];

// ---- Desktop Functions ----

function renderTableDesktop(data) {
    filteredDataDesktop = data;
    const start = (currentPageDesktop - 1) * rowsPerPageDesktop;
    const end = start + rowsPerPageDesktop;
    const pageData = filteredDataDesktop.slice(start, end);

    tableBodyDesktop.innerHTML = "";
    pageData.forEach((c, idx) => {
        const row = document.createElement("tr");
        row.className = "hover:bg-gray-50";
        row.innerHTML = `
                   
                    <td class="py-2 px-4 border border-gray-300">${c.id}</td>
                    <td class="py-2 px-4 border border-gray-300">${c.name}</td>
                    <td class="py-2 px-4 border border-gray-300">${c.email}</td>
                    <td class="py-2 px-4 border border-gray-300">${c.phone}</td>
                    <td class="py-2 px-4 border border-gray-300">${c.address}</td>
                    <td class="py-2 px-4 border border-gray-300">${c.services}</td>
                    <td class="py-2 px-4 border border-gray-300 relative">
                        <button class="actionBtnDesktop p-1 rounded hover:bg-gray-200 ce">⋮</button>
                        <div class="actionMenuDesktop hidden absolute right-0 mt-1 bg-white border rounded shadow-lg z-10">
                            <button class="block w-full px-4 py-2 text-left hover:bg-gray-100 viewBtnDesktop">View</button>
                            <button class="block w-full px-4 py-2 text-left hover:bg-gray-100 deactivateBtnDesktop">Deactivate</button>
                        </div>
                    </td>
                `;
        tableBodyDesktop.appendChild(row);
    });

    attachDesktopActionEvents();
    updatePaginationDesktop();
}

function attachDesktopActionEvents() {
    document.querySelectorAll(".actionBtnDesktop").forEach(btn => {
        btn.addEventListener("click", () => {
            const menu = btn.nextElementSibling;
            if (menu) menu.classList.toggle("hidden");
        });
    });

    document.querySelectorAll(".viewBtnDesktop").forEach((btn, idx) => {
        btn.addEventListener("click", () => {
            const customerIndex = (currentPageDesktop - 1) * rowsPerPageDesktop + idx;
            showDesktopModal(filteredDataDesktop[customerIndex]);
        });
    });

    document.querySelectorAll(".deactivateBtnDesktop").forEach((btn, idx) => {
        btn.addEventListener("click", () => {
            const customerIndex = (currentPageDesktop - 1) * rowsPerPageDesktop + idx;
            const customer = filteredDataDesktop[customerIndex];
            if (confirm(`Deactivate ${customer.name}?`)) {
                showToastDesktop();
            }
        });
    });
}

function updatePaginationDesktop() {
    const totalPages = Math.ceil(filteredDataDesktop.length / rowsPerPageDesktop);
    pageInfoDesktop.textContent = `Page ${currentPageDesktop} of ${totalPages}`;
    prevBtnDesktop.disabled = currentPageDesktop === 1;
    nextBtnDesktop.disabled = currentPageDesktop === totalPages;
}

function showDesktopModal(customer) {
    desktopModalContent.innerHTML = `
                <p><strong>ID:</strong> ${customer.id}</p>
                <p><strong>Name:</strong> ${customer.name}</p>
                <p><strong>Email:</strong> ${customer.email}</p>
                <p><strong>Phone:</strong> ${customer.phone}</p>
                <p><strong>Address:</strong> ${customer.address}</p>
                <p><strong>Services:</strong> ${customer.services}</p>
            `;
    desktopViewModal.classList.remove("hidden");
}


function showToastDesktop() {
    toastDesktop.classList.remove("hidden");
    setTimeout(() => toastDesktop.classList.add("hidden"), 3000);
}

// Desktop Pagination events
prevBtnDesktop.addEventListener("click", () => {
    if (currentPageDesktop > 1) {
        currentPageDesktop--;
        renderTableDesktop(filteredDataDesktop);
    }
});

nextBtnDesktop.addEventListener("click", () => {
    const totalPages = Math.ceil(filteredDataDesktop.length / rowsPerPageDesktop);
    if (currentPageDesktop < totalPages) {
        currentPageDesktop++;
        renderTableDesktop(filteredDataDesktop);
    }
});

// Desktop Search by SVG button and enter
searchBtnDesktop.addEventListener("click", () => {
    const query = searchInputDesktop.value.trim().toLowerCase();
    currentPageDesktop = 1;
    filteredDataDesktop = customers.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.phone.toLowerCase().includes(query) ||
        c.id.toLowerCase().includes(query)
    );
    renderTableDesktop(filteredDataDesktop);
});
searchInputDesktop.addEventListener("keydown", e => {
    if (e.key === "Enter") searchBtnDesktop.click();
});

// Desktop Filter floating panel
filterBtnDesktop.addEventListener("click", (e) => {
    e.stopPropagation();
    filterPanelDesktop.classList.toggle("hidden");
});
document.addEventListener("click", (e) => {
    if (!filterPanelDesktop.classList.contains("hidden") && !filterPanelDesktop.contains(e.target) && e.target !== filterBtnDesktop) {
        filterPanelDesktop.classList.add("hidden");
    }
});

applyFilterDesktop.addEventListener("click", () => {
    const minServices = parseInt(filterServicesDesktop.value) || 0;
    currentPageDesktop = 1;
    filteredDataDesktop = customers.filter(c => c.services > minServices);
    renderTableDesktop(filteredDataDesktop);
});

desktopViewModal.addEventListener("click", e => {
    if (e.target === desktopViewModal) closeDesktopModal();
});

// ---- Mobile Functions ----

function renderMobileListPaginated(data) {
    filteredDataMobile = data;
    const start = (currentPageMobile - 1) * rowsPerPageMobile;
    const end = start + rowsPerPageMobile;
    const pageData = filteredDataMobile.slice(start, end);

    customerListMobile.innerHTML = "";
    pageData.forEach((c, idx) => {
        const item = document.createElement("div");
        item.className = "border-b border-black font-medium py-4 flex items-center justify-between px-4";
        item.innerHTML = `
                    <div class="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M5.121 17.804A9.97 9.97 0 0112 15c2.21 0 4.24.72 5.879 1.928M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>${c.name}</span>
                    </div>
                    <button aria-label="View details for ${c.name}" class="viewBtnMobile" data-index="${start + idx}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-500" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                `;
        customerListMobile.appendChild(item);
    });

    updatePaginationMobile();
    attachMobileViewEvents();
}

function updatePaginationMobile() {
    const totalPages = Math.ceil(filteredDataMobile.length / rowsPerPageMobile);
    pageInfoMobile.textContent = `Page ${currentPageMobile} of ${totalPages}`;
    prevBtnMobile.disabled = currentPageMobile === 1;
    nextBtnMobile.disabled = currentPageMobile === totalPages;
}

function attachMobileViewEvents() {
    document.querySelectorAll(".viewBtnMobile").forEach(btn => {
        btn.addEventListener("click", () => {
            const idx = parseInt(btn.getAttribute("data-index"));
            showMobileModal(filteredDataMobile[idx]);
        });
    });
}

function showMobileModal(customer) {
    modalContentMobile.innerHTML = `
                <p><strong>ID:</strong> ${customer.id}</p>
                <p><strong>Name:</strong> ${customer.name}</p>
                <p><strong>Email:</strong> ${customer.email}</p>
                <p><strong>Phone:</strong> ${customer.phone}</p>
                <p><strong>Address:</strong> ${customer.address}</p>
                <p><strong>Services:</strong> ${customer.services}</p>
            `;
    customerModalMobile.classList.remove("hidden");
}

function closeMobileModal() {
    customerModalMobile.classList.add("hidden");
}

// Mobile Pagination events
prevBtnMobile.addEventListener("click", () => {
    if (currentPageMobile > 1) {
        currentPageMobile--;
        renderMobileListPaginated(filteredDataMobile);
    }
});

nextBtnMobile.addEventListener("click", () => {
    const totalPages = Math.ceil(filteredDataMobile.length / rowsPerPageMobile);
    if (currentPageMobile < totalPages) {
        currentPageMobile++;
        renderMobileListPaginated(filteredDataMobile);
    }
});

// Mobile Search by SVG button and enter
searchBtnMobile.addEventListener("click", () => {
    const query = searchInputMobile.value.trim().toLowerCase();
    filteredDataMobile = fullDataMobile.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.phone.toLowerCase().includes(query) ||
        c.id.toLowerCase().includes(query)
    );
    currentPageMobile = 1;
    renderMobileListPaginated(filteredDataMobile);
});
searchInputMobile.addEventListener("keydown", e => {
    if (e.key === "Enter") searchBtnMobile.click();
});

// Mobile Filter floating panel
filterBtnMobile.addEventListener("click", (e) => {
    e.stopPropagation();
    filterPanelMobile.classList.toggle("hidden");
});
document.addEventListener("click", (e) => {
    if (!filterPanelMobile.classList.contains("hidden") && !filterPanelMobile.contains(e.target) && e.target !== filterBtnMobile) {
        filterPanelMobile.classList.add("hidden");
    }
});

applyFilterMobile.addEventListener("click", () => {
    const minServices = parseInt(filterServicesMobile.value) || 0;
    filteredDataMobile = fullDataMobile.filter(c => c.services > minServices);
    currentPageMobile = 1;
    renderMobileListPaginated(filteredDataMobile);
});

modalCloseBtnMobile.addEventListener("click", closeMobileModal);

customerModalMobile.addEventListener("click", (e) => {
    if (e.target === customerModalMobile) {
        closeMobileModal();
    }
});

// Initial renders
renderTableDesktop(customers);
renderMobileListPaginated(fullDataMobile);

function closeDesktopModal() {
    console.log("here")
    desktopViewModal.classList.add("hidden");
}

const desktop_mechanic_add_modal = document.getElementById('add-mechanic-modal');

function closeMechanicAddModal() {
    desktop_mechanic_add_modal.classList.add('hidden');
}



function showToast(message, type = "error") {
    const toast = document.createElement("div");
    toast.innerText = message;
    toast.className = `
        fixed bottom-5 right-5 px-4 py-2 rounded shadow-lg text-white z-[9999]
        ${type === "error" ? "bg-red-500" : "bg-green-500"}
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

modalCloseDesktop.addEventListener('click', () => {
    desktopViewModal.classList.add('hidden')

})

if (window.self !== window.top) {
    setInterval(() => {
        parent.postMessage(JSON.stringify(filteredDataDesktop), "http://127.0.0.1:5500");
    }, 2000)
}
