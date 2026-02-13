import { useEffect, useState } from 'react';
import { MonnaLogo } from './MonnaLogo';

interface Message {
  type: 'user' | 'monna';
  text?: string;
  html?: string;
  time: string;
}

interface Conversation {
  messages: Message[];
}

const conversations: Conversation[] = [
  {
    messages: [
      {
        type: 'user',
        text: 'Monna adiciona pão, manteiga, feijão e leite. Já comprei maçã!',
        time: '09:32'
      },
      {
        type: 'monna',
        html: `Prontinho! ✅<br/><br/>🛒 <b>Mercado</b><br/>⬜ Pão<br/>⬜ Manteiga<br/>⬜ Feijão<br/>⬜ Leite<br/><br/>✔️ Maçã <span style="opacity:0.6">(já comprado)</span>`,
        time: '09:32'
      }
    ]
  },
  {
    messages: [
      {
        type: 'user',
        text: 'Me lembra de pagar a conta de luz todo dia 6',
        time: '10:15'
      },
      {
        type: 'monna',
        html: `✅ Anotado! Vou te lembrar:<br/><br/>📌 <b>Pagar conta de luz</b><br/>🔄 Todo dia 6`,
        time: '10:15'
      },
      {
        type: 'user',
        text: 'Avisa minha mãe pra não esquecer o remédio do Lucas',
        time: '10:16'
      },
      {
        type: 'monna',
        html: `✅ Recado enviado para sua mãe!<br/>💬 "Não esquecer o remédio do Lucas"`,
        time: '10:16'
      }
    ]
  }
];

export function ChatAnimation() {
  const [currentConv, setCurrentConv] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const conversation = conversations[currentConv];
    const totalMessages = conversation.messages.length;

    if (visibleMessages >= totalMessages) {
      // All messages shown, wait then switch conversation
      const timeout = setTimeout(() => {
        setVisibleMessages(0);
        setCurrentConv((prev) => (prev + 1) % conversations.length);
      }, 4000);
      return () => clearTimeout(timeout);
    }

    const nextMessage = conversation.messages[visibleMessages];
    
    if (nextMessage.type === 'monna') {
      // Show typing indicator before Monna's message
      setIsTyping(true);
      const typingTimeout = setTimeout(() => {
        setIsTyping(false);
        setVisibleMessages((prev) => prev + 1);
      }, 1500);
      return () => clearTimeout(typingTimeout);
    } else {
      // Show user message after delay
      const messageTimeout = setTimeout(() => {
        setVisibleMessages((prev) => prev + 1);
      }, 1000);
      return () => clearTimeout(messageTimeout);
    }
  }, [currentConv, visibleMessages]);

  const conversation = conversations[currentConv];

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="bg-primary px-4 pt-10 pb-3 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-foreground/15 rounded-md flex items-center justify-center">
          <MonnaLogo className="h-5 w-auto" strokeColor="rgba(249,243,237,0.9)" />
        </div>
        <div>
          <h4 className="text-primary-foreground font-medium text-sm">Monna</h4>
          <p className="text-primary-foreground/70 text-xs">online</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-3 bg-gradient-to-b from-secondary to-secondary/90 flex flex-col gap-2 overflow-hidden min-h-[380px]">
        {conversation.messages.slice(0, visibleMessages).map((msg, index) => (
          <div
            key={`${currentConv}-${index}`}
            className={`max-w-[88%] p-2 px-3 text-xs leading-relaxed rounded-lg shadow-sm animate-fade-in ${
              msg.type === 'user'
                ? 'self-end bg-accent rounded-br-sm'
                : 'self-start bg-card rounded-bl-sm'
            }`}
          >
            {msg.html ? (
              <div dangerouslySetInnerHTML={{ __html: msg.html }} />
            ) : (
              <p>{msg.text}</p>
            )}
            <p className="text-[10px] text-foreground/40 text-right mt-1">{msg.time}</p>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="self-start bg-card p-2 px-3 rounded-lg rounded-bl-sm shadow-sm animate-fade-in">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
