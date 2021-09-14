import './styles.scss';

import { useEffect, useState } from 'react';
import { Toast, ToastProps } from './Toast';


function ToastContainer(){
  const [toastList, setToastList] = useState<ToastProps[]>([] as ToastProps[]);
  function add(){
    console.log('1');
  }
  return(
    <div id="container">
      {toastList.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}

        />
      ))}
    </div>
  );
}
export {ToastContainer}
