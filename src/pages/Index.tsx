import { useState } from 'react';
import ChatInterface from '@/components/ChatInterface';
import Sidebar from '@/components/Sidebar';

const Index = () => {
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
      />
      <ChatInterface 
        selectedModel={selectedModel}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />
    </div>
  );
};

export default Index;
