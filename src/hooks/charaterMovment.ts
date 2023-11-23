import { useState, useEffect } from 'react';
import { Position } from '../lib/types/main/types';

export const useMovement = () => {
    const [position, setPosition] = useState<Position>({ y: 0, x: 0 });
    const [pressedKeys, setPressedKeys] = useState<string[]>([]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            setPressedKeys((prevKeys) => {
                if (!prevKeys.includes(e.key)) {
                    return [...prevKeys, e.key];
                }
                return prevKeys;
            });
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            setPressedKeys((prevKeys) => prevKeys.filter((key) => key !== e.key));
        };

        const move = () => {
            let newY = position.y;
            let newX = position.x;

            if (pressedKeys.includes('ArrowUp')) {
                newY -= 1;
            }
            if (pressedKeys.includes('ArrowDown')) {
                newY += 1;
            }
            if (pressedKeys.includes('ArrowLeft')) {
                newX -= 0.5;
            }
            if (pressedKeys.includes('ArrowRight')) {
                newX += 0.5;
            }
            
            setPosition({ y: newY, x: newX });
        };
        
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        const animationFrameId = requestAnimationFrame(move);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            cancelAnimationFrame(animationFrameId);
        };
    }, [pressedKeys, position.y, position.x]);

    return { position };
};
