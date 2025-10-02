<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Stoneridge School Administrative Agent

An AI-powered administrative assistant for The Stoneridge School, built with React, TypeScript, and Google's Gemini AI.

View your app in AI Studio: https://ai.studio/apps/drive/1YNO8xiD0Ao_FG6-m7f_e0Twitq0mJ_4c

## 🌟 Features

- **School Operations Dashboard**: Manage admissions, fees, attendance, and transport
- **Student Management**: Comprehensive student record management with AI-powered search
- **Staff Management**: Track teachers, staff, parents, and contractors
- **AI Tools**: Email drafter, announcement creator, and activity planner
- **Reports Generator**: Create detailed reports and analytics
- **Data Import/Export**: Import data from JSON files and export backups
- **Task Management**: Track and manage administrative tasks
- **Communication Tools**: Create broadcasts and manage parent communications

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Gemini API Key** - Get one from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/DINGZTRADER/Stoneridge-Scholl.git
   cd Stoneridge-Scholl
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:3000`

5. **Build for production**
   ```bash
   npm run build
   ```
   
   Preview the production build:
   ```bash
   npm run preview
   ```

## 📖 Documentation

- **[User Manual](components/UserManual.tsx)**: In-app guide for using the application
- **[Deployment Guide](components/DeploymentGuide.tsx)**: In-app instructions for deploying to production
- **[Contributing Guide](CONTRIBUTING.md)**: Guidelines for contributing to the project
- **[Security Policy](SECURITY.md)**: Security best practices and reporting vulnerabilities

## 🏗️ Project Structure

```
/
├── components/           # React components
│   ├── SchoolOps/       # School operations components
│   ├── shared/          # Reusable shared components
│   └── icons/           # Icon components
├── services/            # API and data services
│   ├── dataService.ts   # Local storage data management
│   ├── geminiService.ts # Gemini AI integration
│   └── importWorker.ts  # Web worker for file imports
├── types.ts             # TypeScript type definitions
├── constants.ts         # Application constants
├── App.tsx              # Main application component
└── vite.config.ts       # Vite configuration
```

## 💾 Data Management

The application uses browser localStorage for data persistence. Key features:

- **Local Storage**: All data is stored client-side
- **Import/Export**: JSON-based import and export functionality
- **Data Backup**: Regular backup export recommended
- **Multi-format Support**: Handles both camelCase and snake_case field names

### Data Tables

- `stoneridge-students` - Student records
- `stoneridge-teachers` - Teacher information
- `stoneridge-staff` - Staff members
- `stoneridge-parents` - Parent/guardian contacts
- `stoneridge-contractors` - Contractor information
- `stoneridge-applications` - Admission applications
- `stoneridge-invoices` - Fee invoices
- `stoneridge-attendance` - Attendance records
- `stoneridge-routes` - Transport routes
- `stoneridge-broadcasts` - Communication broadcasts
- `stoneridge-tasks` - Task list

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite
- **AI Integration**: Google Gemini API
- **Charts**: Recharts
- **Styling**: Tailwind CSS
- **Data Storage**: Browser localStorage

## 🔒 Security

- API keys should never be committed to version control
- Use environment variables for configuration
- All data is stored client-side in browser localStorage
- See [SECURITY.md](SECURITY.md) for more details

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📝 License

This project is licensed for use by The Stoneridge School.

## 🐛 Issues and Support

If you encounter any issues or have questions:
1. Check the [User Manual](components/UserManual.tsx) in the app
2. Search [existing issues](https://github.com/DINGZTRADER/Stoneridge-Scholl/issues)
3. Create a new issue with detailed information

## 🙏 Acknowledgments

- Built with [Google Gemini AI](https://ai.google.dev/)
- UI components styled with [Tailwind CSS](https://tailwindcss.com/)
- Charts powered by [Recharts](https://recharts.org/)
