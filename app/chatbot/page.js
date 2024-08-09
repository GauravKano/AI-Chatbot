"use client";

import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useChat } from "ai/react";
import { FaArrowLeftLong } from "react-icons/fa6";

//Create landing page
//Create authentication
//Link go back and log out buttons
//Create middleware for the chat
//Add feature to change system prompt
//Put Name at nav
//Make shift+enter create a new line in the message
//Allow multiple languages

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "api/chat",
      initialMessages: [{ role: "assistant", content: "What do you want?" }],
    });

  const messagesContainer = useRef(null);
  const messageInput = useRef(null);

  useEffect(() => {
    const { scrollHeight, scrollTop, offsetHeight } = messagesContainer.current;
    if (scrollHeight >= scrollTop + offsetHeight) {
      messagesContainer.current?.scrollTo({
        top: scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  useEffect(() => {
    if (!isLoading) {
      messageInput.current?.querySelector("textarea:first-child")?.focus();
    }
  }, [isLoading]);

  const submitMessage = () => {
    if (input.trim() != "") {
      handleSubmit();
    }
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        direction={"column"}
        maxWidth="1000px"
        width="100%"
        height="95%"
        border="1px solid black"
        borderRadius="10px"
      >
        <Box
          p="10px 15px"
          borderBottom="1px solid black"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography display="flex" alignItems="center" gap="10px" ml="10px">
            <FaArrowLeftLong /> Go back
          </Typography>
          <Button
            sx={{
              fontSize: "14px",
              color: "#FFF",
              bgcolor: "#00B2FF",
              p: "8px 16px",
              "&:hover": {
                bgcolor: "#0075FF",
              },
              borderRadius: "8px",
            }}
          >
            Sign-Out
          </Button>
        </Box>

        {/* Messages Display */}
        <Stack
          ref={messagesContainer}
          p="16px 20px"
          direction={"column"}
          borderBottom="1px solid black"
          spacing={2}
          overflow="auto"
          maxHeight="100%"
          flexGrow={1}
          sx={{
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#f1f1f1",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#c1c1c1",
              borderRadius: "10px",
              "&:hover": {
                backgroundColor: "#a1a1a1",
              },
            },
          }}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === "user" ? "flex-end" : "flex-start"
              }
            >
              <Box
                bgcolor={message.role === "user" ? "#00B2FF" : "grey"}
                color="white"
                borderRadius={16}
                p={2}
              >
                {message.content}
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack direction={"row"} spacing={2} p="16px 20px">
          <TextField
            ref={messageInput}
            disabled={isLoading}
            placeholder="Message"
            fullWidth
            value={input}
            onChange={handleInputChange}
            multiline
            maxRows={4}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                submitMessage();
              }
            }}
            sx={{
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#f1f1f1",
                borderRadius: "10px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#c1c1c1",
                borderRadius: "10px",
                "&:hover": {
                  backgroundColor: "#a1a1a1",
                },
              },
            }}
          />
          <Button
            sx={{
              fontSize: "14px",
              color: "#FFF",
              bgcolor: "#00B2FF",
              p: "10px 20px",
              "&:hover": {
                bgcolor: "#0075FF",
              },
              borderRadius: "10px",
            }}
            onClick={submitMessage}
          >
            Send!
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
