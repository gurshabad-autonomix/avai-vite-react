export interface OrgOwnerId {
  timestamp: number;
  date: string;
}

export interface Demo {
  orgId: string;
  businessName: string;
  website: string;
  address: string;
  createdAt: string;
  expired: boolean;
  expiresAt: string;
  orgOwnerId: OrgOwnerId;
  provisionedTwilioNumber: string;
}

export interface Customer {
  orgId: string;
  businessName: string;
  website: string;
  address: string;
  createdAt: string;
  orgOwnerId: string;
  provisionedTwilioNumber: string;
}

export interface DemosResponse {
  demos: Demo[];
  includeExpired: boolean;
  totalCount: number;
}

export interface CustomersResponse {
  customers: Customer[];
  totalCount: number;
}
