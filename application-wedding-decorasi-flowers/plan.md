# Implementation Plan: Wedding Decoration Flowers Mobile App (CBIR)

## Phase 1: Infrastructure
- [x] Create `src/api/client.ts`: Configure Axios with base URL and interceptors for Auth.
- [x] Create `src/context/AuthContext.tsx`: Manage authentication state (token, user, login/logout).
- [x] Update `src/constants/theme.ts`: Define Filament colors (Amber/Yellow primary, slate/gray scales).

## Phase 2: UI Components (Filament Style)
- [x] `src/components/ui/Button.tsx`: Primary (Amber), Secondary (Gray), Ghost.
- [x] `src/components/ui/Input.tsx`: Clean inputs with focus rings.
- [x] `src/components/ui/Card.tsx`: For catalogs and order lists.
- [x] `src/components/Header.tsx`: Global search header with Camera & File buttons.

## Phase 3: Authentication screens
- [x] `src/app/(auth)/login.tsx`: Login with Google support.
- [x] `src/app/(auth)/register.tsx`: Register with Google support.
- [x] `src/app/(auth)/forgot-password.tsx`, `otp-request-password.tsx`, `otp-reset-password.tsx`.
- [x] `src/app/(auth)/verify-otp.tsx`: OTP verification screen.

## Phase 4: Main Navigation (Tabs)
- [x] `src/app/(tabs)/_layout.tsx`: Configure Bottom Tabs with Filament icons.
- [x] `src/app/(tabs)/home.tsx`: Landing page fetching data from `/api/home`.
- [x] `src/app/(tabs)/orders.tsx`: Order history/status.
- [x] `src/app/(tabs)/cart.tsx`: Shopping cart management.
- [x] `src/app/(tabs)/chat.tsx`: Messaging interface.
- [x] `src/app/(tabs)/profile.tsx`: Profile dashboard.

## Phase 5: CBIR & Catalogs
- [x] `src/app/cbir/index.tsx`: Grid layout for mixed Package and Product catalogs.
- [x] Implement camera/gallery triggers in `Header.tsx` to upload to `/api/cbir/search`.
- [x] `src/app/profile/package-catalog.tsx`: Dedicated package catalog.
- [x] `src/app/profile/product-catalog.tsx`: Dedicated product catalog.

## Phase 6: Integration & Refinement
- [x] Connect all screens to backend API endpoints.
- [x] Ensure "No hardcoded data" constraint (fetch all from backend).
- [x] Final UI Polish to match Filament look.
