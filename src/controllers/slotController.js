const EventSlot = require("../models/EventSlot");
const Booking = require("../models/Booking");

const createSlot = async (req, res) => {
  try {
    const { eventName, date, startTime, endTime, location, capacity } =
      req.body;

    if (
      !eventName ||
      !date ||
      !startTime ||
      !endTime ||
      !location ||
      !capacity
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (capacity <= 0) {
      return res.status(400).json({
        message: "Capacity must be greater than 0",
      });
    }

    const slot = await EventSlot.create({
      eventName,
      date,
      startTime,
      endTime,
      location,
      capacity,
    });

    res.status(201).json({
      message: "Event slot created successfully",
      slot,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create event slot",
      error: error.message,
    });
  }
};

const getAllSlots = async (req, res) => {
  try {
    const slots = await EventSlot.find();

    const result = await Promise.all(
      slots.map(async (slot) => {
        const activeBookings = await Booking.countDocuments({
          slotId: slot._id,
          bookingStatus: "Booked",
        });

        return {
          ...slot.toObject(),
          availableSeats: slot.capacity - activeBookings,
        };
      }),
    );

    res.status(200).json({
      message: "Event slots fetched successfully",
      slots: result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch event slots",
      error: error.message,
    });
  }
};

const getSingleSlot = async (req, res) => {
  try {
    const { id } = req.params;

    const slot = await EventSlot.findById(id);

    if (!slot) {
      return res.status(404).json({
        message: "Event slot not found",
      });
    }

    const bookingCount = await Booking.countDocuments({
      slotId: slot._id,
      bookingStatus: "Booked",
    });

    res.status(200).json({
      message: "Event slot fetched successfully",
      slot: {
        ...slot.toObject(),
        bookingCount,
        availableSeats: slot.capacity - bookingCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch event slot",
      error: error.message,
    });
  }
};

const deleteSlot = async (req, res) => {
  try {
    const { id } = req.params;

    const slot = await EventSlot.findById(id);

    if (!slot) {
      return res.status(404).json({
        message: "Event slot not found",
      });
    }

    const activeBookings = await Booking.countDocuments({
      slotId: id,
      bookingStatus: "Booked",
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        message: "Cannot delete slot with active bookings",
      });
    }

    await EventSlot.findByIdAndDelete(id);

    res.status(200).json({
      message: "Event slot deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete event slot",
      error: error.message,
    });
  }
};

module.exports = {
  createSlot,
  getAllSlots,
  getSingleSlot,
  deleteSlot,
};
