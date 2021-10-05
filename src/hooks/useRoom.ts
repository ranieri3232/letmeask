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

type LikesType = Record<string, {
  authorId: string;
}>
// type FirebaseQuestions = Record<string, {
//   author: {
//     name: string;
//     avatar: string;
//   }
//   content: string;
//   isHighlighted: boolean;
//   isAnswered: boolean;
//   likes: Record<string, {
//     authorId: string;
//   }>
// }>
type RoomData = {
  title: string;
  closedAt: Date | undefined;
  authorId: string;
}
export function useRoom(roomId: string){
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const history = useHistory();
  const {createToast} = useToast();
  const [roomData, setRoomData] = useState<RoomData>({} as RoomData);

  const { user } = useAuth();

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);
    
    roomRef.on('value', room => {
      if(room.val() === null){
        createToast('Sala excluída');
        history.push('/');
        return;
      }
      
      const databaseRoom = room.val();
      setRoomData({
        authorId: databaseRoom.authorId,
        closedAt: databaseRoom.closedAt ? new Date(databaseRoom.closedAt) : undefined,
        title: databaseRoom.title
      });
    });
    
    
    return () => {
      roomRef.off('value');
    }
  }, [user, roomId, createToast, history]);
  useEffect(() => {
    const questionsRef = database.ref(`questions/${roomId}`);
    
    questionsRef.orderByChild('isHighlighted').on('value', questions => {
      var QuestionsArray:QuestionType[] = [];
      questions.forEach(question => {
        const firebaseQuestion:QuestionType = {
          id: question.key ?? '1', 
          content: question.val().content,
          author: question.val().author,
          isHighlighted: question.val().isHighlighted,
          isAnswered: question.val().isAnswered,
          likeCount: Object.values(question.val().likes ?? {}).length,
          likeId: Object.entries((question.val().likes ?? {}) as LikesType).find(([key, like]) => like.authorId === user?.id)?.[0],
        };
        QuestionsArray.push(firebaseQuestion);
      });
      setQuestions(QuestionsArray.reverse());
    });
    return () => {
      questionsRef.off('value');
    }

  }, [user, roomId]);
  return { questions, roomData };
}