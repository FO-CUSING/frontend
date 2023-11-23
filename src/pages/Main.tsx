import React, { useState, useEffect } from 'react';
import { CharacterBoxProps } from '../lib/types/main/types'; 
import { useMovement } from '../hooks/charaterMovment';
import styled from 'styled-components';
import backgroundImage from '../asset/images/background.png';
import character2Image from '../asset/images/character2.png';


const Main = () => {
    const { position } = useMovement();

    return (
        <MainContainer>
            <CharacterBox y={position.y} x={position.x}>
                <CharacterBoxName>이름</CharacterBoxName>
                <CharacterBoxImage src={character2Image} />
            </CharacterBox>
        </MainContainer>
    );
}

const MainContainer = styled.div`
    background-image: url(${backgroundImage});
    background-size: cover;
    background-position: center;
    height: 100vh;
`;

const CharacterBox = styled.div.attrs<CharacterBoxProps>(({ y: topDown, x: leftRight }) => ({style: { top: `${topDown}%`, left: `${leftRight}%` }}))<CharacterBoxProps>`
    width: 5%;
    height: 10%;
    position: absolute;
`;

const CharacterBoxName = styled.div`
    font-size: 15px;
    font-weight: bold;
    width: 100%;
    height: 30%;
`;

const CharacterBoxImage = styled.img`
    width: 70%;
    height: 70%;
`;

export default Main;