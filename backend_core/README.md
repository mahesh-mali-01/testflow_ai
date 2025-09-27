# Test Flow AI - Backend Core

A Node.js backend API for the Test Flow AI platform, built with Express.js, TypeScript, and MongoDB.

## 🚀 Features

### Core Functionality

- **Test Suite Management**: CRUD operations for test suites
- **Test Management**: Create, update, delete, and execute tests
- **Test Execution**: Run tests with detailed logging and results
- **Test Run History**: Track and analyze test execution history
- **Dashboard Analytics**: Statistics and trends for test performance

### Technical Features

- **TypeScript**: Full type safety and IntelliSense support
- **MongoDB**: Document-based database with Mongoose ODM
- **RESTful API**: Clean, consistent API design
- **Validation**: Request validation with Joi schemas
- **Error Handling**: Comprehensive error handling and logging
- **Docker Support**: Containerized deployment with Docker Compose
- **Health Checks**: Built-in health monitoring

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Joi
- **Security**: Helmet, CORS
- **Logging**: Morgan
- **Containerization**: Docker & Docker Compose

## 📁 Project Structure

```
src/
├── controllers/          # API route handlers
│   ├── testSuiteController.ts
│   ├── testController.ts
│   ├── testRunController.ts
│   └── dashboardController.ts
├── models/             # MongoDB models
│   ├── TestSuite.ts
│   ├── Test.ts
│   └── TestRun.ts
├── routes/              # API routes
│   ├── testSuiteRoutes.ts
│   ├── testRoutes.ts
│   ├── testRunRoutes.ts
│   ├── dashboardRoutes.ts
│   └── index.ts
├── middleware/          # Custom middleware
│   ├── errorHandler.ts
│   ├── validation.ts
│   └── schemas.ts
├── utils/              # Utility functions
│   └── database.ts
├── types/              # TypeScript interfaces
│   └── index.ts
└── index.ts           # Application entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB 7.0+
- Docker & Docker Compose (optional)

### Local Development

1. **Clone and Install**

   ```bash
   cd backend_core
   npm install
   ```

2. **Environment Setup**

   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Start MongoDB**

   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:7.0

   # Or install MongoDB locally
   ```

4. **Run Development Server**

   ```bash
   npm run dev
   ```

5. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

### Docker Deployment

1. **Using Docker Compose (Recommended)**

   ```bash
   docker-compose up -d
   ```

2. **Using Docker**
   ```bash
   docker build -t testflow-backend_agents .
   docker run -p 3001:3001 testflow-backend_agents
   ```

## 📊 API Endpoints

### Test Suites

- `GET /api/v1/suites` - Get all test suites
- `GET /api/v1/suites/:id` - Get single test suite
- `POST /api/v1/suites` - Create test suite
- `PUT /api/v1/suites/:id` - Update test suite
- `DELETE /api/v1/suites/:id` - Delete test suite
- `GET /api/v1/suites/:id/tests` - Get tests in suite

### Tests

- `GET /api/v1/tests` - Get all tests
- `GET /api/v1/tests/:id` - Get single test
- `POST /api/v1/tests` - Create test
- `PUT /api/v1/tests/:id` - Update test
- `DELETE /api/v1/tests/:id` - Delete test
- `POST /api/v1/tests/:id/execute` - Execute test

### Test Runs

- `GET /api/v1/runs` - Get all test runs
- `GET /api/v1/runs/:id` - Get single test run
- `POST /api/v1/runs` - Create test run
- `PUT /api/v1/runs/:id` - Update test run
- `DELETE /api/v1/runs/:id` - Delete test run
- `GET /api/v1/runs/stats` - Get run statistics

### Dashboard

- `GET /api/v1/dashboard/stats` - Get dashboard statistics
- `GET /api/v1/dashboard/recent-runs` - Get recent test runs
- `GET /api/v1/dashboard/trends` - Get execution trends

### Health Check

- `GET /api/v1/health` - API health status

## 🔧 Configuration

### Environment Variables

| Variable      | Description               | Default                               |
| ------------- | ------------------------- | ------------------------------------- |
| `PORT`        | Server port               | 3001                                  |
| `NODE_ENV`    | Environment               | development                           |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/testflow_ai |
| `JWT_SECRET`  | JWT secret key            | (required)                            |
| `CORS_ORIGIN` | CORS allowed origin       | http://localhost:5173                 |
| `API_PREFIX`  | API prefix                | /api                                  |
| `API_VERSION` | API version               | v1                                    |

### Database Configuration

The application uses MongoDB with the following collections:

- **testsuites**: Test suite metadata
- **tests**: Individual test configurations
- **testruns**: Test execution results and logs

## 🐳 Docker Services

### Services Included

- **Backend**: Node.js API server
- **MongoDB**: Database server
- **Mongo Express**: Database admin UI (port 8081)

### Access Points

- **API**: http://localhost:3001
- **Mongo Express**: http://localhost:8081 (admin/admin123)
- **MongoDB**: localhost:27017

## 📈 Performance Features

- **Database Indexing**: Optimized queries with proper indexes
- **Pagination**: Efficient data pagination for large datasets
- **Caching**: Built-in response caching strategies
- **Validation**: Request validation to prevent invalid data
- **Error Handling**: Comprehensive error handling and logging

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing configuration
- **Input Validation**: Request validation with Joi schemas
- **Error Sanitization**: Safe error responses in production

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run tests with coverage
npm run test:coverage
```

## 📝 API Documentation

### Request/Response Format

All API responses follow this format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

### Pagination Format

```json
{
  "success": true,
  "data": {
    "data": [...],
    "total": 100,
    "page": 1,
    "limit": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## 🚀 Deployment

### Production Deployment

1. **Environment Setup**

   ```bash
   export NODE_ENV=production
   export MONGODB_URI=mongodb://your-mongo-host:27017/testflow_ai
   export JWT_SECRET=your-production-secret
   ```

2. **Build and Start**
   ```bash
   npm run build
   npm start
   ```

### Docker Production

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run clean` - Clean build directory

### Code Quality

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Husky for git hooks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

---

**Test Flow AI Backend** - Built with ❤️ for AI-native testing automation
