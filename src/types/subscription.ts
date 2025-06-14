
export interface Subscription {
  id: string;
  companyName: string;
  clientName: string;
  logo?: string;
  whatsappNumber: string;
  websiteUrl: string;
  adminUrl: string;
  notionUrl: string;
  daysRemaining: number;
  paymentStatus: 'paid' | 'pending' | 'overdue';
  nextPaymentDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FilterOptions {
  search: string;
  paymentStatus: 'all' | 'paid' | 'pending' | 'overdue';
  sortBy: 'companyName' | 'daysRemaining' | 'nextPaymentDate';
  sortOrder: 'asc' | 'desc';
  showOnlyDueSoon: boolean;
}
