import { Routes, Route } from 'react-router-dom';
import { Home, Game } from './components/indexImports';


export default function Router() {
    return (
        <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/game' element={<Game/>} />
        </Routes>
    );
}