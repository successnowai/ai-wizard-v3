# DevNOW Platform

AI-Powered Client Onboarding & Project Execution Platform

## 🚀 Features

- **🧙‍♂️ 10-Step AI-Powered Wizard** - Intelligent form completion with AI assistance
- **🤖 Configurable AI Agents** - Unique AI personality for each wizard step
- **📊 Admin Dashboard** - Complete project and user management
- **📄 Automatic PRD Generation** - Comprehensive project requirements documents
- **🔐 Role-Based Authentication** - Secure access control (admin/client)
- **💾 Auto-Save & Draft Management** - Never lose progress
- **📁 File Upload Support** - Handle documents and assets
- **🎨 Beautiful UI** - Glassmorphic design with SuccessNOW branding

## 📋 Prerequisites

- Node.js 18+ 
- Supabase account
- Anthropic API key (optional, for production AI features)

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/devnow-platform.git
cd devnow-platform
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)

2. Run the database schema:
   - Go to SQL Editor in Supabase
   - Copy the entire contents of `scripts/database-schema.sql`
   - Run the SQL script

3. Create Storage Bucket:
   - Go to Storage in Supabase
   - Create a new bucket called `project-files`
   - Set it to public access

4. Create Auth Users:
   - Go to Authentication > Users
   - Create these users with password `devnow2025`:
     - `info@successnow.ai` (Super Admin)
     - `johnpotvin@gmail.com` (Super Admin)
     - `johnpotvinmex@gmail.com` (Client)

### 4. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your keys:

```env
# Get these from Supabase project settings
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional: Add for production AI features
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### 5. Seed the Database

```bash
npm run seed
```

This will populate the AI agents for all 10 wizard steps.

### 6. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment to Vercel

### Option 1: Deploy with Vercel Button

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/devnow-platform)

### Option 2: Manual Deployment

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ANTHROPIC_API_KEY` (optional)
4. Deploy!

## 👥 Default Users

### Admin Access
- Email: `johnpotvin@gmail.com`
- Password: `devnow2025`
- Access: Full admin dashboard

### Client Access
- Email: `johnpotvinmex@gmail.com`
- Password: `devnow2025`
- Access: Client wizard only

## 🏗️ Project Structure

```
devnow-platform/
├── app/              # Next.js 14 app directory
│   ├── api/         # API routes
│   ├── admin/       # Admin dashboard
│   └── wizard/      # Client wizard
├── components/       # React components
├── lib/             # Utilities and configs
├── types/           # TypeScript types
├── scripts/         # Database scripts
└── public/          # Static assets
```

## 🔧 Development

### Add New Wizard Steps

1. Update `utils/constants.ts` with new step config
2. Update database schema if needed
3. Add new AI agent in `scripts/seed-database.js`

### Customize AI Agents

1. Go to Admin Dashboard > AI Agents
2. Edit agent prompts, personality, and settings
3. Test changes in the wizard

## 📝 License

MIT License - feel free to use this for your projects!

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

## 💬 Support

For support, email info@successnow.ai or open an issue.

---

Built with ❤️ by SuccessNOW DevNOW Division
