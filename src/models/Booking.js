const mongoose = require("mongoose");

const eventSlotSchema = new mongoose.Schema(
  {
    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EventSlot",
      required: [true, "Event slot ID is required"],
    },

    studentName: {
      type: String,
      required: [true, "Student name is required"],
    },

    email: {
      type: String,
      required: [true, "Student email is required"],
    },

    rollNo: {
      type: String,
    },

    bookingStatus: {
      type: String,
      enum: ["booked", "cancelled"],
      default: "booked",
    },
  },
  {
    timestamps: true,
  },
);

const Booking = mongoose.model("Booking", eventSlotSchema);

module.exports = Booking;
