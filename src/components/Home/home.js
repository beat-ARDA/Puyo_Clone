import './Home.css'
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="d-flex flex-column justify-content-center align-items-center container_home bg-success">
            <h1 className='mb-4 text-center'>
                Puyo - Puyo
                Usa las teclas A,W,S,D para moverte
                Usa las teclas flecha izq y der para girar las perlas
            </h1>

            <button
                onClick={() => navigate('game')}
                className="btn btn-secondary w-25"
            >
                Jugar!
            </button>
        </div>
    )
}