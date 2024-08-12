"use client";

import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useChat } from "ai/react";
import { FaArrowLeftLong, FaAnglesDown } from "react-icons/fa6";
import { ThreeDots } from "react-loader-spinner";
import { auth } from "@/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { systemPrompt } from "../page";

export default function Chatbot() {
  //Init the States, Refs, and Routers
  const chatBotInfo = { ...systemPrompt };
  const [loading, setLoading] = useState(false);
  const [showScroll, setShowScroll] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const messagesContainer = useRef(null);
  const messageInput = useRef(null);
  const router = useRouter();

  //Handle the API
  const {
    messages,
    setMessages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
  } = useChat({
    api: "api/chat",
    initialMessages: [
      { role: "system", content: chatBotInfo.prompt },
      { role: "assistant", content: chatBotInfo.firstMessage },
    ],
    onResponse: () => setLoading(false),
  });

  //Handle Change in User
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setShowLoading(true);
      if (!user || !user.emailVerified) {
        router.push("/login");
      } else {
        if (
          !chatBotInfo.name ||
          !chatBotInfo.prompt ||
          !chatBotInfo.firstMessage
        ) {
          router.push("/");
        } else {
          setShowLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, [router]);

  //Create Auto Scroll
  useEffect(() => {
    if (messagesContainer.current) {
      const { scrollHeight, scrollTop, offsetHeight } =
        messagesContainer.current;
      if (scrollHeight >= scrollTop + offsetHeight) {
        messagesContainer.current?.scrollTo({
          top: scrollHeight,
          behavior: "smooth",
        });
      }
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

  // Handle Go Back Button
  const onGoBack = () => {
    try {
      router.push("/");
    } catch (error) {
      console.log(error);
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

  //Handle Clear Message
  const clearMessage = () => {
    stop();
    setLoading(false);
    setMessages([
      { role: "system", content: chatBotInfo.prompt },
      { role: "assistant", content: chatBotInfo.firstMessage },
    ]);
    setShowScroll(false);
    setInput("");
  };

  //Add event listener for Message Scroll
  useEffect(() => {
    if (messagesContainer.current) {
      const handleScroll = () => {
        const { scrollHeight, scrollTop, offsetHeight } =
          messagesContainer.current;

        if (scrollHeight - 50 >= scrollTop + offsetHeight) {
          setShowScroll(true);
        } else {
          setShowScroll(false);
        }
      };
      // console.log("Hello World");
      messagesContainer.current.addEventListener("scroll", handleScroll);

      return () =>
        messagesContainer.current?.removeEventListener("scroll", handleScroll);
    }
  }, [messagesContainer.current]);

  //Handle the Scroll Click
  const scrollClick = () => {
    const { scrollHeight } = messagesContainer.current;
    messagesContainer.current?.scrollTo({
      top: scrollHeight,
      behavior: "smooth",
    });
  };

  if (showLoading) {
    return (
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <ThreeDots
          height="200px"
          width="200px"
          color="black"
          ariaLabel="loading"
        />
      </Box>
    );
  }

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
        {/* NavBar */}
        <Box
          p="10px 15px"
          borderBottom="1px solid black"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            display="flex"
            alignItems="center"
            gap="10px"
            ml="10px"
            sx={{ cursor: "pointer" }}
            onClick={onGoBack}
          >
            <FaArrowLeftLong /> Go back
          </Typography>
          <Stack
            direction={"row"}
            alignItems="center"
            justifyContent="center"
            gap="15px"
          >
            <Button
              sx={{
                fontSize: "14px",
                color: "#FFF",
                bgcolor: "#00B2FF",
                p: "8px 20px",
                "&:hover": {
                  bgcolor: "#0075FF",
                },
                borderRadius: "8px",
              }}
              onClick={clearMessage}
            >
              Clear
            </Button>
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
          </Stack>
        </Box>

        {/* Messages Display */}
        <Box
          borderBottom="1px solid black"
          maxHeight="100%"
          flexGrow={1}
          overflow="hidden"
          position="relative"
        >
          <Stack
            ref={messagesContainer}
            p="16px 20px"
            direction={"column"}
            spacing={2}
            height="100%"
            overflow="auto"
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
            {messages.map(
              (message, index) =>
                (message.role === "user" || message.role === "assistant") && (
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
                      borderRadius="25px"
                      maxWidth="75%"
                      p={2.5}
                    >
                      {message.content}
                    </Box>
                  </Box>
                )
            )}
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

          {/* Show Scroll Button */}
          {showScroll && !isLoading && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              bgcolor="#424242"
              onClick={scrollClick}
              sx={{
                boxShadow: "0px 0px 3px black",
                position: "absolute",
                bottom: "20px",
                right: "25px",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                zIndex: 10,
                cursor: "pointer",
              }}
            >
              <FaAnglesDown style={{ color: "white" }} />
            </Box>
          )}
        </Box>

        {/* Message Feature */}
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
