import React, { useState, useContext, useEffect } from "react";
import QRCode from "react-qr-code";
import axios from "../../config/api/axios";
import UserContext from "../../Hooks/UserContext";
import { toast } from "react-toastify";
import { FaQrcode, FaUsers, FaStop, FaSyncAlt } from "react-icons/fa";

const QRAttendanceGenerator = () => {
  const { paperList, user } = useContext(UserContext);
  const [qrData, setQrData] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [formData, setFormData] = useState({
    paper: "",
    date: "",
    hour: "",
  });
  const [loading, setLoading] = useState(false);
  const [activeSession, setActiveSession] = useState(null);

  useEffect(() => {
    let interval;
    if (activeSession) {
      // Poll for new submissions every 5 seconds
      interval = setInterval(() => {
        fetchSubmissions();
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeSession]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateQR = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/qr-attendance/generate", {
        teacher: user._id,
        paper: formData.paper,
        date: formData.date,
        hour: formData.hour,
      });

      setQrData(response.data);
      setSubmissions(response.data.submissions || []);
      setActiveSession(response.data.sessionId);
      toast.success("QR Code generated successfully!");
    } catch (error) {
      toast.error("Failed to generate QR code");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    if (!qrData?.sessionId) return;

    try {
      const response = await axios.get(
        `/qr-attendance/${qrData.sessionId}/submissions`
      );
      setSubmissions(response.data.submissions || []);
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
    }
  };

  const closeSession = async () => {
    if (!qrData?.sessionId) return;

    try {
      await axios.patch(`/qr-attendance/${qrData.sessionId}/close`);
      setActiveSession(null);
      toast.success("Session closed successfully!");
    } catch (error) {
      toast.error("Failed to close session");
    }
  };

  const refreshSubmissions = () => {
    fetchSubmissions();
    toast.info("Refreshed submissions");
  };

  return (
    <div className="qr-attendance-generator">
      <h2 className="mb-6 text-4xl font-bold text-violet-950 underline decoration-inherit decoration-2 underline-offset-4 dark:text-slate-400 md:text-6xl">
        QR Attendance
      </h2>

      {/* QR Generation Form */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
        <h3 className="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-200">
          Generate QR Code
        </h3>
        <form onSubmit={generateQR} className="gap-4 md:flex">
          <div className="flex w-full flex-col">
            <label className="m-1 text-gray-700 dark:text-gray-300" htmlFor="paper">
              Select Paper
            </label>
            <select
              className="mb-4 block h-10 rounded-md border-[1.5px] border-solid border-slate-400 p-1 pl-2 outline-none focus:border-violet-900 dark:border-slate-200 dark:bg-gray-700 dark:text-white"
              name="paper"
              id="paper"
              value={formData.paper}
              required
              onChange={handleInputChange}
            >
              <option value="" hidden>
                Select Paper
              </option>
              {paperList.map((paper, index) => (
                <option key={index} value={paper._id}>
                  {paper.paper}
                </option>
              ))}
            </select>
          </div>

          <div className="flex w-full flex-col">
            <label className="m-1 text-gray-700 dark:text-gray-300" htmlFor="date">
              Select Date
            </label>
            <input
              className="mb-4 block h-10 w-full rounded-md border-[1.5px] border-solid border-slate-400 p-1 pl-2 outline-none focus:border-violet-900 dark:border-slate-200 dark:bg-gray-700 dark:text-white"
              id="date"
              type="date"
              name="date"
              value={formData.date}
              required
              onChange={handleInputChange}
            />
          </div>

          <div className="flex w-full flex-col">
            <label className="m-1 text-gray-700 dark:text-gray-300" htmlFor="hour">
              Select Hour
            </label>
            <select
              className="mb-4 h-10 w-full rounded-md border-[1.5px] border-solid border-slate-400 p-1 pl-2 outline-none focus:border-violet-900 dark:border-slate-200 dark:bg-gray-700 dark:text-white"
              name="hour"
              id="hour"
              value={formData.hour}
              required
              onChange={handleInputChange}
            >
              <option value="" hidden>
                Select Hour
              </option>
              <option value="1">I</option>
              <option value="2">II</option>
              <option value="3">III</option>
              <option value="4">IV</option>
              <option value="5">V</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              className="mb-4 flex h-10 items-center gap-2 rounded-md border-[1.5px] border-solid border-violet-900 bg-slate-800 px-6 py-2 font-semibold tracking-wide text-slate-200 hover:bg-violet-900 focus:bg-violet-900 disabled:cursor-not-allowed disabled:opacity-50 dark:border-violet-300 dark:bg-violet-900 dark:text-violet-100"
              type="submit"
              disabled={loading}
            >
              <FaQrcode />
              {loading ? "Generating..." : "Generate QR"}
            </button>
          </div>
        </form>
      </div>

      {/* QR Code Display */}
      {qrData && (
        <div className="mb-8 grid gap-8 md:grid-cols-2">
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                QR Code
              </h3>
              {activeSession && (
                <button
                  onClick={closeSession}
                  className="flex items-center gap-2 rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                >
                  <FaStop size={12} />
                  Close Session
                </button>
              )}
            </div>
            <div className="flex justify-center">
              <div className="rounded-lg bg-white p-4">
                <QRCode value={qrData.qrUrl} size={200} />
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
              <p>Session ID: {qrData.sessionId}</p>
              <p>Expires: {new Date(qrData.expiresAt).toLocaleString()}</p>
              <p className="mt-2 break-all text-xs">{qrData.qrUrl}</p>
            </div>
          </div>

          {/* Submissions List */}
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                <FaUsers className="mr-2 inline" />
                Submissions ({submissions.length})
              </h3>
              <button
                onClick={refreshSubmissions}
                className="flex items-center gap-2 rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
              >
                <FaSyncAlt size={12} />
                Refresh
              </button>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {submissions.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400">
                  No submissions yet. Students can scan the QR code to submit attendance.
                </p>
              ) : (
                <div className="space-y-2">
                  {submissions.map((submission, index) => (
                    <div
                      key={index}
                      className="rounded border border-gray-200 p-3 dark:border-gray-600"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-800 dark:text-gray-200">
                            {submission.studentName}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Roll: {submission.rollNumber}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Class: {submission.className}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Dept: {submission.department}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(submission.submittedAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRAttendanceGenerator;
