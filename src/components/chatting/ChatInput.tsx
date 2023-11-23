import React, { useState } from "react";
import styled from "styled-components";
import moment from "moment";
import { io } from "socket.io-client";
import { GoTriangleUp } from "react-icons/go";

const socket = io(""); // 서버 URL로 변경

interface ChatInputProps {
  onToggleMessageList: () => void;
  chatList: { no: number; id: string; chat: string; date: string }[];
  setChatList: React.Dispatch<
    React.SetStateAction<
      { no: number; id: string; chat: string; date: string }[]
    >
  >;
  expanded: boolean;
}

const ChatInput = ({
  onToggleMessageList,
  chatList,
  setChatList,
  expanded,
}: ChatInputProps) => {
  const [chatContents, setChatContents] = useState<string>("");

  const handleAddChat = () => {
    const nowTime = moment().format("MM-DD HH:mm:ss");
    if (chatContents.length === 0) {
      alert("채팅 내용을 입력해주세요");
    } else {
      setChatList((prev) => [
        ...prev,
        {
          no: chatList.length + 1,
          id: `user${chatList.length + 1}`,
          chat: chatContents,
          date: nowTime,
        },
      ]);

      // 서버로 메시지 전송
      socket.emit("sendMessage", {
        id: "",
        chat: chatContents,
        date: nowTime,
      });
      setChatContents("");
    }
  };

  const pressEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddChat();
    }
  };
  const enlargeHandler = () => {
    onToggleMessageList();
  };

  return (
    <StyledContainer>
      <input
        type="text"
        value={chatContents}
        onChange={(e) => setChatContents(e.target.value)}
        onKeyDown={pressEnter}
        placeholder="메세지를입력하세요"
      />
      <button onClick={handleAddChat}>전송</button>
      <button onClick={enlargeHandler}>
        <AnimatedIcon expanded={expanded}>
          <GoTriangleUp />
        </AnimatedIcon>
      </button>
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  display: flex;
  height: 45px;
  border-radius: 0.5rem 0.5rem 0 0;
  border: 1px solid white;

  input {
    padding-left: 10px;
    color: white;
    border: none;
    background-color: transparent;
    height: 70%;
    flex-grow: 1;
  }
  input:focus {
    outline: none;
  }
  button {
    color: white;
    background-color: transparent;
    border: none;
  }
`;
const AnimatedIcon = styled.div<{ expanded: boolean }>`
  transform: ${({ expanded }) =>
    expanded ? "rotate(180deg)" : "rotate(0deg)"};
  transition: all ease 0.4s;
`;

export default ChatInput;
