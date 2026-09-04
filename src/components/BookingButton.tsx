interface bookingButtonProps {
  onBook: () => void;
}

export default function bookingButtonProps({ onBook }: bookingButtonProps) {
  return (
    <button type="submit" onClick={onBook}>
      Bekräfta bokning
    </button>
  );
}
