
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";
import { Task } from "@/lib/types";
import TaskItem from "./TaskItem";

interface TasksListProps {
  tasks: Task[];
  onAddTask: (title: string) => void;
  onToggleTask: (taskId: string, completed: boolean) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TasksList = ({ tasks, onAddTask, onToggleTask, onDeleteTask }: TasksListProps) => {
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      onAddTask(newTaskTitle.trim());
      setNewTaskTitle("");
    }
  };

  return (
    <div className="bg-background border border-border rounded-lg overflow-hidden">
      <div className="p-4">
        <h3 className="font-semibold mb-3">Tasks</h3>
        <div className="flex gap-2">
          <Input
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddTask();
            }}
          />
          <Button
            onClick={handleAddTask}
            disabled={!newTaskTitle.trim()}
            size="sm"
          >
            <PlusCircle size={16} className="mr-1" />
            Add
          </Button>
        </div>
      </div>
      
      <div className="max-h-[400px] overflow-y-auto">
        {tasks.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <p>No tasks yet. Add your first task above.</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggleTask}
              onDelete={onDeleteTask}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TasksList;
