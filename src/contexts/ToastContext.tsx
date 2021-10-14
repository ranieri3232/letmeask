import {createContext, ReactNode, useCallback, useState} from "react";
import { ToastContainer } from "../components/Toast/ToastContainer";
let id = 0;

export enum T_TYPES {
  INFO = 'info',
  WARNING = 'warning',
  DANGER = 'danger',
  SUCCESS = 'success'
};

export type ToastProps = {
  message: string;
  id: number;
  selfDestruct: boolean;
  tType: T_TYPES;
}
type ToastContextProps = {
  removeToast: (id: number) => void;
  createToast: (message: string, options?:OptionsProps) => void;
  toasts: ToastProps[];
};
type ToastContextProviderType = {
  children: ReactNode;
};
export const ToastContext = createContext({} as ToastContextProps);

type OptionsProps = {
  selfDestruct?: boolean
  tType?: T_TYPES;
};
const DefaultValues = {
  selfDestruct: true,
  tType: T_TYPES.INFO,
};

export function ToastContextProvider({children}: ToastContextProviderType){
  const [toasts, setToasts] = useState<ToastProps[]>([]);
  const createToast = useCallback(
    (message: string, options?: OptionsProps) => {
      const { 
        selfDestruct = true,
        tType = T_TYPES.INFO
      } = options?options:DefaultValues;
      
      setToasts(toasts => [
        ...toasts,
        {
          id: id++,
          message,
          selfDestruct,
          tType
        } 
      ]);
  }, [setToasts]);
  const removeToast = useCallback(
    id => {
      setToasts(toasts => toasts.filter(t => t.id !== id));
  }, [setToasts]);


  return(
    <ToastContext.Provider value={{removeToast, createToast, toasts}}>
      <ToastContainer/>
      {children}
    </ToastContext.Provider>
  );

}