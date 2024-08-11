"use client";

import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useChat } from "ai/react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { ThreeDots } from "react-loader-spinner";
import { auth } from "@/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Chatbot() {
  //Init the States, Refs, and Routers
  const [loading, setLoading] = useState(false);
  const messagesContainer = useRef(null);
  const messageInput = useRef(null);
  const router = useRouter();

  //Handle the API
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "api/chat",
      initialMessages: [{ role: "assistant", content: "What do you want?" }],
      onResponse: () => setLoading(false),
    });

  //Create Auto Scroll
  useEffect(() => {
    const { scrollHeight, scrollTop, offsetHeight } = messagesContainer.current;
    if (scrollHeight >= scrollTop + offsetHeight) {
      messagesContainer.current?.scrollTo({
        top: scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  //Auto Focus on the Message Input
  useEffect(() => {
    if (!isLoading) {
      messageInput.current?.querySelector("textarea:first-child")?.focus();
    }
  }, [isLoading]);

  //Handle Submit of the Message Input
  const submitMessage = () => {
    if (input.trim() != "") {
      setLoading(true);
      handleSubmit();
    }
  };

  //Handle User Sign Out
  const onSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
    }
  };

  //Handle Change in User
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/");
      }
    });

    return () => unsubscribe();
  }, [router]);

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
            onClick={onSignOut}
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
          {loading && (
            <Box display="flex" justifyContent="flex-start">
              <Box bgcolor="grey" borderRadius={16} p="14px">
                <ThreeDots
                  height="25px"
                  width="25px"
                  color="white"
                  ariaLabel="loading"
                />
              </Box>
            </Box>
          )}
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
