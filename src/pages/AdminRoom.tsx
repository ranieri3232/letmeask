
import { useParams } from 'react-router-dom';

import {ReactComponent as DeleteImg} from '../assets/images/delete.svg';
import {ReactComponent as AnswerImg} from '../assets/images/answer.svg';
import {ReactComponent as CheckImg} from '../assets/images/check.svg';

import {ReactComponent as LogoImg } from '../assets/images/logo.svg';

import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
import { database } from '../services/firebase';
import { Button } from '../components/Button';
import { useRoom } from '../hooks/useRoom';

import { ReactComponent as EmptyQuestions } from '../assets/images/empty-questions.svg';
import { useHistory } from "react-router";

import '../styles/room.scss';
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';

type RoomParams = {
  id: string;
}
export function AdminRoom(){

  const params = useParams<RoomParams>();
  const roomId = params.id;

  const {questions, roomData} = useRoom(roomId);
  const {user} = useAuth();
  const history = useHistory();
  
  useEffect(() => {
    if(user && roomData.authorId){
      if(user?.id !== roomData.authorId){
        history.push(`/rooms/${roomId}`);
      }
    }
  }, [roomData, user, history, roomId]);

  async function handleEndRoom(){
    await database.ref(`rooms/${roomId}`).update({
      closedAt: new Date()
    });
  }

  async function handleDeleteQuestion(questionId: string){
    if(window.confirm("Tem certeza que deseja remover a pergunta?")){
      await database.ref(`questions/${roomId}/${questionId}`).remove();
    }
  }
  async function handleCheckQuestionAsAnswered(questionId: string){
    await database.ref(`questions/${roomId}/${questionId}`).update({
      isAnswered: true
    });
  }
  async function handleHighlightQuestion(questionId: string){
    await database.ref(`questions/${roomId}/${questionId}`).update({
      isHighlighted: true
    });
  }
  return(
    <div id="page-room">
      <header>
        <div className="content">
          <a href="/">
            <LogoImg height={45}/>
          </a>
          <div>
            <RoomCode code={roomId}/>
            {!roomData.closedAt&&<Button onClick={handleEndRoom} isOutlined>Encerrar</Button>}
          </div>
        </div>
      </header>
      <main className="content">
        <div className="room-title">
          <h1>Sala {roomData.title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
          {roomData.closedAt&&<span className="closed-tip">encerrada {`${roomData.closedAt?.toLocaleDateString()}`}</span>}
        </div>
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
                  {
                    !question.isAnswered && (
                      <>
                        <button
                          type='button'
                          onClick={() => handleCheckQuestionAsAnswered(question.id)}
                          className="check-button"
                        >
                          <CheckImg/>  
                        </button> 
                        <button
                          type='button'
                          onClick={() => handleHighlightQuestion(question.id)}
                          className="highlight-button"
                        >
                          <AnswerImg/>
                        </button> 
                      </>
                    )
                  }
                  
                  <button
                    type='button'
                    onClick={() => handleDeleteQuestion(question.id)}
                    className="delete-button"
                  >
                    <DeleteImg/>
                  </button>  
                </Question>
              )
            })
            : 
            <div className="no-questions" >
              <EmptyQuestions/>
              <h3>Nenhuma pergunta por aqui...</h3>
              <span>Repasse o código da sala para seus amigos e <br/>comece a responder as perguntas!</span>
            </div> 
          }
        </div>
      </main>
    </div>
  );
}