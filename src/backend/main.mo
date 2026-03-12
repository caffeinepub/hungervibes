import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Time "mo:core/Time";
import List "mo:core/List";
import Option "mo:core/Option";
import AccessControl "authorization/access-control";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Mixins
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // ========== Types ==========
  type Role = {
    #customer;
    #restaurant_owner;
    #delivery_agent;
  };

  type UserProfile = {
    name : Text;
    phone : Text;
    role : Role;
    isVerified : Bool;
    isSuspended : Bool;
  };

  type Restaurant = {
    id : Nat;
    name : Text;
    description : Text;
    address : Text;
    phone : Text;
    cuisineType : Text;
    isApproved : Bool;
    isSuspended : Bool;
    ownerId : Principal;
    logo : ?Storage.ExternalBlob;
  };

  type MenuItem = {
    id : Nat;
    restaurantId : Nat;
    name : Text;
    description : Text;
    price : Nat;
    category : Text;
    imageUrl : ?Storage.ExternalBlob;
    isAvailable : Bool;
  };

  type OrderStatus = {
    #pending;
    #accepted;
    #rejected;
    #preparing;
    #ready_for_pickup;
    #picked_up;
    #delivered;
    #cancelled;
  };

  type PaymentMethod = {
    #cash;
    #online;
  };

  type OrderItem = {
    foodItemId : Nat;
    quantity : Nat;
    price : Nat;
  };

  type Order = {
    id : Nat;
    customerId : Principal;
    restaurantId : Nat;
    items : [OrderItem];
    deliveryAddress : Text;
    paymentMethod : PaymentMethod;
    status : OrderStatus;
    deliveryAgentId : ?Principal;
    isPaid : Bool;
    subtotal : Nat;
    deliveryFee : Nat;
    totalAmount : Nat;
    couponCode : ?Text;
  };

  type Coupon = {
    code : Text;
    discountPercent : Nat;
    maxUses : Nat;
    expiryDate : Int;
    uses : Nat;
  };

  type AgentInfo = {
    principal : Principal;
    name : Text;
    phone : Text;
  };

  // ========== Internal State ==========
  var nextRestaurantId = 1;
  var nextMenuItemId = 1;
  var nextOrderId = 1;

  let userProfiles = Map.empty<Principal, UserProfile>();
  let restaurants = Map.empty<Nat, Restaurant>();
  let menuItems = Map.empty<Nat, MenuItem>();
  let orders = Map.empty<Nat, Order>();
  let coupons = Map.empty<Text, Coupon>();

  // ========== User Profile Functions (Required by Frontend) ==========
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    
    // Prevent users from changing their suspended status
    switch (userProfiles.get(caller)) {
      case (?existingProfile) {
        userProfiles.add(caller, { profile with isSuspended = existingProfile.isSuspended });
      };
      case (null) {
        userProfiles.add(caller, { profile with isSuspended = false });
      };
    };
  };

  // ========== User Functions ==========
  public shared ({ caller }) func registerUser(name : Text, phone : Text, role : Role) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can register");
    };
    
    let profile : UserProfile = {
      name;
      phone;
      role;
      isVerified = false;
      isSuspended = false;
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func suspendUser(userId : Principal) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can suspend users");
    };
    switch (userProfiles.get(userId)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) {
        userProfiles.add(userId, { profile with isSuspended = true });
      };
    };
  };

  public shared ({ caller }) func activateUser(userId : Principal) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can activate users");
    };
    switch (userProfiles.get(userId)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) {
        userProfiles.add(userId, { profile with isSuspended = false });
      };
    };
  };

  public shared ({ caller }) func verifyDeliveryAgent(agentId : Principal) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can verify delivery agents");
    };
    switch (userProfiles.get(agentId)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) {
        if (profile.role != #delivery_agent) {
          Runtime.trap("User is not a delivery agent");
        };
        userProfiles.add(agentId, { profile with isVerified = true });
      };
    };
  };

  public query ({ caller }) func getUsersByRole(role : Role) : async [UserProfile] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can get all users");
    };
    userProfiles.values().toArray().filter(
      func(u : UserProfile) : Bool { u.role == role }
    );
  };

  // Returns verified, active delivery agents with their principals for assignment
  public query ({ caller }) func getVerifiedDeliveryAgents() : async [AgentInfo] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can view agents");
    };
    userProfiles.entries().toArray()
      .filter(func(entry : (Principal, UserProfile)) : Bool {
        entry.1.role == #delivery_agent and entry.1.isVerified and not entry.1.isSuspended
      })
      .map(func(entry : (Principal, UserProfile)) : AgentInfo {
        { principal = entry.0; name = entry.1.name; phone = entry.1.phone }
      });
  };

  // Restaurant assigns a specific delivery agent to an order
  public shared ({ caller }) func restaurantAssignAgent(orderId : Nat, agentId : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can assign agents");
    };
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        // Verify caller is the restaurant owner
        switch (restaurants.get(order.restaurantId)) {
          case (null) { Runtime.trap("Restaurant not found") };
          case (?restaurant) {
            if (restaurant.ownerId != caller) {
              Runtime.trap("Unauthorized: Only restaurant owner can assign delivery agents");
            };
            if (order.status != #ready_for_pickup) {
              Runtime.trap("Order must be ready for pickup to assign an agent");
            };
            // Verify agent exists, is verified, and not suspended
            switch (userProfiles.get(agentId)) {
              case (null) { Runtime.trap("Agent not found") };
              case (?agentProfile) {
                if (agentProfile.role != #delivery_agent) {
                  Runtime.trap("User is not a delivery agent");
                };
                if (not agentProfile.isVerified) {
                  Runtime.trap("Agent is not verified");
                };
                if (agentProfile.isSuspended) {
                  Runtime.trap("Agent is suspended");
                };
              };
            };
            orders.add(orderId, { order with deliveryAgentId = ?agentId });
          };
        };
      };
    };
  };

  // Delivery agent accepts or declines an assignment
  public shared ({ caller }) func agentRespondToAssignment(orderId : Nat, accept : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can respond to assignments");
    };
    // Verify caller is a verified delivery agent
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) {
        if (profile.role != #delivery_agent) {
          Runtime.trap("Only delivery agents can respond to assignments");
        };
        if (not profile.isVerified) {
          Runtime.trap("Delivery agent must be verified");
        };
      };
    };
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        // Verify this order is assigned to the caller
        switch (order.deliveryAgentId) {
          case (null) { Runtime.trap("No agent assigned to this order") };
          case (?assignedAgent) {
            if (assignedAgent != caller) {
              Runtime.trap("This order is not assigned to you");
            };
          };
        };
        if (order.status != #ready_for_pickup) {
          Runtime.trap("Order is not in ready_for_pickup status");
        };
        if (accept) {
          // Agent accepts: move to picked_up
          orders.add(orderId, { order with status = #picked_up });
        } else {
          // Agent declines: clear assignment, order goes back to available pool
          orders.add(orderId, { order with deliveryAgentId = null });
        };
      };
    };
  };

  // ========== Restaurant Functions ==========
  public shared ({ caller }) func createRestaurant(name : Text, description : Text, address : Text, phone : Text, cuisineType : Text, logo : ?Storage.ExternalBlob) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only registered users can create restaurants");
    };
    
    // Verify user is a restaurant owner
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) {
        if (profile.isSuspended) {
          Runtime.trap("User is suspended");
        };
        if (profile.role != #restaurant_owner) {
          Runtime.trap("Only restaurant owners can create restaurants");
        };
      };
    };
    
    let restaurant : Restaurant = {
      id = nextRestaurantId;
      name;
      description;
      address;
      phone;
      cuisineType;
      isApproved = false;
      isSuspended = false;
      ownerId = caller;
      logo;
    };
    restaurants.add(nextRestaurantId, restaurant);
    nextRestaurantId += 1;
    restaurant.id;
  };

  public shared ({ caller }) func approveRestaurant(restaurantId : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can approve restaurants");
    };
    switch (restaurants.get(restaurantId)) {
      case (null) { Runtime.trap("Restaurant not found") };
      case (?restaurant) {
        restaurants.add(restaurantId, { restaurant with isApproved = true });
      };
    };
  };

  public shared ({ caller }) func rejectRestaurant(restaurantId : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can reject restaurants");
    };
    switch (restaurants.get(restaurantId)) {
      case (null) { Runtime.trap("Restaurant not found") };
      case (?restaurant) {
        restaurants.add(restaurantId, { restaurant with isApproved = false });
      };
    };
  };

  public shared ({ caller }) func suspendRestaurant(restaurantId : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can suspend restaurants");
    };
    switch (restaurants.get(restaurantId)) {
      case (null) { Runtime.trap("Restaurant not found") };
      case (?restaurant) {
        restaurants.add(restaurantId, { restaurant with isSuspended = true });
      };
    };
  };

  public shared ({ caller }) func updateRestaurant(restaurantId : Nat, name : ?Text, description : ?Text, address : ?Text, phone : ?Text, cuisineType : ?Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only registered users can update restaurants");
    };
    
    switch (restaurants.get(restaurantId)) {
      case (null) { Runtime.trap("Restaurant not found") };
      case (?restaurant) {
        if (restaurant.ownerId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only owner or admin can update restaurant");
        };
        restaurants.add(
          restaurantId,
          {
            restaurant with
            name = name.get(restaurant.name);
            description = description.get(restaurant.description);
            address = address.get(restaurant.address);
            phone = phone.get(restaurant.phone);
            cuisineType = cuisineType.get(restaurant.cuisineType);
          },
        );
      };
    };
  };

  public query func getAllRestaurants() : async [Restaurant] {
    // Public endpoint - anyone can browse restaurants
    restaurants.values().toArray();
  };

  public query func getRestaurant(id : Nat) : async ?Restaurant {
    // Public endpoint - anyone can view restaurant details
    restaurants.get(id);
  };

  public query ({ caller }) func getMyRestaurant() : async ?Restaurant {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only registered users can view their restaurant");
    };
    
    let ownedRestaurants = restaurants.values().toArray().filter(
      func(r : Restaurant) : Bool { r.ownerId == caller }
    );
    
    if (ownedRestaurants.size() > 0) {
      ?ownedRestaurants[0];
    } else {
      null;
    };
  };

  // ========== Menu Item Functions ==========
  public shared ({ caller }) func addMenuItem(restaurantId : Nat, name : Text, description : Text, price : Nat, category : Text, imageUrl : ?Storage.ExternalBlob) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only registered users can add menu items");
    };
    
    switch (restaurants.get(restaurantId)) {
      case (null) { Runtime.trap("Restaurant not found") };
      case (?restaurant) {
        if (restaurant.ownerId != caller) { 
          Runtime.trap("Unauthorized: Only owner can add menu items") 
        };
        let menuItem : MenuItem = {
          id = nextMenuItemId;
          restaurantId;
          name;
          description;
          price;
          category;
          imageUrl;
          isAvailable = true;
        };
        menuItems.add(nextMenuItemId, menuItem);
        nextMenuItemId += 1;
        menuItem.id;
      };
    };
  };

  public shared ({ caller }) func updateMenuItem(itemId : Nat, name : ?Text, description : ?Text, price : ?Nat, category : ?Text, isAvailable : ?Bool) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only registered users can update menu items");
    };
    
    switch (menuItems.get(itemId)) {
      case (null) { Runtime.trap("Menu item not found") };
      case (?item) {
        switch (restaurants.get(item.restaurantId)) {
          case (null) { Runtime.trap("Restaurant not found") };
          case (?restaurant) {
            if (restaurant.ownerId != caller) {
              Runtime.trap("Unauthorized: Only owner can update menu items");
            };
            menuItems.add(
              itemId,
              {
                item with
                name = name.get(item.name);
                description = description.get(item.description);
                price = price.get(item.price);
                category = category.get(item.category);
                isAvailable = isAvailable.get(item.isAvailable);
              },
            );
          };
        };
      };
    };
  };

  public shared ({ caller }) func deleteMenuItem(itemId : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only registered users can delete menu items");
    };
    
    switch (menuItems.get(itemId)) {
      case (null) { Runtime.trap("Menu item not found") };
      case (?item) {
        switch (restaurants.get(item.restaurantId)) {
          case (null) { Runtime.trap("Restaurant not found") };
          case (?restaurant) {
            if (restaurant.ownerId != caller) {
              Runtime.trap("Unauthorized: Only owner can delete menu items");
            };
            menuItems.remove(itemId);
          };
        };
      };
    };
  };

  public query func getMenuByRestaurant(restaurantId : Nat) : async [MenuItem] {
    // Public endpoint - anyone can view menu
    menuItems.values().toArray().filter(
      func(item : MenuItem) : Bool { item.restaurantId == restaurantId }
    );
  };

  // ========== Order Functions ==========
  public shared ({ caller }) func placeOrder(restaurantId : Nat, items : [OrderItem], deliveryAddress : Text, paymentMethod : PaymentMethod, couponCode : ?Text) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only registered users can place orders");
    };
    
    // Verify user is a customer
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) {
        if (profile.isSuspended) {
          Runtime.trap("User is suspended");
        };
        if (profile.role != #customer) {
          Runtime.trap("Only customers can place orders");
        };
      };
    };
    
    let subtotal = items.foldLeft(0, func(acc, item) { acc + item.price * item.quantity });
    let deliveryFee = 5000; // Flat delivery fee
    let totalAmount = subtotal + deliveryFee;

    let order : Order = {
      id = nextOrderId;
      customerId = caller;
      restaurantId;
      items;
      deliveryAddress;
      paymentMethod;
      status = #pending;
      deliveryAgentId = null;
      isPaid = false;
      subtotal;
      deliveryFee;
      totalAmount;
      couponCode;
    };
    orders.add(nextOrderId, order);
    nextOrderId += 1;
    order.id;
  };

  public shared ({ caller }) func acceptOrder(orderId : Nat, isAccepted : Bool) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only registered users can accept orders");
    };
    
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        // Verify caller is the restaurant owner
        switch (restaurants.get(order.restaurantId)) {
          case (null) { Runtime.trap("Restaurant not found") };
          case (?restaurant) {
            if (restaurant.ownerId != caller) {
              Runtime.trap("Unauthorized: Only restaurant owner can accept/reject orders");
            };
            if (order.status != #pending) {
              Runtime.trap("Order is not in pending status");
            };
            orders.add(
              orderId,
              {
                order with status = if isAccepted { #accepted } else { #rejected }
              },
            );
          };
        };
      };
    };
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, status : OrderStatus) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only registered users can update order status");
    };
    
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        // Verify caller is the restaurant owner for preparing/ready_for_pickup statuses
        switch (restaurants.get(order.restaurantId)) {
          case (null) { Runtime.trap("Restaurant not found") };
          case (?restaurant) {
            switch (status) {
              case (#preparing or #ready_for_pickup) {
                if (restaurant.ownerId != caller) {
                  Runtime.trap("Unauthorized: Only restaurant owner can update to preparing/ready_for_pickup");
                };
              };
              case (#delivered) {
                // Verify caller is the assigned delivery agent
                switch (order.deliveryAgentId) {
                  case (null) { Runtime.trap("No delivery agent assigned") };
                  case (?agentId) {
                    if (agentId != caller) {
                      Runtime.trap("Unauthorized: Only assigned delivery agent can mark as delivered");
                    };
                  };
                };
              };
              case (_) {
                Runtime.trap("Invalid status transition");
              };
            };
            orders.add(orderId, { order with status });
          };
        };
      };
    };
  };

  public shared ({ caller }) func assignDeliveryAgent(orderId : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only registered users can assign themselves as delivery agent");
    };
    
    // Verify user is a verified delivery agent
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) {
        if (profile.isSuspended) {
          Runtime.trap("User is suspended");
        };
        if (profile.role != #delivery_agent) {
          Runtime.trap("Only delivery agents can accept orders");
        };
        if (not profile.isVerified) {
          Runtime.trap("Delivery agent must be verified");
        };
      };
    };
    
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        if (order.status != #ready_for_pickup) {
          Runtime.trap("Order must be ready for pickup");
        };
        if (order.deliveryAgentId != null) {
          Runtime.trap("Order already has a delivery agent assigned");
        };
        orders.add(orderId, { order with deliveryAgentId = ?caller; status = #picked_up });
      };
    };
  };

  public shared ({ caller }) func cancelOrder(orderId : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only registered users can cancel orders");
    };
    
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        if (order.customerId != caller) {
          Runtime.trap("Unauthorized: Only customer can cancel their order");
        };
        if (order.status != #pending) {
          Runtime.trap("Can only cancel pending orders");
        };
        orders.add(orderId, { order with status = #cancelled });
      };
    };
  };

  public query ({ caller }) func getOrdersByCustomer(customerId : Principal) : async [Order] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only registered users can view orders");
    };
    
    if (caller != customerId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own orders");
    };
    
    orders.values().toArray().filter(
      func(o : Order) : Bool { o.customerId == customerId }
    );
  };

  public query ({ caller }) func getOrdersByRestaurant(restaurantId : Nat) : async [Order] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only registered users can view orders");
    };
    
    // Verify caller is the restaurant owner
    switch (restaurants.get(restaurantId)) {
      case (null) { Runtime.trap("Restaurant not found") };
      case (?restaurant) {
        if (restaurant.ownerId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only restaurant owner or admin can view restaurant orders");
        };
      };
    };
    
    orders.values().toArray().filter(
      func(o : Order) : Bool { o.restaurantId == restaurantId }
    );
  };

  public query ({ caller }) func getOrdersByDeliveryAgent(agentId : Principal) : async [Order] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only registered users can view orders");
    };
    
    if (caller != agentId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own orders");
    };
    
    orders.values().toArray().filter(
      func(o : Order) : Bool {
        switch (o.deliveryAgentId) {
          case (null) { false };
          case (?id) { id == agentId };
        };
      }
    );
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can view all orders");
    };
    orders.values().toArray();
  };

  // ========== Coupon Functions ==========
  public shared ({ caller }) func createCoupon(code : Text, discountPercent : Nat, maxUses : Nat, expiryDate : Int) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can create coupons");
    };
    let coupon : Coupon = {
      code;
      discountPercent;
      maxUses;
      expiryDate;
      uses = 0;
    };
    coupons.add(code, coupon);
  };

  public query func validateCoupon(code : Text) : async Bool {
    // Public endpoint - anyone can validate coupons
    switch (coupons.get(code)) {
      case (null) { false };
      case (?coupon) {
        coupon.uses < coupon.maxUses and Time.now() < coupon.expiryDate;
      };
    };
  };

  // ========== Earnings Functions ==========
  public query ({ caller }) func getRestaurantEarnings(restaurantId : Nat) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only registered users can view earnings");
    };
    
    // Verify caller is the restaurant owner
    switch (restaurants.get(restaurantId)) {
      case (null) { Runtime.trap("Restaurant not found") };
      case (?restaurant) {
        if (restaurant.ownerId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only restaurant owner or admin can view earnings");
        };
      };
    };
    
    let restaurantOrders = orders.values().toArray().filter(
      func(o : Order) : Bool { 
        o.restaurantId == restaurantId and (o.status == #delivered)
      }
    );
    
    // Restaurant gets 90% of subtotal (platform takes 10% commission)
    restaurantOrders.foldLeft<Order, Nat>(0, func(acc, order) { 
      acc + (order.subtotal * 90 / 100)
    });
  };

  public query ({ caller }) func getDeliveryAgentEarnings(agentId : Principal) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only registered users can view earnings");
    };
    
    if (caller != agentId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own earnings");
    };
    
    let agentOrders = orders.values().toArray().filter(
      func(o : Order) : Bool {
        switch (o.deliveryAgentId) {
          case (null) { false };
          case (?id) { id == agentId and o.status == #delivered };
        };
      }
    );
    
    // Delivery agent gets the full delivery fee per order
    agentOrders.foldLeft<Order, Nat>(0, func(acc, order) { 
      acc + order.deliveryFee
    });
  };

  public query ({ caller }) func getPlatformRevenue() : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can view platform revenue");
    };
    
    let deliveredOrders = orders.values().toArray().filter(
      func(o : Order) : Bool { o.status == #delivered }
    );
    
    // Platform gets 10% commission on subtotal
    deliveredOrders.foldLeft<Order, Nat>(0, func(acc, order) { 
      acc + (order.subtotal * 10 / 100)
    });
  };

  // ========== Analytics Functions (Admin Only) ==========
  public query ({ caller }) func getAnalytics() : async {
    totalOrders : Nat;
    totalRevenue : Nat;
    ordersByStatus : [(OrderStatus, Nat)];
  } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can view analytics");
    };
    
    let allOrders = orders.values().toArray();
    let totalOrders = allOrders.size();
    
    let deliveredOrders = allOrders.filter(
      func(o : Order) : Bool { o.status == #delivered }
    );
    let totalRevenue = deliveredOrders.foldLeft(0, func(acc, order) { 
      acc + order.totalAmount
    });
    
    let ordersByStatus : [(OrderStatus, Nat)] = [
      (#pending, allOrders.filter(func(o : Order) : Bool { o.status == #pending }).size()),
      (#accepted, allOrders.filter(func(o : Order) : Bool { o.status == #accepted }).size()),
      (#rejected, allOrders.filter(func(o : Order) : Bool { o.status == #rejected }).size()),
      (#preparing, allOrders.filter(func(o : Order) : Bool { o.status == #preparing }).size()),
      (#ready_for_pickup, allOrders.filter(func(o : Order) : Bool { o.status == #ready_for_pickup }).size()),
      (#picked_up, allOrders.filter(func(o : Order) : Bool { o.status == #picked_up }).size()),
      (#delivered, allOrders.filter(func(o : Order) : Bool { o.status == #delivered }).size()),
      (#cancelled, allOrders.filter(func(o : Order) : Bool { o.status == #cancelled }).size()),
    ];
    
    { totalOrders; totalRevenue; ordersByStatus };
  };

  public query ({ caller }) func getTopRestaurants(limit : Nat) : async [(Nat, Nat)] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can view top restaurants");
    };
    
    let allOrders = orders.values().toArray();
    let restaurantOrderCounts = Map.empty<Nat, Nat>();
    
    for (order in allOrders.vals()) {
      let count = restaurantOrderCounts.get(order.restaurantId).get(0);
      restaurantOrderCounts.add(order.restaurantId, count + 1);
    };
    
    let sorted = restaurantOrderCounts.entries().toArray().sort(
      func(a : (Nat, Nat), b : (Nat, Nat)) : Order.Order {
        Nat.compare(b.1, a.1) // Sort descending by order count
      }
    );
    
    if (sorted.size() <= limit) {
      sorted;
    } else {
      Array.tabulate<(Nat, Nat)>(limit, func(i) { sorted[i] });
    };
  };

  public query ({ caller }) func getTopFoodItems(limit : Nat) : async [(Nat, Nat)] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can view top food items");
    };
    
    let allOrders = orders.values().toArray();
    let foodItemCounts = Map.empty<Nat, Nat>();
    
    for (order in allOrders.vals()) {
      for (item in order.items.vals()) {
        let count = foodItemCounts.get(item.foodItemId).get(0);
        foodItemCounts.add(item.foodItemId, count + item.quantity);
      };
    };
    
    let sorted = foodItemCounts.entries().toArray().sort(
      func(a : (Nat, Nat), b : (Nat, Nat)) : Order.Order {
        Nat.compare(b.1, a.1) // Sort descending by order count
      }
    );
    
    if (sorted.size() <= limit) {
      sorted;
    } else {
      Array.tabulate<(Nat, Nat)>(limit, func(i) { sorted[i] });
    };
  };
};
