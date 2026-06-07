# Qlockcare Admin

Qlockcare Admin is a comprehensive, enterprise-grade administration dashboard engineered specifically for digital agencies, healthcare compliance organizations, and tech-forward management teams. Built to handle complex data relationships with an emphasis on speed and usability, this platform centralizes the management of agency profiles, client accounts, compliance tracking, secure document handling, and support ticketing.

The application is meticulously crafted with a premium, highly responsive user interface that features dynamic dark mode elements, smooth micro-animations, and interactive, state-driven components.

## ✨ Core Modules & Key Features

### 1. Global Dashboard & Analytics
- **High-Level Overview:** Instantly view active agencies, pending compliance alerts, open support tickets, and recent activities.
- **Metric Visualizations:** At-a-glance statistic cards summarizing the health of your network.

### 2. Agency & Client Management
- **Centralized Directory:** Track and manage all associated agency profiles and their respective user accounts.
- **Role-Based Views:** Filter clients and staff by roles and permissions to ensure secure access control.

### 3. Compliance & Risk Mitigation
- **Expiring Licenses Tracker:** Automatically monitor expiring compliance licenses and certifications.
- **Visual Risk Indicators:** Color-coded severity badges (Critical, High, Medium, Low) instantly highlight which agencies require immediate intervention.

### 4. Documents & Licenses Vault
- **Missing Document Reports:** Quickly identify which agencies are missing mandatory operational or financial documents.
- **Automated Request Workflows:** One-click modals to dispatch customized email requests to agencies for missing files.
- **Document Review Pane:** View submitted documents, review file metadata, and approve or reject submissions seamlessly.

### 5. Support & Ticketing System
- **Robust Ticket Management:** A full-featured ticketing queue for handling agency inquiries and technical issues.
- **Prioritization & SLAs:** Tickets are tagged with priority levels (Critical to Low) and statuses (Open, Pending, Resolved) with SLA tracking.
- **Full CRUD Capabilities:** Interactive modals allow administrators to View detailed ticket histories, Edit ticket metadata and assignments, and permanently Delete records.

### 6. Centralized Notification Center
- **Categorized Alerts:** Segregates notifications by type: System Alerts, Mentions, Document Uploads, and Compliance Warnings.
- **Interactive Filtering:** Toggle between 'All', 'Unread', and 'Mentions' to clear your queue efficiently.
- **Quick Actions:** Execute context-specific actions (e.g., "View Ticket", "Review Document") directly from the notification feed.

### 7. Global Platform Settings
- **Profile Management:** Update administrative user details, avatars, and contact information.
- **Security Protocols:** Change passwords through a secure interface featuring real-time requirement validation and visibility toggles.
- **Notification Preferences:** Fine-tune the delivery methods (Email vs. Push) for different alert types (Urgent tickets, daily summaries, marketing).
- **Custom Content Management System (CMS):** A bespoke, built-in rich text editor empowering admins to seamlessly draft, format, and publish updates to the platform's Privacy Policy, Terms & Conditions, and About Us pages without touching code.

## 🎨 UI/UX Design Philosophy

The application strictly adheres to a premium, modern design system focusing on:
- **Consistent Theming:** Deep integration of Tailwind CSS variables ensures perfect harmony across light and dark modes utilizing `bg-card`, `bg-background`, and subtle `border-border` accents.
- **Focus and Clarity:** High-contrast alert badges (Red/Orange/Green) draw the eye to critical tasks without overwhelming the user.
- **Frictionless Interactions:** Custom modals, dropdowns, and sticky sidebar layouts eliminate the need for excessive page reloads, preserving context and accelerating workflows.

## 🛠️ Technologies & Architecture

- **Core Framework:** [Next.js](https://nextjs.org/) (Utilizing the App Router for nested layouts and Server Components).
- **Build Engine:** Turbopack for lightning-fast local development and optimized production builds.
- **Frontend Library:** [React 18+](https://react.dev/) leveraging modern hooks for state management.
- **Styling Engine:** [Tailwind CSS](https://tailwindcss.com/) for utility-first, highly maintainable styling architectures.
- **Iconography:** [Lucide React](https://lucide.dev/) for crisp, scalable, and consistent SVG icons.
- **Infrastructure:** Designed for seamless deployment on [Vercel](https://vercel.com/) with Edge caching capabilities.
