import React from "react";
import CircleDesign from "./CircleDesign";
import { FaUniversity } from "react-icons/fa";
import { PiStudentThin, PiUserThin } from "react-icons/pi";
import { NavLink, Link, Outlet, useLocation } from "react-router-dom";

const RegisterLayout = () => {
  const location = useLocation().pathname;

  return (
    <main
      id="register"
      className="relative z-0 flex h-screen items-center justify-center bg-gradient-to-b from-blue-100 to-blue-50 py-8 text-gray-800"
    >
      <CircleDesign />
      <section className="my-8 flex h-fit w-fit animate-fadeInFast flex-col justify-start gap-6 rounded-md bg-white p-4 text-gray-800 shadow-md hover:shadow-lg duration-200 md:p-8 lg:flex-row xl:w-1/2">
        <div className="flex flex-col-reverse justify-between lg:flex-col">
          <h1 className="text-4xl font-semibold lg:text-5xl">
            {location === "/register/reg_staff" ? "Staff" : "Student"}
            <br />
            Registration
          </h1>

          <div className="m-2 flex flex-col-reverse gap-4 text-4xl md:text-5xl lg:flex-col">
            <div className="flex gap-4">
              <NavLink to="./reg_staff">
                <PiUserThin className="rounded-full border-2 border-blue-700 p-1" />
              </NavLink>
              <NavLink to="./reg_student">
                <PiStudentThin className="rounded-full border-2 border-blue-700 p-1" />
              </NavLink>
            </div>

            <Link
              className="flex items-center font-spectral text-xl font-semibold text-blue-800"
              to="../"
            >
              {/* <FaUniversity /> */}
              <p className="decoration-blue-700 decoration-2 hover:underline">
               Shiksha Setu
              </p>
            </Link>
          </div>
        </div>

        <div className="scrollWidth w-full">
          <Outlet />
        </div>
      </section>
    </main>
  );
};

export default RegisterLayout;
