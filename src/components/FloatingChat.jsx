import { useState } from 'react';
import { 
  Box, 
  Fab, 
  Paper, 
  TextField, 
  IconButton, 
  Typography, 
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Slide,
  Zoom,
  Collapse
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import { generateResponse } from '../services/aiChatService';

function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await generateResponse(userMessage);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 2
      }}
    >
      {/* Chat Window */}
      <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
        <Paper 
          elevation={8} 
          sx={{ 
            width: { xs: 'calc(100vw - 48px)', sm: 400 },
            height: { xs: 'calc(100vh - 200px)', sm: 600 },
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 2,
            overflow: 'hidden',
            backgroundColor: '#1a1a1a',
            color: '#ffffff',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Header */}
          <Box 
            sx={{ 
              p: 2, 
              backgroundColor: '#2d2d2d',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              AI News Assistant
            </Typography>
            <IconButton 
              onClick={() => setIsOpen(false)}
              sx={{ 
                color: '#ffffff',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Messages */}
          <Box 
            sx={{ 
              flexGrow: 1, 
              overflow: 'auto', 
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: '#1a1a1a',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#6366F1',
                borderRadius: '4px',
              },
            }}
          >
            <List>
              {messages.map((message, index) => (
                <ListItem 
                  key={index}
                  sx={{
                    justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                    mb: 1
                  }}
                >
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      maxWidth: '80%',
                      backgroundColor: message.role === 'user' ? '#6366F1' : '#2d2d2d',
                      borderRadius: 2,
                      transition: 'transform 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                      }
                    }}
                  >
                    <ListItemText
                      primary={message.content}
                      sx={{
                        color: '#ffffff',
                        '& .MuiListItemText-primary': {
                          whiteSpace: 'pre-wrap'
                        }
                      }}
                    />
                  </Paper>
                </ListItem>
              ))}
              {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                  <CircularProgress size={24} sx={{ color: '#6366F1' }} />
                </Box>
              )}
            </List>
          </Box>

          {/* Input */}
          <Box 
            sx={{ 
              p: 2, 
              backgroundColor: '#2d2d2d',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Ask me anything about the news..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                sx={{
                  backgroundColor: '#1a1a1a',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    color: '#ffffff',
                    '& fieldset': {
                      borderColor: '#404040',
                    },
                    '&:hover fieldset': {
                      borderColor: '#6366F1',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#6366F1',
                    },
                  },
                }}
              />
              <IconButton 
                onClick={handleSend}
                disabled={loading || !input.trim()}
                sx={{ 
                  backgroundColor: '#6366F1',
                  color: '#ffffff',
                  '&:hover': {
                    backgroundColor: '#4F46E5',
                  },
                  '&.Mui-disabled': {
                    backgroundColor: '#404040',
                    color: '#666666',
                  },
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      </Slide>

      {/* Floating Button */}
      <Zoom in={!isOpen}>
        <Fab
          color="primary"
          onClick={() => setIsOpen(true)}
          sx={{
            backgroundColor: '#6366F1',
            '&:hover': {
              backgroundColor: '#4F46E5',
            },
            boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
          }}
        >
          <ChatIcon />
        </Fab>
      </Zoom>
    </Box>
  );
}

export default FloatingChat; 