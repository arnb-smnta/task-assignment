import { Task } from "../../../models/apps/task-app/task-schema";
import { ApiError } from "../../../utils/ApiError";
import { ApiResponse } from "../../../utils/ApiResponse";
import { asyncHandler } from "../../../utils/asyncHandler";

const createTask = asyncHandler(async (req, res) => {
  const { title, description, dueDate, category } = req.body;

  //Just a safe check although valodator must catch it

  if (!title || !description) {
    throw new ApiError(400, "Title and description both are required");
  }

  const task = await Task.create({
    title: title,
    description,
    dueDate: dueDate || Date.now(),
    category: category,
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

  task.save();

  res.status(200).json(new ApiResponse(200, {}, "task succesfully updated"));
});

const viewtask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  if (task.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(401, "You are not authorised to view this task");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task succesfully fetched"));
});

const editTaskDetails = asyncHandler(async (req, res) => {});

const editTask = asyncHandler(async (req, res) => {});
