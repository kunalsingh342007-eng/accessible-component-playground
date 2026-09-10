import React, { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface AccessibleDisclosureProps {
  id?: string;
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  className?: string;
  panelClassName?: string;
}

export function AccessibleDisclosure({
  id: customId,
  title,
  children,
  defaultOpen = false,
  isOpen: controlledIsOpen,
  onToggle,
  className = '',
  panelClassName = '',
}: AccessibleDisclosureProps): React.ReactElement {
  const generatedId = useId();
  const baseId = customId || `accessible-disclosure-${generatedId}`;
  const buttonId = `${baseId}-trigger`;
  const panelId = `${baseId}-panel`;

  const [internalIsOpen, setInternalIsOpen] = useState<boolean>(defaultOpen);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const handleToggle = () => {
    const nextState = !isOpen;
    if (controlledIsOpen === undefined) {
      setInternalIsOpen(nextState);
    }
    onToggle?.(nextState);
  };

  return (
    <div
      id={baseId}
      className={`border border-neutral-800 rounded-xl overflow-hidden bg-neutral-900/50 transition-colors ${className}`}
    >
      {/* 
        Native HTML <button> satisfies WAI-ARIA disclosure requirements.
        Browser naturally handles Enter and Space activation via onClick.
      */}
      <button
        id={buttonId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={handleToggle}
        className="w-full flex items-center justify-between gap-4 p-4 text-left font-medium text-neutral-200 hover:text-white hover:bg-neutral-800/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-inset cursor-pointer select-none"
      >
        <span className="text-base font-medium">{title}</span>
        <ChevronDown
          className={`w-5 h-5 text-neutral-400 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-amber-400' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {/* 
        Disclosure content panel:
        Hidden when collapsed, exposed as a labeled region when open.
      */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!isOpen}
        className={`px-4 pb-4 pt-1 text-sm text-neutral-300 border-t border-neutral-800/60 ${
          isOpen ? 'block' : 'hidden'
        } ${panelClassName}`}
      >
        {children}
      </div>
    </div>
  );
}
