/**
 * Accessibility Utility: Focus Management
 * Conforms to W3C WAI-ARIA Authoring Practices for Dialog & Focus Trapping.
 */

import type React from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(', ');

/**
 * Checks if an HTML element is visible and effectively focusable in the DOM.
 */
export function isElementFocusable(element: HTMLElement): boolean {
  if (element.hasAttribute('disabled') || element.getAttribute('aria-hidden') === 'true') {
    return false;
  }

  // Check if hidden by CSS
  const style = window.getComputedStyle(element);
  if (style.display === 'none' || style.visibility === 'hidden') {
    return false;
  }

  // Check element geometry
  const hasDimensions = element.offsetWidth > 0 || element.offsetHeight > 0 || element.getClientRects().length > 0;
  return hasDimensions;
}

/**
 * Queries all focusable elements within a parent container.
 * Filters out hidden, disabled, or non-tabbable nodes.
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const elements = Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
  );
  return elements.filter(isElementFocusable);
}

/**
 * Traps Tab key navigation within a container.
 * Returns true if Tab key event was intercepted and handled.
 */
export function handleTabKeyTrap(
  event: React.KeyboardEvent<HTMLElement> | KeyboardEvent,
  container: HTMLElement
): boolean {
  if (event.key !== 'Tab') {
    return false;
  }

  const focusable = getFocusableElements(container);

  if (focusable.length === 0) {
    // If no focusable elements, prevent Tab from escaping into document background
    event.preventDefault();
    container.focus();
    return true;
  }

  const firstElement = focusable[0];
  const lastElement = focusable[focusable.length - 1];
  const currentActive = document.activeElement as HTMLElement | null;

  // If focus is not currently on one of the focusable children (e.g. on dialog container or blurred)
  if (!currentActive || !container.contains(currentActive) || !focusable.includes(currentActive)) {
    event.preventDefault();
    if (event.shiftKey) {
      lastElement.focus();
    } else {
      firstElement.focus();
    }
    return true;
  }

  if (event.shiftKey) {
    // Shift + Tab: wrapping from first to last
    if (currentActive === firstElement) {
      event.preventDefault();
      lastElement.focus();
      return true;
    }
  } else {
    // Tab: wrapping from last to first
    if (currentActive === lastElement) {
      event.preventDefault();
      firstElement.focus();
      return true;
    }
  }

  return false;
}
