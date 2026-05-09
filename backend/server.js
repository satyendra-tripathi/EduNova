
import { config } from "dotenv";


// ✅ Load env first
config({ path: "./config/config.env" });


import { app } from "./app.js";
import http from "http";
import { Server } from "socket.io";
import { Message } from "./models/Message.js";
import { sendToGeminiAI } from "./utils/sendToGemini.js";

import { connectDB } from "./database/db.js";

import { initSocket } from "./utils/socket.js";

// ✅ DB connect yahan
connectDB();

const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

server.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
});


