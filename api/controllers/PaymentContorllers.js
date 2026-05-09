const Payment = require("../models/Payments");

// 1. Get all payments where status is NOT Cancelled and NOT Delivered
const getActivePayments = async (req, res) => {
  try {
    const payments = await Payment.find({
      status: { $nin: ["Delivered"] },
    });
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Get all payments where status is Delivered only
const getDeliveredPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ status: "Delivered" });
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Update/change the status of a payment by ID
const updatePaymentStatus = async (req, res) => {
  try {
    const { transactionId } = req.params; // ✅ email instead of id
    const { status } = req.body;

    const allowedStatus = ["Pending", "Preparing", "Out for Delivery", "Delivered"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId }, // ✅ find by transactionId
      { status },
      { new: true }
    );

    if (!updatedPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json(updatedPayment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getActivePayments, getDeliveredPayments, updatePaymentStatus };