'use client'
import { useState } from 'react';
import { Box, Stack, Button, TextField, Typography, useMediaQuery, useTheme, CircularProgress } from '@mui/material';

import Image from './tcubg.jpeg';  // Correct path for import

export default function Home() {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: 'Hi, I am the Unofficial TCU Support Agent. How can I assist you today? You can also feed me a Youtube url and ask me a question based on it',
  }]);

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const sendMessage = async () => {
    setMessage('');
    setIsLoading(true);

    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ]);

    const payload = {
      messages: [...messages, { role: 'user', content: message }]
    };

    await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    }).then(async (res) => {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let result = '';
      reader.read().then(function processText({ done, value }) {
        if (done) {
          setIsLoading(false);
          return result;
        }
        const text = decoder.decode(value || new Int8Array(), { stream: true });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            {
              ...lastMessage,
              content: lastMessage.content + text,
            },
          ];
        });
        return reader.read().then(processText);
      });
    });
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{
        backgroundImage: `url(${Image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Typography variant="h2" gutterBottom component="h1" sx={{
        color: '#4d1979',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        mb: 4,
        textShadow: '0 0 8px rgba(255,255,255,0.8), 0 0 10px rgba(255,255,255,0.5)', // Adding glow effect
        fontSize: '2.5rem',  // Adjust font size as needed
      }}>
        TCU-GPT
      </Typography>
      <Stack
        direction="column"
        width={isMobile ? '90%' : '600px'}
        height={isMobile ? '90%' : '700px'}
        border="1px solid #4d1979"
        borderRadius={2}
        p={2}
        spacing={3}
        sx={{
          bgcolor: 'rgba(255, 255, 255, 0.8)',
          overflow: 'hidden',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Stack
          direction="column"
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
          sx={{ paddingRight: '5px' }} // Prevents scrollbar from covering content
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display='flex'
              justifyContent={message.role === 'assistant' ? 'flex-start' : 'flex-end'}
            >
              <Box
                bgcolor={message.role === 'assistant' ? '#4d1979' : '#000000'}
                color="white"
                borderRadius={10}
                p={2}
                maxWidth="85%"
              >
                {message.content}
              </Box>
            </Box>
          ))}
          {isLoading && (
            <Box display="flex" justifyContent="flex-start">
              <CircularProgress color="secondary" size={24} />
            </Box>
          )}
        </Stack>

        <Stack direction="row" spacing={2}>
          <TextField
            label='Grunt Your Questions! Ex: Upcoming Events?'
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            variant="outlined"
          />
          <Button
            variant="contained"
            sx={{
              borderRadius: 35,
              backgroundColor: "#4d1979",
              padding: "18px 36px",
              '&:hover': {
                backgroundColor: "#3c1451",
              },
            }}
            onClick={sendMessage}
          >
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
