import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import useFetch from "../utils/useFetch";
import { allSlots, type Room, type Booking } from "../interfaces/types";


export default function ResourceDetails() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const date = searchParams.get("date");
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const navigate = useNavigate();
 
  const [room, roomLoading] = useFetch<Room>(`/api/rooms/${id}`);

  const [bookings, bookingsLoading] = useFetch<Booking[]>(
    `/api/bookings?roomId=${id}&date=${date}`
  );

  if (!room || roomLoading || bookingsLoading) {
    return <p>Laddar data...</p>
  };

  function isBooked(slot: string): boolean {
    return bookings?.some((booking) => 
      booking.bookingStatus === "confirmed" &&
      booking.slots.includes(slot)
    )?? false
  }

  function toggleSlot(slot: string): void {
    setSelectedSlots((currentSlots) => {
      if (currentSlots.includes(slot)) {
        return currentSlots.filter((currentSlot) => currentSlot !== slot)
      }
      return [...currentSlots, slot]
    })
  }

  function handleBooking(): void {
    navigate(`/bookings?roomId=${id}&date=${date}${selectedSlots.map(s => `&slots=${s}`).join("")}`);      
  } 
 
  return (
    <div>
      <section>
        <h2>{room.name}</h2>
        <p>Datum: {date}</p>
        <p>Plats för: {room.capacity}</p>
        <p>Utrustning: {room.equipment}</p>
      </section>

      <section>
        <h2>Lediga tider</h2>
        <section>
          {allSlots.map((startTime) => {
            const hour = Number(startTime.slice(0, 2))
            const endTime = `${String(hour + 1).padStart(2, "0")}:00`;
            const booked = isBooked(startTime)

            if (booked) {
              return null;
            }
            const selected = selectedSlots.includes(startTime);

            return (
              <button
                key={startTime}
                type="button"
                onClick={() => toggleSlot(startTime)}
                aria-pressed={selected}>
                {startTime} - {endTime}
              </button>
            );
          })}
        </section>
      </section>
      <section>
        <button
          type="button"
          disabled={selectedSlots.length === 0}
          onClick={handleBooking}>
          Boka valda tider
        </button>
      </section>
    </div>
  );
}

ResourceDetails.route = {
  path: "/resources/:id",
  order: 3,
  label: "Rum detaljer",
};