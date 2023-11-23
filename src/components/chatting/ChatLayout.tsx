import React, { useState } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import ChatMessageList from "./ChatMessageList";

const ChatLayout = () => {
  const [isMessageListExpanded, setIsMessageListExpanded] = useState(true);
  const [chatList, setChatList] = useState<any[]>([]);

  const toggleMessageListHeight = () => {
    setIsMessageListExpanded((prev) => !prev);
  };
  return (
    <StyledContainer>
      <ChatMessageList expanded={isMessageListExpanded} chatList={chatList} />
      <ChatInput
        onToggleMessageList={toggleMessageListHeight}
        chatList={chatList}
        setChatList={setChatList}
        expanded={isMessageListExpanded}
      ></ChatInput>
    </StyledContainer>
  );
};
const StyledContainer = styled.div`
  border-radius: 0.5rem 0.5rem 0 0;
  width: 370px;
  position: absolute;
  bottom: 0;
  background-color: black;
  opacity: 0.7;
`;
export default ChatLayout;
