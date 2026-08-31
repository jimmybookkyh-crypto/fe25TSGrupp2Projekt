import { useState } from "react";
import { useNavigate } from "react-router";

export default function Start() {
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  function handleDateChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedDate = event.target.value;
    setDate(selectedDate);

    if (selectedDate) {
      navigate('/resources?date=${selectedDate}');
    }
  }

  return (
    <div>
      <h1>Boka Rum</h1>
      <p>Välj datum</p>
      <input
        type="date"
        value={date}
        onChange={handleDateChange}
      />
    </div>
  );
}

Start.route = {
  path: "/",
  order: 1,
  label: "Start",
};