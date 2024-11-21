import { body, param } from "express-validator";
const createTaskValidator = () => {
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
  ];
};
