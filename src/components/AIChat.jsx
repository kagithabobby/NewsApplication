import { useState } from 'react';
import { 
  Box, 
  Paper, 
  TextField, 
  IconButton, 
  Typography, 
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { generateResponse } from '../services/aiChatService';

function AIChat() {
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
    <Paper 
      elevation={3} 
      sx={{ 
        height: '600px',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden',
        backgroundColor: '#1a1a1a',
        color: '#ffffff'
      }}
    >
      <Box sx={{ p: 2, backgroundColor: '#2d2d2d' }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          AI News Assistant
        </Typography>
      </Box>

      <Box 
        sx={{ 
          flexGrow: 1, 
          overflow: 'auto', 
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
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
                  borderRadius: 2
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

      <Divider />

      <Box sx={{ p: 2, backgroundColor: '#2d2d2d' }}>
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
  );
}

export default AIChat; 