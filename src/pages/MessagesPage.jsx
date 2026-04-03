import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, MoreVertical, Search, Check, CheckCheck, Smile, Phone, Video, ArrowLeft, Image as ImageIcon, FileText, X, MessageSquare } from 'lucide-react';
import useFinanceStore from '../store/useFinanceStore';

const EMOJIS = ['😀', '😂', '🤣', '😊', '😍', '🤔', '🙌', '👏', '🔥', '❤️', '👍', '👎', '🎉', '✨', '🚀', '💸', '💰', '💳', '✅', '❌'];

export default function MessagesPage() {
  const { 
    contacts, 
    activeChat, 
    setActiveChat, 
    chatMessages, 
    addChatMessage,
    profile,
    setActivePage,
    clearMessages,
    deleteChat
  } = useFinanceStore();

  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showSidebarMenu, setShowSidebarMenu] = useState(false);
  const [showChatMenu, setShowChatMenu] = useState(false);
  const [attachment, setAttachment] = useState(null);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const attachmentMenuRef = useRef(null);
  const sidebarMenuRef = useRef(null);
  const chatMenuRef = useRef(null);

  // Auto-select first contact if none selected
  useEffect(() => {
    if (!activeChat && contacts.length > 0) {
      setActiveChat(contacts[0].id);
    }
  }, [activeChat, contacts, setActiveChat]);

  const activeContact = contacts.find(c => c.id === activeChat) || contacts[0];
  const currentMessages = chatMessages[activeChat] || [];

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  // Handle Send
  const handleSend = (e) => {
    e?.preventDefault();
    if (!messageText.trim() && !attachment) return;
    
    addChatMessage(activeChat, messageText, attachment);
    setMessageText('');
    setAttachment(null);
    setShowEmojiPicker(false);
    setShowAttachmentMenu(false);
  };

  // Handle File Input
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setAttachment({
        type: type,
        url: event.target.result,
        name: file.name
      });
      setShowAttachmentMenu(false);
    };
    reader.readAsDataURL(file);
  };

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
      if (attachmentMenuRef.current && !attachmentMenuRef.current.contains(event.target)) {
        setShowAttachmentMenu(false);
      }
      if (sidebarMenuRef.current && !sidebarMenuRef.current.contains(event.target)) {
        setShowSidebarMenu(false);
      }
      if (chatMenuRef.current && !chatMenuRef.current.contains(event.target)) {
        setShowChatMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const filteredContacts = contacts.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Getting last message for the sidebar
  const getLastMessage = (contactId) => {
    const msgs = chatMessages[contactId];
    if (msgs && msgs.length > 0) {
      return msgs[msgs.length - 1];
    }
    return null;
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 80px)', background: 'var(--bg-primary)', overflow: 'hidden' }}>
      
      {/* Left Sidebar - Contact List */}
      <div className="messages-sidebar" style={{ 
        width: '350px', 
        borderRight: '1px solid var(--border-color)', 
        display: 'flex', 
        flexDirection: 'column', 
        background: 'var(--bg-secondary)',
        flexShrink: 0
      }}>
        {/* Header */}
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Messages</h2>
          <div ref={sidebarMenuRef}>
            <div 
              style={{ color: 'var(--text-tertiary)', cursor: 'pointer', padding: '4px', borderRadius: '50%' }}
              onClick={() => setShowSidebarMenu(!showSidebarMenu)}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <MoreVertical size={20} />
            </div>

            {/* Sidebar More Menu Dropdown */}
            {showSidebarMenu && (
              <div style={{ 
                position: 'absolute', top: '55px', right: '20px', width: '180px', 
                background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', 
                borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-xl)', padding: '6px',
                zIndex: 30, display: 'flex', flexDirection: 'column', gap: '2px'
              }}>
                <div onClick={() => { alert('New Group feature coming soon!'); setShowSidebarMenu(false); }} style={{ padding: '10px 12px', fontSize: '0.875rem', borderRadius: '4px', cursor: 'pointer', color: 'var(--text-primary)' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>New group</div>
                <div onClick={() => { alert('All your starred messages are here!'); setShowSidebarMenu(false); }} style={{ padding: '10px 12px', fontSize: '0.875rem', borderRadius: '4px', cursor: 'pointer', color: 'var(--text-primary)' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>Starred messages</div>
                <div onClick={() => { setActivePage('settings'); setShowSidebarMenu(false); }} style={{ padding: '10px 12px', fontSize: '0.875rem', borderRadius: '4px', cursor: 'pointer', color: 'var(--text-primary)' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>Settings</div>
                <div onClick={() => { alert('Logging out...'); setShowSidebarMenu(false); }} style={{ padding: '10px 12px', fontSize: '0.875rem', borderRadius: '4px', cursor: 'pointer', color: 'var(--text-primary)' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>Log out</div>
              </div>
            )}
          </div>
        </div>

        {/* Search */}
        <div style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-primary)', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <Search size={18} style={{ color: 'var(--text-tertiary)', marginRight: '10px' }} />
            <input 
              id="chat-search-input"
              type="text" 
              placeholder="Search or start new chat" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', color: 'var(--text-primary)', width: '100%', fontSize: '0.9rem' }}
            />
          </div>
        </div>

        {/* Contact List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filteredContacts.map(contact => {
            const lastMsg = getLastMessage(contact.id);
            const isActive = activeChat === contact.id;

            return (
              <div 
                key={contact.id} 
                onClick={() => setActiveChat(contact.id)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '12px 20px', 
                  cursor: 'pointer',
                  background: isActive ? 'var(--bg-hover)' : 'transparent',
                  borderLeft: isActive ? '4px solid var(--accent)' : '4px solid transparent',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = isActive ? 'var(--bg-hover)' : 'var(--bg-primary)'}
                onMouseLeave={e => e.currentTarget.style.background = isActive ? 'var(--bg-hover)' : 'transparent'}
              >
                <div style={{ position: 'relative', marginRight: '15px' }}>
                  <div style={{ 
                    width: 48, height: 48, borderRadius: '50%', 
                    backgroundColor: contact.color || 'var(--accent)', color: '#fff', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    fontSize: '18px', fontWeight: 'bold' 
                  }}>
                    {contact.initials || getInitials(contact.name)}
                  </div>
                  {/* Status Indicator */}
                  <div style={{ position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: '50%', background: 'var(--success)', border: '2px solid var(--bg-secondary)' }} />
                </div>
                
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {contact.name}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: lastMsg?.sender === 'me' ? 'var(--text-tertiary)' : 'var(--accent)' }}>
                      {lastMsg ? lastMsg.time : ''}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    {lastMsg?.sender === 'me' && <CheckCheck size={14} style={{ color: 'var(--accent)', marginRight: '4px' }} />}
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {lastMsg ? lastMsg.text : 'No messages yet...'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Pane - Active Chat Area */}
      {activeContact ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', position: 'relative' }}>
          
          {/* Default Whatsapp style pattern background overlay */}
          <div style={{ position: 'absolute', inset: 0, opacity: 0.4, backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")', pointerEvents: 'none', zIndex: 0 }} />
          
          {/* Chat Header */}
          <div style={{ padding: '15px 20px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              {/* Back button for mobile simulated */}
              <div className="mobile-only" style={{ display: 'none', cursor: 'pointer' }}><ArrowLeft /></div>
              
              <div style={{ 
                width: 40, height: 40, borderRadius: '50%', 
                backgroundColor: activeContact.color || 'var(--accent)', color: '#fff', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                fontSize: '16px', fontWeight: 'bold' 
              }}>
                {activeContact.initials || getInitials(activeContact.name)}
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 600 }}>{activeContact.name}</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Online</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', color: 'var(--text-secondary)', position: 'relative' }}>
              <Video size={20} style={{ cursor: 'pointer' }} />
              <Phone size={20} style={{ cursor: 'pointer' }} />
              
              <div ref={chatMenuRef}>
                <div 
                  style={{ cursor: 'pointer', padding: '4px', borderRadius: '50%' }}
                  onClick={() => setShowChatMenu(!showChatMenu)}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <MoreVertical size={20} />
                </div>

                {/* Chat More Menu Dropdown */}
                {showChatMenu && (
                  <div style={{ 
                    position: 'absolute', top: '40px', right: '0', width: '200px', 
                    background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', 
                    borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-xl)', padding: '6px',
                    zIndex: 30, display: 'flex', flexDirection: 'column', gap: '2px'
                  }}>
                    <div onClick={() => { alert(`Contact info: ${activeContact.name}\n${activeContact.email}`); setShowChatMenu(false); }} style={{ padding: '10px 12px', fontSize: '0.875rem', borderRadius: '4px', cursor: 'pointer', color: 'var(--text-primary)' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>Contact info</div>
                    <div onClick={() => { alert('Notifications muted.'); setShowChatMenu(false); }} style={{ padding: '10px 12px', fontSize: '0.875rem', borderRadius: '4px', cursor: 'pointer', color: 'var(--text-primary)' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>Mute notifications</div>
                    <div onClick={() => { if(window.confirm('Clear all messages for this contact?')) clearMessages(activeChat); setShowChatMenu(false); }} style={{ padding: '10px 12px', fontSize: '0.875rem', borderRadius: '4px', cursor: 'pointer', color: 'var(--text-primary)' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>Clear messages</div>
                    <div onClick={() => { if(window.confirm('Delete this chat?')) deleteChat(activeChat); setShowChatMenu(false); }} style={{ padding: '10px 12px', fontSize: '0.875rem', borderRadius: '4px', cursor: 'pointer', color: 'var(--text-primary)' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>Delete chat</div>
                    <div onClick={() => { alert('Contact blocked.'); setShowChatMenu(false); }} style={{ padding: '10px 12px', fontSize: '0.875rem', borderRadius: '4px', cursor: 'pointer', color: 'var(--danger)' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--danger-bg)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>Block</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Messages Feed */}
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px', zIndex: 1 }}>
            <div style={{ alignSelf: 'center', background: 'var(--bg-secondary)', padding: '5px 12px', borderRadius: 'var(--radius-xl)', fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '10px', border: '1px solid var(--border-color)' }}>
              Messages and calls are end-to-end encrypted. No one outside of this chat, not even Zorvyn, can read or listen to them.
            </div>

            {currentMessages.map((msg, index) => {
              const isMe = msg.sender === 'me';
              
              // Only show date separator if date changes (mocked very simply here for demonstration)
              const showDate = index === 0 || currentMessages[index - 1].date !== msg.date;

              return (
                <React.Fragment key={msg.id}>
                  {showDate && (
                    <div style={{ alignSelf: 'center', background: 'var(--bg-secondary)', padding: '5px 12px', borderRadius: 'var(--radius-xl)', fontSize: '0.75rem', color: 'var(--text-tertiary)', margin: '10px 0', border: '1px solid var(--border-color)' }}>
                      {msg.date}
                    </div>
                  )}
                  <div style={{ 
                    alignSelf: isMe ? 'flex-end' : 'flex-start',
                    maxWidth: '65%',
                    position: 'relative'
                  }}>
                    <div style={{ 
                      padding: '10px 14px', 
                      background: isMe ? 'var(--accent)' : 'var(--bg-secondary)', 
                      color: isMe ? '#fff' : 'var(--text-primary)',
                      borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                      fontSize: '0.95rem',
                      lineHeight: '1.4',
                      border: isMe ? 'none' : '1px solid var(--border-color)'
                    }}>
                      {msg.attachment && (
                        <div style={{ marginBottom: '8px' }}>
                          {msg.attachment.type === 'image' ? (
                            <img 
                              src={msg.attachment.url} 
                              alt="attachment" 
                              style={{ width: '100%', borderRadius: '12px', display: 'block' }} 
                            />
                          ) : (
                            <div style={{ 
                              background: isMe ? 'rgba(255,255,255,0.1)' : 'var(--bg-primary)',
                              padding: '10px',
                              borderRadius: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              border: isMe ? '1px solid rgba(255,255,255,0.2)' : '1px solid var(--border-color)'
                            }}>
                              <FileText size={24} />
                              <div style={{ minWidth: 0 }}>
                                <div style={{ fontSize: '0.85rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {msg.attachment.name}
                                </div>
                                <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>Document</div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {msg.text && <div>{msg.text}</div>}
                      
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'flex-end', 
                        gap: '4px',
                        marginTop: '4px',
                        fontSize: '0.65rem', 
                        color: isMe ? 'rgba(255,255,255,0.7)' : 'var(--text-tertiary)' 
                      }}>
                        {msg.time}
                        {isMe && <CheckCheck size={14} style={{ color: isMe ? '#fff' : 'var(--accent)' }} />}
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Attachment Preview Overlay */}
          {attachment && (
            <div style={{ 
              position: 'absolute', bottom: '80px', left: '20px', right: '20px', 
              background: 'var(--bg-secondary)', padding: '15px', borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)', zIndex: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', minWidth: 0 }}>
                {attachment.type === 'image' ? (
                  <img src={attachment.url} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} alt="preview" />
                ) : (
                  <div style={{ width: '40px', height: '40px', background: 'var(--bg-primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={20} style={{ color: 'var(--accent)' }} />
                  </div>
                )}
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{attachment.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{attachment.type === 'image' ? 'Photo' : 'Document'}</div>
                </div>
              </div>
              <button 
                onClick={() => setAttachment(null)}
                style={{ border: 'none', background: 'var(--bg-hover)', color: 'var(--text-secondary)', padding: '5px', borderRadius: '50%', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>
          )}

          {/* Input Area */}
          <div style={{ padding: '15px 20px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '15px', zIndex: 1, position: 'relative' }}>
            
            <div style={{ position: 'relative' }} ref={emojiPickerRef}>
              <Smile 
                size={24} 
                style={{ color: showEmojiPicker ? 'var(--accent)' : 'var(--text-secondary)', cursor: 'pointer' }} 
                onClick={() => { setShowEmojiPicker(!showEmojiPicker); setShowAttachmentMenu(false); }}
              />
              
              {showEmojiPicker && (
                <div style={{ 
                  position: 'absolute', bottom: '50px', left: '0', 
                  background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', 
                  borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)', padding: '12px',
                  width: '240px', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px',
                  zIndex: 20
                }}>
                  {EMOJIS.map(emoji => (
                    <div 
                      key={emoji} 
                      onClick={() => {
                        setMessageText(prev => prev + emoji);
                      }}
                      style={{ 
                        fontSize: '20px', cursor: 'pointer', padding: '5px', 
                        borderRadius: '8px', textAlign: 'center',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      {emoji}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ position: 'relative' }} ref={attachmentMenuRef}>
              <Paperclip 
                size={24} 
                style={{ color: showAttachmentMenu ? 'var(--accent)' : 'var(--text-secondary)', cursor: 'pointer' }} 
                onClick={() => { setShowAttachmentMenu(!showAttachmentMenu); setShowEmojiPicker(false); }}
              />

              {showAttachmentMenu && (
                <div style={{ 
                  position: 'absolute', bottom: '50px', left: '0', 
                  background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', 
                  borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)', padding: '8px',
                  width: '180px', display: 'flex', flexDirection: 'column', gap: '4px',
                  zIndex: 20
                }}>
                  <div 
                    onClick={() => imageInputRef.current.click()}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-primary)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#bf59ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                      <ImageIcon size={18} />
                    </div>
                    Photos & Videos
                  </div>
                  <div 
                    onClick={() => fileInputRef.current.click()}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-primary)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#5f66cd', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                      <FileText size={18} />
                    </div>
                    Document
                  </div>
                </div>
              )}
            </div>

            {/* Hidden Inputs */}
            <input 
              type="file" 
              ref={imageInputRef} 
              style={{ display: 'none' }} 
              accept="image/*" 
              onChange={(e) => handleFileChange(e, 'image')} 
            />
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept=".pdf,.doc,.docx,.txt" 
              onChange={(e) => handleFileChange(e, 'doc')} 
            />
            
            <form onSubmit={handleSend} style={{ flex: 1, display: 'flex' }}>
              <input 
                id="chat-input"
                type="text" 
                placeholder="Type a message" 
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                style={{ 
                  flex: 1, 
                  padding: '12px 20px', 
                  background: 'var(--bg-primary)', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: 'var(--radius-xl)',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
            </form>

            {(messageText.trim() || attachment) ? (
              <button 
                onClick={handleSend}
                style={{ 
                  width: 44, height: 44, borderRadius: '50%', background: 'var(--accent)', 
                  color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' 
                }}
              >
                <Send size={18} style={{ marginLeft: '-2px' }} />
              </button>
            ) : (
              <div style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Send size={24} style={{ color: 'var(--text-tertiary)', cursor: 'not-allowed' }} />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', zIndex: 1 }}>
          <div style={{ width: 100, height: 100, background: 'var(--bg-secondary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
            <MessageSquare size={40} style={{ color: 'var(--text-tertiary)' }} />
          </div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', fontWeight: 300, marginBottom: '10px' }}>Zorvyn Messages</h2>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>Select a contact to start messaging.</p>
        </div>
      )}
    </div>
  );
}
