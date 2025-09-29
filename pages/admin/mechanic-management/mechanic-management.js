
// Shared customer data
        localStorage.setItem('vms_current_page', 'mechanic_management');

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

function closeDesktopModal() {
    desktopViewModal.classList.add("hidden");
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



const mechanic_add = document.getElementById('add-mechanic');
const desktop_mechanic_add_modal = document.getElementById('add-mechanic-modal');

function closeMechanicAddModal() {
    desktop_mechanic_add_modal.classList.add('hidden');
}


mechanic_add.addEventListener('click', () => {
    console.log("clicked new")
    if (desktop_mechanic_add_modal.classList.contains('hidden')) desktop_mechanic_add_modal.classList.remove('hidden');
    else desktop_mechanic_add_modal.classList.add('hidden')
})

// mechanic addition section

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

// --- Form Validation ---
document.querySelector("#add-mechanic-modal form").addEventListener("submit", async function (e) {
    e.preventDefault(); // prevent actual submit

    const email = this.email.value.trim();
    const name = this.name.value.trim();
    const phone = this.phone.value.trim();
    const exp = this.xperience.value.trim();
    const startDate = this.start_date.value;
    const password = this.initial_password.value.trim();

    // Basic validations
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast("Please enter a valid email.");
        return;
    }
    if (!name) {
        showToast("Name cannot be empty.");
        return;
    }
    if (!phone || phone.length < 8) {
        showToast("Please enter a valid phone number.");
        return;
    }
    if (!exp || isNaN(exp) || exp < 0) {
        showToast("Experience must be a valid non-negative number.");
        return;
    }
    if (!startDate) {
        showToast("Start date is required.");
        return;
    }
    if (!password || password.length < 6) {
        showToast("Password must be at least 6 characters.");
        return;
    }

    // If everything is fine
    showToast("Mechanic added successfully!", "success");

    // Example: collect data
    const formData = {
        email,
        name,
        phone,
        exp,
        startDate,
        password,
        deleted: false,
        role: "mechanic"
    };

    console.log(formData)

    const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: await JSON.stringify(formData)
    })


    try {
        if (!response.ok) {
            throw new Error('Error saving data from server');
        }

        alert("Mechanic added successfully...")
    }
    catch (err) {
        console.log(err)
    }


    // now we gett the nav bar component and add profile icon then with the functionality menu


});


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
      <button id="addMechanicBtn" class="block w-full text-left px-4 py-2 hover:bg-indigo-700 focus:outline-none" type="button">
        Add Mechanic
      </button>
      <button id="mobile-batch-upload-btn" class="block w-full text-left px-4 py-2 hover:bg-indigo-700 focus:outline-none" type="button">
        Batch Upload
      </button>
      <!-- Add more buttons here if needed -->
    `;

        menu_actions.parentElement.appendChild(dropdown);

        document.getElementById('mobile-batch-upload-btn').addEventListener('click', () => {
            batch_upload_modal.classList.remove('hidden')
        })

        dropdown.querySelector('#addMechanicBtn').addEventListener('click', () => {
            dropdown.classList.add('hidden');

            // Your logic to show mobile or desktop modal
            if (window.innerWidth < 640) {  // Tailwind 'sm' breakpoint 
                addMechanicModalMobile.classList.remove('hidden');
            } else {
                const desktopAddBtn = document.getElementById('add-mechanic');
                if (desktopAddBtn) desktopAddBtn.click();
            }
        });
    });

    // Close dropdown if clicked outside
    document.addEventListener('click', () => {
        const dropdown = document.getElementById('pageActionsDropdown');
        if (dropdown) {
            dropdown.classList.add('hidden');
        }
    });




});

closeAddMechMobileBtn.addEventListener('click', () => {
    addMechanicModalMobile.classList.add('hidden');
});

// Handle mobile form submit
addMechanicFormMobile.addEventListener('submit', async (event) => {
    event.preventDefault();

    const form = event.target;
    const email = form.email.value.trim();
    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const exp = form.xperience.value.trim();
    const startDate = form.start_date.value;
    const password = form.initial_password.value.trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('Please enter a valid email.');
        return;
    }
    if (!name) {
        alert('Name cannot be empty.');
        return;
    }
    if (!phone || phone.length < 8) {
        alert('Please enter a valid phone number.');
        return;
    }
    if (!exp || isNaN(exp) || exp < 0) {
        alert('Experience must be a valid non-negative number.');
        return;
    }
    if (!startDate) {
        alert('Start date is required.');
        return;
    }
    if (!password || password.length < 6) {
        alert('Password must be at least 6 characters.');
        return;
    }

    const formData = { email, name, phone, exp, startDate, password, deleted: false, role: "mechanic" };

    try {
        const response = await fetch("http://localhost:3000/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });
        if (!response.ok) throw new Error('Error saving data from server');
        alert('Mechanic added successfully!');
        addMechanicModalMobile.classList.add('hidden');
        form.reset();
    } catch (err) {
        console.error(err);
        alert('Failed to add mechanic. Please try again.');
    }
});


const batch_upload_btn = document.getElementById('batch-upload');
const batch_upload_modal = document.getElementById('batch-upload-modal');
const batch_upload_modal_close_btn = document.getElementById('batch-upload-modal-close-btn');
const batch_upload_upload_btn = document.getElementById('batch-upload-upload-btn');
const toast_upload = document.getElementById("toast-upload");

batch_upload_modal_close_btn.addEventListener('click', () => {
    batch_upload_modal.classList.add('hidden')
})

batch_upload_btn.addEventListener('click', () => {
    console.log("hai")
    batch_upload_modal.classList.remove('hidden')
})

batch_upload_upload_btn.addEventListener('click', () => {
    batch_upload_modal_close_btn.click();
    toast_upload.classList.remove('hidden');
    setTimeout(() => {
        toast_upload.classList.add('hidden')
    }, 3000)
})

const modalCloseDesktop = document.getElementById('desktop-modal-close-btn');
modalCloseDesktop.addEventListener('click', () => {
    desktopViewModal.classList.add('hidden')

})


if (window.self !== window.top) {
setInterval(() => {
    parent.postMessage(JSON.stringify(filteredDataDesktop), "http://127.0.0.1:5500");
}, 2000)
}