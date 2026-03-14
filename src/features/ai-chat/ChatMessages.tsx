'use client';

import React from 'react';
import Image from 'next/image';

export type MessageType = 'text' | 'voice' | 'image';
export type MessageSender = 'ai' | 'user';

export interface Message {
  id: string;
  sender: MessageSender;
  type: MessageType;
  content: string;
  timestamp: Date;
  imageUrl?: string;
  voiceDuration?: string;
}

interface ChatMessagesProps {
  messages: Message[];
}

const DateSeparator: React.FC<{ date: string }> = ({ date }) => (
  <div className="flex items-center gap-4 my-6">
    <div className="flex-1 h-0.5" style={{ backgroundColor: '#B6CFD4' }} />
    <span className="text-sm font-medium" style={{ color: '#64748B' }}>
      {date}
    </span>
    <div className="flex-1 h-0.5" style={{ backgroundColor: '#B6CFD4' }} />
  </div>
);

const VoiceMessage: React.FC<{ duration?: string; sender: MessageSender }> = ({ 
  duration = '00:45', 
  sender 
}) => (
  <div className="flex items-center gap-3 w-[394px]">
    <button className="shrink-0">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="20" fill="#FFE082"/>
        <path d="M25.0306 20.5312L17.5306 28.0312C17.4257 28.1362 17.292 28.2078 17.1465 28.2367C17.0009 28.2657 16.85 28.2509 16.7129 28.1941C16.5758 28.1372 16.4586 28.041 16.3762 27.9176C16.2938 27.7941 16.2499 27.649 16.25 27.5006V12.5006C16.2499 12.3522 16.2938 12.207 16.3762 12.0836C16.4586 11.9602 16.5758 11.8639 16.7129 11.8071C16.85 11.7503 17.0009 11.7355 17.1465 11.7644C17.292 11.7934 17.4257 11.865 17.5306 11.97L25.0306 19.47C25.1004 19.5396 25.1557 19.6223 25.1934 19.7134C25.2312 19.8044 25.2506 19.902 25.2506 20.0006C25.2506 20.0992 25.2312 20.1967 25.1934 20.2878C25.1557 20.3788 25.1004 20.4616 25.0306 20.5312Z" fill="#5A431B"/>
      </svg>
    </button>
    <div className="flex-1">
      <div className="flex items-center gap-2">
        {/* Waveform visualization */}
        <div className="flex items-center gap-0.5 flex-1">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="w-1 rounded-full"
              style={{
                height: `${Math.random() * 20 + 10}px`,
                backgroundColor: sender === 'user' ? '#FFE082' : '#156374'
              }}
            />
          ))}
        </div>
        <span className="text-xs font-medium" style={{ color: sender === 'user' ? 'white' : '#334155' }}>
          {duration}
        </span>
      </div>
    </div>
  </div>
);

const ImageMessage: React.FC<{ imageUrl: string }> = ({ imageUrl }) => (
  <div className="relative overflow-hidden h-fit w-fit">
    <img
      src={imageUrl}
      alt="Shared image"
      className="object-cover w-full max-w-2xl md:h-[280px] h-48 rounded-2xl"
    />
  </div>
);

const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
  const isAI = message.sender === 'ai';
  
  const bubbleStyles = isAI
    ? {
        backgroundColor: '#B6CFD4',
        color: '#334155',
        borderRadius: '16px 16px 16px 0px'
      }
    : {
        backgroundColor: '#156374',
        color: 'white',
        borderRadius: '16px 16px 0px 16px'
      };

  return (
    <div className={`flex ${isAI ? 'justify-start' : 'justify-end'} w-full`}>
      <div
        className="max-w-[80%] lg:max-w-2xl w-fit px-4 py-3"
        style={bubbleStyles}
      >
        {message.type === 'text' && (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        )}
        {message.type === 'voice' && (
          <VoiceMessage duration={message.voiceDuration} sender={message.sender} />
        )}
        {message.type === 'image' && message.imageUrl && (
          <ImageMessage imageUrl={message.imageUrl} />
        )}
      </div>
    </div>
  );
};

export const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    
    messages.forEach((message) => {
      const date = new Date(message.timestamp);
      const dateKey = date.toLocaleDateString('en-US', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      });
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });
    
    return groups;
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-6xl mx-auto space-y-4">
        {Object.entries(groupedMessages).map(([date, msgs]) => (
          <div key={date}>
            <DateSeparator date={date} />
            <div className="space-y-3">
              {msgs.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
