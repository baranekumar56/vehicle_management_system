# Vehicle Management System

A Software solution built to mitigate classical vehicle service management problems. Built on top with HTML, CSS , JS and Tailwind.


## Features

- **Customers**
  - Can book a service or repair.
  - Can download invoice for their bookings.
  - Can seemlessly manage booking history.
  - Can choose what services to be done on their vehicle.
- **Admin**
  - Can auto schedule, service and repair booking seemlessly.
  - Manage existing and previous service bookings.
  - Generate reports based on bookings, revenue, etc,...
  - Can carry out automatic as well as manual backup.
  - Can manage services and repairs , as well as can add vehicles and services.


## Project Structure

```
.
├── assets # contains images used by the software
├── components # commonly used components in all pages
│   ├── components-loader.js 
│   ├── navbar.html 
│   ├── sidebar.html 
│   ├── user-components-loader.js
│   ├── user-nav-bar.html
│   └── user-side-bar.html
├── db.json 
├── index.html # entry point
├── package.json
├── package-lock.json
└── pages
    ├── admin
    │   ├── backup-restore
    │   │   ├── backup-restore.html
    │   │   └── backup-restore.js
    │   ├── bookings
    │   │   ├── bookings.html
    │   │   └── bookings.js
    │   ├── content-management
    │   │   └── content-management.html
    │   ├── customer-management
    │   │   ├── customer-management.html
    │   │   └── customer-management.js
    │   ├── dashboard
    │   │   ├── dashboard.html
    │   │   └── dashboard.js
    │   ├── garage-management
    │   │   ├── garage-management.html
    │   │   └── garage-management.js
    │   ├── issues
    │   │   ├── issues.html
    │   │   └── issues.js
    │   ├── mechanic-management
    │   │   ├── mechanic-management.html
    │   │   └── mechanic-management.js
    │   ├── notifications
    │   │   ├── notifications.html
    │   │   └── notifications.js
    │   ├── payments
    │   │   ├── billing.html
    │   │   ├── billings.js
    │   │   ├── payments.html
    │   │   └── payments.js
    │   ├── reports
    │   │   └── reports.html
    │   └── service-management
    │       ├── JS
    │       │   ├── packages.js
    │       │   ├── service-management.js
    │       │   ├── services.js
    │       │   └── vehicles.js
    │       ├── packages.html
    │       ├── service-management.html
    │       ├── services.html
    │       └── vehicles.html
    ├── auth
    │   ├── forgot-password.html
    │   ├── login.html
    │   ├── reenter-password.html
    │   └── signup.html
    ├── book
    │   ├── book-repair
    │   │   └── book-a-repair.html
    │   └── book-service
    │       └── book-a-service.html
    ├── customer
    │   ├── appointments
    │   │   ├── appointments.html
    │   │   └── appointments.js
    │   ├── book-an-appointment
    │   ├── dashboard
    │   │   ├── dashboard.html
    │   │   └── dashboard.js
    │   ├── issues-support
    │   │   ├── issues.html
    │   │   └── issues.js
    │   ├── payments
    │   │   ├── payments.html
    │   │   └── payments.js
    │   ├── service-history
    │   │   ├── service-history.html
    │   │   └── service-history.js
    │   └── vehicle-management
    │       ├── vehicle-management.html
    │       └── vehicle-management.js
    └── profile
        ├── generated-image (4).png
        └── loader.html
```

## Getting Started

1. Open `index.html` in your browser
2. You can walk throught book service and repair pages.
3. Click login to view admin and customer interfaces.
4. Use **Email**: admin@gmail.com **Password**: admin to get into admin interface.
5. Use **Email**: customer@gmail.com **Password**: customer to get into customer interface.

## Architecture

This project follows a **feature-based folder structure**. Each feature is segreated into separate folders consisting of their html and js within themselves, reducing coupling between features.

### NOTE 
- The application currently uses hard coded data to showcase it's functioning . 
- In the future , backend will be added to ensure persistent storage of information.
- As the application is currently built for only two users, admin and customer, a page for the mechanic will later be added to showcase booking status transitions.