import { useState } from "react";
import { useLocation, Link } from "react-router";
import type { Booking, Room } from "../interfaces/types";

export default function BookingConfirmation() {
  const { state } = useLocation();
  if (!state) {
    return <p>Ett fel har uppstått</p>;
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
      body: JSON.stringify({ bookingStatus: "cancelled" }),
    });

    if (!response.ok) return;

    setCancelled(true);
    setShowConfirm(false);
  }

  return (
    <div>
      <section className="Bokningsbekräftelse">
        <h1>Bokningsbekräftelse</h1>
      </section>

      {cancelled ? (
        <>
          <h2>Din tid är nu avbokad!</h2>
          <p>För att boka på nytt gå till startsidan.</p>
          <Link to="/">
            <button type="button">Tillbaka till start</button>
          </Link>
        </>
      ) : (
        <>
          <p className="Rooms">
            Rummets namn: {room.name} <br />
            Datum: {booking.date} <br />
            Bokade tider: {booking.slots.join(", ")} <br />
            Utrustning: {room.equipment} <br />
            E-post: {booking.email} <br />
          </p>
          <button type="button" onClick={() => setShowConfirm(true)}>
            Avboka min bokning
          </button>

          {showConfirm && (
            <dialog open>
              <h2>Avbokning</h2>
              <p>Är du säker att du vill avboka din bokning?</p>
              <button type="button" onClick={handleCancel}>
                Ja
              </button>
              <button type="button" onClick={() => setShowConfirm(false)}>
                Nej
              </button>
            </dialog>
          )}
          <br />
          <Link to="/">
            <button type="button">Tillbaka till start</button>
          </Link>
        </>
      )}
    </div>
  );
}

BookingConfirmation.route = {
  path: "/bookingsConfirmation",
  order: 5,
  label: "Bokningsbekräftelse",
};
