import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";

import StudentLogin from "@/pages/student/login";
import StudentHome from "@/pages/student/home";
import StudentWelcome from "@/pages/student/welcome";
import StudentProfile from "@/pages/student/profile";
import StudentWorkout from "@/pages/student/workout";
import StudentChat from "@/pages/student/chat";

import TrainerLogin from "@/pages/trainer/login";
import TrainerRegister from "@/pages/trainer/register";
import TrainerDashboard from "@/pages/trainer/dashboard";
import TrainerStudentList from "@/pages/trainer/students/list";
import TrainerStudentDetail from "@/pages/trainer/students/detail";
import TrainerExercises from "@/pages/trainer/exercises";
import TrainerPlanDetail from "@/pages/trainer/plans/detail";
import TrainerNewPlan from "@/pages/trainer/plans/new";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function ProtectedRoute({ component: Component, role, ...rest }: any) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      setLocation(role === "trainer" ? "/t/login" : "/login");
    } else if (user.role !== role) {
      setLocation(user.role === "trainer" ? "/t/dashboard" : "/home");
    }
  }, [user, isLoading, role, setLocation]);

  if (isLoading) {
    return <div className="min-h-[100dvh] flex items-center justify-center bg-background"><div className="animate-pulse w-8 h-8 rounded-full bg-primary" /></div>;
  }

  if (!user || user.role !== role) return null;

  return <Component {...rest} />;
}

function RootRedirect() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isLoading) return;
    if (user?.role === "trainer") setLocation("/t/dashboard");
    else if (user?.role === "student") setLocation("/home");
    else setLocation("/login");
  }, [user, isLoading, setLocation]);

  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={StudentLogin} />
      <Route path="/t/login" component={TrainerLogin} />
      <Route path="/t/register" component={TrainerRegister} />
      
      {/* Student Routes */}
      <Route path="/home">{(params) => <ProtectedRoute component={StudentHome} role="student" {...params} />}</Route>
      <Route path="/welcome">{(params) => <ProtectedRoute component={StudentWelcome} role="student" {...params} />}</Route>
      <Route path="/profile">{(params) => <ProtectedRoute component={StudentProfile} role="student" {...params} />}</Route>
      <Route path="/treinos">{(params) => <ProtectedRoute component={StudentWorkout} role="student" {...params} />}</Route>
      <Route path="/chat">{(params) => <ProtectedRoute component={StudentChat} role="student" {...params} />}</Route>

      {/* Trainer Routes */}
      <Route path="/t/dashboard">{(params) => <ProtectedRoute component={TrainerDashboard} role="trainer" {...params} />}</Route>
      <Route path="/t/students">{(params) => <ProtectedRoute component={TrainerStudentList} role="trainer" {...params} />}</Route>
      <Route path="/t/students/:id">{(params) => <ProtectedRoute component={TrainerStudentDetail} role="trainer" {...params} />}</Route>
      <Route path="/t/exercises">{(params) => <ProtectedRoute component={TrainerExercises} role="trainer" {...params} />}</Route>
      <Route path="/t/plans/new">{(params) => <ProtectedRoute component={TrainerNewPlan} role="trainer" {...params} />}</Route>
      <Route path="/t/plans/:id">{(params) => <ProtectedRoute component={TrainerPlanDetail} role="trainer" {...params} />}</Route>

      <Route path="/" component={RootRedirect} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AuthProvider>
            <Router />
          </AuthProvider>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
