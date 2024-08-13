"use client";

import {
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useChat } from "ai/react";
import { FaArrowLeftLong, FaAnglesDown, FaDeleteLeft } from "react-icons/fa6";
import { ThreeDots } from "react-loader-spinner";
import { auth } from "@/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { systemPrompt } from "../page";
import { TbLogout } from "react-icons/tb";

export default function Chatbot() {
  //Init the States, Refs, and Routers
  const chatBotInfo = { ...systemPrompt };
  const [loading, setLoading] = useState(false);
  const [showScroll, setShowScroll] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const messagesContainer = useRef(null);
  const messageInput = useRef(null);
  const router = useRouter();
  const isSmallScreen = useMediaQuery("(max-width:1000px)");

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

  //Handle vh on mobile
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setVh();

    window.addEventListener("resize", setVh);

    return () => window.removeEventListener("resize", setVh);
  }, []);

  // Show loading during auth check
  if (showLoading) {
    return (
      <Box
        width="100vw"
        height="calc(var(--vh, 1vh) * 100)"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <ThreeDots
          height="200px"
          width="200px"
          color="#212529"
          ariaLabel="loading"
        />
      </Box>
    );
  }

  return (
    <Box
      width="100vw"
      height="calc(var(--vh, 1vh) * 100)"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      {/* Display */}
      <Stack
        boxShadow="0px 0px 2px black"
        direction={"column"}
        maxWidth="1000px"
        width="100%"
        height={isSmallScreen ? "100%" : "95%"}
        // border="1px solid black"
        borderRadius={!isSmallScreen && "10px"}
      >
        {/* NavBar */}
        <Box
          p="10px 15px"
          borderBottom="1px solid black"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          backgroundColor="#CED4DA"
          color="#212529"
          sx={{
            borderTopLeftRadius: !isSmallScreen && "10px",
            borderTopRightRadius: !isSmallScreen && "10px",
          }}
        >
          <Typography
            display="flex"
            alignItems="center"
            gap="10px"
            ml="10px"
            color="#57636f"
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
            <IconButton
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#57636f",
                bgcolor: "transparent",
                borderRadius: "10px",
                padding: "8px 20px",
                // border: "1px solid black",
                boxShadow: "0px 0px 2px black",
              }}
              onClick={clearMessage}
            >
              <FaDeleteLeft />
            </IconButton>
            <IconButton
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#57636f",
                bgcolor: "transparent",
                borderRadius: "10px",
                padding: "8px 20px",
                // border: "1px solid black",
                boxShadow: "0px 0px 2px black",
              }}
              onClick={onSignOut}
            >
              <TbLogout />
            </IconButton>
          </Stack>
        </Box>

        {/* Messages Display */}
        <Box
          backgroundColor="#F0F3F5"
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
                      bgcolor={message.role === "user" ? "#363c41" : "grey"}
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
              bgcolor="white"
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
                "&:hover": {
                  bgcolor: "#F8F9FA",
                },
              }}
            >
              <FaAnglesDown style={{ color: "black" }} />
            </Box>
          )}
        </Box>

        {/* Message Feature */}
        <Stack
          direction={"row"}
          spacing={2}
          p="16px 20px"
          backgroundColor="#E3E6EA"
          sx={{
            borderBottomLeftRadius: !isSmallScreen && "10px",
            borderBottomRightRadius: !isSmallScreen && "10px",
          }}
        >
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
              backgroundColor: "#ECEFF2",
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
              bgcolor: "#212529",
              p: "10px 20px",
              "&:hover": {
                bgcolor: "#3F454C",
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
