import { TicketProps } from "@/types/ticket";

const TicketDetails = ({ ticket }: { ticket: TicketProps }) => {
  return (
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
          <h3 className="text-lg font-semibold text-gray-900">Estimation</h3>
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
  );
};

export default TicketDetails;
