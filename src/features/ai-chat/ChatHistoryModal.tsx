'use client';

import React, { useEffect } from 'react';

interface ChatHistoryItem {
  id: string;
  title: string;
  date: string;
}

interface ChatHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatHistory?: ChatHistoryItem[];
}

export const ChatHistoryModal: React.FC<ChatHistoryModalProps> = ({
  isOpen,
  onClose,
  chatHistory = [
    {
      id: '1',
      title: "I can't figure out where to see the list of my task for the week I just started ...",
      date: '23 Jan, 2025'
    },
    {
      id: '2',
      title: "I can't figure out where to see the list of my task for the week I just started ...",
      date: '23 Feb, 2025'
    },
    {
      id: '3',
      title: "I can't figure out where to see the list of my task for the week I just started ...",
      date: '23 Mar, 2025'
    },
    {
      id: '4',
      title: "I can't figure out where to see the list of my task for the week I just started ...",
      date: '23 Jan, 2026'
    },
    {
      id: '5',
      title: "I can't figure out where to see the list of my task for the week I just started ...",
      date: '15 Feb, 2025'
    },
    {
      id: '6',
      title: "I can't figure out where to see the list of my task for the week I just started ...",
      date: '15 Feb, 2025'
    }
  ]
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{ backgroundColor: '#00000066' }}
        onClick={onClose}
      />

      <div
        className={`fixed z-50 bg-white transition-all duration-300 ease-out
          md:left-8 md:top-24 md:w-80 md:rounded-3xl md:max-h-[calc(100vh-12rem)]
          left-0 right-0 bottom-0 rounded-t-3xl max-h-[80vh]
          ${isOpen ? 'md:opacity-100 md:translate-y-0 translate-y-0' : 'md:opacity-0 md:translate-y-4 translate-y-full'}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="px-6 py-4 border-b border-gray-100" style={{ backgroundColor: '#156374' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.5 9.99809C17.5 11.463 17.0711 12.8958 16.2661 14.1197C15.4611 15.3436 14.3153 16.305 12.9701 16.8851C11.625 17.4652 10.1394 17.6387 8.69683 17.3842C7.25421 17.1297 5.91772 16.4582 4.85234 15.4528C4.79263 15.3964 4.74462 15.3287 4.71105 15.2537C4.67748 15.1788 4.65901 15.0979 4.65668 15.0158C4.65436 14.9336 4.66824 14.8519 4.69752 14.7751C4.7268 14.6984 4.77092 14.6281 4.82734 14.5684C4.9413 14.4478 5.0985 14.3774 5.26435 14.3727C5.34648 14.3704 5.42825 14.3843 5.50501 14.4136C5.58177 14.4429 5.65201 14.487 5.71172 14.5434C6.60527 15.3864 7.72742 15.9474 8.93796 16.1562C10.1485 16.3651 11.3938 16.2126 12.5181 15.7178C13.6425 15.223 14.5961 14.4078 15.2598 13.3741C15.9236 12.3404 16.2679 11.134 16.25 9.90574C16.232 8.67744 15.8524 7.48167 15.1587 6.46785C14.465 5.45403 13.488 4.66712 12.3496 4.20543C11.2112 3.74375 9.96203 3.62777 8.75812 3.87198C7.5542 4.1162 6.44895 4.70978 5.58047 5.57856C5.30469 5.85747 5.04531 6.13169 4.79297 6.40434L6.06719 7.68091C6.1547 7.76832 6.2143 7.87972 6.23846 8.00103C6.26261 8.12233 6.25023 8.24807 6.20289 8.36234C6.15554 8.4766 6.07536 8.57425 5.97249 8.64292C5.86962 8.71159 5.74869 8.74819 5.625 8.74809H2.5C2.33424 8.74809 2.17527 8.68225 2.05806 8.56504C1.94085 8.44782 1.875 8.28885 1.875 8.12309V4.99809C1.8749 4.87441 1.91151 4.75348 1.98017 4.6506C2.04884 4.54773 2.14649 4.46755 2.26076 4.4202C2.37502 4.37286 2.50076 4.36048 2.62207 4.38464C2.74337 4.40879 2.85478 4.4684 2.94219 4.55591L3.90625 5.52153C4.15781 5.24887 4.41719 4.97466 4.69219 4.69731C5.74069 3.64702 7.07723 2.93141 8.53262 2.64105C9.98801 2.35068 11.4968 2.49863 12.8681 3.06616C14.2394 3.63369 15.4114 4.59529 16.236 5.82924C17.0605 7.06319 17.5004 8.51402 17.5 9.99809ZM10 5.62309C9.83424 5.62309 9.67527 5.68894 9.55806 5.80615C9.44085 5.92336 9.375 6.08233 9.375 6.24809V9.99809C9.37497 10.106 9.40287 10.2121 9.45599 10.306C9.50911 10.3999 9.58563 10.4785 9.67812 10.534L12.8031 12.409C12.8735 12.4513 12.9515 12.4793 13.0327 12.4914C13.1139 12.5035 13.1967 12.4995 13.2764 12.4797C13.356 12.4598 13.431 12.4244 13.497 12.3756C13.563 12.3267 13.6187 12.2653 13.6609 12.195C13.7032 12.1246 13.7312 12.0466 13.7433 11.9654C13.7554 11.8842 13.7514 11.8014 13.7316 11.7217C13.7117 11.6421 13.6763 11.5671 13.6275 11.5011C13.5786 11.4351 13.5173 11.3794 13.4469 11.3372L10.625 9.64419V6.24809C10.625 6.08233 10.5592 5.92336 10.4419 5.80615C10.3247 5.68894 10.1658 5.62309 10 5.62309Z" fill="white"/>
                </svg>
                <span className="font-medium text-white">See chat history</span>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" rx="12" fill="#FFE082"/>
                  <path d="M8.64645 9.35355L10.2929 11L8.64645 12.6464C8.45118 12.8417 8.45118 13.1583 8.64645 13.3536C8.84171 13.5488 9.15829 13.5488 9.35355 13.3536L11 11.7071L12.6464 13.3536C12.8417 13.5488 13.1583 13.5488 13.3536 13.3536C13.5488 13.1583 13.5488 12.8417 13.3536 12.6464L11.7071 11L13.3536 9.35355C13.5488 9.15829 13.5488 8.84171 13.3536 8.64645C13.1583 8.45118 12.8417 8.45118 12.6464 8.64645L11 10.2929L9.35355 8.64645C9.15829 8.45118 8.84171 8.45118 8.64645 8.64645C8.45118 8.84171 8.45118 9.15829 8.64645 9.35355Z" fill="#092A31" transform="translate(1, 1)"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {chatHistory.map((chat) => (
              <div
                key={chat.id}
                className="px-6 py-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <p className="text-sm font-medium mb-1 line-clamp-2" style={{ color: '#5C6777' }}>
                  {chat.title}
                </p>
                <p className="text-xs" style={{ color: '#76808D' }}>
                  {chat.date}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
