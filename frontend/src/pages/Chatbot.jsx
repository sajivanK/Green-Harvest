import React, { useState, useEffect, useRef } from "react";
import axiosApi from "../config/axiosConfig";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const ChatBot = () => {
    const [message, setMessage] = useState(""); 
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [listening, setListening] = useState(false);
    const [userId, setUserId] = useState(null);
    const [isSpeaking, setIsSpeaking] = useState(false); // ✅ Track speaking state
    const speechRef = useRef(null); // ✅ Store the speech utterance

    // ✅ Voice Input (Speech-to-Text)
    const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

    // ✅ Function to remove HTML tags from AI response
    const stripHTML = (text) => {
        return text.replace(/<\/?[^>]+(>|$)/g, "");
    };

    // ✅ Fetch User ID on Load
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axiosApi.get("/api/auth/check", { withCredentials: true });
                if (response.data.success && response.data.user) {
                    console.log("✅ User ID:", response.data.user._id);
                    setUserId(response.data.user._id);
                    fetchChatHistory();
                } else {
                    console.error("⚠️ User ID not found in response.");
                }
            } catch (error) {
                console.error("⚠️ Error fetching userId:", error);
            }
        };

        fetchUserData();
    }, []);

    // ✅ Fetch Chat History
    const fetchChatHistory = async () => {
        try {
            const response = await axiosApi.get("/api/chatbot/history", { withCredentials: true });

            if (response.data.success) {
                console.log("✅ Chat History Loaded:", response.data.chats);
                setMessages(response.data.chats);
            } else {
                console.error("⚠️ Failed to fetch chat history:", response.data.message);
            }
        } catch (error) {
            console.error("⚠️ Error fetching chat history:", error);
        }
    };

    // ✅ Send Message to AI
    const sendMessage = async () => {
        if (!message.trim()) return;
        if (!userId) {
            console.error("⚠️ User ID not available. Cannot send message.");
            return;
        }

        setLoading(true);
        setMessages((prev) => [...prev, { message, reply: "..." }]);

        try {
            const response = await axiosApi.post(
                "/api/chatbot/ask",
                { message },
                { withCredentials: true }
            );

            if (response.data.success) {
                console.log("✅ AI Response:", response.data.reply);
                let reply = stripHTML(response.data.reply);

                setMessages((prev) => [...prev.slice(0, -1), { message, reply }]);

                // ✅ Read AI response aloud
                speakText(reply);
            }
        } catch (error) {
            console.error("⚠️ Error sending message:", error.response?.data || error.message);
        }

        setMessage("");
        setLoading(false);
    };

    // ✅ Reset Chat
    const resetChat = async () => {
        try {
            await axiosApi.delete("/api/chatbot/history", { withCredentials: true });
            setMessages([]);
            console.log("✅ Chat history cleared.");
        } catch (error) {
            console.error("⚠️ Error clearing chat history:", error);
        }
    };

    // ✅ Voice Output (Text-to-Speech)
    // const speakText = (text) => {
    //     if ("speechSynthesis" in window) {
    //         window.speechSynthesis.cancel(); // Cancel any previous speech

    //         const utterance = new SpeechSynthesisUtterance(text);
    //         utterance.lang = "en-IN";
    //         utterance.rate = 0.8;
    //         utterance.volume = 1;

    //         utterance.onstart = () => setIsSpeaking(true);
    //         utterance.onend = () => setIsSpeaking(false);
    //         utterance.onerror = () => setIsSpeaking(false);

    //         speechRef.current = utterance;
    //         window.speechSynthesis.speak(utterance);
    //     } else {
    //         console.error("❌ Speech synthesis not supported in this browser.");
    //     }
    // };

    const speakText = (text) => {
        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
    
            // ✅ Detect if the text is Tamil
            const isTamil = /[\u0B80-\u0BFF]/.test(text);
    
            if (isTamil) {
                console.log("🛑 Tamil detected. Skipping voice output. Showing text only.");
                return; // ❗ Don't speak Tamil text
            }
    
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = "en-IN"; // English voice
            utterance.rate = 0.9;
            utterance.volume = 1;
    
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);
    
            speechRef.current = utterance;
            window.speechSynthesis.speak(utterance);
        } else {
            console.error("❌ Speech synthesis not supported in this browser.");
        }
    };
    
    
    

    // ✅ Stop Voice Output
    const stopSpeaking = () => {
        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };

    // ✅ Toggle Voice Input
    const toggleListening = () => {
        if (!browserSupportsSpeechRecognition) {
            alert("⚠️ Speech recognition is not supported in your browser.");
            return;
        }

        if (listening) {
            SpeechRecognition.stopListening();
            setListening(false);
            setMessage(transcript);
        } else {
            resetTranscript();
            SpeechRecognition.startListening({ continuous: false, language: "en-IN" });
            setListening(true);
        }
    };

    return (
        <div className="flex-1 overflow-auto relative z-10 max-w-4xl mx-auto py-50 px-4 lg:px-8">
            <div className="max-w-lg mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-4">GreenBuddy AI</h2>

                <div className="h-64 overflow-auto bg-gray-700 p-4 rounded-lg">
                    {messages.map((msg, index) => (
                        <div key={index} className={`p-2 rounded ${msg.reply ? "text-left text-blue-400" : "text-right text-green-400"}`}>
                            {msg.message}
                            {msg.reply && <div className="text-gray-300 mt-1">{msg.reply}</div>}
                        </div>
                    ))}
                </div>

                {transcript && (
                    <p className="text-white mt-2">🎤 Voice Input: {transcript}</p>
                )}

                <div className="flex gap-2 mt-4">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full p-2 bg-gray-700 text-white rounded-lg"
                        placeholder="Ask a question..."
                    />
                    <button onClick={sendMessage} className="p-2 bg-green-500 text-white rounded-lg">
                        {loading ? "..." : "Send"}
                    </button>
                </div>

                <div className="flex justify-between mt-2 flex-wrap gap-2">
                    <button onClick={toggleListening} className="p-2 bg-blue-500 text-white rounded-lg">
                        {listening ? "Stop Listening" : "🎤 Speak"}
                    </button>
                    <button onClick={resetTranscript} className="p-2 bg-yellow-500 text-white rounded-lg">
                        Reset Voice
                    </button>
                    <button onClick={resetChat} className="p-2 bg-red-500 text-white rounded-lg">
                        🗑️ Reset Chat
                    </button>
                    {isSpeaking && (
                        <button onClick={stopSpeaking} className="p-2 bg-purple-600 text-white rounded-lg">
                            🔇 Stop Voice
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatBot;
