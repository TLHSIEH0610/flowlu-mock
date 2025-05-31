import { getTickets } from "@/actions/ticket.actions";
import TicketDetails from "./ticketDetails";
import { TicketProps } from "@/types/ticket";
import Categories from "@/app/tickets/categories";

export default async function TicketsPage() {
  const tickets = await getTickets();

  return (
    <div className="min-h-screen p-8 bg-[#f8f9fd]">
      <Categories />
      <h1 className="text-3xl font-bold text-blue-600 mb-8 text-center">
        Board
      </h1>
      {tickets.length === 0 ? (
        <p className="text-center text-gray-600">No Tickets Yet</p>
      ) : (
        <div className="space-y-4 max-w-3xl mx-auto">
          {tickets.map((ticket: TicketProps) => (
            <TicketDetails key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
}
