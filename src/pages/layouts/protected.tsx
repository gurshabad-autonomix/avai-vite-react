import Navbar from "@/components/custom/navbar";
import { Outlet } from "react-router";

export default function ProtectedLayout() {
  return (
    <section className="flex flex-col">
      <Navbar />
      <div className="pt-28">
        <Outlet />
      </div>
    </section>
  );
}
