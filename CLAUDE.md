# CLAUDE.md

This document outlines the development standards, best practices, and tooling for this TypeScript project. It serves as a guide for maintaining code quality, consistency, and developer productivity.

## Project Overview

**Photo Picker** - A tool to help sort through photos and quickly compare similar images to decide which ones to keep and which to archive. This TypeScript project is built with modern tooling and best practices, emphasizing type safety, maintainability, and developer experience.

### Key Features (Planned)
- Compare multiple similar photos side-by-side
- Quick keyboard shortcuts for keep/archive decisions
- EXIF data extraction for sorting by date/location
- Similarity detection to group related photos
- Batch operations for efficient photo management

### Current Project Structure
```
photo-picker/
├── src/
│   ├── index.ts          # Application entry point
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
│       └── example.test.ts
├── .vscode/              # VS Code configuration
│   ├── extensions.json
│   └── settings.json
├── .eslintignore
├── .eslintrc.json        # ESLint configuration
├── .npmrc                # pnpm configuration
├── .prettierignore
├── .prettierrc           # Prettier configuration
├── ARCHITECTURE.md       # System architecture and design decisions
├── CLAUDE.md             # This file - project documentation
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── tsconfig.build.json   # TypeScript build configuration
└── vitest.config.ts      # Vitest testing configuration
```

### Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed system design, API specifications, and implementation roadmap.

## Development Setup

### Prerequisites

- **Node.js**: Version 22+ (using latest features)
- **Package Manager**: pnpm (faster, more efficient than npm)
- **Editor**: VS Code with TypeScript optimizations

### VS Code Configuration

Create these files in your `.vscode/` directory:

**`.vscode/extensions.json`**:

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "streetsidesoftware.code-spell-checker",
    "usernamehw.errorlens",
    "yoavbls.pretty-ts-errors"
  ]
}
```

**`.vscode/settings.json`**:

```json
{
  "typescript.preferences.useAliasesForRenames": false,
  "typescript.suggest.autoImports": true,
  "typescript.updateImportsOnFileMove.enabled": "always",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "explicit"
  },
  "files.associations": {
    "*.json": "jsonc"
  },
  "npm.packageManager": "pnpm",
  "typescript.preferences.includePackageJsonAutoImports": "on"
}
```

### Package Manager Configuration

**`.npmrc`**:

```ini
# Use pnpm for consistency
engine-strict=true
auto-install-peers=true
strict-peer-dependencies=false
shamefully-hoist=false

# Security
audit-level=moderate
fund=false

# Performance
prefer-frozen-lockfile=true
```

**`package.json` engines**:

```json
{
  "engines": {
    "node": ">=22.0.0",
    "pnpm": ">=8.0.0"
  },
  "packageManager": "pnpm@8.15.0"
}
```

### Installation & Setup

```bash
# Install dependencies
pnpm install

# Set up git hooks
pnpm prepare

# Verify setup
pnpm run type-check
pnpm run lint
pnpm run test
```

### TypeScript Configuration

- **Strict Mode**: Always enabled (`"strict": true`)
- **Target**: ES2023 (leveraging Node 22 features)
- **Module Resolution**: Node16 or Bundler
- **Import Paths**: Use absolute imports with path mapping

Key `tsconfig.json` for Node 22:

```json
{
  "compilerOptions": {
    "target": "ES2023",
    "lib": ["ES2023"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "verbatimModuleSyntax": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"],
      "@/types/*": ["src/types/*"],
      "@/utils/*": ["src/utils/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

### Code Style

**Formatting**: Prettier (see `.prettierrc`)

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

**Linting**: ESLint with TypeScript-specific rules

- Use `@typescript-eslint/recommended`
- Enable `@typescript-eslint/recommended-requiring-type-checking`
- No `any` types without explicit `eslint-disable`
- Prefer `const` assertions and `as const`

### Naming Conventions

- **Files**: kebab-case (`user-service.ts`)
- **Directories**: kebab-case (`user-management/`)
- **Variables/Functions**: camelCase (`getUserData`)
- **Classes**: PascalCase (`UserService`)
- **Constants**: SCREAMING_SNAKE_CASE (`MAX_RETRY_ATTEMPTS`)
- **Types/Interfaces**: PascalCase (`UserProfile`, `ApiResponse`)
- **Enums**: PascalCase with descriptive prefix (`UserRole`, `HttpStatus`)

## Architecture Principles

### Type Safety First

1. **Avoid `any`**: Use proper types or `unknown` with type guards
2. **Strict Null Checks**: Handle `undefined` and `null` explicitly
3. **Branded Types**: Use for IDs and domain-specific values

```typescript
type UserId = string & { readonly brand: unique symbol };
type EmailAddress = string & { readonly brand: unique symbol };
```

4. **Discriminated Unions**: For modeling complex state

```typescript
type LoadingState =
  | { status: 'loading' }
  | { status: 'success'; data: User[] }
  | { status: 'error'; error: string };
```

### Error Handling

- Use `Result<T, E>` pattern or similar for operations that can fail
- Never throw errors in pure functions
- Validate external data at boundaries
- Use type-safe error handling with discriminated unions

```typescript
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };
```

### Function Design

- **Pure Functions**: Prefer pure functions when possible
- **Single Responsibility**: One clear purpose per function
- **Immutability**: Use readonly types and avoid mutation
- **Composability**: Design functions to work well together

## Testing Strategy

### Testing Pyramid

1. **Unit Tests**: 70% - Test individual functions and classes
2. **Integration Tests**: 20% - Test component interactions
3. **E2E Tests**: 10% - Test complete user flows

### Testing Tools

- **Framework**: Vitest (recommended) or Jest
- **Assertions**: Built-in or chai
- **Mocking**: vi.mock() or jest.mock()
- **Coverage**: Aim for 80%+ coverage

### Test Structure

```typescript
// user-service.test.ts
describe('UserService', () => {
  describe('getUserById', () => {
    it('should return user when found', async () => {
      // Arrange
      const userId = 'user-123';
      const expectedUser = { id: userId, name: 'John' };

      // Act
      const result = await userService.getUserById(userId);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(expectedUser);
      }
    });
  });
});
```

## Development Workflow

### Git Workflow

- **Branch Naming**: `feature/ticket-description`, `fix/bug-description`
- **Commit Messages**: Use Conventional Commits
  ```
  feat: add user authentication
  fix: resolve memory leak in data processing
  docs: update API documentation
  ```

### Code Review Checklist

- [ ] TypeScript types are accurate and strict
- [ ] No `any` types without justification
- [ ] Error handling is implemented
- [ ] Tests are included and passing
- [ ] Code follows naming conventions
- [ ] Performance considerations addressed
- [ ] Security implications reviewed

## Build and Deployment

### Scripts

```json
{
  "scripts": {
    "dev": "tsx watch --clear-screen=false src/index.ts",
    "build": "tsc --project tsconfig.build.json",
    "start": "node dist/index.js",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:run": "vitest run",
    "lint": "eslint src/**/*.ts --cache",
    "lint:fix": "eslint src/**/*.ts --fix --cache",
    "format": "prettier --write src/**/*.{ts,json,md} --cache",
    "format:check": "prettier --check src/**/*.{ts,json,md}",
    "type-check": "tsc --noEmit",
    "type-check:watch": "tsc --noEmit --watch",
    "clean": "rimraf dist coverage .eslintcache",
    "prepare": "husky install",
    "audit": "pnpm audit --audit-level moderate",
    "deps:check": "pnpm outdated",
    "deps:update": "pnpm update --latest"
  }
}
```

### Pre-commit Hooks

**`.husky/pre-commit`**:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm lint-staged
```

**`lint-staged` configuration in `package.json`**:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix --cache", "prettier --write --cache"],
    "*.{json,md}": ["prettier --write --cache"],
    "package.json": ["pnpm audit --audit-level moderate"]
  }
}
```

## Dependencies Management

### Dependency Strategy

- **Production**: Keep minimal, audit regularly
- **Development**: Use latest stable versions
- **Updates**: Regular updates with proper testing
- **Security**: Run `pnpm audit` regularly

### Recommended Tools

**Development**:

- `tsx@4.x` - Fast TypeScript execution and watch mode
- `vitest@2.x` - Lightning fast testing framework
- `@vitest/ui@2.x` - Visual test runner interface
- `@vitest/coverage-v8@2.x` - Native V8 coverage
- `eslint@8.x` + `@typescript-eslint@8.x` - Linting with TypeScript support
- `eslint-config-prettier@10.x` - Disable ESLint rules that conflict with Prettier
- `prettier@3.x` - Code formatting with cache support
- `husky@8.x` + `lint-staged@15.x` - Git hooks
- `rimraf@5.x` - Cross-platform file deletion
- `@types/node@22.x` - Node.js 22 type definitions

**TypeScript**:

- `typescript@5.3+` - Latest stable TypeScript
- Path mapping with `@/*` aliases (`@/`, `@/types/`, `@/utils/`)
- Strict configuration optimized for Node 22
- ES2023 target with ESNext modules
- Bundler module resolution for modern tooling

## Performance Guidelines

### TypeScript Performance

- Use `skipLibCheck` in development
- Implement project references for large codebases
- Use incremental compilation (`"incremental": true`)
- Monitor build times and bundle size

### Runtime Performance

- Prefer static analysis over runtime checks
- Use tree-shaking friendly imports
- Lazy load heavy dependencies
- Profile and measure actual performance impact

## Documentation

### Code Documentation

- Use TSDoc comments for public APIs
- Include examples in complex function documentation
- Document type constraints and assumptions
- Maintain up-to-date README.md

### API Documentation

- Use OpenAPI/Swagger for REST APIs
- Include request/response examples
- Document error scenarios
- Version your APIs properly

## Security Considerations

### Input Validation

- Validate all external inputs
- Use schema validation libraries (Zod, Yup)
- Sanitize data before processing
- Use TypeScript's type system as first line of defense

### Dependencies

- Regular security audits (`pnpm audit`)
- Use `npm-check-updates` for dependency updates
- Pin versions in production
- Review dependency licenses

## Common Patterns

### Configuration Management

```typescript
// config.ts
const config = {
  port: Number(process.env.PORT) || 3000,
  database: {
    url: process.env.DATABASE_URL || '',
  },
} as const;

export default config;
```

### Error Boundary Pattern

```typescript
// error-boundary.ts
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}
```

### Service Layer Pattern

```typescript
// user-service.ts
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly logger: Logger
  ) {}

  async createUser(
    userData: CreateUserRequest
  ): Promise<Result<User, AppError>> {
    try {
      const user = await this.userRepository.create(userData);
      this.logger.info('User created', { userId: user.id });
      return { success: true, data: user };
    } catch (error) {
      this.logger.error('Failed to create user', { error });
      return {
        success: false,
        error: new AppError('User creation failed', 'USER_CREATION_ERROR'),
      };
    }
  }
}
```

## Resources

### Documentation

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [ESLint TypeScript Rules](https://typescript-eslint.io/rules/)
- [Prettier Configuration](https://prettier.io/docs/en/configuration.html)

### Useful Libraries

- **Validation**: Zod, Yup, io-ts
- **Utilities**: Lodash-es, Ramda
- **Testing**: Vitest, Testing Library
- **Logging**: Winston, Pino
- **HTTP**: Axios, ky

---

_This document should be updated as the project evolves and new best practices are adopted._
