/**
 * Dashboard
 *
 * Provides a high-level overview of employee attendance data.
 * This component:
 * - Fetches employee and attendance data from backend APIs
 * - Computes derived metrics on the client side
 * - Displays attendance insights using charts and summary cards
 *
 * Dashboard Sections:
 * - Summary cards (total employees, present today, absent today)
 * - Date-wise attendance trend (line chart)
 * - Department-wise presence distribution (bar chart)
 *
 * Assumptions:
 * - Attendance status is either "Present" or "Absent"
 * - Attendance records are date-based and unique per employee
 * - Backend APIs may return paginated or non-paginated responses
 */

import { useEffect, useState } from "react";
import API from "../services/api";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
  }, []);

  const fetchEmployees = async () => {
    const res = await API.get("employees/");
    setEmployees(res.data.results ?? res.data);
  };

  const fetchAttendance = async () => {
    const res = await API.get("attendance/");
    setAttendance(res.data.results ?? res.data);
  };

  /* DATE WISE ATTENDANCE*/

  const dateMap = {};

  attendance.forEach((rec) => {
    if (!dateMap[rec.date]) {
      dateMap[rec.date] = { Present: 0, Absent: 0 };
    }
    dateMap[rec.date][rec.status]++;
  });

  const dateLabels = Object.keys(dateMap).sort();

  const dateWiseData = {
    labels: dateLabels,
    datasets: [
      {
        label: "Present",
        data: dateLabels.map((d) => dateMap[d].Present),
        borderColor: "green",
        backgroundColor: "rgba(0,128,0,0.4)",
      },
      {
        label: "Absent",
        data: dateLabels.map((d) => dateMap[d].Absent),
        borderColor: "red",
        backgroundColor: "rgba(255,0,0,0.4)",
      },
    ],
  };

  /* DEPARTMENT WISE*/

  const deptMap = {};

  employees.forEach((emp) => {
    deptMap[emp.department] = 0;
  });

  attendance.forEach((rec) => {
    if (rec.status === "Present") {
      const emp = employees.find((e) => e.id === rec.employee);
      if (emp) {
        deptMap[emp.department]++;
      }
    }
  });

  const deptData = {
    labels: Object.keys(deptMap),
    datasets: [
      {
        label: "Present Count",
        data: Object.values(deptMap),
        backgroundColor: "steelblue",
      },
    ],
  };

  /*SUMMARY*/

  const today = new Date().toISOString().split("T")[0];

  const todayRecords = attendance.filter((a) => a.date === today);

  const todayPresent = todayRecords.filter(
    (a) => a.status === "Present"
  ).length;

  const todayAbsent = todayRecords.filter(
    (a) => a.status === "Absent"
  ).length;

  return (
    <div className="container">
      <h2>Attendance Dashboard</h2>

      {/* SUMMARY CARDS */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div className="card">Total Employees: {employees.length}</div>
        <div className="card" style={{ color: "green" }}>
          Present Today: {todayPresent}
        </div>
        <div className="card" style={{ color: "red" }}>
          Absent Today: {todayAbsent}
        </div>
      </div>

      {/* DATE WISE */}
      <div className="card">
        <h3>Date-wise Attendance</h3>
        <Line data={dateWiseData} />
      </div>

      {/* DEPARTMENT WISE */}
      <div className="card">
        <h3>Department-wise Presence</h3>
        <Bar data={deptData} />
      </div>
    </div>
  );
}

export default Dashboard;
