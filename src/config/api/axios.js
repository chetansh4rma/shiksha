import axios from "axios";

export default axios.create({
  baseURL:
    'https://shikshaserver.onrender.com',
  headers: { "Content-Type": "application/json" },
});
