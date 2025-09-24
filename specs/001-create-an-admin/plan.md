
# Implementation Plan: Admin Food Management

**Branch**: `001-create-an-admin` | **Date**: 2025-01-23 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/Users/coryhouse/Projects/react-restaurant-cp-demo/specs/001-create-an-admin/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
Create an admin interface at /admin for managing restaurant menu items. Administrators can add, edit, and delete food items with full form validation. Technical approach: Next.js App Router page with Tanstack Form for form management, Material UI components for interface, Zod schemas for validation, and Tailwind CSS for styling.

## Technical Context
**Language/Version**: TypeScript 5, React 19.1.0, Next.js 15.5.4
**Primary Dependencies**: @tanstack/react-form, @mui/material, zod, tailwindcss
**Storage**: JSON Server mock API at localhost:3001, files (db.json)
**Testing**: Jest with React Testing Library for unit tests, Playwright for E2E
**Target Platform**: Web browsers (desktop and mobile responsive)
**Project Type**: single - Next.js web application with App Router
**Performance Goals**: Lighthouse performance >90, accessibility >95, form validation <50ms
**Constraints**: Client-side form validation, responsive design, TypeScript strict mode
**Scale/Scope**: Single admin user, ~100 menu items max, 1 admin interface page

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Component-First Development
✅ **PASS**: Admin form will be implemented as React Server Components where possible, with client components only for interactive form elements. Each component will be self-contained with clear props interfaces.

### II. Type Safety
✅ **PASS**: TypeScript strict mode enabled, Zod schemas for form validation and API responses, explicit props interfaces. No `any` types planned.

### III. Test-Driven Development (NON-NEGOTIABLE)
✅ **PASS**: Will implement TDD cycle - write tests first, ensure they fail, then implement. Unit tests for components, integration tests for form workflows.

### IV. API-First Design
✅ **PASS**: API contracts will be defined first using existing /api/food endpoint patterns. OpenAPI schema documentation will be created for CRUD operations.

### V. Performance & Accessibility
✅ **PASS**: Next.js App Router for performance, semantic HTML, ARIA labels for form elements, keyboard navigation support. Material UI components provide accessibility baseline.

## Project Structure

### Documentation (this feature)
```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
# Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure]
```

**Structure Decision**: Next.js App Router structure - admin page at `app/admin/page.tsx`, components in project root `components/` directory, types in `types/` directory

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:
   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/bash/update-agent-context.sh claude`
     **IMPORTANT**: Execute it exactly as specified above. Do not add or remove any arguments.
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data-model.md, quickstart.md)
- Food API contracts → API route implementation and contract tests [P]
- FoodItem entity → Zod schema and TypeScript types [P]
- Admin page user story → component and integration tests
- Form validation → unit tests for validation logic
- CRUD operations → integration tests and UI implementation

**Ordering Strategy**:
- TDD order: Tests before implementation (contract tests → component tests → implementation)
- Dependency order: Types/schemas → API routes → UI components → integration
- Mark [P] for parallel execution when tasks affect different files
- Admin page component depends on form components and API routes

**Estimated Output**: 20-25 numbered, ordered tasks in tasks.md covering:
- Setup tasks: Dependencies and TypeScript configuration
- Contract tests: API endpoint testing (4 endpoints)
- Unit tests: Form validation and component logic
- Implementation: API routes, UI components, form management
- Integration tests: End-to-end admin workflows
- Polish: Accessibility testing, performance validation

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |


## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command) - research.md created
- [x] Phase 1: Design complete (/plan command) - data-model.md, contracts/, quickstart.md, CLAUDE.md updated
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS - All principles satisfied
- [x] Post-Design Constitution Check: PASS - Design aligns with constitutional requirements
- [x] All NEEDS CLARIFICATION resolved - No ambiguities remain in technical context
- [x] Complexity deviations documented - No violations requiring justification

---
*Based on Constitution v1.0.0 - See `.specify/memory/constitution.md`*
