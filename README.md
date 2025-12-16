
# NodeBase Workflow

NodeBase Workflow is a powerful, visual automation platform designed to help you streamline tasks and integrate various services with ease. Built with modern web technologies, it offers a seamless and intuitive experience for building complex workflows without writing code.

Whether you're looking to automate repetitive tasks, connect APIs, or build sophisticated logic flows, NodeBase Workflow provides the tools you need in a drag-and-drop interface.

## 🚀 For Who is This?

This platform is designed for:
- **Developers** who want to orchestrate microservices or automate backend processes visually.
- **Business Analysts** & **Operations Managers** looking to automate business logic without deep coding knowledge.
- **SaaS Builders** who need a reference implementation or a foundation for building their own workflow automation tools.

### Key Benefits
- **Visual Editor**: Create workflows by dragging and dropping nodes.
- **Extensible**: Easily add new triggers and actions.
- **Secure**: Manage credentials securely for third-party integrations.
- **Real-time**: Monitor execution status and logs in real-time.

## 🛠 Tech Stack

This project is built using a cutting-edge stack for performance, scalability, and developer experience:

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via [Prisma ORM](https://www.prisma.io/))
- **Workflow Engine**: Custom engine built on top of [Inngest](https://www.inngest.com/) for reliable event-driven execution.
- **Visual Flow**: [React Flow (xyflow)](https://reactflow.dev/)
- **Authentication**: [Better-Auth](https://github.com/polar-sh/better-auth)
- **AI Integration**: [AI SDK](https://sdk.vercel.ai/docs) (OpenAI, Anthropic, Google) integration for intelligent nodes.
- **Validation**: [Zod](https://zod.dev/)

## 🌐 Live Demo & Screenshots

Check out the live application here: **[https://nodebase-workflow.vercel.app/](https://nodebase-workflow.vercel.app/)**

## 5. Project Gallery
*To add your own images, replace the URLs below with screenshots of your application found in your `public` folder or hosted externally.*

| Home Page | Execution History |
| :---: | :---: |
| ![Home Page](https://i.ibb.co/1GzKwcL0/sign-in.png) | ![Execution History](https://i.ibb.co/hR55FCRp/execution-history.png) |
| *Modern Landing Page* | *Rich Text Editing* |

| Blog Post | Workflow Playground |
| :---: | :---: |
| ![Setup Workflow](https://i.ibb.co/4w339jDK/workflow-setup.png) | ![Choose what to do](https://i.ibb.co/kp0BW2z/functions.png) |
| *Clean Reading Experience* | *Real-time Discussion* |

## 💻 Getting Started (For Developers)

Follow these instructions to set up the project locally.

### Prerequisites
- Node.js (v18+ recommended)
- NPM or PNPM
- PostgreSQL database URL

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/nodebase.git
   cd nodebase
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Environment Setup:**
   Duplicate the `.env.example` file to `.env` (or create one) and fill in the required variables:
   ```bash
   DATABASE_URL="postgresql://..."
   BETTER_AUTH_SECRET="your-secret"
   INNGEST_EVENT_KEY="your-inngest-key"
   # Add OpenAI/Anthropic keys if using AI features
   ```

4. **Database Setup:**
   Run migrations to set up your database schema.
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the Development Server:**
   ```bash
   npm run dev
   ```

6. **Start Inngest (for workflow execution):**
   In a separate terminal, start the Inngest local dev server to handle events and step execution.
   ```bash
   npx inngest-cli dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
=======
# Nodebase

A powerful visual workflow automation platform built with Next.js that enables users to create, manage, and execute complex workflows through an intuitive node-based interface.

![Nodebase](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?style=flat-square&logo=prisma)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

## ✨ Features

1. **Visual Workflow Builder** - Drag-and-drop interface powered by XYFlow for creating complex automation workflows with an intuitive node-based editor

2. **Multi-Trigger Support** - Start workflows with various triggers:
   - Manual triggers for on-demand execution
   - Google Forms integration for form submission automation
   - Stripe webhook integration for payment event automation

3. **AI Integration** - Connect to multiple AI providers:
   - OpenAI (GPT models)
   - Anthropic (Claude models)
   - Google Gemini models

4. **HTTP Request Node** - Make external API calls with full support for:
   - Custom headers and authentication
   - Dynamic variable interpolation using Handlebars templates
   - Multiple HTTP methods (GET, POST, PUT, DELETE, etc.)

5. **Real-time Execution Monitoring** - Track workflow execution status in real-time with:
   - Live status updates (loading, success, error)
   - Detailed execution logs and error tracking
   - Execution history and analytics

6. **Secure Credential Management** - Store and manage API keys securely with:
   - Encrypted credential storage
   - Per-user credential isolation
   - Support for multiple credential types (OpenAI, Anthropic, Gemini)

7. **Authentication & Authorization** - Complete auth system powered by Better Auth:
   - Email/password authentication
   - Social login (Google, GitHub)
   - Session management
   - Protected routes and API endpoints

8. **Subscription Management** - Integrated with Polar.sh for:
   - Subscription-based access control
   - Customer portal
   - Checkout flow integration

9. **Messaging Integrations** - Send notifications and messages to:
   - Discord channels
   - Slack workspaces

10. **Advanced Workflow Features**:
    - Node connections with multiple input/output ports
    - Variable passing between nodes
    - Conditional execution paths
    - Error handling and retry logic

11. **Production-Ready Infrastructure**:
    - Error tracking with Sentry
    - PostgreSQL database with Prisma ORM
    - Type-safe API with tRPC
    - Server-side rendering and API routes
    - Optimized for Vercel deployment

12. **Developer Experience**:
    - Full TypeScript support
    - React Query for data fetching
    - Jotai for state management
    - Biome for linting and formatting
    - Comprehensive error boundaries

## 🛠️ Tech Stack

### Core Framework
- **Next.js 16** - React framework for production with App Router, Server Components, and API routes
- **React 19** - UI library with latest concurrent features
- **TypeScript 5** - Type safety and enhanced developer experience

### Database & ORM
- **PostgreSQL** - Primary database for storing workflows, users, and execution data
- **Prisma 6** - Type-safe database ORM with migrations and schema management
- **@prisma/adapter-pg** - PostgreSQL adapter for optimized Vercel deployments

### Authentication & Payments
- **Better Auth** - Modern authentication library with social providers
- **@polar-sh/better-auth** - Polar.sh integration for subscription management
- **@polar-sh/sdk** - Polar.sh SDK for checkout and customer portal

### Workflow Orchestration
- **Inngest** - Durable workflow execution engine for reliable background jobs
- **@inngest/realtime** - Real-time status updates for workflow executions
- **@xyflow/react** - Visual node-based workflow editor

### AI & External Services
- **@ai-sdk/openai** - OpenAI integration (GPT-3.5, GPT-4, etc.)
- **@ai-sdk/anthropic** - Anthropic integration (Claude models)
- **@ai-sdk/google** - Google Gemini integration
- **ai** - Vercel AI SDK for unified AI provider interface
- **ky** - HTTP client for external API requests

### API & Data Fetching
- **tRPC** - End-to-end type-safe API layer
- **@tanstack/react-query** - Powerful data fetching and caching
- **superjson** - JSON serialization with support for Date, Map, Set, etc.

### UI Components & Styling
- **Radix UI** - Unstyled, accessible component primitives (Dialog, Dropdown, Select, etc.)
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - Re-usable component library built on Radix UI
- **lucide-react** - Beautiful icon library
- **next-themes** - Dark mode support

### State Management & Forms
- **Jotai** - Primitive and flexible state management
- **React Hook Form** - Performant form validation
- **Zod 4** - TypeScript-first schema validation
- **@hookform/resolvers** - Form validation resolvers

### Utilities & Tools
- **Handlebars** - Template engine for dynamic variable interpolation
- **date-fns** - Modern date utility library
- **cryptr** - Encryption for secure credential storage
- **toposort** - Topological sorting for workflow execution order
- **@paralleldrive/cuid2** - Collision-resistant unique IDs

### Developer Tools
- **Biome** - Fast linter and formatter (Prettier/ESLint alternative)
- **Sentry** - Error tracking and performance monitoring
- **ngrok** - Secure tunneling for local webhook testing
- **tsx** - TypeScript execution for scripts

## 🎯 Use Cases

### Business Automation
- Automate customer onboarding workflows when payments are received via Stripe
- Send welcome messages to Discord/Slack when new users sign up
- Process form submissions and trigger follow-up actions

### AI-Powered Workflows
- Build chatbots that combine multiple AI models
- Create content generation pipelines with GPT-4, Claude, or Gemini
- Automate customer support responses with AI

### Integration Hub
- Connect Google Forms to your database and notification systems
- Sync data between multiple SaaS applications
- Create custom API integrations without code

### Data Processing
- Transform and route data between different services
- Build ETL (Extract, Transform, Load) pipelines
- Aggregate data from multiple sources

### Notification Systems
- Send alerts to Discord/Slack based on specific triggers
- Create custom notification workflows for your team
- Build escalation systems for critical events

### E-commerce Automation
- Process Stripe payments and trigger fulfillment workflows
- Send order confirmations and updates
- Manage subscription lifecycle events

### Development & Testing
- Create webhook testing environments
- Build API mocking and testing workflows
- Automate deployment notifications

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ and npm
- PostgreSQL database
- Inngest account (for workflow execution)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/nodebase.git
cd nodebase
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Configure the following variables:
- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_URL` - Your app URL
- `INNGEST_EVENT_KEY` - Inngest event key
- `GITHUB_CLIENT_ID` & `GITHUB_CLIENT_SECRET` - GitHub OAuth
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` - Google OAuth
- Additional API keys as needed

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
```

6. In a separate terminal, start Inngest dev server:
```bash
npm run inngest
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📦 Deployment

This project is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Configure environment variables
4. Deploy!

See [INNGEST_SETUP.md](./INNGEST_SETUP.md) for detailed Inngest configuration instructions.

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or support, please open an issue on GitHub.
>>>>>>> 7b90b49df99c0bbc4d2466b1ebf85655bdda49cc
