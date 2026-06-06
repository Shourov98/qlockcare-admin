import {
    AlertCircle,
    AlertTriangle,
    MoreHorizontal,
    Info
} from 'lucide-react';

export const expiringLicenses = [
    { id: 1, agency: 'Alpha Benefits', initials: 'AB', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', docType: 'License', docName: 'State Insurance License', expiry: 'Jan 28, 2025', daysUntil: 11, status: 'Critical' },
    { id: 2, agency: 'Coastal Health', initials: 'CH', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', docType: 'Certificate', docName: 'HIPAA Certification', expiry: 'Feb 15, 2025', daysUntil: 29, status: 'Warning' },
    { id: 3, agency: 'Elite Care', initials: 'EC', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', docType: 'License', docName: 'Business Operating License', expiry: 'Mar 10, 2025', daysUntil: 52, status: 'Upcoming' },
    { id: 4, agency: 'Premier Wellness', initials: 'PW', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', docType: 'Document', docName: 'Professional Liability Insurance', expiry: 'Feb 28, 2025', daysUntil: 42, status: 'Warning' },
    { id: 5, agency: 'Summit Financial', initials: 'SF', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', docType: 'Certificate', docName: 'SOC 2 Type II Certification', expiry: 'Apr 05, 2025', daysUntil: 78, status: 'Upcoming' },
];

export const complianceIssues = [
    { id: 1, severity: 'Critical', severityColor: 'text-red-500', severityIcon: AlertCircle, issueTitle: 'Missing Insurance Documentation', issueDesc: 'Required liability insurance proof not uploaded', agency: 'Alpha Benefits', initials: 'AB', avatarColor: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', assignee: 'John Smith', avatarUrl: 'https://i.pravatar.cc/150?u=1', dueDate: 'Jan 20, 2025', dueContext: 'Overdue', dueColor: 'text-red-600 dark:text-red-400', status: 'Open', statusColor: 'text-red-600 dark:text-red-400' },
    { id: 2, severity: 'High', severityColor: 'text-orange-500', severityIcon: AlertTriangle, issueTitle: 'Overdue Certification Renewal', issueDesc: 'HIPAA certification expired 15 days ago', agency: 'Coastal Health', initials: 'CH', avatarColor: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', assignee: 'Sarah Johnson', avatarUrl: 'https://i.pravatar.cc/150?u=2', dueDate: 'Jan 22, 2025', dueContext: '2 days', dueColor: 'text-muted-foreground', status: 'In Progress', statusColor: 'text-primary' },
    { id: 3, severity: 'Medium', severityColor: 'text-yellow-500', severityIcon: MoreHorizontal, issueTitle: 'Incomplete Background Checks', issueDesc: '3 staff members pending background verification', agency: 'Elite Care', initials: 'EC', avatarColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', assignee: 'Mike Davis', avatarUrl: 'https://i.pravatar.cc/150?u=3', dueDate: 'Jan 25, 2025', dueContext: '5 days', dueColor: 'text-muted-foreground', status: 'Pending Review', statusColor: 'text-orange-600 dark:text-orange-400' },
    { id: 4, severity: 'High', severityColor: 'text-orange-500', severityIcon: AlertTriangle, issueTitle: 'Missing Annual Audit Report', issueDesc: 'Required annual financial audit not submitted', agency: 'Premier Wellness', initials: 'PW', avatarColor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', assignee: 'Emily Chen', avatarUrl: 'https://i.pravatar.cc/150?u=4', dueDate: 'Jan 24, 2025', dueContext: '4 days', dueColor: 'text-muted-foreground', status: 'Open', statusColor: 'text-red-600 dark:text-red-400' },
    { id: 5, severity: 'Low', severityColor: 'text-blue-500', severityIcon: Info, issueTitle: 'Policy Acknowledgment Pending', issueDesc: 'Updated privacy policy requires staff acknowledgment', agency: 'Summit Financial', initials: 'SF', avatarColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', assignee: 'David Wilson', avatarUrl: 'https://i.pravatar.cc/150?u=5', dueDate: 'Jan 30, 2025', dueContext: '10 days', dueColor: 'text-muted-foreground', status: 'In Progress', statusColor: 'text-primary' },
];
