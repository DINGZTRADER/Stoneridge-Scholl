import React, { useState, useEffect } from 'react';
import type { Task } from '../types';
import TaskItem from './TaskItem';

const getDefaultTasks = (): Task[] => [
    { id: crypto.randomUUID(), text: 'Finalize Q3 budget report for Catherine Tucker', completed: false },
    { id: crypto.randomUUID(), text: 'Prepare agenda for the next staff meeting', completed: false },
    { id: crypto.randomUUID(), text: 'Review admissions applications with the committee', completed: true },
];

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');

  // Load tasks from localStorage on initial render, or set defaults
  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem('stoneridge-tasks');
      if (storedTasks && JSON.parse(storedTasks).length > 0) {
        setTasks(JSON.parse(storedTasks));
      } else {
        setTasks(getDefaultTasks());
      }
    } catch (error) {
      console.error("Failed to load tasks from localStorage", error);
      setTasks(getDefaultTasks());
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('stoneridge-tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error("Failed to save tasks to localStorage", error);
    }
  }, [tasks]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      const newTask: Task = {
        id: crypto.randomUUID(), // Robust unique ID
        text: newTaskText.trim(),
        completed: false,
      };
      setTasks([newTask, ...tasks]); // Add to the top
      setNewTaskText('');
    }
  };

  const handleToggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const completedTasks = tasks.filter(t => t.completed);
  const pendingTasks = tasks.filter(t => !t.completed);

  return (
    <div className="p-8 h-full overflow-y-auto bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-stoneridge-green mb-6">Task Manager</h2>

        {/* Add Task Form */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <form onSubmit={handleAddTask} className="flex gap-4">
            <input
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              placeholder="e.g., Arrange a meeting with Catherine Tucker"
              className="flex-grow p-3 border border-gray-300 rounded-md focus:ring-stoneridge-gold focus:border-stoneridge-gold transition"
              aria-label="New task description"
            />
            <button
              type="submit"
              className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-stoneridge-green hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stoneridge-green disabled:bg-gray-400"
              disabled={!newTaskText.trim()}
            >
              Add Task
            </button>
          </form>
        </div>

        {/* Task Lists */}
        <div>
          {/* Pending Tasks Section */}
          <section aria-labelledby="pending-tasks-heading">
            <h3 id="pending-tasks-heading" className="text-xl font-semibold text-stoneridge-green mb-4">Pending Tasks ({pendingTasks.length})</h3>
            {pendingTasks.length > 0 ? (
              <ul className="space-y-3">
                {pendingTasks.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={handleToggleTask}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 px-4 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500">No pending tasks. Well done!</p>
              </div>
            )}
          </section>

          {/* Completed Tasks Section */}
          {completedTasks.length > 0 && (
            <section aria-labelledby="completed-tasks-heading" className="mt-8 pt-8 border-t border-gray-200">
                <h3 id="completed-tasks-heading" className="text-xl font-semibold text-stoneridge-green mb-4">Completed Tasks ({completedTasks.length})</h3>
                <ul className="space-y-3">
                  {completedTasks.map(task => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={handleToggleTask}
                      onDelete={handleDeleteTask}
                    />
                  ))}
                </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskManager;
