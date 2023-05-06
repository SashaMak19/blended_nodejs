const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
const { HttpError } = require("../utils/HttpError");

const dbPath = path.join(__dirname, "..", "db", "tasks.json");
// const dbPath = path.join(process.cwd(), "..", "db", "tasks.json");

const getTasksService = async () => {
  const tasks = await fs.readFile(dbPath);

  return JSON.parse(tasks);
};

const getTaskService = async (id) => {
  const tasks = await getTasksService();

  const task = tasks.find((task) => task.id === id);

  if (!task) {
    throw new HttpError(404, "task not found");
  }

  return task;
};

const createTaskService = async (data) => {
  const tasks = await getTasksService();
  const newTask = {
    id: crypto.randomUUID(),
    ...data,
  };

  tasks.push(newTask);

  await fs.writeFile(dbPath, JSON.stringify(tasks, null, 3));
  return newTask;
};

const updateTaskService = async (id, { title, completed }) => {
  const tasks = await getTasksService();
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) {
    throw new HttpError(404, "task not found");
  }

  tasks[index] = {
    id: tasks[index].id,
    title,
    completed,
  };
  // tasks[index].title ||= data.title;

  await fs.writeFile(dbPath, JSON.stringify(tasks, null, 3));
  return tasks[index];
};

const deleteTaskService = async (id) => {
  const tasks = await getTasksService();
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) {
    throw new HttpError(404, "task not found");
  }

  tasks.splice(index, 1);
  await fs.writeFile(dbPath, JSON.stringify(tasks, null, 3));

  return id;
};

module.exports = {
  getTasksService,
  getTaskService,
  createTaskService,
  updateTaskService,
  deleteTaskService,
};
