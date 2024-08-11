"use client";

import {
  Box,
  Stack,
  TextField,
  Typography,
  Button,
  InputAdornment,
} from "@mui/material";
import { Divider } from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth, googleProvider } from "@/firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { FaXmark, FaEye, FaEyeSlash } from "react-icons/fa6";

//Create middleware for the chat
//Put Name at nav
//Make shift+enter create a new line in the message
//Allow multiple languages

const Login = () => {
  //Init States, Refs, and Routers
  const router = useRouter();
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Error with Sign In");

  //Change Show Password
  const changeShowPassword = () => {
    setShowPassword(!showPassword);
  };

  //Handle Email and Passwork Submit
  const onSubmit = async () => {
    try {
      const userInfo = await signInWithEmailAndPassword(
        auth,
        emailInput,
        passwordInput
      );
      setShowError(false);

      if (userInfo.user?.emailVerified === false) {
        setErrorMessage("Email Verification Needed");
        setShowError(true);
      }
    } catch (error) {
      if (error.code == "auth/invalid-email") {
        setErrorMessage("Enter a Valid Email");
      } else if (error.code == "auth/missing-password") {
        setErrorMessage("Please Enter a Password");
      } else if (error.code == "auth/invalid-credential") {
        setErrorMessage("Invalid Email or Password");
      } else {
        setErrorMessage("Error with Sign In");
      }

      setShowError(true);
      console.log(error);
    }
  };

  //Handle Google Login
  const onGoogleLogin = async () => {
    try {
      const userInfo = await signInWithPopup(auth, googleProvider);
      setShowError(false);
    } catch (error) {
      setErrorMessage("Error with Google Sign In");
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
        justifyContent="space-around"
        alignItems="center"
        maxWidth="500px"
        maxHeight="550px"
        width="100%"
        height="100%"
        border="1px solid black"
        borderRadius="10px"
        p="30px"
      >
        <Stack
          direction={"column"}
          justifyContent="center"
          alignItems="center"
          gap="20px"
          width="70%"
        >
          {/* Header */}
          <Typography
            variant="h4"
            fontWeight="500"
            fontFamily={"'Poppins', sans-serif"}
          >
            Login
          </Typography>

          {/* Error Message */}
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
            sx={{ width: "100%" }}
            value={emailInput}
            onChange={(e) => {
              setEmailInput(e.target.value);
            }}
          />
          <TextField
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            sx={{ width: "100%" }}
            value={passwordInput}
            onChange={(e) => {
              setPasswordInput(e.target.value);
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {showPassword ? (
                    <FaEyeSlash
                      style={{
                        width: "20px",
                        height: "20px",
                        cursor: "pointer",
                      }}
                      onClick={changeShowPassword}
                    />
                  ) : (
                    <FaEye
                      style={{
                        width: "20px",
                        height: "20px",
                        cursor: "pointer",
                      }}
                      onClick={changeShowPassword}
                    />
                  )}
                </InputAdornment>
              ),
            }}
          />

          {/* Submit Button */}
          <Button
            sx={{
              width: "100%",
              color: "#FFF",
              bgcolor: "black",
              p: "10px 10px",
              "&:hover": {
                bgcolor: "grey",
              },
              borderRadius: "10px",
            }}
            onClick={onSubmit}
          >
            Sign In
          </Button>

          <Divider sx={{ width: "100%", fontSize: "15px" }}>or</Divider>
          {/* Google Login */}
          <Stack
            direction={"row"}
            justifyContent="center"
            alignItems="center"
            gap="15px"
            border="1px solid black"
            width="100%"
            p="13px 15px"
            borderRadius="10px"
            onClick={onGoogleLogin}
            mt="5px"
            sx={{ cursor: "pointer" }}
          >
            <FcGoogle style={{ width: "18px", height: "18px" }} />
            <Typography>Sign In with Google</Typography>
          </Stack>

          {/* Register Redirection */}
          <Typography mt="35px" fontSize="14px">
            Don&apos;t have an Account? <Link href="/register">Register</Link>
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Login;
