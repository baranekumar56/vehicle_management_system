localStorage.setItem('vms_current_page', 'appointments');
// Sample appointment data
const appointments = [
    {
        bookingId: 48898,
        vehicleNo: "TN 01 AB 1234",
        date: "2025-09-13",
        time: "11:00AM",
        serviceType: "Service",
        status: "Ongoing",
        paymentStatus: "pending",
        advancePaid: 600,
        services: [
            { id: 1, name: "Oil Change", amount: 1200, required: true, active: true },
            { id: 2, name: "Wheel Alignment", amount: 3000, required: false, active: true },
            { id: 3, name: "Brake Check", amount: 500, required: false, active: true }
        ]
    },
    {
        bookingId: 545688,
        vehicleNo: "TN 01 BC 1234",
        date: "2025-09-19",
        time: "03:00PM",
        serviceType: "Repair",
        status: "Booked",
        paymentStatus: "bill confirmation",
        advancePaid: 0,
        services: [
            { id: 10, name: "Engine Repair", amount: 12000, required: true, active: true },
            { id: 11, name: "Battery Check", amount: 2000, required: false, active: true }
        ]
    },
    {
        bookingId: 123456,
        vehicleNo: "TN 99 XY 9876",
        date: "2025-09-25",
        time: "09:00AM",
        serviceType: "Service",
        status: "Service Completed",
        paymentStatus: "completed",
        advancePaid: 1750,
        services: [
            { id: 20, name: "General Service", amount: 3500, required: true, active: true }
        ]
    },
    {
        bookingId: 789012,
        vehicleNo: "TN 02 CD 5678",
        date: "2025-09-20",
        time: "02:00PM",
        serviceType: "Service",
        status: "Booked",
        paymentStatus: "booked",
        advancePaid: 0,
        services: [
            { id: 30, name: "AC Service", amount: 2500, required: true, active: true },
            { id: 31, name: "Car Wash", amount: 500, required: false, active: true }
        ]
    },
    {
        bookingId: 345678,
        vehicleNo: "TN 03 EF 9012",
        date: "2025-09-18",
        time: "10:00AM",
        serviceType: "Repair",
        status: "Halted",
        paymentStatus: "waiting for billing",
        advancePaid: 0,
        services: [
            { id: 40, name: "Transmission Repair", amount: 15000, required: true, active: true }
        ]
    },
    {
        bookingId: 987654,
        vehicleNo: "TN 04 GH 3456",
        date: "2025-09-22",
        time: "01:00PM",
        serviceType: "Repair",
        status: "Ongoing",
        paymentStatus: "unpaid",
        advancePaid: 7500,
        services: [
            { id: 50, name: "Suspension Repair", amount: 8000, required: true, active: true },
            { id: 51, name: "Tire Replacement", amount: 7000, required: false, active: true }
        ]
    }
];

let filteredAppointments = [...appointments];
let currentRescheduleAppointment = null;
let currentBillingAppointment = null;
let currentPaymentAppointment = null;

// Elements references
const tableBodyDesktop = document.getElementById("appointmentTableBodyDesktop");
const prevBtnDesktop = document.getElementById("prevPageDesktop");
const nextBtnDesktop = document.getElementById("nextPageDesktop");
const pageInfoDesktop = document.getElementById("pageInfoDesktop");
const searchInputDesktop = document.getElementById("searchInputDesktop");
const searchBtnDesktop = document.getElementById("searchBtnDesktop");
const filterBtnDesktop = document.getElementById("filterBtnDesktop");
const filterPanelDesktop = document.getElementById("filterPanelDesktop");
const applyFilterDesktop = document.getElementById("applyFilterDesktop");
const clearFilterDesktop = document.getElementById("clearFilterDesktop");
const filterStatusDesktop = document.getElementById("filterStatusDesktop");
const filterPaymentDesktop = document.getElementById("filterPaymentDesktop");
const filterServiceDesktop = document.getElementById("filterServiceDesktop");
const filterDateFromDesktop = document.getElementById("filterDateFromDesktop");
const filterDateToDesktop = document.getElementById("filterDateToDesktop");
const filterVehicleDesktop = document.getElementById("filterVehicleDesktop");

const appointmentListMobile = document.getElementById("appointmentListMobile");
const prevBtnMobile = document.getElementById("prevPageMobile");
const nextBtnMobile = document.getElementById("nextPageMobile");
const pageInfoMobile = document.getElementById("pageInfoMobile");
const searchInputMobile = document.getElementById("searchInputMobile");
const searchBtnMobile = document.getElementById("searchBtnMobile");
const filterBtnMobile = document.getElementById("filterBtnMobile");
const filterPanelMobile = document.getElementById("filterPanelMobile");
const applyFilterMobile = document.getElementById("applyFilterMobile");
const clearFilterMobile = document.getElementById("clearFilterMobile");
const filterStatusMobile = document.getElementById("filterStatusMobile");
const filterPaymentMobile = document.getElementById("filterPaymentMobile");
const filterServiceMobile = document.getElementById("filterServiceMobile");
const filterDateFromMobile = document.getElementById("filterDateFromMobile");
const filterDateToMobile = document.getElementById("filterDateToMobile");
const filterVehicleMobile = document.getElementById("filterVehicleMobile");

const appointmentModal = document.getElementById("appointment-modal");
const modalCloseBtn = document.getElementById("modal-close-btn");
const modalContent = document.getElementById("modal-content");

const rescheduleModal = document.getElementById("reschedule-modal");
const rescheduleModalCloseBtn = document.getElementById("reschedule-modal-close-btn");
const rescheduleModalContent = document.getElementById("reschedule-modal-content");
const datePicker = document.getElementById("datePicker");
const timeSlot = document.getElementById("timeSlot");
const rescheduleBackBtn = document.getElementById("reschedule-back-btn");
const rescheduleNextBtn = document.getElementById("reschedule-next-btn");
const confirmBackBtn = document.getElementById("confirm-back-btn");
const confirmRescheduleBtn = document.getElementById("confirm-reschedule-btn");
const confirmDate = document.getElementById("confirm-date");
const confirmTime = document.getElementById("confirm-time");
const confirmBookingId = document.getElementById("confirm-booking-id");

const billingModal = document.getElementById("billing-modal");
const billingModalCloseBtn = document.getElementById("billing-modal-close-btn");
const billingModalContent = document.getElementById("billing-modal-content");
const billingServicesList = document.getElementById("billing-services-list");
const billingTotalAmount = document.getElementById("billing-total-amount");
const billingBookingId = document.getElementById("billing-booking-id");
const billingVehicleNo = document.getElementById("billing-vehicle-no");
const billingCancelBtn = document.getElementById("billing-cancel-btn");
const billingConfirmBtn = document.getElementById("billing-confirm-btn");

const paymentModal = document.getElementById("payment-modal");
const paymentModalCloseBtn = document.getElementById("payment-modal-close-btn");
const paymentModalContent = document.getElementById("payment-modal-content");
const paymentServicesList = document.getElementById("payment-services-list");
const paymentTotalAmount = document.getElementById("payment-total-amount");
const paymentAdvancePaid = document.getElementById("payment-advance-paid");
const paymentBalanceDue = document.getElementById("payment-balance-due");
const paymentAmountToPay = document.getElementById("payment-amount-to-pay");
const paymentBookingId = document.getElementById("payment-booking-id");
const paymentVehicleNo = document.getElementById("payment-vehicle-no");
const paymentCancelBtn = document.getElementById("payment-cancel-btn");
const paymentPayBtn = document.getElementById("payment-pay-btn");

const processingModal = document.getElementById("processing-modal");
const toast = document.getElementById("toast");

let currentPageDesktop = 1;
const rowsPerPageDesktop = 10;
let currentPageMobile = 1;
const rowsPerPageMobile = 5;

// Utility functions
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `fixed bottom-6 right-6 ${type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white px-5 py-3 rounded opacity-100 pointer-events-none transition-opacity z-50`;

    setTimeout(() => {
        toast.className = toast.className.replace('opacity-100', 'opacity-0');
    }, 3000);
}

function showProcessingModal() {
    processingModal.classList.remove('hidden');
}

function hideProcessingModal() {
    processingModal.classList.add('hidden');
}

function calculateTotalAmount(services) {
    return services.reduce((total, service) => {
        return service.active ? total + service.amount : total;
    }, 0);
}

function getStatusColor(status) {
    switch (status) {
        case 'Booked': return 'bg-blue-100 text-blue-800';
        case 'Ongoing': return 'bg-yellow-100 text-yellow-800';
        case 'Halted': return 'bg-red-100 text-red-800';
        case 'Pending': return 'bg-orange-100 text-orange-800';
        case 'Service Completed': return 'bg-green-100 text-green-800';
        case 'Repair Completed': return 'bg-green-100 text-green-800';
        case 'canceled': return 'bg-gray-100 text-gray-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

function getPaymentStatusColor(status) {
    switch (status) {
        case 'booked': return 'bg-blue-100 text-blue-800';
        case 'waiting for billing': return 'bg-yellow-100 text-yellow-800';
        case 'bill confirmation': return 'bg-orange-100 text-orange-800';
        case 'unpaid': return 'bg-red-100 text-red-800';
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'completed': return 'bg-green-100 text-green-800';
        case 'canceled': return 'bg-gray-100 text-gray-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

function formatPaymentStatus(status) {
    return status.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

// Render functions
function renderDesktopTable() {
    tableBodyDesktop.innerHTML = '';

    const startIndex = (currentPageDesktop - 1) * rowsPerPageDesktop;
    const endIndex = startIndex + rowsPerPageDesktop;
    const currentAppointments = filteredAppointments.slice(startIndex, endIndex);

    if (currentAppointments.length === 0) {
        tableBodyDesktop.innerHTML = `
                    <tr>
                        <td colspan="8" class="py-4 text-center text-gray-500">No appointments found</td>
                    </tr>
                `;
        return;
    }

    currentAppointments.forEach(appointment => {
        const row = document.createElement('tr');
        let totalAmount = 0;
        appointment.services.forEach(element => {
            totalAmount += element.amount


        });

        console.log(totalAmount)

        row.className = 'hover:bg-gray-50';

        row.innerHTML = `
                    <td class="py-3 px-4 border border-gray-300">${appointment.bookingId}</td>
                    <td class="py-3 px-4 border border-gray-300">${appointment.vehicleNo}</td>
                    <td class="py-3 px-4 border border-gray-300">${formatDate(appointment.date)}</td>
                    <td class="py-3 px-4 border border-gray-300">${appointment.time}</td>
                    <td class="py-3 px-4 border border-gray-300">${appointment.serviceType}</td>
                    <td class="py-3 px-4 border border-gray-300">
                        <span class="px-2 py-1 rounded-full text-xs ${getStatusColor(appointment.status)}">
                            ${appointment.status}
                        </span>
                    </td>
                    <td class="py-3 px-4 border border-gray-300">
                        <span class="px-2 py-1 rounded-full text-xs ${getPaymentStatusColor(appointment.paymentStatus)}">
                            ${formatPaymentStatus(appointment.paymentStatus)}
                        </span>
                    </td>
                    <td class="py-3 px-4 border border-gray-300">
                        <div class="flex flex-wrap gap-1">
                            <button class="view-btn bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs hover:bg-blue-200" data-id="${appointment.bookingId}">View</button>
                            ${appointment.status !== 'Service Completed' && appointment.status !== 'Repair Completed' && appointment.status !== 'canceled' ?
                `<button class="reschedule-btn bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs hover:bg-yellow-200" data-id="${appointment.bookingId}">Reschedule</button>` : ''}
                            ${appointment.paymentStatus === 'bill confirmation' ?
                `<button class="billing-btn bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs hover:bg-orange-200" data-id="${appointment.bookingId}">Billing</button>` : ''}
                            ${appointment.paymentStatus === 'unpaid' || appointment.paymentStatus === 'pending' ?
                `<button class="payment-btn bg-green-100 text-green-700 px-2 py-1 rounded text-xs hover:bg-green-200" data-id="${appointment.bookingId}">Payment</button>` : ''}

                            
                        </div>
                    </td>
                `;

        tableBodyDesktop.appendChild(row);
    });

    // Update pagination info
    const totalPages = Math.ceil(filteredAppointments.length / rowsPerPageDesktop);
    pageInfoDesktop.textContent = `Page ${currentPageDesktop} of ${totalPages}`;

    // Enable/disable pagination buttons
    prevBtnDesktop.disabled = currentPageDesktop === 1;
    nextBtnDesktop.disabled = currentPageDesktop === totalPages || totalPages === 0;
}

function renderMobileList() {
    appointmentListMobile.innerHTML = '';

    const startIndex = (currentPageMobile - 1) * rowsPerPageMobile;
    const endIndex = startIndex + rowsPerPageMobile;
    const currentAppointments = filteredAppointments.slice(startIndex, endIndex);

    if (currentAppointments.length === 0) {
        appointmentListMobile.innerHTML = `
                    <div class="bg-white rounded-lg shadow p-4 text-center text-gray-500">
                        No appointments found
                    </div>
                `;
        return;
    }

    currentAppointments.forEach(appointment => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg shadow p-4';

        card.innerHTML = `
                    <div class="flex justify-between items-start mb-2">
                        <div>
                            <h3 class="font-semibold">Booking ID: ${appointment.bookingId}</h3>
                            <p class="text-sm text-gray-600">${appointment.vehicleNo}</p>
                        </div>
                        <div class="text-right">
                            <span class="px-2 py-1 rounded-full text-xs ${getStatusColor(appointment.status)}">
                                ${appointment.status}
                            </span>
                            <p class="text-xs text-gray-500 mt-1">${formatDate(appointment.date)} ${appointment.time}</p>
                        </div>
                    </div>
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-sm">${appointment.serviceType}</span>
                        <span class="px-2 py-1 rounded-full text-xs ${getPaymentStatusColor(appointment.paymentStatus)}">
                            ${formatPaymentStatus(appointment.paymentStatus)}
                        </span>
                    </div>
                    <div class="flex flex-wrap gap-2 mt-3">
                        <button class="view-btn bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm flex-1 text-center" data-id="${appointment.bookingId}">View</button>
                        ${appointment.status !== 'Service Completed' && appointment.status !== 'Repair Completed' && appointment.status !== 'canceled' ?
                `<button class="reschedule-btn bg-yellow-100 text-yellow-700 px-3 py-1 rounded text-sm flex-1 text-center" data-id="${appointment.bookingId}">Reschedule</button>` : ''}
                        ${appointment.paymentStatus === 'bill confirmation' ?
                `<button class="billing-btn bg-orange-100 text-orange-700 px-3 py-1 rounded text-sm flex-1 text-center" data-id="${appointment.bookingId}">Billing</button>` : ''}
                        ${appointment.paymentStatus === 'unpaid' || appointment.paymentStatus === 'pending' ?
                `<button class="payment-btn bg-green-100 text-green-700 px-3 py-1 rounded text-sm flex-1 text-center" data-id="${appointment.bookingId}">Payment</button>` : ''}
                    </div>
                `;

        appointmentListMobile.appendChild(card);
    });

    // Update pagination info
    const totalPages = Math.ceil(filteredAppointments.length / rowsPerPageMobile);
    pageInfoMobile.textContent = `Page ${currentPageMobile} of ${totalPages}`;

    // Enable/disable pagination buttons
    prevBtnMobile.disabled = currentPageMobile === 1;
    nextBtnMobile.disabled = currentPageMobile === totalPages || totalPages === 0;
}

function showAppointmentDetails(bookingId) {
    const appointment = appointments.find(a => a.bookingId === parseInt(bookingId));
    if (!appointment) return;

    modalContent.innerHTML = `
                <h2 class="text-xl font-semibold mb-4">Appointment Details</h2>
                <div class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <p class="text-sm text-gray-600">Booking ID</p>
                            <p class="font-medium">${appointment.bookingId}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-600">Vehicle No</p>
                            <p class="font-medium">${appointment.vehicleNo}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-600">Date</p>
                            <p class="font-medium">${formatDate(appointment.date)}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-600">Time</p>
                            <p class="font-medium">${appointment.time}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-600">Service Type</p>
                            <p class="font-medium">${appointment.serviceType}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-600">Status</p>
                            <p class="font-medium"><span class="px-2 py-1 rounded-full text-xs ${getStatusColor(appointment.status)}">${appointment.status}</span></p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-600">Payment Status</p>
                            <p class="font-medium"><span class="px-2 py-1 rounded-full text-xs ${getPaymentStatusColor(appointment.paymentStatus)}">${formatPaymentStatus(appointment.paymentStatus)}</span></p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-600">Advance Paid</p>
                            <p class="font-medium">₹${appointment.advancePaid}</p>
                        </div>
                    </div>
                    
                    <div>
                        <h3 class="font-semibold mb-2">Services</h3>
                        <div class="space-y-2">
                            ${appointment.services.map(service => `
                                <div class="flex justify-between items-center bg-gray-50 p-2 rounded">
                                    <span>${service.name}<span class="text-sm">${service.removed ? '(Removed)' : ''}</span></span>

                                    <span class="font-medium">₹${service.amount}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="flex justify-between items-center pt-4 border-t">
                        <span class="font-semibold">Total Amount:</span>
                        <span class="text-lg font-bold">₹${calculateTotalAmount(appointment.services)}</span>
                    </div>
                </div>
            `;

    appointmentModal.classList.remove('hidden');
}

function showRescheduleModal(bookingId) {
    const appointment = appointments.find(a => a.bookingId === parseInt(bookingId));
    if (!appointment) return;

    currentRescheduleAppointment = appointment;

    // Set current date as default
    const today = new Date().toISOString().split('T')[0];
    datePicker.value = today;
    timeSlot.value = '';

    // Reset to first step
    const steps = rescheduleModalContent.querySelectorAll('.step-content');
    steps[0].classList.add('active');
    steps[0].classList.remove('hidden');
    steps[1].classList.remove('active');
    steps[1].classList.add('hidden');

    rescheduleModal.classList.remove('hidden');
}

function showBillingModal(bookingId) {
    const appointment = appointments.find(a => a.bookingId === parseInt(bookingId));
    if (!appointment) return;

    currentBillingAppointment = appointment;

    billingBookingId.textContent = appointment.bookingId;
    billingVehicleNo.textContent = appointment.vehicleNo;

    // Render services list with remove option for non-required services
    billingServicesList.innerHTML = '';
    appointment.services.forEach(service => {
        const serviceItem = document.createElement('div');
        serviceItem.className = 'flex justify-between items-center p-2 border rounded service-item';
        serviceItem.dataset.serviceId = service.id;

        serviceItem.innerHTML = `
                    <div class="flex items-center">
                        <span>${service.name}</span>
                        ${service.required ? '<span class="ml-2 text-xs bg-red-100 text-red-800 px-1 rounded">Required</span>' : ''}
                    </div>
                    <div class="flex items-center">
                        <span class="font-medium mr-2">₹${service.amount}</span>
                        ${!service.required ? `<button class="remove-service-btn text-red-600 hover:text-red-800 text-sm">Remove</button>` : ''}
                    </div>
                `;

        billingServicesList.appendChild(serviceItem);
    });

    // Update total amount
    const totalAmount = calculateTotalAmount(appointment.services);
    billingTotalAmount.textContent = `₹${totalAmount}`;

    billingModal.classList.remove('hidden');
}

function showPaymentModal(bookingId) {
    const appointment = appointments.find(a => a.bookingId === parseInt(bookingId));
    if (!appointment) return;

    currentPaymentAppointment = appointment;

    paymentBookingId.textContent = appointment.bookingId;
    paymentVehicleNo.textContent = appointment.vehicleNo;

    // Render services list
    paymentServicesList.innerHTML = '';
    appointment.services.forEach(service => {
        if (service.active) {
            const serviceItem = document.createElement('div');
            serviceItem.className = 'flex justify-between items-center p-2 border rounded';

            serviceItem.innerHTML = `
                        <span>${service.name}</span>
                        <span class="font-medium">₹${service.amount}</span>
                    `;

            paymentServicesList.appendChild(serviceItem);
        }
    });

    // Calculate amounts
    const totalAmount = calculateTotalAmount(appointment.services);
    const balanceDue = totalAmount - appointment.advancePaid;

    paymentTotalAmount.textContent = `₹${totalAmount}`;
    paymentAdvancePaid.textContent = `₹${appointment.advancePaid}`;
    paymentBalanceDue.textContent = `₹${balanceDue}`;

    // Set initial amount to pay based on payment type
    updatePaymentAmount();

    paymentModal.classList.remove('hidden');
}

function updatePaymentAmount() {
    if (!currentPaymentAppointment) return;

    const totalAmount = calculateTotalAmount(currentPaymentAppointment.services);
    const balanceDue = totalAmount - currentPaymentAppointment.advancePaid;
    const paymentType = document.querySelector('input[name="payment-type"]:checked').value;

    let amountToPay = 0;

    if (paymentType === 'full') {
        amountToPay = balanceDue;
    } else if (paymentType === 'advance') {
        // For repairs, if no advance paid yet, calculate 50% of total
        if (currentPaymentAppointment.advancePaid === 0) {
            amountToPay = Math.round(totalAmount * 0.5);
        } else {
            // If advance already paid, only full payment is allowed
            amountToPay = balanceDue;
            // Auto-select full payment
            document.querySelector('input[name="payment-type"][value="full"]').checked = true;
        }
    }

    paymentAmountToPay.textContent = `₹${amountToPay}`;
}

// Event listeners
document.addEventListener('DOMContentLoaded', function () {
    // Initial render
    renderDesktopTable();
    renderMobileList();

    // Desktop event listeners
    searchBtnDesktop.addEventListener('click', function () {
        const searchTerm = searchInputDesktop.value.toLowerCase();
        filterAppointments(searchTerm);
    });

    searchInputDesktop.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            const searchTerm = searchInputDesktop.value.toLowerCase();
            filterAppointments(searchTerm);
        }
    });

    filterBtnDesktop.addEventListener('click', function () {
        filterPanelDesktop.classList.toggle('hidden');
    });

    applyFilterDesktop.addEventListener('click', function () {
        filterAppointments();
        filterPanelDesktop.classList.add('hidden');
    });

    clearFilterDesktop.addEventListener('click', function () {
        filterStatusDesktop.value = '';
        filterPaymentDesktop.value = '';
        filterServiceDesktop.value = '';
        filterDateFromDesktop.value = '';
        filterDateToDesktop.value = '';
        filterVehicleDesktop.value = '';
        filterAppointments();
        filterPanelDesktop.classList.add('hidden');
    });

    prevBtnDesktop.addEventListener('click', function () {
        if (currentPageDesktop > 1) {
            currentPageDesktop--;
            renderDesktopTable();
        }
    });

    nextBtnDesktop.addEventListener('click', function () {
        const totalPages = Math.ceil(filteredAppointments.length / rowsPerPageDesktop);
        if (currentPageDesktop < totalPages) {
            currentPageDesktop++;
            renderDesktopTable();
        }
    });

    // Mobile event listeners
    searchBtnMobile.addEventListener('click', function () {
        const searchTerm = searchInputMobile.value.toLowerCase();
        filterAppointments(searchTerm);
    });

    searchInputMobile.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            const searchTerm = searchInputMobile.value.toLowerCase();
            filterAppointments(searchTerm);
        }
    });

    filterBtnMobile.addEventListener('click', function () {
        filterPanelMobile.classList.toggle('hidden');
    });

    applyFilterMobile.addEventListener('click', function () {
        filterAppointments();
        filterPanelMobile.classList.add('hidden');
    });

    clearFilterMobile.addEventListener('click', function () {
        filterStatusMobile.value = '';
        filterPaymentMobile.value = '';
        filterServiceMobile.value = '';
        filterDateFromMobile.value = '';
        filterDateToMobile.value = '';
        filterVehicleMobile.value = '';
        filterAppointments();
        filterPanelMobile.classList.add('hidden');
    });

    prevBtnMobile.addEventListener('click', function () {
        if (currentPageMobile > 1) {
            currentPageMobile--;
            renderMobileList();
        }
    });

    nextBtnMobile.addEventListener('click', function () {
        const totalPages = Math.ceil(filteredAppointments.length / rowsPerPageMobile);
        if (currentPageMobile < totalPages) {
            currentPageMobile++;
            renderMobileList();
        }
    });

    // Modal close buttons
    modalCloseBtn.addEventListener('click', function () {
        appointmentModal.classList.add('hidden');
    });

    rescheduleModalCloseBtn.addEventListener('click', function () {
        rescheduleModal.classList.add('hidden');
    });

    billingModalCloseBtn.addEventListener('click', function () {
        billingModal.classList.add('hidden');
    });

    paymentModalCloseBtn.addEventListener('click', function () {
        paymentModal.classList.add('hidden');
    });

    // Close modals when clicking outside
    window.addEventListener('click', function (e) {
        if (e.target === appointmentModal) {
            appointmentModal.classList.add('hidden');
        }
        if (e.target === rescheduleModal) {
            rescheduleModal.classList.add('hidden');
        }
        if (e.target === billingModal) {
            billingModal.classList.add('hidden');
        }
        if (e.target === paymentModal) {
            paymentModal.classList.add('hidden');
        }
    });

    // Reschedule modal steps
    rescheduleNextBtn.addEventListener('click', function () {
        if (!datePicker.value || !timeSlot.value) {
            showToast('Please select both date and time', 'error');
            return;
        }

        const steps = rescheduleModalContent.querySelectorAll('.step-content');
        steps[0].classList.remove('active');
        steps[0].classList.add('hidden');
        steps[1].classList.remove('hidden');
        steps[1].classList.add('active');

        // Set confirmation details
        confirmDate.textContent = formatDate(datePicker.value);
        confirmTime.textContent = timeSlot.value;
        confirmBookingId.textContent = currentRescheduleAppointment.bookingId;
    });

    rescheduleBackBtn.addEventListener('click', function () {
        const steps = rescheduleModalContent.querySelectorAll('.step-content');
        steps[1].classList.remove('active');
        steps[1].classList.add('hidden');
        steps[0].classList.remove('hidden');
        steps[0].classList.add('active');
    });

    confirmBackBtn.addEventListener('click', function () {
        const steps = rescheduleModalContent.querySelectorAll('.step-content');
        steps[1].classList.remove('active');
        steps[1].classList.add('hidden');
        steps[0].classList.remove('hidden');
        steps[0].classList.add('active');
    });

    confirmRescheduleBtn.addEventListener('click', function () {
        showProcessingModal();

        // Simulate API call
        setTimeout(() => {
            hideProcessingModal();
            rescheduleModal.classList.add('hidden');
            showToast('Appointment rescheduled successfully!');

            // Update the appointment in our data (in a real app, this would be an API call)
            const appointmentIndex = appointments.findIndex(a => a.bookingId === currentRescheduleAppointment.bookingId);
            if (appointmentIndex !== -1) {
                appointments[appointmentIndex].date = datePicker.value;
                appointments[appointmentIndex].time = timeSlot.value.replace(' ', '');

                // Re-render tables
                renderDesktopTable();
                renderMobileList();
            }
        }, 2000);
    });

    // Billing modal
    billingCancelBtn.addEventListener('click', function () {
        billingModal.classList.add('hidden');
    });

    billingConfirmBtn.addEventListener('click', function () {
        showProcessingModal();

        // Simulate API call
        setTimeout(() => {
            hideProcessingModal();
            billingModal.classList.add('hidden');
            showToast('Billing confirmed successfully!');

            // Update the appointment payment status
            const appointmentIndex = appointments.findIndex(a => a.bookingId === currentBillingAppointment.bookingId);
            if (appointmentIndex !== -1) {
                appointments[appointmentIndex].paymentStatus = 'unpaid';

                // Re-render tables
                renderDesktopTable();
                renderMobileList();
            }
        }, 2000);
    });

    // Payment modal
    paymentCancelBtn.addEventListener('click', function () {
        paymentModal.classList.add('hidden');
    });

    paymentPayBtn.addEventListener('click', function () {
        showProcessingModal();

        // Simulate API call
        setTimeout(() => {
            hideProcessingModal();
            paymentModal.classList.add('hidden');
            showToast('Payment processed successfully!');

            // Update the appointment payment status
            const appointmentIndex = appointments.findIndex(a => a.bookingId === currentPaymentAppointment.bookingId);
            if (appointmentIndex !== -1) {
                const paymentType = document.querySelector('input[name="payment-type"]:checked').value;
                const totalAmount = calculateTotalAmount(appointments[appointmentIndex].services);

                if (paymentType === 'full') {
                    appointments[appointmentIndex].paymentStatus = 'completed';
                    appointments[appointmentIndex].advancePaid = totalAmount;
                } else if (paymentType === 'advance') {
                    appointments[appointmentIndex].paymentStatus = 'pending';
                    appointments[appointmentIndex].advancePaid = Math.round(totalAmount * 0.5);
                }

                // Re-render tables
                renderDesktopTable();
                renderMobileList();
            }
        }, 2000);
    });

    // Payment type change
    document.querySelectorAll('input[name="payment-type"]').forEach(radio => {
        radio.addEventListener('change', updatePaymentAmount);
    });

    // Dynamic event delegation for action buttons
    document.addEventListener('click', function (e) {
        // View button
        if (e.target.classList.contains('view-btn')) {
            const bookingId = e.target.getAttribute('data-id');
            showAppointmentDetails(bookingId);
        }

        // Reschedule button
        if (e.target.classList.contains('reschedule-btn')) {
            const bookingId = e.target.getAttribute('data-id');
            showRescheduleModal(bookingId);
        }

        // Billing button
        if (e.target.classList.contains('billing-btn')) {
            const bookingId = e.target.getAttribute('data-id');
            showBillingModal(bookingId);
        }

        // Payment button
        if (e.target.classList.contains('payment-btn')) {
            const bookingId = e.target.getAttribute('data-id');
            showPaymentModal(bookingId);
        }

        // Remove service button in billing modal
        if (e.target.classList.contains('remove-service-btn')) {
            const serviceItem = e.target.closest('.service-item');
            const serviceId = parseInt(serviceItem.dataset.serviceId);

            // Find the service in the current billing appointment
            const serviceIndex = currentBillingAppointment.services.findIndex(s => s.id === serviceId);
            if (serviceIndex !== -1) {
                // Toggle active status
                currentBillingAppointment.services[serviceIndex].active = !currentBillingAppointment.services[serviceIndex].active;

                // Update UI
                if (currentBillingAppointment.services[serviceIndex].active) {
                    serviceItem.classList.remove('service-removed');
                    currentBillingAppointment.services[serviceIndex]['removed'] = false;

                    e.target.textContent = 'Remove';
                } else {
                    serviceItem.classList.add('service-removed');
                    currentBillingAppointment.services[serviceIndex]['removed'] = true;

                    e.target.textContent = 'Add Back';
                }

                // Update total amount
                const totalAmount = calculateTotalAmount(currentBillingAppointment.services);
                billingTotalAmount.textContent = `₹${totalAmount}`;
            }
        }
    });
});

// Filter function
function filterAppointments(searchTerm = '') {
    filteredAppointments = appointments.filter(appointment => {
        // Search term filter
        if (searchTerm) {
            const matchesSearch =
                appointment.bookingId.toString().includes(searchTerm) ||
                appointment.vehicleNo.toLowerCase().includes(searchTerm) ||
                appointment.status.toLowerCase().includes(searchTerm) ||
                appointment.paymentStatus.toLowerCase().includes(searchTerm);

            if (!matchesSearch) return false;
        }

        // Status filter
        if (filterStatusDesktop.value && appointment.status !== filterStatusDesktop.value) {
            return false;
        }

        // Payment status filter
        if (filterPaymentDesktop.value && appointment.paymentStatus !== filterPaymentDesktop.value) {
            return false;
        }

        // Service type filter
        if (filterServiceDesktop.value && appointment.serviceType !== filterServiceDesktop.value) {
            return false;
        }

        // Date range filter
        if (filterDateFromDesktop.value && appointment.date < filterDateFromDesktop.value) {
            return false;
        }

        if (filterDateToDesktop.value && appointment.date > filterDateToDesktop.value) {
            return false;
        }

        // Vehicle number filter
        if (filterVehicleDesktop.value && !appointment.vehicleNo.includes(filterVehicleDesktop.value)) {
            return false;
        }

        return true;
    });

    // Reset to first page
    currentPageDesktop = 1;
    currentPageMobile = 1;

    // Re-render
    renderDesktopTable();
    renderMobileList();


    document.addEventListener('navbarLoaded', () => {
        document.getElementById('menu_actions').remove()
    })
}