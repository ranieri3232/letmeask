import { useEffect } from "react";
import { ToastProps, T_TYPES } from "../../contexts/ToastContext";
import { useToast } from "../../hooks/useToast";

import { FaInfoCircle, FaCheckCircle } from 'react-icons/fa';

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
    <div className={`container ${tType}`} onClick={handleSelfRemove}>
      <div className="content">
        {
          tType === T_TYPES.DANGER?
          <FaInfoCircle size={32} color="white" />
          :
          <FaCheckCircle size={32} color="white"/>
        }
        <p>{message}</p>
      </div>

      
    </div>
  );
}