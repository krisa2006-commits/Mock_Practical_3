const EventSlot = require("../models/EventSlot");
const Booking = require("../models/Booking");

const bookSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const { studentName, email, rollNo } = req.body;

    if (!studentName || !email) {
      return res.status(400).json({
        message: "Student name and email are required",
      });
    }

    const slot = await EventSlot.findById(id);

    if (!slot) {
      return res.status(404).json({
        message: "Event slot not found",
      });
    }

    if (slot.status !== "Open") {
      return res.status(400).json({
        message: "This event slot is closed",
      });
    }

    const existingBooking = await Booking.findOne({
      slotId: id,
      email: email,
      bookingStatus: "Booked",
    });

    if (existingBooking) {
      return res.status(400).json({
        message: "This email has already booked this slot",
      });
    }

    const activeBookings = await Booking.countDocuments({
      slotId: id,
      bookingStatus: "Booked",
    });

    if (activeBookings >= slot.capacity) {
      return res.status(400).json({
        message: "Full Slot. No seats available",
      });
    }

    const booking = await Booking.create({
      slotId: id,
      studentName,
      email,
      rollNo,
      bookingStatus: "Booked",
    });

    res.status(201).json({
      message: "Slot booked successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to book slot",
      error: error.message,
    });
  }
};

const getSlotBookings = async (req, res) => {
  try {
    const { id } = req.params;

    const slot = await EventSlot.findById(id);

    if (!slot) {
      return res.status(404).json({
        message: "Event slot not found",
      });
    }

    const bookings = await Booking.find({
      slotId: id,
      bookingStatus: "Booked",
    });

    res.status(200).json({
      message: "Slot bookings fetched successfully",
      totalBookings: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (booking.bookingStatus === "Cancelled") {
      return res.status(400).json({
        message: "Booking is already cancelled",
      });
    }

    booking.bookingStatus = "Cancelled";

    await booking.save();

    res.status(200).json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to cancel booking",
      error: error.message,
    });
  }
};

module.exports = {
  bookSlot,
  getSlotBookings,
  cancelBooking,
};
