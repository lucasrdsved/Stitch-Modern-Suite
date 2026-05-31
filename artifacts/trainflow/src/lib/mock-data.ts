export const MOCK_STUDENT_TODAY = {
  todayWorkout: {
    id: 1,
    name: "Superior A",
    focus: "PEITO E TRÍCEPS",
    estimatedMinutes: 45,
    exercises: [
      { id: 1, name: "Supino Reto", sets: 4, reps: "12" },
      { id: 2, name: "Crucifixo", sets: 3, reps: "15" },
      { id: 3, name: "Tríceps Pulley", sets: 4, reps: "10-12" }
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
    totalSets: 18
  },
  { 
    id: 2, 
    planDayName: "Pernas Completas", 
    startedAt: new Date(Date.now() - 172800000).toISOString(), 
    finishedAt: new Date(Date.now() - 172800000 + 4500000).toISOString(),
    durationMinutes: 65, 
    totalVolumeKg: 6800,
    totalSets: 22
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
  measurements: {
    chest: 102,
    waist: 84,
    hips: 98,
    thigh: 62,
    biceps: 38
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
  { id: 1, fullName: "João Silva", email: "joao@exemplo.com", status: "active", avatarUrl: null },
  { id: 2, fullName: "Maria Santos", email: "maria@exemplo.com", status: "active", avatarUrl: null },
  { id: 3, fullName: "Pedro Oliveira", email: "pedro@exemplo.com", status: "pending", avatarUrl: null }
];

export const MOCK_STUDENT_DETAIL = {
  id: 1,
  fullName: "João Silva",
  email: "joao@exemplo.com",
  status: "active",
  avatarUrl: null,
  totalSessions: 24,
  latestAssessment: {
    bodyFatPct: 14.2
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
    otherUserName: "Carlos Mendes (Coach)", 
    otherUserAvatarUrl: null,
    lastMessage: "Como foi o treino de hoje?", 
    unreadCount: 2,
    updatedAt: new Date().toISOString() 
  }
];

export const MOCK_MESSAGES = [
  { id: 1, content: "Olá! Tudo bem?", senderId: 2, senderName: "Carlos Mendes (Coach)", sentAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 2, content: "Como foi o treino de hoje?", senderId: 2, senderName: "Carlos Mendes (Coach)", sentAt: new Date(Date.now() - 1800000).toISOString() }
];

export const MOCK_TRAINER_DASHBOARD = {
  activeStudents: 15,
  sessionsToday: 8,
  recentActivity: [
    { id: 1, studentName: "João Silva", description: "completou o treino de Costas", time: "Há 10 min" },
    { id: 2, studentName: "Maria Santos", description: "iniciou o plano Fase de Bulking", time: "Há 1 hora" }
  ]
};
