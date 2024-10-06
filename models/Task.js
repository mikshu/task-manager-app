const { default: mongoose } = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, default: "Pending" },
    dueDate: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
