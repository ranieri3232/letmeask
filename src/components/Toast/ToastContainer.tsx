import { useEffect } from "react";
import { useToast } from "../../hooks/useToast";
import { Toast } from "./Toast";


export function ToastContainer(){
  const { toasts } = useToast();
  return(
    <div>
      {toasts.map(
          toast => (
            <Toast 
              key={toast.id}
              message={toast.message} 
              id={toast.id} 
              selfDestruct={toast.selfDestruct}
            />
          )
        )}
    </div>
  );
}