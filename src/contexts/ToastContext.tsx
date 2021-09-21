import React, {createContext, ReactNode, useCallback, useState} from "react";
import { EnumType } from "typescript";
let id = 0;


export type ToastProps = {
  message: string;
  id: number;
  selfDestruct: boolean;
}
type ToastContextProps = {
  removeToast: (id: number) => void;
  createToast: (message: string, options?:OptionsProps) => void;
  toasts: ToastProps[];
}
type ToastContextProviderType = {
  children: ReactNode;
}
export const ToastContext = createContext({} as ToastContextProps);

type OptionsProps = {
  selfDestruct?: boolean
  priority?: EnumType | undefined;
}
const DefaultValues = {
  selfDestruct: true
};

export function ToastContextProvider({children}: ToastContextProviderType){
  const [toasts, setToasts] = useState<ToastProps[]>([]);
  const createToast = useCallback(
    (message: string, options?: OptionsProps) => {
      const { 
        selfDestruct = true
      } = options?options:DefaultValues;
      setToasts(toasts => 
        [
          ...toasts, 
          {
            message,
            id: id++,
            selfDestruct
          }
        ]
      );
  }, [setToasts]);
  const removeToast = useCallback(
    id => {
      setToasts(toasts => toasts.filter(t => t.id !== id));
    
  }, [setToasts]);


  return(
    <ToastContext.Provider value={{removeToast, createToast, toasts}}>
      {children}
    </ToastContext.Provider>
  );

}