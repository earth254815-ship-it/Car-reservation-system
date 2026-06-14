/**
 * test-suite.js - Automated Client-Side Verification Tests
 * Run this script in the browser console using `runTestSuite()` to verify the system logic.
 */

async function runTestSuite() {
    console.log('%c--- STARTING SYSTEM TEST SUITE ---', 'color: #4f46e5; font-size: 1.2rem; font-weight: bold;');
    let passedTests = 0;
    let totalTests = 0;

    const assert = (condition, message) => {
        totalTests++;
        if (condition) {
            passedTests++;
            console.log(`%c[PASS] %c${message}`, 'color: #10b981; font-weight: bold;', 'color: var(--text-primary);');
        } else {
            console.error(`[FAIL] ${message}`);
        }
    };

    // Test 1: Password Encryption Check (NFR-02)
    try {
        const password = 'testPassword123';
        const hash1 = await hashPassword(password);
        const hash2 = await hashPassword(password);
        
        assert(hash1.length === 64, 'Password hash must be 64 characters long (SHA-256 hex format).');
        assert(hash1 === hash2, 'Identical passwords must resolve to matching hashes.');
        assert(hash1 !== password, 'Hashed password must not match plain text.');
    } catch (e) {
        console.error('Test 1 failed:', e);
    }

    // Test 2: Database Initialization check
    try {
        const users = DB.get(DB.KEYS.USERS);
        const vehicles = DB.get(DB.KEYS.VEHICLES);
        assert(users.length >= 3, 'Users database should contain pre-seeded users.');
        assert(vehicles.length >= 4, 'Vehicles database should contain pre-seeded vehicles.');
    } catch (e) {
        console.error('Test 2 failed:', e);
    }

    // Test 3: Authentication API login flow
    try {
        const successUser = await API.login('admin@carbooking.com', 'admin123');
        assert(successUser.role === 'admin', 'Login with admin credentials must return admin role.');
        assert(successUser.passwordHash === undefined, 'Returned user object must exclude sensitive passwordHash field.');

        try {
            await API.login('admin@carbooking.com', 'wrongpassword');
            assert(false, 'Login with incorrect password should throw an error.');
        } catch (err) {
            assert(true, 'Login with incorrect password correctly throws an exception.');
        }
    } catch (e) {
        console.error('Test 3 failed:', e);
    }

    // Test 4: Booking collision check (FR-03 & FR-04)
    try {
        // Create an approved booking for tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 2); // 2 days from now to avoid conflicts with seeded data
        
        const start = new Date(tomorrow);
        start.setHours(9, 0, 0, 0);
        const end = new Date(tomorrow);
        end.setHours(12, 0, 0, 0);

        // Attempting to book overlapping timeframe
        const overlapStart = new Date(tomorrow);
        overlapStart.setHours(10, 0, 0, 0);
        const overlapEnd = new Date(tomorrow);
        overlapEnd.setHours(14, 0, 0, 0);

        // Attempting to book non-overlapping timeframe
        const safeStart = new Date(tomorrow);
        safeStart.setHours(13, 0, 0, 0);
        const safeEnd = new Date(tomorrow);
        safeEnd.setHours(15, 0, 0, 0);

        // Register main booking
        const initialBooking = await API.createBooking({
            vehicleId: 'veh-01',
            userId: 'usr-student',
            userName: 'Test Student',
            userRole: 'student',
            startDate: start.toISOString(),
            endDate: end.toISOString(),
            reason: 'Testing booking collision'
        });

        // Set status to approved so collision checking takes action
        await API.updateBookingStatus(initialBooking.id, 'approved');

        // Test Overlapping Request
        try {
            await API.createBooking({
                vehicleId: 'veh-01',
                userId: 'usr-staff',
                userName: 'Test Staff',
                userRole: 'staff',
                startDate: overlapStart.toISOString(),
                endDate: overlapEnd.toISOString(),
                reason: 'Should fail'
            });
            assert(false, 'Overlapping booking slot must fail collision check.');
        } catch (e) {
            assert(true, 'Booking overlap collision correctly blocked booking.');
        }

        // Test Safe/Available Request
        try {
            const successBooking = await API.createBooking({
                vehicleId: 'veh-01',
                userId: 'usr-staff',
                userName: 'Test Staff',
                userRole: 'staff',
                startDate: safeStart.toISOString(),
                endDate: safeEnd.toISOString(),
                reason: 'Should succeed'
            });
            assert(successBooking.status === 'approved', 'Non-overlapping booking slot for staff should succeed with auto-approval.');
        } catch (e) {
            assert(false, 'Non-overlapping booking slot failed: ' + e.message);
        }

    } catch (e) {
        console.error('Test 4 failed:', e);
    }

    // Test 5: Vehicle CRUD operations (FR-02)
    try {
        const newVehicle = await API.createVehicle({
            name: 'Tesla Model 3',
            nameEn: 'Tesla Model 3',
            type: 'ev',
            plate: 'กก 9999 กรุงเทพฯ',
            seats: 5,
            fuelType: 'electric',
            status: 'available'
        });
        
        let vehicles = await API.getVehicles();
        assert(vehicles.some(v => v.id === newVehicle.id), 'Created vehicle must exist in the database.');

        // Update
        await API.updateVehicle(newVehicle.id, {
            name: 'Tesla Model 3 LR',
            nameEn: 'Tesla Model 3 Long Range',
            type: 'ev',
            plate: 'กก 9999 กรุงเทพฯ',
            seats: 5,
            fuelType: 'electric',
            status: 'maintenance'
        });

        vehicles = await API.getVehicles();
        const updated = vehicles.find(v => v.id === newVehicle.id);
        assert(updated.nameEn === 'Tesla Model 3 Long Range' && updated.status === 'maintenance', 'Vehicle updates should be persistent in DB.');

        // Delete
        await API.deleteVehicle(newVehicle.id);
        vehicles = await API.getVehicles();
        assert(!vehicles.some(v => v.id === newVehicle.id), 'Deleted vehicle must be removed from the database.');

    } catch (e) {
        console.error('Test 5 failed:', e);
    }

    console.log(`%c--- TESTS COMPLETED: ${passedTests}/${totalTests} PASSED ---`, `color: ${passedTests === totalTests ? '#10b981' : '#ef4444'}; font-size: 1.1rem; font-weight: bold;`);
}

window.runTestSuite = runTestSuite;
// Auto load script tag verification link
console.log('%c[Test Suite Loaded] Type runTestSuite() in console to verify the system specifications.', 'color: #6366f1; font-weight: bold;');
