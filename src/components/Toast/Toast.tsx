import { useEffect } from "react";

export type ToastProps={
  id: number,
  type: string;
  message: string;
  deleteToast?: (id: number) => void;
}

export function Toast({id, type, message, deleteToast}: ToastProps){
  useEffect(() => {
    setTimeout(() => {
      console.log(`hora de se autodestruir ${id}`);
      deleteToast&&deleteToast(id);
    }, 3000);
  }, []);
  return (
    <div className={`toast info`}>
      <div className="content">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12.0003" cy="11.9998" r="9.00375" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8.44287 12.3391L10.6108 14.507L10.5968 14.493L15.4878 9.60193" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <p>Alo</p>
      </div>
    </div>
  );
}