import { 
  createContext, 
  ReactNode, 
  useEffect, 
  useState 
} from "react";
import { auth, firebase } from "../services/firebase";

type User = {
  id: string;
  name: string;
  avatar: string;
}

type AuthContextType = {
  user: User | undefined;
  signInWithGoogle: () => Promise<void>;
  signOut: () => void;
}
type AuthContextProviderProps= {
  children: ReactNode;
}
export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps){
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if(user){
        const {displayName, uid, photoURL} = user;

        if(!displayName || !photoURL){
          throw new Error("Missing information from Google account.");
        }
  
        setUser({
          id: uid,
          avatar: photoURL,
          name: displayName
        });
      }else{
        setUser(undefined);
      }
    });
    return () => {
      unsubscribe();
    }
  }, []);
  async function signOut(){
    auth.signOut();
    console.log('user sign out');
  }
  async function signInWithGoogle(){
    try{
      const provider = new firebase.auth.GoogleAuthProvider();

      const result = await auth.signInWithPopup(provider);
        
      if(result.user){
        const {displayName, uid, photoURL} = result.user;

        if(!displayName || !photoURL){
          throw new Error("Missing information from Google account.");
        }

        setUser({
          id: uid,
          avatar: photoURL,
          name: displayName
        });
        return;
      }
    }catch(err){
      throw err;
    }
  }
  return (
    <AuthContext.Provider value={{user, signInWithGoogle, signOut}}>
      {props.children}
    </AuthContext.Provider>
  );
}