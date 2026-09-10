import { useSearchParams, useNavigate } from "react-router";
import useFetch from "../utils/useFetch";
import type { Room, Booking } from "../interfaces/types";
import GenericList from "../components/GenericList";
import { allSlots } from "../interfaces/types";

export default function ResourceList() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const date = params.get("date");

  const [rooms] = useFetch<Room[]>(`api/rooms`);
  const [bookings] = useFetch<Booking[]>(`api/bookings?date=${date}`);
  if (!rooms || !bookings) {
    return <p>Laddar</p>; //guard
  }
  if (!date) {
    return <p>Inget datum valt.</p>; //DATE NULL förbättringsförslag 
  }
  function isRoomFullyBooked(roomId: string) {
    if (!bookings) return false;
    const roomBookings = bookings.filter(
      (b) => b.roomId === roomId && b.bookingStatus === "confirmed",
    );
    const bookedSlots = roomBookings.flatMap((b) => b.slots);

    return allSlots.every((slot) => bookedSlots.includes(slot));
  }
  const availableRooms = rooms?.filter((room) => !isRoomFullyBooked(room.id));

  // Updaterat key id tagit bort punkt 6 i förbättrings förslag
  function renderRoom({ id, name, capacity, equipment }: Room) {
    return (
      <article>
        <button onClick={() => navigate(`/resources/${id}?date=${date}`)}>
          <h2>{name}</h2>
          <p>Rummets kapacitet: {capacity} personer</p>
          <p>Rummets utrustning: {equipment}</p>
        </button>
      </article>
    );
  }

  return (
    <div>
      <section className="hero">
        <h1>Lediga rum</h1>
        <p>Datum: {date}</p>

        {availableRooms.length === 0 && (
          <p>Tyvärr har vi inga rum lediga önskat datum!</p>
        )}
      </section>
      <ul className="Rooms">
        <GenericList items={availableRooms} renderItem={renderRoom} />
      </ul>
    </div>
  );
}

ResourceList.route = {
  path: "/resources",
  order: 2,
  label: "Se rum",
};
