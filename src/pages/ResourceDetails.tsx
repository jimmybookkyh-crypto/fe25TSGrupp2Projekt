import { useState } from "react";
import { useParams, useSearchParams } from "react-router";
import useFetch from "../utils/useFetch";
import { allSlots, type Room, type Booking} from "../interfaces/types"


export default function ResourceDetails() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const date = searchParams.get("date");
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
 
 
 
  return (
    <div>
      <h1>ResourceDetails</h1>
    </div>
  );
}

ResourceDetails.route = {
  path: "/resources/:id",
  order: 3,
  label: "Rum detaljer",
};