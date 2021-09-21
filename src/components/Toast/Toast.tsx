import { useEffect } from "react";
import { ToastProps } from "../../contexts/ToastContext";
import { useToast } from "../../hooks/useToast";

import { FaInfoCircle } from 'react-icons/fa';

import './styles/toast.scss';

export function Toast({
    selfDestruct, 
    id, 
    message
  }:ToastProps){

  const { removeToast } = useToast();

  function handleSelfRemove(){
    removeToast(id);
  }
  useEffect(() => {
    if(selfDestruct){
      const timer = setTimeout(() => {
        removeToast(id);
      }, 3000);
      return () => {
        clearTimeout(timer);
      }
    } 
    
  }, [id, removeToast, selfDestruct])
  return (
    <div className="container" onClick={handleSelfRemove}>
      <div className="content">
        <FaInfoCircle size={32} color="white" />
        <p>{message}</p>
      </div>

      
    </div>
  );
}