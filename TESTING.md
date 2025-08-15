# Testing Framework Documentation

This project uses a comprehensive testing strategy with multiple layers of testing to ensure code quality, reliability, and performance.

## Testing Stack

- **Unit Testing**: Vitest + React Testing Library
- **E2E Testing**: Playwright
- **Visual Regression**: Playwright Screenshots
- **API Testing**: Vitest with mocked dependencies
- **Coverage**: c8 (built into Vitest)
- **CI/CD**: GitHub Actions

## Getting Started

### Install Dependencies

```bash
# Install all dependencies including testing tools
npm install

# Install Playwright browsers
npm run test:install
```

### Running Tests

```bash
# Unit tests
npm test                    # Interactive mode
npm run test:watch         # Watch mode
npm run test:run           # Run once
npm run test:coverage      # With coverage report
npm run test:ui            # Visual test UI

# E2E tests
npm run e2e                # Run all E2E tests
npm run e2e:headed        # Run with browser UI
npm run e2e:debug         # Debug mode
npm run e2e:ui             # Interactive UI mode
npm run e2e:report         # View last test report

# All tests
npm run test:all           # Unit + E2E
npm run test:ci            # CI pipeline tests
```

## Test Structure

### Unit Tests (`src/**/__tests__/`)

Unit tests are co-located with source files in `__tests__` directories:

```
src/
├── lib/
│   ├── api.ts
│   └── __tests__/
│       └── api.test.ts
├── hooks/
│   ├── use-api-queries.ts
│   └── __tests__/
│       └── use-api-queries.test.ts
└── components/
    ├── charts/
    │   ├── bar-chart.tsx
    │   └── __tests__/
    │       └── bar-chart.test.tsx
```

### E2E Tests (`e2e/`)

End-to-end tests cover complete user journeys:

```
e2e/
├── fixtures.ts           # Page Object Models & test utilities
├── home.spec.ts          # Home page functionality
├── projects.spec.ts      # Projects browsing & filtering
├── contact.spec.ts       # Contact form submission
├── visual.spec.ts        # Visual regression tests
├── global-setup.ts       # Global test setup
└── global-teardown.ts    # Global test cleanup
```

### Test Utilities (`src/test/`)

Shared testing utilities and factories:

```
src/test/
├── setup.ts              # Global test configuration
├── utils.tsx             # Custom render functions
└── factories.ts          # Mock data factories
```

## Test Categories

### 1. Unit Tests

**What we test:**
- Pure functions and utilities
- React hooks in isolation
- Component rendering and props
- Form validation schemas
- Chart data processing
- API client functions

**Example:**
```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/utils'
import { BarChart } from '../bar-chart'

describe('BarChart', () => {
  it('should render chart with data', () => {
    const mockData = [
      { name: 'Jan', value: 100 },
      { name: 'Feb', value: 200 }
    ]
    
    render(<BarChart data={mockData} dataKey="value" />)
    
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
  })
})
```

### 2. Integration Tests

**What we test:**
- API routes with request/response cycles
- Database operations (if applicable)
- Email service integration
- External service integrations

**Example:**
```typescript
import { describe, it, expect } from 'vitest'
import { POST } from '../route'

describe('/api/contact', () => {
  it('should process valid contact form', async () => {
    const mockRequest = {
      json: () => Promise.resolve({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Test message'
      })
    } as Request

    const response = await POST(mockRequest)
    expect(response.status).toBe(200)
  })
})
```

### 3. E2E Tests

**What we test:**
- Complete user workflows
- Cross-page navigation
- Form submissions
- Mobile responsiveness
- Accessibility compliance
- Performance metrics

**Example:**
```typescript
import { test, expect } from './fixtures'

test('should submit contact form successfully', async ({ contactPage }) => {
  await contactPage.goto()
  
  await contactPage.fillContactForm({
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Test',
    message: 'Test message'
  })
  
  await contactPage.submitForm()
  
  const successMessage = await contactPage.getSuccessMessage()
  await expect(successMessage).toBeVisible()
})
```

### 4. Visual Regression Tests

**What we test:**
- Component appearance consistency
- Layout responsiveness
- Theme variations
- Loading/error states

**Example:**
```typescript
test('should match home page screenshot', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  
  await expect(page).toHaveScreenshot('home-page.png', {
    fullPage: true,
    threshold: 0.2
  })
})
```

## Test Configuration

### Vitest Configuration (`vitest.config.ts`)

- **Environment**: jsdom for DOM simulation
- **Setup Files**: Global mocks and utilities
- **Coverage**: c8 provider with 80% thresholds
- **Path Aliases**: Same as main application

### Playwright Configuration (`playwright.config.ts`)

- **Browsers**: Chromium, Firefox, WebKit
- **Mobile Testing**: Pixel 5, iPhone 12
- **Reporters**: HTML, JSON, JUnit
- **Screenshots**: On failure only
- **Videos**: Retain on failure

## Mocking Strategy

### 1. External Dependencies

```typescript
// Mock Next.js components
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  )
}))

// Mock Recharts to avoid canvas issues
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => 
    <div data-testid="responsive-container">{children}</div>
}))
```

### 2. API Calls

```typescript
// Mock fetch globally
global.fetch = vi.fn()

// Mock specific responses
vi.mocked(global.fetch).mockResolvedValueOnce({
  ok: true,
  status: 200,
  json: () => Promise.resolve({ success: true })
} as Response)
```

### 3. React Query

```typescript
// Custom render with QueryClient
export const renderWithQueryClient = (ui: ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: 0 },
      mutations: { retry: false }
    }
  })

  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  )
}
```

## Coverage Requirements

### Minimum Coverage Thresholds

- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

### Excluded from Coverage

- Test files and utilities
- Next.js layout/loading/error files
- Configuration files
- Build scripts

### Coverage Reports

```bash
# Generate coverage report
npm run test:coverage

# View HTML report
open coverage/index.html
```

## CI/CD Integration

### GitHub Actions Workflows

1. **Test Suite** (`.github/workflows/test.yml`)
   - Unit & integration tests
   - E2E tests across browsers
   - Visual regression testing
   - Security scanning
   - Performance audits

2. **PR Quality Checks** (`.github/workflows/pr-checks.yml`)
   - Accessibility validation
   - Bundle size monitoring
   - Dependency auditing
   - Code quality checks

### Quality Gates

- ✅ All tests must pass
- ✅ Coverage thresholds must be met
- ✅ No ESLint errors
- ✅ TypeScript compilation success
- ✅ Bundle size within limits
- ✅ Accessibility score ≥ 90%
- ✅ Performance score ≥ 80%

## Best Practices

### Writing Tests

1. **Descriptive Names**: Test names should clearly describe what is being tested
2. **AAA Pattern**: Arrange, Act, Assert
3. **Single Responsibility**: One assertion per test when possible
4. **DRY Principles**: Use factories and utilities for common setup
5. **Isolation**: Tests should not depend on each other

### Mock Data

```typescript
// Use factories for consistent test data
const mockProject = createMockProject({
  title: 'Custom Project',
  revenue: 100000
})

// Avoid hardcoded values in tests
const mockFormData = createMockContactForm()
```

### Async Testing

```typescript
// Use waitFor for async operations
await waitFor(() => {
  expect(result.current.isSuccess).toBe(true)
})

// Use proper async/await in E2E tests
await page.waitForLoadState('networkidle')
await expect(element).toBeVisible()
```

### Error Testing

```typescript
// Test both success and error paths
it('should handle API errors', async () => {
  mockFetch.mockRejectedValueOnce(new Error('Network error'))
  
  await expect(apiCall()).rejects.toThrow('Network error')
})
```

## Debugging Tests

### Unit Tests

```bash
# Debug specific test
npm test -- --reporter=verbose api.test.ts

# Debug with UI
npm run test:ui
```

### E2E Tests

```bash
# Debug mode with browser
npm run e2e:debug

# Headed mode
npm run e2e:headed

# Trace viewer
npx playwright show-trace trace.zip
```

### Visual Tests

```bash
# Update screenshots
npx playwright test visual.spec.ts --update-snapshots

# Compare differences
npx playwright show-report
```

## Performance Testing

### Lighthouse Integration

```bash
# Run Lighthouse audit
npm run perf:lighthouse

# View report
open lighthouse-report.html
```

### Bundle Analysis

```bash
# Analyze bundle size
npm run build:analyze

# View bundle report
open .next/analyze/client.html
```

## Accessibility Testing

### Automated Testing

- **axe-core**: Integrated into E2E tests
- **Lighthouse**: Accessibility scoring
- **Manual Testing**: Screen reader compatibility

### Common Checks

- Proper heading hierarchy
- Alt text for images
- Form label associations
- Keyboard navigation
- Color contrast ratios
- Focus management

## Maintenance

### Regular Tasks

1. **Update Dependencies**: Monthly security updates
2. **Review Coverage**: Ensure new code is tested
3. **Clean Snapshots**: Remove outdated visual regression tests
4. **Performance Monitoring**: Track bundle size and Core Web Vitals

### Troubleshooting

**Flaky Tests:**
- Increase wait times for async operations
- Mock time-dependent functions
- Ensure proper cleanup between tests

**Memory Issues:**
- Clear mocks between tests
- Avoid memory leaks in components
- Use `cleanup()` in test teardown

**CI Failures:**
- Check environment differences
- Verify dependency versions
- Review test timeout settings

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)