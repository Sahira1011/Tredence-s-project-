import React from 'react';

const Sidebar = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const DraggableButton = ({ type, label, color, icon }) => (
    <div
      className={`
        p-3 mb-2 rounded-xl cursor-grab shadow-sm hover:shadow-md hover:scale-105 transition-all
        bg-white border-2 border-${color}-400 text-slate-700 text-xs font-bold
        flex items-center gap-3 uppercase tracking-wider
      `}
      onDragStart={(event) => onDragStart(event, type)}
      draggable
    >
      <div className={`w-3 h-3 rounded-full bg-${color}-400 shadow-sm`}></div>
      {icon && <span>{icon}</span>}
      {label}
    </div>
  );

  return (
    <aside className="w-64 h-full bg-white/80 backdrop-blur-xl border-r border-slate-100 p-4 flex flex-col gap-4 overflow-y-auto rounded-2xl shadow-xl">
      <h3 className="text-xs font-extrabold uppercase text-slate-400 tracking-widest mb-1">Flow Controls</h3>
      <DraggableButton type="start" label="Start" color="green" />
      <DraggableButton type="condition" label="Condition Logic" color="purple" icon="🔀" />
      <DraggableButton type="end" label="End" color="slate" />

      <h3 className="text-xs font-extrabold uppercase text-slate-400 tracking-widest mb-1 mt-4">Actions & Integrations</h3>
      <DraggableButton type="slack" label="Slack Message" color="pink" icon="💬" />
      <DraggableButton type="issue" label="Create Issue" color="red" icon="🚨" />
      <DraggableButton type="api" label="API Request" color="indigo" icon="🌐" />
      <DraggableButton type="automated" label="Automated Step" color="cyan" icon="🤖" />
      <DraggableButton type="email" label="Email Automation" color="yellow" icon="📧" />
    </aside>
  );
};

export default Sidebar;