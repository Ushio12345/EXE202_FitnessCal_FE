export interface Package {
  packageId: number;
  name: string;
  durationMonths: number;
  price: number;
  packageType: string;
}

export interface Subscription {
  subscriptionId: number;
  userId: string;
  userName: string;
  userEmail: string;
  package: Package;
  priceAtPurchase: number;
  startDate: string;
  endDate: string;
  paymentStatus: string;
  isActive: boolean;
  daysRemaining: number;
  isUserBanned: boolean;
}

export interface SubscriptionResponse {
  success: boolean;
  message: string;
  data: Subscription[];
}
