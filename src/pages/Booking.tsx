import { useSearchParams, useNavigate } from "react-router";
import { useState } from "react";
import useFetch from "../utils/useFetch";
import type { Room } from "../interfaces/types";

export default function Booking() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const roomId = params.get("roomId");
  const date = params.get("date");
  const slots = params.getAll("slots");

  const [email, setEmail] = useState("");

  const [room, loading] = useFetch<Room>(`/api/rooms/${roomId}`);

  if (!room || loading) {
    return <p>Laddar...</p>;
  }
  
  function getEndTime(startTime: string) {
    const hour = Number(startTime.slice(0, 2));
    return `${String(hour + 1).padStart(2, "0")}:00`;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
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
      state: { id: savedBooking.id },
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

      <form onSubmit={handleSubmit}>
        <label>
          E-postadress:
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <button type="submit">
          Bekräfta bokning
        </button>
      </form>
    </div >
  );
}


  Booking.route = {
    path: "/bookings",
    order: 4,
    label: "Boknings detaljer",
  };
