import React, { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { getFocusableElements, handleTabKeyTrap } from '../utils/focusUtils';
import { X } from 'lucide-react';

export interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  /** Optional element ref to focus when modal opens */
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  /** Whether clicking the backdrop overlay triggers onClose. Default: true */
  closeOnOverlayClick?: boolean;
  /** Custom accessible title ID if external */
  titleId?: string;
  /** Custom accessible description ID if external */
  descriptionId?: string;
  /** Custom container class */
  className?: string;
}

export function AccessibleModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  initialFocusRef,
  closeOnOverlayClick = true,
  titleId: customTitleId,
  descriptionId: customDescriptionId,
  className = '',
}: AccessibleModalProps): React.ReactElement | null {
  const generatedId = useId();
  const titleId = customTitleId || `accessible-modal-title-${generatedId}`;
  const descriptionId = description
    ? customDescriptionId || `accessible-modal-desc-${generatedId}`
    : undefined;

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef<boolean>(false);

  // Focus preservation and initial placement when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      // 1. Remember the element that triggered the modal
      previousActiveElement.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
      wasOpenRef.current = true;

      // 2. Prevent background scrolling
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      // 3. Move focus into dialog once mounted
      const focusTimer = requestAnimationFrame(() => {
        const dialogNode = dialogRef.current;
        if (!dialogNode) return;

        if (initialFocusRef && initialFocusRef.current) {
          initialFocusRef.current.focus();
        } else {
          const focusable = getFocusableElements(dialogNode);
          if (focusable.length > 0) {
            focusable[0].focus();
          } else {
            // Graceful fallback: focus the dialog itself
            dialogNode.focus();
          }
        }
      });

      return () => {
        cancelAnimationFrame(focusTimer);
        document.body.style.overflow = originalOverflow;
      };
    } else if (wasOpenRef.current) {
      wasOpenRef.current = false;
      // Restore focus to triggering element when closing
      if (
        previousActiveElement.current &&
        document.body.contains(previousActiveElement.current)
      ) {
        previousActiveElement.current.focus();
      }
    }
  }, [isOpen, initialFocusRef]);

  // Clean unmount safety net if component unmounts while isOpen is true
  useEffect(() => {
    return () => {
      if (
        wasOpenRef.current &&
        previousActiveElement.current &&
        document.body.contains(previousActiveElement.current)
      ) {
        previousActiveElement.current.focus();
      }
    };
  }, []);

  // Global keyboard listener for Escape and Tab trapping, plus global focus constraint
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key === 'Tab' && dialogRef.current) {
        handleTabKeyTrap(event, dialogRef.current);
      }
    }

    // Guard against focus escaping to outside elements via mouse/touch or browser shortcuts
    function handleFocusIn(event: FocusEvent): void {
      const dialogNode = dialogRef.current;
      if (!dialogNode) return;

      const target = event.target;
      if (target instanceof Node && !dialogNode.contains(target)) {
        const focusable = getFocusableElements(dialogNode);
        if (focusable.length > 0) {
          focusable[0].focus();
        } else {
          dialogNode.focus();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('focusin', handleFocusIn);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('focusin', handleFocusIn);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const modalContent = (
    <div
      id="accessible-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
      onClick={(e) => {
        if (closeOnOverlayClick && e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        id="accessible-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className={`relative w-full max-w-lg bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl p-6 text-neutral-100 outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70 animate-in fade-in-0 zoom-in-95 ${className}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex flex-col gap-1">
            <h2
              id={titleId}
              className="text-xl font-semibold tracking-tight text-neutral-50"
            >
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="text-sm text-neutral-400">
                {description}
              </p>
            )}
          </div>
          <button
            id="accessible-modal-close-btn"
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-1.5 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="text-sm text-neutral-300">{children}</div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
