localStorage.setItem('vms_current_page', 'dashboard');

// Chart.js configuration enhanced with legends and tooltip styles
const revenueCtx = document.getElementById('revenueChart').getContext('2d');
const bookingsCtx = document.getElementById('bookingsChart').getContext('2d');

const revenueChart = new Chart(revenueCtx, {
  type: 'line',
  data: {
    labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    datasets: [{
      label: 'Revenue Stat',
      data: [800, 0, 200, 250, 400, 400, 500, 200, 220, 800],
      backgroundColor: 'rgba(99,102,241,0.3)',
      borderColor: '#6366f1',
      fill: true,
      tension: 0.4,
      pointRadius: 5,
      pointBackgroundColor: '#4338ca',
      borderWidth: 3,
      hoverRadius: 6,
      hoverBorderWidth: 4,
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: { size: 14, weight: 'bold' },
          color: '#4B5563'
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(63, 81, 181, 0.8)',
        titleFont: { weight: 'bold' },
        bodyFont: { size: 14 }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        title: { display: true, text: 'Time (units)', font: { weight: 'bold' } },
        ticks: { color: '#4B5563' }
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Revenue ($)', font: { weight: 'bold' } },
        ticks: { color: '#4B5563' }
      }
    }
  }
});

const bookingsChart = new Chart(bookingsCtx, {
  type: 'line',
  data: {
    labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    datasets: [{
      label: 'Bookings',
      data: [3, 7, 2, 6, 4, 6, 5, 7, 5, 4],
      backgroundColor: 'rgba(236,72,153,0.3)',
      borderColor: '#ec4899',
      fill: true,
      tension: 0.3,
      pointRadius: 5,
      pointBackgroundColor: '#be185d',
      borderWidth: 3,
      hoverRadius: 6,
      hoverBorderWidth: 4,
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: { size: 14, weight: 'bold' },
          color: '#4B5563'
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(236,72,153,0.8)',
        titleFont: { weight: 'bold' },
        bodyFont: { size: 14 }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        title: { display: true, text: 'Time (units)', font: { weight: 'bold' } },
        ticks: { color: '#4B5563' }
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Bookings (#)', font: { weight: 'bold' } },
        ticks: { color: '#4B5563' }
      }
    }
  }
});

// Modal calendar with individual days and ability to navigate months
const calendarTrigger = document.getElementById('calendar-trigger');
const calendarModal = document.getElementById('calendar-modal');
const closeCalendar = document.getElementById('close-calendar');
const monthLabel = document.getElementById('calendar-month');
const monthBookings = document.getElementById('future-bookings-count');
const selectedMonth = document.getElementById('selected-month');
const daysContainer = document.getElementById('calendar-days');

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
let calendarDate = new Date(2025, 8); // Starting from September 2025

// Example static bookings data per day for demo purpose (day: bookings count)
const bookingsByDate = {
  '2025-09-01': 3,
  '2025-09-02': 6,
  '2025-09-05': 2,
  '2025-09-10': 9,
  '2025-09-12': 7,
  '2025-09-15': 11,
  '2025-09-18': 4,
  '2025-09-23': 10,
  '2025-09-25': 14,
  '2025-09-28': 8
};

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function updateCalendar() {
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  monthLabel.textContent = `${months[month]} ${year}`;
  selectedMonth.textContent = `${months[month]} ${year}`;

  // Clear old days
  daysContainer.innerHTML = '';

  // Calculate day offset for the 1st of month to align weekday
  const firstDay = new Date(year, month, 1).getDay();

  // Fill blank days before first of the month
  for (let blank = 0; blank < firstDay; blank++) {
    const blankDiv = document.createElement('div');
    blankDiv.classList.add('calendar-day');
    daysContainer.appendChild(blankDiv);
  }

  const today = new Date();
  const totalDays = daysInMonth(year, month);

  for (let day = 1; day <= totalDays; day++) {
    const dayDiv = document.createElement('div');
    dayDiv.classList.add('calendar-day');
    dayDiv.title = `Bookings count for ${months[month]} ${day}, ${year}`;

    const fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayBookings = bookingsByDate[fullDate] || 0;

    // Highlight today in calendar
    if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
      dayDiv.classList.add('calendar-today');
    }

    // Display day number and bookings count below as smaller text
    dayDiv.innerHTML = `
          <span class="calendar-day-number">${day}</span><br/>
          <small class="text-sm text-gray-500">${dayBookings} booked</small>
        `;

    daysContainer.appendChild(dayDiv);
  }

  // Update the total future bookings count for the selected month
  let totalFutureBookings = 0;
  for (let d = 1; d <= totalDays; d++) {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    totalFutureBookings += bookingsByDate[dateKey] || 0;
  }
  monthBookings.textContent = totalFutureBookings;
}

calendarTrigger.onclick = () => {
  updateCalendar();
  calendarModal.classList.remove('hidden');
};

closeCalendar.onclick = () => {
  calendarModal.classList.add('hidden');
};

document.getElementById('prev-month').onclick = () => {
  calendarDate.setMonth(calendarDate.getMonth() - 1);
  updateCalendar();
};

document.getElementById('next-month').onclick = () => {
  calendarDate.setMonth(calendarDate.getMonth() + 1);
  updateCalendar();
};