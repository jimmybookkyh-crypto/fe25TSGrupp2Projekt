import { useSearchParams, useNavigate } from "react-router";
import useFetch from "../utils/useFetch";
import type { Room, Booking } from "../interfaces/types";
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
  function isRoomFullyBooked(roomId: string) {
    if (!bookings) return false;
    const roomBookings = bookings.filter((b) => b.roomId === roomId);
    const bookedSlots = roomBookings.flatMap((b) => b.slots);

    return allSlots.every((slot) => bookedSlots.includes(slot));
  }
  const availableRooms = rooms?.filter((room) => !isRoomFullyBooked(room.id));

  return (
    <div>
      <section className="Lediga rum">
        <h1>Lediga rum</h1>
        <p>Datum: {date}</p>

        {availableRooms.length === 0 && (
          <p>Tyvärr har vi inga rum lediga önskat datum!</p>
        )}
      </section>
      <ul className="Rooms">
        {availableRooms.map((room) => (
          <li key={room.id}>
            <button
              onClick={() => navigate(`/resources/${room.id}?date=${date}`)}
            >
              <h2>{room.name}</h2>
              <p>Rummets kapacitet: {room.capacity} personer</p>
              <p>Rummets utrustning: {room.equipment}</p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

ResourceList.route = {
  path: "/resources",
  order: 2,
  label: "Se rum",
};
