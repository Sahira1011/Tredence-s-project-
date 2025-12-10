import React, { useEffect, useState } from 'react';

const EditPanel = ({ selectedNode, setNodes, onClose }) => {
  // Common State
  const [label, setLabel] = useState(selectedNode.data.label || '');

  // Node Specific States
  // Condition
  const [condition, setCondition] = useState('');
  // Slack
  const [slackChannel, setSlackChannel] = useState('');
  const [slackMessage, setSlackMessage] = useState('');
  // Issue
  const [issueTitle, setIssueTitle] = useState('');
  const [issueSeverity, setIssueSeverity] = useState('Low');
  // API
  const [apiMethod, setApiMethod] = useState('GET');
  const [apiUrl, setApiUrl] = useState('');
  // Email
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  // Automated
  const [autoAction, setAutoAction] = useState('');


  // Sync state when a new node is selected
  useEffect(() => {
    const data = selectedNode.data;
    setLabel(data.label || '');
    setCondition(data.condition || '');
    setSlackChannel(data.channel || '');
    setSlackMessage(data.message || '');
    setIssueTitle(data.title || '');
    setIssueSeverity(data.severity || 'Low');
    setApiMethod(data.method || 'GET');
    setApiUrl(data.url || '');
    setEmailTo(data.to || '');
    setEmailSubject(data.subject || '');
    setAutoAction(data.action || '');
  }, [selectedNode]);

  // Generic updater function
  const updateNodeData = (key, value) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          return { ...node, data: { ...node.data, [key]: value } };
        }
        return node;
      })
    );
  };

  const INPUT_STYLE = "w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 mb-4 focus:outline-none focus:border-blue-400 transition-colors";
  const LABEL_STYLE = "block text-xs font-extrabold text-slate-400 mb-2 uppercase tracking-wider";
  const SECTION_TITLE = `text-sm font-bold uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 ${
      selectedNode.type === 'issue' ? 'text-red-500' : 
      selectedNode.type === 'slack' ? 'text-pink-500' :
      selectedNode.type === 'condition' ? 'text-purple-500' : 'text-slate-500'
  }`;


  return (
    <div className="w-80 h-full bg-white/90 backdrop-blur-xl p-6 shadow-2xl flex flex-col font-sans overflow-y-auto relative">
      <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">✕</button>
      
      <div className={SECTION_TITLE}>{selectedNode.type.replace('-', ' ')} Settings</div>

      {/* COMMON LABEL FIELD (Except for specialized nodes) */}
      {['start', 'end'].includes(selectedNode.type) && (
        <div>
            <label className={LABEL_STYLE}>Label</label>
            <input type="text" className={INPUT_STYLE} value={label} onChange={(e) => { setLabel(e.target.value); updateNodeData('label', e.target.value); }} />
        </div>
      )}

      {/* --- CONDITIONAL FIELDS --- */}

      {/* 1. CONDITION NODE */}
      {selectedNode.type === 'condition' && (
        <div>
          <label className={LABEL_STYLE}>Expression (e.g., data.value {'>'} 10)</label>
          <textarea className={`${INPUT_STYLE} font-mono text-xs h-24`} value={condition} onChange={(e) => { setCondition(e.target.value); updateNodeData('condition', e.target.value); }} placeholder="x > 5" />
          <p className="text-xs text-slate-400 mt-[-10px] mb-4">Connect top green output for TRUE, bottom red for FALSE.</p>
        </div>
      )}

      {/* 2. SLACK NODE */}
      {selectedNode.type === 'slack' && (
        <div>
          <label className={LABEL_STYLE}>Channel</label>
          <input type="text" className={INPUT_STYLE} value={slackChannel} onChange={(e) => { setSlackChannel(e.target.value); updateNodeData('channel', e.target.value); }} placeholder="#general" />
          <label className={LABEL_STYLE}>Message</label>
          <textarea className={INPUT_STYLE} value={slackMessage} onChange={(e) => { setSlackMessage(e.target.value); updateNodeData('message', e.target.value); }} placeholder="Type message here..." rows={3} />
        </div>
      )}

      {/* 3. ISSUE NODE */}
      {selectedNode.type === 'issue' && (
        <div>
          <label className={LABEL_STYLE}>Issue Title</label>
          <input type="text" className={INPUT_STYLE} value={issueTitle} onChange={(e) => { setIssueTitle(e.target.value); updateNodeData('title', e.target.value); }} />
          <label className={LABEL_STYLE}>Severity</label>
          <select className={INPUT_STYLE} value={issueSeverity} onChange={(e) => { setIssueSeverity(e.target.value); updateNodeData('severity', e.target.value); }}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      )}

      {/* 4. API NODE */}
      {selectedNode.type === 'api' && (
        <div>
          <label className={LABEL_STYLE}>Method</label>
          <select className={INPUT_STYLE} value={apiMethod} onChange={(e) => { setApiMethod(e.target.value); updateNodeData('method', e.target.value); }}>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
          <label className={LABEL_STYLE}>Endpoint URL</label>
          <input type="text" className={INPUT_STYLE} value={apiUrl} onChange={(e) => { setApiUrl(e.target.value); updateNodeData('url', e.target.value); }} placeholder="https://api.example.com/data" />
        </div>
      )}

      {/* 5. EMAIL NODE */}
      {selectedNode.type === 'email' && (
        <div>
          <label className={LABEL_STYLE}>Recipient (To)</label>
          <input type="text" className={INPUT_STYLE} value={emailTo} onChange={(e) => { setEmailTo(e.target.value); updateNodeData('to', e.target.value); }} placeholder="user@company.com" />
          <label className={LABEL_STYLE}>Subject</label>
          <input type="text" className={INPUT_STYLE} value={emailSubject} onChange={(e) => { setEmailSubject(e.target.value); updateNodeData('subject', e.target.value); }} placeholder="Notification Subject" />
        </div>
      )}

      {/* 6. AUTOMATED STEP NODE */}
      {selectedNode.type === 'automated' && (
        <div>
          <label className={LABEL_STYLE}>Automation Action / Script</label>
          <input type="text" className={INPUT_STYLE} value={autoAction} onChange={(e) => { setAutoAction(e.target.value); updateNodeData('action', e.target.value); }} placeholder="run_data_sync.py" />
        </div>
      )}

      <div className="mt-auto text-center text-xs text-slate-400">Changes save automatically</div>
    </div>
  );
};

export default EditPanel;