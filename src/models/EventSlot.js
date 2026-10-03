const mongoose = require("mongoose");

const eventSlotSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: [true, "Event name is required"],
    },

    date: {
      type: Date,
      required: [true, "Event date is required"],
    },

    startTime: {
      type: String,
      required: [true, "Event start time is required"],
    },

    endTime: {
      type: String,
      required: [true, "Event end time is required"],
    },

    location: {
      type: String,
      required: [true, "Event location is required"],
    },

    capacity: {
      type: Number,
      required: [true, "Event capacity is required"],
      min: [1, "Event capacity must be at least 1"],
    },

    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
  },
  {
    timestamps: true,
  },
);

const EventSlot = mongoose.model("EventSlot", eventSlotSchema);

module.exports = EventSlot;
