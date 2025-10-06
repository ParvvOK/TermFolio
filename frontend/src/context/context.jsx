import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [portfolioSubmitted, setPortfolioSubmitted] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const login = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("https://termfolio-s914.onrender.com/api/auth", {
        email,
        password,
      });

      const { user, token } = response.data;
      setUser(user);
      setToken(token);

      console.log("Login successful:", user, token);
    } catch (err) {
      console.error(err);
      setError("Failed to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setEmail("");
    setPassword("");
    setPortfolioSubmitted(false);
    localStorage.removeItem("token");
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        email,
        setEmail,
        password,
        setPassword,
        user,
        token,
        isAuthenticated,
        portfolioSubmitted,
        setPortfolioSubmitted,
        login,
        logout,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
