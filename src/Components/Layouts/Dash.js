import { Link } from "react-router-dom";
import { GiBookshelf } from "react-icons/gi";
import { IoCalendarOutline } from "react-icons/io5";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { AiOutlineSchedule } from "react-icons/ai";
import { BiBookAdd } from "react-icons/bi";
import { RiUserAddLine } from "react-icons/ri";
import { PiBooks, PiUser, PiStudent } from "react-icons/pi";
import { useContext, useEffect } from "react";
import UserContext from "../../Hooks/UserContext";
import axios from "../../config/api/axios";

const Dash = () => {
  const { user, setPaperList } = useContext(UserContext);

  useEffect(() => {
    const getPapers = async () => {
      const response = await axios.get(`paper/${user.userType}/${user._id}`);
      setPaperList(response.data);
    };
    getPapers();
  }, [setPaperList, user]);

  return (
    <main className="relative self-center z-10">
      {/* Purple blur background bubbles */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-purple-500 opacity-20 blur-[120px] z-0"></div>
      <div className="absolute top-0 right-1/4 h-80 w-80 rounded-full bg-purple-500 opacity-20 blur-[100px] z-0"></div>
      <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-purple-500 opacity-20 blur-[100px] z-0"></div>

      <h2 className="m-6 font-spectral mx-auto text-center text-6xl font-bold text-[#081d58]">
        Shiksha Setu
      </h2>
      <div className="grid grid-cols-1 place-content-center gap-4 px-4 py-4 lg:grid-cols-2 lg:gap-6 xl:grid-cols-3">
        <CardLink
          to="./paper"
          icon={<GiBookshelf />}
          title="Materials"
          subtitle="Browse Resources and Notes"
        />
        <CardLink
          to="./attendance"
          icon={<IoCalendarOutline />}
          title="Presence Tracker"
          subtitle="Log or Modify Attendance"
        />
        <CardLink
          to="./internal"
          icon={<HiOutlineDocumentReport />}
          title="Assessment Marks"
          subtitle="Access or Update Scores"
        />
        <CardLink
          to="./time_schedule"
          icon={<AiOutlineSchedule />}
          title="Timetable"
          subtitle="Check or Edit Schedule"
        />

       {["HOD", "teacher"].includes(user.role) && (
  <CardLink
    to="./add_paper"
    icon={<BiBookAdd />}
    title="Upload Material"
    subtitle="Introduce New Subject Content"
  />
)}
{user.role === "HOD" && (
  <CardLink
    to="./approve_staff"
    icon={<RiUserAddLine />}
    title="Verify Faculty"
    subtitle="Review Faculty Registrations"
  />
)}


        {user.role === "student" && (
          <CardLink
            to="./join_paper"
            icon={<PiBooks />}
            title="Enroll Subject"
            subtitle="Join or Remove Materials"
          />
        )}

        <CardLink
          to="./profile"
          icon={user.role === "student" ? <PiStudent /> : <PiUser />}
          title="Account Info"
          subtitle="Manage Your Details"
        />
      </div>
    </main>
  );
};

// Reusable CardLink component with higher z-index
const CardLink = ({ to, icon, title, subtitle }) => (
  <Link
    to={to}
    className="z-20 flex items-center gap-4 rounded-xl bg-white/90 p-6 text-base shadow-md hover:bg-white hover:shadow-lg duration-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 dark:hover:text-blue-100 lg:text-lg"
  >
    <div className="text-[2.5rem] lg:text-[3.5rem] text-[#5b21b6]">{icon}</div>
    <div className="font-semibold text-[#081d58] dark:text-white">
      {title}
      <p className="text-sm font-normal lg:text-base text-slate-600 dark:text-slate-300">
        {subtitle}
      </p>
    </div>
  </Link>
);

export default Dash;
