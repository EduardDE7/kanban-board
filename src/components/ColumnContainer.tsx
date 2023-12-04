import { useState, useMemo } from 'react';
import TrashIcon from '../assets/icons/TrashIcon';
import { Column, Id, Task } from '../types';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import PlusIcons from '../assets/icons/PlusIcon';
import { TaskCard } from './TaskCard';

interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
  createTask: (columnId: Id) => void;
  updateTask: (id: Id, title: string) => void;
  deleteTask: (id: Id) => void;
  tasks: Task[];
}

function ColumnContainer(props: Props) {
  const {
    column,
    deleteColumn,
    updateColumn,
    createTask,
    updateTask,
    deleteTask,
    tasks,
  } = props;

  const [editMode, setEditMode] = useState(false);

  const tasksIds = useMemo(() => tasks.map((task) => task.id), [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  console.log('column');

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-60 border-2 border-rose-500 bg-columnBackground w-[350px] h-[500px] max-h-[500px] rounded flex flex-col"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-columnBackground w-[350px] h-[500px] max-h-[500px] rounded flex flex-col"
    >
      <div
        {...attributes}
        {...listeners}
        onClick={() => setEditMode(true)}
        className="bg-mainBackground text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-columnBackground border-4 flex items-center justify-between"
      >
        <div className="flex gap-2">
          <div className="flex items-center justify-center px-2 py-1 text-sm rounded-full bg-columnBackground">
            0
          </div>
          {!editMode && column.title}
          {editMode && (
            <input
              className="px-2 bg-black border rounded outline-none focus:border-rose-500"
              autoFocus
              value={column.title}
              onChange={(e) => updateColumn(column.id, e.target.value)}
              onBlur={() => {
                setEditMode(false);
              }}
              onKeyDown={(e) => {
                if (e.key !== 'Enter') return;
                setEditMode(false);
              }}
            />
          )}
        </div>
        <button
          onClick={() => deleteColumn(column.id)}
          className="px-1 py-1 rounded stroke-gray-500 hover:stroke-white hover:bg-columnBackground"
        >
          <TrashIcon />
        </button>
      </div>
      <div className="flex flex-col flex-grow gap-4 p-2 overflow-x-hidden overflow-y-auto ">
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </div>
      <button
        className="flex items-center gap-2 p-4 border rounded-md border-columnBackground 2 border-x-columnBackground hover:bg-mainBackground hover:text-rose-500 active:bg-black"
        onClick={() => createTask(column.id)}
      >
        <PlusIcons />
        Add task
      </button>
    </div>
  );
}

export default ColumnContainer;
