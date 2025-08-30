import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../config/api/axios";
import { toast } from "react-toastify";
import { FaUser, FaIdCard, FaGraduationCap, FaBuilding, FaClock, FaCheckCircle } from "react-icons/fa";

const QRAttendanceForm = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [sessionInfo, setSessionInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    studentName: "",
    rollNumber: "",
    className: "",
    department: "",
  });

  useEffect(() => {
    fetchSessionInfo();
  }, [sessionId]);

  const fetchSessionInfo = async () => {
    try {
      const response = await axios.get(`/qr-attendance/${sessionId}`);
      setSessionInfo(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error.response?.status === 404) {
        toast.error("Session not found");
      } else if (error.response?.status === 410) {
        toast.error("This attendance session has expired");
      } else {
        toast.error("Failed to load session information");
      }
      setTimeout(() => navigate("/"), 3000);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await axios.post(`/qr-attendance/${sessionId}/submit`, formData);
      toast.success("Attendance submitted successfully!");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error("You have already submitted attendance for this session");
      } else if (error.response?.status === 410) {
        toast.error("This session has expired");
      } else {
        toast.error("Failed to submit attendance. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-50 to-indigo-100">
        <div className="text-center">
          <div className="mb-6 h-16 w-16 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600 mx-auto"></div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-violet-900">Loading Session</h3>
            <p className="text-gray-600">Please wait while we fetch the attendance information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!sessionInfo) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-red-600">Session Not Found</h2>
          <p className="text-gray-600">
            This attendance session is either invalid or has expired.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-md px-4">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="mb-6 text-center">
            <h1 className="mb-2 text-2xl font-bold text-violet-900">
              QR Attendance
            </h1>
            <div className="text-sm text-gray-600">
              <p className="font-semibold">{sessionInfo.paper?.paper}</p>
              <p>Teacher: {sessionInfo.teacher?.name}</p>
              <p>Date: {sessionInfo.date}</p>
              <p>Hour: {sessionInfo.hour}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="studentName"
                className="block text-sm font-medium text-gray-700"
              >
                Student Name *
              </label>
              <input
                type="text"
                id="studentName"
                name="studentName"
                value={formData.studentName}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-violet-500"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label
                htmlFor="rollNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Roll Number *
              </label>
              <input
                type="text"
                id="rollNumber"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-violet-500"
                placeholder="Enter your roll number"
              />
            </div>

            <div>
              <label
                htmlFor="className"
                className="block text-sm font-medium text-gray-700"
              >
                Class *
              </label>
              <input
                type="text"
                id="className"
                name="className"
                value={formData.className}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-violet-500"
                placeholder="Enter your class (e.g., CSE-A, ECE-B)"
              />
            </div>

            <div>
              <label
                htmlFor="department"
                className="block text-sm font-medium text-gray-700"
              >
                Department *
              </label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-violet-500"
                placeholder="Enter your department (e.g., CSE, ECE, EEE)"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-md bg-violet-900 px-4 py-2 text-white hover:bg-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Attendance"}
            </button>
          </form>

          <div className="mt-4 text-center text-xs text-gray-500">
            <p>
              Session expires at:{" "}
              {new Date(sessionInfo.expiresAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRAttendanceForm;
