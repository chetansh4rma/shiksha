import React, { useContext } from "react";
import { FiLogOut } from "react-icons/fi";
import { Link } from "react-router-dom";
import UserContext from "../../Hooks/UserContext";
import { toast } from "react-toastify";

const Header = () => {
  const { setUser, setPaperList } = useContext(UserContext);

  const logout = () => {
    setUser("");
    setPaperList([]);
    localStorage.clear();
    localStorage.removeItem("paperNames");
    toast.info("Logged Out");
  };

  return (
    <header className="absolute top-0 z-10 flex w-full items-center justify-between bg-white/60 backdrop-blur-md border-b border-blue-300 px-6 py-3 shadow-md">
      <Link
        to="/dash"
        className="flex items-center text-2xl sm:text-3xl font-spectral font-bold text-[#081d58] tracking-wide"
      >
        <h1 className="hover:underline underline-offset-[4px] decoration-[2.5px] decoration-[#7c3aed]">
          Shiksha Setu
        </h1>
      </Link>

      <Link
        to="/"
        onClick={logout}
        className="flex items-center gap-2 rounded-md bg-[#081d58] px-4 py-[6px] text-white text-sm font-medium shadow-sm hover:bg-[#112b7a] duration-200"
      >
        <span>Logout</span>
        <FiLogOut className="text-base" />
      </Link>
    </header>
  );
};

export default Header;
