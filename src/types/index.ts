
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface Attachment {
  id: string;
  fileName: string;
  fileUrl: string; // In a real app, this would be a URL to the stored file
  fileType: string; // e.g., 'image/png', 'application/pdf'
}

export interface Answer {
  id: string;
  questionId: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl?: string;
  createdAt: Date;
  attachments: Attachment[];
}

export interface Question {
  id:string;
  title: string;
  description: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl?: string;
  createdAt: Date;
  attachments: Attachment[];
  answers: Answer[];
  // For list view, summary is pre-generated
  summaryText?: string;
  summaryNeeded?: boolean;
}
