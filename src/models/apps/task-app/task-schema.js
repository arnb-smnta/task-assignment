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
      default: Date.now,
      validator: function (value) {
        return value > new Date(); // Ensure the due date is in the future
      },
      message: "Due date must be in the future",
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
