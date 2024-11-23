import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    dueDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Compare only the date
          return value >= today; // Ensure the due date is today or in the future
        },
        message: "Due date must be greater than or equal to the current date",
      },
    },
    time: {
      type: String, // Store time in "HH:mm" format or use "FULL_DAY"
      default: "FULL_DAY", // Default for full-day tasks
      required: true,
      validate: {
        validator: function (value) {
          if (value === "FULL_DAY") return true; // Allow "FULL_DAY" for full-day tasks
          const [hours, minutes] = value.split(":").map(Number);
          if (
            isNaN(hours) ||
            isNaN(minutes) ||
            hours < 0 ||
            hours > 23 ||
            minutes < 0 ||
            minutes > 59
          ) {
            return false;
          }

          const now = new Date();
          const taskDateTime = new Date(this.dueDate);
          taskDateTime.setHours(hours, minutes, 0, 0);

          return taskDateTime >= now; // Ensure the due date and time are not in the past
        },
        message: "Time must be valid or set as 'FULL_DAY', and not in the past",
      },
    },
    category: {
      type: String,
      enum: ["WORK", "PERSONAL", "SHOPPING", "OTHERS"],
      default: "OTHERS",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Task = mongoose.model("Task", taskSchema);
