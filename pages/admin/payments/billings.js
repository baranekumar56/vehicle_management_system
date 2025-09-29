localStorage.setItem('vms_current_page', 'payments');

let billings = [
    {
        bookingId: "B001",
        date: "2025-09-20",
        timeForwarded: "09:30",
        forwardedBy: "2",
        mechanic: "Manoj Kumar",
        status: "Pending",
        repairs: [
            { name: "Engine Change", price: 3500, important: true },
            { name: "Odometer Fix", price: 800, important: false }
        ],
        estimatedDays: 3,
        finalAmount: null
    },
    {
        bookingId: "B002",
        date: "2025-09-18",
        timeForwarded: "11:20",
        forwardedBy: "4",
        mechanic: "Akash Singh",
        status: "Billed",
        repairs: [
            { name: "Oil Filter Replacement", price: 300, important: false },
            { name: "Brake Pad Change", price: 1200, important: true }
        ],
        estimatedDays: 2,
        finalAmount: 1500
    },
    {
        bookingId: "B003",
        date: "2025-09-10",
        timeForwarded: "16:00",
        forwardedBy: "1",
        mechanic: "Sunny Deol",
        status: "Pending",
        repairs: [
            { name: "AC Gas Charging", price: 900, important: false }
        ],
        estimatedDays: 1,
        finalAmount: null
    }
]

// Pagination states
let currentPageDesktop = 1;
let currentPageMobile = 1;
const pageSizeDesktop = 2;
const pageSizeMobile = 2;

// Modal state
let currentBillingIndex = null;
let currentModalMode = 'bill';

// Filter/Search function
function filterData(device) {
    const searchInput = (device === 'desktop'
        ? document.getElementById('searchInputDesktop').value
        : document.getElementById('searchInputMobile').value).toLowerCase().trim();

    const status = device === 'desktop'
        ? document.getElementById('filterStatusDesktop').value
        : document.getElementById('filterStatusMobile').value;

    const dateFrom = device === 'desktop'
        ? document.getElementById('filterDateFromDesktop').value
        : document.getElementById('filterDateFromMobile').value;

    const dateTo = device === 'desktop'
        ? document.getElementById('filterDateToDesktop').value
        : document.getElementById('filterDateToMobile').value;

    const timeFrom = device === 'desktop'
        ? document.getElementById('filterTimeFromDesktop').value
        : document.getElementById('filterTimeFromMobile').value;

    const timeTo = device === 'desktop'
        ? document.getElementById('filterTimeToDesktop').value
        : document.getElementById('filterTimeToMobile').value;

    return billings.filter(b => {
        if (searchInput && !(
            b.bookingId.toLowerCase().includes(searchInput) ||
            b.mechanic.toLowerCase().includes(searchInput) ||
            b.forwardedBy.toLowerCase().includes(searchInput) ||
            b.date.includes(searchInput)
        )) return false;

        if (status) {
            if (status === 'Pending' && b.status !== 'Pending') return false;
            if (status === 'Billed' && b.status !== 'Billed') return false;
        }
        if (dateFrom && b.date < dateFrom) return false;
        if (dateTo && b.date > dateTo) return false;
        if (timeFrom && b.timeForwarded < timeFrom) return false;
        if (timeTo && b.timeForwarded > timeTo) return false;

        return true;
    });
}

// Desktop render
function renderTableDesktop() {
    const filtered = filterData('desktop');
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSizeDesktop));
    if (currentPageDesktop > totalPages) currentPageDesktop = totalPages;
    const paged = filtered.slice((currentPageDesktop - 1) * pageSizeDesktop, currentPageDesktop * pageSizeDesktop);

    const tbody = document.getElementById('paymentTableBodyDesktop');
    tbody.innerHTML = paged.map(b => `
      <tr>
        <td class="py-2 px-4 border">${b.bookingId}</td>
        <td class="py-2 px-4 border">${b.date}</td>
        <td class="py-2 px-4 border">${b.timeForwarded}</td>
        <td class="py-2 px-4 border">${b.forwardedBy}</td>
        <td class="py-2 px-4 border">${b.mechanic}</td>
        <td class="py-2 px-4 border">${b.status === 'Billed' ? 'Billed' : 'Not Billed'}</td>
        <td class="py-2 px-4 border">
          ${b.status === 'Pending'
            ? `<button class="bg-primary text-white px-4 py-2 rounded" onclick="openBillingModal(${billings.indexOf(b)},'bill')">Bill</button>`
            : `<button class="bg-green-600 text-white px-4 py-2 rounded" onclick="openBillingModal(${billings.indexOf(b)},'view')">View</button>`
        }
        </td>
      </tr>
    `).join('');

    document.getElementById('pageInfoDesktop').textContent = `Page ${currentPageDesktop} of ${totalPages}`;
    document.getElementById('prevPageDesktop').disabled = currentPageDesktop <= 1;
    document.getElementById('nextPageDesktop').disabled = currentPageDesktop >= totalPages;
}

// Mobile list render with minimal info + arrow
function renderListMobile() {
    const filtered = filterData('mobile');
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSizeMobile));
    if (currentPageMobile > totalPages) currentPageMobile = totalPages;
    const paged = filtered.slice((currentPageMobile - 1) * pageSizeMobile, currentPageMobile * pageSizeMobile);

    const container = document.getElementById('paymentListMobile');
    container.innerHTML = '';
    paged.forEach(b => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg shadow border border-gray-200 p-4 flex justify-between items-center';

        const left = document.createElement('div');
        left.className = 'flex flex-col gap-1';

        const booking = document.createElement('span');
        booking.className = 'font-semibold text-gray-800';
        booking.textContent = `Booking ID: ${b.bookingId}`;

        const forwarded = document.createElement('span');
        forwarded.className = 'text-gray-600 text-sm';
        forwarded.textContent = `Forwarded By: ${b.forwardedBy}`;

        const status = document.createElement('span');
        status.className = b.status === 'Billed' ? 'text-green-600 font-semibold text-sm' : 'text-red-600 font-semibold text-sm';
        status.textContent = b.status === 'Billed' ? 'Billed' : 'Not Billed';

        left.appendChild(booking);
        left.appendChild(forwarded);
        left.appendChild(status);

        const arrow = document.createElement('button');
        arrow.className = 'arrow-button';
        arrow.textContent = '→';
        arrow.title = 'Show details';
        arrow.onclick = () => openMobileListInfoModal(billings.indexOf(b));
        arrow.ariaLabel = `Show details for booking ${b.bookingId}`;

        card.appendChild(left);
        card.appendChild(arrow);

        container.appendChild(card);
    });
    document.getElementById('pageInfoMobile').textContent = `Page ${currentPageMobile} of ${totalPages}`;
    document.getElementById('prevPageMobile').disabled = currentPageMobile <= 1;
    document.getElementById('nextPageMobile').disabled = currentPageMobile >= totalPages;
}

// Pagination buttons handlers
document.getElementById('prevPageDesktop').onclick = () => {
    if (currentPageDesktop > 1) {
        currentPageDesktop--;
        renderTableDesktop();
    }
};
document.getElementById('nextPageDesktop').onclick = () => {
    currentPageDesktop++;
    renderTableDesktop();
};
document.getElementById('prevPageMobile').onclick = () => {
    if (currentPageMobile > 1) {
        currentPageMobile--;
        renderListMobile();
    }
};
document.getElementById('nextPageMobile').onclick = () => {
    currentPageMobile++;
    renderListMobile();
};

// Filter panel toggle with outside click close for desktop and mobile

// Function to setup outside click for filter panels
function setupFilterPanelClose(buttonId, panelId) {
    const filterButton = document.getElementById(buttonId);
    const filterPanel = document.getElementById(panelId);
    filterButton.addEventListener('click', e => {
        e.stopPropagation();
        filterPanel.classList.toggle('hidden');
    });
    document.addEventListener('click', () => {
        if (!filterPanel.classList.contains('hidden')) filterPanel.classList.add('hidden');
    });
    filterPanel.addEventListener('click', e => {
        e.stopPropagation();
    });
}

setupFilterPanelClose('filterBtnDesktop', 'filterPanelDesktop');
setupFilterPanelClose('filterBtnMobile', 'filterPanelMobile');

// Apply filter buttons
document.getElementById('applyFilterDesktop').onclick = () => {
    document.getElementById('filterPanelDesktop').classList.add('hidden');
    currentPageDesktop = 1;
    renderTableDesktop();
};
document.getElementById('applyFilterMobile').onclick = () => {
    document.getElementById('filterPanelMobile').classList.add('hidden');
    currentPageMobile = 1;
    renderListMobile();
};

// Search button clicks handlers
document.getElementById('searchBtnDesktop').onclick = () => {
    currentPageDesktop = 1;
    renderTableDesktop();
};
document.getElementById('searchBtnMobile').onclick = () => {
    currentPageMobile = 1;
    renderListMobile();
};

// Mobile list info modal and bill/view modal logic

const mobileListInfoModal = document.getElementById('mobileListInfoModal');
const mobileListInfoContent = document.getElementById('mobileListInfoContent');
const closeMobileListInfoModal = document.getElementById('closeMobileListInfoModal');

function openMobileListInfoModal(idx) {
    const b = billings[idx];
    mobileListInfoContent.innerHTML = `
      <div class="mb-2"><strong>Booking ID:</strong> ${b.bookingId}</div>
      <div class="mb-2"><strong>Date:</strong> ${b.date}</div>
      <div class="mb-2"><strong>Time Forwarded:</strong> ${b.timeForwarded}</div>
      <div class="mb-2"><strong>Forwarded By:</strong> ${b.forwardedBy}</div>
      <div class="mb-2"><strong>Mechanic Name:</strong> ${b.mechanic}</div>
      <div class="mb-2"><strong>Status:</strong> ${b.status === 'Billed' ? '<span class="text-green-600 font-semibold">Billed</span>' : '<span class="text-red-600 font-semibold">Not Billed</span>'}</div>
      <div class="mt-4 flex justify-end gap-4">
        ${b.status === 'Pending'
            ? `<button id="mobileBillBtn" class="bg-primary text-white px-4 py-2 rounded">Bill</button>`
            : `<button id="mobileViewBtn" class="bg-green-600 text-white px-4 py-2 rounded">View</button>`
        }
      </div>
    `;
    mobileListInfoModal.classList.remove('hidden');

    const mobileBillBtn = document.getElementById('mobileBillBtn');
    const mobileViewBtn = document.getElementById('mobileViewBtn');
    if (mobileBillBtn) {
        mobileBillBtn.onclick = () => {
            openBillingModal(idx, 'bill');
            mobileListInfoModal.classList.add('hidden');
        };
    }
    if (mobileViewBtn) {
        mobileViewBtn.onclick = () => {
            openBillingModal(idx, 'view');
            mobileListInfoModal.classList.add('hidden');
        };
    }
}

closeMobileListInfoModal.onclick = () => {
    mobileListInfoModal.classList.add('hidden');
};

const billingModal = document.getElementById('billingModal');
const modalHeader = document.getElementById('modalHeader');
const modalRepairList = document.getElementById('modalRepairList');
const modalAddRepairSection = document.getElementById('modalAddRepairSection');
const modalEstimatedSection = document.getElementById('modalEstimatedSection');
const modalFinalAmount = document.getElementById('modalFinalAmount');
const modalActionButton = document.getElementById('modalActionButton');

document.getElementById('closeBillingModal').onclick = () => {
    billingModal.classList.add('hidden');
};

function updateFinalBillInModal() {
    let amount = billings[currentBillingIndex].repairs.reduce((sum, r) => sum + +r.price, 0);
    modalFinalAmount.querySelector('#finalBillAmount').textContent = amount.toFixed(2);
}

function openBillingModal(idx, mode = 'bill') {
    currentBillingIndex = idx;
    currentModalMode = mode;
    let billing = billings[idx];

    modalHeader.textContent = mode === 'view' ? "Bill Details" : "Billing Section";

    modalRepairList.innerHTML = billing.repairs.map((r, i) => `
      <div class="flex items-center justify-between gap-2 mb-2">
        <span class="font-medium">${r.name}${r.important ? ' <span class="text-red-600">*</span>' : ''}</span>
        ${mode === 'bill'
            ? `<input type="number" min="0" value="${r.price}" class="border rounded px-2 py-1 w-24 repair-price-input" data-idx="${i}"/>`
            : `<span class="ml-2 text-gray-600">${r.price} ₹</span>`
        }
      </div>`).join('');

    modalAddRepairSection.innerHTML = mode === 'bill' ? `
      <div class="flex gap-x-2 w-full justify-be"><input type="text" id="newRepairName" class="border px-2 py-1 rounded" placeholder="New repair name" />
      <input type="number" min="0" id="newRepairPrice" class="border px-2 py-1 rounded w-24 block sm:flex" placeholder="Price" /></div>
      <div class="flex justify-end w-full"><div></div><div><button id="addRepairBtn" class="bg-primary text-white rounded px-4 py-2">Add Repair</button></div></div>
    ` : '';

    modalEstimatedSection.innerHTML = `
      <label class="block mb-1 font-medium">Estimated Days</label>
      <input type="number" min="1" id="estimatedDays" class="border rounded px-2 py-1 w-32" value="${billing.estimatedDays}" ${mode === 'view' ? 'disabled' : ''} />
    `;

    let totalAmount = billing.repairs.reduce((sum, r) => sum + +r.price, 0);
    modalFinalAmount.innerHTML = `Total Bill Amount: <span id="finalBillAmount">${billing.finalAmount !== null ? billing.finalAmount : totalAmount}</span> ₹`;

    modalActionButton.innerHTML = mode === 'bill' ? `<button id="confirmBillBtn" class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">Bill</button>` : '';

    if (mode === 'bill') {
        document.getElementById('addRepairBtn').onclick = () => {
            let name = document.getElementById('newRepairName').value.trim();
            let price = +document.getElementById('newRepairPrice').value;
            if (!name || isNaN(price) || price < 0) return alert('Enter valid name and price');
            billings[currentBillingIndex].repairs.push({ name, price, important: false });
            openBillingModal(currentBillingIndex, 'bill');
        };
        document.getElementById('estimatedDays').oninput = (e) => {
            billing.estimatedDays = +e.target.value;
        };
    }

    billingModal.classList.remove('hidden');
}

// Handle price inputs changes
document.addEventListener('input', (e) => {
    if (e.target.classList.contains('repair-price-input') && currentModalMode === 'bill' && currentBillingIndex !== null) {
        let idx = +e.target.dataset.idx;
        let val = +e.target.value;
        if (!isNaN(val) && val >= 0) {
            billings[currentBillingIndex].repairs[idx].price = val;
            updateFinalBillInModal();
        }
    }
});

// Confirm billing (Bill button)
document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'confirmBillBtn') {
        let billing = billings[currentBillingIndex];
        billing.finalAmount = billing.repairs.reduce((sum, r) => sum + +r.price, 0);
        billing.status = 'Billed';
        billingModal.classList.add('hidden');
        renderTableDesktop();
        renderListMobile();
    }
});

// Initial rendering of tables and lists
window.onload = () => {
    renderTableDesktop();
    renderListMobile();
};

