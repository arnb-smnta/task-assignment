import { body, param } from "express-validator";
export const createTaskValidator = () => {
  return [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required")
      .isLength({ min: 3 })
      .withMessage("title must be of min 3 characters"),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required"),
    body("dueDate")
      .notEmpty()
      .withMessage("Due date is required")
      .isISO8601()
      .withMessage("Due date must be a valid date in YYYY-MM-DD format")
      .custom((value) => {
        const dueDate = new Date(value);
        const today = new Date();
        if (dueDate < today) {
          throw new Error("Due date cannot be in the past");
        }
        return true;
      }),
  ];
};
