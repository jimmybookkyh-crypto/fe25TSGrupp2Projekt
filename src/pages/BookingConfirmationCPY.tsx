import { useState } from "react";
import { useLocation } from "react-router";
import type { Booking, Room } from "../interfaces/types";

interface ConfirmationState {
  room: Room;
  booking: Booking;
}

export default function BookingConfirmation() {
  const { state } = useLocation() as { state: ConfirmationState | null };

  if (!state) {
    return <p>Ingen bokning hittades.</p>;
  }

  const { room } = state;
  const [booking, setBooking] = useState<Booking>(state.booking);

  async function handleCancel() {
    const response = await fetch(`/api/bookings/${booking.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ bookingStatus: "cancelled" }),
    });

    if (!response.ok) return;

    const updated: Booking = await response.json();
    setBooking(updated);
  }

  return (
    <div>
      <section className="Bokningsbekräftelse">
        <h1>Bokningsbekräftelse</h1>
      </section>
      <p className="Rooms">
        Rum: {room.name} <br />
        Datum: {booking.date} <br />
        Tider: {booking.slots.join(", ")} <br />
        Utrustning: {room.equipment} <br />
        E-post: {booking.email} <br />
        BokningsId: {booking.id}
        <br />
        Status: {booking.bookingStatus}
      </p>

      {booking.bookingStatus === "confirmed" ? (
        <button type="button" onClick={handleCancel}>
          Avboka
        </button>
      ) : (
        <p>Den här bokningen är avbokad.</p>
      )}
    </div>
  );
}

BookingConfirmation.route = {
  path: "/bookingsConfirmation",
  order: 5,
  label: "Bokningsbekräftelse",
};
