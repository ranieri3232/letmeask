import { useToast } from "../../hooks/useToast";
import { Toast } from "./Toast";
import { useTransition, animated } from 'react-spring';
import './styles/toast-container.scss';


export function ToastContainer(){
  const { toasts } = useToast();
  
  const transitions = useTransition(toasts, {
    from: { transform: "translateX(150%)", opacity: 0 },
    enter: { transform: "translateX(0%)", opacity: 1 },
    leave: { transform: "translateX(150%)", opacity:0 }
  });
  return(
    <div className="toast-container">
      {transitions((style, item) => (
        <animated.div style={style}>
          <Toast 
            key={item.id}
            message={item.message} 
            id={item.id} 
            selfDestruct={item.selfDestruct}
          />
        </animated.div>
      ))}
    </div>
  );
}