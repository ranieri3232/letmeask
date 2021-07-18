import illustratorImg from '../assets/images/illustration.svg';
import googleImg from '../assets/images/google-icon.svg';
import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

import '../styles/auth.scss'
import { FormEvent, useState } from 'react';
import { database } from '../services/firebase';

export function Home(){
  const history = useHistory();
  const [roomCode, setRoomCode] = useState('');

  const {signInWithGoogle, user} = useAuth();

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
    history.push(`/rooms/${roomCode}`);
  }

  async function handleCreateNewRoom(){
    if(!user){
      await signInWithGoogle();
    }
    history.push('/rooms/new');
  }
  return (
    <div id="page-auth"> 
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
            <Button type="submit">
              Entrar na sala
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}