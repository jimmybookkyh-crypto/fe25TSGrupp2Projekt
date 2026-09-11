import { Link } from "react-router";

export default function Header() {
  return (
    <header>
      <Link to="/">
        <h1>Trollsländan</h1>
      </Link>
    </header>
  );
}
