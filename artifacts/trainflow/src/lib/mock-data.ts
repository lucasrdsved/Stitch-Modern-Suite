export const MOCK_STUDENT_TODAY = {
  todayWorkout: {
    id: 1,
    name: "HIPERTROFIA A",
    focus: "PEITO E TRÍCEPS",
    estimatedMinutes: 45,
    exercises: [
      { id: 1, name: "Supino Reto", sets: 4, reps: "12", restSeconds: 90, weight: 60 },
      { id: 2, name: "Crucifixo", sets: 3, reps: "15", restSeconds: 60, weight: 15 },
      { id: 3, name: "Tríceps Pulley", sets: 4, reps: "10-12", restSeconds: 60, weight: 25 },
      { id: 4, name: "Flexão de Braço", sets: 3, reps: "Falha", restSeconds: 60, weight: 0 },
      { id: 5, name: "Tríceps Testa", sets: 3, reps: "12", restSeconds: 60, weight: 20 },
      { id: 6, name: "Supino Inclinado", sets: 4, reps: "10", restSeconds: 90, weight: 50 }
    ]
  }
};

export const MOCK_SESSIONS = [
  { 
    id: 1, 
    planDayName: "Costas e Bíceps", 
    startedAt: new Date(Date.now() - 86400000).toISOString(), 
    finishedAt: new Date(Date.now() - 86400000 + 3600000).toISOString(),
    durationMinutes: 52, 
    totalVolumeKg: 4200,
    totalSets: 18,
    status: "ONTEM"
  },
  { 
    id: 2, 
    planDayName: "Pernas Completas", 
    startedAt: new Date(Date.now() - 172800000).toISOString(), 
    finishedAt: new Date(Date.now() - 172800000 + 4500000).toISOString(),
    durationMinutes: 65, 
    totalVolumeKg: 6800,
    totalSets: 22,
    status: "24 OUT"
  },
  { 
    id: 3, 
    planDayName: "Peito e Ombros", 
    startedAt: new Date(Date.now() - 259200000).toISOString(), 
    finishedAt: new Date(Date.now() - 259200000 + 3600000).toISOString(),
    durationMinutes: 48, 
    totalVolumeKg: 3900,
    totalSets: 15,
    status: "22 OUT"
  }
];

export const MOCK_ASSESSMENT = {
  id: 1,
  weightKg: 82.5,
  bodyFatPct: 14.2,
  muscleMassKg: 40.1,
  leanMassKg: 70.8,
  somatotype: "Mesomorfo",
  createdAt: new Date().toISOString(),
  history: [
    { date: "Jan", weight: 85, fat: 16 },
    { date: "Fev", weight: 84, fat: 15.5 },
    { date: "Mar", weight: 83.5, fat: 15 },
    { date: "Abr", weight: 82.5, fat: 14.2 }
  ],
  measurements: {
    chest: 102,
    waist: 84,
    hips: 98,
    thigh: 62,
    biceps: 38,
    neck: 40,
    shoulders: 120
  }
};

export const MOCK_EXERCISES = [
  { id: 1, name: "Supino Reto", muscleGroup: "Peitoral", gifUrl: "" },
  { id: 2, name: "Agachamento Livre", muscleGroup: "Quadríceps", gifUrl: "" },
  { id: 3, name: "Levantamento Terra", muscleGroup: "Cadeia Posterior", gifUrl: "" },
  { id: 4, name: "Remada Curvada", muscleGroup: "Dorsal", gifUrl: "" },
  { id: 5, name: "Desenvolvimento Militar", muscleGroup: "Ombros", gifUrl: "" }
];

export const MOCK_STUDENTS = [
  { id: 1, fullName: "João Silva", email: "joao@exemplo.com", status: "active", avatarUrl: "https://i.pravatar.cc/150?u=joao" },
  { id: 2, fullName: "Maria Santos", email: "maria@exemplo.com", status: "active", avatarUrl: "https://i.pravatar.cc/150?u=maria" },
  { id: 3, fullName: "Pedro Oliveira", email: "pedro@exemplo.com", status: "pending", avatarUrl: null }
];

export const MOCK_STUDENT_DETAIL = {
  id: 1,
  fullName: "João Silva",
  email: "joao@exemplo.com",
  status: "active",
  avatarUrl: "https://i.pravatar.cc/150?u=joao",
  totalSessions: 24,
  latestAssessment: {
    bodyFatPct: 14.2,
    weightKg: 82.5,
    somatotype: "Mesomorfo"
  },
  activePlan: {
    id: 1,
    name: "Fase de Bulking"
  }
};

export const MOCK_PLAN = {
  id: 1,
  name: "Fase de Bulking",
  description: "Foco em ganho de massa muscular com alta intensidade.",
  studentId: 1,
  days: [
    {
      id: 1,
      name: "Segunda - Peito e Tríceps",
      exercises: [
        { id: 1, exerciseName: "Supino Reto", sets: 4, reps: "12", restSeconds: 60 },
        { id: 2, exerciseName: "Crucifixo", sets: 3, reps: "15", restSeconds: 45 }
      ]
    },
    {
      id: 2,
      name: "Terça - Costas e Bíceps",
      exercises: [
        { id: 3, exerciseName: "Puxada Alta", sets: 4, reps: "10", restSeconds: 60 }
      ]
    }
  ]
};

export const MOCK_CONVERSATIONS = [
  { 
    id: 1, 
    otherUserName: "Coach Marcos", 
    otherUserAvatarUrl: "https://i.pravatar.cc/150?u=marcos",
    lastMessage: "Foca bem na fase excêntrica do supino hoje. Vai queimar!", 
    unreadCount: 2,
    updatedAt: new Date().toISOString(),
    lastMessageTime: "10:42"
  }
];

export const MOCK_MESSAGES = [
  { id: 1, content: "Olá! Tudo bem?", senderId: 2, senderName: "Coach Marcos", sentAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 2, content: "Como foi o treino de hoje?", senderId: 2, senderName: "Coach Marcos", sentAt: new Date(Date.now() - 1800000).toISOString() },
  { id: 3, content: "Foca bem na fase excêntrica do supino hoje. Vai queimar!", senderId: 2, senderName: "Coach Marcos", sentAt: new Date(Date.now() - 600000).toISOString() }
];

export const MOCK_TRAINER_DASHBOARD = {
  activeStudents: 15,
  sessionsToday: 8,
  recentActivity: [
    { id: 1, studentName: "João Silva", description: "completou o treino de Costas", time: "Há 10 min" },
    { id: 2, studentName: "Maria Santos", description: "iniciou o plano Fase de Bulking", time: "Há 1 hora" },
    { id: 3, studentName: "Pedro Oliveira", description: "enviou uma mensagem", time: "Há 2 horas" }
  ]
};
