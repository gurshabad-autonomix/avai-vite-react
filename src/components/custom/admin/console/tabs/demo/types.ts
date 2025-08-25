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
  locationId?: string;
}

export interface DemosResponse {
  demos: Demo[];
  includeExpired: boolean;
  totalCount: number;
}
