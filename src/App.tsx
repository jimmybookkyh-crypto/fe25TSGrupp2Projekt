import { Outlet } from "react-router";

import Header from "./partials/Header.tsx"
import Footer from "./partials/Footer.tsx"

export default function App() {
  return <>
    <Header />
    <main>
      <Outlet />
    </main>
    <Footer />
  </>;
}
