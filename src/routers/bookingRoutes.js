const express = require("express");

const {
  bookSlot,
  getSlotBookings,
  cancelBooking,
} = require("../controllers/bookingController");

const router = express.Router();

router.post("/slots/:id/book", bookSlot);

router.get("/slots/:id/bookings", getSlotBookings);

router.patch("/bookings/:id/cancel", cancelBooking);

module.exports = router;
