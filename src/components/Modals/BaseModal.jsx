import React, { useEffect, useRef } from 'react';
import { X } from 'phosphor-react';
import { jellyModal } from '../../animations';

/**
 * Base Modal Component with consistent styling
 *
 * @param {Object} props - Component props
 * @param {boolean} props.show - Whether the modal is visible
 * @param {Function} props.onClose - Function to call when modal is closed
 * @param {string} props.title - Modal title
 * @param {React.ReactNode} props.children - Modal content
 * @param {React.ReactNode} props.footer - Modal footer content
 * @param {React.ReactNode} props.headerContent - Additional content for the header (e.g., tabs)
 * @param {string} props.id - Modal ID for accessibility
 * @param {string} props.size - Modal size (sm, md, lg)
 * @param {boolean} props.closeOnBackdropClick - Whether to close modal when backdrop is clicked
 */
function BaseModal({
  show,
  onClose,
  title,
  children,
  footer,
  headerContent,
  id = 'modal',
  size = 'md',
  closeOnBackdropClick = true,
}) {
  const modalRef = useRef(null);
  const backdropRef = useRef(null);

  useEffect(() => {
    if (show && modalRef.current && backdropRef.current) {
      jellyModal(backdropRef.current, modalRef.current);
    }
  }, [show]);

  if (!show) return null;

  // Determine width based on size
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-3xl',
  }[size] || 'max-w-lg';

  const handleBackdropClick = (e) => {
    if (closeOnBackdropClick && e.target === backdropRef.current) {
      onClose();
    }
  };

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby={`${id}-title`}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className={`${sizeClasses} w-11/12 max-h-[90vh] rounded-lg border border-border flex flex-col`}
        style={{
          backgroundColor: 'var(--color-background-modal)',
          boxShadow: '3px 3px 0 var(--color-border)',
        }}
      >
        <header
          className="border-b border-border flex-shrink-0"
        >
          <div className="flex justify-between items-center p-6">
            <h2
              id={`${id}-title`}
              className="text-xl font-semibold"
              style={{ color: 'var(--color-text)' }}
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded transition-colors"
              style={{ color: 'var(--color-text)' }}
              aria-label="Close modal"
            >
              <X size={20} weight="bold" />
            </button>
          </div>
          {headerContent && (
            <div className="px-6 pb-4">
              {headerContent}
            </div>
          )}
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {children}
        </main>

        {footer && (
          <footer
            className="flex justify-end gap-3 p-6 border-t border-border flex-shrink-0"
          >
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}

export default BaseModal;
