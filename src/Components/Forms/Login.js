import { useContext, useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import UserContext from "../../Hooks/UserContext";
import axios from "../../config/api/axios";
import { FaUniversity } from "react-icons/fa";
import { PiStudentThin, PiUserThin, PiSpinnerGapBold } from "react-icons/pi";
import CircleDesign from "../Layouts/CircleDesign";
import ErrorStrip from "../ErrorStrip";

const Login = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [error, setError] = useState("");
  const [buttonText, setButtonText] = useState("Login");
  const [message, setMessage] = useState("");

  const slowLoadingIndicator = () => {
    setTimeout(() => {
      setMessage(
        "NOTE: Web services on the free instance type may spin down after 15 minutes of inactivity. The first request after inactivity might be delayed as the service spins back up."
      );
    }, 4000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (userType === "") {
      setError({
        response: {
          data: "Select User Type",
        },
      });
    } else {
      setButtonText("Loading...");
      slowLoadingIndicator();
      try {
        const response = await axios.post("/auth/login/" + userType, {
          username,
          password,
        });
        await setUser({ ...response.data, userType });
        localStorage.setItem(
          "userDetails",
          JSON.stringify({ ...response.data, userType })
        );
      } catch (err) {
        setError(err);
        setButtonText("Login");
      }
    }
  };

  useEffect(() => {
    if ("userDetails" in localStorage) {
      setUser(JSON.parse(localStorage.getItem("userDetails")));
    }
    setUserType("");
    setMessage("");
  }, [setUserType, setMessage, setUser]);

  return (
    <>
      {!user?._id ? (
        <main className="relative z-0 flex h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-blue-50 text-gray-800">
          {message && !error && (
            <header className="absolute top-0 w-full bg-blue-200 p-2 text-xs text-blue-800 lg:text-sm">
              {message}
            </header>
          )}
          <CircleDesign />
          <section className="z-0 mb-4 flex items-center gap-2 text-6xl font-bold text-blue-800 md:text-7xl lg:gap-4">
            <h1 className="font-spectral">Shiksha Setu</h1>
          </section>

          <section className="z-0 w-[65%] justify-self-center rounded-lg bg-white border border-gray-300 shadow-md p-2 sm:w-[min(50%,360px)] md:w-[min(40%,360px)] xl:w-[min(23%,360px)]">
            <form
              className="tracking-wide placeholder:text-gray-400"
              onSubmit={(e) => handleLogin(e)}
            >
              <section className="flex flex-col items-center justify-start">
                <div className="flex w-full text-lg font-semibold">
                  <label
                    className="radio relative flex w-1/2 cursor-pointer flex-col items-center rounded-tl-lg p-4 border border-r-0 border-blue-300"
                    htmlFor="staff"
                  >
                    Staff
                    <input
                      className="absolute opacity-0"
                      type="radio"
                      value="staff"
                      id="staff"
                      name="userType"
                      onClick={() => setUserType("staff")}
                    />
                  </label>
                  <label
                    className="radio relative flex w-1/2 cursor-pointer flex-col items-center rounded-tr-lg p-4 border border-l-0 border-blue-300"
                    htmlFor="student"
                  >
                    Student
                    <input
                      className="absolute opacity-0"
                      type="radio"
                      value="student"
                      id="student"
                      name="userType"
                      onClick={() => setUserType("student")}
                    />
                  </label>
                </div>

                <div className="w-full flex justify-center p-2 text-7xl">
                  {userType === "student" ? (
                    <PiStudentThin className="rounded-full border-2 border-blue-700 p-1" />
                  ) : userType === "staff" ? (
                    <PiUserThin className="rounded-full border-2 border-blue-700 p-1" />
                  ) : (
                    <FaUniversity className="rounded-lg border-2 border-blue-700 p-1" />
                  )}
                </div>
              </section>

              <section className="rounded-b-lg px-4 pb-4">
                {userType ? (
                  <>
                    <input
                      className="mb-4 block h-10 w-full rounded-md border border-gray-300 p-2 outline-none focus:border-blue-600"
                      placeholder="username"
                      id="username"
                      type="text"
                      required
                      autoComplete="off"
                      name="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                      className="mb-4 block h-10 w-full rounded-md border border-gray-300 p-2 outline-none focus:border-blue-600"
                      placeholder="password"
                      id="password"
                      type="password"
                      required
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      className="mb-2 flex h-10 w-full items-center justify-center gap-1 rounded-md border border-blue-700 bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:cursor-wait"
                      type="submit"
                      value="Login"
                      disabled={buttonText !== "Login"}
                    >
                      {!(buttonText === "Login") && (
                        <PiSpinnerGapBold className="animate-spin" />
                      )}
                      {buttonText}
                    </button>
                  </>
                ) : (
                  <p className="w-full bg-blue-100 border border-blue-300 text-blue-800 rounded p-4 my-8 text-center">
                    Select User Type
                  </p>
                )}

                {error ? <ErrorStrip error={error} /> : ""}

                <p className="inline text-gray-600">Click to </p>
                <button
                  type="button"
                  className="font-semibold text-blue-600 underline hover:text-blue-800"
                  onClick={() => navigate("./register/reg_student")}
                >
                  Register
                </button>
              </section>
            </form>
          </section>
        </main>
      ) : (
        <Navigate to="./dash" />
      )}
    </>
  );
};

export default Login;
