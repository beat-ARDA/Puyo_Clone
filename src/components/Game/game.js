import { React, useEffect } from "react";
import { World } from "./world";
import './game.css';

export default function Game() {

    useEffect(() => {
        const container = document.querySelector('#scene-container');
        const world = new World(container);

        world.start();
    }, []);

    return (
        
            <div className="game-background" id='scene-container'>
            </div>
  
    )
}