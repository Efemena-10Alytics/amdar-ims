"use client";

import React, { useState } from "react";

interface ChatInputAreaProps {
  onSubmit: (message: string) => void;
}

export const ChatInputArea: React.FC<ChatInputAreaProps> = ({ onSubmit }) => {
  const [message, setMessage] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSubmit(message);
      setMessage("");
    }
  };

  return (
    <div className="w-full px-4 pb-6">
      <div className="max-w-6xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-full p-2 lg:p-4 flex items-center justify-center">
              <button type="button" className="shrink-0">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="40" height="40" rx="20" fill="#B6CFD4" />
                  <path
                    d="M29 20C29 20.1989 28.921 20.3897 28.7803 20.5303C28.6397 20.671 28.4489 20.75 28.25 20.75H20.75V28.25C20.75 28.4489 20.671 28.6397 20.5303 28.7803C20.3897 28.921 20.1989 29 20 29C19.8011 29 19.6103 28.921 19.4697 28.7803C19.329 28.6397 19.25 28.4489 19.25 28.25V20.75H11.75C11.5511 20.75 11.3603 20.671 11.2197 20.5303C11.079 20.3897 11 20.1989 11 20C11 19.8011 11.079 19.6103 11.2197 19.4697C11.3603 19.329 11.5511 19.25 11.75 19.25H19.25V11.75C19.25 11.5511 19.329 11.3603 19.4697 11.2197C19.6103 11.079 19.8011 11 20 11C20.1989 11 20.3897 11.079 20.5303 11.2197C20.671 11.3603 20.75 11.5511 20.75 11.75V19.25H28.25C28.4489 19.25 28.6397 19.329 28.7803 19.4697C28.921 19.6103 29 19.8011 29 20Z"
                    fill="#092A31"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1 relative flex items-center gap-3 px-3 lg:px-6 py-2 lg:py-4 rounded-3xl bg-white">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type here..."
                className="flex-1 resize-none outline-none bg-transparent md:h-12 h-8"
                style={{ color: "#0C3640" }}
                rows={1}
              />
              <button type="button" className="shrink-0">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="40" height="40" rx="20" fill="#B6CFD4" />
                  <path
                    d="M15.5 20V14C15.5 12.8065 15.9741 11.6619 16.818 10.818C17.6619 9.97411 18.8065 9.5 20 9.5C21.1935 9.5 22.3381 9.97411 23.182 10.818C24.0259 11.6619 24.5 12.8065 24.5 14V20C24.5 21.1935 24.0259 22.3381 23.182 23.182C22.3381 24.0259 21.1935 24.5 20 24.5C18.8065 24.5 17.6619 24.0259 16.818 23.182C15.9741 22.3381 15.5 21.1935 15.5 20ZM27.5 20C27.5 19.8011 27.421 19.6103 27.2803 19.4697C27.1397 19.329 26.9489 19.25 26.75 19.25C26.5511 19.25 26.3603 19.329 26.2197 19.4697C26.079 19.6103 26 19.8011 26 20C26 21.5913 25.3679 23.1174 24.2426 24.2426C23.1174 25.3679 21.5913 26 20 26C18.4087 26 16.8826 25.3679 15.7574 24.2426C14.6321 23.1174 14 21.5913 14 20C14 19.8011 13.921 19.6103 13.7803 19.4697C13.6397 19.329 13.4489 19.25 13.25 19.25C13.0511 19.25 12.8603 19.329 12.7197 19.4697C12.579 19.6103 12.5 19.8011 12.5 20C12.5023 21.8586 13.1937 23.6504 14.4405 25.0288C15.6873 26.4072 17.4009 27.2743 19.25 27.4625V30.5C19.25 30.6989 19.329 30.8897 19.4697 31.0303C19.6103 31.171 19.8011 31.25 20 31.25C20.1989 31.25 20.3897 31.171 20.5303 31.0303C20.671 30.8897 20.75 30.6989 20.75 30.5V27.4625C22.5991 27.2743 24.3127 26.4072 25.5595 25.0288C26.8063 23.6504 27.4977 21.8586 27.5 20Z"
                    fill="#092A31"
                  />
                </svg>
              </button>
            </div>

            <div className="bg-white rounded-full p-2 lg:p-4 flex items-center justify-center">
              <button
                type="submit"
                className="shrink-0 rounded-full transition-all duration-200"
                style={{
                  backgroundColor: isHovered ? "#B6CFD4" : "transparent",
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    width="40"
                    height="40"
                    rx="20"
                    fill={isHovered ? "#FFE082" : "#156374"}
                  />
                  <path
                    d="M27.281 19.0312C27.2114 19.1009 27.1287 19.1563 27.0376 19.194C26.9466 19.2318 26.849 19.2512 26.7504 19.2512C26.6519 19.2512 26.5543 19.2318 26.4632 19.194C26.3722 19.1563 26.2894 19.1009 26.2198 19.0312L20.7504 13.5609V28.2506C20.7504 28.4495 20.6714 28.6403 20.5307 28.7809C20.3901 28.9216 20.1993 29.0006 20.0004 29.0006C19.8015 29.0006 19.6107 28.9216 19.4701 28.7809C19.3294 28.6403 19.2504 28.4495 19.2504 28.2506V13.5609L13.781 19.0312C13.6403 19.1719 13.4494 19.251 13.2504 19.251C13.0514 19.251 12.8605 19.1719 12.7198 19.0312C12.5791 18.8905 12.5 18.6996 12.5 18.5006C12.5 18.3016 12.5791 18.1107 12.7198 17.97L19.4698 11.22C19.5394 11.1502 19.6222 11.0949 19.7132 11.0572C19.8043 11.0194 19.9019 11 20.0004 11C20.099 11 20.1966 11.0194 20.2876 11.0572C20.3787 11.0949 20.4614 11.1502 20.531 11.22L27.281 17.97C27.3508 18.0396 27.4061 18.1223 27.4438 18.2134C27.4816 18.3044 27.501 18.402 27.501 18.5006C27.501 18.5992 27.4816 18.6967 27.4438 18.7878C27.4061 18.8788 27.3508 18.9616 27.281 19.0312Z"
                    fill={isHovered ? "#156374" : "#FFE082"}
                  />
                </svg>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
