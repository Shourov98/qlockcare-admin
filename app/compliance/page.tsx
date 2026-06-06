"use client";

import { ExpiringLicensesTable } from '../../components/compliance/ExpiringLicensesTable';
import { ComplianceIssueQueueTable } from '../../components/compliance/ComplianceIssueQueueTable';
import { CompliancePieChart } from '../../components/compliance/CompliancePieChart';
import { ComplianceStatCards } from '../../components/compliance/ComplianceStatCards';
import { ComplianceBarChart } from '../../components/compliance/ComplianceBarChart';

export default function ComplianceDashboard() {
    return (
        <main className="p-5 space-y-5">
            <ComplianceStatCards />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <ComplianceBarChart />
                <CompliancePieChart />
            </div>
            <ExpiringLicensesTable />
            <ComplianceIssueQueueTable />
        </main>
    );
}
