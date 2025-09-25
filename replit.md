# Overview

This is a comprehensive healthcare dashboard application featuring advanced analytics across multiple domains. The application features a modern React frontend with a Node.js/Express backend, PostgreSQL database integration, OpenAI-powered intelligent recommendations, and Replit authentication integration.

# User Preferences

Preferred communication style: Simple, everyday language. Do not use icons or emojis.


## Branding Implementation
- Integrated Health Catalyst TriFlame logo from https://cashmere.healthcatalyst.net/assets/TriFlame.svg
- Logo positioned flush left with 40px x 40px dimensions and #00aeff blue background
- Logo container extends full navbar height (60px) with no healthcare header background visible to the left
- Maintains centered TriFlame icon within blue background rectangle

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
- **Session Management**: PostgreSQL-backed session storage for authentication
- **Demo Data**: Comprehensive demo user system with 12 healthcare staff accounts for testing

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
- **Audit Logging**: Comprehensive user action tracking with IP and user agent logging
- **Demo Users**: 12 pre-configured healthcare staff accounts for testing role-based access

## Session and Development
- **Express Session**: Session management with PostgreSQL store integration
- **Replit Integration**: Development environment integration with error overlays and debugging tools
- **Demo Environment**: Automatic demo user creation and RBAC initialization in development mode