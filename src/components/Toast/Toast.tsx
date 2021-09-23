import { useEffect } from "react";
import { ToastProps, T_TYPES } from "../../contexts/ToastContext";
import { useToast } from "../../hooks/useToast";

import { FaInfoCircle } from 'react-icons/fa';

import './styles/toast.scss';

export function Toast({
    selfDestruct, 
    id, 
    message,
    tType
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
    <div className={`container ${tType === T_TYPES.INFO?'info':'danger'}`} onClick={handleSelfRemove}>
      <div className="content">
        <FaInfoCircle size={32} color="white" />
        <p>{message}</p>
      </div>

      
    </div>
  );
}