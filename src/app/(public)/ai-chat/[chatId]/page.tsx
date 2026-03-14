'use client';

import React, { useState } from 'react';
import { ChatNavbar, ChatEmptyState, ChatInputArea, ChatHistoryModal, ChatMessages, type Message } from '@/features/ai-chat';

const AIChatPage = () => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [showMessages, setShowMessages] = useState(true);
  
  const sampleMessages: Message[] = [
    {
      id: '1',
      sender: 'ai',
      type: 'text',
      content: "Hi there, I'm Zee I am available to chat with you 24/7\n& assist you on any internship related questions",
      timestamp: new Date('2025-01-23T10:00:00')
    },
    {
      id: '2',
      sender: 'user',
      type: 'text',
      content: "I can't figure out where to see the list of my task for the week I just started the program can you give me some directions?",
      timestamp: new Date('2025-01-23T10:05:00')
    },
    {
      id: '3',
      sender: 'user',
      type: 'voice',
      content: '',
      voiceDuration: '00:45',
      timestamp: new Date('2025-01-23T10:06:00')
    },
    {
      id: '4',
      sender: 'ai',
      type: 'text',
      content: "Oh! It's nice to have to join Amdari internship program. Welcome!\n\nLooking for your task for the week?\n\n. Try to log into your dashboard from the website\n. Tap on the internship option on your left side bar.\n. Your task for the week will be displayed right there.",
      timestamp: new Date('2025-01-23T10:07:00')
    },
    {
      id: '5',
      sender: 'user',
      type: 'text',
      content: "I can't figure out where to see the list of my task for the week.",
      timestamp: new Date('2025-01-23T10:10:00')
    },
    {
      id: '6',
      sender: 'user',
      type: 'image',
      content: '',
      imageUrl: '/Rectangle 1430107115.png',
      timestamp: new Date('2025-01-23T10:11:00')
    }
  ];

  const [messages] = useState<Message[]>(sampleMessages);

  const handleMessageSubmit = (message: string) => {
    console.log('Sending message:', message);
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: '#E8EFF1', fontFamily: 'Sora, sans-serif' }}>
      <div className="fixed top-0 left-0 right-0 z-30">
        <ChatNavbar 
          onOpenHistory={() => setIsHistoryOpen(true)}
          showMessages={showMessages}
          onToggleMessages={() => setShowMessages(!showMessages)}
        />
      </div>

      <main className="flex-1 flex flex-col overflow-hidden mt-20 mb-28">
        {showMessages ? (
          <ChatMessages messages={messages} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
            <ChatEmptyState />
          </div>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-30" style={{ backgroundColor: '#E8EFF1' }}>
        <ChatInputArea onSubmit={handleMessageSubmit} />
      </div>

      <ChatHistoryModal 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
      />
    </div>
  );
};

export default AIChatPage;