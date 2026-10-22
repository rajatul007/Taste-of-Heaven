import { db } from '../server/db';

function runTestSuite() {
  console.log('--- Starting FoodRush Comprehensive Test Suite ---');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  }

  // 1. Restaurant Lookups & Filtering
  const allRestos = db.getRestaurants();
  assert(allRestos.length >= 10, 'Database initializes with seeded restaurants');

  // Verify Required 4 Greater Noida Restaurants
  const appitito = db.getRestaurantByIdOrSlug('appitito');
  assert(!!appitito && appitito.locality === 'Knowledge Park 2', 'Appitito in Knowledge Park 2 exists with verified slug');

  const banzara = db.getRestaurantByIdOrSlug('banzara-bliss');
  assert(!!banzara && banzara.locality === 'Alpha 2', 'Banzara Bliss in Alpha 2 exists with verified slug');

  const bbq = db.getRestaurantByIdOrSlug('barbeque-nation-greater-noida');
  assert(!!bbq && bbq.locality === 'Beta 2', 'Barbeque Nation in Beta 2 exists with verified slug');

  const bk = db.getRestaurantByIdOrSlug('burger-king-omaxe-mall');
  assert(!!bk && bk.locality === 'Beta 2', 'Burger King at Omaxe Mall Beta 2 exists with verified slug');

  // 2. Locality Filter Test
  const kp2List = db.getRestaurants({ locality: 'Knowledge Park 2' });
  assert(kp2List.some((r) => r.slug === 'appitito'), 'Knowledge Park 2 filter returns Appitito');

  const alpha2List = db.getRestaurants({ locality: 'Alpha 2' });
  assert(alpha2List.some((r) => r.slug === 'banzara-bliss'), 'Alpha 2 filter returns Banzara Bliss');

  const beta2List = db.getRestaurants({ locality: 'Beta 2' });
  assert(beta2List.some((r) => r.slug === 'burger-king-omaxe-mall'), 'Beta 2 filter returns Burger King');
  assert(beta2List.some((r) => r.slug === 'barbeque-nation-greater-noida'), 'Beta 2 filter returns Barbeque Nation');

  // 3. Menu Items Test
  const appititoMenu = db.getMenuItemsByRestaurant('resto-appitito');
  assert(appititoMenu.length >= 4, 'Appitito has categorized menu items');

  const margherita = appititoMenu.find((m) => m.name.includes('Margherita'));
  assert(!!margherita && margherita.price === 299, 'Margherita Pizza has correct verified price (₹299)');
  assert(!!margherita?.optionGroups && margherita.optionGroups.length > 0, 'Pizza has customizable crust options');

  // 4. Swiggy-Style Search Suggestions
  const searchResults = db.getSearchSuggestions('pizza');
  assert(searchResults.some((s) => s.type === 'dish'), 'Search suggestions include pizza dishes with direct + Add');

  const restoSearchResults = db.getSearchSuggestions('Appitito');
  assert(restoSearchResults.some((s) => s.type === 'restaurant'), 'Search suggestions include Appitito restaurant');

  const localitySearchResults = db.getSearchSuggestions('Alpha 1');
  assert(localitySearchResults.some((s) => s.type === 'locality'), 'Search suggestions include Alpha 1 locality');

  // 5. Coupon Calculations
  const couponRush50 = db.validateCoupon('RUSH50', 300);
  assert(couponRush50.valid && couponRush50.discount === 100, 'RUSH50 gives 50% discount capped at max ₹100');

  const couponInvalidSubtotal = db.validateCoupon('RUSH50', 100);
  assert(!couponInvalidSubtotal.valid, 'RUSH50 rejects order below minOrderAmount (₹199)');

  const couponWelcome = db.validateCoupon('WELCOME100', 350);
  assert(couponWelcome.valid && couponWelcome.discount === 100, 'WELCOME100 applies flat ₹100 discount');

  // 6. Order Placement & State Lifecycle
  const testOrder = db.createOrder({
    userId: 'user-customer-1',
    customerName: 'Aarav Sharma',
    customerPhone: '+91 98112 34567',
    restaurantId: 'resto-appitito',
    restaurantName: 'Appitito',
    restaurantAddress: 'UP 16 KP 3, Alpha 1 Commercial Belt, Greater Noida',
    items: [
      {
        cartItemId: 'dish-app-1',
        menuItem: margherita!,
        quantity: 1,
        selectedOptions: [],
        itemTotal: 299,
      },
    ],
    subtotal: 299,
    deliveryFee: 29,
    tax: 15,
    discount: 50,
    tip: 20,
    total: 313,
    deliveryAddress: {
      id: 'addr-1',
      label: 'Home',
      street: 'Flat 402, Eldeco',
      locality: 'Sector Alpha 1',
      city: 'Greater Noida',
      state: 'Uttar Pradesh',
      pincode: '201310',
    },
    paymentMethod: 'upi',
    paymentStatus: 'completed',
    orderStatus: 'confirmed',
    estimatedDeliveryTime: '22 mins',
  });

  assert(!!testOrder.orderNumber, 'Order is assigned unique order number');
  assert(testOrder.orderStatus === 'confirmed', 'Order initializes in confirmed status');
  assert(!!testOrder.deliveryOtp && testOrder.deliveryOtp.length === 4, 'Order has 4-digit contactless delivery OTP');

  // 7. Order Status Transitions (Swiggy Lifecycle)
  const preparingOrder = db.updateOrderStatus(testOrder.id, 'preparing', 'Chef is cooking');
  assert(preparingOrder?.orderStatus === 'preparing', 'Order status transitions to preparing');

  const driverAssigned = db.updateOrderStatus(testOrder.id, 'driver_assigned', 'Ramesh assigned');
  assert(driverAssigned?.orderStatus === 'driver_assigned', 'Order status transitions to driver_assigned');

  const outForDeliveryOrder = db.updateOrderStatus(testOrder.id, 'out_for_delivery', 'Rider dispatched');
  assert(outForDeliveryOrder?.orderStatus === 'out_for_delivery', 'Order status transitions to out for delivery');

  const arrivedOrder = db.updateOrderStatus(testOrder.id, 'arrived', 'Rider reached gate');
  assert(arrivedOrder?.orderStatus === 'arrived', 'Order status transitions to arrived');

  // 9. NCR City Queries (Gurugram, Delhi, Noida)
  const delhiRestos = db.getRestaurants({ region: 'delhi' });
  assert(delhiRestos.length >= 3, 'Delhi returns all curated restaurants (Moti Mahal, Rajinder Da Dhaba, Gulati)');

  const gurugramRestos = db.getRestaurants({ region: 'gurugram' });
  assert(gurugramRestos.length >= 3, 'Gurugram returns Cyber Hub Social, Farzi Cafe, Cafe Delhi Heights');

  const noidaRestos = db.getRestaurants({ region: 'noida' });
  assert(noidaRestos.length >= 3, 'Noida returns Karims Sec 18, Carnatic Cafe Sec 132, Burma Burma');

  // 10. Dineout Table Booking Lifecycle
  const sampleBooking = db.createTableBooking({
    restaurantId: 'resto-bbq-nation',
    restaurantName: 'Barbeque Nation',
    restaurantAddress: '2nd Floor, Omaxe CP Mall, Beta 2, Greater Noida',
    customerName: 'Aarav Sharma',
    customerPhone: '+91 98112 34567',
    guestsCount: 4,
    bookingDate: '2026-10-25',
    timeSlot: '08:00 PM',
    discountOffer: 'FLAT 25% OFF on Live Grill Buffet',
  });
  assert(!!sampleBooking.id && !!sampleBooking.bookingCode, 'Dineout Table Booking generates unique ID and code');
  assert(sampleBooking.status === 'confirmed', 'Dineout Table Booking status is confirmed');
  assert(sampleBooking.discountOffer.includes('25% OFF'), 'Dineout Table Booking stores verified discount');

  const bookingsList = db.getTableBookings('resto-bbq-nation');
  assert(bookingsList.length >= 1, 'Dineout Table Bookings query returns booked table');

  console.log(`\nResults: ${passed} passed, ${failed} failed`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite();

