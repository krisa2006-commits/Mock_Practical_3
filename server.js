const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDatabase = require("./src/config/db");

const slotRoutes = require("./src/routers/slotRouters");
const bookingRoutes = require("./src/routers/bookingRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDatabase();

app.use("/api/slots", slotRoutes);

app.use("/api", bookingRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Event Slot Booker API is working",
  });
});

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
