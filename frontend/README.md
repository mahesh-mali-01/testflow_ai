# Test Flow AI - Frontend

A modern, AI-native testing platform frontend built with React, TypeScript, and Material-UI with a professional purple theme.

## 🚀 Features

### Dashboard

- **Overview Statistics**: Total suites, tests, success rate, and running tests
- **Recent Test Runs**: Quick view of latest test executions
- **Quick Actions**: Create suites, run tests, manage collections
- **Progress Tracking**: Visual progress indicators and success rates

### Test Suites Management

- **CRUD Operations**: Create, read, update, and delete test suites
- **Suite Overview**: Test counts, last run times, and status indicators
- **Modern Card Layout**: Responsive grid with hover effects and animations
- **Context Menus**: Edit and delete operations with confirmation dialogs

### Test Detail View

- **YAML Schema Rendering**: Beautiful display of test configuration
- **BDD Step Visualization**: Given/When/Then steps with color-coded indicators
- **Test Configuration**: App URL, browser settings, timeouts, and preconditions
- **Real-time Execution**: Run tests with live status updates
- **Edit Functionality**: Modify test parameters and settings

### Test Execution & Results

- **Execution History**: Complete log of all test runs
- **Detailed Logs**: Step-by-step execution details with timestamps
- **Screenshot Capture**: Visual evidence of test execution
- **Status Tracking**: Pass/fail indicators with detailed error reporting
- **Performance Metrics**: Execution time and success rates

## 🎨 Design System

### Purple Theme

- **Primary Colors**: Purple (#8B5CF6) with pink accents (#EC4899)
- **Dark Mode**: Professional dark background with glass morphism effects
- **Typography**: Inter font family for modern, clean readability
- **Animations**: Smooth transitions and micro-interactions

### UI Components

- **Material-UI**: Professional component library with custom theming
- **Framer Motion**: Smooth animations and transitions
- **Responsive Design**: Mobile-first approach with breakpoint optimization
- **Accessibility**: WCAG compliant with proper contrast ratios

## 🛠️ Tech Stack

- **React 18**: Latest React with hooks and concurrent features
- **TypeScript**: Full type safety and IntelliSense support
- **Material-UI v5**: Component library with custom theming
- **React Router**: Client-side routing and navigation
- **Framer Motion**: Animation library for smooth transitions
- **Vite**: Fast build tool and development server
- **Axios**: HTTP client for API integration (ready for backend)

## 📁 Project Structure

```
src/
├── components/
│   └── Layout.tsx              # Main layout with navigation
├── pages/
│   ├── Dashboard.tsx            # Dashboard overview
│   ├── TestSuites.tsx          # Test suites list
│   ├── TestSuiteDetail.tsx     # Individual suite details
│   ├── TestDetail.tsx           # Test configuration and YAML
│   ├── TestRuns.tsx            # Test execution history
│   └── TestRunDetail.tsx       # Detailed run results
├── types/
│   └── index.ts                # TypeScript interfaces
├── theme/
│   └── index.ts                # Material-UI theme configuration
├── App.tsx                     # Main app component
├── main.tsx                    # Application entry point
└── index.css                  # Global styles and animations
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## 🔌 API Integration Ready

The frontend is designed with TypeScript interfaces that match the backend schema:

- **TestSuite**: Suite management with CRUD operations
- **Test**: Individual test configuration and YAML schema
- **TestRun**: Execution results with detailed logs
- **DashboardStats**: Analytics and metrics

### Mock Data

Currently uses mock data for demonstration. Ready to integrate with:

- FastAPI backend endpoints
- MongoDB database
- Real-time test execution
- WebSocket connections for live updates

## 🎯 Key Features Implemented

### 1. **Modern Dashboard**

- Statistics cards with animated counters
- Recent test runs with status indicators
- Quick action buttons for common tasks
- Progress visualization

### 2. **Test Suite Management**

- Grid layout with hover effects
- Create/edit/delete operations
- Status indicators and test counts
- Responsive design for all screen sizes

### 3. **Test Detail & YAML Rendering**

- Beautiful YAML schema display
- BDD step visualization with color coding
- Test configuration panels
- Real-time execution simulation

### 4. **Test Execution History**

- Comprehensive run history
- Detailed execution logs
- Screenshot galleries
- Performance metrics
- Status filtering and search

### 5. **Professional UI/UX**

- Purple-themed design system
- Smooth animations and transitions
- Glass morphism effects
- Responsive navigation
- Accessibility features

## 🔮 Future Enhancements

- **Real-time Updates**: WebSocket integration for live test execution
- **Advanced Filtering**: Complex search and filter options
- **Export Features**: PDF reports and data export
- **User Management**: Authentication and user roles
- **Analytics Dashboard**: Advanced metrics and insights
- **API Integration**: Full backend connectivity
- **Test Scheduling**: Automated test execution
- **Collaboration**: Team features and sharing

## 📱 Responsive Design

The application is fully responsive and optimized for:

- **Desktop**: Full feature set with sidebar navigation
- **Tablet**: Adaptive layout with collapsible navigation
- **Mobile**: Touch-optimized interface with bottom navigation

## 🎨 Design Philosophy

- **AI-Native**: Purple theme with futuristic elements
- **Professional**: Clean, modern interface for enterprise use
- **Intuitive**: User-friendly navigation and interactions
- **Performant**: Optimized animations and smooth transitions
- **Accessible**: WCAG compliant with proper contrast and focus states

---

Built with ❤️ for the Test Flow AI platform. Ready for backend integration and production deployment.
