import { useSearchParams, useNavigate } from "react-router";
import useFetch from "../utils/useFetch";
import type { Room, Booking } from "../interfaces/types";
import { allSlots } from "../interfaces/types";

export default function ResourceList() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const date = params.get("date");

  const [rooms] = useFetch<Room[]>("http://localhost:3000/rooms");
  const [bookings] = useFetch<Booking[]>(
    `http://localhost:3000/bookings?date=${date}`,
  );
  if (!rooms) {
    return <p>Kunde inte hämta data!</p>; //guard
  }
  function isRoomFullyBooked(roomId: number) {
    if (!bookings) return false;
    const roomBookings = bookings.filter((b) => b.roomId === roomId);
    const bookedSlots = roomBookings.flatMap((b) => b.slots);

    return allSlots.every((slot) => bookedSlots.includes(slot));
  }
  const availableRooms = rooms?.filter((room) => !isRoomFullyBooked(room.id));

  return (
    <div>
      <h1>Lediga rum</h1>
      <p>Datum: {date}</p>
      {availableRooms.length === 0 && (
        <p>Tyvärr har vi inga rum lediga önskat datum!</p>
      )}
      <ul>
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
