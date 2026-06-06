"use client";

import { supportTickets } from '../../components/support/data';
import { SupportStatCards } from '../../components/support/SupportStatCards';
// import { SupportFilters } from '../../components/support/SupportFilters';
import { TicketList } from '../../components/support/TicketList';

export default function SupportPage() {
    return (
        <main className="p-5 space-y-5">
            <SupportStatCards />
            {/* <SupportFilters /> */}
            <TicketList tickets={supportTickets} />
        </main>
    );
}
