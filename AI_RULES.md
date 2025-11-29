# AI Development Rules

This document outlines the technical stack and coding conventions for this project. Following these rules ensures consistency, maintainability, and high-quality code.

## Tech Stack

The application is built with a modern, type-safe, and efficient technology stack:

-   **Framework**: React with Vite for a fast development experience.
-   **Language**: TypeScript for static typing and improved code quality.
-   **UI Components**: shadcn/ui, a collection of beautifully designed, accessible, and customizable components built on Radix UI and Tailwind CSS.
-   **Styling**: Tailwind CSS for a utility-first styling approach.
-   **Routing**: React Router (`react-router-dom`) for all client-side navigation.
-   **Data Fetching & Server State**: TanStack React Query for managing asynchronous operations, caching, and server state.
-   **Forms**: React Hook Form for performance-optimized form state management, paired with Zod for schema-based validation.
-   **Icons**: Lucide React for a consistent and comprehensive set of icons.
-   **Charts**: Recharts for creating data visualizations.
-   **Notifications**: A combination of the custom `use-toast` hook (for shadcn/ui's `Toaster`) and `sonner` for toast-style notifications.

## Library Usage and Coding Conventions

### 1. UI Components

-   **Primary Library**: **ALWAYS** use components from `shadcn/ui` (`@/components/ui/*`).
-   **Custom Components**: If a required component does not exist in `shadcn/ui`, create a new reusable component in the `src/components/` directory. Style it with Tailwind CSS and follow the existing project's architectural patterns.
-   **Prohibited**: Do not introduce other UI libraries like Material-UI, Ant Design, or Bootstrap.

### 2. Styling

-   **Method**: Use Tailwind CSS utility classes for all styling.
-   **Custom CSS**: Avoid writing custom CSS files. Global styles and theme variables are defined exclusively in `src/index.css`.

### 3. State Management

-   **Server State**: **ALWAYS** use TanStack React Query for fetching, caching, and managing data from APIs.
-   **Client State**:
    -   For local component state, use React's built-in hooks (`useState`, `useReducer`).
    -   For cross-component state, use React Context (`createContext`). The `AuthContext` is a good example.
-   **Prohibited**: Do not add global state libraries like Redux or Zustand without explicit discussion and approval.

### 4. Routing

-   **Library**: All routing must be handled by `react-router-dom`.
-   **Configuration**: Routes are defined in `src/App.tsx`.
-   **Navigation**: Use the custom `NavLink` component from `@/components/NavLink.tsx` for navigation links to ensure proper active styling.

### 5. Forms

-   **Logic**: Use `react-hook-form` for handling form state, submissions, and validation logic.
-   **Validation**: Use `zod` to define validation schemas for all forms.
-   **Integration**: Connect `react-hook-form` with `shadcn/ui` form components (`Input`, `Select`, `Checkbox`, etc.).

### 6. Icons

-   **Library**: **ONLY** use icons from the `lucide-react` package to maintain visual consistency.

### 7. Notifications

-   **Toasts**: Use the `toast()` function from the custom `use-toast.ts` hook for simple, non-critical feedback (e.g., "Profile saved!"). This integrates with the `shadcn/ui` `Toaster`.
-   **Dialogs**: For actions that require user confirmation or interrupt the user flow, use the `AlertDialog` or `Dialog` components from `shadcn/ui`.

### 8. File Structure

-   **Pages**: Top-level page components go in `src/pages/`.
-   **Reusable Components**: General-purpose components are located in `src/components/`. Specific components for a feature (e.g., dashboard) can be in subdirectories like `src/components/dashboard/`.
-   **Hooks**: Custom hooks reside in `src/hooks/`.
-   **Utilities**: General utility functions are placed in `src/lib/`.
-   **Contexts**: React Context providers and hooks are in `src/contexts/`.
-   **Static Data**: Mock data and static definitions are in `src/data/`.