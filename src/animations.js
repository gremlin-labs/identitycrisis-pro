/**
 * Animation utilities for IdentityCrisis Pro
 * Custom animations without external libraries
 */

// Track active modal animations to prevent conflicts
let activeModalAnimations = new Map();

// Spring physics constants
const SPRING_STIFFNESS = 0.4; // Increased stiffness for faster animations
const SPRING_DAMPING = 0.9; // Increased damping for less wobble
const SPRING_MASS = 8; // Reduced mass for faster movement

/**
 * Applies a staggered fade-in animation to multiple elements
 * @param {Array<HTMLElement>} elements - Array of DOM elements to animate
 * @param {Object} options - Animation options
 * @param {number} options.delay - Initial delay before animation starts (ms)
 * @param {number} options.stagger - Delay between each element's animation (ms)
 * @param {number} options.duration - Duration of each element's animation (ms)
 * @param {Function} options.onComplete - Callback when all animations complete
 */
export function staggeredFadeIn(elements, options = {}) {
  const {
    delay = 0,
    stagger = 100,
    duration = 500,
    onComplete = () => {}
  } = options;

  // Set initial state for all elements
  elements.forEach(el => {
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`;
  });

  // Animate each element with staggered delay
  elements.forEach((el, index) => {
    if (!el) return;

    const elementDelay = delay + (index * stagger);

    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';

      // Call onComplete after the last element finishes
      if (index === elements.length - 1) {
        setTimeout(onComplete, duration);
      }
    }, elementDelay);
  });
}

/**
 * Applies a jelly-like spring animation to an element
 * @param {HTMLElement} element - DOM element to animate
 * @param {Object} options - Animation options
 * @param {string} options.property - CSS property to animate ('scale', 'translateX', etc.)
 * @param {number} options.startValue - Starting value
 * @param {number} options.endValue - Target value
 * @param {number} options.duration - Animation duration in ms
 * @param {Function} options.onComplete - Callback when animation completes
 */
export function jellySpring(element, options = {}) {
  if (!element) return;

  const {
    property = 'scale',
    startValue = 0.8,
    endValue = 1,
    duration = 800,
    onComplete = () => {}
  } = options;

  // Physics variables
  let velocity = 0;
  let currentValue = startValue;
  let lastTime = null;
  let animationFrame;

  // Ensure element has transform-origin set properly for scale animations
  if (property === 'scale') {
    element.style.transformOrigin = 'center';
  }

  function updateAnimation(timestamp) {
    if (!lastTime) {
      lastTime = timestamp;
      animationFrame = requestAnimationFrame(updateAnimation);
      return;
    }

    const deltaTime = (timestamp - lastTime) / 1000; // Convert to seconds
    lastTime = timestamp;

    // Spring physics calculation
    const springForce = SPRING_STIFFNESS * (endValue - currentValue);
    const dampingForce = SPRING_DAMPING * velocity;
    const acceleration = (springForce - dampingForce) / SPRING_MASS;

    velocity += acceleration;
    currentValue += velocity;

    // Apply the new value to the element
    if (property === 'scale') {
      element.style.transform = `scale(${currentValue})`;
    } else if (property === 'translateX') {
      element.style.transform = `translateX(${currentValue}px)`;
    } else if (property === 'translateY') {
      element.style.transform = `translateY(${currentValue}px)`;
    } else if (property === 'rotate') {
      element.style.transform = `rotate(${currentValue}deg)`;
    }

    // Check if animation is complete (close enough to target and velocity is low)
    if (Math.abs(endValue - currentValue) < 0.001 && Math.abs(velocity) < 0.001) {
      // Set exact final value
      if (property === 'scale') {
        element.style.transform = `scale(${endValue})`;
      } else if (property === 'translateX') {
        element.style.transform = `translateX(${endValue}px)`;
      } else if (property === 'translateY') {
        element.style.transform = `translateY(${endValue}px)`;
      } else if (property === 'rotate') {
        element.style.transform = `rotate(${endValue}deg)`;
      }

      cancelAnimationFrame(animationFrame);
      onComplete();
      return;
    }

    // Continue animation
    animationFrame = requestAnimationFrame(updateAnimation);
  }

  // Start animation
  animationFrame = requestAnimationFrame(updateAnimation);

  // Return a function to cancel the animation if needed
  return () => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
  };
}

/**
 * Applies a jelly-like effect to sidebar content when opening/closing
 * @param {HTMLElement} sidebar - The sidebar element
 * @param {HTMLElement} content - The main content element
 * @param {boolean} isOpen - Whether the sidebar is open
 */
export function jellySidebar(sidebar, content, isOpen) {
  if (!sidebar || !content) return;

  // Get all direct children of the sidebar for staggered animation
  const sidebarChildren = Array.from(sidebar.children);

  if (isOpen) {
    // Opening animation
    sidebar.style.transform = 'translateX(0)';

    // Apply jelly effect to sidebar
    jellySpring(sidebar, {
      property: 'scale',
      startValue: 0.95,
      endValue: 1,
      duration: 600
    });

    // Staggered animation for sidebar children
    staggeredFadeIn(sidebarChildren, {
      delay: 100,
      stagger: 80,
      duration: 400
    });

    // Animate main content
    setTimeout(() => {
      content.style.transition = 'all 400ms cubic-bezier(0.34, 1.56, 0.64, 1)';
      content.style.marginLeft = '320px';
      content.style.width = 'calc(100% - 320px)';
      content.style.maxWidth = '800px';
      content.style.transform = 'translateX(0)';
    }, 50);
  } else {
    // Closing animation
    sidebar.style.transition = 'transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1)';
    sidebar.style.transform = 'translateX(-100%)';

    // Animate main content with jelly effect
    content.style.transition = 'all 400ms cubic-bezier(0.34, 1.56, 0.64, 1)';
    content.style.marginLeft = '0';
    content.style.width = '100%';
    content.style.maxWidth = '800px';
    content.style.transform = 'translateX(0)';

    // Apply subtle jelly effect to content
    setTimeout(() => {
      jellySpring(content, {
        property: 'translateX',
        startValue: -10,
        endValue: 0,
        duration: 600
      });
    }, 300);
  }
}

/**
 * Applies a page load animation to the entire application
 * @param {HTMLElement} container - The main container element
 */
export function jellyPageLoad(container) {
  // Alias for pageLoadAnimation for compatibility with our refactored components
  return pageLoadAnimation(container);
}

/**
 * Applies a page load animation to the entire application
 * @param {HTMLElement} container - The main container element
 */
export function pageLoadAnimation(container) {
  if (!container) return;

  // Get main sections to animate
  const header = container.querySelector('.header');
  const fieldGroups = Array.from(container.querySelectorAll('.field-group'));
  const actions = container.querySelector('.actions');

  // Hide everything initially
  [header, ...fieldGroups, actions].forEach(el => {
    if (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
    }
  });

  // Animate logo with jelly effect
  setTimeout(() => {
    const logo = header?.querySelector('.app-logo');
    if (logo) {
      logo.style.opacity = '1';
      jellySpring(logo, {
        property: 'scale',
        startValue: 0.5,
        endValue: 1,
        duration: 800
      });
    }

    // Staggered animation for header elements
    const headerElements = [
      header?.querySelector('.app-title-container'),
      header?.querySelector('.header-controls')
    ];

    staggeredFadeIn(headerElements, {
      delay: 200,
      stagger: 150,
      duration: 600
    });

    // Staggered animation for field groups
    staggeredFadeIn(fieldGroups, {
      delay: 400,
      stagger: 100,
      duration: 500
    });

    // Animate action buttons
    setTimeout(() => {
      if (actions) {
        actions.style.transition = 'opacity 600ms ease-out, transform 600ms ease-out';
        actions.style.opacity = '1';
        actions.style.transform = 'translateY(0)';
      }
    }, 400 + (fieldGroups.length * 100));
  }, 100);
}

/**
 * Applies a bounce animation to an element
 * @param {HTMLElement} element - DOM element to animate
 */
export function bounceElement(element) {
  if (!element) return;

  // Save original transform
  const originalTransform = element.style.transform || '';

  // Animation sequence
  element.style.transition = 'transform 120ms cubic-bezier(0.34, 1.56, 0.64, 1)';
  element.style.transform = `${originalTransform} scale(0.8)`;

  setTimeout(() => {
    element.style.transition = 'transform 240ms cubic-bezier(0.34, 1.56, 0.64, 1)';
    element.style.transform = `${originalTransform} scale(1.1)`;

    setTimeout(() => {
      element.style.transition = 'transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1)';
      element.style.transform = originalTransform;
    }, 240);
  }, 120);
}

/**
 * Applies a jelly animation to a modal when showing
 * @param {HTMLElement} modalBackdrop - The modal backdrop element
 * @param {HTMLElement} modalContent - The modal content element
 * @param {Function} onComplete - Callback when animation completes
 */
export function jellyModal(modalBackdrop, modalContent, onComplete = () => {}) {
  // Alias for jellyModalIn for compatibility with our refactored components
  return jellyModalIn(modalBackdrop, modalContent, onComplete);
}

/**
 * Applies a jelly animation to a modal when showing
 * @param {HTMLElement} modalBackdrop - The modal backdrop element
 * @param {HTMLElement} modalContent - The modal content element
 * @param {Function} onComplete - Callback when animation completes
 */
export function jellyModalIn(modalBackdrop, modalContent, onComplete = () => {}) {
  if (!modalBackdrop || !modalContent) return;

  // Cancel any existing animation for this modal
  if (activeModalAnimations.has(modalContent)) {
    cancelAnimationFrame(activeModalAnimations.get(modalContent));
  }

  // Prepare backdrop
  modalBackdrop.style.opacity = '0';
  modalBackdrop.style.display = 'flex';

  // Prepare modal content
  modalContent.style.transform = 'scale(0.9)';
  modalContent.style.opacity = '0';

  // Animate backdrop fade in - faster transition
  requestAnimationFrame(() => {
    modalBackdrop.style.transition = 'opacity 180ms ease-out';
    modalBackdrop.style.opacity = '1';

    // Start content animation immediately
    // Make content visible
    modalContent.style.opacity = '1';

    // Apply jelly spring animation with more subtle parameters
    const cancelAnimation = jellySpring(modalContent, {
      property: 'scale',
      startValue: 0.9,
      endValue: 1,
      duration: 500, // Faster animation
      onComplete
    });

    // Store the animation reference
    activeModalAnimations.set(modalContent, cancelAnimation);
  });
}

/**
 * Applies a jelly animation to a modal when hiding
 * @param {HTMLElement} modalBackdrop - The modal backdrop element
 * @param {HTMLElement} modalContent - The modal content element
 * @param {Function} onComplete - Callback when animation completes (e.g., to remove from DOM)
 */
export function jellyModalOut(modalBackdrop, modalContent, onComplete = () => {}) {
  if (!modalBackdrop || !modalContent) return;

  // Cancel any existing animation for this modal
  if (activeModalAnimations.has(modalContent)) {
    cancelAnimationFrame(activeModalAnimations.get(modalContent));
  }

  // Apply a more subtle wobble
  modalContent.style.transformOrigin = 'center';

  // Simplified animation - just fade out with a slight scale
  modalContent.style.transition = 'transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 180ms ease-out';
  modalContent.style.transform = 'scale(0.92)';
  modalContent.style.opacity = '0';

  // Fade out backdrop faster
  modalBackdrop.style.transition = 'opacity 180ms ease-out';
  modalBackdrop.style.opacity = '0';

  // Complete the animation faster
  setTimeout(() => {
    onComplete();
  }, 200);
}
