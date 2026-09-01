import { useSearchParams } from "react-router";
import useFetch from "../utils/useFetch";
import type { Booking, Room } from "../interfaces/types";

//Datum, rum och tid som är bokade.
//Ta emot data från Booking.tsx
//en funktion state variabel för useLcation och attribus som ska hämtas
//if för return som kollar vad det finns för state och gör en navigate till URL som replace som lägger in informationen som finns.

export default function BookingConfirmation() {
  const [params] = useSearchParams();
  const id = params.get("id");
  const [booking] = useFetch<Booking>(`api/bookings/${id}`);
  const [room] = useFetch<Room>(`api/rooms/${id}`);

  if (!booking || !room) {
    return <p>Laddar bokning...</p>;
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
        E-post: {booking.email}
      </p>
    </div>
  );
}

BookingConfirmation.route = {
  path: "/bookingsConfirmation",
  order: 5,
  label: "Bokningsbekräftelse",
};
