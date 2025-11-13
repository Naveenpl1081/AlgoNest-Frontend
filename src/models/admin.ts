export interface ISubscriptionPlan {
    _id: string;
    planName: string;
    price: number;
    durationInMonths: number;
    description: string;
    status?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }