import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

interface ChatInterfaceProps {
  selectedModel: string;
  onMenuClick: () => void;
}

export default function ChatInterface({ selectedModel, onMenuClick }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const simulateStreaming = async (text: string, messageId: string) => {
    const words = text.split(' ');
    let currentText = '';

    for (let i = 0; i < words.length; i++) {
      currentText += (i > 0 ? ' ' : '') + words[i];
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, content: currentText } : msg
        )
      );
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, isStreaming: false } : msg
      )
    );
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      isStreaming: true,
    };

    setMessages((prev) => [...prev, assistantMessage]);

    const responses = [
      'Конечно! Я помогу вам с этим вопросом. Давайте разберем его по шагам.',
      'Отличный вопрос! На основе моего анализа могу предложить следующее решение.',
      'Интересная задача! Вот что я думаю по этому поводу.',
    ];

    const response = responses[Math.floor(Math.random() * responses.length)];
    await simulateStreaming(response, assistantMessageId);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen">
      <header className="border-b border-border bg-card px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Icon name="Menu" size={24} />
          </Button>
          <div>
            <h2 className="font-heading font-semibold text-lg">AI Ассистент</h2>
            <p className="text-xs text-muted-foreground">
              Модель: {selectedModel}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <Icon name="MoreVertical" size={20} />
        </Button>
      </header>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 space-y-6">
            <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center animate-fade-in">
              <Icon name="Sparkles" size={40} className="text-white" />
            </div>
            <div className="space-y-2 animate-fade-in">
              <h3 className="font-heading text-2xl font-bold text-gradient">
                Чем могу помочь?
              </h3>
              <p className="text-muted-foreground max-w-md">
                Задайте любой вопрос и получите умный ответ от ИИ-ассистента
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl animate-fade-in">
              {[
                { icon: 'Code', text: 'Помоги с программированием' },
                { icon: 'Lightbulb', text: 'Придумай креативную идею' },
                { icon: 'BookOpen', text: 'Объясни сложную тему' },
                { icon: 'PenTool', text: 'Напиши текст' },
              ].map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(suggestion.text)}
                  className="p-4 rounded-xl border border-border bg-card hover:bg-accent/50 transition-all hover:scale-105 text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg gradient-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon name={suggestion.icon} size={20} className="text-white" />
                    </div>
                    <span className="font-medium text-sm">{suggestion.text}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6 max-w-3xl mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex gap-4 animate-fade-in',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'assistant' && (
                  <Avatar className="w-8 h-8 gradient-primary flex items-center justify-center shrink-0">
                    <Icon name="Bot" size={18} className="text-white" />
                  </Avatar>
                )}
                <div
                  className={cn(
                    'rounded-2xl px-4 py-3 max-w-[80%]',
                    message.role === 'user'
                      ? 'gradient-primary text-white ml-auto'
                      : 'bg-card border border-border'
                  )}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                    {message.isStreaming && (
                      <span className="inline-block w-1 h-4 bg-current ml-1 animate-pulse" />
                    )}
                  </p>
                </div>
                {message.role === 'user' && (
                  <Avatar className="w-8 h-8 bg-secondary flex items-center justify-center shrink-0">
                    <Icon name="User" size={18} className="text-secondary-foreground" />
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="border-t border-border bg-card p-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Напишите сообщение..."
              className="min-h-[60px] max-h-[200px] pr-12 resize-none"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="absolute right-2 bottom-2 gradient-primary text-white hover:opacity-90"
            >
              <Icon name="Send" size={20} />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            ИИ может ошибаться. Проверяйте важную информацию.
          </p>
        </div>
      </div>
    </div>
  );
}
