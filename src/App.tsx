import { Outlet } from "react-router";
import "./index.css"; 

export default function App() {
  return <>
    <main>
      <Outlet />
    </main>
  </>;
}
