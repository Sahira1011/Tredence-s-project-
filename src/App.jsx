import React, { useState, useCallback, useRef } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  Panel, 
  addEdge, 
  useNodesState, 
  useEdgesState, 
  ReactFlowProvider, 
  useReactFlow, 
  MarkerType 
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';

// IMPORT THE UPDATED COMPONENTS
import { nodeTypes } from './flow/CustomNodes';
import Sidebar from './components/Sidebar';
import EditPanel from './components/EditPanel';

// --- AUTO LAYOUT CONFIGURATION ---
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));
const nodeWidth = 172;
const nodeHeight = 80; // Slightly taller for new nodes

const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      targetPosition: isHorizontal ? 'left' : 'top',
      sourcePosition: isHorizontal ? 'right' : 'bottom',
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

// Initial state
const initialNodes = [
  { id: '1', type: 'start', position: { x: 500, y: 100 }, data: { label: 'Start Workflow' } },
];

function FlowDesigner() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  
  const { setViewport, toObject } = useReactFlow();
  const fileInputRef = useRef(null);

  // --- SAVE / LOAD ---
  const onSave = useCallback(() => {
    const flow = toObject();
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(flow))}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = 'workflow-data.json';
    link.click();
  }, [toObject]);

  const onRestoreClick = () => fileInputRef.current.click();

  const onFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const flow = JSON.parse(event.target.result);
      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom });
      }
    };
    reader.readAsText(file);
    e.target.value = null;
  }, [setNodes, setEdges, setViewport]);

  // --- AUTO LAYOUT TRIGGER ---
  const onLayout = useCallback((direction) => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges, direction);
    setNodes([...layoutedNodes]);
    setEdges([...layoutedEdges]);
  }, [nodes, edges, setNodes, setEdges]);


  // Connection Logic (TURQUOISE PASTELLINES)
  const onConnect = useCallback((params) => {
    const newEdge = {
      ...params,
      type: 'smoothstep', 
      animated: true,
      style: { stroke: '#22d3ee', strokeWidth: 3 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#22d3ee' },
    };
    setEdges((eds) => addEdge(newEdge, eds));
  }, [setEdges]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('application/reactflow');
    if (!type) return;
    const position = { x: event.clientX - 200, y: event.clientY - 50 }; 
    // Default data based on type
    let defaultData = { label: `New ${type}` };
    if (type === 'condition') defaultData = { ...defaultData, condition: 'x > 5' };
    if (type === 'issue') defaultData = { ...defaultData, title: 'New Issue', severity: 'Low' };

    const newNode = {
      id: `${type}-${Date.now()}`, 
      type,
      position,
      data: defaultData, 
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  return (
    <div className="h-screen w-screen relative bg-slate-50 overflow-hidden">
      {/* PASTEL ANIMATED BACKGROUND */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="absolute left-4 top-4 z-10 h-[calc(100%-2rem)]">
         <Sidebar />
      </div>

      <div className="w-full h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={(e, node) => setSelectedNode(node)}
          onDragOver={onDragOver}
          onDrop={onDrop}
          nodeTypes={nodeTypes}
          fitView
          defaultEdgeOptions={{
            type: 'smoothstep', animated: true,
            style: { stroke: '#22d3ee', strokeWidth: 3 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#22d3ee' }
          }}
        >
          <Background color="#cbd5e1" gap={20} size={1} />
          <Controls className="!bg-white !shadow-xl !border-0 !rounded-lg !m-4 !text-gray-600" />
          
          <Panel position="top-right" className="bg-white p-2 rounded-lg shadow-xl flex gap-2 border border-gray-100">
            <button onClick={() => onLayout('TB')} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm font-medium transition-colors">Auto Layout</button>
            <button onClick={onSave} className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded text-sm font-medium transition-colors">Save JSON</button>
            <button onClick={onRestoreClick} className="px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded text-sm font-medium transition-colors">Load JSON</button>
            <input type="file" ref={fileInputRef} style={{display: 'none'}} onChange={onFileChange} accept=".json"/>
          </Panel>
        </ReactFlow>
      </div>

      {selectedNode && (
        <div className="absolute right-4 top-4 z-10 h-[calc(100%-2rem)] shadow-2xl rounded-2xl overflow-hidden">
          <EditPanel selectedNode={selectedNode} setNodes={setNodes} onClose={() => setSelectedNode(null)} />
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <FlowDesigner />
    </ReactFlowProvider>
  );
}