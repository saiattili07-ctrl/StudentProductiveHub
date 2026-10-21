import TaskCard from "./TaskCard.jsx";
import EmptyState from "./EmptyState.jsx";

function TaskList({ tasks, onEdit, onDelete, onToggleComplete }) {
  if (tasks.length === 0) {
    return (
      <EmptyState
        title="No tasks found"
        description="Try changing the filters, or add a new task."
      />
    );
  }

  return (
    <div>
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
        />
      ))}
    </div>
  );
}

export default TaskList;
