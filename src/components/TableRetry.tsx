"use client";
import React, { Fragment, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { taskData } from "@/data";

type Status = "IN-PROGRESS" | "COMPLETED";
type Priority = "HIGH" | "NORMAL";

interface SubTask {
  id: number;
  name: string;
  assignees: string[];
  dueDate: string;
  status: Status;
  priority: Priority;
  selected: boolean;
}

interface Task {
  id: number;
  name: string;
  assignees: string[];
  dueDate: string;
  status: Status;
  priority: Priority;
  selectedSubtasks: number;
  subTasksList: SubTask[];
}

interface TaskFormData {
  name: string;
  assignees: string[];
  dueDate: string;
  status: Status;
  priority: Priority;
  selected: boolean;
}

const initialFormData: TaskFormData = {
  name: "",
  assignees: [],
  dueDate: "",
  status: "IN-PROGRESS",
  priority: "NORMAL",
  selected: false,
};

export default function TaskManagementTable() {
  const [tableData, setTableData] = useState<Task[]>(taskData as Task[]);

  const [activeSubtasks, setActiveSubtasks] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState<number | null>(null);
  const [formData, setFormData] = useState<TaskFormData>(initialFormData);

  const resetFormData = () => setFormData(initialFormData);

  const toggleActiveSubtask = (index: number) => {
    setActiveSubtasks((prevActiveSubtasks) =>
      prevActiveSubtasks.includes(index)
        ? prevActiveSubtasks.filter((i) => i !== index)
        : [...prevActiveSubtasks, index]
    );
  };

  const toggleSubtask = (taskId: number, subtaskId: number) => {
    setTableData((prevData) =>
      prevData.map((task) => {
        if (task.id === taskId) {
          const updatedSubtasks = task.subTasksList.map((subtask) => {
            if (subtask.id === subtaskId) {
              return { ...subtask, selected: !subtask.selected };
            }
            return subtask;
          });
          return {
            ...task,
            selectedSubtasks: updatedSubtasks.filter((st) => st.selected)
              .length,
            subTasksList: updatedSubtasks,
          };
        }
        return task;
      })
    );
  };

  const markAsCompleted = (taskId: number) => {
    setTableData((prevData) =>
      prevData.map((task) => {
        if (task.id === taskId) {
          const updatedSubtasks = task.subTasksList.map((subtask) =>
            subtask.selected
              ? { ...subtask, status: "COMPLETED" as Status, selected: false }
              : subtask
          );
          return {
            ...task,
            selectedSubtasks: 0,
            subTasksList: updatedSubtasks,
            status: updatedSubtasks.every((st) => st.status === "COMPLETED")
              ? "COMPLETED"
              : "IN-PROGRESS",
          };
        }
        return task;
      })
    );
  };

  const handleAddSubtask = () => {
    if (currentTaskId === null || !formData.name) return;

    setTableData((prevData) =>
      prevData.map((task) => {
        if (task.id === currentTaskId) {
          const newSubtask: SubTask = {
            ...formData,
            id: Date.now(),
            selected: false,
          };
          return {
            ...task,
            subTasksList: [...task.subTasksList, newSubtask],
          };
        }
        return task;
      })
    );

    setIsModalOpen(false);
    resetFormData();
  };

  const updateSubtaskStatus = (
    taskId: number,
    subtaskId: number,
    newStatus: Status
  ) => {
    setTableData((prevData) =>
      prevData.map((task) => {
        if (task.id === taskId) {
          const updatedSubtasks = task.subTasksList.map((subtask) =>
            subtask.id === subtaskId
              ? { ...subtask, status: newStatus }
              : subtask
          );
          return {
            ...task,
            subTasksList: updatedSubtasks,
          };
        }
        return task;
      })
    );
  };

  const updateSubtaskPriority = (
    taskId: number,
    subtaskId: number,
    newPriority: Priority
  ) => {
    setTableData((prevData) =>
      prevData.map((task) => {
        if (task.id === taskId) {
          const updatedSubtasks = task.subTasksList.map((subtask) =>
            subtask.id === subtaskId
              ? { ...subtask, priority: newPriority }
              : subtask
          );
          return {
            ...task,
            subTasksList: updatedSubtasks,
          };
        }
        return task;
      })
    );
  };

  const TaskForm = () => (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="assignee">Assignee ID</Label>
        <Input
          id="assignee"
          value={formData.assignees[0] || ""}
          onChange={(e) =>
            setFormData({ ...formData, assignees: [e.target.value] })
          }
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="dueDate">Due Date</Label>
        <Input
          id="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={(e) =>
            setFormData({ ...formData, dueDate: e.target.value })
          }
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="priority">Priority</Label>
        <Select
          value={formData.priority}
          onValueChange={(value: Priority) =>
            setFormData({ ...formData, priority: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NORMAL">Normal</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const StatusSelect = ({
    status,
    taskId,
    subtaskId,
  }: {
    status: Status;
    taskId: number;
    subtaskId: number;
  }) => (
    <Select
      value={status}
      onValueChange={(value: Status) =>
        updateSubtaskStatus(taskId, subtaskId, value)
      }
    >
      <SelectTrigger
        className={cn(
          "h-7 w-32",
          status === "COMPLETED"
            ? "bg-green-100 text-green-800"
            : "bg-yellow-100 text-yellow-800"
        )}
      >
        <SelectValue>{status}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="IN-PROGRESS">In Progress</SelectItem>
        <SelectItem value="COMPLETED">Completed</SelectItem>
      </SelectContent>
    </Select>
  );

  const PrioritySelect = ({
    priority,
    taskId,
    subtaskId,
  }: {
    priority: Priority;
    taskId: number;
    subtaskId: number;
  }) => (
    <Select
      value={priority}
      onValueChange={(value: Priority) =>
        updateSubtaskPriority(taskId, subtaskId, value)
      }
    >
      <SelectTrigger
        className={cn(
          "h-7 w-fit",
          priority === "HIGH"
            ? "bg-red-100 text-red-800"
            : "bg-blue-100 text-blue-800"
        )}
      >
        <SelectValue>{priority}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="NORMAL">Normal</SelectItem>
        <SelectItem value="HIGH">High</SelectItem>
      </SelectContent>
    </Select>
  );

  return (
    <div className="p-6">
      <div className="rounded-lg border bg-white shadow">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">
                Name
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">
                Assignees
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">
                Due Date
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">
                Subtasks
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">
                Status
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">
                Priority
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tableData.map((data, index) => (
              <Fragment key={data.id}>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 select-none">
                    <div className="flex items-center gap-2">
                      <ChevronDown
                        onClick={() => toggleActiveSubtask(index)}
                        className={cn(
                          "h-5 w-5 cursor-pointer transition-transform",
                          activeSubtasks.includes(index) && "rotate-180"
                        )}
                      />
                      <span className="font-medium">{data.name}</span>
                    </div>
                  </td>
                  <td className="p-4 select-none">
                    {data.assignees.join(", ")}
                  </td>
                  <td className="p-4 select-none">{data.dueDate}</td>
                  <td className="p-4 select-none">
                    {data.selectedSubtasks}/{data.subTasksList.length}
                  </td>
                  <td className="p-4 select-none">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2 py-1 text-base h-7 w-32 ",
                        data.status === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      )}
                    >
                      {data.status}
                    </span>
                  </td>
                  <td className="p-4 select-none">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2 py-1 text-base ",
                        data.priority === "HIGH"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      )}
                    >
                      {data.priority}
                    </span>
                  </td>
                  <td className="p-4">
                    <Button
                      onClick={() => markAsCompleted(data.id)}
                      variant="default"
                      className="w-full cursor-pointer"
                      disabled={data.selectedSubtasks === 0}
                    >
                      Mark as completed
                    </Button>
                  </td>
                </tr>
                {activeSubtasks.includes(index) && (
                  <>
                    {data.subTasksList.map((subtask) => (
                      <tr key={subtask.id} className="bg-gray-50">
                        <td className="p-4">
                          <div className="flex items-center gap-4 pl-6">
                            <Checkbox
                              checked={subtask.selected}
                              onCheckedChange={() =>
                                toggleSubtask(data.id, subtask.id)
                              }
                            />
                            <span>{subtask.name}</span>
                          </div>
                        </td>
                        <td className="p-4">{subtask.assignees.join(", ")}</td>
                        <td className="p-4">{subtask.dueDate}</td>
                        <td className="p-4" />
                        <td className="p-4">
                          <StatusSelect
                            status={subtask.status}
                            taskId={data.id}
                            subtaskId={subtask.id}
                          />
                        </td>
                        <td className="p-4">
                          <PrioritySelect
                            priority={subtask.priority}
                            taskId={data.id}
                            subtaskId={subtask.id}
                          />
                        </td>
                        <td className="p-4" />
                      </tr>
                    ))}
                    <tr className="bg-gray-50">
                      <td colSpan={7} className="p-4">
                        <div className="flex justify-start">
                          <Dialog
                            open={isModalOpen}
                            onOpenChange={setIsModalOpen}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setCurrentTaskId(data.id);
                                  setIsModalOpen(true);
                                }}
                              >
                                Add Subtask
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Add New Subtask</DialogTitle>
                              </DialogHeader>
                              <TaskForm />
                              <DialogFooter>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setIsModalOpen(false);
                                    resetFormData();
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button onClick={handleAddSubtask}>
                                  Add Subtask
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </td>
                    </tr>
                  </>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
