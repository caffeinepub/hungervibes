import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface MenuItem {
    id: bigint;
    name: string;
    isAvailable: boolean;
    description: string;
    restaurantId: bigint;
    imageUrl?: ExternalBlob;
    category: string;
    price: bigint;
}
export interface OrderItem {
    foodItemId: bigint;
    quantity: bigint;
    price: bigint;
}
export interface Restaurant {
    id: bigint;
    isApproved: boolean;
    ownerId: Principal;
    logo?: ExternalBlob;
    name: string;
    cuisineType: string;
    description: string;
    address: string;
    isSuspended: boolean;
    phone: string;
}
export interface Order {
    id: bigint;
    status: OrderStatus;
    deliveryAddress: string;
    couponCode?: string;
    paymentMethod: PaymentMethod;
    deliveryFee: bigint;
    isPaid: boolean;
    restaurantId: bigint;
    totalAmount: bigint;
    customerId: Principal;
    items: Array<OrderItem>;
    deliveryAgentId?: Principal;
    subtotal: bigint;
}
export interface UserProfile {
    name: string;
    role: Role;
    isVerified: boolean;
    isSuspended: boolean;
    phone: string;
}
export enum OrderStatus {
    picked_up = "picked_up",
    preparing = "preparing",
    cancelled = "cancelled",
    pending = "pending",
    rejected = "rejected",
    delivered = "delivered",
    accepted = "accepted",
    ready_for_pickup = "ready_for_pickup"
}
export enum PaymentMethod {
    cash = "cash",
    online = "online"
}
export enum Role {
    customer = "customer",
    delivery_agent = "delivery_agent",
    restaurant_owner = "restaurant_owner"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    _initializeAccessControlWithSecret(userSecret: string): Promise<void>;
    acceptOrder(orderId: bigint, isAccepted: boolean): Promise<void>;
    activateUser(userId: Principal): Promise<void>;
    addMenuItem(restaurantId: bigint, name: string, description: string, price: bigint, category: string, imageUrl: ExternalBlob | null): Promise<bigint>;
    approveRestaurant(restaurantId: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignDeliveryAgent(orderId: bigint): Promise<void>;
    cancelOrder(orderId: bigint): Promise<void>;
    createCoupon(code: string, discountPercent: bigint, maxUses: bigint, expiryDate: bigint): Promise<void>;
    createRestaurant(name: string, description: string, address: string, phone: string, cuisineType: string, logo: ExternalBlob | null): Promise<bigint>;
    deleteMenuItem(itemId: bigint): Promise<void>;
    getAllOrders(): Promise<Array<Order>>;
    getAllRestaurants(): Promise<Array<Restaurant>>;
    getAnalytics(): Promise<{
        ordersByStatus: Array<[OrderStatus, bigint]>;
        totalOrders: bigint;
        totalRevenue: bigint;
    }>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDeliveryAgentEarnings(agentId: Principal): Promise<bigint>;
    getMenuByRestaurant(restaurantId: bigint): Promise<Array<MenuItem>>;
    getMyRestaurant(): Promise<Restaurant | null>;
    getOrdersByCustomer(customerId: Principal): Promise<Array<Order>>;
    getOrdersByDeliveryAgent(agentId: Principal): Promise<Array<Order>>;
    getOrdersByRestaurant(restaurantId: bigint): Promise<Array<Order>>;
    getPlatformRevenue(): Promise<bigint>;
    getRestaurant(id: bigint): Promise<Restaurant | null>;
    getRestaurantEarnings(restaurantId: bigint): Promise<bigint>;
    getTopFoodItems(limit: bigint): Promise<Array<[bigint, bigint]>>;
    getTopRestaurants(limit: bigint): Promise<Array<[bigint, bigint]>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUsersByRole(role: Role): Promise<Array<UserProfile>>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(restaurantId: bigint, items: Array<OrderItem>, deliveryAddress: string, paymentMethod: PaymentMethod, couponCode: string | null): Promise<bigint>;
    registerUser(name: string, phone: string, role: Role): Promise<void>;
    rejectRestaurant(restaurantId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    suspendRestaurant(restaurantId: bigint): Promise<void>;
    suspendUser(userId: Principal): Promise<void>;
    updateMenuItem(itemId: bigint, name: string | null, description: string | null, price: bigint | null, category: string | null, isAvailable: boolean | null): Promise<void>;
    updateOrderStatus(orderId: bigint, status: OrderStatus): Promise<void>;
    updateRestaurant(restaurantId: bigint, name: string | null, description: string | null, address: string | null, phone: string | null, cuisineType: string | null): Promise<void>;
    validateCoupon(code: string): Promise<boolean>;
    verifyDeliveryAgent(agentId: Principal): Promise<void>;
}
