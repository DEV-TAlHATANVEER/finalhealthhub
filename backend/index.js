// index.js
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 1;

import dotenv from "dotenv";
dotenv.config();

import fetch from "node-fetch";
import express from "express";
import logger from "morgan";
import cors from "cors";

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const API_KEY = process.env.daily_API_KEY;

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  Authorization: "Bearer " + API_KEY,
};

const getRoom = (room) => {
  return fetch(`https://api.daily.co/v1/rooms/${room}`, {
    method: "GET",
    headers,
  })
    .then((res) => res.json())
    .then((json) => json)
    .catch((err) => console.error("error:" + err));
};

const createRoom = (room) => {
  return fetch("https://api.daily.co/v1/rooms", {
    method: "POST",
    headers,
    body: JSON.stringify({
      name: room,
      properties: {
        enable_screenshare: true,
        enable_chat: true,
        start_video_off: true,
        start_audio_off: false,
        lang: "en",
      },
    }),
  })
    .then((res) => res.json())
    .then((json) => json)
    .catch((err) => console.error("error:" + err));
};

app.get("/video-call/:id", async (req, res) => {
  const roomId = req.params.id;
  const room = await getRoom(roomId);

  if (room.error) {
    const newRoom = await createRoom(roomId);
    res.status(200).send(newRoom);
  } else {
    res.status(200).send(room);
  }
});

const port =  2000;
app.listen(port, () => console.log(`Server Running on port ${port}`));

export default app;
