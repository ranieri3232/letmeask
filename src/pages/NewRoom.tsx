import { ReactComponent as LogoImg} from '../assets/images/logo.svg';
import { ReactComponent as IllustrationImg} from '../assets/images/illustration.svg';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import {Link, useHistory} from 'react-router-dom'

import '../styles/auth.scss'
import { FormEvent, useState } from 'react';
import { database } from '../services/firebase';
import { useToast } from '../hooks/useToast';
import { T_TYPES } from '../contexts/ToastContext';
export function NewRoom(){
  
  const {user} = useAuth();
  const [newRoom, setNewRoom] = useState('');
  const history = useHistory();
  
  const {createToast} = useToast();
  
  async function handleCreateRoom(event: FormEvent){
    event.preventDefault();

    if(newRoom.trim() === ''){
      createToast('Preencha o nome da sala', {tType:T_TYPES.DANGER});
      return;
    }
    const roomRef = await database.ref('rooms');
    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id 
    });
    history.push(`/admin/rooms/${firebaseRoom.key}`);
  }
  return (
    <div id="page-auth"> 
      <aside>
        <IllustrationImg className="illustration-img"/>
        <strong>Crie salas de Q&amp;A ao-vivo </strong>
        <p> Tire dúvidas da sua audiência em tempo real</p>
      </aside>
      <main>
        <div className="main-content">
          <LogoImg className="logo-img"/>
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input 
              type="text" 
              placeholder="Nome da sala"
              onChange={event => setNewRoom(event.target.value)}
              value={newRoom}
            />
            <Button type="submit">
              Criar sala
            </Button>
          </form>
          <p>Quer entrar em uma sala existente? <Link to="/">clique aqui</Link></p>
        </div>
      </main>
    </div>
  )
}