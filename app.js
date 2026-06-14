/**
 * app.js - Main Application Orchestrator & View Controller
 */

const AppController = {
    currentUser: null,
    currentView: 'view-student-explorer',
    activeFilters: {
        search: '',
        type: 'all'
    },
    confirmActionCallback: null,

    // Initialize App
    async init() {
        console.log('App Controller initializing...');
        this.bindEvents();
        this.restoreTheme();
        this.restoreLanguage();
        await this.checkAuthSession();
    },

    // ----------------------------------------------------
    // STATE & ROUTING CONTROLS
    // ----------------------------------------------------
    async checkAuthSession() {
        const storedUser = sessionStorage.getItem('car_booking_user');
        if (storedUser) {
            try {
                this.currentUser = JSON.parse(storedUser);
                this.setupRoleNavigation();
                
                // Redirect user to home dashboard based on role
                if (this.currentUser.role === 'admin') {
                    await this.navigateTo('view-admin-dashboard');
                } else if (this.currentUser.role === 'driver') {
                    await this.navigateTo('view-driver-schedule');
                } else if (this.currentUser.role === 'executive') {
                    await this.navigateTo('view-admin-reports');
                } else {
                    await this.navigateTo('view-student-explorer');
                }
                
                // Show Main App Shell, Hide Landing & Auth
                document.getElementById('view-landing').style.display = 'none';
                document.getElementById('view-auth').style.display = 'none';
                document.getElementById('app-shell').style.display = 'flex';
                this.updateUserProfileTag();
                
                // Start polling/loading notifications
                await this.refreshNotifications();
            } catch (e) {
                console.error('Session restore failed:', e);
                this.logout();
            }
        } else {
            // Force Landing View (default)
            document.getElementById('app-shell').style.display = 'none';
            document.getElementById('view-auth').style.display = 'none';
            document.getElementById('view-landing').style.display = 'flex';
        }
    },

    setupRoleNavigation() {
        const role = this.currentUser.role;
        const studentExplorer = document.getElementById('menu-student-explorer');
        const studentBookings = document.getElementById('menu-student-bookings');
        const driverSchedule = document.getElementById('menu-driver-schedule');
        
        const adminDashboard = document.getElementById('menu-admin-dashboard');
        const adminVehicles = document.getElementById('menu-admin-vehicles');
        const adminReports = document.getElementById('menu-admin-reports');

        // Reset visibility
        studentExplorer.style.display = 'none';
        studentBookings.style.display = 'none';
        driverSchedule.style.display = 'none';
        adminDashboard.style.display = 'none';
        adminVehicles.style.display = 'none';
        adminReports.style.display = 'none';

        if (role === 'admin') {
            adminDashboard.style.display = 'block';
            adminVehicles.style.display = 'block';
            adminReports.style.display = 'block';
        } else if (role === 'driver') {
            driverSchedule.style.display = 'block';
        } else if (role === 'executive') {
            adminReports.style.display = 'block';
        } else {
            studentExplorer.style.display = 'block';
            studentBookings.style.display = 'block';
        }
    },

    updateUserProfileTag() {
        if (!this.currentUser) return;
        
        const avatar = document.getElementById('user-avatar');
        const nameText = document.getElementById('user-display-name');
        
        if (avatar) {
            avatar.innerText = this.currentUser.name.trim().charAt(0).toUpperCase();
        }
        if (nameText) {
            nameText.innerText = this.currentUser.name;
        }
    },

    async navigateTo(viewId) {
        UI.showLoading(true);
        this.currentView = viewId;
        
        // 1. Manage Active Sidebar link classes
        const menuIds = {
            'view-student-explorer': 'menu-student-explorer',
            'view-student-bookings': 'menu-student-bookings',
            'view-driver-schedule': 'menu-driver-schedule',
            'view-admin-dashboard': 'menu-admin-dashboard',
            'view-admin-vehicles': 'menu-admin-vehicles',
            'view-admin-reports': 'menu-admin-reports'
        };
 
        // Reset all links active states
        document.querySelectorAll('.sidebar-menu-item').forEach(el => el.classList.remove('active'));
        
        // Highlight active link
        const activeMenuId = menuIds[viewId];
        if (activeMenuId) {
            const menuEl = document.getElementById(activeMenuId);
            if (menuEl) menuEl.classList.add('active');
        }
 
        // Close sidebar drawer on mobile
        document.getElementById('sidebar-nav').classList.remove('open');
        const overlay = document.getElementById('sidebar-overlay');
        if (overlay) overlay.classList.remove('active');
 
        // 2. Hide all view containers, show target view container
        document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
        const targetView = document.getElementById(viewId);
        if (targetView) targetView.classList.add('active');
 
        // 3. Update Title text in Top Header
        const headerTitle = document.getElementById('header-current-view-title');
        if (headerTitle) {
            const translationKey = {
                'view-student-explorer': 'menu_find_car',
                'view-student-bookings': 'menu_my_bookings',
                'view-driver-schedule': 'menu_driver_schedule',
                'view-admin-dashboard': 'menu_admin_dashboard',
                'view-admin-vehicles': 'menu_admin_vehicles',
                'view-admin-reports': 'menu_admin_reports'
            }[viewId] || 'app_title';
            
            headerTitle.setAttribute('data-i18n', translationKey);
            headerTitle.innerText = UI.translate(translationKey);
        }
 
        // 4. Fetch and render view-specific data asynchronously
        try {
            if (viewId === 'view-student-explorer') {
                await this.refreshExplorerVehicles();
            } else if (viewId === 'view-student-bookings') {
                await this.refreshStudentBookings();
            } else if (viewId === 'view-driver-schedule') {
                await this.refreshDriverSchedule();
            } else if (viewId === 'view-admin-dashboard') {
                await this.refreshAdminDashboard();
            } else if (viewId === 'view-admin-vehicles') {
                await this.refreshAdminVehicles();
            } else if (viewId === 'view-admin-reports') {
                await this.refreshReports();
            }
        } catch (e) {
            console.error('Error fetching view content:', e);
            UI.showToast('Error', 'เกิดข้อผิดพลาดในการโหลดข้อมูล / Failed to load data', 'error', true);
        } finally {
            UI.showLoading(false);
        }
    },
 
    // ----------------------------------------------------
    // REFRESH VIEWS DATA ROUTINES
    // ----------------------------------------------------
    async refreshExplorerVehicles() {
        const vehicles = await API.getVehicles(this.activeFilters.search, this.activeFilters.type);
        UI.renderVehiclesGrid(vehicles, this.currentUser.id);
    },
 
    async refreshStudentBookings() {
        const bookings = await API.getBookings(this.currentUser.id, this.currentUser.role);
        UI.renderStudentBookings(bookings);
    },

    async refreshDriverSchedule() {
        const bookings = await API.getDriverSchedule(this.currentUser.id);
        UI.renderDriverSchedule(bookings);
    },
 
    async refreshAdminDashboard() {
        const bookings = await API.getBookings(null, 'admin');
        const stats = await API.getReportStats();
        UI.renderAdminDashboard(bookings, stats);
    },

    async refreshAdminVehicles() {
        const vehicles = await API.getVehicles('', 'all');
        UI.renderAdminVehicles(vehicles);
    },

    async refreshReports() {
        const stats = await API.getReportStats();
        UI.renderReportsView(stats);
    },

    async refreshNotifications() {
        if (!this.currentUser) return;
        const notifications = await API.getNotifications(this.currentUser.id);
        UI.renderNotifications(notifications);
    },

    // ----------------------------------------------------
    // DIALOG MODALS & CONFIRMATIONS HANDLERS
    // ----------------------------------------------------
    openConfirmModal(message, callback) {
        const modal = document.getElementById('modal-confirm');
        const msgEl = document.getElementById('confirm-message');
        if (!modal || !msgEl) return;
        
        msgEl.innerText = message;
        this.confirmActionCallback = callback;
        modal.classList.add('active');
    },

    closeConfirmModal() {
        const modal = document.getElementById('modal-confirm');
        if (modal) modal.classList.remove('active');
        this.confirmActionCallback = null;
    },

    // Booking modal
    async openBookingModal(vehicleId) {
        const modal = document.getElementById('modal-booking');
        const form = document.getElementById('form-booking');
        if (!modal || !form) return;

        UI.showLoading(true);
        try {
            const vehicles = await API.getVehicles();
            const car = vehicles.find(v => v.id === vehicleId);
            if (!car) throw new Error('Vehicle not found');

            document.getElementById('booking-vehicle-id').value = car.id;
            document.getElementById('booking-vehicle-name').innerText = this.currentLang === 'th' ? car.name : car.nameEn;
            document.getElementById('booking-vehicle-plate').innerText = car.plate;
            
            // Clear inputs and set minimum dates to today
            form.reset();
            
            const minDate = new Date();
            minDate.setMinutes(minDate.getMinutes() - minDate.getTimezoneOffset());
            const minDateString = minDate.toISOString().slice(0, 16);
            
            document.getElementById('booking-start').min = minDateString;
            document.getElementById('booking-end').min = minDateString;

            modal.classList.add('active');
        } catch (e) {
            UI.showToast('Error', 'ไม่สามารถจองรถคันนี้ได้ / Cannot book this car', 'error', true);
        } finally {
            UI.showLoading(false);
        }
    },

    closeBookingModal() {
        const modal = document.getElementById('modal-booking');
        if (modal) modal.classList.remove('active');
    },

    // Vehicle CRUD modal
    async openVehicleModal(vehicleId = null) {
        const modal = document.getElementById('modal-vehicle');
        const form = document.getElementById('form-vehicle');
        const titleEl = document.getElementById('modal-vehicle-title');
        
        if (!modal || !form) return;
        form.reset();

        if (vehicleId) {
            // Edit Mode
            titleEl.setAttribute('data-i18n', 'modal_vehicle_edit_title');
            titleEl.innerText = UI.translate('modal_vehicle_edit_title');
            
            UI.showLoading(true);
            try {
                const vehicles = await API.getVehicles();
                const v = vehicles.find(item => item.id === vehicleId);
                if (v) {
                    document.getElementById('vehicle-form-id').value = v.id;
                    document.getElementById('vehicle-name').value = v.name;
                    document.getElementById('vehicle-name-en').value = v.nameEn;
                    document.getElementById('vehicle-type').value = v.type;
                    document.getElementById('vehicle-plate').value = v.plate;
                    document.getElementById('vehicle-seats').value = v.seats;
                    document.getElementById('vehicle-fuel').value = v.fuelType;
                    document.getElementById('vehicle-status').value = v.status;
                }
            } catch (e) {
                console.error(e);
            } finally {
                UI.showLoading(false);
            }
        } else {
            // Add Mode
            titleEl.setAttribute('data-i18n', 'modal_vehicle_add_title');
            titleEl.innerText = UI.translate('modal_vehicle_add_title');
            document.getElementById('vehicle-form-id').value = '';
        }

        modal.classList.add('active');
    },

    closeVehicleModal() {
        const modal = document.getElementById('modal-vehicle');
        if (modal) modal.classList.remove('active');
    },

    // ----------------------------------------------------
    // WORKFLOW FUNCTIONS (ACTIONS SUBMISSIONS)
    // ----------------------------------------------------
    async submitLogin(email, password) {
        UI.showLoading(true);
        try {
            const user = await API.login(email, password);
            sessionStorage.setItem('car_booking_user', JSON.stringify(user));
            
            this.currentUser = user;
            this.setupRoleNavigation();
            
            // Redirect based on role
            if (this.currentUser.role === 'admin') {
                await this.navigateTo('view-admin-dashboard');
            } else {
                await this.navigateTo('view-student-explorer');
            }
            
            // Hide Auth page, display App layout
            document.getElementById('view-auth').style.display = 'none';
            document.getElementById('app-shell').style.display = 'flex';
            this.updateUserProfileTag();
            
            UI.showToast('Login Successful', `ยินดีต้อนรับคุณ ${user.name} เข้าสู่ระบบ`, 'success', true);
            await this.refreshNotifications();
        } catch (e) {
            let errorMsg = 'การเข้าระบบล้มเหลว';
            try {
                const errObj = JSON.parse(e.message);
                errorMsg = this.currentLang === 'th' ? errObj.th : errObj.en;
            } catch(jsonErr) {
                errorMsg = e.message;
            }
            UI.showToast('Error', errorMsg, 'error', true);
        } finally {
            UI.showLoading(false);
        }
    },

    async submitRegister(name, email, phone, role, password) {
        UI.showLoading(true);
        try {
            const user = await API.register(name, email, phone, role, password);
            sessionStorage.setItem('car_booking_user', JSON.stringify(user));
            
            this.currentUser = user;
            this.setupRoleNavigation();
            
            await this.navigateTo('view-student-explorer');
            
            document.getElementById('view-auth').style.display = 'none';
            document.getElementById('app-shell').style.display = 'flex';
            this.updateUserProfileTag();
            
            UI.showToast('Registration Success', `สมัครสมาชิกและเข้าระบบสำเร็จ ยินดีต้อนรับคุณ ${user.name}`, 'success', true);
            await this.refreshNotifications();
        } catch (e) {
            let errorMsg = 'สมัครสมาชิกล้มเหลว';
            try {
                const errObj = JSON.parse(e.message);
                errorMsg = this.currentLang === 'th' ? errObj.th : errObj.en;
            } catch(jsonErr) {
                errorMsg = e.message;
            }
            UI.showToast('Error', errorMsg, 'error', true);
        } finally {
            UI.showLoading(false);
        }
    },

    async submitBooking(vehicleId, startDate, endDate, reason) {
        UI.showLoading(true);
        try {
            await API.createBooking({
                vehicleId,
                userId: this.currentUser.id,
                userName: this.currentUser.name,
                userRole: this.currentUser.role,
                startDate,
                endDate,
                reason
            });

            this.closeBookingModal();
            UI.showToast('success_booking', 'success_booking', 'success');
            
            // Redirect to My Bookings timeline page
            await this.navigateTo('view-student-bookings');
            await this.refreshNotifications();
        } catch (e) {
            let errorMsg = 'ไม่สามารถจองได้';
            try {
                const errObj = JSON.parse(e.message);
                errorMsg = this.currentLang === 'th' ? errObj.th : errObj.en;
            } catch(jsonErr) {
                errorMsg = e.message;
            }
            UI.showToast('Error', errorMsg, 'error', true);
        } finally {
            UI.showLoading(false);
        }
    },

    cancelBookingRequest(bookingId) {
        const msg = this.currentLang === 'th' 
            ? 'คุณต้องการที่จะยกเลิกคำขอจองรถยนต์คันนี้ใช่หรือไม่?' 
            : 'Are you sure you want to cancel this booking request?';

        this.openConfirmModal(msg, async () => {
            UI.showLoading(true);
            try {
                await API.updateBookingStatus(bookingId, 'cancelled');
                UI.showToast('success_status_update', 'success_status_update', 'success');
                await this.refreshStudentBookings();
                await this.refreshNotifications();
            } catch (e) {
                UI.showToast('Error', 'ยกเลิกรายการไม่สำเร็จ / Cancel failed', 'error', true);
            } finally {
                UI.showLoading(false);
                this.closeConfirmModal();
            }
        });
    },

    async adminSetBookingStatus(bookingId, status) {
        UI.showLoading(true);
        try {
            await API.updateBookingStatus(bookingId, status, this.currentUser.id);
            UI.showToast('success_status_update', 'success_status_update', 'success');
            await this.refreshAdminDashboard();
            await this.refreshNotifications();
        } catch (e) {
            UI.showToast('Error', 'ดำเนินการไม่สำเร็จ / Operation failed', 'error', true);
        } finally {
            UI.showLoading(false);
        }
    },

    async submitVehicleForm(id, name, nameEn, type, plate, seats, fuelType, status) {
        UI.showLoading(true);
        try {
            if (id) {
                // Update
                await API.updateVehicle(id, { name, nameEn, type, plate, seats, fuelType, status });
                UI.showToast('success_vehicle_update', 'success_vehicle_update', 'success');
            } else {
                // Create
                await API.createVehicle({ name, nameEn, type, plate, seats, fuelType, status });
                UI.showToast('success_vehicle_create', 'success_vehicle_create', 'success');
            }
            this.closeVehicleModal();
            await this.refreshAdminVehicles();
        } catch (e) {
            let errorMsg = 'บันทึกข้อมูลรถยนต์ผิดพลาด';
            try {
                const errObj = JSON.parse(e.message);
                errorMsg = this.currentLang === 'th' ? errObj.th : errObj.en;
            } catch(jsonErr) {
                errorMsg = e.message;
            }
            UI.showToast('Error', errorMsg, 'error', true);
        } finally {
            UI.showLoading(false);
        }
    },

    deleteVehicleRequest(vehicleId) {
        const msg = this.currentLang === 'th' 
            ? 'คุณต้องการลบข้อมูลยานพาหนะนี้ออกจากระบบอย่างถาวรใช่หรือไม่?' 
            : 'Are you sure you want to permanently delete this vehicle from database?';

        this.openConfirmModal(msg, async () => {
            UI.showLoading(true);
            try {
                await API.deleteVehicle(vehicleId);
                UI.showToast('success_vehicle_delete', 'success_vehicle_delete', 'success');
                await this.refreshAdminVehicles();
            } catch (e) {
                let errorMsg = 'ลบไม่สำเร็จ';
                try {
                    const errObj = JSON.parse(e.message);
                    errorMsg = this.currentLang === 'th' ? errObj.th : errObj.en;
                } catch(jsonErr) {
                    errorMsg = e.message;
                }
                UI.showToast('Error', errorMsg, 'error', true);
            } finally {
                UI.showLoading(false);
                this.closeConfirmModal();
            }
        });
    },

    async markAllNotificationsAsRead() {
        if (!this.currentUser) return;
        await API.markNotificationsAsRead(this.currentUser.id);
        await this.refreshNotifications();
    },

    // ----------------------------------------------------
    // LANDING & PORTALS LOGIC (reserve.cmru.ac.th replication)
    // ----------------------------------------------------
    selectPortal(portalType) {
        this.activePortal = portalType;
        
        const headerEl = document.getElementById('auth-portal-header');
        const emailInput = document.getElementById('login-email');
        const passInput = document.getElementById('login-password');
        
        if (!headerEl || !emailInput || !passInput) return;
        
        // Dynamic titles & demo accounts auto-fill
        if (portalType === 'requester') {
            headerEl.innerText = this.currentLang === 'th' 
                ? 'สำหรับผู้ขอใช้รถ (นิสิต / บุคลากร)' 
                : 'Vehicle Requester Portal';
            emailInput.value = 'student@carbooking.com';
            passInput.value = 'student123';
        } else if (portalType === 'driver') {
            headerEl.innerText = this.currentLang === 'th' 
                ? 'สำหรับพนักงานขับรถ (Driver)' 
                : 'Driver Portal';
            emailInput.value = 'driver@carbooking.com';
            passInput.value = 'driver123';
        } else if (portalType === 'admin') {
            headerEl.innerText = this.currentLang === 'th' 
                ? 'สำหรับผู้ดูแลระบบ (Admin)' 
                : 'Administrator Portal';
            emailInput.value = 'admin@carbooking.com';
            passInput.value = 'admin123';
        } else if (portalType === 'executive') {
            headerEl.innerText = this.currentLang === 'th' 
                ? 'สำหรับผู้บริหาร (Executive)' 
                : 'Executive Portal';
            emailInput.value = 'exec@carbooking.com';
            passInput.value = 'exec123';
        }

        // Switch screen
        document.getElementById('view-landing').style.display = 'none';
        document.getElementById('view-auth').style.display = 'flex';
    },

    goBackToLanding() {
        document.getElementById('view-auth').style.display = 'none';
        document.getElementById('view-landing').style.display = 'flex';
    },

    openEvaluation() {
        const msg = this.currentLang === 'th'
            ? 'ขอขอบคุณในความร่วมมือ! แบบประเมินความพึงพอใจจะเปิดใช้งานในระบบจริงเร็วๆ นี้'
            : 'Thank you! The satisfaction evaluation will be active on production soon.';
        UI.showToast('ประเมินระบบ / Evaluation', msg, 'info', true);
    },

    // ----------------------------------------------------
    // SYSTEM PREFERENCES (THEME, LANGUAGE)
    // ----------------------------------------------------
    toggleLanguage() {
        const targetLang = UI.currentLang === 'th' ? 'en' : 'th';
        localStorage.setItem('car_booking_lang', targetLang);
        this.currentLang = targetLang;
        UI.setLanguage(targetLang);
        
        // Re-navigate to update translations in current view context
        this.navigateTo(this.currentView);
    },

    restoreLanguage() {
        const savedLang = localStorage.getItem('car_booking_lang') || 'th';
        this.currentLang = savedLang;
        UI.setLanguage(savedLang);
    },

    toggleTheme() {
        const body = document.body;
        const icon = document.querySelector('#btn-dark-toggle i');
        
        if (body.classList.contains('dark-mode')) {
            body.classList.remove('dark-mode');
            if (icon) {
                icon.className = 'fa-solid fa-moon';
            }
            localStorage.setItem('car_booking_theme', 'light');
        } else {
            body.classList.add('dark-mode');
            if (icon) {
                icon.className = 'fa-solid fa-sun';
            }
            localStorage.setItem('car_booking_theme', 'dark');
        }
    },

    restoreTheme() {
        const savedTheme = localStorage.getItem('car_booking_theme') || 'light';
        const body = document.body;
        const icon = document.querySelector('#btn-dark-toggle i');
        
        if (savedTheme === 'dark') {
            body.classList.add('dark-mode');
            if (icon) icon.className = 'fa-solid fa-sun';
        } else {
            body.classList.remove('dark-mode');
            if (icon) icon.className = 'fa-solid fa-moon';
        }
    },

    logout() {
        sessionStorage.removeItem('car_booking_user');
        this.currentUser = null;
        
        // Force view back to auth forms
        document.getElementById('app-shell').style.display = 'none';
        document.getElementById('view-auth').style.display = 'flex';
        
        // Reset inputs
        document.getElementById('form-login').reset();
        document.getElementById('form-register').reset();
    },

    // ----------------------------------------------------
    // BIND EVENT LISTENERS (DOM & CUSTOM)
    // ----------------------------------------------------
    bindEvents() {
        // Tab switching in Auth panel
        document.getElementById('tab-login').addEventListener('click', () => {
            document.getElementById('tab-login').classList.add('active');
            document.getElementById('tab-register').classList.remove('active');
            document.getElementById('form-login').classList.add('active');
            document.getElementById('form-register').classList.remove('active');
        });

        document.getElementById('tab-register').addEventListener('click', () => {
            document.getElementById('tab-register').classList.add('active');
            document.getElementById('tab-login').classList.remove('active');
            document.getElementById('form-register').classList.add('active');
            document.getElementById('form-login').classList.remove('active');
        });

        // Forms Submissions
        document.getElementById('form-login').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const pass = document.getElementById('login-password').value;
            this.submitLogin(email, pass);
        });

        document.getElementById('form-register').addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('reg-name').value;
            const phone = document.getElementById('reg-phone').value;
            const email = document.getElementById('reg-email').value;
            const role = document.getElementById('reg-role').value;
            const pass = document.getElementById('reg-password').value;
            this.submitRegister(name, email, phone, role, pass);
        });

        document.getElementById('form-booking').addEventListener('submit', (e) => {
            e.preventDefault();
            const vehicleId = document.getElementById('booking-vehicle-id').value;
            const start = document.getElementById('booking-start').value;
            const end = document.getElementById('booking-end').value;
            const reason = document.getElementById('booking-reason').value;
            this.submitBooking(vehicleId, start, end, reason);
        });

        document.getElementById('form-vehicle').addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('vehicle-form-id').value;
            const name = document.getElementById('vehicle-name').value;
            const nameEn = document.getElementById('vehicle-name-en').value;
            const type = document.getElementById('vehicle-type').value;
            const plate = document.getElementById('vehicle-plate').value;
            const seats = document.getElementById('vehicle-seats').value;
            const fuel = document.getElementById('vehicle-fuel').value;
            const status = document.getElementById('vehicle-status').value;
            this.submitVehicleForm(id, name, nameEn, type, plate, seats, fuel, status);
        });

        // Back to landing from auth view
        document.getElementById('btn-back-to-landing').addEventListener('click', () => this.goBackToLanding());

        // Theme and lang buttons
        document.getElementById('btn-dark-toggle').addEventListener('click', () => this.toggleTheme());
        document.getElementById('btn-lang-toggle').addEventListener('click', () => this.toggleLanguage());
        document.getElementById('btn-logout').addEventListener('click', () => this.logout());

        // Modals cancellation buttons
        document.getElementById('btn-close-booking-modal').addEventListener('click', () => this.closeBookingModal());
        document.getElementById('btn-cancel-booking').addEventListener('click', () => this.closeBookingModal());

        document.getElementById('btn-close-vehicle-modal').addEventListener('click', () => this.closeVehicleModal());
        document.getElementById('btn-cancel-vehicle').addEventListener('click', () => this.closeVehicleModal());
        document.getElementById('btn-add-vehicle').addEventListener('click', () => this.openVehicleModal());

        document.getElementById('btn-close-confirm-modal').addEventListener('click', () => this.closeConfirmModal());
        document.getElementById('btn-cancel-confirm').addEventListener('click', () => this.closeConfirmModal());
        document.getElementById('btn-action-confirm').addEventListener('click', () => {
            if (this.confirmActionCallback) this.confirmActionCallback();
        });

        // Notification center dropdown
        const bellBtn = document.getElementById('btn-notif-bell');
        const notifDropdown = document.getElementById('dropdown-notifications');
        
        bellBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            notifDropdown.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (notifDropdown.classList.contains('active') && !notifDropdown.contains(e.target)) {
                notifDropdown.classList.remove('active');
            }
        });

        document.getElementById('btn-clear-notif').addEventListener('click', (e) => {
            e.stopPropagation();
            this.markAllNotificationsAsRead();
        });

        // Search & filter event bindings (explorer grid)
        const searchInput = document.getElementById('search-vehicle-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.activeFilters.search = e.target.value;
                this.refreshExplorerVehicles();
            });
        }

        const filterGroup = document.getElementById('vehicle-type-filters');
        if (filterGroup) {
            filterGroup.querySelectorAll('.filter-chip').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    filterGroup.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
                    btn.classList.add('active');
                    this.activeFilters.type = btn.getAttribute('data-type');
                    this.refreshExplorerVehicles();
                });
            });
        }

        // Mobile drawer slide handler
        document.getElementById('btn-menu-toggle').addEventListener('click', (e) => {
            e.stopPropagation();
            const sidebar = document.getElementById('sidebar-nav');
            const overlay = document.getElementById('sidebar-overlay');
            sidebar.classList.toggle('open');
            if (overlay) overlay.classList.toggle('active', sidebar.classList.contains('open'));
        });

        // Close sidebar when overlay is clicked (mobile)
        const sidebarOverlay = document.getElementById('sidebar-overlay');
        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', () => {
                document.getElementById('sidebar-nav').classList.remove('open');
                sidebarOverlay.classList.remove('active');
            });
        }

        document.addEventListener('click', (e) => {
            const sidebar = document.getElementById('sidebar-nav');
            const overlay = document.getElementById('sidebar-overlay');
            if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && !e.target.closest('#btn-menu-toggle')) {
                sidebar.classList.remove('open');
                if (overlay) overlay.classList.remove('active');
            }
        });

        // Dynamic Real-time custom event triggers (FR-05)
        window.addEventListener('notification-received', (e) => {
            this.refreshNotifications();
            // Trigger toast alert for current user if it belongs to them
            const notif = e.detail;
            if (this.currentUser && notif.userId === this.currentUser.id) {
                const titleKey = this.currentLang === 'th' ? 'การแจ้งเตือนใหม่' : 'New Notification';
                const msg = this.currentLang === 'th' ? notif.messageTh : notif.messageEn;
                UI.showToast(titleKey, msg, 'info', true);
            }
        });
    }
};

// Bind to window for access
window.app = AppController;

// Start app on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    AppController.init();
});
