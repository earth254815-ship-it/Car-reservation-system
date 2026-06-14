/**
 * api.js - Asynchronous API Simulation
 * Simulates server responses with mock network latency.
 */

const LATENCY = 300; // ms

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const API = {
    // ----------------------------------------------------
    // AUTHENTICATION APIs
    // ----------------------------------------------------
    async login(email, password) {
        await sleep(LATENCY);
        const users = DB.get(DB.KEYS.USERS);
        const hashedInput = await hashPassword(password);
        
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!user || user.passwordHash !== hashedInput) {
            throw new Error(JSON.stringify({
                th: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
                en: 'Invalid email or password'
            }));
        }

        // Return user context without the hash
        const { passwordHash, ...safeUser } = user;
        return safeUser;
    },

    async register(name, email, phone, role, password) {
        await sleep(LATENCY);
        const users = DB.get(DB.KEYS.USERS);

        if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
            throw new Error(JSON.stringify({
                th: 'อีเมลนี้ถูกใช้งานแล้วในระบบ',
                en: 'This email is already registered'
            }));
        }

        const hashed = await hashPassword(password);
        const newUser = {
            id: 'usr-' + Date.now(),
            name,
            email,
            phone,
            role, // 'student' or 'staff' (admins cannot be registered via signup)
            passwordHash: hashed
        };

        users.push(newUser);
        DB.set(DB.KEYS.USERS, users);

        const { passwordHash, ...safeUser } = newUser;
        return safeUser;
    },

    // ----------------------------------------------------
    // VEHICLE CRUD APIs (FR-02)
    // ----------------------------------------------------
    async getVehicles(searchQuery = '', typeFilter = 'all') {
        await sleep(LATENCY);
        const vehicles = DB.get(DB.KEYS.VEHICLES);
        const bookings = DB.get(DB.KEYS.BOOKINGS);
        
        let filtered = vehicles;

        // Apply type filter
        if (typeFilter !== 'all') {
            filtered = filtered.filter(v => v.type === typeFilter);
        }

        // Apply search query (by name or license plate)
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(v => 
                v.name.toLowerCase().includes(query) || 
                v.nameEn.toLowerCase().includes(query) ||
                v.plate.toLowerCase().includes(query)
            );
        }

        // Calculate dynamic real-time status based on current active approved bookings (FR-03)
        const now = new Date().getTime();
        return filtered.map(vehicle => {
            // Check if vehicle is currently checked out (an approved booking is active right now)
            const isBookedNow = bookings.some(b => 
                b.vehicleId === vehicle.id && 
                b.status === 'approved' &&
                new Date(b.startDate).getTime() <= now &&
                new Date(b.endDate).getTime() >= now
            );

            // If it is maintenance, respect that. Otherwise, dynamically mark as booked or available.
            let dynamicStatus = vehicle.status;
            if (vehicle.status !== 'maintenance') {
                dynamicStatus = isBookedNow ? 'booked' : 'available';
            }

            return { ...vehicle, status: dynamicStatus };
        });
    },

    async createVehicle(vehicleData) {
        await sleep(LATENCY);
        const vehicles = DB.get(DB.KEYS.VEHICLES);
        
        const newVehicle = {
            id: 'veh-' + Date.now(),
            name: vehicleData.name,
            nameEn: vehicleData.nameEn || vehicleData.name,
            type: vehicleData.type,
            plate: vehicleData.plate,
            seats: parseInt(vehicleData.seats) || 5,
            fuelType: vehicleData.fuelType,
            imageUrl: vehicleData.imageUrl || CAR_SVGS[vehicleData.type] || CAR_SVGS.sedan,
            status: vehicleData.status || 'available'
        };

        vehicles.push(newVehicle);
        DB.set(DB.KEYS.VEHICLES, vehicles);
        return newVehicle;
    },

    async updateVehicle(id, vehicleData) {
        await sleep(LATENCY);
        const vehicles = DB.get(DB.KEYS.VEHICLES);
        const index = vehicles.findIndex(v => v.id === id);

        if (index === -1) {
            throw new Error(JSON.stringify({
                th: 'ไม่พบข้อมูลยานพาหนะนี้',
                en: 'Vehicle not found'
            }));
        }

        vehicles[index] = {
            ...vehicles[index],
            name: vehicleData.name,
            nameEn: vehicleData.nameEn || vehicleData.name,
            type: vehicleData.type,
            plate: vehicleData.plate,
            seats: parseInt(vehicleData.seats) || 5,
            fuelType: vehicleData.fuelType,
            status: vehicleData.status,
            imageUrl: vehicleData.imageUrl || vehicles[index].imageUrl
        };

        DB.set(DB.KEYS.VEHICLES, vehicles);
        return vehicles[index];
    },

    async deleteVehicle(id) {
        await sleep(LATENCY);
        const vehicles = DB.get(DB.KEYS.VEHICLES);
        const bookings = DB.get(DB.KEYS.BOOKINGS);

        // Check if there are active bookings for this vehicle
        const hasActiveBookings = bookings.some(b => b.vehicleId === id && b.status === 'approved' && new Date(b.endDate) > new Date());
        if (hasActiveBookings) {
            throw new Error(JSON.stringify({
                th: 'ไม่สามารถลบรถได้ เนื่องจากมีตารางการจองที่อนุมัติแล้วรอใช้งานอยู่',
                en: 'Cannot delete vehicle because it has approved upcoming bookings'
            }));
        }

        const filtered = vehicles.filter(v => v.id !== id);
        DB.set(DB.KEYS.VEHICLES, filtered);
        return true;
    },

    // ----------------------------------------------------
    // BOOKING APIs (FR-04)
    // ----------------------------------------------------
    async getBookings(userId = null, role = null) {
        await sleep(LATENCY);
        const bookings = DB.get(DB.KEYS.BOOKINGS);

        // Sort by creation date or start date descending
        const sorted = bookings.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

        if (role === 'admin') {
            return sorted; // Admins see all bookings
        }

        return sorted.filter(b => b.userId === userId); // Students/Staff see only their bookings
    },

    async createBooking(bookingData) {
        await sleep(LATENCY);
        const bookings = DB.get(DB.KEYS.BOOKINGS);
        const vehicles = DB.get(DB.KEYS.VEHICLES);

        const { vehicleId, userId, userName, userRole, startDate, endDate, reason } = bookingData;

        // Check if vehicle exists and is not under maintenance
        const vehicle = vehicles.find(v => v.id === vehicleId);
        if (!vehicle) {
            throw new Error(JSON.stringify({
                th: 'ไม่พบยานพาหนะที่เลือก',
                en: 'Selected vehicle not found'
            }));
        }
        if (vehicle.status === 'maintenance') {
            throw new Error(JSON.stringify({
                th: 'รถคันนี้อยู่ในระหว่างซ่อมบำรุง ไม่สามารถจองได้',
                en: 'This vehicle is under maintenance and cannot be booked'
            }));
        }

        // Validate time range
        const start = new Date(startDate);
        const end = new Date(endDate);
        const now = new Date();

        if (start < now) {
            throw new Error(JSON.stringify({
                th: 'ไม่สามารถเลือกวันและเวลาที่ผ่านมาแล้วได้',
                en: 'Cannot book in the past'
            }));
        }
        if (end <= start) {
            throw new Error(JSON.stringify({
                th: 'เวลาสิ้นสุดต้องอยู่หลังเวลาเริ่มต้น',
                en: 'End time must be after start time'
            }));
        }

        // Check scheduling conflicts (FR-03: Real-time conflict checking)
        // Two time ranges overlap if (startA < endB) and (endA > startB)
        const hasConflict = bookings.some(b => 
            b.vehicleId === vehicleId &&
            b.status === 'approved' &&
            start < new Date(b.endDate) &&
            end > new Date(b.startDate)
        );

        if (hasConflict) {
            throw new Error(JSON.stringify({
                th: 'รถคันนี้มีผู้จองแล้วในช่วงเวลาที่คุณเลือก กรุณาเลือกเวลาอื่นหรือรถคันอื่น',
                en: 'This vehicle is already booked during your selected time. Please select another time or vehicle.'
            }));
        }

        // Determine booking status based on user role
        // Lecturers/Staff get Auto-Approved to show dynamic role capabilities; Students require admin review.
        const initialStatus = (userRole === 'staff') ? 'approved' : 'pending';

        const newBooking = {
            id: 'bk-' + Date.now(),
            userId,
            userName,
            userRole,
            vehicleId,
            vehicleName: vehicle.name,
            vehicleNameEn: vehicle.nameEn,
            startDate,
            endDate,
            reason,
            status: initialStatus,
            createdAt: now.toISOString()
        };

        bookings.push(newBooking);
        DB.set(DB.KEYS.BOOKINGS, bookings);

        // Add Notification
        const notifMsgTh = initialStatus === 'approved' 
            ? `การจองรถ ${vehicle.name} ของคุณได้รับการอนุมัติอัตโนมัติแล้ว` 
            : `ส่งคำขอจองรถ ${vehicle.name} แล้ว รอการพิจารณาอนุมัติ`;
        
        const notifMsgEn = initialStatus === 'approved' 
            ? `Your booking for ${vehicle.nameEn} has been auto-approved.` 
            : `Submitted booking request for ${vehicle.nameEn}. Pending approval.`;

        await this.createNotification({
            userId,
            messageTh: notifMsgTh,
            messageEn: notifMsgEn
        });

        // If pending, notify admin as well (sent to all admins)
        if (initialStatus === 'pending') {
            const users = DB.get(DB.KEYS.USERS);
            const admins = users.filter(u => u.role === 'admin');
            for (const admin of admins) {
                await this.createNotification({
                    userId: admin.id,
                    messageTh: `มีคำขอจองใหม่จาก ${userName} รอการอนุมัติ`,
                    messageEn: `New booking request from ${userName} requires approval.`
                });
            }
        }

        return newBooking;
    },

    async updateBookingStatus(id, status, adminId = 'usr-admin') {
        await sleep(LATENCY);
        const bookings = DB.get(DB.KEYS.BOOKINGS);
        const index = bookings.findIndex(b => b.id === id);

        if (index === -1) {
            throw new Error(JSON.stringify({
                th: 'ไม่พบรายการจองนี้',
                en: 'Booking not found'
            }));
        }

        const booking = bookings[index];
        const oldStatus = booking.status;
        booking.status = status; // approved, cancelled
        bookings[index] = booking;

        DB.set(DB.KEYS.BOOKINGS, bookings);

        // Create alert notification for user (FR-05)
        let msgTh = '', msgEn = '';
        if (status === 'approved') {
            msgTh = `คำขอจองรถ ${booking.vehicleName} ได้รับอนุมัติเรียบร้อยแล้ว`;
            msgEn = `Your request for ${booking.vehicleNameEn || booking.vehicleName} has been approved.`;
        } else if (status === 'cancelled') {
            msgTh = `คำขอจองรถ ${booking.vehicleName} ถูกยกเลิกโดยผู้ดูแลระบบ`;
            msgEn = `Your request for ${booking.vehicleNameEn || booking.vehicleName} has been cancelled by administrator.`;
        }

        await this.createNotification({
            userId: booking.userId,
            messageTh: msgTh,
            messageEn: msgEn
        });

        return booking;
    },

    // ----------------------------------------------------
    // NOTIFICATION APIs (FR-05)
    // ----------------------------------------------------
    async getNotifications(userId) {
        await sleep(100); // Faster loading for notifications UI
        const notifications = DB.get(DB.KEYS.NOTIFICATIONS);
        // Return reverse chronological notifications for the user
        return notifications
            .filter(n => n.userId === userId)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    async createNotification(notifData) {
        const notifications = DB.get(DB.KEYS.NOTIFICATIONS);
        const newNotif = {
            id: 'nt-' + Date.now() + Math.random().toString(36).substr(2, 5),
            userId: notifData.userId,
            messageTh: notifData.messageTh,
            messageEn: notifData.messageEn,
            read: false,
            createdAt: new Date().toISOString()
        };
        notifications.push(newNotif);
        DB.set(DB.KEYS.NOTIFICATIONS, notifications);
        
        // Dispatch custom event to trigger UI notification counters in real-time
        window.dispatchEvent(new CustomEvent('notification-received', { detail: newNotif }));
        return newNotif;
    },

    async markNotificationsAsRead(userId) {
        const notifications = DB.get(DB.KEYS.NOTIFICATIONS);
        notifications.forEach(n => {
            if (n.userId === userId) n.read = true;
        });
        DB.set(DB.KEYS.NOTIFICATIONS, notifications);
        return true;
    },

    // ----------------------------------------------------
    // DRIVER APIs
    // ----------------------------------------------------
    async getDriverSchedule(driverId) {
        await sleep(LATENCY);
        const bookings = DB.get(DB.KEYS.BOOKINGS);
        // Filter approved bookings and sort chronologically
        return bookings
            .filter(b => b.status === 'approved')
            .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    },

    // ----------------------------------------------------
    // REPORTS & STATS APIs (FR-06)
    // ----------------------------------------------------
    async getReportStats() {
        await sleep(LATENCY + 100);
        const bookings = DB.get(DB.KEYS.BOOKINGS);
        const vehicles = DB.get(DB.KEYS.VEHICLES);
        const users = DB.get(DB.KEYS.USERS);

        // General stats
        const totalBookings = bookings.length;
        const totalVehicles = vehicles.length;
        const pendingApprovals = bookings.filter(b => b.status === 'pending').length;
        const totalUsers = users.length;

        // Bookings by vehicle type
        const typeBookings = { sedan: 0, suv: 0, van: 0, ev: 0 };
        // Bookings by status
        const statusBookings = { pending: 0, approved: 0, cancelled: 0 };
        // Popularity: book count per vehicle
        const vehicleCounts = {};

        vehicles.forEach(v => {
            vehicleCounts[v.id] = {
                name: v.name,
                nameEn: v.nameEn,
                plate: v.plate,
                count: 0
            };
        });

        bookings.forEach(b => {
            // 1. Group by status
            if (statusBookings[b.status] !== undefined) {
                statusBookings[b.status]++;
            }

            // Find matching vehicle details
            const veh = vehicles.find(v => v.id === b.vehicleId);
            if (veh) {
                // 2. Group by type
                if (typeBookings[veh.type] !== undefined) {
                    typeBookings[veh.type]++;
                }
            }

            // 3. Count popularity
            if (vehicleCounts[b.vehicleId]) {
                vehicleCounts[b.vehicleId].count++;
            }
        });

        // Convert vehicle counts map to sorted array
        const vehicleStatsList = Object.values(vehicleCounts)
            .sort((a, b) => b.count - a.count);

        return {
            totalBookings,
            totalVehicles,
            pendingApprovals,
            totalUsers,
            typeBookings,
            statusBookings,
            vehicleStatsList
        };
    }
};

window.API = API;
