// wss://3.39.179.45:32000/signal

import React, { useState, useEffect, useRef } from 'react';
import Peer, { Instance } from 'simple-peer';


import { CharacterBoxProps } from '../lib/types/main/types'; 
import { useMovement } from '../hooks/charaterMovment';
import styled from 'styled-components';
import backgroundImage from '../asset/images/background.png';
import character2Image from '../asset/images/character2.png';

interface ChatMessage {
    user: string;
    message: string;
}

const Main = () => {
    const { position } = useMovement();

    // webrtc 필요 훅
    const [peers, setPeers] = useState<Instance[]>([]);// 화상채팅에 참여하는 사람 정보 저장
    const [isVideoCallActive, setIsVideoCallActive] = useState(false); // 화상채팅 활성화 훅
    const [textMessage, setTextMessage] = useState(''); // 채팅관련 훅1
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);// 채팅관련 훅2
  
    const userVideoRef = useRef<HTMLVideoElement>(null); // 개인 사용자의 비디오 참여 훅
    const peersRef = useRef<{ peerId: string; peer: Peer.Instance }[]>([]); // 비디오 채팅에 참여중인 사용자들 훅
    const socketRef = useRef<WebSocket | undefined>(undefined); //websocket에 대한 참여 훅
    
    //Main.tsx 파일이 생성과 동시에 소켓 연결
    useEffect(() => {
        socketRef.current = new WebSocket('wss://3.39.179.45:32000/signal');
        socketRef.current.onopen = () => {
            console.log('WebSocket 연결이 열렸습니다.');
        };
        socketRef.current.onerror = (error) => {
            console.error('WebSocket 오류:', error);
        };
        
    }, []); // 의존성 구분, 독립적으로 한번만 실행되도록 하여, 렌더링 최적화


    //캐릭터 이동
    useEffect(() => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            console.log("캐릭터 이동", position);
            socketRef.current.send(JSON.stringify({ id: 'step', position : position })); 
            
            //영역 들어오는 부분 처리
            if (position.y < 60 && position.y > 30 && position.x > 20 && position.x < 68 ){
                //미디어 처리
                console.log("영역")
            }
        }

        
    }, [position]);



    //채팅
    const handleTextMessage = () => {
        if (textMessage.trim() !== '' && socketRef.current) {
            console.log("채팅 보냄")
            socketRef.current.send(JSON.stringify({ id : 'join', message: textMessage }));
            setChatMessages((prevMessages) => [...prevMessages, { user: 'You', message: textMessage }]);            
            setTextMessage('');
        }
    };

    
    return (
        <MainContainer>
            {/* webrtc 기능 구현 부분 */}

            {/* 채팅 */}
            <ChattingFrame>
                <ChattingFrameTextList>
            
                </ChattingFrameTextList>
                <ChattingFrameTextInputContainer>
                <input
                    type="text"
                    value={textMessage}
                    onChange={(e) => setTextMessage(e.target.value)}
                    placeholder="채팅입력"
                    style={{
                        width: '85%', // 원하는 너비로 조절
                        height: '90%', // 원하는 높이로 조절
                    }}
                />
                <button onClick={handleTextMessage} style={{ width: '15%',height: '100%'}}>전송</button>
                </ChattingFrameTextInputContainer>
            </ChattingFrame>



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

//webrtc 채팅 관련 styled component
const ChattingFrame = styled.div`
    background: rgba(0, 0, 0, 0.7);
    width: 20%;
    height: 45%;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index : 1;
`;
const ChattingFrameTextList = styled.div`
    // background: rgba(0, 0, 0, 0.7);
    width: 100%;
    height: 88%;
    position: absolute;
    top: 0;
    left: 0;
    z-index : 1;
`;
const ChattingFrameTextInputContainer = styled.div`
    background: rgba(0, 0, 0, 0.7);
    width: 100%;
    height: 12%;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index : 1;
    display : flex;
`;

export default Main;