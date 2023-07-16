import taskModel from "../../../../DB/model/Task.model.js";
import userModel from "../../../../DB/model/User.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import { SoftDeletedMessage } from "../../user/controller/user.js";

export const addTask = asyncHandler(async (req, res, next) => {
  SoftDeletedMessage(req, next);
  if (req.user.isOnline === true) {
    const { title, description, deadLine, assignTo } = req.body;
    const now = new Date();
    const selectedDeadline = new Date(deadLine);
    if (isNaN(selectedDeadline.getTime())) {
      return next(new Error("Invalid date"));
    }
    if (selectedDeadline <= now) {
      return next(new Error("date must be in the future!!"));
    }
    const findUser = await userModel.findById(assignTo);
    if (!findUser) {
      return next(new Error("user not found"));
    }
    const addTask = await taskModel.create({
      title,
      description,
      deadLine,
      assignTo,
      createdBy: req.user._id,
    });
    return res.json({ message: "Task created successfully", addTask });
  } else {
    return next(
      new Error("you're not allowed to add Task, please try again to login ")
    );
  }
});

export const getTask = asyncHandler(async (req, res, next) => {
  SoftDeletedMessage(req, next);
  if (req.user.isOnline === true) {
    const tasks = await taskModel
      .find({})
      .populate("createdBy", "-password")
      .populate("assignTo", "-password");
    return res.json({ message: "done", tasks });
  } else {
    return next(
      new Error("you're not allowed to get Task, please try again to login ")
    );
  }
});

export const getAllCreatedTasks = asyncHandler(async (req, res, next) => {
  SoftDeletedMessage(req, next);
  if (req.user.isOnline === true) {
    const tasks = await taskModel
      .find({ createdBy: req.user._id })
      .populate("createdBy", "-password")
      .populate("assignTo", "-password");
    return res.json({ message: "done", tasks });
  } else {
    return next(
      new Error("you're not allowed to get Task, please try again to login ")
    );
  }
});

export const getAllCreatedTasksNotLogin = asyncHandler(
  async (req, res, next) => {
    const {userId}=req.params
    const tasks = await taskModel
      .find({ createdBy:userId })
      .populate("createdBy", "-password")
      .populate("assignTo", "-password");
    return res.json({ message: "done", tasks });
  }
);

export const getAllTasksAssignToMe = asyncHandler(async (req, res, next) => {
  SoftDeletedMessage(req, next);
  if (req.user.isOnline === true) {
    const tasks = await taskModel
      .find({ assignTo: req.user._id })
      .populate("createdBy", "-password")
      .populate("assignTo", "-password");
    return res.json({ message: "done", tasks });
  } else {
    return next(
      new Error("you're not allowed to get Task, please try again to login ")
    );
  }
});

export const getLateTasks = asyncHandler(async (req, res, next) => {
  SoftDeletedMessage(req, next);
  if (req.user.isOnline === true) {
    const now = new Date();
    const tasks = await taskModel
      .find({
        $or: [{ assignTo: req.user._id }, { createdBy: req.user._id }],
        deadLine: { $lt: now },
      })
      .populate("createdBy", "-password")
      .populate("assignTo", "-password");
    return res.json({ message: "done", tasks });
  } else {
    return next(
      new Error("you're not allowed to get Task, please try again to login ")
    );
  }
});

export const getAllTasksAssignToAnyUser = asyncHandler(
  async (req, res, next) => {
    SoftDeletedMessage(req, next);
    if (req.user.isOnline === true) {
      const { userId } = req.params;
      const findUser = await userModel.findById(userId);
      if (!findUser) {
        return next(new Error("user not found"));
      }
      const tasks = await taskModel
        .find({
          assignTo: userId,
        })
        .populate("createdBy", "-password")
        .populate("assignTo", "-password");
      return res.json({ message: "done", tasks });
    } else {
      return next(
        new Error("you're not allowed to get Task, please try again to login ")
      );
    }
  }
);

export const getTasksNotDoneAfterDeadline = asyncHandler(
  async (req, res, next) => {
    SoftDeletedMessage(req, next);
    const now = new Date();
    if (req.user.isOnline === true) {
      const tasks = await taskModel.find({
        status: { $ne: "Done" },
        deadLine: { $lt: now },
      });

      return res.json({
        message: " tasks retrieved successfully",
        tasks,
      });
    } else {
      return next(
        new Error(
          "You're not allowed to view tasks. Please try again to log in."
        )
      );
    }
  }
);

export const updateTask = asyncHandler(async (req, res, next) => {
  SoftDeletedMessage(req, next);
  const { taskId } = req.params;
  const { title, description, deadLine, assignTo, status } = req.body;
  const now = new Date();
  const selectedDeadline = new Date(deadLine);
  const validStatuses = ["Done", "Todo", "Doing"];
  if (req.user.isOnline === true) {
    const task = await taskModel.findById(taskId);
    if (!task) {
      return next(new Error("Task not found"), { cause: 404 });
    }
    if (task.createdBy.toString() !== req.user._id.toString()) {
      return next(new Error("You are not authorized to update this task"), {
        cause: 403,
      });
    }
    const findUser = await userModel.findById(assignTo);
    if (!findUser) {
      return next(new Error("user not found"));
    }
    if (isNaN(selectedDeadline.getTime())) {
      return next(new Error("Invalid date"));
    }
    if (selectedDeadline <= now) {
      return next(new Error("date must be in the future!!"));
    }
    if (!validStatuses.includes(status)) {
      return next(
        new Error(
          "please enter valid status!! such as 'Done','Todo','Doing'  "
        ),
        { cause: 400 }
      );
    }

    const updateUser = await taskModel.updateOne(
      { _id: taskId },
      {
        title,
        description,
        deadLine,
        assignTo,
        status,
      }
    );
    return res.json({ message: "user updated sucessfully!", updateUser });
  } else {
    return next(
      new Error("you're not allowed to update, please try again to login ")
    );
  }
});

export const deleteTask = asyncHandler(async (req, res, next) => {
  SoftDeletedMessage(req, next);
  const { taskId } = req.params;
  if (req.user.isOnline === true) {
    const task = await taskModel.findById(taskId);

    if (!task) {
      return next(new Error("Task not found"), { cause: 404 });
    }
    if (task.createdBy.toString() !== req.user._id.toString()) {
      return next(new Error("You are not authorized to update this task"), {
        cause: 403,
      });
    }
    const deleteUser = await taskModel.findByIdAndRemove(taskId);
    return res.json({ message: "user deleted sucessfully!", deleteUser });
  } else {
    return next(
      new Error("you're not allowed to update, please try again to login ")
    );
  }
});
