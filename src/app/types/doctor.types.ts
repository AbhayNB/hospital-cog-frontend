export type DayOfWeek = 'MONDAY'|'TUESDAY'|'WEDNESDAY'|'THURSDAY'|'FRIDAY'|'SATURDAY'|'SUNDAY';

export interface DailyAvailability {
  dayOfWeek: DayOfWeek;
  startTime: string;   // "HH:mm:ss"
  endTime: string;     // "HH:mm:ss"
}

export interface WeeklyAvailabilityRequestDto {
  availability: DailyAvailability[];
  slotDurationInMinutes: number;
}

export interface SetAvailabilityResponseDto {
  doctorId: number;
  doctorName: string;
  message: string;
  slotsCreated: number;
}

export interface UpcomingAppointmentDto {
  appointmentId: number;
  patientName: string;
  appointmentDateTime: string; // ISO
  status: string;
}

export interface AppointmentActionResponseDto {
  appointmentId: number;
  doctorId: number;
  doctorName: string;
  patientId: number;
  patientName: string;
  newStatus: string;
  message: string;
  timestamp: string; // ISO
}

export interface ConsultationNoteDto {
  diagnosis: string;
  prescription: string;
  treatmentDetails?: string;
  remarks?: string;
}

export interface AppointmentHistoryDto {
  appointmentId: number;
  doctorId: number;
  doctorName: string;
  patientId: number;
  patientName: string;
  appointmentDateTime: string; // ISO
  consultationNote: {
    diagnosis: string;
    prescription: string;
    treatmentDetails?: string;
    remarks?: string;
  } | null;
}

export interface AddNoteResponseDto {
  noteId: number;
  appointmentId: number;
  message: string;
  noteDetails: ConsultationNoteDto & { createdAt?: string };
}