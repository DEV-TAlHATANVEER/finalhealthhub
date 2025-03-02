import React, { useState, useEffect, useMemo } from "react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import MuiTable from "../mui/TableMuiCustom";

const AdminDashboard = () => {
  // State to hold Firestore collections
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [bloodbanks, setBloodbanks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all data from Firestore once on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const doctorsSnapshot = await getDocs(collection(db, "doctors"));
        const doctorsData = doctorsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDoctors(doctorsData);

        const patientsSnapshot = await getDocs(collection(db, "patients"));
        const patientsData = patientsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPatients(patientsData);

        const notificationsSnapshot = await getDocs(collection(db, "notifications"));
        const notificationsData = notificationsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotifications(notificationsData);

        const bloodbanksSnapshot = await getDocs(collection(db, "bloodbanks"));
        const bloodbanksData = bloodbanksSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBloodbanks(bloodbanksData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching Firestore data: ", error);
      }
    };

    fetchData();
  }, []);

  // Helper function to group by year-month
  const groupByMonth = (items, dateField, isTimestamp = true) => {
    const grouped = {};
    items.forEach((item) => {
      if (item[dateField]) {
        // Convert Firestore timestamp or date string to Date object
        const d = item[dateField]?.toDate
          ? item[dateField].toDate()
          : new Date(item[dateField]);
        const year = d.getFullYear();
        // Months are zero-indexed; add 1 and pad to 2 digits
        const month = (d.getMonth() + 1).toString().padStart(2, "0");
        const key = `${year}-${month}`;
        grouped[key] = (grouped[key] || 0) + 1;
      }
    });
    // Convert grouped object to sorted array with formatted labels
    return Object.keys(grouped)
      .sort()
      .map((key) => {
        const [year, month] = key.split("-");
        // Create a Date to format the month/year label
        const dateObj = new Date(year, month - 1);
        const label = dateObj.toLocaleString("default", {
          month: "short",
          year: "numeric",
        });
        return { date: label, count: grouped[key] };
      });
  };

  // Prepare aggregated data for the charts
  const doctorChartData = useMemo(() => {
    return groupByMonth(doctors, "createdAt", true);
  }, [doctors]);

  const patientChartData = useMemo(() => {
    // Assuming patients.date is a string (e.g. "2024-06-01")
    return groupByMonth(patients, "createdAt", true);
  }, [patients]);

  // Summary stats for the top cards
  const summaryData = [
    { title: "Total Doctors", count: doctors.length, icon: "👨‍⚕️" },
    { title: "Total Patients", count: patients.length, icon: "🧑‍⚕️" },
    { title: "Total Notifications", count: notifications.length, icon: "🔔" },
    { title: "Total Bloodbanks", count: bloodbanks.length, icon: "🏥" },
  ];

  // Prepare notifications table data
  const notificationTableHeaders = {
    email: "Email",
    message: "Message",
    date: "Date",
    type: "Type",
    read: "Read",
  };

  const notificationTableData = notifications.map((notif) => {
    let dateStr = "";
    if (notif.createdAt) {
      const d = notif.createdAt?.toDate
        ? notif.createdAt.toDate()
        : new Date(notif.createdAt);
      dateStr = d.toLocaleDateString();
    }
    return {
      email: notif.email,
      message: notif.message,
      date: dateStr,
      type: notif.type,
      read: notif.read ? "Yes" : "No",
    };
  });

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {summaryData.map((card) => (
          <div
            key={card.title}
            className="bg-white p-4 rounded-lg shadow flex items-center"
          >
            <div className="text-3xl mr-4">{card.icon}</div>
            <div>
              <p className="text-gray-500">{card.title}</p>
              <p className="text-2xl font-bold">{card.count}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Doctor Registrations Chart */}
        <div className="bg-white p-5 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-blue-900 mb-4">
            Doctor Registrations
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart
              data={doctorChartData}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <CartesianGrid stroke="#e0e0e0" />
              <XAxis dataKey="date" scale="band" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" barSize={30} fill="#413ea0" />
              <Line type="monotone" dataKey="count" stroke="#ff7300" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Patient Registrations Chart */}
        <div className="bg-white p-5 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-blue-900 mb-4">
            Patient Registrations
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart
              data={patientChartData}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <CartesianGrid stroke="#e0e0e0" />
              <XAxis dataKey="date" scale="band" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" barSize={30} fill="#413ea0" />
              <Line type="monotone" dataKey="count" stroke="#ff7300" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Notifications Table */}
      <div className="bg-white p-5 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-blue-900 mb-4">
          Recent Notifications
        </h2>
        <MuiTable
          th={notificationTableHeaders}
          td={notificationTableData}
          styleTableContainer={{ boxShadow: "none", borderRadius: "10px" }}
          styleTableThead={{ backgroundColor: "#F8F9FA" }}
          styleTableTh={{
            fontWeight: "bold",
            color: "#333",
            fontSize: "16px",
          }}
          styleTableTbody={{ backgroundColor: "#FFFFFF" }}
          cellStyles={{
            email: { fontSize: "18px", color: "#444" },
            message: { fontSize: "18px", color: "#444" },
            date: { fontSize: "18px", color: "#444" },
            type: { fontSize: "18px", color: "#444" },
            read: { fontSize: "18px", color: "#444" },
          }}
          rowStyles={{ backgroundColor: "#FFFFFF", fontSize: "16px", color: "#333" }}
          headerRounded={true}
          rowRounded={true}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
