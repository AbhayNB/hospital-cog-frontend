export type SlotStatus = 'AVAILABLE' | 'BOOKED';

export interface TimeSlotDto {
  startTime: string;  // "HH:mm:ss"
  endTime: string;    // "HH:mm:ss"
  status: SlotStatus;
}

export interface DoctorAvailabilityMap {
  [yyyyMmDd: string]: TimeSlotDto[];
}

export interface DoctorSearchResult {
  id: number;
  fullName: string;
  specialization: string;
  location: string;
  rating: number;
  availability: DoctorAvailabilityMap;
}

export interface AppointmentRequestDto {
  doctorId: number;
  appointmentDateTime: string; // ISO "YYYY-MM-DDTHH:mm:ss"
}

export interface AppointmentDetails {
  id: number;
  patientId: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  appointmentDateTime: string; // ISO
  status: 'SCHEDULED' | 'CANCELLED' | 'COMPLETED' | string;
  createdAt: string; // ISO
}

export interface AppointmentBookResponse {
  success: boolean;
  message: string;
  appointmentDetails?: AppointmentDetails;
  waitlistAvailable?: boolean;
}

export interface ApiMessageResponse {
  success: boolean;
  message: string;
}

export interface WaitlistJoinResponse {
  success: boolean;
  message: string;
  data?: {
    waitlistId: number;
    patientId: number;
    patientName: string;
    preferredDate: string; // "YYYY-MM-DD"
    requestedAt: string;   // ISO
  };
}