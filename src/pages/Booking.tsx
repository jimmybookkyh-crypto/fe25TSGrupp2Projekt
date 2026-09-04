import { useSearchParams, useNavigate } from "react-router";
import { useState } from "react";
import useFetch from "../utils/useFetch";
import type { Room } from "../interfaces/types";

import BookingButton from "../components/BookingButton";

export default function Booking() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const roomId = params.get("roomId");
  const date = params.get("date");
  const slots = params.getAll("slots");

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const [room, loading] = useFetch<Room>(`/api/rooms/${roomId}`);

  if (!room || loading) {
    return <p>Laddar...</p>;
  }

  function getEndTime(startTime: string) {
    const hour = Number(startTime.slice(0, 2));
    return `${String(hour + 1).padStart(2, "0")}:00`;
  }

  async function handleSubmit(): Promise<void> {

    const bookingsResponse = await fetch(`/api/bookings?roomId=${roomId}&date=${date}`);
    const existingBookings = await bookingsResponse.json();

    const alreadyBookedSlots = existingBookings.flatMap((booking: any) => booking.slots);

    const conflictingSlots = slots.filter((slot) => alreadyBookedSlots.includes(slot));

    if (conflictingSlots.length > 0) {
      const formattedConflicts = conflictingSlots.map(
        (slot) => `${slot} - ${getEndTime(slot)}`
      );

      setError(
        `Följande tider är redan bokade: ${formattedConflicts.join(", ")}`
      );
      return;
    } 

    const newBooking = {
      roomId,
      date,
      slots,
      email,
      bookingStatus: "confirmed",
    };

    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(newBooking),
    });

    const savedBooking = await response.json();

    navigate(`/bookingsConfirmation`, {
      state: { room: room, booking: savedBooking },
    });
  }
  return (
    <div>
      <h1>Boknings detaljer</h1>

      <section className="BookingDetails">
        <h2>Rummets namn: {room.name}</h2>
        <p>Datum: {date}</p>
        <p>Plats för: {room.capacity}</p>
        <p>Utrustning: {room.equipment}</p>
      </section>
      <section className="BookingDetails">
        <h3>Valda tider:</h3>
        <ul>
          {slots.map((start) => (
            <li key={start}>
              {start} - {getEndTime(start)}
            </li>
          ))}
        </ul>
      </section>

      {error && (
        <section className="BookingDetails" style={{ color: "red", fontWeight: 600 }}>
          <p>{error}</p>

          <button
            type="button"
            onClick={() => navigate("/")}
          >
            Påbörja ny bokning
          </button>
        </section>
      )}

      <form onSubmit={(e) => e.preventDefault()}> 
        <label>
          E-postadress:
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <BookingButton onBook= {handleSubmit} disabled= {!email}/>
      </form>
    </div>
  );
}

Booking.route = {
  path: "/bookings",
  order: 4,
  label: "Boknings detaljer",
};
