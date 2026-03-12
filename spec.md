# HungerVibes

## Current State
Four-panel food delivery app (Admin, Restaurant, Customer, Delivery) built with React + TypeScript on Motoko backend. All panels are functional but three bugs exist.

## Requested Changes (Diff)

### Add
- Approve / Verify and Suspend buttons for Delivery Agents in the Admin panel Users tab (using `verifyDeliveryAgent` and `suspendUser` backend APIs)
- Sign-out and Home buttons on the Delivery Agent "Verification Pending" screen
- Pending delivery agents badge/counter on Admin dashboard
- Refresh button on Admin restaurants and users tabs

### Modify
- **Admin panel — Users tab**: Show separate "Pending Delivery Agents" subsection at the top with Approve and Suspend buttons per agent; separate from verified agents
- **Admin panel — Dashboard**: Show a warning card if there are unverified (pending) delivery agents, same pattern as pending restaurants
- **DeliveryPage — Verification Pending screen**: Add Sign Out and Back to Home buttons so user is not stuck
- **App.tsx — auto-panel-select effect**: Add `identity` as a guard (`if (!profile || selectedPanel || !identity) return;`) to prevent the effect re-selecting a panel immediately after sign-out while identity is still transitioning to null

### Remove
- Nothing removed

## Implementation Plan
1. Fix `App.tsx`: add `identity` guard to the auto-panel-select useEffect and add `identity` to the dependency array.
2. Fix `DeliveryPage.tsx`: add Sign Out and Back to Home buttons to the Verification Pending screen.
3. Fix `AdminPage.tsx`:
   a. In the Users tab, split delivery agents into "Pending Approval" (unverified, not suspended) and "Active" sections.
   b. Add Approve (verifyDeliveryAgent) and Suspend (suspendUser) action buttons per agent.
   c. On the Dashboard, add a warning card for pending delivery agents.
   d. Add a Refresh button to both Restaurants and Users tabs.
4. Import `activateUser` usage if needed for unsuspend flow (the backend has `activateUser(userId)`).
