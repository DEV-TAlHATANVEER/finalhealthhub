import React, { useState, useEffect } from "react";
import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPaymentsAndDetails = async () => {
      try {
        // Fetch all payments
        const paymentsSnapshot = await getDocs(collection(db, "payments"));
        const paymentsList = paymentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Enrich each payment with patient and doctor details
        const enrichedPayments = await Promise.all(
          paymentsList.map(async (payment) => {
            // Fetch patient details
            let patientDetails = {};
            if (payment.patientId) {
              const patientDocRef = doc(db, "patients", payment.patientId);
              const patientSnap = await getDoc(patientDocRef);
              if (patientSnap.exists()) {
                patientDetails = patientSnap.data();
              }
            }

            // Fetch doctor details (assuming a "doctors" collection exists)
            let doctorDetails = {};
            if (payment.doctorId) {
              const doctorDocRef = doc(db, "doctors", payment.doctorId);
              const doctorSnap = await getDoc(doctorDocRef);
              if (doctorSnap.exists()) {
                doctorDetails = doctorSnap.data();
              }
            }

            return {
              ...payment,
              patientName: patientDetails.name || "N/A",
              patientEmail: patientDetails.email || "N/A",
              doctorName: doctorDetails.fullName || "N/A",
              doctorEmail: doctorDetails.email || "N/A",
            };
          })
        );

        setPayments(enrichedPayments);
      } catch (error) {
        console.error("Error fetching payments and details: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentsAndDetails();
  }, []);

  if (loading) {
    return <Typography>Loading payments...</Typography>;
  }

  if (!payments.length) {
    return <Typography>No payments found.</Typography>;
  }

  return (
    <Paper style={{ padding: 20, margin: "20px auto", maxWidth: 1200 }}>
      <Typography variant="h5" gutterBottom>
        Payments List
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Transaction ID</TableCell>
              <TableCell>Patient Name</TableCell>
              <TableCell>Patient Email</TableCell>
              <TableCell>Doctor Name</TableCell>
              <TableCell>Doctor Email</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map(payment => (
              <TableRow
                key={payment.id}
                hover
                style={{ cursor: "pointer" }}
                // onClick={() => navigate(`/invoice/${payment.id}`)}
              >
                <TableCell>{payment.id}</TableCell>
                <TableCell>{payment.patientName}</TableCell>
                <TableCell>{payment.patientEmail}</TableCell>
                <TableCell>{payment.doctorName}</TableCell>
                <TableCell>{payment.doctorEmail}</TableCell>
                <TableCell>${payment.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default PaymentList;
