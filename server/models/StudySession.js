import mongoose from "mongoose";

export const SESSION_STATUSES = ["planned", "completed", "missed"];
export const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

const toMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const studySessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
      maxlength: [60, "Subject must be at most 60 characters"],
    },
    date: { type: Date, required: [true, "Date is required"] },
    startTime: {
      type: String,
      required: [true, "Start time is required"],
      match: [TIME_PATTERN, "Start time must be HH:MM (24-hour)"],
    },
    endTime: {
      type: String,
      required: [true, "End time is required"],
      match: [TIME_PATTERN, "End time must be HH:MM (24-hour)"],
    },
    durationMinutes: { type: Number, default: 0 },
    notes: { type: String, trim: true, maxlength: 500, default: "" },
    status: { type: String, enum: SESSION_STATUSES, default: "planned" },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

studySessionSchema.index({ user: 1, date: -1 });
studySessionSchema.index({ user: 1, status: 1 });

studySessionSchema.pre("validate", function () {
  if (
    this.startTime &&
    this.endTime &&
    TIME_PATTERN.test(this.startTime) &&
    TIME_PATTERN.test(this.endTime)
  ) {
    const duration = toMinutes(this.endTime) - toMinutes(this.startTime);
    if (duration <= 0) {
      this.invalidate("endTime", "End time must be after start time");
      return;
    }
    this.durationMinutes = duration;
  }
});

studySessionSchema.pre("save", function () {
  if (this.isModified("status")) {
    this.completedAt = this.status === "completed" ? new Date() : null;
  }
});

studySessionSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const StudySession = mongoose.model("StudySession", studySessionSchema);

export default StudySession;
