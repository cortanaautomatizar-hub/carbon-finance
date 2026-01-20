import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Outlet } from "react-router-dom";
import SupabaseStatusBanner from "./SupabaseStatusBanner";

export const Layout = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <SupabaseStatusBanner />
        <main className="flex-1 p-8 overflow-auto">
            <Outlet />
        </main>
      </div>
    </div>
  );
};