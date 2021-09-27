import copyImg from '../assets/images/copy.svg';
import { useToast } from '../hooks/useToast';
import '../styles/room-code.scss';


type RoomCodeProps = {
  code: string;
}
export function RoomCode(props:RoomCodeProps){
  const {createToast} = useToast();

  function copyRoomCodeToClipboard(){
    navigator.clipboard.writeText(props.code);
    createToast('Código copiado!');
  }
  function roomCodeFormat(code:string){
    return code.substring(1);
  }
  return (
    <button className="room-code" onClick={copyRoomCodeToClipboard} >
      <div>
        <img id="img-copy" src={copyImg} alt="Copy room code" />
      </div>
      <span>#{roomCodeFormat(props.code)}</span>
    </button>
  );
}