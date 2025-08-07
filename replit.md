# Overview

This is a comprehensive healthcare revenue cycle management dashboard application featuring advanced analytics across multiple domains: documentation request analysis, denial management, accounts receivable management, AI-powered predictive analytics, and three critical RFP-required modules. The system provides complete tracking and automation for healthcare administrative processes, with particular emphasis on identifying redundant documentation requests, managing timely filing deadlines, optimizing payer interactions, advanced AR aging analysis with statistical process control, pre-authorization management, clinical decision support, and automated appeal generation. The application features a modern React frontend with a Node.js/Express backend, PostgreSQL database integration, OpenAI-powered intelligent recommendations, comprehensive role-based access control (RBAC) system with Replit authentication integration, and advanced CSV import capabilities supporting real healthcare data from multiple sources including revenue cycle accounts, preauthorization data, physician advisor reviews, documentation tracking, and denial workflows.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built using React with TypeScript and follows a component-based architecture:
- **UI Framework**: Utilizes Radix UI primitives with custom styling through shadcn/ui components
- **Styling**: Tailwind CSS with custom healthcare-themed color variables and responsive design
- **State Management**: React Query (TanStack Query) for server state management with optimistic updates
- **Routing**: Wouter for lightweight client-side routing
- **Charts and Visualizations**: Recharts library for data visualization including bar charts, heat maps, and trend analysis
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
The backend follows a RESTful API design pattern:
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Routes**: Organized around core entities (metrics, documentation requests, payer behavior, redundancy matrix)
- **Data Validation**: Zod schemas for request/response validation
- **Storage Interface**: Abstracted storage layer with DatabaseStorage implementation using PostgreSQL
- **Authentication**: Replit Auth integration with OpenID Connect and Passport.js
- **Authorization**: Comprehensive RBAC system with 10 healthcare-specific roles
- **Security**: Permission-based middleware protection with audit logging
- **Development**: Hot module replacement and error handling for development experience

## Database and Data Management
- **ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database operations
- **Database**: PostgreSQL with Neon serverless configuration
- **Schema Management**: Centralized schema definitions with automated migration support
- **Connection**: Environment-based database URL configuration with connection pooling
- **RBAC Tables**: Complete role-based access control schema with users, roles, permissions, and audit logging
- **Session Management**: PostgreSQL-backed session storage for authentication
- **Demo Data**: Comprehensive demo user system with 12 healthcare staff accounts for testing

## Core Data Models
The application manages multiple comprehensive entities:
1. **Metrics**: Dashboard KPIs with change tracking and status indicators
2. **Documentation Requests**: Claims requiring additional documentation with redundancy detection
3. **Payer Behavior**: Analytics on insurance company patterns and response rates
4. **Redundancy Matrix**: Cross-tabulation of document types vs payers for pattern identification
5. **Predictive Analytics**: AI-powered risk scoring and denial prediction models
6. **AR Management**: Accounts receivable trends, aging analysis, and financial performance tracking
7. **Statistical Process Control**: AR trend analysis with changepoint detection and control limits
8. **Collections Management**: Discharge location analysis, payer class balances, aging subcategories, and high-priority account tracking
9. **Timely Filing Management**: Claims deadline tracking, risk assessment, department performance monitoring, and automated alerts for filing deadlines
10. **Clinical Denials Management**: Comprehensive denial review workflows, appeal tracking, clinical reviewer performance monitoring, and denial reason analysis
11. **Pre-Authorization Management**: Complete workflow for flagging procedures requiring pre-auth, comparing against insurer criteria, tracking approval status, and ensuring 90% completion 3+ days prior to procedures
12. **Clinical Decision Support**: Real-time patient status monitoring, medical record analysis, clinical indicators tracking, and AI-powered recommendations for status changes and documentation improvements
13. **Automated Appeal Generation**: AI-powered challenge letter generation, clinical evidence extraction, success probability scoring (>70% target), and comprehensive appeal outcome tracking
14. **User Management**: Complete RBAC system with 10 healthcare roles (System Admin, Clinical Director, Revenue Manager, Billing Manager, Clinical Reviewer, Denial Specialist, AR Specialist, Collections Specialist, Financial Analyst, Read Only User)
15. **Authentication System**: Replit Auth integration with user profiles, role assignments, and permission-based access control
16. **CSV Import System**: Advanced data import capabilities supporting revenue cycle accounts (50+ fields), preauthorization data, physician advisor reviews, documentation tracking, and denial workflows with comprehensive field mapping and validation

## Recent Changes (January 2025)
- Enhanced CSV import functionality to support complete data dictionary with 50+ fields for revenue cycle accounts
- Added support for importing preauthorization data, physician advisor reviews, documentation tracking, and denial workflows
- Improved field mapping to handle all data dictionary specifications including NULL value handling
- Updated navigation system to include "Import Data" link accessible from all pages
- Successfully tested import functionality with real healthcare data files
- Created database structure with all required tables for imported datasets
- Established proper database integration framework for transitioning from in-memory to persistent storage
- User successfully imported datasets: revenue_cycle_accounts, preauthorization_data, physician_advisor_reviews, documentation_tracking, denial_workflows, clinical_decisions, appeal_cases, timely_filing_claims

## Component Architecture
The dashboard implements a modular component structure:
- **MetricsPanel**: Left sidebar with 11 key performance indicators
- **DocumentationDashboard**: Main content area with tabbed interface for denial management
- **PredictiveDashboard**: Advanced AI-powered analytics with risk scoring and recommendations
- **ArManagementDashboard**: Comprehensive AR analysis with statistical process control
- **CollectionsDashboard**: Collections management with discharge location performance and aging analysis
- **TimelyFilingDashboard**: Claims filing deadline management with risk assessment and department performance tracking
- **ClinicalDenialsDashboard**: Clinical denial management with review workflows, appeal tracking, and reason analysis
- **Charts**: Specialized visualization components (volume charts, heat maps, trend analysis, SPC charts, discharge location performance, payer class breakdowns, filing trends, department performance, denial trends, reason analysis)
- **DataTables**: Interactive tables with sorting, filtering, and action buttons
- **AI Components**: OpenAI-powered recommendation engine and pattern analysis
- **Authentication Components**: User profile management, navigation with role badges, demo user selector, and RBAC-aware component wrappers
- **Navigation**: Role-based navigation menu with user dropdown, profile access, development tools, and dedicated RFP Modules tab
- **RFP Module Components**: Pre-Authorization Dashboard, Clinical Decision Dashboard, and Appeal Generation Dashboard with comprehensive workflows and analytics

## Development and Build Process
- **Development**: Concurrent client and server development with hot reloading
- **Build**: Separate client (Vite) and server (esbuild) build processes
- **Database**: Push-based schema deployment with Drizzle Kit
- **Environment**: Development/production environment detection with appropriate tooling

# External Dependencies

## AI and Analytics Services
- **OpenAI GPT-4o**: Advanced language model for predictive analytics and intelligent recommendations
- **Statistical Analysis**: SPC charting with changepoint detection algorithms

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Drizzle ORM**: Type-safe database toolkit with migration management

## UI and Styling Libraries
- **Radix UI**: Headless component primitives for accessibility and interaction patterns
- **Tailwind CSS**: Utility-first CSS framework with custom healthcare theme
- **Lucide React**: Icon library for consistent iconography
- **Recharts**: Data visualization library for charts and graphs

## Development and Build Tools
- **Vite**: Frontend build tool with development server and HMR
- **TypeScript**: Static type checking across the entire application
- **ESBuild**: Fast JavaScript bundler for server-side code
- **Wouter**: Minimalist routing library for single-page application navigation

## Data Management
- **TanStack Query**: Server state management with caching and synchronization
- **Zod**: Schema validation for API requests and responses
- **Date-fns**: Date utility library for time-based calculations

## Authentication and Security
- **Replit Auth**: OpenID Connect authentication with multi-domain support
- **Session Management**: PostgreSQL-backed session storage with secure cookies
- **RBAC System**: Complete role-based access control with permission middleware
- **Audit Logging**: Comprehensive user action tracking with IP and user agent logging
- **Demo Users**: 12 pre-configured healthcare staff accounts for testing role-based access

## Session and Development
- **Express Session**: Session management with PostgreSQL store integration
- **Replit Integration**: Development environment integration with error overlays and debugging tools
- **Demo Environment**: Automatic demo user creation and RBAC initialization in development mode