<!--
SYNC IMPACT REPORT:
Version: NEW → 1.0.0
Created constitution for React Restaurant CP Demo project
Modified principles: N/A (initial creation)
Added sections: All sections (initial creation)
Removed sections: N/A
Templates requiring updates:
  ✅ .specify/templates/plan-template.md - Constitution Check section referenced
  ✅ .specify/templates/spec-template.md - No updates needed
  ✅ .specify/templates/tasks-template.md - Aligns with TDD principle
Follow-up TODOs: None
-->

# React Restaurant CP Demo Constitution

## Core Principles

### I. Component-First Development
Every feature starts as a React Server Component (RSC) when possible; Client components only when interactivity is required; Each component must be self-contained with clear props interface; Prefer composition over inheritance; One component per file with descriptive naming.

**Rationale**: RSCs provide better performance and SEO. Clear component boundaries improve maintainability and reusability. Single responsibility makes testing and debugging easier.

### II. Type Safety
TypeScript strict mode MUST be enabled; All API responses validated with Zod schemas; Runtime type checking for external data; No `any` types except in migration scenarios with TODO comments; Props interfaces must be explicit and exported.

**Rationale**: Type safety prevents runtime errors and improves developer experience. Zod provides runtime validation that TypeScript cannot. Clear interfaces serve as living documentation.

### III. Test-Driven Development (NON-NEGOTIABLE)
TDD mandatory: Tests written → User approved → Tests fail → Then implement; Red-Green-Refactor cycle strictly enforced; Every feature requires unit and integration tests; Mock external dependencies in tests; Tests must run in CI/CD pipeline.

**Rationale**: TDD ensures code meets requirements and prevents regressions. Early test failures catch design issues. Mocking enables fast, reliable test execution.

### IV. API-First Design
Design API contracts before implementation; OpenAPI/JSON schema documentation required; Mock API responses during development; Consistent REST patterns for CRUD operations; Error responses follow standard format.

**Rationale**: API contracts enable parallel frontend/backend development. Documentation prevents integration issues. Consistent patterns reduce cognitive load.

### V. Performance & Accessibility
Next.js App Router for optimal performance; Images optimized with next/image; Lighthouse scores: Performance >90, Accessibility >95; Semantic HTML with proper ARIA labels; Keyboard navigation support required.

**Rationale**: Performance directly impacts user experience and SEO. Accessibility ensures inclusive design. Automated scoring provides objective quality gates.

## Development Standards

**Technology Stack**: Next.js 15.5.4, React 19.1.0, TypeScript 5, Tailwind CSS v4; **Testing Framework**: Jest with React Testing Library for unit tests, Playwright for E2E; **Code Quality**: ESLint with Next.js config, Prettier for formatting; **Build Pipeline**: npm run build must pass with zero errors and warnings.

**File Organization**: App Router structure (`app/` directory); Components in `components/` with index exports; Types in `types/` directory; Utilities in `lib/` directory; Tests co-located with components.

## Code Quality Gates

**Pre-commit Requirements**: ESLint passes with zero warnings; TypeScript compilation succeeds; All tests pass; Build completes successfully; Lighthouse accessibility score >95.

**Code Review Standards**: Two approvals required for main branch; Security review for authentication/authorization changes; Performance review for data fetching changes; Accessibility review for UI changes.

**Definition of Done**: Feature requirements met; Tests written and passing; Documentation updated; Code reviewed and approved; Deployed to staging environment; Manual testing completed.

## Governance

Constitution supersedes all other development practices; Amendments require team consensus and documentation; All pull requests must verify constitutional compliance; Complexity must be justified against simpler alternatives; Use CLAUDE.md for runtime development guidance and project-specific instructions.

**Compliance Review**: Weekly constitution adherence review in team meetings; Quarterly review of principles for relevance; Document any approved deviations with justification; Update constitution when patterns emerge that require new principles.

**Version**: 1.0.0 | **Ratified**: 2025-01-23 | **Last Amended**: 2025-01-23