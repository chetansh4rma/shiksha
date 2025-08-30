import { Outlet, Navigate, useLocation } from "react-router-dom";
import Header from "./Header";
import Nav from "./Nav";
import { useContext } from "react";
import UserContext from "../../Hooks/UserContext";

// Layout for the entire /dash route
const Layout = () => {
  const { user } = useContext(UserContext);
  const location = useLocation().pathname;

  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-b from-[#e4edff] to-[#d1e0ff] text-blue-950 dark:from-slate-900 dark:to-slate-950 dark:text-blue-100">
  {/* Purple blur spots */}
  <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-purple-500 opacity-20 blur-[100px]"></div>
  <div className="absolute -top-20 right-1/4 h-96 w-96 rounded-full bg-purple-500 opacity-20 blur-[100px]"></div>
  <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-purple-500 opacity-20 blur-[100px]"></div>

  <Header />
  <main className="mt-[3.15rem] flex h-[calc(100vh-3.15rem)] whitespace-nowrap">
    {location === "/dash" ? null : <Nav />}
    {user ? (
      <div className="outlet-border z-[1] mt-4 w-full overflow-y-auto rounded-xl bg-white p-6 text-blue-950 shadow-md backdrop-blur-sm dark:bg-[#fdfdff]/10 dark:text-blue-100 lg:mx-8">
        <Outlet />
      </div>
    ) : (
      <Navigate to="/" replace />
    )}
  </main>
</div>

  );
};

export default Layout;
