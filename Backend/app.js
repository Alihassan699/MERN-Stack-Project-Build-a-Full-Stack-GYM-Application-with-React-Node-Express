import express from "express";
import { config } from "dotenv";
import cors from "cors";
import { sendMail } from "./utils/sendMail.js";  // Ensure the path is correct

const app = express();
const router = express.Router();

config({ path: "./config.env" });

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ["POST"],
    credentials: true,
    allowedHeaders: ["Content-Type"],
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

router.post("/send/mail", async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    await sendMail({
      email: "yesalihassan@gmail.com",
      subject: "GYM WEBSITE CONTACT",
      message,
      userEmail: email,
    });
    res.status(200).json({
      success: true,
      message: "Message Sent Successfully.",
    });
  } catch (error) {
    console.error("Error sending email:", error); // Add this line for logging
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

// Add this route to handle the root URL
router.get("/", (req, res) => {
  res.send("Welcome to the Gym Website Backend");
});

app.use(router);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
