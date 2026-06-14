/**
 * db.js - Simulated Local Database Layer using localStorage
 * Handles schemas, initialization, seeding, and security hashing.
 */

// Helper to hash passwords using SHA-256 (NFR-02)
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Inline SVGs for vehicle images to keep the app fully self-contained, offline-capable, and visually stunning.
const CAR_SVGS = {
    sedan: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 16" width="100%" height="100%"><defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%234f46e5" /><stop offset="100%" stop-color="%2306b6d4" /></linearGradient></defs><rect width="24" height="16" fill="%23f1f5f9" rx="2"/><path d="M2 10h20v3H2zm3-4l3-4h8l3 4z" fill="url(%23g1)"/><circle cx="6" cy="12" r="2.5" fill="%231e293b"/><circle cx="18" cy="12" r="2.5" fill="%231e293b"/><circle cx="6" cy="12" r="1" fill="%23ffffff"/><circle cx="18" cy="12" r="1" fill="%23ffffff"/></svg>`,
    suv: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 16" width="100%" height="100%"><defs><linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%233b82f6" /><stop offset="100%" stop-color="%2310b981" /></linearGradient></defs><rect width="24" height="16" fill="%23f1f5f9" rx="2"/><path d="M2 9h20v4H2zM4 5l2-3h11l3 3z" fill="url(%23g2)"/><circle cx="6" cy="12" r="3" fill="%231e293b"/><circle cx="18" cy="12" r="3" fill="%231e293b"/><circle cx="6" cy="12" r="1" fill="%23ffffff"/><circle cx="18" cy="12" r="1" fill="%23ffffff"/></svg>`,
    van: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 16" width="100%" height="100%"><defs><linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23f59e0b" /><stop offset="100%" stop-color="%23ef4444" /></linearGradient></defs><rect width="24" height="16" fill="%23f1f5f9" rx="2"/><path d="M2 8h20v5H2zM3 4h15l2 4H3z" fill="url(%23g3)"/><circle cx="7" cy="12" r="3" fill="%231e293b"/><circle cx="17" cy="12" r="3" fill="%231e293b"/><circle cx="7" cy="12" r="1" fill="%23ffffff"/><circle cx="17" cy="12" r="1" fill="%23ffffff"/></svg>`,
    ev: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 16" width="100%" height="100%"><defs><linearGradient id="g4" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%2310b981" /><stop offset="100%" stop-color="%2306b6d4" /></linearGradient></defs><rect width="24" height="16" fill="%23f1f5f9" rx="2"/><path d="M2 10h20v3H2zm3-4l3-4h8l3 4z" fill="url(%23g4)"/><path d="M11 2v3h2V2z" fill="%23f59e0b"/><circle cx="6" cy="12" r="2.5" fill="%231e293b"/><circle cx="18" cy="12" r="2.5" fill="%231e293b"/><circle cx="6" cy="12" r="1" fill="%23ffffff"/><circle cx="18" cy="12" r="1" fill="%23ffffff"/></svg>`
};

const DB = {
    // Database Storage Keys
    KEYS: {
        USERS: 'car_booking_users',
        VEHICLES: 'car_booking_vehicles',
        BOOKINGS: 'car_booking_bookings',
        NOTIFICATIONS: 'car_booking_notifications',
        INITIALIZED: 'car_booking_initialized'
    },

    // Fetch and Parse LocalStorage Data
    get(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error(`Error reading key ${key} from localStorage:`, e);
            return [];
        }
    },

    // Save Data to LocalStorage
    set(key, val) {
        try {
            localStorage.setItem(key, JSON.stringify(val));
            return true;
        } catch (e) {
            console.error(`Error writing key ${key} to localStorage:`, e);
            return false;
        }
    },

    // Initialize Database with Seed Data if not present
    async init() {
        const initialized = localStorage.getItem(this.KEYS.INITIALIZED);
        const users = this.get(this.KEYS.USERS);
        const hasDriver = users.some(u => u.email === 'driver@carbooking.com');
        if (initialized && hasDriver) {
            console.log('Database already initialized.');
            return;
        }

        console.log('Initializing database with mock seed data...');

        // 1. Seed Users
        const adminPass = await hashPassword('admin123');
        const studentPass = await hashPassword('student123');
        const staffPass = await hashPassword('staff123');
        const driverPass = await hashPassword('driver123');
        const execPass = await hashPassword('exec123');

        const seedUsers = [
            {
                id: 'usr-admin',
                name: 'สมชาย ใจดี (Admin)',
                email: 'admin@carbooking.com',
                phone: '0812345678',
                role: 'admin',
                passwordHash: adminPass
            },
            {
                id: 'usr-student',
                name: 'นิสิต รักเรียน (Student)',
                email: 'student@carbooking.com',
                phone: '0898765432',
                role: 'student',
                passwordHash: studentPass
            },
            {
                id: 'usr-staff',
                name: 'ดร.สมศรี มีสุข (Staff/Lecturer)',
                email: 'staff@carbooking.com',
                phone: '0855554444',
                role: 'staff',
                passwordHash: staffPass
            },
            {
                id: 'usr-driver',
                name: 'สมพร ขยันขับ (Driver)',
                email: 'driver@carbooking.com',
                phone: '0822223333',
                role: 'driver',
                passwordHash: driverPass
            },
            {
                id: 'usr-exec',
                name: 'ศ.ดร.สมเกียรติ ยิ่งใหญ่ (Executive)',
                email: 'exec@carbooking.com',
                phone: '0833334444',
                role: 'executive',
                passwordHash: execPass
            }
        ];
        this.set(this.KEYS.USERS, seedUsers);

        // 2. Seed Vehicles (Cars)
        const seedVehicles = [
            {
                id: 'veh-01',
                name: 'Toyota Camry Hybrid',
                nameEn: 'Toyota Camry Hybrid',
                type: 'sedan',
                plate: 'กข 1234 กรุงเทพฯ',
                seats: 5,
                fuelType: 'hybrid',
                imageUrl: CAR_SVGS.sedan,
                status: 'available' // available, maintenance, booked
            },
            {
                id: 'veh-02',
                name: 'Honda CR-V e:HEV',
                nameEn: 'Honda CR-V e:HEV',
                type: 'suv',
                plate: 'ชฉ 5678 เชียงใหม่',
                seats: 7,
                fuelType: 'hybrid',
                imageUrl: CAR_SVGS.suv,
                status: 'available'
            },
            {
                id: 'veh-03',
                name: 'Toyota Commuter',
                nameEn: 'Toyota Commuter',
                type: 'van',
                plate: 'นร 9999 นนทบุรี',
                seats: 12,
                fuelType: 'diesel',
                imageUrl: CAR_SVGS.van,
                status: 'available'
            },
            {
                id: 'veh-04',
                name: 'BYD Atto 3 (EV)',
                nameEn: 'BYD Atto 3 (EV)',
                type: 'ev',
                plate: 'งจ 4321 ชลบุรี',
                seats: 5,
                fuelType: 'electric',
                imageUrl: CAR_SVGS.ev,
                status: 'available'
            }
        ];
        this.set(this.KEYS.VEHICLES, seedVehicles);

        // 3. Seed Bookings (Previous/Current Bookings)
        const now = new Date();
        
        // Mock a completed booking from last week
        const lastWeekStart = new Date(now);
        lastWeekStart.setDate(now.getDate() - 7);
        lastWeekStart.setHours(9, 0, 0);
        const lastWeekEnd = new Date(lastWeekStart);
        lastWeekEnd.setHours(16, 0, 0);

        // Mock a pending booking for next week
        const nextWeekStart = new Date(now);
        nextWeekStart.setDate(now.getDate() + 3);
        nextWeekStart.setHours(10, 0, 0);
        const nextWeekEnd = new Date(nextWeekStart);
        nextWeekEnd.setHours(15, 0, 0);

        // Mock an approved booking for tomorrow
        const tomorrowStart = new Date(now);
        tomorrowStart.setDate(now.getDate() + 1);
        tomorrowStart.setHours(8, 30, 0);
        const tomorrowEnd = new Date(tomorrowStart);
        tomorrowEnd.setHours(12, 0, 0);

        const seedBookings = [
            {
                id: 'bk-01',
                userId: 'usr-staff',
                userName: 'ดร.สมศรี มีสุข (Staff/Lecturer)',
                vehicleId: 'veh-01',
                vehicleName: 'Toyota Camry Hybrid',
                startDate: lastWeekStart.toISOString(),
                endDate: lastWeekEnd.toISOString(),
                reason: 'ไปราชการสัมมนาวิชาการต่างจังหวัด',
                status: 'approved', // pending, approved, cancelled
                createdAt: lastWeekStart.toISOString()
            },
            {
                id: 'bk-02',
                userId: 'usr-student',
                userName: 'นิสิต รักเรียน (Student)',
                vehicleId: 'veh-04',
                vehicleName: 'BYD Atto 3 (EV)',
                startDate: nextWeekStart.toISOString(),
                endDate: nextWeekEnd.toISOString(),
                reason: 'ออกภาคสนามเก็บข้อมูลงานวิจัยปริญญานิพนธ์',
                status: 'pending',
                createdAt: now.toISOString()
            },
            {
                id: 'bk-03',
                userId: 'usr-staff',
                userName: 'ดร.สมศรี มีสุข (Staff/Lecturer)',
                vehicleId: 'veh-02',
                vehicleName: 'Honda CR-V e:HEV',
                startDate: tomorrowStart.toISOString(),
                endDate: tomorrowEnd.toISOString(),
                reason: 'ประชุมร่วมกับภาคเอกชนภายนอกมหาวิทยาลัย',
                status: 'approved',
                createdAt: now.toISOString()
            }
        ];
        this.set(this.KEYS.BOOKINGS, seedBookings);

        // 4. Seed Notifications
        const seedNotifications = [
            {
                id: 'nt-01',
                userId: 'usr-staff',
                messageTh: 'การจองรถ Toyota Camry Hybrid ได้รับการอนุมัติแล้ว',
                messageEn: 'Your booking for Toyota Camry Hybrid has been approved.',
                read: true,
                createdAt: lastWeekStart.toISOString()
            },
            {
                id: 'nt-02',
                userId: 'usr-student',
                messageTh: 'คุณส่งคำขอจองรถ BYD Atto 3 (EV) สำเร็จ รอการอนุมัติจากแอดมิน',
                messageEn: 'You successfully requested BYD Atto 3 (EV). Pending admin approval.',
                read: false,
                createdAt: now.toISOString()
            },
            {
                id: 'nt-03',
                userId: 'usr-staff',
                messageTh: 'การจองรถ Honda CR-V e:HEV ได้รับการอนุมัติแล้ว',
                messageEn: 'Your booking for Honda CR-V e:HEV has been approved.',
                read: false,
                createdAt: now.toISOString()
            }
        ];
        this.set(this.KEYS.NOTIFICATIONS, seedNotifications);

        // Mark DB as initialized
        localStorage.setItem(this.KEYS.INITIALIZED, 'true');
        console.log('Database initialized successfully.');
    }
};

// Initialize right away when script loads
DB.init();
window.DB = DB;
window.hashPassword = hashPassword;
window.CAR_SVGS = CAR_SVGS;
