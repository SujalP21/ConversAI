import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import {ScaleLoader} from "react-spinners";
import { API_BASE_URL } from "./config";

function ChatWindow() {
    const {prompt, setPrompt, reply, setReply, currThreadId, setPrevChats, setNewChat, authToken, logout, triggerThreadsRefresh, theme, setTheme} = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    const getReply = async () => {
        if (!prompt.trim() || loading) return;

        setLoading(true);
        setNewChat(false);

        console.log("message ", prompt, " threadId ", currThreadId);
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify({
                message: prompt,
                threadId: currThreadId
            })
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/chat`, options);
            const res = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    logout();
                }
                throw new Error(res?.error || "Failed to fetch reply");
            }

            console.log(res);
            setReply(res.reply);
            triggerThreadsRefresh();
        } catch(err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    //Append new chat to prevChats
    useEffect(() => {
        if(prompt && reply) {
            setPrevChats(prevChats => (
                [...prevChats, {
                    role: "user",
                    content: prompt
                },{
                    role: "assistant",
                    content: reply
                }]
            ));
        }

        setPrompt("");
    }, [reply]);


    const handleProfileClick = () => {
        setIsOpen(!isOpen);
        setShowSettings(false);
    }

    const handleThemeChange = (selectedTheme) => {
        setTheme(selectedTheme);
    };

    return (
        <div className="chatWindow">
            <div className="navbar">
                <span>ConversAI <i className="fa-solid fa-chevron-down"></i></span>
                <div className="userIconDiv" onClick={handleProfileClick}>
                    <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                </div>
            </div>
            {
                isOpen && 
                <div className="dropDown">
                    <div
                        className="dropDownItem"
                        onClick={() => setShowSettings((prev) => !prev)}
                    >
                        <i className="fa-solid fa-gear"></i> Settings
                    </div>
                    <div className="dropDownItem"><i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan</div>
                    <div className="dropDownItem" onClick={logout}><i className="fa-solid fa-arrow-right-from-bracket"></i> Log out</div>
                </div>
            }
            {
                isOpen && showSettings && (
                    <div className="themePanel">
                        <p>Theme</p>
                        <div className="themeOptions">
                            <button
                                type="button"
                                className={theme === "dark" ? "themeBtn active" : "themeBtn"}
                                onClick={() => handleThemeChange("dark")}
                            >
                                Dark
                            </button>
                            <button
                                type="button"
                                className={theme === "light" ? "themeBtn active" : "themeBtn"}
                                onClick={() => handleThemeChange("light")}
                            >
                                Light
                            </button>
                        </div>
                    </div>
                )
            }
            <Chat></Chat>

            <ScaleLoader color="#fff" loading={loading}>
            </ScaleLoader>
            
            <div className="chatInput">
                <div className="inputBox">
                    <input placeholder="Ask anything"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter'? getReply() : ''}
                    >
                           
                    </input>
                    <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
                </div>
                <p className="info">
                    ConversAI can make mistakes. Check important info. See Cookie Preferences.
                </p>
            </div>
        </div>
    )
}

export default ChatWindow;