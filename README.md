# Employee 1st Day Checklist Application

A Next.js application with Supabase integration for managing employee first-day checklists. This application allows new employees to complete their onboarding checklist and provides an admin dashboard for HR and management to track and analyze submission data.

## Features

- **Employee Checklist Form**: Interactive form for new employees to complete their first-day checklist
- **Admin Dashboard**: Comprehensive dashboard with analytics and visualization of submission data
- **Submission Management**: View, filter, and export individual checklist submissions
- **Reporting**: Generate and schedule various reports based on submission data
- **Settings**: Configure application settings and manage users

## Tech Stack

- **Frontend**: Next.js with React and TypeScript
- **Styling**: Tailwind CSS for responsive design
- **Database**: Supabase (PostgreSQL)
- **Charts**: Chart.js for data visualization
- **Authentication**: Supabase Auth (planned implementation)

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Supabase account and project

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation

```bash
# Install dependencies
npm install
# or
yarn install

# Run the development server
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the employee checklist form.

Access the admin dashboard at [http://localhost:3000/admin](http://localhost:3000/admin).

## Database Setup

The application requires the following tables in your Supabase database:

- `checklist_submissions`: Stores all employee checklist submissions

## Deployment

This application can be deployed on Vercel or any other hosting platform that supports Next.js applications.

```bash
# Build for production
npm run build
# or
yarn build
```

## License

This project is licensed under the MIT License.
