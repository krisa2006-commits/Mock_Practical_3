const express = require("express");

const {
  createSlot,
  getAllSlots,
  getSingleSlot,
  deleteSlot,
} = require("../controllers/slotController");

const router = express.Router();

router.post("/", createSlot);

router.get("/", getAllSlots);

router.get("/:id", getSingleSlot);

router.delete("/:id", deleteSlot);

module.exports = router;
