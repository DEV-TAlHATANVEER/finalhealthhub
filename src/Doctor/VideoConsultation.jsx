import React, { useEffect, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { useLocation } from 'react-router-dom';
export default function VideoConsultation() {
  const { id } = useParams(); // appointment id from URL
  const location = useLocation();
  
  // Destructure the appointmentid from the state object
  const { appointmentid } = location.state || {};
  console.log(appointmentid);
  
  const navigate = useNavigate();
  const iframeContainerRef = useRef(null);
  const dailyFrameRef = useRef(null);
  const domain = "https://finalhealthhub.daily.co";

  useEffect(() => {
    // Fetch any required data from your backend before joining the call
    axios
      .get(`http://localhost:2000/video-call/${id}`)
      .then((res) => {
        if (res.status === 200) {
          // Create DailyIframe instance if it doesn't exist
          if (!dailyFrameRef.current) {
            dailyFrameRef.current = window.DailyIframe.createFrame({
              iframeStyle: {
                position: "relative",
                width: "100%",
                height: "100%",
                border: "0",
                zIndex: 9999,
              },
              showLeaveButton: true,
              showFullscreenButton: true,
            });

            // Append the Daily iframe to our container
            if (iframeContainerRef.current) {
              iframeContainerRef.current.appendChild(
                dailyFrameRef.current.iframe()
              );
            }

            // Listen for the event when the user leaves the meeting
            dailyFrameRef.current.on("left-meeting", async () => {
              try {
                // Get Firestore instance and update the appointment status to "completed"
                const db = getFirestore();
                const appointmentDocRef = doc(db, "appointments", appointmentid);
                await updateDoc(appointmentDocRef, { status: "completed" });
                console.log("Appointment status updated to completed");
              } catch (error) {
                console.error("Error updating appointment status:", error);
              }
              // Navigate to the desired route after call ends
              navigate("/doctor/appointment");
            });
          }
          // Join the call with the given URL
          dailyFrameRef.current.join({ url: `${domain}/${id}` });
        }
      })
      .catch((err) => console.log(err));

    // Cleanup: Destroy the DailyIframe instance on component unmount
    return () => {
      if (dailyFrameRef.current) {
        dailyFrameRef.current.destroy();
        dailyFrameRef.current = null;
      }
    };
  }, [id, navigate, domain]);

  // Handle the custom End Call button click
  const handleEndCall = () => {
    if (dailyFrameRef.current) {
      dailyFrameRef.current.leave();
    }
  };

  return (
    <div>
      <div ref={iframeContainerRef} style={{ width: "100%", height: "100vh" }} />
      <button onClick={handleEndCall}>End Call</button>
    </div>
  );
}
