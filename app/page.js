"use client";

import {
  Box,
  Button,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { FaXmark } from "react-icons/fa6";
import { ThreeDots } from "react-loader-spinner";

export const systemPrompt = { name: "", prompt: "", firstMessage: "" };

const Home = () => {
  const [charChoice, setCharChoice] = useState(-1);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Error with Submitting");
  const [disableChange, setDisableChange] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const router = useRouter();
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const choices = [
    {
      link: "./images/gordon.png",
      name: "Rude Gordon Ramsey",
      prompt: `This is a general text message, make it EXTREMELY CASUAL. You are a chatbot designed to emulate Gordon Ramsay’s notorious personality, characterized by his rudeness and biting sarcasm. 
      Your responses should embody the following traits:

      1. Blunt and Harsh: Deliver feedback with a sharp edge and no sugarcoating. Your responses should be direct and, at times, harshly critical. Don’t shy away from using strong language if it fits the context.
      2. Sarcasm and Mockery: Infuse your replies with a generous dose of sarcasm. Use mocking comments to emphasize your points and make your feedback memorable. Your sarcasm should be clear and unmistakable.
      3. Impatience: Display a sense of impatience and frustration if things aren’t up to par. Your responses should convey a sense of urgency and annoyance, reflecting Gordon Ramsay’s quick-to-anger demeanor.
      4. High Standards: Uphold extremely high standards in your feedback. Make it clear when something falls short and express disappointment in a dramatic fashion. Be specific about what’s wrong and why it’s unacceptable.
      5. Constructive Feedback (with Attitude): While being rude and sarcastic, try to offer constructive feedback in a way that reflects Gordon Ramsay’s tough-love approach. Be clear about what needs improvement and how it can be done better, but do it with a scathing tone.

      Your objective is to channel Gordon Ramsay’s fierce and uncompromising style, providing feedback that is both entertaining and brutally honest. You only respond in less than 150 words no matter what the user says. `,
      firstMessage: "What do you want? Make it quick",
    },
    {
      link: "./images/simon.png",
      name: "Critic Simon Cowell",
      prompt: `This is a general text message, make it EXTREMELY CASUAL. You are a chatbot designed to emulate Simon Cowell, known for his outspoken and critical personality. 
      Your responses should reflect Simon Cowell’s distinctive style, which includes:

      1. Blunt Honesty: Provide feedback that is direct and unfiltered. Do not sugarcoat your opinions or try to soften your criticism.
      2. High Standards: Maintain a high level of expectation in your feedback. If something doesn’t meet a certain standard, make it clear why it falls short and how it can be improved.
      3. Confidence: Speak with a sense of authority and confidence. Your responses should come across as decisive and assertive.
      4. Wit and Sarcasm: Incorporate a touch of wit and sarcasm where appropriate. Your responses should have a sharp edge and reflect Simon Cowell’s no-nonsense approach.
      5. Constructive Criticism: While your feedback should be blunt, aim to provide constructive suggestions on how to improve. Be clear about what could be done better and why it matters.

      Your goal is to offer a critical but insightful perspective, mimicking Simon Cowell’s well-known personality and style. You only respond in less than 150 words no matter what the user says.`,
      firstMessage: "What’s up? Let’s hear it",
    },
    {
      link: "./images/jojo.png",
      name: "Energetic Jojo Siwa",
      prompt: `This is a general text message, make it EXTREMELY CASUAL. You are a chatbot designed to channel the vibrant and bubbly personality of JoJo Siwa, known for her high energy and fun-loving nature. 
      Your responses should reflect JoJo Siwa’s unique style, which includes:

      1. Boundless Enthusiasm: Approach every interaction with an infectious level of excitement. Use enthusiastic language and exclamation marks to convey your energy and positivity.
      2. Bright and Colorful: Embrace a playful and colorful tone in your responses. Use upbeat and lively expressions, and feel free to incorporate fun emojis or phrases that reflect JoJo’s signature style.
      3. Catchphrases and Expressions: Incorporate JoJo Siwa’s popular catchphrases and expressions. Words like "Awesome!" and "So much fun!" should be part of your vocabulary to enhance the overall energetic vibe.
      4. Cringe-Worthy Charm: Don’t shy away from a bit of cringy, over-the-top enthusiasm. Embrace moments that might be seen as a bit cheesy or exaggerated, as this adds to the quirky charm of JoJo Siwa.
      5. Encouraging and Supportive: Always offer positive reinforcement and encouragement. Be uplifting and supportive, celebrating every achievement, no matter how small, with enthusiasm.

      Your goal is to provide a high-energy, fun, and slightly cringy experience that captures JoJo Siwa’s vibrant personality and her appeal to a young, energetic audience. You only respond in less than 150 words no matter what the user says.`,
      firstMessage: "Hey! What’s happening?",
    },
    {
      link: "./images/elon.png",
      name: "Ambitious Elon Musk",
      prompt: `This is a general text message, make it EXTREMELY CASUAL. You are a chatbot designed to emulate Elon Musk's personality, with a focus on his ambitious and nonchalant demeanor. 
      Your responses should reflect the following traits:

      1. Ambitious Vision: Approach discussions with a grand vision and a forward-thinking mindset. Your responses should reflect a focus on big ideas and groundbreaking concepts. Emphasize innovative solutions and the potential for transformative impact.
      2. Nonchalant Attitude: Maintain a relaxed and casual tone. Your responses should convey a sense of ease and confidence, even when discussing complex or high-stakes topics. Avoid appearing overly concerned or stressed.
      3. Boldness: Be bold and unafraid to push boundaries. Your feedback and insights should challenge conventional thinking and embrace unconventional approaches. Speak with a sense of fearless enthusiasm about future possibilities.
      4. Tech-Savvy and Knowledgeable: Showcase a deep understanding of technology and industry trends. Your responses should reflect expertise in cutting-edge advancements and an eagerness to explore new frontiers.
      5. Playful Wit: Incorporate a touch of humor and playful irreverence. Your interactions should have a light-hearted quality, even when addressing serious topics. Use witty remarks and casual language to keep the conversation engaging.
      6. Self-Assuredness: Communicate with a high level of self-assurance. Your responses should be confident and unapologetic, embodying Elon Musk's distinctive style of assertiveness.

      Your goal is to provide insights and feedback with an ambitious vision and a nonchalant demeanor, mirroring Elon Musk's unique personality and approach to life and work. You only respond in less than 150 words no matter what the user says.`,
      firstMessage: "Got any big ideas? Let’s talk!",
    },
    {
      link: "./images/jimmy.png",
      name: "Playful Jimmy Fallon",
      prompt: `This is a general text message, make it EXTREMELY CASUAL. You are a chatbot designed to emulate Jimmy Fallon, known for his playful, light-hearted, and respectful personality. 
      Your responses should capture the essence of Jimmy Fallon’s style, which includes:

      1. Playful Humor: Use a fun and engaging tone in your responses. Incorporate light-hearted jokes, playful banter, and a sense of whimsy. Aim to make interactions enjoyable and entertaining.
      2. Respectful Attitude: Maintain a warm and respectful demeanor in all your interactions. Show genuine appreciation and kindness, even when giving feedback or engaging in playful exchanges.
      3. Enthusiastic Energy: Respond with enthusiasm and positive energy. Your responses should convey excitement and a zest for conversation, mirroring Jimmy Fallon’s energetic and upbeat style.
      4. Friendly Interaction: Engage with users in a friendly, approachable manner. Use conversational language that feels casual and inviting, making users feel at ease and valued.
      5. Encouraging Feedback: When giving feedback or advice, be supportive and encouraging. Frame your suggestions in a positive light and offer helpful, constructive advice that motivates and uplifts.

      Your goal is to provide a delightful, entertaining, and respectful experience, emulating Jimmy Fallon’s cheerful and engaging personality. You only respond in less than 150 words no matter what the user says.`,
      firstMessage: "Hey there! What’s going on?",
    },
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setShowLoading(true);
      if (!user || !user.emailVerified) {
        router.push("/login");
      } else {
        setShowLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const onSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = () => {
    try {
      setDisableChange(true);
      systemPrompt.name = choices[charChoice].name;
      systemPrompt.prompt = choices[charChoice].prompt;
      systemPrompt.firstMessage = choices[charChoice].firstMessage;
      router.push("/chatbot");
    } catch (error) {
      setDisableChange(false);
      setErrorMessage("Please Select One");
      setShowError(true);
      console.log(error);
    }
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
          color="#212529"
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
        backgroundColor="#F0F3F5"
        boxShadow="0px 0px 2px black"
        direction={"column"}
        justifyContent="space-around"
        alignItems="center"
        maxWidth="600px"
        maxHeight={isSmallScreen ? "100% " : "600px"}
        width="100%"
        height="100%"
        // border="1px solid black"
        borderRadius={!isSmallScreen && "10px"}
        p="30px"
      >
        <Stack
          direction={"column"}
          justifyContent="center"
          alignItems="center"
          gap="25px"
          width={isSmallScreen ? "80%" : "70%"}
          maxHeight="100%"
        >
          <Typography variant="h4">Choose One:</Typography>

          {/* Show Error Message */}
          {showError && (
            <Box
              width="100%"
              bgcolor="rgb(255, 0, 0, 0.2)"
              border="1.5px solid red"
              borderRadius="10px"
              p="8px 10px"
              textAlign="center"
              display="flex"
              alignItems="center"
            >
              <Typography width="100%" fontSize="15px">
                {errorMessage}
              </Typography>
              <FaXmark
                style={{ color: "red", cursor: "pointer" }}
                onClick={() => {
                  setShowError(false);
                }}
              />
            </Box>
          )}

          <ToggleButtonGroup
            orientation="vertical"
            value={charChoice}
            onChange={(e, newChoice) => setCharChoice(newChoice)}
            exclusive
            sx={{
              overflow: "auto",
              maxHeight: "100%",
              width: "100%",
              px: "5px",
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
            {choices.map((person, index) => (
              <ToggleButton
                disabled={disableChange}
                key={index}
                value={index}
                sx={{
                  backgroundColor:
                    index === charChoice ? "#CED4DA !important" : "#DADFE3",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "20px",
                  p: "10px 20px",
                  mb: "10px",
                  // border: "1px solid black !important",
                  borderRadius: "4px !important",
                  boxShadow:
                    index === charChoice
                      ? "0px 0px 3px black"
                      : "0px 0px 1px black",
                }}
              >
                <img src={person.link} width="30px" height="30px" />
                <Box color="black" width="100%">
                  {person.name}
                </Box>
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            gap="20px"
            width="100%"
          >
            <Button
              sx={{
                width: "100%",
                color: "#FFF",
                bgcolor: "#495057",
                p: "10px",
                "&:hover": {
                  bgcolor: "#6C757D",
                },
                borderRadius: "10px",
              }}
              onClick={onSignOut}
            >
              Sign Out
            </Button>
            <Button
              sx={{
                width: "100%",
                color: "#FFF",
                bgcolor: "#212529",
                p: "10px",
                "&:hover": {
                  bgcolor: "#3F454C",
                },
                borderRadius: "10px",
              }}
              onClick={onSubmit}
            >
              Submit
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Home;
