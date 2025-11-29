import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "@/pages/Dashboard";
import NewWorkout from "@/pages/NewWorkout";
import Photos from "@/pages/Photos";
import Progress from "@/pages/Progress";
import WorkoutHistory from "@/pages/WorkoutHistory";
import Calendar from "./pages/Calendar";
import PersonalRecords from "./pages/PersonalRecords";
import Templates from "@/pages/Templates";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/workouts/new" component={NewWorkout} />
      <Route path="/photos" component={Photos} />
      <Route path="/progress" component={Progress} />
      <Route path="/workouts" component={WorkoutHistory} />
      <Route path={"/calendar"} component={Calendar} />
      <Route path={"/records"} component={PersonalRecords} />
      <Route path="/templates" component={Templates} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      {/* Forcing dark mode as per design requirements */}
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster position="top-center" />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
