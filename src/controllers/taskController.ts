import { Request, Response, RequestHandler } from "express";
import { Task } from "../models/Task";

export const getTasks: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: { tasks },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching tasks",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const createTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const taskData: any = req.body;

    const task = new Task({
      ...taskData,
      // createdBy: (req as any).user._id,
      dueDate: taskData.dueDate ? new Date(taskData.dueDate) : undefined,
    });

    await task.save();

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating task",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};