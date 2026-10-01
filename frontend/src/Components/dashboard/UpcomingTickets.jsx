import TicketCard from "./TicketCard";
import { Link } from "react-router-dom";

function UpcomingTickets({ tickets }) {
  return (
    <section>
      <h2 className="text-xl font-serif font-semibold text-gray-900 mb-4">
        Upcoming Tickets
      </h2>

      {tickets.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-200 p-10 text-center">
          <p className="text-sm text-gray-500 mb-4">
            You haven't purchased any tickets yet.
          </p>
          <Link
            to="/"
            className="inline-block px-5 py-2.5 bg-[#4A0E1C] text-white rounded-md text-sm font-medium hover:bg-[#3a0b16]"
          >
            Discover Events
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </section>
  );
}

export default UpcomingTickets;