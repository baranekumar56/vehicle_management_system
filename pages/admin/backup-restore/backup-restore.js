localStorage.setItem('vms_current_page', 'backup_restore');


        // Sample backup data
        const backups = [
            {
                id: 1,
                version: 'v2.1.3',
                date: '24/09/2025',
                time: '02:30',
                size: '156.2 MB',
                type: 'Scheduled',
                status: 'Completed'
            },
            {
                id: 2,
                version: 'v2.1.2',
                date: '23/09/2025',
                time: '02:30',
                size: '154.8 MB',
                type: 'Scheduled',
                status: 'Completed'
            },
            {
                id: 3,
                version: 'v2.1.1',
                date: '22/09/2025',
                time: '14:45',
                size: '152.1 MB',
                type: 'Manual',
                status: 'Completed'
            },
            {
                id: 4,
                version: 'v2.1.0',
                date: '22/09/2025',
                time: '02:30',
                size: '151.7 MB',
                type: 'Scheduled',
                status: 'Completed'
            },
            {
                id: 5,
                version: 'v2.0.9',
                date: '21/09/2025',
                time: '02:30',
                size: '149.3 MB',
                type: 'Scheduled',
                status: 'Completed'
            },
            {
                id: 6,
                version: 'v2.0.8',
                date: '20/09/2025',
                time: '16:20',
                size: '148.9 MB',
                type: 'Manual',
                status: 'Completed'
            }
        ];

        // Elements
        const autoModeDesktop = document.getElementById('auto-mode');
        const manualModeDesktop = document.getElementById('manual-mode');
        const autoOptionsDesktop = document.getElementById('auto-options');
        const manualOptionsDesktop = document.getElementById('manual-options');
        const scheduleBtnDesktop = document.getElementById('schedule-btn');
        const backupNowBtnDesktop = document.getElementById('backup-now-btn');

        const autoModeMobile = document.getElementById('auto-mode-mobile');
        const manualModeMobile = document.getElementById('manual-mode-mobile');
        const autoOptionsMobile = document.getElementById('auto-options-mobile');
        const manualOptionsMobile = document.getElementById('manual-options-mobile');
        const scheduleBtnMobile = document.getElementById('schedule-btn-mobile');
        const backupNowBtnMobile = document.getElementById('backup-now-btn-mobile');

        const backupTableBodyDesktop = document.getElementById('backupTableBodyDesktop');
        const backupListMobile = document.getElementById('backupListMobile');
        const prevBtnDesktop = document.getElementById('prevPageDesktop');
        const nextBtnDesktop = document.getElementById('nextPageDesktop');
        const pageInfoDesktop = document.getElementById('pageInfoDesktop');
        const prevBtnMobile = document.getElementById('prevPageMobile');
        const nextBtnMobile = document.getElementById('nextPageMobile');
        const pageInfoMobile = document.getElementById('pageInfoMobile');

        // Modal elements
        const backupDetailsModal = document.getElementById('backup-details-modal');
        const detailsModalCloseBtn = document.getElementById('details-modal-close-btn');
        const detailsModalContent = document.getElementById('details-modal-content');

        // Toast elements
        const toast = document.getElementById('toast');
        const toastIcon = document.getElementById('toast-icon');
        const toastMessage = document.getElementById('toast-message');
        const toastClose = document.getElementById('toast-close');

        // Progress bar elements
        const progressContainer = document.getElementById('progress-container');
        const progressBar = document.getElementById('progress-bar');

        let currentPageDesktop = 1;
        const rowsPerPageDesktop = 10;
        let currentPageMobile = 1;
        const rowsPerPageMobile = 5;

        // Toggle between auto and manual modes - Desktop
        autoModeDesktop.addEventListener('change', () => {
            if (autoModeDesktop.checked) {
                autoOptionsDesktop.classList.remove('hidden');
                manualOptionsDesktop.classList.add('hidden');
            }
        });

        manualModeDesktop.addEventListener('change', () => {
            if (manualModeDesktop.checked) {
                autoOptionsDesktop.classList.add('hidden');
                manualOptionsDesktop.classList.remove('hidden');
            }
        });

        // Toggle between auto and manual modes - Mobile
        autoModeMobile.addEventListener('change', () => {
            if (autoModeMobile.checked) {
                autoOptionsMobile.classList.remove('hidden');
                manualOptionsMobile.classList.add('hidden');
            }
        });

        manualModeMobile.addEventListener('change', () => {
            if (manualModeMobile.checked) {
                autoOptionsMobile.classList.add('hidden');
                manualOptionsMobile.classList.remove('hidden');
            }
        });

        // Toast functionality
        function showToast(message, type = 'success') {
            toastMessage.textContent = message;
            
            if (type === 'success') {
                toastIcon.innerHTML = `<svg class="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>`;
            } else if (type === 'error') {
                toastIcon.innerHTML = `<svg class="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                </svg>`;
            }
            
            toast.classList.remove('hidden');
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 5000);
        }

        toastClose.addEventListener('click', () => {
            toast.classList.add('hidden');
        });

        // Progress bar functionality
        function showProgress() {
            progressContainer.classList.remove('hidden');
            progressBar.style.width = '0%';
            
            let width = 0;
            const interval = setInterval(() => {
                width += Math.random() * 15;
                if (width >= 100) {
                    width = 100;
                    clearInterval(interval);
                    setTimeout(() => {
                        progressContainer.classList.add('hidden');
                    }, 500);
                }
                progressBar.style.width = width + '%';
            }, 200);
        }

        // Schedule backup functionality
        function scheduleBackup() {
            const frequency = document.querySelector('input[name="schedule-frequency"]:checked')?.value || 
                            document.querySelector('input[name="schedule-frequency-mobile"]:checked')?.value;
            showProgress();
            showToast(`${frequency.charAt(0).toUpperCase() + frequency.slice(1)} backup scheduled successfully!`);
        }

        scheduleBtnDesktop.addEventListener('click', scheduleBackup);
        scheduleBtnMobile.addEventListener('click', scheduleBackup);

        // Manual backup functionality
        function performBackup() {
            showProgress();
            setTimeout(() => {
                const newBackup = {
                    id: backups.length + 1,
                    version: `v2.1.${backups.length + 4}`,
                    date: new Date().toLocaleDateString('en-GB'),
                    time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
                    size: `${(Math.random() * 50 + 140).toFixed(1)} MB`,
                    type: 'Manual',
                    status: 'Completed'
                };
                backups.unshift(newBackup);
                render();
                showToast('Backup completed successfully!');
            }, 3000);
        }

        backupNowBtnDesktop.addEventListener('click', performBackup);
        backupNowBtnMobile.addEventListener('click', performBackup);

        // Render functions
        function render() {
            renderTableDesktop();
            renderMobileList();
            updatePaginationDesktop();
            updatePaginationMobile();
        }

        function renderTableDesktop() {
            const start = (currentPageDesktop - 1) * rowsPerPageDesktop;
            const end = start + rowsPerPageDesktop;
            const pageData = backups.slice(start, end);

            backupTableBodyDesktop.innerHTML = "";
            pageData.forEach((backup, idx) => {
                const globalIdx = start + idx;
                backupTableBodyDesktop.innerHTML += `
                <tr class="hover:bg-gray-50">
                    <td class="py-2 px-4 border border-gray-300">${backup.version}</td>
                    <td class="py-2 px-4 border border-gray-300">${backup.date}</td>
                    <td class="py-2 px-4 border border-gray-300">${backup.time}</td>
                    <td class="py-2 px-4 border border-gray-300">${backup.size}</td>
                    <td class="py-2 px-4 border border-gray-300">
                        <span class="px-2 py-1 rounded-full text-xs ${backup.type === 'Manual' ? 'text-blue-600 bg-blue-100' : 'text-green-600 bg-green-100'}">${backup.type}</span>
                    </td>
                    <td class="py-2 px-4 border border-gray-300">
                        <div class="flex gap-2">
                            <button class="restoreDesktop text-green-600 hover:underline text-sm" data-index="${globalIdx}">
                                Restore
                            </button>
                            <button class="deleteDesktop text-red-600 hover:underline text-sm" data-index="${globalIdx}">
                                Delete
                            </button>
                        </div>
                    </td>
                </tr>
                `;
            });
            attachDesktopEvents();
        }

        function renderMobileList() {
            const start = (currentPageMobile - 1) * rowsPerPageMobile;
            const end = start + rowsPerPageMobile;
            const pageData = backups.slice(start, end);

            backupListMobile.innerHTML = "";
            pageData.forEach((backup, idx) => {
                const globalIdx = start + idx;
                backupListMobile.innerHTML += `
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center">
                    <div class="mr-3 text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                        </svg>
                    </div>
                    
                    <div class="flex-1">
                        <div class="font-semibold text-gray-900">${backup.version}</div>
                        <div class="text-sm text-gray-600">${backup.date} • ${backup.time}</div>
                        <span class="inline-block mt-1 px-2 py-1 rounded-full text-xs ${backup.type === 'Manual' ? 'text-blue-600 bg-blue-100' : 'text-green-600 bg-green-100'}">${backup.type}</span>
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

        // Event attachment functions
        function attachDesktopEvents() {
            document.querySelectorAll(".restoreDesktop").forEach(btn => {
                btn.addEventListener("click", function () {
                    const idx = parseInt(this.getAttribute("data-index"));
                    const backup = backups[idx];
                    performRestore(backup);
                });
            });

            document.querySelectorAll(".deleteDesktop").forEach(btn => {
                btn.addEventListener("click", function () {
                    const idx = parseInt(this.getAttribute("data-index"));
                    const backup = backups[idx];
                    performDelete(backup, idx);
                });
            });
        }

        function attachMobileEvents() {
            document.querySelectorAll(".viewDetailsMobile").forEach(btn => {
                btn.addEventListener("click", function () {
                    const idx = parseInt(this.getAttribute("data-index"));
                    const backup = backups[idx];
                    showBackupDetails(backup, idx);
                });
            });
        }

        // Show mobile backup details modal
        function showBackupDetails(backup, index) {
            detailsModalContent.innerHTML = `
                <h3 class="text-xl font-semibold mb-6 pr-8">Backup Details</h3>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Version</label>
                        <p class="mt-1 text-sm text-gray-900">${backup.version}</p>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Date</label>
                            <p class="mt-1 text-sm text-gray-900">${backup.date}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Time</label>
                            <p class="mt-1 text-sm text-gray-900">${backup.time}</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Size</label>
                            <p class="mt-1 text-sm text-gray-900">${backup.size}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Type</label>
                            <span class="inline-block mt-1 px-2 py-1 rounded-full text-xs ${backup.type === 'Manual' ? 'text-blue-600 bg-blue-100' : 'text-green-600 bg-green-100'}">${backup.type}</span>
                        </div>
                    </div>
                    <div class="flex gap-3 pt-4">
                        <button id="restore-mobile-btn" class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold">
                            Restore
                        </button>
                        <button id="delete-mobile-btn" class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold">
                            Delete
                        </button>
                    </div>
                </div>
            `;
            
            backupDetailsModal.classList.remove('hidden');
            
            document.getElementById('restore-mobile-btn').addEventListener('click', () => {
                backupDetailsModal.classList.add('hidden');
                performRestore(backup);
            });
            
            document.getElementById('delete-mobile-btn').addEventListener('click', () => {
                backupDetailsModal.classList.add('hidden');
                performDelete(backup, index);
            });
        }

        // Close modal functions
        detailsModalCloseBtn.addEventListener('click', () => {
            backupDetailsModal.classList.add('hidden');
        });

        backupDetailsModal.addEventListener('click', (e) => {
            if (e.target === backupDetailsModal) {
                backupDetailsModal.classList.add('hidden');
            }
        });

        // Perform restore action
        function performRestore(backup) {
            if (confirm(`Are you sure you want to restore from ${backup.version}? This will overwrite current data.`)) {
                showProgress();
                setTimeout(() => {
                    showToast(`Successfully restored from ${backup.version}`);
                }, 2000);
            }
        }

        // Perform delete action
        function performDelete(backup, index) {
            if (confirm(`Are you sure you want to delete backup ${backup.version}? This action cannot be undone.`)) {
                showProgress();
                setTimeout(() => {
                    backups.splice(index, 1);
                    render();
                    showToast(`Backup ${backup.version} deleted successfully`);
                }, 1500);
            }
        }

        // Pagination functions
        function updatePaginationDesktop() {
            const totalPages = Math.ceil(backups.length / rowsPerPageDesktop);
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
            const totalPages = Math.ceil(backups.length / rowsPerPageDesktop);
            if (currentPageDesktop < totalPages) {
                currentPageDesktop++;
                render();
            }
        });

        function updatePaginationMobile() {
            const totalPages = Math.ceil(backups.length / rowsPerPageMobile);
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
            const totalPages = Math.ceil(backups.length / rowsPerPageMobile);
            if (currentPageMobile < totalPages) {
                currentPageMobile++;
                render();
            }
        });

        // Initial render
        render();
