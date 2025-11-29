export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  icon: string;
}

export interface Demand {
  id: string;
  title: string;
  client: string;
  status: 'pending' | 'in-progress' | 'completed' | 'review';
  priority: 'low' | 'medium' | 'high';
  value: number;
  deadline: string;
  description: string;
  unread?: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning';
}

export interface CompletedProject {
  id: string;
  title: string;
  client: string;
  clientAvatar: string;
  description: string;
  completedDate: string;
  value: number;
  rating: number;
  feedback: string;
  technologies?: string[];
}

export const mockCertifications: Certification[] = [
  {
    id: '1',
    name: 'React Advanced',
    issuer: 'Meta',
    date: '2024-01',
    icon: '⚛️'
  },
  {
    id: '2',
    name: 'AWS Solutions Architect',
    issuer: 'Amazon',
    date: '2023-11',
    icon: '☁️'
  },
  {
    id: '3',
    name: 'TypeScript Expert',
    issuer: 'Microsoft',
    date: '2023-09',
    icon: '📘'
  }
];

export const mockDemands: Demand[] = [
  {
    id: '1',
    title: 'Desenvolvimento de Dashboard Analytics',
    client: 'TechCorp LTDA',
    status: 'in-progress',
    priority: 'high',
    value: 3500,
    deadline: '2024-02-15',
    description: 'Criar dashboard completo com visualização de dados em tempo real',
    unread: true
  },
  {
    id: '2',
    title: 'API REST para E-commerce',
    client: 'ShopNow Inc',
    status: 'review',
    priority: 'medium',
    value: 2800,
    deadline: '2024-02-10',
    description: 'Desenvolvimento de API RESTful com integração de pagamentos'
  },
  {
    id: '3',
    title: 'Landing Page Responsiva',
    client: 'StartupXYZ',
    status: 'pending',
    priority: 'low',
    value: 1200,
    deadline: '2024-02-20',
    description: 'Landing page moderna e responsiva com animações'
  },
  {
    id: '4',
    title: 'Migração de Sistema Legacy',
    client: 'Enterprise Solutions',
    status: 'completed',
    priority: 'high',
    value: 8500,
    deadline: '2024-01-30',
    description: 'Migração completa de sistema legado para arquitetura moderna'
  },
  {
    id: '5',
    title: 'App Mobile React Native',
    client: 'FinTech Brasil',
    status: 'in-progress',
    priority: 'high',
    value: 12000,
    deadline: '2024-03-01',
    description: 'Aplicativo mobile completo para gestão financeira',
    unread: true
  }
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Nova demanda disponível',
    message: 'Uma nova demanda de alta prioridade foi adicionada',
    time: '2 min atrás',
    read: false,
    type: 'info'
  },
  {
    id: '2',
    title: 'Pagamento aprovado',
    message: 'Seu pagamento de R$ 2.800,00 foi aprovado',
    time: '1 hora atrás',
    read: false,
    type: 'success'
  },
  {
    id: '3',
    title: 'Prazo próximo',
    message: 'A demanda "Dashboard Analytics" vence em 3 dias',
    time: '2 horas atrás',
    read: true,
    type: 'warning'
  }
];

export const mockTodayOffers = '24';

export const mockReviews = [
  {
    id: '1',
    author: 'Carlos Mendes',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
    rating: 5,
    date: '2 semanas atrás',
    comment: 'Excelente profissional! Entregou o projeto antes do prazo e com qualidade excepcional. Recomendo muito!',
    helpful: 8
  },
  {
    id: '2',
    author: 'Ana Paula Silva',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
    rating: 5,
    date: '1 mês atrás',
    comment: 'Muito profissional e atencioso. Conseguiu entender exatamente o que eu precisava e implementou perfeitamente.',
    helpful: 5
  },
  {
    id: '3',
    author: 'Roberto Santos',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto',
    rating: 4,
    date: '2 meses atrás',
    comment: 'Bom trabalho no geral. Houve um pequeno atraso na entrega, mas a qualidade do código compensou.',
    helpful: 3
  }
];

export const mockCompletedProjects: CompletedProject[] = [
  {
    id: '1',
    title: 'Migração de Sistema Legacy',
    client: 'Enterprise Solutions',
    clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Enterprise',
    description: 'Migração completa de sistema legado em Java para arquitetura moderna em Node.js e React. Incluiu refatoração de toda a base de código, implementação de testes automatizados e migração de banco de dados.',
    completedDate: '30/01/2024',
    value: 8500,
    rating: 5,
    feedback: 'Trabalho impecável! A migração foi feita com zero downtime e a nova arquitetura está funcionando perfeitamente. Profissionalismo excepcional.',
    technologies: ['Node.js', 'React', 'PostgreSQL', 'Docker', 'AWS']
  },
  {
    id: '2',
    title: 'E-commerce Completo',
    client: 'Fashion Store Brasil',
    clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fashion',
    description: 'Desenvolvimento de plataforma e-commerce completa com carrinho, pagamento integrado, painel administrativo e sistema de gestão de estoque.',
    completedDate: '15/01/2024',
    value: 15000,
    rating: 5,
    feedback: 'Superou nossas expectativas! O sistema está rodando perfeitamente e já aumentamos nossas vendas em 40%. Muito obrigado pelo excelente trabalho!',
    technologies: ['Next.js', 'Stripe', 'Prisma', 'TypeScript', 'Tailwind']
  },
  {
    id: '3',
    title: 'App Mobile de Delivery',
    client: 'FoodExpress LTDA',
    clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Food',
    description: 'Aplicativo mobile completo para iOS e Android com sistema de pedidos em tempo real, rastreamento de entrega e pagamento integrado.',
    completedDate: '28/12/2023',
    value: 18500,
    rating: 5,
    feedback: 'O melhor desenvolvedor que já trabalhamos! App ficou incrível, super fluido e nossos clientes adoraram a interface. Já estamos planejando novos projetos juntos.',
    technologies: ['React Native', 'Firebase', 'Google Maps API', 'Push Notifications']
  },
  {
    id: '4',
    title: 'Dashboard Analytics',
    client: 'DataCorp Analytics',
    clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Data',
    description: 'Dashboard interativo com visualização de dados em tempo real, gráficos customizados e relatórios automáticos para análise de métricas de negócio.',
    completedDate: '10/12/2023',
    value: 6500,
    rating: 4,
    feedback: 'Ótimo trabalho! O dashboard ficou muito bom e atende todas as nossas necessidades. Houve um pequeno atraso, mas a qualidade final compensou.',
    technologies: ['React', 'D3.js', 'Chart.js', 'WebSocket', 'Redis']
  },
  {
    id: '5',
    title: 'Sistema de CRM',
    client: 'VendasPro Consultoria',
    clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vendas',
    description: 'Sistema completo de CRM com gestão de leads, pipeline de vendas, automação de follow-ups e integração com WhatsApp e Email.',
    completedDate: '20/11/2023',
    value: 12000,
    rating: 5,
    feedback: 'Sistema transformou nossa operação de vendas! Aumentamos a produtividade da equipe em 60%. Desenvolvedor muito competente e sempre disponível.',
    technologies: ['Vue.js', 'Node.js', 'MongoDB', 'WhatsApp API', 'Bull Queue']
  },
  {
    id: '6',
    title: 'Portal Educacional',
    client: 'EduTech Brasil',
    clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Edu',
    description: 'Plataforma educacional com área de alunos, professores, videoaulas, exercícios interativos e sistema de gamificação.',
    completedDate: '05/11/2023',
    value: 22000,
    rating: 5,
    feedback: 'Projeto gigante entregue com perfeição! A plataforma está ajudando milhares de alunos. Comunicação excelente durante todo o desenvolvimento.',
    technologies: ['Next.js', 'Supabase', 'Video.js', 'Mux', 'OpenAI API']
  },
  {
    id: '7',
    title: 'API REST Bancária',
    client: 'FinTech Inovações',
    clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fin',
    description: 'API REST completa para sistema bancário com autenticação JWT, transações, extratos, PIX e integração com sistemas legados.',
    completedDate: '18/10/2023',
    value: 16000,
    rating: 5,
    feedback: 'Código limpo, bem documentado e com excelente cobertura de testes. A API está rodando sem problemas em produção. Profissional de alto nível!',
    technologies: ['Node.js', 'Express', 'PostgreSQL', 'JWT', 'Jest', 'Swagger']
  },
  {
    id: '8',
    title: 'Site Institucional',
    client: 'Advocacia Silva & Santos',
    clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Adv',
    description: 'Website institucional moderno e responsivo com blog integrado, formulário de contato e otimização para SEO.',
    completedDate: '02/10/2023',
    value: 3500,
    rating: 4,
    feedback: 'Site ficou muito bonito e profissional. Já estamos recebendo mais contatos de clientes. Pequenos ajustes foram necessários após a entrega.',
    technologies: ['Next.js', 'Sanity CMS', 'Tailwind', 'Vercel', 'Google Analytics']
  }
];
