import { useState } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hi! I'm your ShopEZ AI Assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    const currentInput = input.toLowerCase();
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      let reply = "I'm sorry, I couldn't understand that. You can ask me about products, tracking your order, or trending items.";
      
      if (currentInput.includes('laptop') || currentInput.includes('gaming')) {
        reply = "We have some amazing gaming laptops! Check out the ASUS ROG Strix G16 or the HP Victus 16 in our Laptops category.";
      } else if (currentInput.includes('budget smartphone') || currentInput.includes('mobile')) {
        reply = "For smartphones, the OnePlus 12 is a great choice. You can filter by 'Mobiles' on the Products page!";
      } else if (currentInput.includes('trending')) {
        reply = "Currently, the Apple iPhone 15 Pro Max and Sony WH-1000XM5 headphones are trending!";
      } else if (currentInput.includes('track') || currentInput.includes('order')) {
        reply = "You can track your order by logging in and visiting the Dashboard. Make sure to check your email for updates.";
      }

      setMessages(prev => [...prev, { role: 'bot', text: reply }]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-[#ff6b00] to-[#ffb703] rounded-full flex items-center justify-center text-white shadow-lg shadow-orange-500/30 hover:scale-110 transition-transform z-50 ${isOpen ? 'hidden' : 'block'}`}
      >
        <MessageSquare size={24} />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 overflow-hidden z-50 flex flex-col"
            style={{ height: '500px', maxHeight: '80vh' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#ff6b00] to-[#ffb703] p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Bot size={22} />
                </div>
                <div>
                  <h3 className="font-bold leading-tight">AI Assistant</h3>
                  <p className="text-xs text-white/80">Typically replies instantly</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-[#1e293b] text-white rounded-br-none' 
                      : 'bg-white shadow-sm border border-gray-100 text-[#475569] rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b00] transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-10 h-10 bg-[#1e293b] text-white rounded-xl flex items-center justify-center hover:bg-[#0f172a] disabled:opacity-50 transition-all"
              >
                <Send size={16} className="ml-1" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
