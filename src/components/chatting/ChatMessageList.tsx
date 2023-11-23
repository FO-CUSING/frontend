import React from "react";
import styled from "styled-components";

interface ChatMessageListProps {
  chatList: { no: number; id: string; chat: string; date: string }[];
  expanded: boolean;
}
const ChatMessageList = ({ chatList, expanded }: ChatMessageListProps) => {
  const formatChatMessage = (chat: string) => {
    const formattedChat = chat.replace(new RegExp(`(.{35})`, "g"), "$1\n");
    return formattedChat;
  };
  return (
    <StyledContainer expanded={expanded}>
      {chatList.map((chat) => (
        <StyledText key={chat.no}>
          {`${chat.id}: ${formatChatMessage(chat.chat)}`}
        </StyledText>
      ))}
    </StyledContainer>
  );
};

const StyledContainer = styled.div<{ expanded: boolean }>`
  height: ${(props) => (props.expanded ? "300px" : "50px")};
  overflow-y: auto;
  transition: height 0.3s ease-in-out;
  padding: 10px;
  color: white;
  overflow: overlay;
  white-space: pre-wrap;

  &::-webkit-scrollbar {
    width: 10px;
    height: 8px;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.4);
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 6px;
  }
`;

const StyledText = styled.div`
  padding: 8px;
`;

export default ChatMessageList;
