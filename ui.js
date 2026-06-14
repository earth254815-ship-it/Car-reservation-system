/**
 * ui.js - User Interface Rendering & Bilingual Engine (NFR-03 & NFR-04)
 */

// 1. Translation Dictionary
const TRANSLATIONS = {
    th: {
        app_title: 'ระบบจองรถยนต์มหาวิทยาลัย',
        auth_subtitle: 'ระบบจัดการการจองยานพาหนะส่วนกลาง',
        btn_login_tab: 'เข้าสู่ระบบ',
        btn_register_tab: 'สมัครสมาชิก',
        label_email: 'อีเมลผู้ใช้งาน',
        label_password: 'รหัสผ่าน',
        label_fullname: 'ชื่อ-นามสกุล',
        label_phone: 'เบอร์โทรศัพท์',
        label_role: 'สิทธิ์การเข้าใช้งาน',
        role_student: 'นิสิต (Student)',
        role_staff: 'อาจารย์ / บุคลากร (Lecturer/Staff)',
        btn_login: 'เข้าสู่ระบบ',
        btn_register: 'สมัครสมาชิก',
        demo_accounts_hint: 'บัญชีทดสอบ: admin@carbooking.com / student@carbooking.com / staff@carbooking.com (รหัสผ่าน: admin123 / student123 / staff123)',
        
        menu_find_car: 'ค้นหารถและจอง',
        menu_my_bookings: 'ประวัติการจอง',
        menu_admin_dashboard: 'อนุมัติการจอง',
        menu_admin_vehicles: 'จัดการรถยนต์',
        menu_admin_reports: 'รายงานและสถิติ',
        btn_logout: 'ออกจากระบบ',
        
        notif_header: 'การแจ้งเตือน',
        notif_clear: 'อ่านทั้งหมด',
        notif_empty: 'ไม่มีการแจ้งเตือนใหม่',
        placeholder_search: 'ค้นหายานพาหนะด้วยชื่อรุ่นหรือเลขทะเบียน...',
        
        filter_all: 'ทั้งหมด',
        filter_sedan: 'เก๋ง (Sedan)',
        filter_suv: 'อเนกประสงค์ (SUV)',
        filter_van: 'ตู้ (Van)',
        filter_ev: 'ไฟฟ้า (EV)',
        
        header_vehicle_list: 'ยานพาหนะทั้งหมดที่พร้อมบริการ',
        header_booking_history: 'ประวัติการจองรถของฉัน',
        
        th_car: 'ยานพาหนะ',
        th_start: 'วันเวลาเริ่มใช้',
        th_end: 'วันเวลาสิ้นสุด',
        th_reason: 'จุดประสงค์การใช้งาน',
        th_status: 'สถานะ',
        th_actions: 'การดำเนินงาน',
        th_user: 'ผู้ขอจอง / บทบาท',
        th_car_info: 'ข้อมูลรถยนต์',
        th_type: 'ประเภท',
        th_plate: 'เลขทะเบียน',
        th_seats: 'จำนวนที่นั่ง',
        th_fuel: 'ประเภทเชื้อเพลิง',
        th_rank: 'อันดับ',
        
        stat_total_bookings: 'การจองทั้งหมด',
        stat_pending_bookings: 'รอการอนุมัติ',
        stat_active_cars: 'จำนวนรถในระบบ',
        stat_users: 'ผู้ใช้งานในระบบ',
        
        header_pending_list: 'คำขอจองรถยนต์รอการพิจารณา',
        header_vehicle_management: 'จัดการข้อมูลยานพาหนะในระบบ',
        btn_add_car: 'เพิ่มรถใหม่',
        header_reports: 'รายงานสรุปข้อมูลสถิติการใช้งานรถยนต์',
        btn_print: 'พิมพ์รายงาน',
        
        report_by_type: 'สัดส่วนการจองแบ่งตามประเภทรถ',
        report_by_status: 'สัดส่วนตามสถานะการจอง',
        report_table_title: 'ความนิยมของการใช้งานยานพาหนะ (จำนวนครั้งที่ถูกจอง)',
        report_th_count: 'จำนวนการจอง (ครั้ง)',
        report_th_progress: 'สัดส่วนความนิยม',
        
        modal_booking_title: 'ทำการจองยานพาหนะ',
        booking_label_start: 'วันและเวลาที่เริ่มจองใช้งาน',
        booking_label_end: 'วันและเวลาที่สิ้นสุดการใช้งาน',
        booking_label_reason: 'วัตถุประสงค์ในการจอง / แผนงานเดินทาง',
        btn_cancel: 'ยกเลิก',
        btn_confirm_booking: 'ยืนยันการจอง',
        
        modal_vehicle_add_title: 'เพิ่มข้อมูลยานพาหนะ',
        modal_vehicle_edit_title: 'แก้ไขข้อมูลยานพาหนะ',
        vehicle_label_name: 'ชื่อรุ่นยี่ห้อ (ภาษาไทย)',
        vehicle_label_name_en: 'ชื่อรุ่นยี่ห้อ (ภาษาอังกฤษ)',
        vehicle_label_type: 'ประเภทรถยนต์',
        vehicle_label_plate: 'เลขทะเบียนรถ',
        vehicle_label_seats: 'จำนวนที่นั่ง',
        vehicle_label_fuel: 'ประเภทพลังงาน',
        vehicle_label_status: 'สถานะเบื้องต้นของรถ',
        vehicle_status_available: 'พร้อมใช้งาน (Available)',
        vehicle_status_maintenance: 'ส่งซ่อมบำรุง (Maintenance)',
        btn_save: 'บันทึกข้อมูล',
        
        confirm_title: 'ยืนยันการดำเนินการ',
        btn_yes: 'ใช่, ยืนยัน',
        btn_no: 'ไม่ใช่',
        
        fuel_gasoline: 'เบนซิน (Gasoline)',
        fuel_diesel: 'ดีเซล (Diesel)',
        fuel_hybrid: 'ไฮบริด (Hybrid)',
        fuel_electric: 'ไฟฟ้า 100% (EV)',
        
        seats_unit: 'ที่นั่ง',
        status_available: 'ว่าง',
        status_booked: 'ถูกจองใช้งาน',
        status_maintenance: 'ซ่อมบำรุง',
        
        status_pending: 'รออนุมัติ',
        status_approved: 'อนุมัติแล้ว',
        status_cancelled: 'ยกเลิก',
        
        btn_book_now: 'จองรถคันนี้',
        btn_edit: 'แก้ไข',
        btn_delete: 'ลบ',
        btn_approve: 'อนุมัติ',
        btn_reject: 'ไม่อนุมัติ/ยกเลิก',
        
        err_collision: 'รถคันนี้มีผู้จองแล้วในช่วงเวลาที่คุณเลือก',
        success_booking: 'จองรถสำเร็จเรียบร้อยแล้ว!',
        success_status_update: 'อัปเดตสถานะการจองแล้ว',
        success_vehicle_create: 'เพิ่มข้อมูลรถสำเร็จแล้ว',
        success_vehicle_update: 'แก้ไขข้อมูลรถสำเร็จแล้ว',
        success_vehicle_delete: 'ลบข้อมูลรถยนต์เรียบร้อยแล้ว',
        
        btn_back_home: 'ย้อนกลับหน้าแรก',
        menu_driver_schedule: 'งานขับรถยนต์',
        header_driver_schedule: 'ตารางงานขับรถยนต์ของฉัน',
        driver_no_jobs: 'ไม่มีงานขับรถในตารางเวลาของคุณ'
    },
    en: {
        app_title: 'University Car Booking System',
        auth_subtitle: 'Centralized Vehicle Management System',
        btn_login_tab: 'Login',
        btn_register_tab: 'Register',
        label_email: 'Username / Email',
        label_password: 'Password',
        label_fullname: 'Full Name',
        label_phone: 'Phone Number',
        label_role: 'System Access Role',
        role_student: 'Student',
        role_staff: 'Lecturer / Staff',
        btn_login: 'Login',
        btn_register: 'Register',
        demo_accounts_hint: 'Demo accounts: admin@carbooking.com / student@carbooking.com / staff@carbooking.com (passwords: admin123 / student123 / staff123)',
        
        menu_find_car: 'Search & Book',
        menu_my_bookings: 'My Bookings',
        menu_admin_dashboard: 'Booking Approvals',
        menu_admin_vehicles: 'Manage Vehicles',
        menu_admin_reports: 'Reports & Stats',
        btn_logout: 'Logout',
        
        notif_header: 'Notifications',
        notif_clear: 'Mark all read',
        notif_empty: 'No new notifications',
        placeholder_search: 'Search vehicle models or license plates...',
        
        filter_all: 'All Vehicles',
        filter_sedan: 'Sedan',
        filter_suv: 'SUV',
        filter_van: 'Van',
        filter_ev: 'EV',
        
        header_vehicle_list: 'All Available Vehicles',
        header_booking_history: 'My Booking History',
        
        th_car: 'Vehicle',
        th_start: 'Start Date/Time',
        th_end: 'End Date/Time',
        th_reason: 'Booking Purpose',
        th_status: 'Status',
        th_actions: 'Actions',
        th_user: 'Requester / Role',
        th_car_info: 'Vehicle Details',
        th_type: 'Type',
        th_plate: 'License Plate',
        th_seats: 'Seats',
        th_fuel: 'Fuel Type',
        th_rank: 'Rank',
        
        stat_total_bookings: 'Total Bookings',
        stat_pending_bookings: 'Pending Approvals',
        stat_active_cars: 'Total Vehicles',
        stat_users: 'Registered Users',
        
        header_pending_list: 'Booking Requests Pending Approval',
        header_vehicle_management: 'Manage Vehicles Database',
        btn_add_car: 'Add New Vehicle',
        header_reports: 'Vehicle Booking Statistics & Reports',
        btn_print: 'Print Report',
        
        report_by_type: 'Bookings by Vehicle Type',
        report_by_status: 'Bookings by Request Status',
        report_table_title: 'Vehicle Popularity (Number of bookings)',
        report_th_count: 'Bookings Count',
        report_th_progress: 'Usage Proportion',
        
        modal_booking_title: 'Book a Vehicle',
        booking_label_start: 'Usage Start Date & Time',
        booking_label_end: 'Usage End Date & Time',
        booking_label_reason: 'Purpose of Booking / Travel Itinerary',
        btn_cancel: 'Cancel',
        btn_confirm_booking: 'Confirm Booking',
        
        modal_vehicle_add_title: 'Add New Vehicle',
        modal_vehicle_edit_title: 'Edit Vehicle Details',
        vehicle_label_name: 'Model Brand (Thai)',
        vehicle_label_name_en: 'Model Brand (English)',
        vehicle_label_type: 'Vehicle Category',
        vehicle_label_plate: 'License Plate',
        vehicle_label_seats: 'Seating Capacity',
        vehicle_label_fuel: 'Energy Source',
        vehicle_label_status: 'Initial Car Status',
        vehicle_status_available: 'Available',
        vehicle_status_maintenance: 'Maintenance',
        btn_save: 'Save Changes',
        
        confirm_title: 'Confirm Operation',
        btn_yes: 'Yes, Confirm',
        btn_no: 'No',
        
        fuel_gasoline: 'Gasoline',
        fuel_diesel: 'Diesel',
        fuel_hybrid: 'Hybrid',
        fuel_electric: 'Electric (100% EV)',
        
        seats_unit: 'seats',
        status_available: 'Available',
        status_booked: 'Booked',
        status_maintenance: 'Maintenance',
        
        status_pending: 'Pending',
        status_approved: 'Approved',
        status_cancelled: 'Cancelled',
        
        btn_book_now: 'Book Vehicle',
        btn_edit: 'Edit',
        btn_delete: 'Delete',
        btn_approve: 'Approve',
        btn_reject: 'Reject/Cancel',
        
        err_collision: 'This vehicle is already booked during your selected time.',
        success_booking: 'Car booked successfully!',
        success_status_update: 'Booking status updated successfully.',
        success_vehicle_create: 'Vehicle added successfully',
        success_vehicle_update: 'Vehicle details updated successfully',
        success_vehicle_delete: 'Vehicle removed successfully',
        
        btn_back_home: 'Back to Home',
        menu_driver_schedule: 'Driving Jobs',
        header_driver_schedule: 'My Driving Assignments',
        driver_no_jobs: 'No driving jobs in your schedule'
    }
};

const UI = {
    currentLang: 'th',

    // Toggle and Apply Languages
    setLanguage(lang) {
        this.currentLang = lang;
        document.documentElement.lang = lang;
        
        // Update language label in nav
        const label = document.getElementById('lang-label');
        if (label) label.innerText = lang === 'th' ? 'EN' : 'TH';

        // Apply translations to all DOM elements marked with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
                // Check if element is an input tag with placeholder
                if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
                    el.placeholder = TRANSLATIONS[lang][key];
                } else {
                    el.innerText = TRANSLATIONS[lang][key];
                }
            }
        });
    },

    translate(key) {
        return TRANSLATIONS[this.currentLang][key] || key;
    },

    // ----------------------------------------------------
    // LOADING & TOAST CONTROLS
    // ----------------------------------------------------
    showLoading(show = true) {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            if (show) overlay.classList.add('active');
            else overlay.classList.remove('active');
        }
    },

    showToast(titleKey, messageKey, type = 'info', isLiteral = false) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const iconMap = {
            success: 'fa-circle-check',
            error: 'fa-circle-exclamation',
            warning: 'fa-triangle-exclamation',
            info: 'fa-circle-info'
        };

        const title = isLiteral ? titleKey : this.translate(titleKey);
        const message = isLiteral ? messageKey : this.translate(messageKey);

        toast.innerHTML = `
            <i class="fa-solid ${iconMap[type] || 'fa-circle-info'}" style="font-size: 1.1rem; margin-top: 2px;"></i>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <span class="toast-close">&times;</span>
        `;

        container.appendChild(toast);

        // Auto remove toast after 4s
        const autoRemove = setTimeout(() => {
            toast.style.animation = 'toastSlideIn 0.3s ease-out reverse';
            setTimeout(() => toast.remove(), 300);
        }, 4000);

        // Click close toast
        toast.querySelector('.toast-close').addEventListener('click', () => {
            clearTimeout(autoRemove);
            toast.remove();
        });
    },

    // ----------------------------------------------------
    // VEHICLE EXPLORER GRID (USER/STAFF VIEW) (FR-03)
    // ----------------------------------------------------
    renderVehiclesGrid(vehicles, currentUserId) {
        const grid = document.getElementById('explorer-vehicles-grid');
        if (!grid) return;

        if (vehicles.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
                    <i class="fa-solid fa-car-tunnel" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p>${this.translate('notif_empty')}</p>
                </div>`;
            return;
        }

        grid.innerHTML = vehicles.map(v => {
            const statusClass = `badge-${v.status}`;
            const statusLabel = this.translate(`status_${v.status}`);
            const fuelLabel = this.translate(`fuel_${v.fuelType}`);
            const vehicleName = this.currentLang === 'th' ? v.name : v.nameEn;
            
            // Check buttons states
            const isMaintenance = v.status === 'maintenance';
            const buttonHtml = isMaintenance
                ? `<button class="btn btn-secondary btn-sm" disabled style="width: 100%;"><i class="fa-solid fa-wrench"></i> ${this.translate('status_maintenance')}</button>`
                : `<button class="btn btn-primary btn-sm" style="width: 100%;" onclick="app.openBookingModal('${v.id}')"><i class="fa-solid fa-calendar-days"></i> ${this.translate('btn_book_now')}</button>`;

            return `
                <div class="car-card">
                    <div class="car-image-container">
                        <img src="${v.imageUrl}" alt="${vehicleName}">
                        <span class="car-status-badge ${statusClass}">${statusLabel}</span>
                    </div>
                    <div class="car-details-panel">
                        <span class="car-type-badge">${this.translate(`filter_${v.type}`)}</span>
                        <h4 class="car-title">${vehicleName}</h4>
                        <div class="car-specs">
                            <div class="spec-item"><i class="fa-solid fa-users"></i> <span>${v.seats} ${this.translate('seats_unit')}</span></div>
                            <div class="spec-item"><i class="fa-solid fa-gas-pump"></i> <span>${fuelLabel}</span></div>
                        </div>
                        <div class="car-footer">
                            <span class="car-plate"><i class="fa-solid fa-address-card"></i> ${v.plate}</span>
                        </div>
                        <div style="margin-top: 10px;">
                            ${buttonHtml}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    // ----------------------------------------------------
    // PERSONAL BOOKING LIST (FR-04)
    // ----------------------------------------------------
    renderStudentBookings(bookings) {
        const tbody = document.getElementById('student-bookings-table-body');
        if (!tbody) return;

        if (bookings.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2.5rem;">
                        <i class="fa-solid fa-calendar-xmark" style="font-size: 2rem; margin-bottom: 8px; display: block; opacity: 0.5;"></i>
                        ไม่มีประวัติการจองรถยนต์ในระบบ / No bookings record found
                    </td>
                </tr>`;
            return;
        }

        tbody.innerHTML = bookings.map(b => {
            const vehicleName = this.currentLang === 'th' ? b.vehicleName : (b.vehicleNameEn || b.vehicleName);
            const statusClass = `status-${b.status}`;
            const statusLabel = this.translate(`status_${b.status}`);
            
            // Format Dates beautifully
            const startStr = new Date(b.startDate).toLocaleString(this.currentLang === 'th' ? 'th-TH' : 'en-US', { dateStyle: 'short', timeStyle: 'short' });
            const endStr = new Date(b.endDate).toLocaleString(this.currentLang === 'th' ? 'th-TH' : 'en-US', { dateStyle: 'short', timeStyle: 'short' });
            
            // Render Cancel action only for 'pending' or 'approved' bookings in the future
            const isCancelable = (b.status === 'pending' || b.status === 'approved') && new Date(b.endDate) > new Date();
            const actionHtml = isCancelable
                ? `<button class="btn btn-danger btn-sm" onclick="app.cancelBookingRequest('${b.id}')"><i class="fa-solid fa-xmark"></i> ${this.translate('btn_cancel')}</button>`
                : `<span style="color: var(--text-muted); font-size: 0.8rem;">-</span>`;

            return `
                <tr>
                    <td data-label="${this.translate('th_car')}">
                        <strong style="display: block; font-size: 0.95rem;">${vehicleName}</strong>
                    </td>
                    <td data-label="${this.translate('th_start')}">${startStr}</td>
                    <td data-label="${this.translate('th_end')}">${endStr}</td>
                    <td data-label="${this.translate('th_reason')}"><span style="font-size: 0.85rem; max-width: 200px; display: inline-block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${b.reason}">${b.reason}</span></td>
                    <td data-label="${this.translate('th_status')}">
                        <span class="status-pill ${statusClass}">${statusLabel}</span>
                    </td>
                    <td data-label="${this.translate('th_actions')}">${actionHtml}</td>
                </tr>
            `;
        }).join('');
    },

    // ----------------------------------------------------
    // ADMIN DASHBOARD (APPROVAL QUEUE) (FR-04)
    // ----------------------------------------------------
    renderAdminDashboard(bookings, stats) {
        // Update stats values in UI
        const fields = {
            'admin-stat-total-bookings': stats.totalBookings,
            'admin-stat-pending-bookings': stats.pendingApprovals,
            'admin-stat-total-vehicles': stats.totalVehicles,
            'admin-stat-total-users': stats.totalUsers
        };

        for (const [id, val] of Object.entries(fields)) {
            const el = document.getElementById(id);
            if (el) el.innerText = val;
        }

        const tbody = document.getElementById('admin-pending-bookings-table-body');
        if (!tbody) return;

        const pendingBookings = bookings.filter(b => b.status === 'pending');

        if (pendingBookings.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2.5rem;">
                        <i class="fa-solid fa-clipboard-check" style="font-size: 2rem; margin-bottom: 8px; display: block; opacity: 0.5;"></i>
                        ไม่มีคำขอจองที่รอการอนุมัติ / No booking requests pending approval
                    </td>
                </tr>`;
            return;
        }

        tbody.innerHTML = pendingBookings.map(b => {
            const vehicleName = this.currentLang === 'th' ? b.vehicleName : (b.vehicleNameEn || b.vehicleName);
            const roleLabel = this.translate(`role_${b.userRole}`);
            
            const startStr = new Date(b.startDate).toLocaleString(this.currentLang === 'th' ? 'th-TH' : 'en-US', { dateStyle: 'short', timeStyle: 'short' });
            const endStr = new Date(b.endDate).toLocaleString(this.currentLang === 'th' ? 'th-TH' : 'en-US', { dateStyle: 'short', timeStyle: 'short' });

            return `
                <tr>
                    <td data-label="${this.translate('th_user')}">
                        <strong>${b.userName}</strong>
                        <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">${roleLabel}</div>
                    </td>
                    <td data-label="${this.translate('th_car')}">
                        <strong>${vehicleName}</strong>
                    </td>
                    <td data-label="${this.translate('th_start')}">${startStr}</td>
                    <td data-label="${this.translate('th_end')}">${endStr}</td>
                    <td data-label="${this.translate('th_reason')}"><span style="font-size: 0.85rem;" title="${b.reason}">${b.reason}</span></td>
                    <td data-label="${this.translate('th_actions')}">
                        <div style="display: flex; gap: 6px;">
                            <button class="btn btn-primary btn-sm" onclick="app.adminSetBookingStatus('${b.id}', 'approved')" style="background-color: var(--success);"><i class="fa-solid fa-check"></i> ${this.translate('btn_approve')}</button>
                            <button class="btn btn-danger btn-sm" onclick="app.adminSetBookingStatus('${b.id}', 'cancelled')"><i class="fa-solid fa-xmark"></i> ${this.translate('btn_reject')}</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    },

    // ----------------------------------------------------
    // ADMIN VEHICLE CRUD (FR-02)
    // ----------------------------------------------------
    renderAdminVehicles(vehicles) {
        const tbody = document.getElementById('admin-vehicles-table-body');
        if (!tbody) return;

        if (vehicles.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2.5rem;">
                        ไม่มีข้อมูลรถยนต์ในฐานข้อมูล / No vehicle records in database
                    </td>
                </tr>`;
            return;
        }

        tbody.innerHTML = vehicles.map(v => {
            const vehicleName = this.currentLang === 'th' ? v.name : v.nameEn;
            const statusClass = `badge-${v.status}`;
            const statusLabel = this.translate(`status_${v.status}`);
            const typeLabel = this.translate(`filter_${v.type}`);
            const fuelLabel = this.translate(`fuel_${v.fuelType}`);

            return `
                <tr>
                    <td data-label="${this.translate('th_car_info')}" style="display: flex; align-items: center; gap: 10px;">
                        <img src="${v.imageUrl}" style="width: 40px; height: 30px; object-fit: contain; background: #e2e8f0; border-radius: 4px;">
                        <strong>${vehicleName}</strong>
                    </td>
                    <td data-label="${this.translate('th_type')}">${typeLabel}</td>
                    <td data-label="${this.translate('th_plate')}"><code>${v.plate}</code></td>
                    <td data-label="${this.translate('th_seats')}">${v.seats}</td>
                    <td data-label="${this.translate('th_fuel')}">${fuelLabel}</td>
                    <td data-label="${this.translate('th_status')}">
                        <span class="car-status-badge ${statusClass}" style="position: static; font-size: 0.7rem;">${statusLabel}</span>
                    </td>
                    <td data-label="${this.translate('th_actions')}">
                        <div style="display: flex; gap: 6px;">
                            <button class="btn btn-secondary btn-sm" onclick="app.openVehicleModal('${v.id}')"><i class="fa-solid fa-edit"></i> ${this.translate('btn_edit')}</button>
                            <button class="btn btn-danger btn-sm" onclick="app.deleteVehicleRequest('${v.id}')"><i class="fa-solid fa-trash"></i> ${this.translate('btn_delete')}</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    },

    // ----------------------------------------------------
    // NOTIFICATIONS BAR & BELL SYSTEM (FR-05)
    // ----------------------------------------------------
    renderNotifications(notifications) {
        const list = document.getElementById('notif-dropdown-list');
        const badge = document.getElementById('notif-count-badge');
        if (!list) return;

        const unreadCount = notifications.filter(n => !n.read).length;

        // Badge update
        if (badge) {
            if (unreadCount > 0) {
                badge.innerText = unreadCount;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        }

        if (notifications.length === 0) {
            list.innerHTML = `<div class="notif-empty">${this.translate('notif_empty')}</div>`;
            return;
        }

        list.innerHTML = notifications.map(n => {
            const unreadClass = n.read ? '' : 'unread';
            const msg = this.currentLang === 'th' ? n.messageTh : n.messageEn;
            const timeStr = new Date(n.createdAt).toLocaleTimeString(this.currentLang === 'th' ? 'th-TH' : 'en-US', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date(n.createdAt).toLocaleDateString(this.currentLang === 'th' ? 'th-TH' : 'en-US', { dateStyle: 'short' });

            return `
                <li class="notif-item ${unreadClass}" onclick="app.markAllNotificationsAsRead()">
                    <div>${msg}</div>
                    <span class="notif-time">${timeStr}</span>
                </li>
            `;
        }).join('');
    },

    // ----------------------------------------------------
    // REPORTS RENDERING & NATIVE VISUAL GRAPHS (FR-06)
    // ----------------------------------------------------
    renderReportsView(stats) {
        // 1. Render Bar Chart: Bookings by Vehicle Type
        const chartType = document.getElementById('chart-by-type');
        if (chartType) {
            const types = ['sedan', 'suv', 'van', 'ev'];
            const labels = {
                sedan: this.translate('filter_sedan'),
                suv: this.translate('filter_suv'),
                van: this.translate('filter_van'),
                ev: this.translate('filter_ev')
            };

            const counts = types.map(t => stats.typeBookings[t] || 0);
            const maxVal = Math.max(...counts, 1);

            chartType.innerHTML = types.map((t, idx) => {
                const heightPercent = (counts[idx] / maxVal) * 85; // cap height at 85%
                return `
                    <div class="chart-bar-item">
                        <div class="chart-bar-pillar" style="height: ${heightPercent}%;">
                            <span class="chart-bar-value">${counts[idx]}</span>
                        </div>
                        <span class="chart-bar-label">${labels[t]}</span>
                    </div>
                `;
            }).join('');
        }

        // 2. Render Donut Chart: Booking Statuses
        const statusMap = {
            pending: stats.statusBookings.pending || 0,
            approved: stats.statusBookings.approved || 0,
            cancelled: stats.statusBookings.cancelled || 0
        };

        const container = document.getElementById('chart-by-status-container');
        if (container) {
            const total = statusMap.pending + statusMap.approved + statusMap.cancelled;
            if (total === 0) {
                container.innerHTML = `<p style="color: var(--text-muted); font-size: 0.85rem;">ไม่มีข้อมูลการจองเพียงพอเพื่อวิเคราะห์</p>`;
            } else {
                const radius = 35;
                const circ = 2 * Math.PI * radius;
                let strokeOffset = 0;

                // Color schemes
                const colors = {
                    approved: '#10b981', // emerald
                    pending: '#f59e0b',  // amber
                    cancelled: '#ef4444' // rose
                };

                const segments = Object.entries(statusMap).map(([key, val]) => {
                    const length = (val / total) * circ;
                    const offset = circ - length + strokeOffset;
                    strokeOffset -= length;
                    return { key, val, length, offset, color: colors[key] };
                });

                let svgHtml = `
                    <svg class="donut-svg" width="120" height="120" viewBox="0 0 100 100">
                `;

                segments.forEach(seg => {
                    if (seg.val === 0) return;
                    svgHtml += `
                        <circle cx="50" cy="50" r="${radius}" 
                            fill="transparent" 
                            stroke="${seg.color}" 
                            stroke-width="10" 
                            stroke-dasharray="${circ}" 
                            stroke-dashoffset="${seg.offset}" 
                            stroke-linecap="round" />
                    `;
                });

                svgHtml += `
                        <circle cx="50" cy="50" r="28" fill="var(--bg-card)" />
                        <text x="50" y="47" font-size="12" font-weight="bold" fill="var(--text-primary)" text-anchor="middle" dominant-baseline="middle">${total}</text>
                        <text x="50" y="58" font-size="6" fill="var(--text-muted)" text-anchor="middle" dominant-baseline="middle">TOTAL</text>
                    </svg>
                `;

                let legendHtml = `<div class="donut-legend">`;
                segments.forEach(seg => {
                    const label = this.translate(`status_${seg.key}`);
                    const percent = Math.round((seg.val / total) * 100);
                    legendHtml += `
                        <div class="legend-item">
                            <div class="legend-color" style="background-color: ${seg.color}"></div>
                            <span>${label}: <strong>${seg.val}</strong> (${percent}%)</span>
                        </div>
                    `;
                });
                legendHtml += `</div>`;

                container.innerHTML = svgHtml + legendHtml;
            }
        }

        // 3. Render Vehicle Popularity Table
        const tbody = document.getElementById('admin-reports-table-body');
        if (tbody) {
            if (stats.vehicleStatsList.length === 0) {
                tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color: var(--text-muted);">ไม่มีข้อมูลสถิติยานพาหนะ</td></tr>`;
                return;
            }

            const maxBookings = Math.max(...stats.vehicleStatsList.map(v => v.count), 1);

            tbody.innerHTML = stats.vehicleStatsList.map((v, idx) => {
                const ratioPercent = (v.count / maxBookings) * 100;
                return `
                    <tr>
                        <td data-label="${this.translate('th_rank')}"><strong>${idx + 1}</strong></td>
                        <td data-label="${this.translate('th_car')}">${v.name}</td>
                        <td data-label="${this.translate('th_plate')}"><code>${v.plate}</code></td>
                        <td data-label="${this.translate('report_th_count')}"><strong>${v.count}</strong></td>
                        <td data-label="${this.translate('report_th_progress')}">
                            <div style="width: 100%; height: 8px; background-color: var(--border-color); border-radius: 4px; overflow: hidden; max-width: 200px;">
                                <div style="height: 100%; width: ${ratioPercent}%; background: linear-gradient(to right, var(--primary), var(--secondary)); border-radius: 4px;"></div>
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');
        }
    },

    // ----------------------------------------------------
    // DRIVER DASHBOARD (TRIPS ASSIGNMENTS)
    // ----------------------------------------------------
    renderDriverSchedule(bookings) {
        const container = document.getElementById('driver-trips-container');
        if (!container) return;

        if (bookings.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
                    <i class="fa-solid fa-route" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p>${this.translate('driver_no_jobs')}</p>
                </div>`;
            return;
        }

        container.innerHTML = bookings.map(b => {
            const vehicleName = this.currentLang === 'th' ? b.vehicleName : (b.vehicleNameEn || b.vehicleName);
            const startStr = new Date(b.startDate).toLocaleString(this.currentLang === 'th' ? 'th-TH' : 'en-US', { dateStyle: 'long', timeStyle: 'short' });
            const endStr = new Date(b.endDate).toLocaleString(this.currentLang === 'th' ? 'th-TH' : 'en-US', { dateStyle: 'long', timeStyle: 'short' });
            
            return `
                <div class="driver-trip-card">
                    <div class="trip-header">
                        <span class="trip-car-name"><i class="fa-solid fa-car"></i> ${vehicleName}</span>
                        <span class="status-pill status-approved">${this.translate('status_approved')}</span>
                    </div>
                    <div class="trip-time-row">
                        <div><strong><i class="fa-solid fa-circle-play" style="color: var(--success);"></i> ${this.currentLang === 'th' ? 'เริ่ม:' : 'Start:'}</strong> ${startStr}</div>
                        <div><strong><i class="fa-solid fa-circle-stop" style="color: var(--danger);"></i> ${this.currentLang === 'th' ? 'สิ้นสุด:' : 'End:'}</strong> ${endStr}</div>
                    </div>
                    <div class="trip-meta">
                        <strong><i class="fa-solid fa-user"></i> ${this.currentLang === 'th' ? 'ผู้ขอใช้งาน:' : 'Requester:'}</strong> ${b.userName}
                    </div>
                    <div class="trip-reason">
                        <strong>${this.translate('th_reason')}:</strong> ${b.reason}
                    </div>
                </div>
            `;
        }).join('');
    }
};

window.UI = UI;
window.TRANSLATIONS = TRANSLATIONS;
