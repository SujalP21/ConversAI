import './App.css';
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import {MyContext} from "./MyContext.jsx";
import { useEffect, useState } from 'react';
import {v1 as uuidv1} from "uuid";
import Auth from "./Auth.jsx";
import { API_BASE_URL, AUTH_STORAGE_KEY, USER_STORAGE_KEY } from "./config";

const THEME_STORAGE_KEY = "conversai_theme";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]); //stores all chats of curr threads
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const [threadsRefreshTick, setThreadsRefreshTick] = useState(0);
  const [theme, setTheme] = useState(localStorage.getItem(THEME_STORAGE_KEY) || "dark");
  const [authToken, setAuthToken] = useState(localStorage.getItem(AUTH_STORAGE_KEY) || "");
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);

    if (!storedUser) return null;

    try {
      return JSON.parse(storedUser);
    } catch (err) {
      localStorage.removeItem(USER_STORAGE_KEY);
      return null;
    }
  });
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const validateStoredToken = async () => {
      if (!authToken) {
        setCheckingAuth(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || "Invalid session");
        }

        setUser(data.user);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
      } catch (err) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
        setAuthToken("");
        setUser(null);
      } finally {
        setCheckingAuth(false);
      }
    };

    validateStoredToken();
  }, [authToken]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const handleAuthSuccess = (token, authUser) => {
    setAuthToken(token);
    setUser(authUser);
    localStorage.setItem(AUTH_STORAGE_KEY, token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authUser));
    setCurrThreadId(uuidv1());
    setPrevChats([]);
    setNewChat(true);
  };

  const logout = () => {
    setAuthToken("");
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
    setAllThreads([]);
    setPrompt("");
    setReply(null);
    setNewChat(true);
  };

  const triggerThreadsRefresh = () => {
    setThreadsRefreshTick((prev) => prev + 1);
  };

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads,
    threadsRefreshTick,
    triggerThreadsRefresh,
    theme,
    setTheme,
    authToken,
    user,
    logout
  }; 

  if (checkingAuth) {
    return (
      <div className="authLoading">
        <p>Checking session...</p>
      </div>
    );
  }

  if (!authToken) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className='app'>
      <MyContext.Provider value={providerValues}>
          <Sidebar></Sidebar>
          <ChatWindow></ChatWindow>
        </MyContext.Provider>
    </div>
  )
}

export default App
