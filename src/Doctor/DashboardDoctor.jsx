import React, { useEffect, useState } from "react";
import { db } from "../firebase"; // Ensure you have Firebase initialized
import { 
  collection, 
  query, 
  where, 
  onSnapshot 
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function DashboardDoctor() {
  const [data, setData] = useState({
    todayAppointments: 0,
    totalAppointments: 0,
    totalBalance: 0,
  });
  const [doctorId, setDoctorId] = useState(null);

  // Get current doctor id from auth
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setDoctorId(user.uid);
      }
    });
    return unsubscribe;
  }, []);

  // Set up real-time listeners for appointments and payments
  useEffect(() => {
    if (!doctorId) return;

    // Create today's date string in YYYY-MM-DD format
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const todayStr = `${yyyy}-${mm}-${dd}`;

    // Listen for changes in the appointments collection for the logged-in doctor
    const appointmentsRef = collection(db, "appointments");
    const appointmentsQuery = query(
      appointmentsRef,
      where("doctorId", "==", doctorId)
    );
    const unsubscribeAppointments = onSnapshot(appointmentsQuery, (snapshot) => {
      let totalAppointments = 0;
      let todayAppointments = 0;

      snapshot.forEach((docSnap) => {
        const appointment = docSnap.data();
        totalAppointments++;

        // Check if the appointment is scheduled for today
        if (appointment.date === todayStr) {
          if (appointment.time) {
            // Parse the appointment time (expected format "HH:mm")
            const [hours, minutes] = appointment.time.split(":").map(Number);
            const appointmentDateTime = new Date(
              yyyy,
              now.getMonth(),
              now.getDate(),
              hours,
              minutes
            );
            // Count only if the appointment time is still upcoming
            if (appointmentDateTime >= now) {
              todayAppointments++;
            }
          } else {
            todayAppointments++;
          }
        }
      });

      setData((prev) => ({
        ...prev,
        totalAppointments,
        todayAppointments,
      }));
    });

    // Listen for changes in the payments collection for the logged-in doctor
    const paymentsRef = collection(db, "payments");
    const paymentsQuery = query(
      paymentsRef,
      where("doctorId", "==", doctorId)
    );
    const unsubscribePayments = onSnapshot(paymentsQuery, (snapshot) => {
      let totalBalance = 0;
      snapshot.forEach((docSnap) => {
        const payment = docSnap.data();
        totalBalance += Number(payment.amount);
      });
      setData((prev) => ({ ...prev, totalBalance }));
    });

    // Cleanup listeners on unmount
    return () => {
      unsubscribeAppointments();
      unsubscribePayments();
    };
  }, [doctorId]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-black text-white p-6 rounded-lg shadow-lg">
          <p className="text-sm">Today Appointments</p>
          <h3 className="text-2xl font-bold">{data.todayAppointments}</h3>
        </div>
        <div className="bg-black text-white p-6 rounded-lg shadow-lg">
          <p className="text-sm">Total Appointments</p>
          <h3 className="text-2xl font-bold">{data.totalAppointments}</h3>
        </div>
        <div className="bg-black text-white p-6 rounded-lg shadow-lg">
          <p className="text-sm">Total Balance</p>
          <h3 className="text-2xl font-bold">
            ${data.totalBalance.toFixed(2)}
          </h3>
        </div>
      </div>
    </div>
  );
}

export default DashboardDoctor;
