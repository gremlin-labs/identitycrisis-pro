import { useEffect, useRef } from 'react';
import {
  staggeredFadeIn,
  jellySpring,
  jellySidebar,
  pageLoadAnimation,
  bounceElement,
  jellyModalIn,
  jellyModalOut
} from './animations';

/**
 * Custom hook for page load animations
 * @returns {Object} Animation refs and handlers
 */
export function useAnimations() {
  // Refs for animation targets
  const containerRef = useRef(null);
  const sidebarRef = useRef(null);
  const mainContentRef = useRef(null);
  const sidebarTabRef = useRef(null);

  // Track if initial page load animation has run
  const hasRunInitialAnimation = useRef(false);

  // Run page load animation once when component mounts
  useEffect(() => {
    if (containerRef.current && !hasRunInitialAnimation.current) {
      // Small delay to ensure DOM is fully rendered
      setTimeout(() => {
        pageLoadAnimation(containerRef.current);
        hasRunInitialAnimation.current = true;
      }, 100);
    }
  }, []);

  /**
   * Handle sidebar toggle with animations
   * @param {boolean} isOpen - Whether the sidebar should be open
   */
  const animateSidebar = (isOpen) => {
    if (sidebarRef.current && mainContentRef.current) {
      jellySidebar(sidebarRef.current, mainContentRef.current, isOpen);

      // Animate the sidebar tab when closing
      if (!isOpen && sidebarTabRef.current) {
        setTimeout(() => {
          bounceElement(sidebarTabRef.current);
        }, 400);
      }
    }
  };

  /**
   * Animate a button when clicked
   * @param {HTMLElement} element - The button element
   */
  const animateButton = (element) => {
    if (element) {
      bounceElement(element);
    }
  };

  /**
   * Animate a field when regenerated
   * @param {HTMLElement} element - The field element
   */
  const animateFieldRegeneration = (element) => {
    if (element) {
      jellySpring(element, {
        property: 'scale',
        startValue: 0.95,
        endValue: 1,
        duration: 600
      });
    }
  };

  /**
   * Animate a modal when showing
   * @param {HTMLElement} modalBackdrop - The modal backdrop element
   * @param {HTMLElement} modalContent - The modal content element
   * @param {Function} onComplete - Optional callback when animation completes
   */
  const animateModalIn = (modalBackdrop, modalContent, onComplete) => {
    if (modalBackdrop && modalContent) {
      jellyModalIn(modalBackdrop, modalContent, onComplete);
    }
  };

  /**
   * Animate a modal when hiding
   * @param {HTMLElement} modalBackdrop - The modal backdrop element
   * @param {HTMLElement} modalContent - The modal content element
   * @param {Function} onComplete - Optional callback when animation completes
   */
  const animateModalOut = (modalBackdrop, modalContent, onComplete) => {
    if (modalBackdrop && modalContent) {
      jellyModalOut(modalBackdrop, modalContent, onComplete);
    }
  };

  return {
    containerRef,
    sidebarRef,
    mainContentRef,
    sidebarTabRef,
    animateSidebar,
    animateButton,
    animateFieldRegeneration,
    animateModalIn,
    animateModalOut
  };
}
