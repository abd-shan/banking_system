# Bank Management System Frontend

This is the Next.js frontend application for the Bank Management System, designed to interact with a NestJS backend API. The application is built with a focus on clean architecture, maintainability, and scalability, utilizing the **Facade Design Pattern** to manage all external API interactions.

## 🚀 Technology Stack

*   **Frontend Framework:** [Next.js](https://nextjs.org/) (App Router)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **HTTP Client:** [Axios](https://axios-http.com/)
*   **Package Manager:** npm

## 🏛️ Architecture: The Facade Pattern

The core architectural principle of this frontend is the **Facade Pattern**. This pattern provides a unified, simplified interface to a set of interfaces in a subsystem, making the subsystem easier to use.

### Implementation Details

1.  **Low-Level Services (`src/api`)**: Individual service classes (`AuthService`, `AccountService`, `TransactionService`, etc.) are responsible for direct communication with the NestJS backend using `Axios`. They handle the raw HTTP requests and responses.
2.  **The Facade (`src/facades/BankFacade.ts`)**: The `BankFacade` class acts as the single point of entry for all business logic and data fetching. UI components only interact with the Facade, which in turn delegates the calls to the appropriate low-level service.

This separation ensures that:
*   **UI Components are Clean:** They are decoupled from the complexities of API endpoints, request configurations, and error handling.
*   **Maintainability:** Changes to the backend API (e.g., a route change) only require modifications within the low-level service, not across dozens of UI components.
*   **Testability:** The Facade and its underlying services can be easily mocked and tested in isolation.

## 📦 Project Structure

```
bank-management-frontend/
├── src/
│   ├── api/                  # Low-level API services (AuthService, AccountService, etc.)
│   ├── app/                  # Next.js App Router pages (login, dashboard, admin/users)
│   ├── components/           # Reusable UI components (Login, Navbar, ProtectedRoute)
│   ├── context/              # React Context for global state (AuthContext)
│   ├── facades/             # The core BankFacade implementation
│   ├── hooks/                # Custom React hooks (useAuth)
│   └── types/                # TypeScript interfaces and enums
├── public/
├── package.json
└── README.md
```

## ⚙️ Setup and Installation

### Prerequisites

*   Node.js (v18+)
*   npm (v8+)
*   The corresponding NestJS Backend running on \`http://localhost:3000\`

### Installation Steps

1.  **Clone the repository** (or extract the provided archive).
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the development server:**
    ```bash
    npm run dev
    ```

The application will be accessible at \`http://localhost:3000\`.

## 🔑 Key Features

| Feature                  | Endpoint(s) Consumed                                            | Facade Method                                                       | Access        |
|:-------------------------|:----------------------------------------------------------------|:--------------------------------------------------------------------|:--------------|
| **User Login**           | \`POST /auth/login\`                                            | \`bankFacade.login()\`                                              | Public        |
| **Account Overview**     | \`GET /accounts\`                                               | \`bankFacade.fetchUserAccounts()\`                                  | Authenticated |
| **Deposits/Withdrawals** | \`POST /transactions/deposit\`, \`POST /transactions/withdraw\` | \`bankFacade.performDeposit()\`, \`bankFacade.performWithdrawal()\` | Authenticated |
| **Transfers**            | \`POST /transactions/transfer\`                                 | \`bankFacade.performTransfer()\`                                    | Authenticated |
| **User Creation**        | \`POST /users\`                                                 | \`bankFacade.createNewUser()\`                                      | Admin/Manager |
| **Protected Routes**     | N/A                                                             | N/A                                                                 | Role-Based    |

## 🔒 Authentication and Authorization

*   **Authentication:** Handled via JWT (stored in `localStorage` for this example) and managed by the `useAuth` hook and `AuthContext`.
*   **Authorization:** Implemented using the `<ProtectedRoute>` component, which checks the user's role (`UserRole` enum) against the required roles for a given route (e.g., `/admin/users` is restricted to `ADMIN` and `MANAGER`).

## 🛠️ Configuration

The base URL for the backend API is configured in \`src/api/ApiClient.ts\`:

```typescript
// src/api/ApiClient.ts
const BASE_URL = 'http://localhost:3000';
```
0
For production deployment, this value should be moved to a Next.js environment variable (e.g., \`.env.local\`).
```
