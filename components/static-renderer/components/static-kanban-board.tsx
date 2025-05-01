"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Search, Plus, X } from "lucide-react";
import Image from "next/image";

// Tipos para o Kanban
interface KanbanUser {
  id: string;
  name: string;
  avatar: string;
}

interface KanbanTask {
  id: string;
  title: string;
  priority: "important" | "high" | "medium" | "low" | "meh" | "ok" | "not-important";
  assignees: KanbanUser[];
}

interface KanbanColumn {
  id: string;
  title: string;
  tasks: KanbanTask[];
}

interface StaticKanbanBoardProps {
  title?: string;
  columns?: KanbanColumn[];
  backgroundColor?: string;
  textColor?: string;
  columnBackgroundColor?: string;
  taskBackgroundColor?: string;
  accentColor?: string;
  hidden?: boolean;
}

// Cores para as prioridades
const priorityColors = {
  important: { bg: "#EBF2FF", text: "#3366FF", label: "Important" },
  high: { bg: "#FFEBEE", text: "#F44336", label: "High Priority" },
  medium: { bg: "#FFF8E1", text: "#FFA000", label: "Medium" },
  low: { bg: "#E8F5E9", text: "#4CAF50", label: "Low" },
  meh: { bg: "#F3E5F5", text: "#9C27B0", label: "Meh" },
  ok: { bg: "#FFF3E0", text: "#FF9800", label: "OK" },
  "not-important": { bg: "#FFEBEE", text: "#FF5252", label: "Not that Important" },
};

// Dados padrão para o Kanban
const defaultUsers: KanbanUser[] = [
  {
    id: "user1",
    name: "Ana Silva",
    avatar: "/profile/Avatar.png",
  },
  {
    id: "user2",
    name: "João Costa",
    avatar: "/profile/Avatar.png",
  },
  {
    id: "user3",
    name: "Maria Santos",
    avatar: "/profile/Avatar.png",
  },
  {
    id: "user4",
    name: "Pedro Oliveira",
    avatar: "/profile/Avatar.png",
  },
  {
    id: "user5",
    name: "Carla Souza",
    avatar: "/profile/Avatar.png",
  },
  {
    id: "user6",
    name: "Lucas Ferreira",
    avatar: "/profile/Avatar.png",
  },
];

const defaultColumns: KanbanColumn[] = [
  {
    id: "todo",
    title: "To Do",
    tasks: [
      {
        id: "task1",
        title: "UI/UX Design in the age of AI",
        priority: "important",
        assignees: [defaultUsers[0], defaultUsers[1]],
      },
      {
        id: "task2",
        title: "Responsive Website Design for 23 more clients",
        priority: "meh",
        assignees: [defaultUsers[2], defaultUsers[3], defaultUsers[4], defaultUsers[5]],
      },
      {
        id: "task3",
        title: "Blog Copywriting (Low priority 😉)",
        priority: "ok",
        assignees: [defaultUsers[0], defaultUsers[2]],
      },
      {
        id: "task4",
        title: "Landing page for Azunyan senpai",
        priority: "not-important",
        assignees: [defaultUsers[0], defaultUsers[1]],
      },
    ],
  },
  {
    id: "inprogress",
    title: "In Progress",
    tasks: [
      {
        id: "task5",
        title: "Machine Learning Progress",
        priority: "important",
        assignees: [defaultUsers[0], defaultUsers[1]],
      },
      {
        id: "task6",
        title: "Learn Computer Science",
        priority: "meh",
        assignees: [defaultUsers[0], defaultUsers[2], defaultUsers[3], defaultUsers[4]],
      },
    ],
  },
  {
    id: "completed",
    title: "Completed",
    tasks: [
      {
        id: "task7",
        title: "User flow confirmation for fintech App",
        priority: "important",
        assignees: [defaultUsers[5], defaultUsers[1]],
      },
      {
        id: "task8",
        title: "Do some usual chores",
        priority: "high",
        assignees: [defaultUsers[5], defaultUsers[3], defaultUsers[4]],
      },
      {
        id: "task9",
        title: "Write a few articles for slothful",
        priority: "ok",
        assignees: [defaultUsers[4]],
      },
      {
        id: "task10",
        title: "Transform into a cyborg",
        priority: "ok",
        assignees: [defaultUsers[5], defaultUsers[1], defaultUsers[3]],
      },
    ],
  },
];

export default function StaticKanbanBoard({
  title = "Kanban Dashboard",
  columns = defaultColumns,
  backgroundColor = "#ffffff",
  textColor = "#1f272f",
  columnBackgroundColor = "#f9fafb",
  taskBackgroundColor = "#ffffff",
  accentColor = "#014973",
  hidden = false,
}: StaticKanbanBoardProps) {
  const [boardColumns, setBoardColumns] = useState<KanbanColumn[]>(columns);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [newTaskColumn, setNewTaskColumn] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<KanbanTask["priority"]>("medium");
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [currentTask, setCurrentTask] = useState<KanbanTask | null>(null);
  const [availableUsers, setAvailableUsers] = useState<KanbanUser[]>(defaultUsers);
  const modalRef = useRef<HTMLDivElement>(null);
  const [draggedTask, setDraggedTask] = useState<{ taskId: string; columnId: string } | null>(null);

  // Filtrar tarefas com base no termo de pesquisa
  const filteredColumns = boardColumns.map((column) => {
    if (searchTerm.trim() === "") {
      return column;
    }

    return {
      ...column,
      tasks: column.tasks.filter((task) => task.title.toLowerCase().includes(searchTerm.toLowerCase())),
    };
  });

  // Atualizar o estado do componente quando as props mudarem
  useEffect(() => {
    setBoardColumns(columns);
  }, [columns]);

  // Fechar o modal quando clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowTaskModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handlers para o drag and drop
  const handleDragStart = (taskId: string, columnId: string) => {
    setDraggedTask({ taskId, columnId });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessário para permitir o drop
  };

  const handleDrop = (destinationColumnId: string) => {
    if (!draggedTask) return;

    const { taskId, columnId: sourceColumnId } = draggedTask;

    // Se arrastou para a mesma coluna, não faz nada
    if (sourceColumnId === destinationColumnId) {
      setDraggedTask(null);
      return;
    }

    // Encontra as colunas de origem e destino
    const newColumns = [...boardColumns];
    const sourceColumn = newColumns.find((col) => col.id === sourceColumnId);
    const destinationColumn = newColumns.find((col) => col.id === destinationColumnId);

    if (!sourceColumn || !destinationColumn) {
      setDraggedTask(null);
      return;
    }

    // Encontra a tarefa
    const taskIndex = sourceColumn.tasks.findIndex((task) => task.id === taskId);
    if (taskIndex === -1) {
      setDraggedTask(null);
      return;
    }

    // Move a tarefa
    const [movedTask] = sourceColumn.tasks.splice(taskIndex, 1);
    destinationColumn.tasks.push(movedTask);

    setBoardColumns(newColumns);
    setDraggedTask(null);
  };

  // Adicionar nova tarefa
  const addNewTask = (columnId: string) => {
    setNewTaskColumn(columnId);
    setNewTaskTitle("");
    setNewTaskPriority("medium");
  };

  // Salvar nova tarefa
  const saveNewTask = () => {
    if (!newTaskColumn || !newTaskTitle.trim()) return;

    const newTask: KanbanTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      priority: newTaskPriority,
      assignees: [],
    };

    const newColumns = boardColumns.map((col) => {
      if (col.id === newTaskColumn) {
        return { ...col, tasks: [...col.tasks, newTask] };
      }
      return col;
    });

    setBoardColumns(newColumns);
    setNewTaskColumn(null);
    setNewTaskTitle("");
  };

  // Cancelar adição de nova tarefa
  const cancelNewTask = () => {
    setNewTaskColumn(null);
    setNewTaskTitle("");
  };

  // Abrir modal de tarefa
  const openTaskModal = (e: React.MouseEvent, task: KanbanTask) => {
    e.stopPropagation(); // Evita conflitos com drag and drop
    setCurrentTask(task);
    setShowTaskModal(true);
  };

  // Adicionar ou remover usuário da tarefa
  const toggleUserAssignment = (userId: string) => {
    if (!currentTask) return;

    const isAssigned = currentTask.assignees.some((user) => user.id === userId);
    let newAssignees: KanbanUser[];

    if (isAssigned) {
      newAssignees = currentTask.assignees.filter((user) => user.id !== userId);
    } else {
      const userToAdd = availableUsers.find((user) => user.id === userId);
      if (!userToAdd) return;
      newAssignees = [...currentTask.assignees, userToAdd];
    }

    const updatedTask = { ...currentTask, assignees: newAssignees };
    setCurrentTask(updatedTask);

    // Atualizar a tarefa no estado do board
    const newColumns = boardColumns.map((col) => {
      return {
        ...col,
        tasks: col.tasks.map((task) => (task.id === currentTask.id ? updatedTask : task)),
      };
    });

    setBoardColumns(newColumns);
  };

  // Atualizar prioridade da tarefa
  const updateTaskPriority = (priority: KanbanTask["priority"]) => {
    if (!currentTask) return;

    const updatedTask = { ...currentTask, priority };
    setCurrentTask(updatedTask);

    // Atualizar a tarefa no estado do board
    const newColumns = boardColumns.map((col) => {
      return {
        ...col,
        tasks: col.tasks.map((task) => (task.id === currentTask.id ? updatedTask : task)),
      };
    });

    setBoardColumns(newColumns);
  };

  // Excluir tarefa
  const deleteTask = (taskId: string) => {
    const newColumns = boardColumns.map((col) => {
      return {
        ...col,
        tasks: col.tasks.filter((task) => task.id !== taskId),
      };
    });

    setBoardColumns(newColumns);
    setShowTaskModal(false);
  };

  if (hidden) return null;

  return (
    <motion.div
      className="w-full py-8 px-6"
      style={{ backgroundColor, color: textColor }}
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>

        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Pesquise por aqui..."
            className="pl-10 pr-4 py-2 w-full border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {filteredColumns.map((column, columnIndex) => (
          <div key={column.id} className="col-span-1 flex flex-col bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center">
                <div
                  className="w-4 h-4 rounded-full mr-3"
                  style={{
                    backgroundColor: columnIndex === 0 ? "#3366FF" : columnIndex === 1 ? "#FF9800" : "#4CAF50",
                  }}
                ></div>
                <h3 className="font-semibold text-gray-800">
                  {column.title} <span className="ml-2 text-sm bg-gray-100 px-2 py-1 rounded-full">{column.tasks.length}</span>
                </h3>
              </div>
              <button
                className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                onClick={() => addNewTask(column.id)}
                title="Adicionar nova tarefa"
              >
                <Plus size={16} />
              </button>
            </div>

            <div
              className="flex-1 p-3 rounded-lg overflow-y-auto"
              style={{ backgroundColor: columnBackgroundColor, minHeight: "400px", maxHeight: "600px" }}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(column.id)}
            >
              {column.tasks.map((task, index) => (
                <div
                  key={task.id}
                  className={`mb-3 p-4 rounded-lg shadow-sm cursor-grab hover:shadow-md transition-shadow border border-gray-100 ${
                    draggedTask?.taskId === task.id ? "opacity-50" : ""
                  }`}
                  style={{
                    backgroundColor: taskBackgroundColor,
                  }}
                  draggable
                  onDragStart={() => handleDragStart(task.id, column.id)}
                  onClick={(e) => openTaskModal(e, task)}
                >
                  <div
                    className="text-xs font-medium mb-3 inline-block px-2 py-1 rounded"
                    style={{
                      backgroundColor: priorityColors[task.priority].bg,
                      color: priorityColors[task.priority].text,
                    }}
                  >
                    {priorityColors[task.priority].label}
                  </div>
                  <h4 className="font-medium text-gray-800 mb-3">{task.title}</h4>
                  <div className="flex justify-between items-center">
                    <div className="flex -space-x-2">
                      {task.assignees.slice(0, 3).map((user, i) => (
                        <Image
                          width={32}
                          height={32}
                          key={i}
                          src={user.avatar || "/placeholder.svg"}
                          alt={user.name}
                          className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm"
                          title={user.name}
                        />
                      ))}
                      {task.assignees.length > 3 && (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium border-2 border-white shadow-sm">
                          +{task.assignees.length - 3}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-400">ID: {task.id.slice(0, 4)}</div>
                  </div>
                </div>
              ))}

              {newTaskColumn === column.id && (
                <div className="p-3 rounded-lg border border-dashed border-gray-300 mb-3">
                  <input
                    type="text"
                    placeholder="Título da tarefa"
                    className="w-full p-2 border rounded mb-2"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    autoFocus
                  />
                  <select
                    className="w-full p-2 border rounded mb-2"
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as KanbanTask["priority"])}
                  >
                    {Object.entries(priorityColors).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value.label}
                      </option>
                    ))}
                  </select>
                  <div className="flex justify-end space-x-2">
                    <button className="px-3 py-1 text-sm rounded bg-gray-200" onClick={cancelNewTask}>
                      Cancelar
                    </button>
                    <button className="px-3 py-1 text-sm rounded text-white" style={{ backgroundColor: accentColor }} onClick={saveNewTask}>
                      Adicionar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal de detalhes da tarefa */}
      {showTaskModal && currentTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div ref={modalRef} className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Detalhes da Tarefa</h3>
              <button className="p-1 rounded-full hover:bg-gray-100" onClick={() => setShowTaskModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Título</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={currentTask.title}
                onChange={(e) => setCurrentTask({ ...currentTask, title: e.target.value })}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Prioridade</label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(priorityColors).map(([key, value]) => (
                  <button
                    key={key}
                    className={`p-2 text-xs rounded text-center ${currentTask.priority === key ? "ring-2 ring-blue-500" : ""}`}
                    style={{
                      backgroundColor: value.bg,
                      color: value.text,
                    }}
                    onClick={() => updateTaskPriority(key as KanbanTask["priority"])}
                  >
                    {value.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Responsáveis</label>
              <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                {availableUsers.map((user) => {
                  const isAssigned = currentTask.assignees.some((a) => a.id === user.id);
                  return (
                    <button
                      key={user.id}
                      className={`p-2 text-xs rounded text-center flex flex-col items-center ${
                        isAssigned ? "bg-blue-50 ring-2 ring-blue-500" : "bg-gray-50"
                      }`}
                      onClick={() => toggleUserAssignment(user.id)}
                    >
                      <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="w-8 h-8 rounded-full mb-1 object-cover" />
                      <span>{user.name.split(" ")[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between">
              <button className="px-3 py-2 rounded text-white bg-red-500" onClick={() => deleteTask(currentTask.id)}>
                Excluir
              </button>
              <button className="px-3 py-2 rounded text-white" style={{ backgroundColor: accentColor }} onClick={() => setShowTaskModal(false)}>
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
