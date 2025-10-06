import { useAuth } from "../context/context";
import { TermWindow } from "./TermWindow";

export const AuthPage = () => {
  const { email, setEmail, password, setPassword, login, loading, error } =
    useAuth();

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="hidden sm:block w-4/5 h-full">
        <TermWindow>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <div className="flex flex-col items-center justify-center h-full w-full gap-4">
            <AuthContent
              email={email}
              password={password}
              setEmail={setEmail}
              setPassword={setPassword}
              login={login}
              loading={loading}
              error={error}
            />
          </div>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
        </TermWindow>
      </div>

      <div className="sm:hidden flex flex-col items-center justify-center w-full h-screen">
        <AuthContent
          email={email}
          password={password}
          setEmail={setEmail}
          setPassword={setPassword}
          login={login}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
};

const AuthContent = ({
  email,
  password,
  setEmail,
  setPassword,
  login,
  loading,
  error,
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full text-center gap-4">
      <div className="font-term md:text-3xl text-xl text-lime-50">
        guest@termfolio:~$
      </div>

      <div className="font-use md:text-8xl text-6xl text-lime-500 font-bold pb-4">
        Welcome to TermFolio!
      </div>

      <input
        className="outline-none border-none sm:bg-slate-900 bg-slate-700 rounded-md font-use text-slate-50 text-center shadow-lg md:text-2xl text-xl px-4 py-2 w-full md:max-w-sm max-w-xs"
        placeholder="Enter your email!"
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="outline-none border-none sm:bg-slate-900 bg-slate-700 rounded-md font-use text-slate-50 text-center shadow-lg md:text-2xl text-xl px-4 py-2 w-full md:max-w-sm max-w-xs"
        placeholder="Enter your password!"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <div className="text-red-500">{error}</div>}

      <button
        className="bg-lime-500 hover:bg-lime-700 text-slate-900 font-use text-2xl px-6 py-2 rounded-md mt-2 shadow-lg cursor-pointer"
        onClick={login}
        disabled={loading}
      >
        {loading ? "Loading..." : "Get Started!"}
      </button>
    </div>
  );
};
