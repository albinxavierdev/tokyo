# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/1af78445-1180-46aa-ad7b-27a1715aa914

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/1af78445-1180-46aa-ad7b-27a1715aa914) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (for backend and authentication)

## Setting up Supabase

This project uses Supabase for backend functionality. Follow these steps to set up your Supabase project:

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project and note down your project URL and anon key
3. Copy the `.env.example` file to `.env` in the root directory
4. Update the `.env` file with your Supabase URL and anon key:
   ```
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```
5. Set up your database tables in the Supabase dashboard:
   - Create a `projects` table with the following columns:
     - `id` (uuid, primary key)
     - `title` (text)
     - `description` (text)
     - `status` (text)
     - `priority` (text)
     - `tech_stack` (array)
     - `github_url` (text, nullable)
     - `deployment_url` (text, nullable)
     - `created_at` (timestamp with timezone)
     - `updated_at` (timestamp with timezone)
     - `user_id` (uuid, foreign key to auth.users)
   - Create a `tasks` table with the following columns:
     - `id` (uuid, primary key)
     - `title` (text)
     - `description` (text, nullable)
     - `completed` (boolean)
     - `due_date` (timestamp with timezone, nullable)
     - `created_at` (timestamp with timezone)
     - `project_id` (uuid, foreign key to projects.id)
   - Create a `profiles` table with the following columns:
     - `id` (uuid, primary key, references auth.users.id)
     - `email` (text)
     - `full_name` (text, nullable)
     - `avatar_url` (text, nullable)
     - `created_at` (timestamp with timezone)

6. Set up Row Level Security (RLS) policies for your tables to secure your data

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/1af78445-1180-46aa-ad7b-27a1715aa914) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes it is!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
