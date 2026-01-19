# Project Workflow Documentation

## Project Overview
This is a NestJS-based offline task management system with synchronization capabilities. The system uses SQL Server as the database and includes features for task management and offline-first synchronization.

## Tech Stack
- **Backend**: NestJS (TypeScript)
- **Database**: SQL Server with Prisma ORM
- **Package Manager**: pnpm
- **Testing**: Jest
- **Code Quality**: ESLint, Prettier

## Development Workflow

### 1. Environment Setup
```bash
# Clone the repository
git clone <repository-url>
cd project-back-end

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Configure DATABASE_URL and other variables
```

### 2. Database Setup
```bash
# Generate Prisma client
pnpm prisma generate

# Run database migrations
pnpm prisma migrate dev

# View database in Prisma Studio (optional)
pnpm prisma studio
```

### 3. Development Server
```bash
# Start development server with hot reload
pnpm run start:dev

# Start in debug mode
pnpm run start:debug

# Start production build locally
pnpm run build && pnpm run start:prod
```

### 4. Code Quality & Formatting
```bash
# Run linting and auto-fix
pnpm run lint

# Format code with Prettier
pnpm run format
```

## Project Structure

```
src/
├── app.module.ts          # Root application module
├── app.controller.ts      # Root application controller
├── app.service.ts         # Root application service
├── main.ts               # Application entry point
├── tasks/                # Task management module
│   ├── dto/             # Data transfer objects
│   │   └── create-task-dto.ts
│   ├── tasks.controller.ts
│   ├── tasks.service.ts
│   └── tasks.module.ts
├── sync/                 # Synchronization module
│   ├── sync.controller.ts
│   └── sync.service.ts
└── prisma/              # Prisma database configuration
    ├── prisma.module.ts
    └── prisma.service.ts
```

## Database Schema

### Task Model
- **id**: Unique identifier (ULID)
- **title**: Task title (max 255 chars)
- **description**: Optional description (max 1000 chars)
- **completed**: Completion status
- **priority**: Priority level (low/medium/high)
- **version**: Version for sync conflict resolution
- **clientId**: Client identifier for sync
- **lastSyncAt**: Last synchronization timestamp
- **createdAt/updatedAt/deletedAt**: Timestamps

### SyncLog Model
- Tracks synchronization operations
- Records entity changes per client
- Maintains audit trail for sync operations

## API Endpoints

### Task Management
- `GET /tasks` - Retrieve all tasks
- `POST /tasks` - Create new task
- `GET /tasks/:id` - Get specific task
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task

### Synchronization
- `POST /sync/pull` - Pull updates from server
- `POST /sync/push` - Push local changes to server
- `GET /sync/status` - Get sync status

## Testing Workflow

### 1. Unit Tests
```bash
# Run all unit tests
pnpm run test

# Run tests in watch mode
pnpm run test:watch

# Run tests with coverage
pnpm run test:cov
```

### 2. End-to-End Tests
```bash
# Run e2e tests
pnpm run test:e2e
```

### 3. Test Structure
```
test/
├── app.e2e-spec.ts      # E2E test setup
└── jest-e2e.json       # E2E test configuration
```

## Build & Deployment Workflow

### 1. Build Process
```bash
# Build for production
pnpm run build

# Verify build output
ls -la dist/
```

### 2. Production Deployment
```bash
# Install production dependencies
pnpm install --prod

# Run production server
pnpm run start:prod
```

### 3. Environment Variables for Production
- `PORT`: Server port (default: 3000)
- `DATABASE_URL`: SQL Server connection string
- `NODE_ENV`: Set to 'production'

## Development Best Practices

### 1. Code Organization
- Follow NestJS module structure
- Use DTOs for request/response validation
- Implement proper error handling
- Use dependency injection

### 2. Database Operations
- Always use Prisma Client for database operations
- Implement proper transaction handling for complex operations
- Use database indexes for performance optimization

### 3. Synchronization Logic
- Implement conflict resolution strategies
- Handle offline scenarios gracefully
- Maintain data integrity across clients

### 4. API Design
- Use RESTful conventions
- Implement proper HTTP status codes
- Validate all input data
- Document API endpoints

## Git Workflow

### 1. Branch Strategy
- `main`: Production-ready code
- `develop`: Integration branch
- `feature/*`: Feature development
- `hotfix/*`: Critical fixes

### 2. Commit Convention
```
feat: add new feature
fix: bug fix
docs: documentation update
style: code formatting
refactor: code refactoring
test: add/update tests
chore: build process or auxiliary tool changes
```

### 3. Pull Request Process
1. Create feature branch from develop
2. Implement changes with tests
3. Ensure all tests pass
4. Submit pull request with description
5. Code review and merge

## Monitoring & Logging

### 1. Application Monitoring
- Monitor API response times
- Track error rates
- Monitor database performance
- Sync operation metrics

### 2. Logging Strategy
- Use structured logging
- Log sync operations
- Track client connectivity
- Monitor conflict resolution

## Troubleshooting

### 1. Common Issues
- **Database Connection**: Check DATABASE_URL configuration
- **Sync Conflicts**: Review version control logic
- **Performance**: Check database indexes and query optimization
- **Memory Leaks**: Monitor long-running processes

### 2. Debug Commands
```bash
# Check database connection
pnpm prisma db pull

# Reset database (development only)
pnpm prisma migrate reset

# Regenerate Prisma client
pnpm prisma generate
```

## Security Considerations

### 1. Data Protection
- Validate all input data
- Sanitize database queries
- Implement rate limiting
- Secure API endpoints

### 2. Sync Security
- Authenticate sync requests
- Validate client permissions
- Encrypt sensitive data
- Audit sync operations

## Performance Optimization

### 1. Database Optimization
- Use appropriate indexes
- Optimize query patterns
- Implement connection pooling
- Cache frequently accessed data

### 2. API Performance
- Implement pagination
- Use response compression
- Optimize JSON serialization
- Cache static responses

## Future Enhancements

### 1. Planned Features
- Real-time sync with WebSockets
- Advanced conflict resolution
- Client-side SDK
- Performance analytics dashboard

### 2. Scalability Improvements
- Database sharding
- Load balancing
- Caching layer
- Microservices architecture
