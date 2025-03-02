import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Retrieve the payment ID from the route
import { Paper, Typography, Grid, TextField, Button, Divider } from "@mui/material";
// Import necessary Firestore functions from Firebase v9 modular SDK
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

const PaymentInvoice = () => {
  const { paymentId } = useParams();
  const [paymentData, setPaymentData] = useState(null);
  const [appointmentData, setAppointmentData] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [labReportData, setLabReportData] = useState(null);
  const [doctorCommission, setDoctorCommission] = useState("");
  const [labCommission, setLabCommission] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!paymentId) {
      console.error("No payment ID provided in route parameters.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch payment document
        const paymentDocRef = doc(db, "payments", paymentId);
        const paymentSnap = await getDoc(paymentDocRef);
        if (paymentSnap.exists()) {
          const payment = paymentSnap.data();
          setPaymentData(payment);

          // Fetch appointment details using the appointmentid from payment
          if (payment.appointmentid) {
            const appointmentDocRef = doc(db, "appointments", payment.appointmentid);
            const appointmentSnap = await getDoc(appointmentDocRef);
            if (appointmentSnap.exists()) {
              setAppointmentData(appointmentSnap.data());
            }
          }

          // Fetch patient details
          if (payment.patientId) {
            const patientDocRef = doc(db, "patients", payment.patientId);
            const patientSnap = await getDoc(patientDocRef);
            if (patientSnap.exists()) {
              setPatientData(patientSnap.data());
            }
          }

          // Optionally, fetch lab report details if applicable
          if (payment.labReportId) {
            const labReportDocRef = doc(db, "labreports", payment.labReportId);
            const labReportSnap = await getDoc(labReportDocRef);
            if (labReportSnap.exists()) {
              setLabReportData(labReportSnap.data());
            }
          }
        } else {
          console.error("Payment document does not exist.");
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [paymentId]);

  const handleSaveCommission = async () => {
    try {
      // Save commission settings to a dedicated "commissions" collection
      await addDoc(collection(db, "commissions"), {
        paymentId,
        doctorCommission: parseFloat(doctorCommission),
        labCommission: parseFloat(labCommission),
        createdAt: new Date(),
      });
      alert("Commission rates saved successfully!");
    } catch (error) {
      console.error("Error saving commissions: ", error);
      alert("Error saving commissions");
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!paymentData || !appointmentData || !patientData) {
    return <Typography>Data not found.</Typography>;
  }

  return (
    <Paper
      elevation={3}
      style={{
        padding: 20,
        maxWidth: 800,
        margin: "20px auto",
        borderRadius: "10px",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Payment Invoice
      </Typography>
      <Divider style={{ margin: "20px 0" }} />

      {/* Payment Details */}
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="subtitle1">Billing Email:</Typography>
          <Typography>{paymentData.billingEmail}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle1">Transaction ID:</Typography>
          <Typography>{paymentId}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle1">Amount:</Typography>
          <Typography>${paymentData.amount}</Typography>
        </Grid>
      </Grid>

      <Divider style={{ margin: "20px 0" }} />

      {/* Appointment & Patient Details */}
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="subtitle1">Appointment Date:</Typography>
          <Typography> {appointmentData.date ? appointmentData.date.toDate().toLocaleString() : 'N/A'}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle1">Appointment Time:</Typography>
          <Typography> {appointmentData.slotPortion }</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle1">Location:</Typography>
          <Typography>{appointmentData.location}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle1">Patient Email:</Typography>
          <Typography>{patientData.email}</Typography>
        </Grid>
      </Grid>

      {labReportData && (
        <>
          <Divider style={{ margin: "20px 0" }} />
          <Typography variant="h6" gutterBottom>
            Lab Report Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="subtitle1">Test Name:</Typography>
              <Typography>{labReportData.testname}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1">Category:</Typography>
              <Typography>{labReportData.category}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1">Report Price:</Typography>
              <Typography>${labReportData.price}</Typography>
            </Grid>
          </Grid>
        </>
      )}

      <Divider style={{ margin: "20px 0" }} />

      {/* Commission Settings */}
      <Typography variant="h6" gutterBottom>
        Commission Settings
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="Doctor Commission (%)"
            type="number"
            variant="outlined"
            fullWidth
            value={doctorCommission}
            onChange={(e) => setDoctorCommission(e.target.value)}
          />
        </Grid>
  
      </Grid>
      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: 20 }}
        onClick={handleSaveCommission}
      >
        Save Commission Rates
      </Button>
    </Paper>
  );
};

export default PaymentInvoice;
