import React from 'react';
import { DocumentsStatCards } from '../../components/documents/DocumentsStatCards';
import { MissingDocumentsReport } from '../../components/documents/MissingDocumentsReport';
import { ExpiringLicensesTable } from '../../components/compliance/ExpiringLicensesTable';

export default function DocumentsPage() {
    return (
        <main className="p-5 space-y-5">
            <DocumentsStatCards />
            <MissingDocumentsReport />
            <ExpiringLicensesTable />
        </main>
    );
}
