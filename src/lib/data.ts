// src/lib/data.ts
import type { User, Question, Answer, Attachment } from '@/types';
import { summarizeContent } from '@/ai/flows/summarize-content';

// Mock Data
let mockUsers: User[] = [
  { id: 'user1', name: 'Ana Silva', email: 'ana@example.com', avatarUrl: 'https://placehold.co/100x100.png?text=AS' },
  { id: 'user2', name: 'Bruno Costa', email: 'bruno@example.com', avatarUrl: 'https://placehold.co/100x100.png?text=BC' },
  { id: 'user3', name: 'Carla Dias', email: 'carla@example.com', avatarUrl: 'https://placehold.co/100x100.png?text=CD' },
];

let mockAttachments: Attachment[] = [
  { id: 'attach1', fileName: 'diagrama_fluxo.png', fileUrl: '#', fileType: 'image/png' },
  { id: 'attach2', fileName: 'especificacao_requisitos.pdf', fileUrl: '#', fileType: 'application/pdf' },
];

let mockAnswers: Answer[] = [
  {
    id: 'ans1',
    questionId: 'q1',
    content: 'Acredito que a melhor abordagem seria utilizar Server Components para renderizar a lista no servidor, melhorando o SEO e o LCP. Para interações client-side, como paginação ou filtros, podemos usar Client Components que fazem fetch de dados específicos.',
    authorId: 'user2',
    authorName: 'Bruno Costa',
    authorAvatarUrl: 'https://placehold.co/100x100.png?text=BC',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    attachments: [],
  },
  {
    id: 'ans2',
    questionId: 'q1',
    content: 'Concordo com o Bruno. Além disso, para a parte de resumo de conteúdo, o GenAI pode ser chamado através de um Server Action, mantendo a lógica no backend e expondo apenas o necessário para o cliente.',
    authorId: 'user3',
    authorName: 'Carla Dias',
    authorAvatarUrl: 'https://placehold.co/100x100.png?text=CD',
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    attachments: [mockAttachments[0]],
  },
  {
    id: 'ans3',
    questionId: 'q2',
    content: 'Para estilização, o Tailwind CSS junto com ShadCN UI oferece uma ótima base. Podemos customizar o tema do ShadCN para alinhar com a identidade visual da "Comunidade Conecta", focando nas cores primária (azul calmo), de fundo (cinza claro) e de destaque (laranja).',
    authorId: 'user1',
    authorName: 'Ana Silva',
    authorAvatarUrl: 'https://placehold.co/100x100.png?text=AS',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    attachments: [],
  },
];

let mockQuestions: Omit<Question, 'summaryText' | 'summaryNeeded' | 'answers' | 'authorName' | 'authorAvatarUrl'>[] = [
  {
    id: 'q1',
    title: 'Melhores práticas para renderizar listas longas em Next.js 14 com App Router?',
    description: 'Estou desenvolvendo um fórum e terei listas de perguntas que podem crescer bastante. Quais são as melhores práticas para renderizar essas listas de forma performática usando o App Router do Next.js 14? Devo considerar Server Components, Client Components, paginação, virtualização? Como o GenAI para resumo de conteúdo se encaixaria nesse cenário para otimizar a visualização inicial? Gostaria de exemplos ou direcionamentos sobre como estruturar os componentes e o fluxo de dados, especialmente pensando na interatividade e na experiência do usuário. A ideia é ter uma rolagem suave e carregamento eficiente, mesmo com centenas de itens. Qualquer sugestão sobre como lidar com anexos e a exibição de detalhes da pergunta também é bem-vinda.',
    authorId: 'user1',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    attachments: [mockAttachments[1]],
  },
  {
    id: 'q2',
    title: 'Como aplicar a identidade visual da "Comunidade Conecta" usando ShadCN UI e Tailwind CSS?',
    description: 'Preciso de ajuda para definir a melhor forma de aplicar as cores e fontes da "Comunidade Conecta" (azul calmo primário, cinza claro de fundo, laranja de destaque, fonte Inter) em um projeto Next.js que utiliza ShadCN UI e Tailwind CSS. Como configuro o globals.css e o tailwind.config.ts para que os componentes ShadCN herdem esse estilo? Existem dicas para garantir consistência visual em todos os elementos, como botões, cards e inputs?',
    authorId: 'user2',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    attachments: [],
  },
   {
    id: 'q3',
    title: 'Estratégias de autenticação de usuário em Next.js para um fórum',
    description: 'Quais são as abordagens recomendadas para implementar autenticação de usuário (registro e login) em uma aplicação Next.js como a "Comunidade Conecta"? Devo usar NextAuth.js, Firebase Authentication, ou alguma outra solução? Gostaria de entender os prós e contras de cada uma no contexto de um fórum, considerando segurança, facilidade de implementação e escalabilidade. O objetivo é permitir que usuários logados postem perguntas e respostas.',
    authorId: 'user3',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
    attachments: [],
  },
];

// Data Access Functions
export async function getUsers(): Promise<User[]> {
  return [...mockUsers];
}

export async function getUserById(id: string): Promise<User | undefined> {
  return mockUsers.find(user => user.id === id);
}

export async function getQuestions(): Promise<Question[]> {
  const questionsWithDetails = await Promise.all(
    mockQuestions.map(async (q) => {
      const author = await getUserById(q.authorId);
      const { summary, needsSummary } = await summarizeContent({ content: q.description });
      const relatedAnswers = mockAnswers.filter(ans => ans.questionId === q.id)
        .sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      const answersWithAuthorDetails = await Promise.all(relatedAnswers.map(async (ans) => {
        const answerAuthor = await getUserById(ans.authorId);
        return {
          ...ans,
          authorName: answerAuthor?.name || 'Usuário Desconhecido',
          authorAvatarUrl: answerAuthor?.avatarUrl
        }
      }));

      return {
        ...q,
        authorName: author?.name || 'Usuário Desconhecido',
        authorAvatarUrl: author?.avatarUrl,
        summaryText: summary,
        summaryNeeded: needsSummary,
        answers: answersWithAuthorDetails,
      };
    })
  );
  return questionsWithDetails.sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function getQuestionById(id: string): Promise<Question | undefined> {
  const question = mockQuestions.find(q => q.id === id);
  if (!question) return undefined;

  const author = await getUserById(question.authorId);
  // For question detail, we don't pre-generate summary with AI; it's on-demand
  // But we do fetch answers
  const relatedAnswers = mockAnswers.filter(ans => ans.questionId === question.id)
      .sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime());

  const answersWithAuthorDetails = await Promise.all(relatedAnswers.map(async (ans) => {
    const answerAuthor = await getUserById(ans.authorId);
    return {
      ...ans,
      authorName: answerAuthor?.name || 'Usuário Desconhecido',
      authorAvatarUrl: answerAuthor?.avatarUrl
    }
  }));
  
  return {
    ...question,
    authorName: author?.name || 'Usuário Desconhecido',
    authorAvatarUrl: author?.avatarUrl,
    answers: answersWithAuthorDetails,
    // summaryText and summaryNeeded can be omitted here or fetched on demand by client
  };
}

export async function createQuestion(data: { title: string; description: string; authorId: string; attachmentsInput?: string }): Promise<Question> {
  const author = await getUserById(data.authorId);
  if (!author) throw new Error("Author not found");

  const newQuestionId = `q${mockQuestions.length + 1}`;
  
  let newAttachments: Attachment[] = [];
  if (data.attachmentsInput) {
    const fileNames = data.attachmentsInput.split(',').map(name => name.trim()).filter(name => name);
    newAttachments = fileNames.map((fileName, index) => ({
      id: `attach${mockAttachments.length + index + 1}`,
      fileName,
      fileUrl: '#', // Placeholder
      fileType: 'application/octet-stream' // Placeholder
    }));
    mockAttachments.push(...newAttachments);
  }

  const newQuestion: Omit<Question, 'summaryText' | 'summaryNeeded' | 'answers' | 'authorName' | 'authorAvatarUrl'> = {
    id: newQuestionId,
    title: data.title,
    description: data.description,
    authorId: data.authorId,
    createdAt: new Date(),
    attachments: newAttachments,
  };
  mockQuestions.push(newQuestion);
  
  // Return the full Question structure, but summary would be generated on list view or on demand
  return {
    ...newQuestion,
    authorName: author.name,
    authorAvatarUrl: author.avatarUrl,
    answers: [], 
  };
}

export async function createAnswer(data: { questionId: string; content: string; authorId: string; attachmentsInput?: string }): Promise<Answer> {
  const author = await getUserById(data.authorId);
  if (!author) throw new Error("Author not found");

  const questionExists = mockQuestions.some(q => q.id === data.questionId);
  if (!questionExists) throw new Error("Question not found");
  
  let newAttachments: Attachment[] = [];
   if (data.attachmentsInput) {
    const fileNames = data.attachmentsInput.split(',').map(name => name.trim()).filter(name => name);
    newAttachments = fileNames.map((fileName, index) => ({
      id: `attach${mockAttachments.length + index + 1}`,
      fileName,
      fileUrl: '#', // Placeholder
      fileType: 'application/octet-stream' // Placeholder
    }));
    mockAttachments.push(...newAttachments);
  }

  const newAnswer: Answer = {
    id: `ans${mockAnswers.length + 1}`,
    questionId: data.questionId,
    content: data.content,
    authorId: data.authorId,
    authorName: author.name,
    authorAvatarUrl: author.avatarUrl,
    createdAt: new Date(),
    attachments: newAttachments,
  };
  mockAnswers.push(newAnswer);
  return newAnswer;
}

export function addMockUser(user: User): User {
  mockUsers.push(user);
  return user;
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  return mockUsers.find(user => user.email === email);
}
