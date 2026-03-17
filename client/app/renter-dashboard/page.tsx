import NavBar from "@/modules/home/sections/NavBar";
import Footer from "@/modules/home/sections/Footer";
import DashboardHeader from "@/modules/renter-dashboard/sections/DashboardHeader";
import RequestColumns from "@/modules/renter-dashboard/sections/RequestColumns";
import { requests } from "@/modules/renter-dashboard/mock/requests";

export default function Dashboard() {
  const counts = {
    enProceso: requests.filter((r) => r.status === "en_proceso").length,
    aprobadas: requests.filter((r) => r.status === "aprobada").length,
    rechazadas: requests.filter((r) => r.status === "rechazada").length,
  };

  return (
    <>
      <NavBar />
      <DashboardHeader counts={counts} />
      <RequestColumns requests={requests} />
      <Footer />
    </>
  );
}
