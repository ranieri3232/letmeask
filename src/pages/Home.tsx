import { FormEvent, useEffect, useRef, useState } from 'react';

import illustratorImg from '../assets/images/illustration.svg';
import googleImg from '../assets/images/google-icon.svg';
import logoImg from '../assets/images/logo.svg';

import { useHistory } from 'react-router-dom';
import { database } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';

import { Button } from '../components/Button';

import '../styles/auth.scss';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/Toast/ToastContainer';

export function Home(){
  const history = useHistory();
  const [roomCode, setRoomCode] = useState('');
  const {signInWithGoogle, user} = useAuth();
  const {createToast} = useToast();


  function handleCreateAToast(){
    createToast('alo');
    //console.log('cirando um toast');
  }
  async function handleJoinRoom(event: FormEvent){
    event.preventDefault();
    if(roomCode.trim() === ''){
      return;
    }
    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if(!roomRef.exists()){
      alert('Room does not exists.');
      return;
    }

    if(roomRef.val().closedAt){
      alert('Room already closed');
      return;
    }
    history.push(`/rooms/${roomCode}`);
  }

  async function handleCreateNewRoom(){
    if(!user){
      try{
        await signInWithGoogle();
      } catch(err){
        console.log('Error ao tentar acessar sua conta.');
        history.push('/');
        return;
      }
    }
    history.push('/rooms/new');
  }
  return (
    <div id="page-auth"> 
      <ToastContainer/>
      <aside>
        <img src={illustratorImg} alt="ilustração simbolizando perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao-vivo </strong>
        <p> Tire dúvidas da sua audiência em tempo real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          <button 
            onClick={handleCreateNewRoom}
            className="create-room">
            <img src={googleImg} alt="Logo do google"/>
            Crie sua sala com o Google
          </button>
          <div className="separator">
            ou entre em uma sala
          </div>
          <form onSubmit={handleJoinRoom}>
            <input 
              type="text" 
              placeholder="Digite o código da sala"
              onChange={event => setRoomCode(event.target.value)}
              value={roomCode}
            />
            <Button type="button" onClick={handleCreateAToast}>
              Entrar na sala
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}