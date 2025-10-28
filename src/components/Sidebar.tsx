import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
}

const aiModels = [
  { value: 'gpt-4', label: 'GPT-4', icon: 'Sparkles' },
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo', icon: 'Zap' },
  { value: 'claude-3-opus', label: 'Claude 3 Opus', icon: 'Brain' },
  { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet', icon: 'MessageSquare' },
  { value: 'gemini-pro', label: 'Gemini Pro', icon: 'Star' },
];

const menuItems = [
  { id: 'prompts', label: 'Промпты', icon: 'FileText' },
  { id: 'history', label: 'История', icon: 'History' },
  { id: 'profile', label: 'Профиль', icon: 'User' },
  { id: 'settings', label: 'Настройки', icon: 'Settings' },
  { id: 'help', label: 'Помощь', icon: 'HelpCircle' },
];

export default function Sidebar({ isOpen, onToggle, selectedModel, onModelChange }: SidebarProps) {
  return (
    <>
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar text-sidebar-foreground transition-transform duration-300',
          isOpen ? 'translate-x-0 w-72' : '-translate-x-full w-0'
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Icon name="Bot" size={20} className="text-white" />
            </div>
            <h1 className="font-heading font-bold text-lg">AI Chat</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="p-4 space-y-2">
          <label className="text-xs font-medium text-sidebar-foreground/70 uppercase tracking-wide">
            Модель ИИ
          </label>
          <Select value={selectedModel} onValueChange={onModelChange}>
            <SelectTrigger className="w-full bg-sidebar-accent border-sidebar-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {aiModels.map((model) => (
                <SelectItem key={model.value} value={model.value}>
                  <div className="flex items-center gap-2">
                    <Icon name={model.icon} size={16} />
                    <span>{model.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator className="bg-sidebar-border" />

        <ScrollArea className="flex-1">
          <nav className="p-2 space-y-1">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <Icon name={item.icon} size={20} className="mr-3" />
                {item.label}
              </Button>
            ))}
          </nav>
        </ScrollArea>

        <div className="p-4 border-t border-sidebar-border">
          <Button className="w-full gradient-primary text-white hover:opacity-90">
            <Icon name="Plus" size={20} className="mr-2" />
            Новый чат
          </Button>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onToggle}
        />
      )}
    </>
  );
}