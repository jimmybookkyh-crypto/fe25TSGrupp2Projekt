import { useState } from "react";
import { useLocation } from "react-router";
import type { Booking, Room } from "../interfaces/types";

//Datum, rum och tid som är bokade.

//en funktion state variabel för useLcation och attribus som ska hämtas
//if för return som kollar vad det finns för state och gör en navigate till URL som replace som lägger in informationen som finns.

export default function BookingConfirmation() {
  const { state } = useLocation(); //Ta emot data från Booking.tsx
  const { room, booking } = state;
  console.log(room, booking);

  if (!booking || !room) {
    return <p>Laddar bokning...</p>;
  }


  async function handleCancel() {
  
    const response = await fetch(`/api/bookings/${booking.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ bookingStatus: "cancelled" })
    });

    if (!response.ok) return;

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
      <button type ="button"onClick={handleCancel} >
       Avboka
      </button>
    </div>
  );
}

BookingConfirmation.route = {
  path: "/bookingsConfirmation",
  order: 5,
  label: "Bokningsbekräftelse",
};
