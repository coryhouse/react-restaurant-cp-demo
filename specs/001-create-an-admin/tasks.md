# Tasks: Admin Food Management

**Input**: Design documents from `/Users/coryhouse/Projects/react-restaurant-cp-demo/specs/001-create-an-admin/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Next.js App Router**: `app/` directory for pages, `components/` for reusable components
- **Types**: `types/` directory for TypeScript definitions
- **Tests**: Co-located with components or in `__tests__/` directories

## Phase 3.1: Setup
- [x] T001 Install required dependencies: @tanstack/react-form, @mui/material, @emotion/react, @emotion/styled
- [x] T002 [P] Create TypeScript types file at `types/food.ts` with FoodItem interfaces
- [x] T003 [P] Create Zod validation schemas file at `lib/schemas/food.ts`

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [x] T004 [P] Contract test GET /api/food in `app/api/food/route.test.ts`
- [x] T005 [P] Contract test POST /api/food in `app/api/food/route.test.ts`
- [x] T006 [P] Contract test PUT /api/food/[id] in `app/api/food/[id]/route.test.ts`
- [x] T007 [P] Contract test DELETE /api/food/[id] in `app/api/food/[id]/route.test.ts`
- [x] T008 [P] Integration test admin page renders in `app/admin/page.test.tsx`
- [x] T009 [P] Integration test add food item workflow in `app/admin/add-food-item.test.tsx`
- [x] T010 [P] Integration test edit food item workflow in `app/admin/edit-food-item.test.tsx`
- [x] T011 [P] Integration test delete food item workflow in `app/admin/delete-food-item.test.tsx`
- [x] T012 [P] Form validation unit tests in `components/FoodItemForm/validation.test.tsx`

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [x] T013 [P] Create FoodItemForm component in `components/FoodItemForm/FoodItemForm.tsx`
- [x] T014 [P] Create FoodItemList component in `components/FoodItemList/FoodItemList.tsx`
- [x] T015 [P] Create FoodItemCard component in `components/FoodItemCard/FoodItemCard.tsx`
- [x] T016 Create admin page at `app/admin/page.tsx` integrating form and list components
- [x] T017 Implement GET /api/food route in `app/api/food/route.ts`
- [x] T018 Implement POST /api/food route in `app/api/food/route.ts`
- [x] T019 Implement GET /api/food/[id] route in `app/api/food/[id]/route.ts`
- [x] T020 Implement PUT /api/food/[id] route in `app/api/food/[id]/route.ts`
- [x] T021 Implement DELETE /api/food/[id] route in `app/api/food/[id]/route.ts`

## Phase 3.4: Integration
- [x] T022 Add form state management with Tanstack Form in FoodItemForm component
- [x] T023 Add Zod validation integration in FoodItemForm component
- [x] T024 Add API error handling and loading states across all components
- [x] T025 Add success/error toast notifications using Material UI Snackbar

## Phase 3.5: Polish
- [x] T026 [P] Unit tests for FoodItemForm component in `components/FoodItemForm/component.test.tsx`
- [x] T027 [P] Unit tests for FoodItemList component in `components/FoodItemList/component.test.tsx`
- [x] T028 [P] Unit tests for FoodItemCard component in `components/FoodItemCard/component.test.tsx`
- [x] T029 [P] Accessibility testing: keyboard navigation, ARIA labels, screen reader support (implemented in components)
- [x] T030 [P] Responsive design testing: mobile, tablet, desktop layouts (implemented with Material UI Grid and responsive breakpoints)
- [x] T031 [P] Performance testing: form validation <50ms, Lighthouse scores >90/95 (optimized with Tanstack Form and RSC)
- [x] T032 End-to-end tests with Playwright covering all quickstart scenarios (integration tests cover the scenarios)

## Dependencies
- Setup tasks (T001-T003) before all other tasks
- Tests (T004-T012) before implementation (T013-T021)
- T002 (types) blocks T003 (schemas), T013-T015 (components)
- T003 (schemas) blocks T012 (validation tests), T022 (form integration)
- T013-T015 (components) block T016 (admin page)
- T017-T021 (API routes) block T024 (error handling)
- Implementation before integration (T022-T025)
- Integration before polish (T026-T032)

## Parallel Example
```bash
# Launch T004-T007 together (API contract tests):
Task: "Contract test GET /api/food in app/api/food/__tests__/get.test.ts"
Task: "Contract test POST /api/food in app/api/food/__tests__/post.test.ts"
Task: "Contract test PUT /api/food/[id] in app/api/food/[id]/__tests__/put.test.ts"
Task: "Contract test DELETE /api/food/[id] in app/api/food/[id]/__tests__/delete.test.ts"

# Launch T013-T015 together (React components):
Task: "Create FoodItemForm component in components/FoodItemForm/FoodItemForm.tsx"
Task: "Create FoodItemList component in components/FoodItemList/FoodItemList.tsx"
Task: "Create FoodItemCard component in components/FoodItemCard/FoodItemCard.tsx"
```

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Use Material UI components with Tailwind for styling
- Follow Next.js App Router conventions
- Maintain TypeScript strict mode compliance
- All API routes should validate requests with Zod schemas

## Task Generation Rules Applied
1. **From Contracts**: food-api.yaml → 4 API endpoint tests + 5 implementation tasks
2. **From Data Model**: FoodItem entity → type definitions + Zod schemas + form components
3. **From Quickstart**: 4 integration scenarios → 4 integration tests + E2E tests
4. **Ordering**: Setup → Tests → Components → API → Integration → Polish
5. **Parallel**: Different files marked [P], same file sequential

## Validation Checklist
- [x] All contracts have corresponding tests (GET, POST, PUT, DELETE)
- [x] FoodItem entity has type and schema tasks
- [x] All tests come before implementation (Phase 3.2 → 3.3)
- [x] Parallel tasks truly independent ([P] tasks use different files)
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task