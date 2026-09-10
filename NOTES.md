# FE-05 — Accessible Component Fundamentals

Track: Frontend AI Engineering  
Phase: Foundations / Build  
Author: Senior Frontend Engineer  

---

## Components Built

### Accessible Modal (`playground/components/AccessibleModal.tsx`)

The `AccessibleModal` component is implemented completely from scratch using pure React, TypeScript, and DOM APIs without third-party component libraries. It adheres to the W3C WAI-ARIA Authoring Practices Guide (APG) Dialog (Modal) pattern.

#### 1. Roles & Semantic Structure
- **`role="dialog"`**: Explicitly assigned to the modal container dialog element (`<div role="dialog">`). This announces to screen readers that the rendered element is an interactive dialog requiring user interaction before returning to the main page flow.
- **`tabIndex={-1}`**: Applied to the dialog container so that it can receive programmatic focus if the modal has no interactive descendant controls.

#### 2. ARIA Attributes
- **`aria-modal="true"`**: Informs assistive technologies that the rest of the application interface is background content and inert while the dialog is open.
- **`aria-labelledby={titleId}`**: Associates the modal with its unique header `<h2 id={titleId}>`. Accessible name calculation algorithm (AccName 1.1) uses this to announce the dialog purpose upon entry.
- **`aria-describedby={descriptionId}`**: If an optional description is provided, it is programmatically connected to the dialog element, ensuring assistive technologies read the descriptive instructions after the dialog title.

#### 3. Focus Trap Strategy
- Implemented in `playground/utils/focusUtils.ts` via `handleTabKeyTrap()`.
- Uses a comprehensive query selector for all tabbable and focusable elements:  
  `a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"]`.
- Elements are verified for visual and functional presence (`offsetWidth > 0`, `visibility !== 'hidden'`, absence of `aria-hidden="true"`).
- **Tab cycle trapping**:
  - When the user presses `Tab` on the last focusable element in the dialog, `event.preventDefault()` intercepts browser default behavior and redirects focus to `focusable[0]` (the first focusable element).
  - When the user presses `Shift + Tab` on the first focusable element, `event.preventDefault()` intercepts the event and redirects focus to `focusable[focusable.length - 1]` (the last focusable element).
- **Secondary containment boundary**: In addition to `keydown` interception, a global `focusin` listener checks if `document.activeElement` ever points outside the dialog node (e.g. from an external click or browser menu jump). If so, focus is immediately forced back inside the dialog.

#### 4. Escape Key Handling
- A document-level `keydown` listener intercepts `event.key === 'Escape'`.
- Calls `event.stopPropagation()` to prevent nested listener bubbling and triggers `onClose()`.

#### 5. Focus Restoration
- Upon mounting with `isOpen === true`, the component captures `document.activeElement` into `previousActiveElement.current`.
- Upon unmounting or transitioning to `isOpen === false`, the cleanup effect verifies that `previousActiveElement.current` is still attached to `document.body` and executes `previousActiveElement.current.focus()`.
- Background scroll lock is managed by setting `document.body.style.overflow = 'hidden'` while open and cleanly restoring original inline style values upon closing or component unmount.

---

### Accessible Tabs (`playground/components/AccessibleTabs.tsx`)

The `AccessibleTabs` component implements the WAI-ARIA APG Tabs Pattern with automatic activation, synchronized tab panels, and a strict roving `tabindex`.

#### 1. Roles & Hierarchy
- **`role="tablist"`**: Identifies the containing element as a group of tab triggers. Accompanied by `aria-orientation="horizontal" | "vertical"` and an accessible `aria-label` or `aria-labelledby`.
- **`role="tab"`**: Assigned to each native `<button>` representing a tab in the header.
- **`role="tabpanel"`**: Assigned to each tab content panel.

#### 2. Selected State & Synchronized Relationships
- **`aria-selected={isActive}`**: Dynamically set to `true` on the currently active tab button and `false` on inactive tab buttons.
- **`aria-controls={panelId}`**: Connects each tab button to the `id` of its corresponding `tabpanel`.
- **`aria-labelledby={tabId}`**: Placed on each tab panel, referencing the `id` of the tab that activates it.
- **`hidden={!isActive}`**: Hides inactive tab panels from both visual layout and assistive technology accessibility trees. Active panels receive `tabIndex={0}` so keyboard users can scroll or navigate into panel content.

#### 3. Roving Tabindex & Keyboard Navigation
- **Roving `tabIndex` pattern**:
  - The currently selected tab has `tabIndex={0}`.
  - All other inactive tabs receive `tabIndex={-1}`.
  - As a result, pressing <kbd>Tab</kbd> enters the tablist once at the active tab, and the next <kbd>Tab</kbd> press advances directly to the active `tabpanel` (or the next interactive element in the page), completely avoiding tab-stop fatigue across dozens of tabs.
- **Directional Navigation (`handleKeyDown`)**:
  - `ArrowRight` (or `ArrowDown` in vertical orientation): Moves focus and selection to the next enabled tab. If currently on the last tab, wraps around to index `0`.
  - `ArrowLeft` (or `ArrowUp` in vertical orientation): Moves focus and selection to the previous enabled tab. If currently on the first tab, wraps around to `length - 1`.
  - `Home`: Immediately focuses and selects the first enabled tab.
  - `End`: Immediately focuses and selects the last enabled tab.
  - `event.preventDefault()` is invoked on all handled navigation keys to prevent the browser window from scrolling horizontally or vertically.

---

### Accessible Disclosure (`playground/components/AccessibleDisclosure.tsx`)

The `AccessibleDisclosure` component implements the WAI-ARIA APG Disclosure (Show/Hide) pattern.

#### 1. Native `<button>` Usage
- Uses a genuine HTML `<button type="button">` element instead of an unsemantic `<div>` or `<span>`.
- This ensures full out-of-the-box keyboard operability without manual key event emulation:
  - Automatically receives keyboard focus in the natural tab sequence.
  - Browser automatically triggers `onClick` when the user presses <kbd>Enter</kbd> or <kbd>Space</kbd>.
  - Communicates the standard button role to screen readers without requiring manual ARIA overrides.

#### 2. ARIA States & Controls
- **`aria-expanded={isOpen}`**: Communicates whether the controlled disclosure content is currently displayed (`true`) or hidden (`false`). Assistive technologies announce changes in real time (e.g. "collapsed, button" vs "expanded, button").
- **`aria-controls={panelId}`**: Points to the unique `id` of the expandable container.
- **`role="region"` & `aria-labelledby={buttonId}`**: Applied to the expandable panel to create a perceivable landmark region labelled by the disclosure button title.

#### 3. Expand/Collapse & Focus Behavior
- When collapsed, the panel has `hidden={true}`, removing it from accessibility tree inspection and tab stops.
- When expanded, pressing <kbd>Tab</kbd> from the disclosure trigger moves directly into any interactive elements inside the revealed content, maintaining intuitive reading order.

---

## Comparison With shadcn/ui

Inspected files:
- `components/ui/dialog.tsx` (wrapping `@radix-ui/react-dialog`)
- `components/ui/tabs.tsx` (wrapping `@radix-ui/react-tabs`)

While our custom components strictly fulfill the WAI-ARIA specification and pass all keyboard testing, there are key architectural differences when compared with production-hardened primitives like Radix UI (the foundation of shadcn/ui).

### Concrete Gap 1: Primitive Composition & Focus Management Architecture (`FocusScope` vs Custom Query Trapping)

#### What We Implemented:
Our custom `AccessibleModal` determines focusable elements by scanning DOM nodes matching a query selector (`FOCUSABLE_SELECTOR`) and handles wrapping on keydown `Tab` events inside `handleTabKeyTrap()`.

#### What shadcn/Radix Implements:
Radix UI delegates focus management to a dedicated, battle-tested `@radix-ui/react-focus-scope` primitive:
1. **Virtual Focus Boundary Guards**: Radix creates invisible `<span tabIndex={0} aria-hidden="true">` boundary sentinels before and after the modal dialog. When focus hits these boundary elements, the focus engine instantly bounces focus to the opposite boundary edge before the browser's default paint cycle completes.
2. **Dynamic DOM Mutations & Microtask Trapping**: Our custom implementation calculates the focusable list during the `keydown` event. If dynamic content (such as conditional inputs, loading skeletons, or dropdowns) renders inside the dialog *while* open, our query re-runs only on subsequent key events. Radix tracks active focusable candidates using mutation observers and event listeners at the document capturing phase, guaranteeing that newly mounted portals or popovers remain strictly constrained.
3. **`DismissableLayer` Outside Interaction Control**: Radix wraps the dialog in a `DismissableLayer` that handles pointer-down events outside the dialog, touch event normalization on iOS Safari, and multi-layer dialog nesting (where closing a nested dialog does not accidentally close the parent dialog).

**Why it matters in production**: Our custom modal functions correctly for static forms. However, in enterprise applications with nested dropdowns, tooltips, or complex dynamic micro-frontends, Radix's sentinel and capturing architecture guarantees zero focus leaks even across shadow DOM boundaries and mobile Safari iframe quirks.

---

### Concrete Gap 2: Composability, State Decoupling & Compound Component Architecture

#### What We Implemented:
Our custom `AccessibleTabs` uses a monolithic component model where configuration is passed as an array of objects (`tabs: TabItem[]`). The component renders both the `<div role="tablist">` and all panels within its own JSX body.

#### What shadcn/Radix Implements:
shadcn/ui provides a flexible compound component pattern:
```tsx
<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">...</TabsContent>
  <TabsContent value="password">...</TabsContent>
</Tabs>
```
1. **Internal React Context Coordination**: The `Tabs` root provider holds state (`value`, `onValueChange`, `orientation`, `dir`) and coordinates any arbitrary child subtrees via React Context. Developers can place triggers inside toolbars, headers, cards, or custom grids without breaking the association between the trigger and the content panel.
2. **Automatic vs. Manual Activation**: Radix Tabs supports both automatic activation (selection follows focus immediately on arrow key) and manual activation (`activationMode="manual"`, where arrow keys move focus but the user must press <kbd>Enter</kbd> or <kbd>Space</kbd> to activate the panel). This is critical for tabs containing heavy or remote-loaded data.
3. **Presence & Unmount Modes**: Radix supports keeping inactive tab panels mounted in the DOM (`forceMount`) for SEO indexing or form state preservation, while toggling visual visibility and `data-state="inactive"`.

**Why it matters in production**: The monolithic array prop approach is simple and rigid, but does not allow consumers to reorder triggers, inject custom badge components into headers, or decouple trigger placement from panel placement. shadcn's compound architecture offers superior developer ergonomics and layout flexibility.

---

## Keyboard Testing Verification

Each of the following tests was executed and verified in the live running application:

### 1. Modal Dialog
| Key Interaction | Expected Behavior | Observed Result | Status |
| :--- | :--- | :--- | :--- |
| **Enter / Space** on "Open Accessible Modal" | Opens the modal and transfers focus to the first interactive field (`modal-name-input`). | Focus lands on the Full Name input immediately. | **PASS** |
| **Tab** navigation | Moves focus sequentially through: Name input → Email input → Role select → Contrast checkbox → Cancel button → Save button → Close (X) button. | Focus moves sequentially in DOM order without skipping elements. | **PASS** |
| **Tab** on last element (Close button) | Traps focus and wraps to the first focusable element (Name input). | Focus returns cleanly to Name input. | **PASS** |
| **Shift + Tab** on first element (Name input) | Traps focus and wraps backward to the last focusable element (Close button). | Focus wraps directly to Close button. | **PASS** |
| **Escape** key | Closes the modal dialog immediately. | Modal unmounts from DOM. | **PASS** |
| **Focus Restoration** | Upon closing (via Escape, Close button, or Cancel), focus returns to the button that triggered the modal. | Focus lands back on `#open-accessible-modal-btn`. | **PASS** |

### 2. Tabs (Roving Tabindex)
| Key Interaction | Expected Behavior | Observed Result | Status |
| :--- | :--- | :--- | :--- |
| **Tab** into tablist | Lands only on the active tab (e.g. "Overview", `tabIndex=0`). Inactive tabs are skipped. | Single tab-stop achieved. Focus lands on active tab. | **PASS** |
| **ArrowRight** | Moves focus and selection to the next tab ("Features"). Tab panel synchronizes. | "Features" becomes active, panel updates. | **PASS** |
| **ArrowRight** on last tab ("Details") | Wraps around circularly to the first tab ("Overview"). | Focus returns to "Overview". | **PASS** |
| **ArrowLeft** on first tab ("Overview") | Wraps backward circularly to the last tab ("Details"). | Focus jumps to "Details". | **PASS** |
| **Home** | Immediately selects and focuses the first tab ("Overview"). | Focus instantly moves to "Overview". | **PASS** |
| **End** | Immediately selects and focuses the last tab ("Details"). | Focus instantly moves to "Details". | **PASS** |
| **Tab** from active tab | Moves focus directly into the active `tabpanel` (`tabIndex={0}`) or its children. | Focus advances without cycling inactive tabs. | **PASS** |

### 3. Disclosure
| Key Interaction | Expected Behavior | Observed Result | Status |
| :--- | :--- | :--- | :--- |
| **Tab** onto disclosure trigger | Focuses the native `<button>` element with clear outline ring. | Focus visible indicator appears. | **PASS** |
| **Enter** key | Toggles the disclosure between expanded (`aria-expanded="true"`) and collapsed (`aria-expanded="false"`). | Content expands or collapses cleanly. | **PASS** |
| **Space** key | Toggles the disclosure without scrolling the browser viewport. | Native button triggers toggle without jump. | **PASS** |
| **Tab** while expanded | Advances focus directly into the newly visible content region. | Focus enters content area in logical order. | **PASS** |

---

## Lessons Learned: Why Accessibility Is More Than Adding ARIA Attributes

Throughout the implementation and testing of these components, several foundational lessons emerged:

1. **The First Rule of ARIA**: *"If you can use a native HTML element or attribute with the semantics and behavior you already require, then do so instead of re-purposing an element and adding an ARIA role, state or property to make it accessible."*
   - Using a native `<button>` for disclosures eliminates dozens of lines of error-prone synthetic keyboard and state handling code.
   
2. **ARIA Does Not Add Behavior**:
   - Declaring `role="dialog"` or `aria-modal="true"` does **not** trap focus, does **not** intercept the Escape key, and does **not** hide background scrolling. Those behaviors must be engineered explicitly using JavaScript and DOM focus APIs.
   - Declaring `role="tab"` does **not** handle arrow keys. Roving tabindex must be programmed with coordinate calculations and event cancellation.

3. **Focus Management is State Management**:
   - An accessible web component is fundamentally a state machine where focus is a first-class state variable. Losing track of where focus came from (focus restoration) or allowing focus to land on invisible elements creates broken experiences for keyboard-only and screen reader users.

4. **Visual and Motor Accessibility are Inseparable from Screen Reader Accessibility**:
   - Providing explicit `:focus-visible` rings with high-contrast outlines (WCAG 2.4.7) and adequate touch target sizes (minimum 44x44px) is just as essential as semantic attributes.
