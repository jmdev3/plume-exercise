[Plume exercise](https://github.com/plumenetwork/plume-fullstack-developer-exercise?tab=readme-ov-file)

[Live APP](https://plume-exercise.vercel.app/)

## Getting Started

Install and run the dev server:

```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project structure

```
plume-exercise/
 ├─ src/
 │   ├─ app/                 # Simple App Router
 │   │   ├─ layout.tsx
 │   │   ├─ page.tsx         # home page
 │   ├─ components/          # UI components
 │   ├─ hooks/               # custom hooks
 │   ├─ lib/                 # clients & helpers
 │   ├─ types/               # types
 |   └─ providers/           # custom providers
```

## Fundamentals

### CI/CD Workflow

- GitHub Actions workflow for automated linting and formatting
- Automated checks on pull requests and pushes
- Code quality enforcement before merge

### State Management & Caching

- **@tanstack/react-query** for server state management
- Background data fetching and caching
- Optimistic updates and automatic refetching
- Query invalidation and synchronization

### Code Quality & Standards

- **Prettier** for consistent code formatting
- **ESLint** for code quality and standards enforcement
- Automated formatting on commit and CI

### Git Workflow & Commits

- Conventional commit messages following [Conventional Commits](https://www.conventionalcommits.org/)
- Structured commit history for better changelog generation
- Clear commit types: feat, fix, docs, style, refactor, test, chore
- Merge strategies for cleaner commit history

### UI Components & Theming

- **Ant Design (antd)** component library
- Controlled component pattern for form management
- Custom theme configuration and styling
- Consistent design system across the application
