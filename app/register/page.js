"use client";

import {
  Box,
  Stack,
  Typography,
  TextField,
  Button,
  Divider,
  useMediaQuery,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  onAuthStateChanged,
  signInWithPopup,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth, googleProvider } from "@/firebase";
import { FaXmark, FaGoogle } from "react-icons/fa6";

const Register = () => {
  const router = useRouter();
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Error with Sign Up");
  const [emailVerify, setEmailVerify] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width:500px)");

  //Handle Google Login
  const onGoogleLogin = async () => {
    try {
      setEmailVerify(false);
      const userInfo = await signInWithPopup(auth, googleProvider);
      setShowError(false);
    } catch (error) {
      setErrorMessage("Error with Google Sign In");
      setShowError(true);
      console.log(error);
    }
  };

  //Handle Submit of Sign up
  const onSubmit = async () => {
    try {
      const userInfo = await createUserWithEmailAndPassword(
        auth,
        emailInput,
        passwordInput
      );
      setShowError(false);

      const user = userInfo.user;
      await sendEmailVerification(user);
      setEmailVerify(true);
    } catch (error) {
      setEmailVerify(false);
      if (error.code == "auth/invalid-email") {
        setErrorMessage("Enter a Valid Email");
      } else if (error.code == "auth/missing-password") {
        setErrorMessage("Please Enter a Password");
      } else if (error.code == "auth/email-already-in-use") {
        setErrorMessage("Email Already In Use");
      } else if (error.code == "auth/weak-password") {
        setErrorMessage("Password is Too Weak");
      } else {
        setErrorMessage("Error with Sign Up");
      }
      setShowError(true);
      console.log(error);
    }
  };

  //Handle Change of User
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        router.push("/");
      }
    });

    return () => unsubscribe();
  }, [router]);

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
        backgroundColor="#F0F3F5"
        boxShadow="0px 0px 2px black"
        direction={"column"}
        justifyContent="space-around"
        alignItems="center"
        maxWidth="500px"
        maxHeight={isSmallScreen ? "100%" : "550px"}
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
          gap={isSmallScreen ? "30px" : "20px"}
          width={isSmallScreen ? "80%" : "70%"}
        >
          {/* Header */}
          <Typography
            variant="h4"
            fontWeight="500"
            fontFamily={"'Poppins', sans-serif"}
          >
            Register
          </Typography>

          {/* Show Verify Email */}
          {emailVerify && (
            <Box
              width="100%"
              bgcolor="rgb(0, 255, 0, 0.2)"
              border="1.5px solid green"
              borderRadius="10px"
              p="8px 10px"
              textAlign="center"
              display="flex"
              alignItems="center"
            >
              <Typography width="100%" fontSize="15px">
                Email Verification Sent
              </Typography>

              <FaXmark
                style={{ color: "green", cursor: "pointer" }}
                onClick={() => {
                  setEmailVerify(false);
                }}
              />
            </Box>
          )}

          {/* Show Error */}
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

          {/* Email and Password */}
          <TextField
            placeholder="Email"
            sx={{
              width: "100%",
              border: "1px solid #789CA0",
              borderRadius: "4px",
            }}
            value={emailInput}
            onChange={(e) => {
              setEmailInput(e.target.value);
            }}
          />
          <TextField
            placeholder="Password"
            sx={{
              width: "100%",
              border: "1px solid #789CA0",
              borderRadius: "4px",
            }}
            value={passwordInput}
            onChange={(e) => {
              setPasswordInput(e.target.value);
            }}
          />

          {/* Submit Button */}
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
            Sign Up
          </Button>

          <Divider sx={{ width: "100%", fontSize: "15px" }}>or</Divider>

          {/* Google Sign In */}
          <Stack
            backgroundColor="#495057"
            color="white"
            boxShadow="0px 0px 1px black"
            direction={"row"}
            justifyContent="center"
            alignItems="center"
            gap="15px"
            // border="1px solid black"
            width="100%"
            p="13px 15px"
            borderRadius="10px"
            onClick={onGoogleLogin}
            mt="5px"
            sx={{
              cursor: "pointer",
              "&:hover": {
                bgcolor: "#6C757D",
              },
            }}
          >
            <FaGoogle
              style={{ width: "16px", height: "16px", color: "white" }}
            />
            <Typography fontSize="15px">Sign In with Google</Typography>
          </Stack>

          {/* Login Redirection */}
          <Typography mt="35px" fontSize="14px">
            Already have an Account? <Link href="/login">Login</Link>
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Register;
