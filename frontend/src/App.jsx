import "./App.css";
import { AuthPage } from "./Components/AuthPage";
import { Form } from "./Components/Form";
import { Template } from "./Components/Template";
import { AuthProvider, useAuth } from "./context/context";

function AppContent() {
  const { isAuthenticated, portfolioSubmitted } = useAuth();

  return (
    <div className="w-full h-full bg-slate-900">
      {!isAuthenticated ? (
        <AuthPage />
      ) : !portfolioSubmitted ? (
        <Form />
      ) : (
        <Template />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
