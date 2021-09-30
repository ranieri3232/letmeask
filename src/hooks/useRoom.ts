import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";
import { useToast } from "./useToast";
type QuestionType = {
  id: string;
  author: {
    name: string
    avatar: string;
  }
  content: string;
  isHighlighted: boolean;
  isAnswered: boolean;
  likeCount: number;
  likeId: string | undefined;
}
type FirebaseQuestions = Record<string, {
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isHighlighted: boolean;
  isAnswered: boolean;
  likes: Record<string, {
    authorId: string;
  }>
}>
export function useRoom(roomId: string){
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [title, setTitle] = useState('');
  const history = useHistory();
  const {createToast} = useToast();
  const [closedAt, setClosedAt] = useState<Date>();
  const [authorId, setAuthorId] = useState('');

  const { user } = useAuth();

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

    roomRef.on('value', room => {
      if(room.val() === null){
        history.push('/');
        createToast('Sala excluída', {selfDestruct:false});
        return;
      }
      const databaseRoom = room.val();
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};
      if(databaseRoom.closedAt){
        setClosedAt(new Date(databaseRoom.closedAt));
      }else{
        setClosedAt(undefined);
      }
      setAuthorId(databaseRoom.authorId);
      
      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered,
          likeCount: Object.values(value.likes ?? {}).length,
          likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0],
        }
      })
      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
    })

    return () => {
      roomRef.off('value');
    }
  }, [roomId, user?.id, createToast, history, authorId]);
  return { questions, title, closedAt, authorId };
}