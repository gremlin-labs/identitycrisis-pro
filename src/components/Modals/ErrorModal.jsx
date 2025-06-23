import React from 'react';
import { Warning, CheckCircle } from 'phosphor-react';
import BaseModal from './BaseModal';

function ErrorModal({ show, onClose, message, type = 'error', isRetryable = false, onRetry }) {
  const isSuccess = type === 'success';
  
  const modalFooter = isRetryable ? (
    <div className="flex gap-2">
      <button
        className="button button-secondary"
        onClick={onClose}
      >
        Cancel
      </button>
      <button
        className="button button-primary"
        onClick={onRetry}
      >
        Try Again
      </button>
    </div>
  ) : (
    <button
      className="button button-primary"
      onClick={onClose}
    >
      OK
    </button>
  );

  const iconComponent = isSuccess ? (
    <CheckCircle size={24} weight="bold" className="flex-shrink-0 text-success" />
  ) : (
    <Warning size={24} weight="bold" className="flex-shrink-0 text-error" />
  );

  const containerClasses = isSuccess
    ? "flex items-center gap-3 p-4 rounded-lg bg-success-light border border-success-border text-success-text"
    : "flex items-center gap-3 p-4 rounded-lg bg-error-light border border-error-border text-error-text";

  return (
    <BaseModal
      show={show}
      onClose={onClose}
      title={isSuccess ? "Success" : "Error"}
      id={isSuccess ? "success-modal" : "error-modal"}
      size="md"
      footer={modalFooter}
    >
      <div className={containerClasses}>
        {iconComponent}
        <div className="flex-1">
          <p className="whitespace-pre-wrap break-words">{message}</p>
        </div>
      </div>
    </BaseModal>
  );
}

export default ErrorModal;
