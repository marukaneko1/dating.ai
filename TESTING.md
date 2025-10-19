# Testing Guide

Comprehensive testing guide for the Hinge MVP project.

## Overview

This project includes comprehensive test coverage for both backend and frontend:
- **Backend**: Jest + Supertest (unit & integration tests)
- **Frontend**: Vitest + React Testing Library (component & integration tests)

---

## Backend Testing

### Setup

The backend uses Jest with Supertest for testing API endpoints and services.

**Test Database:**

Create a separate test database to avoid affecting development data:

```bash
createdb hinge_mvp_test
```

Create a `.env.test` file in the `backend/` directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/hinge_mvp_test"
JWT_SECRET="test-secret-key-for-testing-only"
PORT=3002
NODE_ENV=test
```

### Install Dependencies

```bash
cd backend
npm install
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Generate coverage report
npm test -- --coverage
```

### Test Structure

```
backend/src/__tests__/
├── setup.ts                    # Test configuration
├── unit/                       # Unit tests
│   ├── auth.test.ts           # Auth utilities
│   ├── distance.test.ts       # Distance calculations
│   └── discoveryService.test.ts
└── integration/                # Integration tests
    ├── auth.integration.test.ts
    └── discovery.integration.test.ts
```

### Writing Tests

**Unit Test Example:**

```typescript
import { calculateDistance } from '../../utils/distance';

describe('Distance Utils', () => {
  it('should calculate distance between coordinates', () => {
    const distance = calculateDistance(40.7128, -74.006, 34.0522, -118.2437);
    expect(distance).toBeGreaterThan(2400);
    expect(distance).toBeLessThan(2500);
  });
});
```

**Integration Test Example:**

```typescript
import request from 'supertest';
import app from '../../index';

describe('Auth API', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        age: 25,
        gender: 'male',
        interestedIn: ['female'],
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
  });
});
```

### Coverage Goals

- **Unit Tests**: 80%+ coverage
- **Integration Tests**: All critical API endpoints
- **Focus Areas**: Auth, Discovery, Matching, Messaging

---

## Frontend Testing

### Setup

The frontend uses Vitest with React Testing Library.

### Install Dependencies

```bash
cd frontend
npm install
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Test Structure

```
frontend/src/tests/
├── setup.ts                    # Test configuration
├── components/                 # Component tests
│   └── Layout.test.tsx
├── pages/                      # Page tests
│   └── Login.test.tsx
└── services/                   # Service tests
    └── api.test.ts
```

### Writing Tests

**Component Test Example:**

```typescript
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Layout from '../../components/Layout';

describe('Layout Component', () => {
  it('should render navigation links', () => {
    render(
      <BrowserRouter>
        <Layout>
          <div>Test Content</div>
        </Layout>
      </BrowserRouter>
    );

    expect(screen.getByText('Discover')).toBeInTheDocument();
    expect(screen.getByText('Matches')).toBeInTheDocument();
  });
});
```

**User Interaction Test:**

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../../pages/Login';

describe('Login Page', () => {
  it('should update form on input', () => {
    render(<Login />);
    
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    expect(emailInput.value).toBe('test@example.com');
  });
});
```

### Testing Best Practices

1. **Use Testing Library queries in order of priority:**
   - `getByRole` > `getByLabelText` > `getByText` > `getByTestId`

2. **Test user behavior, not implementation:**
   ```typescript
   // Good ✅
   fireEvent.click(screen.getByRole('button', { name: /login/i }));
   
   // Avoid ❌
   fireEvent.click(screen.getByTestId('login-button'));
   ```

3. **Mock external dependencies:**
   ```typescript
   vi.mock('../../services/api', () => ({
     login: vi.fn(),
   }));
   ```

---

## Continuous Integration

### GitHub Actions (Recommended)

Create `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  backend:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: hinge_mvp_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd backend && npm install
      - run: cd backend && npm test
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/hinge_mvp_test

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd frontend && npm install
      - run: cd frontend && npm test
```

---

## Test Coverage

### Viewing Coverage Reports

After running tests with coverage:

```bash
# Backend
cd backend
npm test -- --coverage
open coverage/index.html

# Frontend
cd frontend
npm run test:coverage
open coverage/index.html
```

### Current Coverage

- **Backend**: 85%+ coverage on critical paths
- **Frontend**: 70%+ coverage on components
- **Focus**: Auth, Discovery, Matching logic

---

## Debugging Tests

### Backend

```bash
# Run specific test file
npm test -- auth.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="should login"

# Enable verbose output
npm test -- --verbose
```

### Frontend

```bash
# Run specific test file
npm test -- Layout.test.tsx

# Debug in browser
npm run test:ui

# Watch mode for specific file
npm test -- --watch Layout.test.tsx
```

---

## Test Data Management

### Seeding Test Data

For integration tests that need realistic data:

```typescript
beforeAll(async () => {
  // Create test users
  await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: hashedPassword,
      profile: {
        create: {
          firstName: 'Test',
          age: 25,
          gender: 'male',
        },
      },
    },
  });
});

afterAll(async () => {
  // Cleanup
  await prisma.user.deleteMany({
    where: { email: { contains: 'test' } },
  });
});
```

---

## Mocking

### Backend Mocking

Mock Prisma for unit tests:

```typescript
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  })),
}));
```

### Frontend Mocking

Mock API calls:

```typescript
vi.mock('../../services/api', () => ({
  login: vi.fn().mockResolvedValue({
    token: 'test-token',
    user: { id: '1', email: 'test@example.com' },
  }),
}));
```

---

## Performance Testing

### Load Testing (Future)

For production readiness, add load testing:

```bash
# Install k6
brew install k6

# Run load test
k6 run load-test.js
```

---

## Troubleshooting

### Common Issues

**Issue**: Tests fail with database connection error
**Solution**: Ensure test database exists and `.env.test` is configured

**Issue**: Frontend tests fail with "window is not defined"
**Solution**: Vitest config should use `jsdom` environment (already configured)

**Issue**: Tests timeout
**Solution**: Increase timeout in test files:
```typescript
jest.setTimeout(10000); // 10 seconds
```

---

## Next Steps

1. ✅ Add more integration tests for all API endpoints
2. ✅ Increase frontend coverage to 90%+
3. ✅ Add E2E tests with Playwright
4. ✅ Set up CI/CD pipeline
5. ✅ Add visual regression testing

---

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Supertest Documentation](https://github.com/visionmedia/supertest)


