import { TaskCategoryEnum } from "../../../constants";
import { Task } from "../../../models/apps/task-app/task-schema";
import { ApiError } from "../../../utils/ApiError";
import { ApiResponse } from "../../../utils/ApiResponse";
import { asyncHandler } from "../../../utils/asyncHandler";

const createTask = asyncHandler(async (req, res) => {
  const { title, description, dueDate, category, time } = req.body;

  //Just a safe check although valodator must catch it
  if (!title || !description || !dueDate) {
    throw new ApiError(
      "Title, Description and due date all three are required"
    );
  }

  const currentTimeStamp = Date.now(); // time in miliseconds

  const currentDate = new Date();

  const taskDueDate = new Date(dueDate);

  if (taskDueDate.getTime() < currentTimeStamp) {
    throw new ApiError(400, "Due date must be today or in future");
  }

  const currentDateString = currentDate.toISOString().split("T")[0];

  if (dueDate === currentDateString && time && time !== "FULL_DAY") {
    const [hours, minutes] = time.split(":").map(Number);
    //Time must be in (HH":"MM") format
    // Validate time format
    if (
      isNaN(hours) ||
      isNaN(minutes) ||
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59
    ) {
      throw new ApiError(400, "Invalid Time Format");
    }
    const taskDateTime = new Date(dueDate);
    taskDateTime.setHours(hours, minutes, 0, 0);

    //Ensure task time is not in the past

    if (taskDateTime < currentTimeStamp) {
      throw new ApiError(
        "Time must not be in the past if the due date is today"
      );
    }
  }

  if (time && time !== "FULL_DAY") {
    const [hours, minutes] = time.split(":").map(Number);
    //Time must be in (HH":"MM") format
    // Validate time format
    if (
      isNaN(hours) ||
      isNaN(minutes) ||
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59
    ) {
      throw new ApiError(400, "Invalid Time Format");
    }
  }

  const task = await Task.create({
    title: title,
    description,
    dueDate: taskDueDate,
    category: category || "OTHERS",
    time: time || "FULL_DAY",
    userId: req.user._id,
  });

  res.status(200).json(new ApiResponse(200, task, "Task created successfully"));
});

const viewAllTask = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ userId: req.user._id });
  //If no tasks are found that will be handled in the frontend with array length
  res
    .status(200)
    .json(new ApiResponse(200, tasks, "Tasks fetched succesfully"));
});

const markTaskasCompleted = asyncHandler(async (req, res) => {
  const { taskId } = req.body;

  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, "task not found");
  }

  if (task.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(401, "You are not authorised to mark this task");
  }

  if (task.completed === true) {
    throw new ApiError(400, "Task is already completed");
  }

  task.completed = true;

  //We can await this save but i am choosing no to await beacuse completed is shown in the frontend normally as soon as it clicked we should not hold the thread for this task

  await task.save();

  res.status(200).json(new ApiResponse(200, {}, "task succesfully updated"));
});

const editTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  if (task.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(401, "You are not authorised to view this task");
  }
  const { title, description, dueDate, time, category } = req.body;

  if (title) {
    task.title = title;
  }
  if (description) {
    task.description = description;
  }

  if (dueDate) {
    const newDueDate = new Date(dueDate);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); //Reset to the start of the day

    // Check if dueDate is in the past
    if (newDueDate < currentDate) {
      throw new ApiError(400, "Due date must be in the future or today");
    }
    task.dueDate = newDueDate;
  }

  if (category) {
    task.category = category;
  }

  if (time && time !== "FULL_DAY") {
    const [hours, minutes] = time.split(":").map(Number);
    if (
      hours.isNaN() ||
      minutes.isNaN() ||
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59
    ) {
      throw new ApiError(400, "Invalid time format");
    }

    const currentTimeStamp = Date.now();
    const taskDateTime = new Date(task.date);
    taskDateTime.setHours(hours, minutes, 0, 0);
    //getTime() gets the miliseconds since 1970 || new Date creates new instances so === will come false even if the date time is same
    if (taskDateTime.getTime() < currentTimeStamp.getTime()) {
      throw new ApiError("time must not be in the past if due date is today");
    }

    task.time = time;
  }

  if (time === "FULL_DAY") {
    task.time = time;
  }

  await task.save();
  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task succesfully fetched"));
});

const viewTaskDetails = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  if (task.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorised to view this task");
  }

  res.status(200).json(new ApiError(200, task, "Task fetched succesfully"));
});
const getTasksbyCategories = asyncHandler(async (req, res) => {
  const { category } = req.params;

  if (!Object.values(TaskCategoryEnum).includes(category)) {
    throw new ApiError(400, "Invalid Category");
  }

  const task = await Task.find({ category: category, userId: req.user._id });

  res.status(200).json(new ApiResponse(200, task, "Tasks fetched succesfully"));
});
const deleteTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  if (task.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorised to delete this Task");
  }

  await Task.deleteOne({ _id: taskId });

  res.status(200).json(new ApiResponse(200, {}, "Task deleted successfully"));
});
export {
  createTask,
  viewTaskDetails,
  editTask,
  markTaskasCompleted,
  viewAllTask,
  getTasksbyCategories,
  deleteTask,
};
