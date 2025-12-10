export const mockAPI = {
  // Simulate saving/running the workflow [cite: 68]
  simulateWorkflow: async (nodes, edges) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Validate structure [cite: 75]
        const hasStart = nodes.some(n => n.type === 'start');
        const hasEnd = nodes.some(n => n.type === 'end');
        
        if (!hasStart || !hasEnd) {
          resolve({ success: false, message: "Workflow must have a Start and End node." });
          return;
        }

        // Return a fake step-by-step log [cite: 74]
        const steps = nodes.map(n => `Executed ${n.type} node: "${n.data.label}"`);
        resolve({ success: true, logs: steps });
      }, 1000); // Fake delay
    });
  }
};
