import { useState } from "react";
import { useParams, useSearchParams } from "react-router";
import useFetch from "../utils/useFetch";
import { allSlots, type Room, type Booking} from "../interfaces/types"


export default function ResourceDetails() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const date = searchParams.get("date");
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
 
  const { 
    data: room,
    loading: roomLoading,
    error: roomError 
  } = useFetch<Room>('api/resources/${id}');

  const { 
    data: slots,
    loading: slotsLoading,
    error: slotsError 
  } = useFetch<string[]>('api/resources/${id}/slots?date=${date}');

  const { 
    data: bookings,
    loading: bookingsLoading,
    error: bookingsError 
  } = useFetch<Booking>('api/bookings?roomId=${id}&date=${date}');


  if (roomLoading || slotsLoading || bookingsLoading) {
    return <p>Laddar data...</p>
  };

  if (roomError || slotsError || bookingsError) {
    return <p>Fel vid hämtning av data</p>
  };

  function isBooked(slot: string): boolean {
    return bookings?.some((booking) => 
      booking.slots.includes(slot)
    )?? false
  }

  function filterSlot(slot: string): void {
    setSelectedSlots((currentSlots) => {
      if (currentSlots.includes(slot)) {
        return currentSlots.filter((currentSlot) => currentSlot !== slot)
      }
      return [...currentSlots, slot]
    })
  }

  function  handleBooking(): void {
    console.log("test valda filer: ", selectedSlots); 
  } 
 
  return (
    <div>
      <section>
        <h2>{room?.name}</h2>
        <p>Datum: {date}</p>
        <p>Plats för: {room?.capacity}</p>
        <p>Utrustning: {room?.equipment}</p>
      </section>

      <section>
        <h2>Lediga tider</h2>
        <section>
          {allSlots.map((startTime) => {
            const hour = Number(startTime.slice(0, 2))
            const endTime = '${String(hour + 1).padStart(2, '0')}:00'
            const booked = isBooked(startTime)
            const available = slots?.includes(startTime) ?? false

            if(booked || !available) {
              return null;
            }
          })}
        </section>
      </section>
    </div>
  );
}

ResourceDetails.route = {
  path: "/resources/:id",
  order: 3,
  label: "Rum detaljer",
};