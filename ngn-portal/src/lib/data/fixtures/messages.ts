import type { ChatMessage, Conversation } from "../types";

export const CONVERSATIONS: Conversation[] = [
  {
    id: "c1",
    participantIds: ["m_sarah", "m_david"],
    lastMessageAt: "2026-05-12T10:42:00Z",
    lastMessage: "Did you get the foundational documents I sent over yesterday?",
    unreadCount: 2,
  },
  {
    id: "c2",
    participantIds: ["m_sarah", "m_kwame"],
    lastMessageAt: "2026-05-12T09:15:00Z",
    lastMessage: "I reviewed the grant proposal. Looks solid.",
    unreadCount: 0,
  },
  {
    id: "c3",
    participantIds: ["m_sarah", "m_ngozi"],
    lastMessageAt: "2026-05-11T16:20:00Z",
    lastMessage: "Thank you for sharing those insights during the panel.",
    unreadCount: 0,
  },
  {
    id: "c4",
    participantIds: ["m_sarah", "m_amina"],
    lastMessageAt: "2026-05-10T11:00:00Z",
    lastMessage: "Can we schedule a quick sync next week?",
    unreadCount: 1,
  },
];

export const CHAT_MESSAGES: ChatMessage[] = [
  {
    id: "msg1",
    conversationId: "c1",
    senderId: "m_david",
    body: "Hey Sarah, how's it going? Are we still on for the leadership sync later today?",
    sentAt: "2026-05-12T10:30:00Z",
    readAt: "2026-05-12T10:32:00Z",
  },
  {
    id: "msg2",
    conversationId: "c1",
    senderId: "m_sarah",
    body: "I'm doing well, thanks! Yes, absolutely. I've prepared the notes on the new initiative. I'll send them over now.",
    sentAt: "2026-05-12T10:35:00Z",
    readAt: "2026-05-12T10:36:00Z",
  },
  {
    id: "msg3",
    conversationId: "c1",
    senderId: "m_david",
    body: "Great! Did you get the foundational documents I sent over yesterday? We should review those first.",
    sentAt: "2026-05-12T10:42:00Z",
    readAt: null,
  },
];
