import React, { useState } from 'react';
import TerminalLab from '../components/TerminalLab';
import { BookOpen, CheckCircle, ChevronRight, Lock, Unlock } from 'lucide-react';
import './NetworkingCourse.css';

const modules = [
  {
    id: 1,
    title: "OSI Model Deep Dive",
    subtitle: "Layers 1 to 7 Explained",
    content: (
      <>
        <p>The Open Systems Interconnection (OSI) model conceptualizes how networks operate. It splits communication into 7 distinct layers.</p>
        <ul>
          <li><strong>Layer 7 (Application):</strong> HTTP, FTP, DNS. Where users interact.</li>
          <li><strong>Layer 4 (Transport):</strong> TCP/UDP. Ensures reliable or fast delivery.</li>
          <li><strong>Layer 3 (Network):</strong> IP Addresses, Routers. Defines the path.</li>
          <li><strong>Layer 2 (Data Link):</strong> MAC Addresses, Switches. Local delivery.</li>
        </ul>
        <div className="task-box">
          <h4><CheckCircle size={16} /> Lab Task</h4>
          <p>Find out your local network interface details. Type <code>ifconfig</code> in the terminal.</p>
        </div>
      </>
    ),
    quiz: {
      question: "Which OSI Layer is responsible for IP Addressing?",
      options: ["Layer 2 (Data Link)", "Layer 3 (Network)", "Layer 4 (Transport)", "Layer 7 (Application)"],
      answer: 1
    }
  },
  {
    id: 2,
    title: "TCP vs UDP",
    subtitle: "Reliability vs Speed",
    content: (
      <>
        <h3>TCP (Transmission Control Protocol)</h3>
        <p>TCP is connection-oriented. It requires a "Three-Way Handshake" (SYN, SYN-ACK, ACK) before data is sent, ensuring perfect delivery without data loss.</p>
        <h3>UDP (User Datagram Protocol)</h3>
        <p>UDP is connectionless. It fires data off rapidly without checking if it arrived. Perfect for video streaming and VoIP.</p>
        <div className="task-box">
          <h4><CheckCircle size={16} /> Lab Task</h4>
          <p>View active TCP and UDP connections on the simulated machine. Type <code>netstat -an</code>.</p>
        </div>
      </>
    ),
    quiz: {
      question: "Which protocol uses a Three-Way Handshake?",
      options: ["UDP", "IP", "TCP", "ICMP"],
      answer: 2
    }
  },
  {
    id: 3,
    title: "DNS & Port Scanning",
    subtitle: "Reconnaissance Basics",
    content: (
      <>
        <h3>Domain Name System (DNS)</h3>
        <p>DNS translates human-readable names (google.com) into IP addresses (142.250.190.46). It's the phonebook of the internet.</p>
        <h3>Port Scanning</h3>
        <p>Network administrators and security engineers scan ports to see what services are running on a server.</p>
        <div className="task-box">
          <h4><CheckCircle size={16} /> Lab Task</h4>
          <p>First, resolve a domain to an IP using <code>nslookup pentabrid.com</code>. Then, scan it for open ports using <code>nmap pentabrid.com</code>.</p>
        </div>
      </>
    ),
    quiz: {
      question: "What tool is commonly used to scan for open ports?",
      options: ["ping", "traceroute", "ifconfig", "nmap"],
      answer: 3
    }
  }
];

const NetworkingCourse = () => {
  const [activeModuleId, setActiveModuleId] = useState(1);
  const [unlockedModules, setUnlockedModules] = useState([1]);
  const [quizState, setQuizState] = useState({ selected: null, isCorrect: null });

  const activeIndex = modules.findIndex(m => m.id === activeModuleId);
  const currentModule = modules[activeIndex];

  const handleQuizSubmit = () => {
    if (quizState.selected === currentModule.quiz.answer) {
      setQuizState({ ...quizState, isCorrect: true });
      if (!unlockedModules.includes(currentModule.id + 1) && currentModule.id < modules.length) {
        setUnlockedModules([...unlockedModules, currentModule.id + 1]);
      }
    } else {
      setQuizState({ ...quizState, isCorrect: false });
    }
  };

  const handleModuleSelect = (id) => {
    if (unlockedModules.includes(id)) {
      setActiveModuleId(id);
      setQuizState({ selected: null, isCorrect: null });
    }
  };

  return (
    <div className="course-page">
      <div className="course-header">
        <h1>Networking: <span className="gradient-text">Basic to Advanced</span></h1>
        <p>Interactive Theory + Lab Environment</p>
      </div>

      <div className="course-layout">
        {/* Sidebar */}
        <aside className="course-sidebar glass-card">
          <div className="sidebar-header">
            <h3>Modules</h3>
            <div className="progress-bar-container">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${(unlockedModules.length / modules.length) * 100}%` }}
              ></div>
            </div>
            <span className="progress-text">{unlockedModules.length} of {modules.length} Unlocked</span>
          </div>
          
          <ul className="module-list">
            {modules.map((mod) => {
              const isUnlocked = unlockedModules.includes(mod.id);
              const isActive = activeModuleId === mod.id;
              
              return (
                <li 
                  key={mod.id} 
                  className={`module-item ${isActive ? 'active' : ''} ${!isUnlocked ? 'locked' : ''}`}
                  onClick={() => handleModuleSelect(mod.id)}
                >
                  <div className="mod-icon">
                    {isUnlocked ? <Unlock size={16} /> : <Lock size={16} />}
                  </div>
                  <div className="mod-info">
                    <span className="mod-number">Module {mod.id}</span>
                    <span className="mod-title">{mod.title}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Main Content Area */}
        <div className="split-pane">
          {/* Left Pane: Theory */}
          <div className="pane theory-pane glass-card">
            <div className="theory-header">
              <BookOpen size={20} className="text-accent" />
              <h2>{currentModule.title}</h2>
            </div>
            
            <div className="theory-content animate-fade-in" key={activeModuleId}>
              <h3 className="module-subtitle">{currentModule.subtitle}</h3>
              {currentModule.content}
              
              {/* Quiz Section */}
              <div className="quiz-section">
                <h4>Knowledge Check</h4>
                <p className="quiz-question">{currentModule.quiz.question}</p>
                <div className="quiz-options">
                  {currentModule.quiz.options.map((opt, idx) => (
                    <button 
                      key={idx}
                      className={`quiz-opt-btn ${quizState.selected === idx ? 'selected' : ''}`}
                      onClick={() => setQuizState({ ...quizState, selected: idx, isCorrect: null })}
                      disabled={quizState.isCorrect}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {quizState.selected !== null && !quizState.isCorrect && (
                  <button className="btn btn-primary check-btn" onClick={handleQuizSubmit}>
                    Submit Answer
                  </button>
                )}
                
                {quizState.isCorrect && (
                  <div className="quiz-success animate-fade-in">
                    <CheckCircle size={20} className="text-success" />
                    <span>Correct! You have unlocked the next module.</span>
                    {currentModule.id < modules.length && (
                      <button 
                        className="btn btn-outline next-mod-btn"
                        onClick={() => handleModuleSelect(currentModule.id + 1)}
                      >
                        Next Module <ChevronRight size={16} />
                      </button>
                    )}
                  </div>
                )}
                {quizState.isCorrect === false && (
                  <div className="quiz-error animate-fade-in">
                    Incorrect. Try again.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Pane: Lab */}
          <div className="pane lab-pane">
            <TerminalLab />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkingCourse;
