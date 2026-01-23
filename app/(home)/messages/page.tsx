"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, Plus, MoreHorizontal, Send, X, Filter, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
// import { Separator } from '@/components/ui/separator';

// Mock data interfaces
interface Message {
  id: string;
  content: string;
  timestamp: string;
  sender_id: string;
  is_read: boolean;
}

interface Conversation {
  id: string;
  participant: {
    id: string;
    name: string;
    avatar?: string;
    role: "Caregiver" | "Client" | "Manager";
    status: "online" | "offline";
  };
  last_message: {
    content: string;
    timestamp: string;
    sender_id: string;
  };
  unread_count: number;
  is_read: boolean;
}

interface User {
  id: string;
  name: string;
  avatar?: string;
  role: "Caregiver" | "Client" | "Manager";
  status: "online" | "offline";
}

// Mock data
const mockConversations: Conversation[] = [
  {
    id: "1",
    participant: {
      id: "bryan-mike",
      name: "Bryan Mike",
      avatar: "/avatar.png",
      role: "Caregiver",
      status: "online",
    },
    last_message: {
      content: "Hi, there is a shift for you at Ontario",
      timestamp: "2h ago",
      sender_id: "bryan-mike",
    },
    unread_count: 1,
    is_read: false,
  },
  // Add more mock conversations as needed
];

const mockUsers: User[] = [
  {
    id: "abraham-lincoln",
    name: "Abraham Lincoln",
    avatar: "/avatar.png",
    role: "Caregiver",
    status: "online",
  },
  {
    id: "abraham-zyan",
    name: "Abraham Zyan",
    avatar: "/avatar.png",
    role: "Client",
    status: "offline",
  },
  // Add more mock users
];

const mockMessages: Message[] = [
  {
    id: "1",
    content:
      "Hello there, I assigned you to a shift in Ontario by 3pm tomorrow",
    timestamp: "7:25AM",
    sender_id: "bryan-mike",
    is_read: true,
  },
  {
    id: "2",
    content: "Yes, I am available.",
    timestamp: "7:26AM",
    sender_id: "current-user",
    is_read: true,
  },
  {
    id: "3",
    content:
      "Hello there, I assigned you to a shift in Ontario by 3pm tomorrow",
    timestamp: "7:30AM",
    sender_id: "bryan-mike",
    is_read: true,
  },
  {
    id: "4",
    content: "Yes, I am available.",
    timestamp: "7:30AM",
    sender_id: "current-user",
    is_read: true,
  },
];

type FilterType = "inbox" | "read" | "unread";

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("inbox");
  const [conversations] = useState(mockConversations);
  const [messages, setMessages] = useState(mockMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch = conv.participant.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      activeFilter === "inbox"
        ? true
        : activeFilter === "read"
        ? conv.is_read
        : activeFilter === "unread"
        ? !conv.is_read
        : true;

    return matchesSearch && matchesFilter;
  });

  const filteredUsers = mockUsers.filter((user) =>
    user.name.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      sender_id: "current-user",
      is_read: true,
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Caregiver":
        return "bg-green-100 text-green-800";
      case "Client":
        return "bg-yellow-100 text-yellow-800";
      case "Manager":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Chat List Panel */}
      <div className={`w-full md:w-1/3 bg-white border-r border-gray-200 flex flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900">Chats</h1>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNewMessageModal(true)}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <DropdownMenu
                open={showFilterMenu}
                onOpenChange={setShowFilterMenu}
              >
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                  <DropdownMenuItem onClick={() => setActiveFilter("inbox")}>
                    Inbox
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveFilter("read")}>
                    Read
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveFilter("unread")}>
                    Unread
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search messages"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200"
            />
          </div>
        </div>

        {/* Conversations List */}
        <ScrollArea className="flex-1">
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8">
              <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                  <span className="text-2xl">😔</span>
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No data yet!
              </h3>
            </div>
          ) : (
            <div className="p-2">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedConversation?.id === conversation.id
                      ? "bg-purple-50 border border-purple-200"
                      : ""
                  }`}
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={conversation.participant.avatar} />
                      <AvatarFallback className="bg-purple-100 text-primary">
                        {conversation.participant.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.participant.status === "online" && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>

                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {conversation.participant.name}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {conversation.last_message.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate mt-1">
                      {conversation.last_message.content}
                    </p>
                  </div>

                  <div className="ml-2 flex flex-col items-end gap-1">
                    {!conversation.is_read && (
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                    )}
                    {conversation.is_read && (
                      <div className="text-green-500">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Conversation View */}
      <div className={`flex-1 flex flex-col ${selectedConversation ? 'flex' : 'hidden md:flex'}`}>
        {selectedConversation ? (
          <>
            {/* Conversation Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden mr-2 -ml-2" 
                  onClick={() => setSelectedConversation(null)}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedConversation.participant.avatar} />
                  <AvatarFallback className="bg-purple-100 text-primary">
                    {selectedConversation.participant.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <h2 className="text-lg font-medium text-gray-900">
                    {selectedConversation.participant.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {selectedConversation.participant.status === "online"
                      ? "Online"
                      : "Offline"}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="text-center text-sm text-gray-500 mb-4">
                Feb 9, 2026, Wednesday
              </div>

              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender_id === "current-user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    {message.sender_id !== "current-user" && (
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage
                          src={selectedConversation.participant.avatar}
                        />
                        <AvatarFallback className="bg-purple-100 text-primary text-xs">
                          {selectedConversation.participant.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender_id === "current-user"
                          ? "bg-[#FCFCFC] text-secondary"
                          : "bg-[#FFF0FF] text-text"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs text-end mt-1 ${
                          message.sender_id === "current-user"
                            ? "text-black/400"
                            : "text-black/400"
                        }`}
                      >
                        {message.timestamp}
                      </p>
                    </div>

                    {message.sender_id === "current-user" && (
                      <Avatar className="h-8 w-8 ml-2">
                        <AvatarFallback className="bg-primary text-white text-xs">
                          Me
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                </Button>
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className=" h-8 w-8 p-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center">
                <span className="text-4xl">📧</span>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Start new conversation
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Messages sent will appear here.
            </p>
            <Button onClick={() => setShowNewMessageModal(true)} className="">
              Write a message
            </Button>
          </div>
        )}
      </div>

      {/* Start New Message Modal */}
      <Dialog open={showNewMessageModal} onOpenChange={setShowNewMessageModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Start new message</DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNewMessageModal(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            {/* Search Users */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search messages"
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Button */}
            <div className="flex justify-end">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>

            {/* Users List */}
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => {
                      // Handle user selection
                      setShowNewMessageModal(false);
                    }}
                    className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="bg-purple-100 text-primary">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="ml-3 flex-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        {user.name}
                      </h3>
                    </div>

                    <Badge
                      variant="secondary"
                      className={getRoleColor(user.role)}
                    >
                      {user.role}
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
