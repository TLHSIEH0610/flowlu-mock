"use client";

import { getCategories } from "@/actions/category.actions";
import { CategoryProps, TicketProps } from "@/types/ticket";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useState, useEffect, useRef } from "react";
import { updateTicketCategory } from "@/actions/ticket.actions";
import Drawer from "@/components/drawer";
import TicketDetails from "./ticketDetails";
import SimpleTicketForm from "./create/form-simple";

const categoryColors: Record<string, string> = {
  todo: "border-l-4 border-blue-500 bg-blue-50",
  inprogress: "border-l-4 border-yellow-500 bg-yellow-50",
  done: "border-l-4 border-purple-500 bg-purple-50",
  accepted: "border-l-4 border-green-500 bg-green-50",
};

const priorityColors: Record<string, string> = {
  Low: "bg-gray-100 text-gray-600",
  Medium: "bg-yellow-100 text-yellow-600",
  High: "bg-red-100 text-red-600",
  Urgent: "bg-purple-100 text-purple-600",
};

interface DragItem {
  id: string;
  categoryId: number;
  ticketIndex: number;
}

const Ticket = ({
  ticket,
  ticketIndex,
  categoryId,
  moveTicket,
  onClick,
}: {
  ticket: TicketProps;
  ticketIndex: number;
  categoryId: number;
  moveTicket: (
    dragIndex: number,
    hoverIndex: number,
    sourceCategoryId: number,
    targetCategoryId: number
  ) => void;
  onClick: () => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop<DragItem>({
    accept: "TICKET",
    hover(item, monitor) {
      if (!ref.current) return;
      const dragIndex = item.ticketIndex;
      const hoverIndex = ticketIndex;

      if (
        item.id === ticket.id ||
        (dragIndex === hoverIndex && item.categoryId === categoryId)
      )
        return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveTicket(dragIndex, hoverIndex, item.categoryId, categoryId);
      item.ticketIndex = hoverIndex;
      item.categoryId = categoryId;
    },
  });

  const [{ isDragging }, drag] = useDrag<
    DragItem,
    unknown,
    { isDragging: boolean }
  >({
    type: "TICKET",
    item: { id: ticket.id, categoryId, ticketIndex },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      onClick={onClick}
      style={{
        opacity: isDragging ? 0.4 : 1,
        transform: isDragging ? "scale(1.02)" : "scale(1)",
        transition: "all 0.2s ease",
      }}
      className="bg-white rounded-md p-3 shadow-sm hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <h4 className="font-medium text-gray-900">{ticket.title}</h4>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            priorityColors[ticket.priority ?? "Low"] ?? priorityColors.Low
          }`}
        >
          {ticket.priority}
        </span>
      </div>
      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
        {ticket.description}
      </p>
      <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
        <span>{ticket.type}</span>
        <span>{ticket.estimation}h</span>
      </div>
    </div>
  );
};

const Category = ({
  category,
  moveTicket,
  onTicketClick,
  refreshCategories,
}: {
  category: CategoryProps;
  moveTicket: (
    dragIndex: number,
    hoverIndex: number,
    sourceCategoryId: number,
    targetCategoryId: number
  ) => void;
  onTicketClick: (ticket: TicketProps) => void;
  refreshCategories: () => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [, drop] = useDrop<DragItem>({
    accept: "TICKET",
    drop: (item, monitor) => {
      if (!monitor.didDrop()) {
        if (item.categoryId !== category.id) {
          moveTicket(
            item.ticketIndex,
            category.tickets.length,
            item.categoryId,
            category.id
          );
          item.categoryId = category.id;
          item.ticketIndex = category.tickets.length;
        }
      }
    },
  });

  const dropRef = (element: HTMLDivElement | null) => {
    drop(element);
  };

  return (
    <div
      ref={dropRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
      className="relative flex flex-col gap-4 min-w-[300px]"
    >
      <div
        className={`rounded-md shadow-sm px-4 py-6 ${
          categoryColors[category.name] ?? "border-l-4 border-gray-300 bg-white"
        }`}
      >
        <h3 className="text-lg text-black font-semibold mb-4">
          {category.name}
        </h3>
        <p className="text-sm text-gray-500">
          {category.tickets.length} Issues
        </p>
        {isHovered && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="absolute left-1/2  bg-white shadow-md px-3 p-1 rounded-xl text-gray-600 hover:bg-blue-50"
          >
            +
          </button>
        )}
      </div>

      <div
        className={`space-y-3 w-full flex flex-col gap-4 min-h-[120px] p-2 ${
          category.tickets.length === 0 ? "bg-gray-50 rounded-md" : ""
        }`}
      >
        {showForm && (
          <SimpleTicketForm
            setShowForm={setShowForm}
            categoryId={category.id}
            refreshCategories={refreshCategories}
          />
        )}

        {category.tickets.length === 0 && (
          <div className="text-center text-gray-400 text-sm italic py-4">
            No tickets
          </div>
        )}

        {category.tickets.map((ticket, ticketIndex) => (
          <Ticket
            key={ticket.id}
            ticket={ticket}
            ticketIndex={ticketIndex}
            categoryId={category.id}
            moveTicket={moveTicket}
            onClick={() => onTicketClick(ticket)}
          />
        ))}
      </div>
    </div>
  );
};

export default function Categories() {
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<TicketProps | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  const moveTicket = (
    dragIndex: number,
    hoverIndex: number,
    sourceCategoryId: number,
    targetCategoryId: number
  ) => {
    let draggedTicketId: string | null = null;
    let updatedTargetCategoryId: number | null = null;

    setCategories((prev) => {
      const updated = structuredClone(prev);
      const sourceCategory = updated.find((c) => c.id === sourceCategoryId);
      const targetCategory = updated.find((c) => c.id === targetCategoryId);
      if (!sourceCategory || !targetCategory) return prev;

      const [draggedTicket] = sourceCategory.tickets.splice(dragIndex, 1);
      if (!draggedTicket) return prev;

      if (sourceCategoryId !== targetCategoryId) {
        draggedTicket.categoryId = targetCategoryId;
        draggedTicketId = draggedTicket.id;
        updatedTargetCategoryId = targetCategoryId;
      }

      targetCategory.tickets.splice(hoverIndex, 0, draggedTicket);
      return updated;
    });

    if (draggedTicketId && updatedTargetCategoryId !== null) {
      updateTicketCategory(draggedTicketId, updatedTargetCategoryId).catch(
        console.error
      );
    }
  };

  const refreshCategories = async () => {
    setIsLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshCategories();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex gap-4 px-6 py-10 bg-gray-50 overflow-x-auto">
        {categories.map((category) => (
          <Category
            key={category.id}
            category={category}
            moveTicket={moveTicket}
            onTicketClick={(ticket) => setSelectedTicket(ticket)}
            refreshCategories={refreshCategories}
          />
        ))}
      </div>

      <Drawer isOpen={!!selectedTicket} onClose={() => setSelectedTicket(null)}>
        {selectedTicket && <TicketDetails ticket={selectedTicket} />}
      </Drawer>
    </DndProvider>
  );
}
