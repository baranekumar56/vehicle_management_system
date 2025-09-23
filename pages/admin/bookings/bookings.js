(function () {
    // Sample booking data - dynamically loaded
    const bookings = [
        { id: 66886, bookerId: 45454, name: 'john', date: '12/10/2025', time: '9:00 AM', category: 'Service', email: 'john@example.com', phone: '+1234567890', vehicle: 'Toyota Camry', notes: 'Regular service checkup' },
        { id: 545454, bookerId: 44548, name: 'barane', date: '13/10/2025', time: '11:00 AM', category: 'Repair', email: 'barane@example.com', phone: '+1234567891', vehicle: 'Honda Civic', notes: 'Brake repair needed' },
        { id: 654646, bookerId: 78789, name: 'kumar', date: '15/10/2025', time: '2:00 PM', category: 'Service', email: 'kumar@example.com', phone: '+1234567892', vehicle: 'Ford Focus', notes: 'Oil change and inspection' },
        { id: 789012, bookerId: 11111, name: 'alice', date: '16/10/2025', time: '10:00 AM', category: 'Maintenance', email: 'alice@example.com', phone: '+1234567893', vehicle: 'BMW X3', notes: 'Scheduled maintenance' },
        { id: 890123, bookerId: 22222, name: 'bob', date: '17/10/2025', time: '3:00 PM', category: 'Inspection', email: 'bob@example.com', phone: '+1234567894', vehicle: 'Mercedes C-Class', notes: 'Annual inspection' },
        { id: 901234, bookerId: 33333, name: 'charlie', date: '18/10/2025', time: '4:00 PM', category: 'Service', email: 'charlie@example.com', phone: '+1234567895', vehicle: 'Audi A4', notes: 'Tire rotation and balance' }
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
    const filterDateFromMobile = document.getElementById("filterDateFromMobile");
    const filterDateToMobile = document.getElementById("filterDateToMobile");

    const bookingModal = document.getElementById("booking-modal");
    const modalCloseBtn = document.getElementById("modal-close-btn");
    const modalContent = document.getElementById("modal-content");

    let currentPageDesktop = 1;
    const rowsPerPageDesktop = 10;
    let currentPageMobile = 1;
    const rowsPerPageMobile = 5;

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
                <td class="py-2 px-4 border border-gray-300">${booking.date}</td>
                <td class="py-2 px-4 border border-gray-300">${booking.time}</td>
                <td class="py-2 px-4 border border-gray-300">${booking.category}</td>
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
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center">
                <div class="mr-3 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                </div>
                
                <div class="flex-1">
                    <div class="font-semibold text-gray-900">#${booking.id}</div>
                    <div class="text-sm text-gray-600">Booked by: ${booking.name}</div>
                    <div class="text-xs text-gray-500 mt-1">${booking.date} • ${booking.time} • ${booking.category}</div>
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
                const booking = filteredBookings[idx];
                showBookingDetails(booking);
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
    }

    // Show booking details modal
    function showBookingDetails(booking) {
        modalContent.innerHTML = `
                <h3 class="text-xl font-semibold mb-6 pr-8">Booking Details</h3>
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
                            <p class="mt-1 text-sm text-gray-900">${booking.date}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Time</label>
                            <p class="mt-1 text-sm text-gray-900">${booking.time}</p>
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
                </div>
            `;
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

    // Search functionality - Only on search button click
    function performSearch() {
        const searchTermDesktop = searchInputDesktop.value.toLowerCase();
        const searchTermMobile = searchInputMobile.value.toLowerCase();
        console.log(searchTermDesktop)

        // Use whichever search term is not empty, or combine both
        const searchTerm = searchTermDesktop || searchTermMobile;
        console.log(searchTerm.length)
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
            booking.vehicle.toLowerCase().includes(searchTerm)
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
        const categoryDesktop = filterCategoryDesktop.value;
        const categoryMobile = filterCategoryMobile.value;
        const dateFromDesktop = filterDateFromDesktop.value;
        const dateToDesktop = filterDateToDesktop.value;
        const dateFromMobile = filterDateFromMobile.value;
        const dateToMobile = filterDateToMobile.value;

        // Use whichever values are not empty
        const categoryFilter = categoryDesktop || categoryMobile;
        const dateFrom = dateFromDesktop || dateFromMobile;
        const dateTo = dateToDesktop || dateToMobile;

        if (categoryFilter || dateFrom || dateTo) {
            filteredBookings = filteredBookings.filter(booking => {
                // Category filter
                const categoryMatch = categoryFilter === '' || booking.category === categoryFilter;

                // Date filter (basic implementation)
                let dateMatch = true;
                if (dateFrom || dateTo) {
                    const bookingDate = new Date(booking.date.split('/').reverse().join('-'));
                    if (dateFrom) {
                        const fromDate = new Date(dateFrom);
                        if (bookingDate < fromDate) dateMatch = false;
                    }
                    if (dateTo) {
                        const toDate = new Date(dateTo);
                        if (bookingDate > toDate) dateMatch = false;
                    }
                }

                return categoryMatch && dateMatch;
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
            filteredBookings = bookings.filter(booking =>
                booking.name.toLowerCase().includes(searchTerm) ||
                booking.id.toString().includes(searchTerm) ||
                booking.bookerId.toString().includes(searchTerm) ||
                booking.email.toLowerCase().includes(searchTerm) ||
                booking.category.toLowerCase().includes(searchTerm) ||
                booking.vehicle.toLowerCase().includes(searchTerm)
            );
        } else {
            filteredBookings = [...bookings];
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
    filterDateFromDesktop.addEventListener("change", applyFilters);
    filterDateToDesktop.addEventListener("change", applyFilters);
    filterCategoryMobile.addEventListener("change", applyFilters);
    filterDateFromMobile.addEventListener("change", applyFilters);
    filterDateToMobile.addEventListener("change", applyFilters);

    // Initial render
    render();
})();