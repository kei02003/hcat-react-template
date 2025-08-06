# Overview

This is a comprehensive healthcare revenue cycle management dashboard application featuring advanced analytics across multiple domains: documentation request analysis, denial management, accounts receivable management, and AI-powered predictive analytics. The system provides complete tracking and automation for healthcare administrative processes, with particular emphasis on identifying redundant documentation requests, managing timely filing deadlines, optimizing payer interactions, and advanced AR aging analysis with statistical process control. The application features a modern React frontend with a Node.js/Express backend, PostgreSQL database integration, and OpenAI-powered intelligent recommendations.

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
- **Storage Interface**: Abstracted storage layer with in-memory implementation for development
- **Development**: Hot module replacement and error handling for development experience

## Database and Data Management
- **ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database operations
- **Database**: PostgreSQL with Neon serverless configuration
- **Schema Management**: Centralized schema definitions with automated migration support
- **Connection**: Environment-based database URL configuration with connection pooling

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

## Session and Development
- **Express Session**: Session management with PostgreSQL store integration
- **Replit Integration**: Development environment integration with error overlays and debugging tools