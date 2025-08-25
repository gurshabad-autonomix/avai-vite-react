/**
 * Auth-related types shared across the app
 */

export const ROLE = {
  AVAI_INT_ADMIN: "AVAI_INT_ADMIN",
  AVAI_INT_SALES: "AVAI_INT_SALES",
  AVAI_EXT_ORG_OWNER: "AVAI_EXT_ORG_OWNER",
  AVAI_EXT_DEMO_USER: "AVAI_EXT_DEMO_USER",
  UNASSIGNED: "UNASSIGNED",
} as const;

export type UserRole = (typeof ROLE)[keyof typeof ROLE];

export interface MeResponse {
  email: string;
  fullName: string;
  role: UserRole;
  customerId?: string;
  onboarded: boolean;
}

export type E164 = string;

export interface CallLogSummary {
  id: string;
  streamSid: string;
  callSid: string;
  orgId?: string | null;
  locationId?: string | null;
  toNumber: E164;
  fromNumber?: E164 | null;
  fromNumberRaw?: string | null;
  forwardedFrom?: E164 | null;
  forwardedFromRaw?: string | null;
  createdAt: string;
  endedAt?: string | null;
  transcriptEntryCount: number;
  functionCallCount: number;
}

export interface CallLogListResponse {
  calls: CallLogSummary[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface TranscriptEntry {
  timestamp: string;
  speaker: "CALLER" | "AGENT" | string;
  text: string;
}

export interface FunctionCallEntry {
  timestamp: string;
  functionName: string;
  callId?: string;
  arguments: string;
  result?: string;
}

export interface CallLogDetailResponse extends CallLogSummary {
  transcript: TranscriptEntry[];
  functionCalls: FunctionCallEntry[];
}
