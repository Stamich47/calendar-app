import express from "express";
import bodyParser from "body-parser";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import cors from "cors"; // Import cors

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(bodyParser.json()); // Middleware to parse JSON requests

// Enable CORS for all origins (or restrict to specific origins)
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from your Vite frontend
  })
);

const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

app.post("/api/deleteAccount", async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ message: "Account deleted successfully" });
});

const PORT = 5000; // Use a different port from Vite
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
