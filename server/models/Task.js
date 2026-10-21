import mongoose from "mongoose";

export const TASK_PRIORITIES = ["low", "medium", "high"];
export const TASK_STATUSES = ["pending", "in-progress", "completed"];

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [120, "Title must be at most 120 characters"],
    },
    description: { type: String, trim: true, maxlength: 1000, default: "" },
    subject: { type: String, trim: true, maxlength: 60, default: "General" },
    priority: { type: String, enum: TASK_PRIORITIES, default: "medium" },
    status: { type: String, enum: TASK_STATUSES, default: "pending" },
    dueDate: { type: Date, default: null },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

taskSchema.index({ user: 1, status: 1, dueDate: 1 });
taskSchema.index({ user: 1, createdAt: -1 });

// Keep completedAt in sync with status
taskSchema.pre("save", function () {
  if (this.isModified("status")) {
    this.completedAt = this.status === "completed" ? new Date() : null;
  }
});

taskSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
