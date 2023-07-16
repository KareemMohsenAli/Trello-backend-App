import { Router } from "express";
import * as taskContoller from "./contoller/task.js"
import auth from "../../middleware/auth.js";
const router=Router()
router.post("/addtask", auth,taskContoller.addTask);
router.get("/gettask", auth,taskContoller.getTask);
router.get("/getallcreatedtasks", auth,taskContoller.getAllCreatedTasks);
router.get("/getAllCreatedTasksNotLogin/:userId",taskContoller.getAllCreatedTasksNotLogin);
router.get("/getalltasksassigntome", auth,taskContoller.getAllTasksAssignToMe);
router.get("/getlatetasks", auth,taskContoller.getLateTasks);
router.get("/getAllTasksAssignToAnyUser/:userId", auth,taskContoller.getAllTasksAssignToAnyUser);
router.get("/getTasksNotDoneAfterDeadline", auth,taskContoller.getTasksNotDoneAfterDeadline);
router.put("/updatetask/:taskId", auth,taskContoller.updateTask);
router.delete("/deletetask/:taskId", auth,taskContoller.deleteTask);
export default router