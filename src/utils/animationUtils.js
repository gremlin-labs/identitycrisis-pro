/**
 * Apply a jelly animation to an element
 * @param {HTMLElement} element - The element to animate
 * @param {Object} options - Animation options
 */
export const jellyAnimation = (element, options = {}) => {
  const defaults = {
    scale: 1.1,
    duration: 400,
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  };
  
  const settings = { ...defaults, ...options };
  
  element.style.transition = `transform ${settings.duration}ms ${settings.easing}`;
  element.style.transform = `scale(${settings.scale})`;
  
  setTimeout(() => {
    element.style.transform = 'scale(1)';
  }, 10);
};

/**
 * Apply a fade-in animation to an element
 * @param {HTMLElement} element - The element to animate
 * @param {Object} options - Animation options
 */
export const fadeIn = (element, options = {}) => {
  const defaults = {
    duration: 300,
    easing: 'ease',
  };
  
  const settings = { ...defaults, ...options };
  
  element.style.opacity = '0';
  element.style.transition = `opacity ${settings.duration}ms ${settings.easing}`;
  
  setTimeout(() => {
    element.style.opacity = '1';
  }, 10);
};

/**
 * Apply a fade-out animation to an element
 * @param {HTMLElement} element - The element to animate
 * @param {Object} options - Animation options
 * @param {Function} callback - Function to call when animation completes
 */
export const fadeOut = (element, options = {}, callback = null) => {
  const defaults = {
    duration: 300,
    easing: 'ease',
  };
  
  const settings = { ...defaults, ...options };
  
  element.style.opacity = '1';
  element.style.transition = `opacity ${settings.duration}ms ${settings.easing}`;
  
  setTimeout(() => {
    element.style.opacity = '0';
    
    if (callback) {
      setTimeout(callback, settings.duration);
    }
  }, 10);
};

/**
 * Apply a slide-in animation to an element
 * @param {HTMLElement} element - The element to animate
 * @param {string} direction - The direction to slide from ('up', 'down', 'left', 'right')
 * @param {Object} options - Animation options
 */
export const slideIn = (element, direction = 'up', options = {}) => {
  const defaults = {
    distance: '20px',
    duration: 400,
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  };
  
  const settings = { ...defaults, ...options };
  
  let transform;
  switch (direction) {
    case 'up':
      transform = `translateY(${settings.distance})`;
      break;
    case 'down':
      transform = `translateY(-${settings.distance})`;
      break;
    case 'left':
      transform = `translateX(${settings.distance})`;
      break;
    case 'right':
      transform = `translateX(-${settings.distance})`;
      break;
    default:
      transform = `translateY(${settings.distance})`;
  }
  
  element.style.opacity = '0';
  element.style.transform = transform;
  element.style.transition = `opacity ${settings.duration}ms ${settings.easing}, transform ${settings.duration}ms ${settings.easing}`;
  
  setTimeout(() => {
    element.style.opacity = '1';
    element.style.transform = 'translate(0, 0)';
  }, 10);
};

/**
 * Apply a pulse animation to an element
 * @param {HTMLElement} element - The element to animate
 * @param {Object} options - Animation options
 */
export const pulse = (element, options = {}) => {
  const defaults = {
    scale: 1.05,
    duration: 300,
    easing: 'ease',
  };
  
  const settings = { ...defaults, ...options };
  
  element.style.transition = `transform ${settings.duration / 2}ms ${settings.easing}`;
  element.style.transform = `scale(${settings.scale})`;
  
  setTimeout(() => {
    element.style.transform = 'scale(1)';
  }, settings.duration / 2);
};
