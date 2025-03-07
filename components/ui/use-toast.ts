// src/hooks/useToast.ts
import { useReducer, Dispatch } from 'react';

interface ToastState {
  toast?: string;
}

type ToastAction =
  | { type: 'SHOW_TOAST'; message: string; dismiss: () => void }
  | { type: 'DISMISS_TOAST'; toastId?: string };

const initialToastState: ToastState = {
  toast: undefined,
};

const toastReducer = (state: ToastState, action: ToastAction): ToastState => {
  switch (action.type) {
    case 'SHOW_TOAST':
      return { toast: action.message };
    case 'DISMISS_TOAST':
      return initialToastState;
    default:
      throw new Error('Unhandled action type');
  }
};

export const useToast = (): [string | undefined, Dispatch<ToastAction>] => {
  const [toastState, dispatch] = useReducer(toastReducer, initialToastState);
  return [toastState.toast, dispatch];
};
