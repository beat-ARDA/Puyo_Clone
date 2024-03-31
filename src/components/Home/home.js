import './Home.css'
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="d-flex flex-column justify-content-center align-items-center container_home bg-success">
            <h1 className='mb-4'>Puyo - Puyo</h1>
            <button
                onClick={() => navigate('game')}
                className="btn btn-secondary w-25"
            >
                Jugar!
            </button>
        </div>
    )
}