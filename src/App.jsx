
import React, { useState, useEffect } from 'react';
import {
  Folder,
  FileText,
  Terminal,
  Globe,
  Settings,
  LayoutGrid,
  X,
  Minus,
  Square,
  Search,
  ChevronRight,
  ChevronLeft,
  Copy,
  Check,
  Clock,
  Wifi,
  Volume2,
  Power,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import experiments from './data.json';

const UbuntuDesktop = () => {
  const [openWindows, setOpenWindows] = useState([]);
  const [activeWindow, setActiveWindow] = useState(null);
  const [time, setTime] = useState(new Date());
  const [copying, setCopying] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const openWindow = (type, data = null) => {
    const id = Date.now();
    const newWindow = { id, type, data, minimized: false };
    setOpenWindows([...openWindows, newWindow]);
    setActiveWindow(id);
  };

  const closeWindow = (id) => {
    setOpenWindows(openWindows.filter(w => w.id !== id));
    if (activeWindow === id) setActiveWindow(null);
  };

  const toggleMinimize = (id) => {
    setOpenWindows(openWindows.map(w =>
      w.id === id ? { ...w, minimized: !w.minimized } : w
    ));
    if (activeWindow === id) setActiveWindow(null);
  };

  const handleCopy = (content, id) => {
    navigator.clipboard.writeText(content);
    setCopying(id);
    setTimeout(() => setCopying(null), 2000);
  };

  return (
    <div className="h-screen w-screen overflow-hidden relative flex flex-col font-sans select-none bg-cover bg-center" style={{ backgroundImage: "url('/wallpaper.png')" }}>
      {/* Top Bar */}
      <div className="h-7 md:h-7 h-6 bg-black/60 backdrop-blur-md flex items-center justify-between px-2 md:px-4 text-white text-[10px] md:text-xs font-medium z-50">
        <div className="flex items-center gap-2 md:gap-4">
          <span className="hidden sm:inline hover:bg-white/10 px-2 py-0.5 rounded cursor-default">Activities</span>
          {activeWindow && (
            <span className="font-bold border-l border-white/20 pl-2 md:pl-4 capitalize text-[10px] md:text-xs">
              {openWindows.find(w => w.id === activeWindow)?.type}
            </span>
          )}
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 hover:bg-white/10 px-1 md:px-2 py-0.5 rounded cursor-default text-[9px] md:text-xs">
          {time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <Wifi size={12} className="md:w-3.5 md:h-3.5" />
          <Volume2 size={12} className="md:w-3.5 md:h-3.5" />
          <Power size={12} className="md:w-3.5 md:h-3.5" />
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden flex-col md:flex-row">
        {/* Dock / Sidebar - Bottom on Mobile, Left on Desktop */}
        <div className="order-last md:order-first w-full md:w-16 h-14 md:h-auto bg-black/30 backdrop-blur-lg flex md:flex-col items-center justify-around md:justify-start py-2 md:py-4 gap-1 md:gap-4 z-40 border-t md:border-t-0 md:border-r border-white/5">
          <DockIcon icon={<Folder className="text-orange-400" />} label="Files" onClick={() => openWindow('Files')} />
          <DockIcon icon={<Terminal className="text-white" />} label="Terminal" onClick={() => openWindow('Terminal')} />
          <DockIcon icon={<Globe className="text-blue-400" />} label="Browser" onClick={() => openWindow('Browser')} />
          <DockIcon icon={<Settings className="text-gray-400" />} label="Settings" onClick={() => openWindow('Settings')} />
          <div className="hidden md:block md:mt-auto">
            <DockIcon icon={<LayoutGrid size={24} className="text-white/80" />} label="Applications" onClick={() => openWindow('Applications')} />
          </div>
        </div>

        {/* Desktop Content */}
        <div className="flex-1 relative p-2 md:p-4 overflow-auto">
          <div className="flex flex-row md:flex-col gap-4 md:gap-8 w-full md:w-24">
            <DesktopIcon icon={<Folder size={48} className="text-orange-400" />} label="Home" />
            <DesktopIcon icon={<Trash2 size={48} className="text-red-500" />} label="bin" onClick={() => openWindow('Files')} />
          </div>

          {/* Windows */}
          <AnimatePresence>
            {openWindows.map(win => !win.minimized && (
              <Window
                key={win.id}
                window={win}
                active={activeWindow === win.id}
                onClose={() => closeWindow(win.id)}
                onMinimize={() => toggleMinimize(win.id)}
                onFocus={() => setActiveWindow(win.id)}
              >
                {win.type === 'Files' && <FileManager experiments={experiments} onOpenFile={(exp) => openWindow('Code', exp)} onCopyCode={(code, id) => handleCopy(code, id)} copying={copying} />}
                {win.type === 'Code' && (
                  <div className="h-full flex flex-col overflow-hidden bg-[#1e1e1e]">
                    <div className="bg-[#2d2d2d] border-b border-white/5 p-1 md:p-2 flex justify-between items-center shrink-0 gap-2">
                      <span className="text-[9px] md:text-xs text-white/60 px-1 md:px-2 font-medium truncate">{win.data.title}</span>
                      <button
                        onClick={() => handleCopy(win.data.code, win.id)}
                        className="flex items-center gap-1 bg-ubuntu-orange hover:bg-orange-600 text-white text-[9px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 rounded transition-all shadow-md active:scale-95 shrink-0"
                      >
                        {copying === win.id ? <Check size={12} /> : <Copy size={12} />}
                        <span className="hidden sm:inline">{copying === win.id ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>

                    <div className="flex-1 overflow-auto flex flex-col">
                      {/* Code Block */}
                      <div className="p-2 md:p-4 bg-ubuntu-dark border-b border-white/5">
                        <div className="flex items-center gap-2 mb-1 md:mb-2">
                          <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-red-500" />
                          <span className="text-[8px] md:text-[10px] text-white/40 uppercase tracking-widest font-bold">Source Code</span>
                        </div>
                        <pre className="text-pink-100 font-mono text-[10px] md:text-sm leading-relaxed whitespace-pre-wrap selection:bg-ubuntu-orange/40">
                          {win.data.code}
                        </pre>
                      </div>

                      {/* Steps Block */}
                      {win.data.steps && (
                        <div className="p-3 md:p-6 bg-[#1a1a1a] text-white/80">
                          <div className="flex items-center gap-2 mb-2 md:mb-4">
                            <Terminal size={12} className="text-green-400 md:w-3.5 md:h-3.5" />
                            <span className="text-[8px] md:text-xs font-bold text-white/60 uppercase tracking-wider">Execution Steps</span>
                          </div>
                          <div className="space-y-2 md:space-y-3">
                            {win.data.steps.split('\n').map((step, i) => (
                              <div key={i} className="flex gap-2 md:gap-3 text-[10px] md:text-sm font-medium">
                                <span className="text-white/20 shrink-0 w-4">{i + 1}.</span>
                                <p className={step.trim().startsWith('gcc') || step.trim().startsWith('./') ? "font-mono bg-black/40 px-1 md:px-2 py-0.5 rounded text-green-300 border border-white/5 text-[9px] md:text-xs" : ""}>
                                  {step}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {win.type === 'Terminal' && (
                  <div className="h-full bg-[#300A24] p-4 font-mono text-sm text-white">
                    <div className="text-green-400 font-bold">user@ubuntu:~$ <span className="text-white font-normal">ls -la</span></div>
                    <div className="mt-2 text-white/80">
                      drwxr-xr-x  2 user user 4096 Apr 23 16:04 .<br />
                      drwxr-xr-x 20 user user 4096 Apr 23 16:04 ..<br />
                      -rw-r--r--  1 user user  681 Apr 23 16:04 exp1.c<br />
                      -rw-r--r--  1 user user  709 Apr 23 16:04 exp2.c<br />
                    </div>
                    <div className="mt-4 text-green-400 font-bold">user@ubuntu:~$ <span className="animate-pulse">_</span></div>
                  </div>
                )}
                {win.type === 'Browser' && (
                  <div className="h-full flex flex-col bg-white">
                    <div className="h-10 md:h-12 bg-gray-100 border-b border-gray-300 flex items-center px-2 md:px-4 gap-1 md:gap-2">
                      <div className="flex items-center gap-0.5 md:gap-1">
                        <button className="p-1 hover:bg-gray-200 rounded text-sm">←</button>
                        <button className="p-1 hover:bg-gray-200 rounded text-sm">→</button>
                        <button className="p-1 hover:bg-gray-200 rounded text-sm">⟲</button>
                      </div>
                      <div className="flex-1 bg-white border border-gray-300 rounded px-2 py-1 text-xs md:text-sm text-gray-600">
                        about:ubuntu
                      </div>
                    </div>
                    <div className="flex-1 overflow-auto p-4 md:p-8 text-center flex flex-col items-center justify-center bg-gradient-to-b from-orange-50 to-white">
                      <div className="text-4xl md:text-6xl mb-2 md:mb-4">🐧</div>
                      <h1 className="text-xl md:text-3xl font-bold text-gray-800 mb-1 md:mb-2">Ubuntu Linux</h1>
                      <p className="text-xs md:text-base text-gray-600 mb-2 md:mb-4">Welcome to the OS Practicals Demo</p>
                      <p className="text-xs md:text-sm text-gray-500 max-w-md">This is a simulated Ubuntu desktop environment for learning Operating Systems concepts.</p>
                    </div>
                  </div>
                )}
                {win.type === 'Settings' && (
                  <div className="h-full flex flex-col bg-[#1e1e1e]">
                    <div className="h-8 md:h-10 bg-[#2d2d2d] border-b border-white/5 px-3 md:px-4 flex items-center text-white/80 text-xs md:text-sm font-medium">
                      System Settings
                    </div>
                    <div className="flex-1 overflow-auto p-3 md:p-6 text-white/80">
                      <div className="space-y-4 md:space-y-6 max-w-2xl">
                        <div>
                          <h3 className="text-white font-bold text-sm md:text-base mb-1 md:mb-2">Display</h3>
                          <p className="text-xs md:text-sm text-white/60">Resolution: 1920x1080</p>
                          <p className="text-xs md:text-sm text-white/60">Refresh Rate: 60Hz</p>
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-sm md:text-base mb-1 md:mb-2">Audio</h3>
                          <p className="text-xs md:text-sm text-white/60">Output: Speakers</p>
                          <p className="text-xs md:text-sm text-white/60">Volume: 80%</p>
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-sm md:text-base mb-1 md:mb-2">System</h3>
                          <p className="text-xs md:text-sm text-white/60">OS: Ubuntu 20.04 LTS</p>
                          <p className="text-xs md:text-sm text-white/60">Kernel: 5.4.0-42-generic</p>
                          <p className="text-xs md:text-sm text-white/60">CPU: 4 cores @ 2.4GHz</p>
                          <p className="text-xs md:text-sm text-white/60">RAM: 8GB</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {win.type === 'Applications' && (
                  <div className="h-full flex flex-col bg-[#1e1e1e]">
                    <div className="h-8 md:h-10 bg-[#2d2d2d] border-b border-white/5 px-3 md:px-4 flex items-center text-white/80 text-xs md:text-sm font-medium">
                      Applications
                    </div>
                    <div className="flex-1 overflow-auto p-3 md:p-6 text-white/80">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-6">
                        <AppItem icon="📝" label="Text Editor" desc="Edit code files" />
                        <AppItem icon="🎨" label="GIMP" desc="Image editor" />
                        <AppItem icon="🔧" label="Compilers" desc="GCC, G++" />
                        <AppItem icon="📊" label="File Manager" desc="Browse files" />
                        <AppItem icon="🌐" label="Firefox" desc="Web browser" />
                        <AppItem icon="🛠️" label="Dev Tools" desc="Debuggers" />
                      </div>
                    </div>
                  </div>
                )}
              </Window>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const DockIcon = ({ icon, label, onClick }) => (
  <div
    className="group relative flex flex-col items-center cursor-pointer"
    onClick={onClick}
  >
    <div className="w-10 md:w-12 h-10 md:h-12 rounded-lg bg-white/5 group-hover:bg-white/20 flex items-center justify-center transition-all duration-200">
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <div className="absolute left-12 md:left-16 bottom-2 md:bottom-auto md:top-0 md:left-full bg-black/80 text-white text-[9px] md:text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
      {label}
    </div>
  </div>
);

const DesktopIcon = ({ icon, label, onClick }) => (
  <div
    className="flex flex-col items-center gap-0.5 md:gap-1 group cursor-pointer"
    onClick={onClick}
  >
    <div className="p-1 md:p-2 rounded group-hover:bg-blue-400/20 transition-colors">
      {React.cloneElement(icon, { size: 32 })}
    </div>
    <span className="text-white text-[10px] md:text-[11px] font-medium drop-shadow-lg text-center px-1 rounded group-hover:bg-blue-600/60">
      {label}
    </span>
  </div>
);

const SidebarItem = ({ icon, label, active }) => (
  <div className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-1 md:py-2 text-[10px] md:text-xs transition-colors cursor-pointer ${active ? 'bg-white/10 text-white font-bold' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
    {icon}
    <span>{label}</span>
  </div>
);

const AppItem = ({ icon, label, desc }) => (
  <div className="p-2 md:p-4 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all cursor-pointer text-center">
    <div className="text-2xl md:text-3xl mb-1 md:mb-2">{icon}</div>
    <p className="text-white font-bold text-xs md:text-sm">{label}</p>
    <p className="text-white/50 text-[9px] md:text-xs mt-0.5 md:mt-1">{desc}</p>
  </div>
);

const Window = ({ children, window, active, onClose, onMinimize, onFocus }) => (
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.9, opacity: 0 }}
    onMouseDown={onFocus}
    className={`absolute ubuntu-window flex flex-col z-${active ? '30' : '20'} w-[calc(100%-1rem)] md:w-3/4 h-[calc(100%-1rem)] md:h-3/4 max-w-[95vw] max-h-[95vh]`}
    style={{
      left: '0.5rem',
      top: '0.5rem',
      boxShadow: active ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
    }}
  >
    <div className={`h-8 md:h-10 flex items-center justify-between px-3 md:px-4 ${active ? 'bg-[#3D3D3D]' : 'bg-[#2D2D2D]'} text-white/90 text-xs md:text-sm font-medium`}>
      <div className="flex items-center gap-2">
        <Folder size={14} className="text-orange-400" />
        <span className="capitalize hidden sm:inline">{window.type}</span>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={(e) => { e.stopPropagation(); onMinimize(); }} className="p-1 md:p-1.5 hover:bg-white/10 rounded-full text-white/60 hover:text-white">
          <Minus size={12} className="md:w-3.5 md:h-3.5" />
        </button>
        <button className="p-1 md:p-1.5 hover:bg-white/10 rounded-full text-white/60 hover:text-white">
          <Square size={10} className="md:w-3 md:h-3" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="p-1 md:p-1.5 bg-orange-600 hover:bg-orange-500 rounded-full text-white ml-1 md:ml-2 shadow-inner">
          <X size={12} className="md:w-3.5 md:h-3.5" />
        </button>
      </div>
    </div>
    <div className="flex-1 bg-[#1e1e1e] overflow-hidden">
      {children}
    </div>
  </motion.div>
);

const FileManager = ({ experiments, onOpenFile, onCopyCode, copying }) => {
  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div className="w-44 bg-[#262626] border-r border-white/5 flex flex-col py-4">
        <SidebarItem icon={<Clock size={16} />} label="Recent" />
        <SidebarItem icon={<Folder size={16} />} label="Home" active />
        <SidebarItem icon={<Folder size={16} />} label="Documents" />
        <SidebarItem icon={<Folder size={16} />} label="Downloads" />
        <SidebarItem icon={<Folder size={16} />} label="Pictures" />
        <div className="mt-auto">
          <SidebarItem icon={<Folder size={16} />} label="Other Locations" />
        </div>
      </div>

      {/* Main View */}
      <div className="flex-1 bg-[#1e1e1e] flex flex-col">
        <div className="h-8 md:h-10 border-b border-white/5 flex items-center px-2 md:px-4 justify-between gap-2">
          <div className="flex items-center gap-1">
            <button className="p-1 hover:bg-white/10 rounded"><ChevronLeft size={16} className="text-white/40 md:w-4.5 md:h-4.5" /></button>
            <button className="p-1 hover:bg-white/10 rounded"><ChevronRight size={16} className="text-white/40 md:w-4.5 md:h-4.5" /></button>
            <div className="hidden sm:flex items-center bg-black/40 px-2 py-0.5 md:px-3 md:py-1 rounded text-[9px] md:text-xs text-white/80 gap-1 md:gap-2 border border-white/5 ml-2">
              <Folder size={12} />
              <span>Home</span>
              <ChevronRight size={10} className="text-white/30" />
              <span>bin</span>
            </div>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <Search size={14} className="text-white/40 md:w-4 md:h-4" />
            <LayoutGrid size={14} className="text-white/40 md:w-4 md:h-4" />
          </div>
        </div>

        <div className="flex-1 p-2 md:p-4 overflow-auto">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 md:gap-6">
            {experiments.map((exp, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center gap-1 group cursor-pointer"
                onDoubleClick={() => onOpenFile(exp)}
                onClick={() => { }}
              >
                <div className="relative w-16 h-16 md:w-24 md:h-24 flex items-center justify-center">
                  <Folder size={48} className="text-orange-400 fill-orange-400/20 group-hover:scale-105 transition-transform absolute" />
                  <FileText size={16} className="absolute bottom-1 right-1 md:bottom-2 md:right-2 text-white/60 bg-[#1e1e1e] rounded-sm p-0.5 md:p-1" />
                  
                  {/* Copy Icon on Hover */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCopyCode(exp.code, idx);
                    }}
                    className="absolute inset-0 flex items-center justify-center bg-black/60 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-sm"
                  >
                    {copying === idx ? (
                      <Check size={20} className="text-green-400 animate-pulse md:w-7 md:h-7" />
                    ) : (
                      <Copy size={20} className="text-white hover:text-orange-400 transition-colors md:w-7 md:h-7" />
                    )}
                  </button>
                </div>
                <span className="text-[9px] md:text-xs text-white/80 text-center line-clamp-2 px-0.5 md:px-1 group-hover:bg-blue-600/60 rounded">
                  {exp.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="h-5 md:h-6 bg-[#262626] border-t border-white/5 flex items-center px-2 md:px-4 justify-between text-[8px] md:text-[10px] text-white/40">
          <span>{experiments.length} items</span>
          <span>4.2 GB free</span>
        </div>
      </div>
    </div>
  );
};

export default UbuntuDesktop;
