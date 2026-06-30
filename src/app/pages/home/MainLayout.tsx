import { Outlet } from "react-router-dom";
import { DashboardNavbar } from "../../components/dashboard/DashboardNavbar";

export default function MainLayout() {
  return (
    <>
      <DashboardNavbar />

      <main className="pt-20 px-6 bg-gray-50 ">
        <Outlet />
      </main>
    </>
  );
}
