import { useEffect } from "react";
import { ToastProps } from "../../contexts/ToastContext";
import { useToast } from "../../hooks/useToast";

export function Toast({
    selfDestruct, 
    id, 
    message
  }:ToastProps){

  const { removeToast } = useToast();

  useEffect(() => {
    if(selfDestruct){
      const timer = setTimeout(() => {
        removeToast(id);
      }, 3000);
      return () => {
        clearTimeout(timer);
      }
    } 
    
  }, [id, removeToast])
  return (
    <div>{message}</div>
  );
}