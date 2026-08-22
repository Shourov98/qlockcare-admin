import { SupportStatCards } from '../../components/support/SupportStatCards';
import { TicketList } from '../../components/support/TicketList';

export default function SupportPage() {
    return (
        <main className="p-5 space-y-5">
            <SupportStatCards />
            <TicketList />
        </main>
    );
}