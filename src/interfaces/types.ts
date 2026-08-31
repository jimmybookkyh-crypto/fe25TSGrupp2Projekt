export interface Room {
id: number;
name: string;
capacity: number;
equipment: string;
}

export interface Booking {
id: string;
roomId: number;
date: string;
slots: string[];
email: string;
bookingStatus: "confirmed" | "cancelled";
}

export const allSlots = [
"09:00",
"10:00",
"11:00",
"12:00",
"13:00",
"14:00",
"15:00",
"16:00",
];
