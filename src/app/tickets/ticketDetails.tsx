"use client";

import { useState } from "react";
import { TicketProps } from "@/types/ticket";
import Drawer from "@/components/drawer";

type TicketDetailsProps = {
  ticket: TicketProps;
};

const TicketDetails = ({ ticket }: TicketDetailsProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isClosed = ticket.status === "Closed";

  return (
    <>
      <div
        key={ticket.id}
        className={`flex justify-between items-center bg-white rounded-lg shadow border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow ${
          isClosed ? "opacity-50" : ""
        }`}
        onClick={() => !isClosed && setIsDrawerOpen(true)}
      >
        {/* Left Side */}
        <div>
          <h2 className="text-xl font-semibold text-blue-600">
            {ticket.title}
          </h2>
          <p className="text-sm text-gray-500 mt-1">{ticket.description}</p>
        </div>
        {/* Right Side */}
        <div className="text-right space-y-2">
          <div className="text-sm text-gray-500">
            Priority: <span className="font-medium">{ticket.priority}</span>
          </div>
          <div className="text-sm text-gray-500">
            Status: <span className="font-medium">{ticket.status}</span>
          </div>
        </div>
      </div>

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Title</h3>
            <p className="mt-1 text-gray-700">{ticket.title}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900">Description</h3>
            <p className="mt-1 text-gray-700 whitespace-pre-wrap">
              {ticket.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Priority</h3>
              <p className="mt-1 text-gray-700">{ticket.priority}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Status</h3>
              <p className="mt-1 text-gray-700">{ticket.status}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Type</h3>
              <p className="mt-1 text-gray-700">{ticket.type}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Estimation
              </h3>
              <p className="mt-1 text-gray-700">{ticket.estimation} hours</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900">Created At</h3>
            <p className="mt-1 text-gray-700">
              {new Date(ticket.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default TicketDetails;
