"use client";
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface SubTask {
  name: string;
  assignees: string[];
  dueDate: string;
  status: string;
  priority: string;
  isCompleted: boolean;
}

interface Task {
  name: string;
  assignees: string[];
  dueDate: string;
  subTasks: string;
  status: string;
  priority: string;
  action: string;
  subTasksList: SubTask[];
  isSubTasksExpanded: boolean;
  isAddingSubTask: boolean;
  newSubTaskName: string;
  newSubTaskAssignees: string;
  newSubTaskDueDate: string;
}

const TaskTable: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      name: "Parking Lot Decking",
      assignees: ["1345709545446"],
      dueDate: "9/18/16",
      subTasks: "1 of 3",
      status: "in-progress",
      priority: "high",
      action: "Mark as completed",
      subTasksList: [
        {
          name: "Parking Lot Flooring",
          assignees: ["1345709545446"],
          dueDate: "9/18/16",
          status: "in-progress",
          priority: "high",
          isCompleted: false,
        },
        {
          name: "Parking Lot Flooring",
          assignees: ["1345709545446"],
          dueDate: "9/18/16",
          status: "in-progress",
          priority: "high",
          isCompleted: false,
        },
      ],
      isSubTasksExpanded: false,
      isAddingSubTask: false,
      newSubTaskName: "",
      newSubTaskAssignees: "",
      newSubTaskDueDate: "",
    },
    // ... other tasks
  ]);

  const toggleSubtasks = (index: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task, i) =>
        i === index
          ? { ...task, isSubTasksExpanded: !task.isSubTasksExpanded }
          : task
      )
    );
  };

  const markTaskComplete = (index: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task, i) =>
        i === index
          ? { ...task, status: "completed", action: "Completed" }
          : task
      )
    );
  };

  const toggleAddSubTask = (index: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task, i) =>
        i === index ? { ...task, isAddingSubTask: !task.isAddingSubTask } : task
      )
    );
  };

  const handleNewSubTaskChange = (
    index: number,
    field: string,
    value: string
  ) => {
    setTasks((prevTasks) =>
      prevTasks.map((task, i) =>
        i === index ? { ...task, [`newSubTask${field}`]: value } : task
      )
    );
  };

  const addSubTask = (index: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task, i) =>
        i === index
          ? {
              ...task,
              subTasksList: [
                ...task.subTasksList,
                {
                  name: task.newSubTaskName,
                  assignees: [task.newSubTaskAssignees],
                  dueDate: task.newSubTaskDueDate,
                  status: "in-progress",
                  priority: "low",
                  isCompleted: false,
                },
              ],
              isAddingSubTask: false,
              newSubTaskName: "",
              newSubTaskAssignees: "",
              newSubTaskDueDate: "",
            }
          : task
      )
    );
  };

  return (
    <div className="task-table">
      <table className="border border-collapse">
        <thead>
          <tr className="border-b">
            <th>Name</th>
            <th>Assignees</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <React.Fragment key={index}>
              <tr>
                <td className={"border flex items-center"}>
                  <button
                    className={`mr-2 cursor-pointer ${
                      task.subTasksList.length === 0 ? "invisible" : ""
                    }`}
                    onClick={() => toggleSubtasks(index)}
                  >
                    {task.isSubTasksExpanded ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </button>
                  {task.name}
                </td>
                <td className={"border"}>{task.assignees.join(", ")}</td>
                <td className={"border"}>{task.dueDate}</td>
                <td
                  className={`border ${
                    task.status === "in-progress"
                      ? "bg-yellow-400"
                      : task.status === "completed"
                      ? "bg-green-400"
                      : "bg-red-400"
                  }`}
                >
                  {task.status}
                </td>
                <td
                  className={`border ${
                    task.priority === "high" ? "bg-red-600" : "bg-green-600"
                  }`}
                >
                  {task.priority}
                </td>
                <td className={"border"}>
                  <button onClick={() => markTaskComplete(index)}>
                    {task.action}
                  </button>
                </td>
              </tr>
              {task.isSubTasksExpanded &&
                task.subTasksList.map((subtask, subIndex) => (
                  <tr key={`${index}-${subIndex}`}>{/* Subtask details */}</tr>
                ))}
              {(task.isSubTasksExpanded || task.isAddingSubTask) && (
                <tr>
                  <td className={"border"} colSpan={6}>
                    <div className="flex items-center justify-end">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2"
                        onClick={() => toggleAddSubTask(index)}
                      >
                        Add Task
                      </button>
                    </div>
                  </td>
                </tr>
              )}
              {task.isSubTasksExpanded && task.isAddingSubTask && (
                <tr>
                  <td className={"border"}>
                    <input
                      type="text"
                      className="border p-2 w-full"
                      placeholder="Name"
                      value={task.newSubTaskName}
                      onChange={(e) =>
                        handleNewSubTaskChange(index, "Name", e.target.value)
                      }
                    />
                  </td>
                  <td className={"border"}>
                    <input
                      type="text"
                      className="border p-2 w-full"
                      placeholder="Assignees"
                      value={task.newSubTaskAssignees}
                      onChange={(e) =>
                        handleNewSubTaskChange(
                          index,
                          "Assignees",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td className={"border"}>
                    <input
                      type="text"
                      className="border p-2 w-full"
                      placeholder="Due Date"
                      value={task.newSubTaskDueDate}
                      onChange={(e) =>
                        handleNewSubTaskChange(index, "DueDate", e.target.value)
                      }
                    />
                  </td>
                  <td className={"border"} colSpan={3}>
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 w-full"
                      onClick={() => addSubTask(index)}
                    >
                      Save
                    </button>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
