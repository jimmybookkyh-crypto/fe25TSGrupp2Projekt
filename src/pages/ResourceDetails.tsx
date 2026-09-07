import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import useFetch from "../utils/useFetch";
import { allSlots, type Room, type Booking, type SlotItem } from "../interfaces/types";
import GenericList from "../components/GenericList";

import BookingButton from "../components/BookingButton";
export default function ResourceDetails() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const date = searchParams.get("date");
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const navigate = useNavigate();

  const slotItems: SlotItem[] = allSlots.map((slot) => ({
    id: slot,
    slot,
  }));

  const [room, roomLoading] = useFetch<Room>(`/api/rooms/${id}`);

  const [bookings, bookingsLoading] = useFetch<Booking[]>(
    `/api/bookings?roomId=${id}&date=${date}`,
  );

  if (!room || !bookings || roomLoading || bookingsLoading) {
    return <p>Laddar data...</p>;
  }

  function isBooked(slot: string): boolean {
    return (
      bookings?.some(
        (booking) =>
          booking.bookingStatus === "confirmed" && booking.slots.includes(slot),
      ) ?? false
    );
  }

  function toggleSlot(slot: string): void {
    setSelectedSlots((currentSlots) => {
      if (currentSlots.includes(slot)) {
        return currentSlots.filter((currentSlot) => currentSlot !== slot);
      }
      return [...currentSlots, slot];
    });
  }

  function handleBooking(): void {
    navigate(
      `/bookings?roomId=${id}&date=${date}${selectedSlots.map((s) => `&slots=${s}`).join("")}`,
    );
  }
  function renderBooking({ id, slots }: Booking) {
    return (
      <article key={id}>
        <p>Bokningsid: {id}</p>
        <p>Bokade tider: {slots.join(", ")}</p>
      </article>
    );
  }
  return (
    <div>
      <section className="hero">
        <h1>Rumdetaljer</h1>
      </section>
      <section>
        <h2>{room.name}</h2>
        <p>Datum: {date}</p>
        <p>Plats för: {room.capacity}</p>
        <p>Utrustning: {room.equipment}</p>
      </section>

      <section>
        <h2>Lediga tider</h2>
        <section className="time-list">
          <GenericList
            items={slotItems}
            wrapList={false}
            renderItem={({ slot }) => {
              const hour = Number(slot.slice(0, 2));
              const endTime = `${String(hour + 1).padStart(2, "0")}:00`;
              const booked = isBooked(slot);
              if (booked) {
                return null;
              }
              const selected = selectedSlots.includes(slot);

              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => toggleSlot(slot)}
                  aria-pressed={selected}
                >
                  {slot} - {endTime}
                </button>
              );
            }}
          />

          {/* {allSlots.map((startTime) => {
            const hour = Number(startTime.slice(0, 2));
            const endTime = `${String(hour + 1).padStart(2, "0")}:00`;
            const booked = isBooked(startTime);
            if (booked) {
              return null;
            }
            const selected = selectedSlots.includes(startTime);

            return (
              <button
                key={startTime}
                type="button"
                className={`time-slot ${selected ? "selected" : ""}`}
                onClick={() => toggleSlot(startTime)}
                aria-pressed={selected}
              >
                {startTime} - {endTime}
              </button> */}
          {/* );
          })} */}
        </section>
      </section>
      <section>
        <BookingButton
          onBook={handleBooking}
          disabled={selectedSlots.length === 0}
        />
      </section>

      { bookings.length > 0 && (<>
          <h2>Redan bokade tider detta datum</h2>
          <GenericList items={bookings} renderItem={renderBooking} />
          </>)
      }
    </div>
  );
}

ResourceDetails.route = {
  path: "/resources/:id",
  order: 3,
  label: "Rum detaljer",
};
