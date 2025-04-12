
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Task } from "@/lib/types";
import { Calendar, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string, completed: boolean) => void;
  onDelete: (taskId: string) => void;
}

export const TaskItem = ({ task, onToggle, onDelete }: TaskItemProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : null;

  const isOverdue =
    task.dueDate && !task.completed && new Date(task.dueDate) < new Date();

  return (
    <div
      className="flex items-center justify-between py-3 px-4 border-b border-border last:border-0 hover:bg-secondary/50 transition-colors"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center flex-1 min-w-0">
        <Checkbox
          checked={task.completed}
          onCheckedChange={(checked) => onToggle(task.id, !!checked)}
          className="mr-3"
        />
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "text-sm font-medium",
              task.completed && "line-through text-muted-foreground"
            )}
          >
            {task.title}
          </p>
          {task.description && (
            <p className="text-xs text-muted-foreground truncate">
              {task.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center ml-4">
        {formattedDate && (
          <div
            className={cn(
              "flex items-center text-xs mr-3",
              isOverdue && !task.completed ? "text-red-500" : "text-muted-foreground"
            )}
          >
            <Calendar size={12} className="mr-1" />
            {formattedDate}
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "p-0 h-7 w-7 rounded-full opacity-0",
            isHovered && "opacity-100"
          )}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(task.id);
          }}
        >
          <Trash2 size={14} className="text-muted-foreground hover:text-red-500" />
        </Button>
      </div>
    </div>
  );
};

export default TaskItem;
