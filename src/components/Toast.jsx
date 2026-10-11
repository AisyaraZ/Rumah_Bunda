import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Toast() {
  const { toast, closeToast } = useAuth();

  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div className="toast-container">
      <div className={`toast ${isSuccess ? 'toast-success' : 'toast-error'}`}>
        {isSuccess ? (
          <CheckCircle2 size={20} color="#16A34A" style={{ flexShrink: 0 }} />
        ) : (
          <AlertCircle size={20} color="#DC2626" style={{ flexShrink: 0 }} />
        )}
        <span style={{ flex: 1, color: 'var(--text-primary)', fontWeight: 500 }}>
          {toast.message}
        </span>
        <button
          onClick={closeToast}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
