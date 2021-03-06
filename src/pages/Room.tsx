import { FormEvent, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import {ReactComponent as LogoImg } from '../assets/images/logo.svg';

import { ReactComponent as EmptyQuestions } from '../assets/images/empty-questions.svg';

import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';

import '../styles/room.scss';
import { useToast } from '../hooks/useToast';
import { T_TYPES } from '../contexts/ToastContext';

type RoomParams = {
  id: string;
}
export function Room(){
  const [newQuestion, setNewQuestion] = useState('');

  const {user, signOut, signInWithGoogle}= useAuth();

  const history = useHistory();

  const params = useParams<RoomParams>();
  const roomId = params.id;

  const {questions, roomData} = useRoom(roomId);

  const {createToast} = useToast();

  function handleSignOut(){
    signOut();
    history.push('/');
  }
  useEffect(() => {
    if(roomData.authorId === user?.id){
      history.push(`/admin/rooms/${roomId}`);
    }
  }, [user, roomData, roomId, history]);
  async function handleSendQuestion(event: FormEvent){
    event.preventDefault();
    if(newQuestion.trim() === ''){
      return;
    }
    if(!user){
      throw new Error('You must be logged in');
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar
      },
      isHighlighted: false,
      isAnswered: false
    }

    await database.ref(`questions/${roomId}`).push(question);
    setNewQuestion('');
  }
  async function handleSignIn(){
    try{
      await signInWithGoogle();
      console.log('usuario logado');
    }catch(err){ 
      createToast('falha no login', {tType: T_TYPES.DANGER});
    }
  }

  async function handleLikeQuestion(questionId: string, likeId: string | undefined){
    if(user){
      if(likeId){
        await database.ref(`questions/${roomId}/${questionId}/likes/${likeId}`).remove();
      }else{
        await database.ref(`questions/${roomId}/${questionId}/likes`).push({
          authorId: user?.id,
        });
      }
    }
  }

  return(
    <div id="page-room">
      <header>
        <div className="content">
          <a href="/">
            <LogoImg height={45}/>
          </a>
          <RoomCode code={roomId}/>
        </div>
      </header>
      <main className="content">
        <div className="room-title">
          <h1>Sala {roomData.title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
          {roomData.closedAt&&<span className="closed-tip">encerrada {`${roomData.closedAt?.toLocaleDateString()}`}</span>}
         
        </div>
        <form 
          onSubmit={handleSendQuestion}
        >
          <textarea 
            placeholder="O que voc?? quer perguntar?"
            onChange={event => setNewQuestion(event.target.value)}
            value={newQuestion}
          />
          <div className="form-footer">
            { user ? (
              <div className="user-info" onClick={handleSignOut}>
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>Para enviar uma pergunta, <button onClick={handleSignIn}>fa??a seu login</button>.</span>
            )}
            <Button disabled={!user || roomData.closedAt !== undefined} type="submit">
              Enviar pergunta
            </Button>
          </div>
        </form>
        <div className="question-list">
          {
            questions.length !== 0 ? 
            questions.map(question => {
            return(
              <Question 
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                {!question.isAnswered && (
                  <button
                    className={`like-button ${question.likeId ? 'liked' : ''}`}
                    type="button"
                    aria-label="Marcar como gostei"
                    onClick={() => handleLikeQuestion(question.id, question.likeId)}
                  >
                    { question.likeCount > 0 && <span>{question.likeCount}</span>}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                )}
              </Question>
            )
          })
          :
          <div className="no-questions">
            <EmptyQuestions />
            <h3>Nenhuma pergunta por aqui...</h3>
            <span>{user ? 'Seja o primeiro a perguntar!' : 'Fa??a o login e seja o primeiro a perguntar!'}</span>
          </div>
        
        } 
        </div>
      </main>
    </div>
  );
}