import React, { useState } from 'react';
import { AccessibleModal } from './components/AccessibleModal';
import { AccessibleTabs, type TabItem } from './components/AccessibleTabs';
import { AccessibleDisclosure } from './components/AccessibleDisclosure';
import {
  Dialog as ShadcnDialog,
  DialogContent as ShadcnDialogContent,
  DialogDescription as ShadcnDialogDescription,
  DialogHeader as ShadcnDialogHeader,
  DialogTitle as ShadcnDialogTitle,
  DialogTrigger as ShadcnDialogTrigger,
} from '@/components/ui/dialog';
import {
  Tabs as ShadcnTabs,
  TabsContent as ShadcnTabsContent,
  TabsList as ShadcnTabsList,
  TabsTrigger as ShadcnTabsTrigger,
} from '@/components/ui/tabs';
import {
  ShieldCheck,
  Keyboard,
  Layers,
  Sparkles,
  CheckCircle2,
  Sliders,
  Maximize2,
  Terminal,
} from 'lucide-react';

export function PlaygroundApp(): React.ReactElement {
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalFormData, setModalFormData] = useState({ name: '', email: '', role: 'engineer' });
  const [submissionNotice, setSubmissionNotice] = useState<string | null>(null);

  // Focus Tracker for live accessibility testing
  const [activeElementTag, setActiveElementTag] = useState<string>('None (click or tab to inspect)');

  React.useEffect(() => {
    const updateActive = () => {
      const el = document.activeElement;
      if (el && el !== document.body) {
        const idStr = el.id ? `#${el.id}` : '';
        const roleStr = el.getAttribute('role') ? `[role="${el.getAttribute('role')}"]` : '';
        const tag = el.tagName.toLowerCase();
        setActiveElementTag(`${tag}${idStr}${roleStr}`);
      }
    };
    window.addEventListener('focusin', updateActive);
    return () => window.removeEventListener('focusin', updateActive);
  }, []);

  // Tabs definitions
  const customTabsData: TabItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      content: (
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-neutral-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" aria-hidden="true" />
            W3C WAI-ARIA Accessible Design Patterns
          </h3>
          <p className="text-sm text-neutral-300 leading-relaxed">
            This suite implements three core interactive components without third-party component abstractions.
            Each control adheres to the WAI-ARIA Authoring Practices Guide (APG), establishing explicit
            keyboard interaction models, programmatic state announcements, and strict focus containment.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-neutral-950/80 rounded-lg border border-neutral-800">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Pattern 1</span>
              <p className="text-xs text-neutral-300 font-medium mt-1">Modal Dialog</p>
              <p className="text-xs text-neutral-400 mt-0.5">Strict focus trap & escape dismissal</p>
            </div>
            <div className="p-3 bg-neutral-950/80 rounded-lg border border-neutral-800">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Pattern 2</span>
              <p className="text-xs text-neutral-300 font-medium mt-1">Tabbed Interface</p>
              <p className="text-xs text-neutral-400 mt-0.5">Roving tabindex & Arrow key navigation</p>
            </div>
            <div className="p-3 bg-neutral-950/80 rounded-lg border border-neutral-800">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Pattern 3</span>
              <p className="text-xs text-neutral-300 font-medium mt-1">Disclosure Widget</p>
              <p className="text-xs text-neutral-400 mt-0.5">Semantic button & aria-expanded state</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'features',
      label: 'Features',
      content: (
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-neutral-100 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" aria-hidden="true" />
            Accessibility Engineering Highlights
          </h3>
          <ul className="space-y-2 text-sm text-neutral-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" aria-hidden="true" />
              <span>
                <strong className="text-neutral-100">Robust Focus Trapping:</strong> Tab and Shift+Tab wrap circularly within the modal dialog, preventing focus leak into the background DOM.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" aria-hidden="true" />
              <span>
                <strong className="text-neutral-100">Automatic Focus Restoration:</strong> Upon closing the dialog, keyboard focus is deterministically restored to the trigger element.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" aria-hidden="true" />
              <span>
                <strong className="text-neutral-100">Roving Tabindex on Tabs:</strong> Only the active tab is tabbable (tabIndex=0); inactive tabs receive tabIndex=-1 and are traversed via Left/Right Arrow keys with loop-around.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" aria-hidden="true" />
              <span>
                <strong className="text-neutral-100">Zero 'any' Policy:</strong> Built with strict TypeScript typings, DOM element refs, and React event signatures.
              </span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 'details',
      label: 'Details',
      content: (
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-neutral-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" aria-hidden="true" />
            W3C WAI-ARIA Specifications Referenced
          </h3>
          <div className="text-sm text-neutral-300 space-y-2">
            <p>
              This implementation maps directly to the following official W3C specifications:
            </p>
            <div className="p-3 bg-neutral-950 font-mono text-xs text-neutral-300 rounded-lg border border-neutral-800 space-y-1">
              <div>• Dialog (Modal) Pattern: WAI-ARIA 1.2 §3.9 / APG Dialog (Modal)</div>
              <div>• Tabs Pattern: WAI-ARIA 1.2 §3.34 / APG Tabs (Automatic Activation)</div>
              <div>• Disclosure Pattern: WAI-ARIA 1.2 §3.10 / APG Disclosure (Show/Hide)</div>
              <div>• WCAG 2.2 AA Criteria: 2.1.1 (Keyboard), 2.1.2 (No Keyboard Trap), 2.4.3 (Focus Order), 2.4.7 (Focus Visible)</div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const handleModalSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmissionNotice(`Saved profile for "${modalFormData.name || 'Anonymous User'}" (${modalFormData.email || 'no-email'})`);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-10 px-4 sm:px-6 lg:px-8 selection:bg-amber-400 selection:text-neutral-950">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header Banner */}
        <header className="border-b border-neutral-800 pb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-md bg-amber-400/10 text-amber-400 border border-amber-400/20">
                  FE-05 Internship Assignment
                </span>
                <span className="text-xs text-neutral-400">Strict W3C WAI-ARIA & TypeScript</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-2">
                Accessible Component Fundamentals
              </h1>
              <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
                Manual from-scratch implementations of Modal Dialog, Tabs, and Disclosure widgets
                with strict keyboard navigation, focus trapping, and comparative evaluation against shadcn/ui.
              </p>
            </div>

            {/* Live Focus Inspector HUD */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-xs flex flex-col gap-1 min-w-[260px]">
              <span className="text-neutral-400 flex items-center gap-1.5 font-medium">
                <Terminal className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                Live Active Focus:
              </span>
              <code className="bg-neutral-950 text-emerald-400 px-2 py-1 rounded-sm font-mono border border-neutral-800 truncate">
                {activeElementTag}
              </code>
            </div>
          </div>
        </header>

        {/* Keyboard Quick Reference Table */}
        <section
          id="keyboard-reference-section"
          aria-labelledby="keyboard-reference-title"
          className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <Keyboard className="w-5 h-5 text-amber-400" aria-hidden="true" />
            <h2 id="keyboard-reference-title" className="text-base font-semibold text-neutral-100">
              Keyboard Navigation Controls & Verification Guide
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-neutral-300">
            <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800/80 space-y-1.5">
              <strong className="text-amber-400 font-semibold block text-sm">Modal Dialog</strong>
              <div className="flex items-center justify-between"><kbd className="bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-200">Tab</kbd><span>Cycle next focusable</span></div>
              <div className="flex items-center justify-between"><kbd className="bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-200">Shift + Tab</kbd><span>Cycle previous focusable</span></div>
              <div className="flex items-center justify-between"><kbd className="bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-200">Escape</kbd><span>Close & restore focus</span></div>
            </div>

            <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800/80 space-y-1.5">
              <strong className="text-amber-400 font-semibold block text-sm">Tabs (Roving Tabindex)</strong>
              <div className="flex items-center justify-between"><kbd className="bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-200">ArrowRight</kbd><span>Next tab (wraps to first)</span></div>
              <div className="flex items-center justify-between"><kbd className="bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-200">ArrowLeft</kbd><span>Previous tab (wraps to last)</span></div>
              <div className="flex items-center justify-between"><kbd className="bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-200">Home / End</kbd><span>Jump to first / last tab</span></div>
            </div>

            <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800/80 space-y-1.5">
              <strong className="text-amber-400 font-semibold block text-sm">Disclosure Widget</strong>
              <div className="flex items-center justify-between"><kbd className="bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-200">Enter / Space</kbd><span>Toggle expand / collapse</span></div>
              <div className="flex items-center justify-between"><kbd className="bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-200">Tab</kbd><span>Advance to panel content</span></div>
              <div className="flex items-center justify-between"><kbd className="bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-200">aria-expanded</kbd><span>Synchronized state</span></div>
            </div>
          </div>
        </section>

        {/* SECTION 1: Accessible Modal Dialog */}
        <section
          id="modal-section"
          aria-labelledby="modal-section-title"
          className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-6 space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-neutral-800/70 pb-3">
            <div>
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Section 1</span>
              <h2 id="modal-section-title" className="text-xl font-bold text-white">
                Modal Dialog Component (From Scratch)
              </h2>
            </div>
            <span className="text-xs text-neutral-400">role="dialog" • aria-modal="true" • focus trap</span>
          </div>

          <p className="text-sm text-neutral-300 leading-relaxed">
            Click the button below or focus it and press <kbd className="bg-neutral-800 px-1.5 py-0.5 rounded text-xs">Enter</kbd> or <kbd className="bg-neutral-800 px-1.5 py-0.5 rounded text-xs">Space</kbd>.
            Upon opening, focus transfers to the first interactive field inside the modal. Tabbing wraps circularly between the fields, the close button, and the action buttons without leaking into the page.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              id="open-accessible-modal-btn"
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-400 text-neutral-950 font-semibold text-sm hover:bg-amber-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
            >
              <Maximize2 className="w-4 h-4" aria-hidden="true" />
              Open Accessible Modal
            </button>

            {submissionNotice && (
              <span className="text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-md flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                {submissionNotice}
              </span>
            )}
          </div>

          {/* Manually Built Accessible Modal Instance */}
          <AccessibleModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Edit User Accessibility Profile"
            description="Manage your accessibility preferences and notification settings. Use Tab to navigate."
          >
            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="modal-name-input" className="block text-xs font-semibold text-neutral-200">
                  Full Name <span className="text-amber-400">*</span>
                </label>
                <input
                  id="modal-name-input"
                  type="text"
                  required
                  value={modalFormData.name}
                  onChange={(e) => setModalFormData({ ...modalFormData, name: e.target.value })}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-3 py-2 text-sm bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="modal-email-input" className="block text-xs font-semibold text-neutral-200">
                  Notification Email <span className="text-amber-400">*</span>
                </label>
                <input
                  id="modal-email-input"
                  type="email"
                  required
                  value={modalFormData.email}
                  onChange={(e) => setModalFormData({ ...modalFormData, email: e.target.value })}
                  placeholder="alex@example.com"
                  className="w-full px-3 py-2 text-sm bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="modal-role-select" className="block text-xs font-semibold text-neutral-200">
                  Primary Role
                </label>
                <select
                  id="modal-role-select"
                  value={modalFormData.role}
                  onChange={(e) => setModalFormData({ ...modalFormData, role: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  <option value="engineer">Frontend Engineer</option>
                  <option value="accessibility-specialist">Accessibility Auditor</option>
                  <option value="designer">UX/UI Designer</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  id="modal-contrast-checkbox"
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded-sm bg-neutral-950 border-neutral-700 text-amber-400 focus:ring-amber-400 focus:ring-offset-neutral-900"
                />
                <label htmlFor="modal-contrast-checkbox" className="text-xs text-neutral-300">
                  Enable enhanced focus indicator outlines (WCAG 2.4.7)
                </label>
              </div>

              {/* Action Buttons inside Dialog */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  id="modal-cancel-btn"
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="modal-save-btn"
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </AccessibleModal>
        </section>

        {/* SECTION 2: Accessible Tabs */}
        <section
          id="tabs-section"
          aria-labelledby="tabs-section-title"
          className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-6 space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-neutral-800/70 pb-3">
            <div>
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Section 2</span>
              <h2 id="tabs-section-title" className="text-xl font-bold text-white">
                Tabs Component (From Scratch)
              </h2>
            </div>
            <span className="text-xs text-neutral-400">role="tablist" • roving tabindex • Arrow key nav</span>
          </div>

          <p className="text-sm text-neutral-300 leading-relaxed">
            Test roving tabindex: Press <kbd className="bg-neutral-800 px-1.5 py-0.5 rounded text-xs">Tab</kbd> to focus the active tab.
            Press <kbd className="bg-neutral-800 px-1.5 py-0.5 rounded text-xs">ArrowRight</kbd> or <kbd className="bg-neutral-800 px-1.5 py-0.5 rounded text-xs">ArrowLeft</kbd> to navigate between tabs with circular wrap-around.
            Press <kbd className="bg-neutral-800 px-1.5 py-0.5 rounded text-xs">Home</kbd> or <kbd className="bg-neutral-800 px-1.5 py-0.5 rounded text-xs">End</kbd> to jump to the boundaries. Notice only the active tab is in the page tab sequence.
          </p>

          <AccessibleTabs
            tabs={customTabsData}
            defaultTabId="overview"
            ariaLabel="Project Architecture Tabs"
          />
        </section>

        {/* SECTION 3: Accessible Disclosure */}
        <section
          id="disclosure-section"
          aria-labelledby="disclosure-section-title"
          className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-6 space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-neutral-800/70 pb-3">
            <div>
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Section 3</span>
              <h2 id="disclosure-section-title" className="text-xl font-bold text-white">
                Disclosure Component (From Scratch)
              </h2>
            </div>
            <span className="text-xs text-neutral-400">native &lt;button&gt; • aria-expanded • aria-controls</span>
          </div>

          <p className="text-sm text-neutral-300 leading-relaxed">
            Using native HTML <code className="text-amber-400">&lt;button&gt;</code> elements ensures native space and enter keypress handling.
            Screen readers announce expansion state via <code className="text-amber-400">aria-expanded</code> and identify associated content via <code className="text-amber-400">aria-controls</code>.
          </p>

          <div className="space-y-3 pt-2">
            <AccessibleDisclosure
              id="disclosure-faq-1"
              title="Why must a native <button> be used instead of a <div> with an onClick handler?"
              defaultOpen={true}
            >
              <div className="space-y-2">
                <p>
                  A native <code className="text-neutral-100">&lt;button&gt;</code> provides built-in accessibility properties that a custom <code className="text-neutral-100">&lt;div&gt;</code> lacks:
                </p>
                <ul className="list-disc list-inside space-y-1 text-neutral-300 text-xs">
                  <li>Automatic keyboard activation on both <kbd className="bg-neutral-800 px-1 py-0.5 rounded">Enter</kbd> and <kbd className="bg-neutral-800 px-1 py-0.5 rounded">Space</kbd> keys.</li>
                  <li>Natural inclusion in the document tab order without requiring explicit <code className="text-neutral-100">tabIndex=0</code>.</li>
                  <li>Inherent semantic button role recognized by all screen readers and assistive tech without extra ARIA declarations.</li>
                  <li>Native disabled state support that prevents both focus and click execution without manual event interception.</li>
                </ul>
              </div>
            </AccessibleDisclosure>

            <AccessibleDisclosure
              id="disclosure-faq-2"
              title="How does roving tabindex differ from standard tab navigation?"
              defaultOpen={false}
            >
              <div className="space-y-2">
                <p>
                  In a standard tab sequence, pressing <kbd className="bg-neutral-800 px-1 py-0.5 rounded">Tab</kbd> visits every interactive element sequentially.
                  In composite widgets like <code className="text-neutral-100">tablist</code>, roving tabindex ensures that pressing <kbd className="bg-neutral-800 px-1 py-0.5 rounded">Tab</kbd> only stops at the composite widget once (at the active tab with <code className="text-amber-400">tabindex=0</code>).
                </p>
                <p className="text-xs text-neutral-400">
                  Navigating between tabs inside the composite is performed via directional keys (<kbd className="bg-neutral-800 px-1 py-0.5 rounded">ArrowLeft</kbd> / <kbd className="bg-neutral-800 px-1 py-0.5 rounded">ArrowRight</kbd>), which dynamically shifts <code className="text-neutral-100">tabindex=0</code> to the focused tab while resetting all others to <code className="text-neutral-100">tabindex=-1</code>.
                </p>
              </div>
            </AccessibleDisclosure>
          </div>
        </section>

        {/* SECTION 4: Comparative Demonstration with shadcn/ui */}
        <section
          id="shadcn-comparison-section"
          aria-labelledby="shadcn-comparison-title"
          className="bg-neutral-900/30 border border-neutral-800/80 rounded-xl p-6 space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-neutral-800/70 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" aria-hidden="true" />
              <h2 id="shadcn-comparison-title" className="text-xl font-bold text-white">
                shadcn/ui Primitives Demonstration & Side-by-Side Comparison
              </h2>
            </div>
            <span className="text-xs px-2.5 py-1 rounded bg-neutral-800 text-neutral-300 font-mono">
              @radix-ui/react-dialog & @radix-ui/react-tabs
            </span>
          </div>

          <p className="text-sm text-neutral-300 leading-relaxed">
            As required by Step 7 & 8, here are the generated shadcn/ui Dialog and Tabs components in action.
            Notice the architectural distinctions in composability (compound component pattern) and primitives abstraction.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* shadcn Dialog demo */}
            <div className="p-5 bg-neutral-900/60 rounded-xl border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-neutral-200">shadcn/ui Dialog</h3>
                <span className="text-xs text-neutral-400 font-mono">components/ui/dialog.tsx</span>
              </div>
              <p className="text-xs text-neutral-400">
                Radix Dialog primitive using Portal, FocusScope, DismissableLayer, and Presence transitions.
              </p>
              <div className="pt-2">
                <ShadcnDialog>
                  <ShadcnDialogTrigger asChild>
                    <button
                      id="open-shadcn-dialog-btn"
                      type="button"
                      className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-100 text-xs font-semibold border border-neutral-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 cursor-pointer"
                    >
                      Open shadcn Dialog
                    </button>
                  </ShadcnDialogTrigger>
                  <ShadcnDialogContent className="sm:max-w-md">
                    <ShadcnDialogHeader>
                      <ShadcnDialogTitle>shadcn/ui Radix Dialog</ShadcnDialogTitle>
                      <ShadcnDialogDescription>
                        This dialog is rendered through Radix UI primitives. It features automated portal mounting, focus trapping via FocusScope, and outside pointer click dismissal.
                      </ShadcnDialogDescription>
                    </ShadcnDialogHeader>
                    <div className="space-y-3 py-2 text-xs text-neutral-300">
                      <label htmlFor="shadcn-input-test" className="block font-medium">Sample Focusable Input</label>
                      <input
                        id="shadcn-input-test"
                        type="text"
                        placeholder="Test tab navigation here"
                        className="w-full px-3 py-2 text-sm bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                      />
                    </div>
                  </ShadcnDialogContent>
                </ShadcnDialog>
              </div>
            </div>

            {/* shadcn Tabs demo */}
            <div className="p-5 bg-neutral-900/60 rounded-xl border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-neutral-200">shadcn/ui Tabs</h3>
                <span className="text-xs text-neutral-400 font-mono">components/ui/tabs.tsx</span>
              </div>
              <p className="text-xs text-neutral-400">
                Radix Tabs primitive with compound component composition and automatic roving tabindex.
              </p>
              <div className="pt-2">
                <ShadcnTabs defaultValue="tab1" className="w-full">
                  <ShadcnTabsList className="w-full grid grid-cols-2">
                    <ShadcnTabsTrigger value="tab1">Architecture</ShadcnTabsTrigger>
                    <ShadcnTabsTrigger value="tab2">Implementation</ShadcnTabsTrigger>
                  </ShadcnTabsList>
                  <ShadcnTabsContent value="tab1" className="text-xs space-y-1">
                    <p className="font-medium text-neutral-200">Compound Architecture</p>
                    <p className="text-neutral-400">Separates container, list, trigger, and content into distinct composable subcomponents.</p>
                  </ShadcnTabsContent>
                  <ShadcnTabsContent value="tab2" className="text-xs space-y-1">
                    <p className="font-medium text-neutral-200">Internal Context Dispatch</p>
                    <p className="text-neutral-400">Coordinates active tab state across triggers and panels using internal React Context rather than direct props.</p>
                  </ShadcnTabsContent>
                </ShadcnTabs>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Notes */}
        <footer className="text-center text-xs text-neutral-500 border-t border-neutral-900 pt-6 pb-4">
          <p>FE-05 Accessible Component Fundamentals • Built with React 19, TypeScript, and WAI-ARIA APG Guidelines</p>
          <p className="mt-1">Full documentation and architectural comparisons are documented in <code className="text-neutral-400">NOTES.md</code></p>
        </footer>
      </div>
    </div>
  );
}
