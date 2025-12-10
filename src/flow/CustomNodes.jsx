import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

// Shared Tailwind styles for consistent dark card look
const nodeBaseStyle = "min-w-[160px] bg-slate-900 text-white border-2 rounded-lg shadow-lg overflow-hidden font-sans text-[11px]";
const headerBaseStyle = "px-3 py-1.5 font-bold uppercase tracking-wider text-[9px]";
const bodyBaseStyle = "p-3 space-y-1";
const labelStyle = "opacity-60 text-[9px] uppercase mr-1";

// --- BASIC NODES ---
const StartNode = memo(({ data }) => (
  <div className={`${nodeBaseStyle} border-green-400`}>
    <div className={`${headerBaseStyle} bg-green-900/50 text-green-300`}>Start</div>
    <div className={bodyBaseStyle}>{data.label}</div>
    <Handle type="source" position={Position.Right} className="!bg-green-400" />
  </div>
));

const EndNode = memo(({ data }) => (
  <div className={`${nodeBaseStyle} border-slate-400`}>
    <Handle type="target" position={Position.Left} className="!bg-slate-400" />
    <div className={`${headerBaseStyle} bg-slate-800 text-slate-300`}>End</div>
    <div className={bodyBaseStyle}>{data.label}</div>
  </div>
));

// --- REQUESTED NEW NODES ---

// 1. CONDITIONAL NODE (Purple, two outputs)
const ConditionNode = memo(({ data }) => (
  <div className={`${nodeBaseStyle} border-purple-400`}>
    <Handle type="target" position={Position.Left} className="!bg-purple-400" />
    <div className={`${headerBaseStyle} bg-purple-900/50 text-purple-300`}>Condition</div>
    <div className={`${bodyBaseStyle} font-mono text-center py-4 text-purple-100`}>
       {data.condition || 'if (x > 5)'}
    </div>
    {/* Dual Output Handles */}
    <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-4 mr-[-6px]">
      <Handle type="source" position={Position.Right} id="true" className="!bg-green-400 !relative !transform-none" style={{right: -3}} title="True" />
      <Handle type="source" position={Position.Right} id="false" className="!bg-red-400 !relative !transform-none" style={{right: -3}} title="False" />
    </div>
  </div>
));

// 2. SLACK / SELECT MESSAGE (Pink)
const SlackNode = memo(({ data }) => (
  <div className={`${nodeBaseStyle} border-pink-400`}>
    <Handle type="target" position={Position.Left} className="!bg-pink-400" />
    <div className={`${headerBaseStyle} bg-pink-900/50 text-pink-300 flex items-center gap-1`}><span>💬</span> Slack Msg</div>
    <div className={bodyBaseStyle}>
      <div><span className={labelStyle}>Ch:</span>{data.channel || '#general'}</div>
      <div className="truncate italic opacity-80">"{data.message || '...'}"</div>
    </div>
    <Handle type="source" position={Position.Right} className="!bg-pink-400" />
  </div>
));

// 3. ISSUE NODE (Red/Orange - Jira style)
const IssueNode = memo(({ data }) => {
  const severityColor = data.severity === 'High' ? 'text-red-400' : data.severity === 'Medium' ? 'text-orange-400' : 'text-yellow-400';
  return (
    <div className={`${nodeBaseStyle} border-red-500`}>
      <Handle type="target" position={Position.Left} className="!bg-red-500" />
      <div className={`${headerBaseStyle} bg-red-950 text-red-300 flex justify-between`}>
        <span>🚨 Issue / Ticket</span>
        <span className={severityColor}>{data.severity || 'Low'}</span>
      </div>
      <div className={bodyBaseStyle}>
         <div className="font-semibold">{data.title || 'New Issue Ticket'}</div>
      </div>
      <Handle type="source" position={Position.Right} className="!bg-red-500" />
    </div>
  );
});

// 4. API REQUEST (Indigo)
const ApiNode = memo(({ data }) => (
  <div className={`${nodeBaseStyle} border-indigo-400`}>
    <Handle type="target" position={Position.Left} className="!bg-indigo-400" />
    <div className={`${headerBaseStyle} bg-indigo-900/50 text-indigo-300`}>🌐 API Request</div>
    <div className={bodyBaseStyle}>
      <div><span className={`font-bold ${data.method === 'POST' ? 'text-green-400' : 'text-blue-400'}`}>{data.method || 'GET'}</span></div>
      <div className="truncate opacity-70 font-mono text-[9px]">{data.url || '/api/v1/...'}</div>
    </div>
    <Handle type="source" position={Position.Right} className="!bg-indigo-400" />
  </div>
));

// 5. AUTOMATED STEP (Cyan)
const AutoStepNode = memo(({ data }) => (
  <div className={`${nodeBaseStyle} border-cyan-400`}>
    <Handle type="target" position={Position.Left} className="!bg-cyan-400" />
    <div className={`${headerBaseStyle} bg-cyan-900/50 text-cyan-300`}>🤖 Auto Step</div>
    <div className={bodyBaseStyle}>
      <div><span className={labelStyle}>Action:</span>{data.action || 'Run Script'}</div>
    </div>
    <Handle type="source" position={Position.Right} className="!bg-cyan-400" />
  </div>
));

// 6. EMAIL AUTOMATION (Yellow)
const EmailNode = memo(({ data }) => (
  <div className={`${nodeBaseStyle} border-yellow-400`}>
    <Handle type="target" position={Position.Left} className="!bg-yellow-400" />
    <div className={`${headerBaseStyle} bg-yellow-900/50 text-yellow-300`}>📧 Email Auto</div>
    <div className={bodyBaseStyle}>
      <div className="truncate"><span className={labelStyle}>To:</span>{data.to || 'user@ex.com'}</div>
      <div className="truncate"><span className={labelStyle}>Subj:</span>{data.subject || 'Alert'}</div>
    </div>
    <Handle type="source" position={Position.Right} className="!bg-yellow-400" />
  </div>
));


export const nodeTypes = {
  start: StartNode,
  end: EndNode,
  condition: ConditionNode,
  slack: SlackNode,
  issue: IssueNode,
  api: ApiNode,
  automated: AutoStepNode,
  email: EmailNode,
};