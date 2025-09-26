# Overview

This project is a comprehensive healthcare dashboard application designed for advanced analytics across multiple domains. It features a modern React frontend, a Node.js/Express backend, PostgreSQL integration, and intelligent recommendations powered by OpenAI. The application aims to provide a robust platform for healthcare revenue cycle management, clinical data analysis, and overall healthcare analytics.

# User Preferences

Preferred communication style: Simple, everyday language. Do not use icons or emojis.

# System Architecture

## Frontend Architecture
The frontend is built with React and TypeScript, using Radix UI primitives and shadcn/ui components, styled with Tailwind CSS for a custom healthcare theme. It uses React Query for server state management, Wouter for routing, and Recharts for data visualizations. Vite is used for development and optimized production builds.

## Backend Architecture
The backend is a Node.js Express.js application written in TypeScript. It follows a RESTful API design, organized by core entities, and uses Zod for data validation. Drizzle ORM interfaces with PostgreSQL, and authentication is handled via Replit Auth (OpenID Connect) with Passport.js. A comprehensive RBAC system with 10 healthcare-specific roles provides authorization and security, including permission-based middleware and audit logging.

## Database and Data Management
The project utilizes PostgreSQL with Neon serverless configuration and Drizzle ORM for type-safe database operations and schema management. It includes centralized schema definitions, automated migration support, and environment-based database connection pooling. Session management is PostgreSQL-backed, and a demo user system with 12 healthcare staff accounts is provided for testing.

## UI/UX Decisions
The application integrates the Health Catalyst TriFlame logo, positioned flush left in the navbar with specific dimensions and background styling to maintain brand consistency.

## Development and Build Process
Development supports concurrent client and server hot reloading. Separate build processes (Vite for client, esbuild for server) are used, with Drizzle Kit handling push-based schema deployment. The system detects development/production environments for appropriate tooling.

# External Dependencies

## AI and Analytics Services
- **OpenAI GPT-4o**: Used for predictive analytics and intelligent recommendations.
- **Statistical Analysis**: SPC charting with changepoint detection algorithms.

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting.
- **Drizzle ORM**: Type-safe database toolkit and migration management.

## UI and Styling Libraries
- **Radix UI**: Headless component primitives for accessibility.
- **Tailwind CSS**: Utility-first CSS framework with a custom healthcare theme.
- **Lucide React**: Icon library.
- **Recharts**: Data visualization library.

## Development and Build Tools
- **Vite**: Frontend build tool.
- **TypeScript**: Static type checking.
- **ESBuild**: Fast JavaScript bundler for server-side code.
- **Wouter**: Minimalist routing library.

## Data Management
- **TanStack Query**: Server state management.
- **Zod**: Schema validation.
- **Date-fns**: Date utility library.

## Authentication and Security
- **Replit Auth**: OpenID Connect authentication.
- **Express Session**: Session management with PostgreSQL store.