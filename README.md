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

### Dashboard
![Dashboard Placeholder](https://placehold.co/300x200?text=Dashboard+View)
*View and manage your workflows.*

### Workflow Editor
![Editor Placeholder](https://placehold.co/300x200?text=Workflow+Editor)
*Drag-and-drop interface for building automation logic.*

> **How to add your own images:**
> 1. Take screenshots of your application.
> 2. Resize them or ensure they look good at a smaller scale (recommended width ~800px for full details, but displayed smaller).
> 3. Store them in a `public/images` folder (create it if it doesn't exist).
> 4. Replace the URLs above with relative paths like `![Dashboard View](/images/dashboard-screenshot.png)`.
> *Note: The placeholders above use `https://placehold.co` for demonstration.*

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
