# 🧪 Testing Documentation

Dokumentasi lengkap untuk testing aplikasi Hackaton.

## 📋 Daftar Isi

- [Overview](#overview)
- [Test Structure](#test-structure)
- [Running Tests](#running-tests)
- [Test Coverage](#test-coverage)
- [Writing Tests](#writing-tests)
- [Best Practices](#best-practices)

---

## Overview

Aplikasi menggunakan **Japa** sebagai testing framework dengan dukungan untuk:

- **Unit Tests**: Testing individual services dan functions
- **Integration Tests**: Testing API endpoints dan database interactions
- **Functional Tests**: End-to-end testing

---

## Test Structure

```
tests/
├── unit/                    # Unit tests
│   ├── services/           # Service layer tests
│   └── validators/         # Validator tests
├── integration/            # Integration tests
│   ├── cash_book.spec.ts
│   ├── operasional.spec.ts
│   ├── rekap.spec.ts
│   └── hpp.spec.ts
└── functional/             # Functional/E2E tests
    ├── auth/
    ├── products/
    └── roles/
```

---

## Running Tests

### Run All Tests

```bash
npm test
```

### Run Specific Test Suite

```bash
# Unit tests only
npm run test:unit

# Integration tests only
npm run test:functional

# Integration tests
npm run test:integration
```

### Run with Coverage

```bash
npm run test:coverage
```

Ini akan:

1. Menjalankan semua tests
2. Generate coverage report dalam format:
   - **Text**: Di terminal
   - **HTML**: `coverage/index.html`
   - **JSON**: `coverage/coverage-summary.json`

### View Coverage Report

```bash
# Open HTML report
open coverage/index.html
# atau
xdg-open coverage/index.html
```

---

## Test Coverage

### Coverage Configuration

File `.c8rc.json` mengatur coverage requirements:

```json
{
  "check-coverage": true,
  "lines": 70,
  "functions": 70,
  "branches": 70,
  "statements": 70
}
```

### Coverage Targets

- **Lines**: 70%
- **Functions**: 70%
- **Branches**: 70%
- **Statements**: 70%

### Excluded Files

Files berikut dikecualikan dari coverage:

- `node_modules/`
- `build/`
- `tests/`
- `migrations/`
- `config/`
- `start/`

---

## Writing Tests

### Unit Test Example

```typescript
import { test } from '@japa/runner'
import { AuthService } from '#services/auth_service'
import User from '#models/user'

test.group('Auth Service | Unit', (group) => {
  group.each.setup(async () => {
    await User.query().delete()
  })

  test('should register a new user', async ({ assert }) => {
    const authService = new AuthService()

    const user = await authService.register({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'Password123!',
    })

    assert.exists(user.id)
    assert.equal(user.email, 'test@example.com')
  })
})
```

### Integration Test Example

```typescript
import { test } from '@japa/runner'
import { assert } from '@japa/assert'
import User from '#models/user'

test.group('Cash Book | Integration', (group) => {
  group.each.setup(async () => {
    await CashBook.query().delete()
    await User.query().delete()
  })

  async function login(client: any, user: User) {
    const response = await client.post('/api/auth/login').json({
      email: user.email,
      password: 'password123',
    })
    const cookies = response.headers()['set-cookie']
    return cookies?.map((c: string) => c.split(';')[0]).join('; ') || ''
  }

  test('should create cash book entry', async ({ client }) => {
    const user = await User.create({
      email: 'user@example.com',
      password: 'password123',
      role: 'user',
    })

    const cookie = await login(client, user)

    const response = await client.post('/api/cash-books').header('cookie', cookie).json({
      type: 'masuk',
      amount: 100000,
      transactionDate: new Date().toISOString(),
    })

    response.assertStatus(201)
    response.assertBodyContains({
      message: 'Cash book entry created successfully',
    })
  })
})
```

---

## Best Practices

### 1. Test Isolation

Setiap test harus independen dan tidak bergantung pada test lain:

```typescript
group.each.setup(async () => {
  // Clean up before each test
  await User.query().delete()
  await Product.query().delete()
})
```

### 2. Use Descriptive Test Names

```typescript
// ✅ Good
test('should create product with valid data', async ({ assert }) => {})

// ❌ Bad
test('test create', async ({ assert }) => {})
```

### 3. Test Both Success and Failure Cases

```typescript
test('should create product with valid data', async ({ assert }) => {
  // Test success case
})

test('should reject product with invalid price', async ({ assert }) => {
  // Test failure case
})
```

### 4. Use Assertions Properly

```typescript
// Check existence
assert.exists(result)

// Check equality
assert.equal(result.value, expected)

// Check status codes
response.assertStatus(201)

// Check body content
response.assertBodyContains({ message: 'Success' })
```

### 5. Clean Up After Tests

```typescript
group.each.setup(async () => {
  // Setup: Clean database
  await User.query().delete()
})

group.each.teardown(async () => {
  // Teardown: Additional cleanup if needed
})
```

---

## Test Suites

### Unit Tests

Test individual components tanpa dependencies eksternal:

- Services
- Validators
- Utilities
- Helpers

### Integration Tests

Test interactions antara components:

- API endpoints
- Database operations
- Service integrations
- Controller actions

### Functional Tests

End-to-end testing:

- User flows
- Complete workflows
- Authentication flows
- Business logic flows

---

## Coverage Reports

Setelah menjalankan `npm run test:coverage`, Anda akan mendapatkan:

1. **Terminal Output**: Summary coverage di terminal
2. **HTML Report**: `coverage/index.html` - Visual report dengan line-by-line coverage
3. **JSON Summary**: `coverage/coverage-summary.json` - Machine-readable summary

### Reading Coverage Report

- **Green**: Covered lines
- **Red**: Uncovered lines
- **Yellow**: Partially covered branches

---

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: hackaton_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '22'

      - run: npm ci
      - run: npm run test:coverage

      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-summary.json
```

---

## Troubleshooting

### Tests Failing

1. **Check database connection**: Pastikan PostgreSQL running
2. **Check environment variables**: Pastikan `.env` untuk test sudah benar
3. **Clean database**: Hapus data test yang tersisa
4. **Check migrations**: Pastikan migrations sudah dijalankan

### Coverage Not Generating

1. **Check c8 installation**: `npm list c8`
2. **Check .c8rc.json**: Pastikan config file ada
3. **Check file paths**: Pastikan files yang di-test ada di `include` paths

---

## Resources

- [Japa Documentation](https://japa.dev)
- [AdonisJS Testing Guide](https://docs.adonisjs.com/guides/testing)
- [c8 Coverage Tool](https://github.com/bcoe/c8)

---

**Happy Testing! 🧪**
