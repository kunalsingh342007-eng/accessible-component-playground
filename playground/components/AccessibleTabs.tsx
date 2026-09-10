import React, { useEffect, useId, useMemo, useRef, useState } from 'react';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface AccessibleTabsProps {
  tabs: TabItem[];
  defaultTabId?: string;
  activeTabId?: string;
  onTabChange?: (tabId: string) => void;
  orientation?: 'horizontal' | 'vertical';
  ariaLabel?: string;
  className?: string;
}

export function AccessibleTabs({
  tabs,
  defaultTabId,
  activeTabId: controlledActiveTabId,
  onTabChange,
  orientation = 'horizontal',
  ariaLabel = 'Interactive Tabs',
  className = '',
}: AccessibleTabsProps): React.ReactElement {
  const componentId = useId();

  // Determine initial tab (first non-disabled tab or default)
  const initialId = useMemo(() => {
    if (defaultTabId && tabs.some((t) => t.id === defaultTabId && !t.disabled)) {
      return defaultTabId;
    }
    const firstEnabled = tabs.find((t) => !t.disabled);
    return firstEnabled ? firstEnabled.id : tabs[0]?.id || '';
  }, [tabs, defaultTabId]);

  const [internalActiveTabId, setInternalActiveTabId] = useState<string>(initialId);

  const activeTabId = controlledActiveTabId !== undefined ? controlledActiveTabId : internalActiveTabId;

  // Refs array for keyboard focus management
  const tabButtonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const enabledTabs = useMemo(() => tabs.filter((tab) => !tab.disabled), [tabs]);

  const setTabRef = (id: string) => (node: HTMLButtonElement | null) => {
    if (node) {
      tabButtonRefs.current.set(id, node);
    } else {
      tabButtonRefs.current.delete(id);
    }
  };

  const selectTab = (id: string, shouldFocus = true) => {
    if (controlledActiveTabId === undefined) {
      setInternalActiveTabId(id);
    }
    onTabChange?.(id);

    if (shouldFocus) {
      const buttonNode = tabButtonRefs.current.get(id);
      buttonNode?.focus();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, currentTabId: string) => {
    if (enabledTabs.length === 0) return;

    const currentIndex = enabledTabs.findIndex((t) => t.id === currentTabId);
    if (currentIndex === -1) return;

    let targetIndex: number | null = null;

    const isHorizontal = orientation === 'horizontal';
    const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown';
    const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp';

    switch (event.key) {
      case nextKey:
        event.preventDefault();
        targetIndex = (currentIndex + 1) % enabledTabs.length;
        break;
      case prevKey:
        event.preventDefault();
        targetIndex = (currentIndex - 1 + enabledTabs.length) % enabledTabs.length;
        break;
      case 'Home':
        event.preventDefault();
        targetIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        targetIndex = enabledTabs.length - 1;
        break;
      default:
        break;
    }

    if (targetIndex !== null) {
      const targetTab = enabledTabs[targetIndex];
      selectTab(targetTab.id, true);
    }
  };

  // Synchronize internal state if tabs prop changes
  useEffect(() => {
    if (!tabs.some((t) => t.id === activeTabId && !t.disabled)) {
      const fallback = tabs.find((t) => !t.disabled)?.id || tabs[0]?.id || '';
      if (fallback && controlledActiveTabId === undefined) {
        setInternalActiveTabId(fallback);
      }
    }
  }, [tabs, activeTabId, controlledActiveTabId]);

  return (
    <div
      id={`accessible-tabs-${componentId}`}
      className={`w-full ${orientation === 'vertical' ? 'flex gap-6' : 'flex flex-col gap-4'} ${className}`}
    >
      {/* Tablist */}
      <div
        role="tablist"
        aria-label={ariaLabel}
        aria-orientation={orientation}
        id={`accessible-tablist-${componentId}`}
        className={`flex ${
          orientation === 'vertical'
            ? 'flex-col border-r border-neutral-800 pr-2 min-w-[180px] gap-1.5'
            : 'flex-row border-b border-neutral-800 gap-1 pb-1'
        }`}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          const tabId = `accessible-tab-${componentId}-${tab.id}`;
          const panelId = `accessible-panel-${componentId}-${tab.id}`;

          return (
            <button
              key={tab.id}
              ref={setTabRef(tab.id)}
              id={tabId}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={panelId}
              aria-disabled={tab.disabled ? true : undefined}
              tabIndex={isActive ? 0 : -1} // Roving tabindex
              disabled={tab.disabled}
              onClick={() => {
                if (!tab.disabled) {
                  selectTab(tab.id, false);
                }
              }}
              onKeyDown={(e) => handleKeyDown(e, tab.id)}
              className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all text-left outline-none select-none whitespace-nowrap focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:z-10 ${
                isActive
                  ? 'bg-neutral-800 text-amber-400 font-semibold shadow-xs'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
              } ${tab.disabled ? 'opacity-40 cursor-not-allowed hover:bg-transparent' : 'cursor-pointer'}`}
            >
              {tab.label}
              {isActive && orientation === 'horizontal' && (
                <span
                  className="absolute bottom-[-5px] left-2 right-2 h-[2px] bg-amber-400 rounded-full"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="flex-1">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          const tabId = `accessible-tab-${componentId}-${tab.id}`;
          const panelId = `accessible-panel-${componentId}-${tab.id}`;

          return (
            <div
              key={tab.id}
              id={panelId}
              role="tabpanel"
              aria-labelledby={tabId}
              tabIndex={0}
              hidden={!isActive}
              className={`rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70 transition-opacity duration-150 ${
                isActive ? 'block opacity-100' : 'hidden opacity-0'
              }`}
            >
              {tab.content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
