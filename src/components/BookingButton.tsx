interface BookingButtonProps {
  onBook: () => void;
  disabled?:  boolean;
}

export default function BookingButtonProps({ onBook, disabled = false, }: BookingButtonProps) {
  return (
    <button type="button" onClick={onBook} disabled = {disabled}>
      Bekräfta
    </button>
  );
}
