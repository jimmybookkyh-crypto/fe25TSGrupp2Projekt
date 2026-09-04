import { useState } from "react";
import { useLocation, Link } from "react-router";
import type { Booking, Room } from "../interfaces/types";
//Datum, rum och tid som är bokade.

//en funktion state variabel för useLcation och attribus som ska hämtas
//if för return som kollar vad det finns för state och gör en navigate till URL som replace som lägger in informationen som finns.

export default function BookingConfirmation() {
  const { state } = useLocation(); //Ta emot data från Booking.tsx
  if (!state) { // Felhantering om sidan skulle laddas utan bokningsdata följer med
    return <p>Ett fel har uppstått</p>
  }
  
  const { room, booking } = state as {
    room: Room;
    booking: Booking;
  };
  if (!booking || !room) {
    return <p>Laddar bokning...</p>;
  }

  const [showConfirm, setShowConfirm] = useState(false);
  const [cancelled, setCancelled] = useState(false); 

  async function handleCancel() {
  
    const response = await fetch(`/api/bookings/${booking.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ bookingStatus: "cancelled" })
    });

    if (!response.ok) return;

    setCancelled(true);
    setShowConfirm(false);

}


  return (
    <div>
      <section className="hero">
        <h1>Bokningsbekräftelse</h1>
      </section>

      {cancelled ? (
        <>
          <p>Tiden avbokad</p>
          <Link to="/">
            <button type="button">
              Till start
            </button>
          </Link>
        </>
      ) : 
      <>
      <p className="booking-details">
        Rum: {room.name} <br />
        Datum: {booking.date} <br />
        Tider: {booking.slots.join(", ")} <br />
        Utrustning: {room.equipment} <br />
        E-post: {booking.email} <br />
          </p>

        <div className="BookingConfirmationPageBtn">
          <Link to="/">
            <button type="button">
             Till start
            </button>
             </Link>
           <button type ="button"
            onClick={() => setShowConfirm(true)}>
            Avboka
            </button>
        </div>

      {showConfirm && (
  <dialog open className="BookingConfirmationPageCancelBtn">
    <p>Avboka?</p>
    <div className="cancelBtn">
      <button type="button" onClick={handleCancel}>
        Ja
      </button>
      <button type="button" onClick={() => setShowConfirm(false)}>
        Nej
      </button>
    </div>
  </dialog>
)}
      
          </>
    }
    </div>
  );
}

BookingConfirmation.route = {
  path: "/bookingsConfirmation",
  order: 5,
  label: "Bokningsbekräftelse",
};
