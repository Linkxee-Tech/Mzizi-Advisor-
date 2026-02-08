import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { BusinessProfile, Message, AdviceCardData, ChatSession, Tool } from '../types';
import { generateAdvisorResponse } from '../services/geminiService';
import { getTools } from '../services/api';
import AdviceCard from '../components/AdviceCard';
import PricingCard from '../components/PricingCard';
import Logo from '../components/Logo';
import {
    Send, Mic, User, Bot, Clock, Plus,
    MoreVertical, Edit2, Trash2, GitBranch,
    X, Save, MessageSquare, Menu, ChevronLeft, Briefcase
} from 'lucide-react';

interface ChatProps {
    profile: BusinessProfile;
}

const Chat: React.FC<ChatProps> = ({ profile }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const context = searchParams.get('context');
    const promptParam = searchParams.get('prompt'); // New: Get prompt from URL

    // -- State --
    const [tools, setTools] = useState<Tool[]>([]);
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    const toolContext = context ? tools.find(t => t.id === context) : null;

    // Edit State
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState('');

    const scrollRef = useRef<HTMLDivElement>(null);
    // Track if we have already handled the auto-prompt to prevent loops
    const hasAutoPrompted = useRef(false);

    // -- Helpers --

    const createNewSession = (initialMessages: Message[] = [], title: string = 'New Conversation'): ChatSession => {
        return {
            id: Date.now().toString(),
            title,
            messages: initialMessages,
            createdAt: Date.now(),
            lastModified: Date.now(),
        };
    };

    const getCurrentSession = () => sessions.find(s => s.id === currentSessionId);

    // -- Lifecycle & Storage --

    // Fetch Tools
    useEffect(() => {
        const fetchTools = async () => {
            try {
                const data = await getTools();
                setTools(data);
            } catch (error) {
                console.error("Failed to fetch tools", error);
            }
        };
        fetchTools();
    }, []);

    // Load Sessions
    useEffect(() => {
        const storageKey = `mzizi_sessions_${profile.id}`;
        const savedSessions = localStorage.getItem(storageKey);
        const legacyChat = localStorage.getItem(`mzizi_chat_${profile.id}`);

        if (savedSessions) {
            try {
                const parsed: ChatSession[] = JSON.parse(savedSessions);
                setSessions(parsed);
                if (parsed.length > 0) {
                    // If no specific context/prompt, load most recent
                    if (!context && !promptParam) {
                        setCurrentSessionId(parsed[0].id);
                    }
                }
            } catch (e) { console.error("Error parsing sessions", e); }
        } else if (legacyChat) {
            // Migrate legacy single chat to sessions
            try {
                const legacyMessages: Message[] = JSON.parse(legacyChat);
                const migratedSession = createNewSession(legacyMessages, 'Previous Conversation');
                setSessions([migratedSession]);
                setCurrentSessionId(migratedSession.id);
                localStorage.setItem(storageKey, JSON.stringify([migratedSession]));
                localStorage.removeItem(`mzizi_chat_${profile.id}`); // Clean up
            } catch (e) { console.error("Error migrating legacy chat", e); }
        }
    }, [profile.id]);

    // Save Sessions
    useEffect(() => {
        if (sessions.length > 0) {
            // Sort sessions by lastModified desc
            const sorted = [...sessions].sort((a, b) => b.lastModified - a.lastModified);
            localStorage.setItem(`mzizi_sessions_${profile.id}`, JSON.stringify(sorted));
        } else {
            // If we deleted everything, clear storage
            if (currentSessionId === null && sessions.length === 0) {
                localStorage.removeItem(`mzizi_sessions_${profile.id}`);
            }
        }
    }, [sessions, profile.id, currentSessionId]);

    // Scroll to bottom on message add
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [sessions, currentSessionId, loading]);

    // Initialize if no session exists or context/prompt requested
    useEffect(() => {
        if (loading) return;
        // Wait for tools to be loaded if context is present, to ensure we get correct title/message
        if (context && tools.length === 0) return;

        if (promptParam && !hasAutoPrompted.current) {
            // Handle Quick Ask from Dashboard
            hasAutoPrompted.current = true;
            handleNewChat(promptParam); // Start new chat WITH the user prompt auto-filled/sent
        } else if (context) {
            // Handle Tool Context
            const curr = getCurrentSession();
            // If current session is undefined or has user messages, start fresh for the tool context
            if (!curr || (curr.messages.length > 1)) {
                const recentSession = sessions[0];
                const isRecentContext = recentSession?.messages[0]?.text.includes(context);
                if (!isRecentContext) {
                    handleNewChat();
                } else if (currentSessionId !== recentSession.id) {
                    setCurrentSessionId(recentSession.id);
                }
            }
        } else if (sessions.length === 0 && !currentSessionId) {
            handleNewChat();
        }
    }, [context, promptParam, sessions.length, tools.length]); // Added tools.length dependency

    // -- Actions --

    const handleNewChat = (autoUserMessage?: string) => {
        let initialMsg = '';
        let title = 'New Chat';

        if (context) {
            const tool = tools.find(t => t.id === context);
            if (tool) {
                initialMsg = `Welcome to the ${tool.title}. I can help you with ${tool.desc.toLowerCase()}. \n\nFor example, tell me your costs and I can help you set a price!`;
                title = tool.title;
            } else {
                // Fallback if tool not found or not loaded yet (though useEffect guard helps)
                initialMsg = `Hello! How can I help you with this tool?`;
            }
        } else {
            initialMsg = `Hello ${profile.ownerName}! What's on your mind regarding ${profile.businessName} today?`;
        }

        const sysMsg: Message = {
            id: 'init-' + Date.now(),
            role: 'model',
            text: initialMsg,
            timestamp: Date.now()
        };

        const newSession = createNewSession([sysMsg], title);
        setSessions(prev => [newSession, ...prev]);
        setCurrentSessionId(newSession.id);
        setShowHistory(false);

        // If we have an auto-message (from dashboard), set it to input so user just hits send
        // Or we could auto-send. Let's pre-fill input for safer UX so user can verify.
        if (autoUserMessage) {
            setInput(autoUserMessage);
            // Optional: Trigger auto-send after a small delay if desired, but filling input is safe.
        }
    };

    const handleSendMessage = async () => {
        if (!input.trim() || !currentSessionId) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            text: input,
            timestamp: Date.now()
        };

        // Optimistic Update
        updateSessionMessages(currentSessionId, (msgs) => [...msgs, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const curr = getCurrentSession();
            const historyContext = (curr?.messages || []).concat(userMsg).slice(-10).map(m => ({
                role: m.role,
                parts: [{ text: m.text }]
            }));

            const response = await generateAdvisorResponse(userMsg.text, profile, historyContext);

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: response.text,
                isStructured: !!response.structured,
                structuredData: response.structured,
                isPricing: !!response.pricing,
                pricingData: response.pricing,
                timestamp: Date.now()
            };

            updateSessionMessages(currentSessionId, (msgs) => {
                // Update Title if it's the first user interaction
                const userMessages = msgs.filter(m => m.role === 'user');
                if (userMessages.length === 1) {
                    const newTitle = userMsg.text.slice(0, 30) + (userMsg.text.length > 30 ? '...' : '');
                    updateSessionTitle(currentSessionId, newTitle);
                }
                return [...msgs, aiMsg];
            });

        } catch (error) {
            console.error(error);
            const errorMsg: Message = {
                id: Date.now().toString(),
                role: 'model',
                text: "I'm having trouble connecting right now. Please try again.",
                timestamp: Date.now()
            };
            updateSessionMessages(currentSessionId, (msgs) => [...msgs, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    // -- State Updaters --

    const updateSessionMessages = (sessionId: string, updateFn: (msgs: Message[]) => Message[]) => {
        setSessions(prev => prev.map(s => {
            if (s.id === sessionId) {
                return { ...s, messages: updateFn(s.messages), lastModified: Date.now() };
            }
            return s;
        }));
    };

    const updateSessionTitle = (sessionId: string, title: string) => {
        setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, title } : s));
    };

    // -- Message Operations --

    const deleteMessage = (msgId: string) => {
        if (!currentSessionId) return;
        updateSessionMessages(currentSessionId, (msgs) => msgs.filter(m => m.id !== msgId));
    };

    const startEditing = (msg: Message) => {
        setEditingMessageId(msg.id);
        setEditContent(msg.text);
    };

    const saveEdit = () => {
        if (!currentSessionId || !editingMessageId) return;
        updateSessionMessages(currentSessionId, (msgs) => msgs.map(m => {
            if (m.id === editingMessageId) {
                return { ...m, text: editContent };
            }
            return m;
        }));
        setEditingMessageId(null);
        setEditContent('');
    };

    const branchChat = (msgId: string) => {
        const curr = getCurrentSession();
        if (!curr) return;

        const msgIndex = curr.messages.findIndex(m => m.id === msgId);
        if (msgIndex === -1) return;

        // Slice messages up to and including the branched message
        const branchedMessages = curr.messages.slice(0, msgIndex + 1);

        const newSession = createNewSession(branchedMessages, `Branch: ${curr.title}`);
        setSessions(prev => [newSession, ...prev]);
        setCurrentSessionId(newSession.id);

        // Optional: Add system note about branch
        const sysNote: Message = {
            id: 'sys-' + Date.now(),
            role: 'model',
            text: '--- Conversation branched here ---',
            timestamp: Date.now()
        };
        updateSessionMessages(newSession.id, (msgs) => [...msgs, sysNote]);
    };

    const deleteSession = (sessionId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const confirm = window.confirm("Delete this chat?");
        if (!confirm) return;

        const remaining = sessions.filter(s => s.id !== sessionId);
        setSessions(remaining);

        if (currentSessionId === sessionId) {
            if (remaining.length > 0) {
                setCurrentSessionId(remaining[0].id);
            } else {
                setCurrentSessionId(null); // Will trigger new chat creation via useEffect
            }
        }
    };

    // -- Render Helpers --

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const suggestions = context === 'pricing' ? [
        "I need to price a new cake",
        "What margin should I target?",
        "Calculate price for 50kg bag"
    ] : context === 'compliance' ? [
        "How do I register in " + profile.country + "?",
        "What taxes do I need to pay?",
        "Do I need a business name?"
    ] : [
        "How do I price my product?",
        "Ways to get more customers?",
        "Explain cash flow to me",
    ];

    const activeMessages = getCurrentSession()?.messages || [];

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-slate-900 transition-colors duration-300 relative overflow-hidden">

            {/* --- History Sidebar Overlay --- */}
            {showHistory && (
                <div className="absolute inset-0 z-50 flex">
                    <div className="w-72 bg-white dark:bg-gray-800 h-full shadow-2xl flex flex-col border-r border-gray-100 dark:border-gray-700 animate-fade-in-up">
                        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
                            <h2 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                <Clock className="w-4 h-4" /> History
                            </h2>
                            <button onClick={() => setShowHistory(false)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-500">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-4">
                            <button
                                onClick={() => handleNewChat()}
                                className="w-full py-3 px-4 bg-green-800 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-green-900 transition-all shadow-lg shadow-green-900/20"
                            >
                                <Plus className="w-5 h-5" /> Start New Chat
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-2 space-y-1">
                            {sessions.map(session => (
                                <div
                                    key={session.id}
                                    onClick={() => {
                                        setCurrentSessionId(session.id);
                                        setShowHistory(false);
                                    }}
                                    className={`group flex items-center gap-3 p-3 mx-2 rounded-xl cursor-pointer transition-all border border-transparent ${currentSessionId === session.id
                                        ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800'
                                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                                        }`}
                                >
                                    <MessageSquare className="w-4 h-4 shrink-0 opacity-70" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{session.title}</p>
                                        <p className="text-[10px] opacity-60">
                                            {new Date(session.lastModified).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <button
                                        onClick={(e) => deleteSession(session.id, e)}
                                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-500 transition-opacity"
                                        title="Delete Chat"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            {sessions.length === 0 && (
                                <p className="text-center text-gray-400 text-sm py-10">No history yet.</p>
                            )}
                        </div>
                    </div>
                    <div className="flex-1 bg-black/20 backdrop-blur-sm" onClick={() => setShowHistory(false)} />
                </div>
            )}

            {/* --- Main Chat Header --- */}
            <div className="bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between sticky top-0 z-10 shadow-sm transition-colors duration-300">
                <div className="flex items-center gap-3">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
                        title="Go Back"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <button
                        onClick={() => setShowHistory(true)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors flex items-center gap-2"
                        title="View History"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="scale-75 origin-left hidden sm:block border-l border-gray-200 dark:border-gray-700 pl-3">
                        <Logo />
                    </div>
                    <div className="flex flex-col sm:hidden">
                        <span className="font-bold text-gray-900 dark:text-white text-sm">Mzizi</span>
                    </div>

                    {toolContext && (
                        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-50 dark:bg-green-900/30 rounded-full text-green-700 dark:text-green-300 border border-green-100 dark:border-green-800 text-xs font-medium">
                            <Briefcase className="w-3 h-3" />
                            {toolContext.title}
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handleNewChat()}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors sm:hidden"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                    <p className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Online
                    </p>
                </div>
            </div>

            {/* --- Messages Area --- */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth" ref={scrollRef}>
                {activeMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group relative`}>

                        {/* Message Actions (Hover / Touch) */}
                        {!loading && editingMessageId !== msg.id && msg.role !== 'model' && msg.id.indexOf('init') === -1 && (
                            <div className={`absolute -top-6 ${msg.role === 'user' ? 'right-0' : 'left-0'} opacity-0 group-hover:opacity-100 transition-opacity flex items-center bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-full p-0.5 z-10`}>
                                <button onClick={() => startEditing(msg)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 hover:text-blue-500" title="Edit">
                                    <Edit2 className="w-3 h-3" />
                                </button>
                                <div className="w-px h-3 bg-gray-200 dark:bg-gray-700 mx-0.5"></div>
                                <button onClick={() => branchChat(msg.id)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 hover:text-green-600" title="Branch Chat">
                                    <GitBranch className="w-3 h-3" />
                                </button>
                                <div className="w-px h-3 bg-gray-200 dark:bg-gray-700 mx-0.5"></div>
                                <button onClick={() => deleteMessage(msg.id)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 hover:text-red-500" title="Delete">
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        )}
                        {/* Model Message Actions (Branch Only) */}
                        {!loading && msg.role === 'model' && msg.id.indexOf('init') === -1 && (
                            <div className={`absolute -top-6 left-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-full p-0.5 z-10`}>
                                <button onClick={() => branchChat(msg.id)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 hover:text-green-600" title="Branch from here">
                                    <GitBranch className="w-3 h-3" />
                                </button>
                            </div>
                        )}

                        <div className={`flex gap-2 max-w-[90%] md:max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            {/* Avatar */}
                            <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center mt-1 shadow-sm ${msg.role === 'user' ? 'bg-gray-200 dark:bg-gray-700' : 'bg-green-800 dark:bg-green-700'}`}>
                                {msg.role === 'user' ? <User className="w-4 h-4 text-gray-600 dark:text-gray-300" /> : <Bot className="w-4 h-4 text-white" />}
                            </div>

                            {/* Bubble Content */}
                            <div className="flex flex-col gap-1 w-full">
                                {editingMessageId === msg.id ? (
                                    <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-green-500 shadow-md w-full animate-fade-in-up">
                                        <textarea
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                            className="w-full text-sm bg-transparent outline-none resize-none dark:text-white mb-2"
                                            rows={3}
                                            autoFocus
                                        />
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => setEditingMessageId(null)} className="text-xs px-3 py-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">Cancel</button>
                                            <button onClick={saveEdit} className="text-xs px-3 py-1 bg-green-700 text-white rounded flex items-center gap-1 hover:bg-green-800 transition-colors">
                                                <Save className="w-3 h-3" /> Save
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={`rounded-2xl p-4 shadow-sm text-sm leading-relaxed transition-colors duration-300 ${msg.role === 'user'
                                        ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tr-none border border-gray-100 dark:border-gray-700'
                                        : 'bg-green-800 dark:bg-green-700 text-white rounded-tl-none'
                                        }`}>
                                        {msg.text}
                                    </div>
                                )}

                                {/* Structured Data Card */}
                                {msg.isStructured && msg.structuredData && (
                                    <AdviceCard data={msg.structuredData} />
                                )}

                                {/* Pricing Data Card */}
                                {msg.isPricing && msg.pricingData && (
                                    <PricingCard data={msg.pricingData} />
                                )}

                                <div className={`flex items-center gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} px-1`}>
                                    <span className="text-[10px] text-gray-400 dark:text-gray-500">
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    {msg.id.indexOf('sys') > -1 && <span className="text-[10px] text-gray-400 italic">System Note</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start">
                        <div className="flex gap-2 max-w-[80%]">
                            <div className="w-8 h-8 rounded-full bg-green-800 dark:bg-green-700 shrink-0 flex items-center justify-center mt-1">
                                <Bot className="w-4 h-4 text-white" />
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-none p-4 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                                <div className="flex gap-1.5">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* --- Footer / Input --- */}
            <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
                {activeMessages.length < 2 && (
                    <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-2">
                        {suggestions.map((s, i) => (
                            <button key={i} onClick={() => setInput(s)} className="whitespace-nowrap px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/30 hover:text-green-700 dark:hover:text-green-400 transition-colors border border-transparent hover:border-green-200 dark:hover:border-green-800">
                                {s}
                            </button>
                        ))}
                    </div>
                )}

                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700/50 rounded-full px-4 py-2 border border-gray-200 dark:border-gray-700 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500 transition-all shadow-inner dark:shadow-none">
                    <button className="text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors" aria-label="Use Microphone">
                        <Mic className="w-5 h-5" />
                    </button>
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={context === 'pricing' ? "E.g. Flour costs 500, Sugar 200..." : "Ask advice..."}
                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-1 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!input.trim() || loading}
                        aria-label="Send Message"
                        className={`p-2 rounded-full transition-all ${input.trim() ? 'bg-green-700 text-white shadow-md hover:bg-green-800 transform hover:scale-105' : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400'}`}
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;