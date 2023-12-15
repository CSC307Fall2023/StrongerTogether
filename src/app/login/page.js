"use client";

import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Link,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const RESEND_INTERVAL = 30; // in seconds

const theme = createTheme({
  palette: {
    primary: {
      main: '#154734',
      contrastText: '#fff',
    },
  },
});

export default function LoginPage() {
  const [name, setName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [isRegistering, setIsRegistering] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [enteredCode, setEnteredCode] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(true);

  const router = useRouter();

  const isEmailValid = (email) => {
    //regex checks for a valid email format
    // and that it ends with @calpoly.edu
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.endsWith('@calpoly.edu');
  };

  const validateEmail = () => {
    if (!isEmailValid(userEmail)) {
      setErrorMessage("Please enter a valid Cal Poly email.");
      return false;
    }

    setErrorMessage("");
    return true;
  };

  const validatePassword = () => {
    const isValid = password.length >= 8;
    setIsPasswordValid(isValid);
    if (!isValid) {
      setErrorMessage("Password should be at least 8 characters long.");
      return false;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return false;
    }

    setErrorMessage("");
    return true;
  };

  const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const verifyCode = async () => {
    if (enteredCode === verificationCode) {
      console.log("Code verified!");
      try {
        const response = await fetch("/api/users", {
          method: "POST",
          body: JSON.stringify({
            name: name,
            email: userEmail,
            password: password,
          }),
        });
  
        const data = await response.json();
        if (response.ok) {
          console.log("Account created!", data);
          router.push("/");
        } else {
          setErrorMessage(data.message || "Failed to create account.");
        }
      } catch (error) {
        setErrorMessage("Network error, please try again.");
      }
    } else {
      setErrorMessage("Incorrect verification code.");
    }
  };

  const startCountdown = () => {
    setCanResend(false);
    setCountdown(RESEND_INTERVAL);
    const interval = setInterval(() => {
        setCountdown((prevCountdown) => {
            if (prevCountdown <= 1) {
                clearInterval(interval);
                setCanResend(true);
                return 0;
            }
            return prevCountdown - 1;
        });
    }, 1000);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: "#333",
        }}
      >
        <Card
          sx={{ width: "70%", height: 650, borderRadius: 3, overflow: "hidden" }}
        >
          <Box sx={{ display: "flex", height: "100%" }}>
            <Box
              sx={{
                flex: "1 1 50%",
                height: "100%",
                backgroundImage: 'url("/images/CalPolyComplete.jpg")',
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <CardContent
              sx={{ flex: "1 1 50%", padding: "80px 120px", height: "100%" }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ marginBottom: "60px" }}
                >
                  {isRegistering ? "Register Account" : "Welcome back!"}
                </Typography>
                {isRegistering && (
                  <TextField
                    label="Name"
                    variant="outlined"
                    fullWidth
                    sx={{ marginBottom: 2 }}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={verificationSent}
                  />
                )}
                <TextField
                  label="Cal Poly email"
                  variant="outlined"
                  fullWidth
                  sx={{ marginBottom: 2 }}
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                />
                {isRegistering && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ marginBottom: 2 }}
                  >
                    Password must be 8 or more characters.
                  </Typography>
                )}
                <TextField
                  label="Password"
                  variant="outlined"
                  type="password"
                  fullWidth
                  sx={{ marginBottom: 2 }}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={verificationSent}
                />
                {isRegistering && (
                  <TextField
                    label="Reconfirm Password"
                    variant="outlined"
                    type="password"
                    fullWidth
                    sx={{ marginBottom: 2 }}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={verificationSent}
                  />
                )}
                {errorMessage && (
                  <Typography variant="body2" color="error" sx={{ marginBottom: 2 }}>
                    {errorMessage}
                  </Typography>
                )}
                {verificationSent && isPasswordValid && (
                  <>
                    <Typography
                      variant="body2"
                      color="green"
                      sx={{ marginBottom: 2 }}
                    >
                      We sent you a verification email!
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        marginBottom: 2,
                      }}
                    >
                      <TextField
                        label="Verification Code"
                        variant="outlined"
                        fullWidth
                        sx={{ flex: "1 1 auto", marginRight: 1 }}
                        value={enteredCode}
                        onChange={(e) => setEnteredCode(e.target.value)}
                      />
                      <Button
                        variant="text"
                        color="primary"
                        sx={{ marginLeft: 1 }}
                        disabled={!canResend}
                        onClick={async () => {
                          const code = generateCode();
                          setVerificationCode(code);

                          const response = await fetch("/api/login", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              email: userEmail,
                              code: code,
                            }),
                          });
                          
                          if (response.ok) {
                            setVerificationSent(true);
                            startCountdown();
                          } else {
                            setErrorMessage("Failed to send email.");
                          }
                        }}
                      >
                        {canResend ? "Resend" : `${countdown}s`}
                      </Button>
                    </Box>
                  </>
                )}
                {!isRegistering && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      marginBottom: 2,
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="primary"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}  />}
                      label={
                        <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                          Remember 30 days
                        </Typography>
                      }
                    />
                    {/* <Link
                      href="#"
                      variant="body2"
                      sx={{ fontSize: "0.8rem", alignSelf: "center" }}
                    >
                      Forgot password?
                    </Link> */}
                  </Box>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ borderRadius: 2 }}
                  onClick={async () => {
                    if (isRegistering) {
                      if (!validateEmail()) {
                        // stops if email is invalid
                        return;
                      }
                      
                      if (!verificationSent) {
                        if (validatePassword()) {
                          const code = generateCode();
                          setVerificationCode(code);

                          console.log("About to send email, userEmail is now " + userEmail);
                          const response = await fetch("/api/login", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              email: userEmail,
                              code: code,
                            }),
                          });

                          if (response.ok) {
                            setVerificationSent(true);
                            startCountdown();
                          } else {
                            console.error("Failed to send email.");
                          }
                        } else {
                          if (!validatePassword()) {
                            setErrorMessage("Password validation failed!");
                          }
                        }
                      } else {
                        // email verification code sent
                        verifyCode();
                      }
                    } else {
                      // If logging in
                      signIn("normal", {
                        email: userEmail,
                        password: password,
                        redirect: false,
                        rememberMe: rememberMe,
                      }).then((response) => {
                        if (!response.error) {
                          router.push("/");
                        } else {
                          setErrorMessage(response.error);
                        }
                      });
                    }
                  }}
                >
                  {verificationSent
                    ? "Confirm"
                    : isRegistering
                    ? "Register"
                    : "Log in"}
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  sx={{ borderRadius: 2, marginTop: 2 }}
                  onClick={() => {
                    // switch between registering and login state
                    setIsRegistering(!isRegistering);
                    // Reset states as if just started logging in process
                    if (isRegistering) {
                      setVerificationSent(false);
                      setPassword('');
                      setConfirmPassword('');
                      setEnteredCode('');
                      setIsPasswordValid(false);
                      setErrorMessage('');
                    }
                  }}
                >
                  {isRegistering ? "Back to Login" : "Register"}
                </Button>
              </Box>
            </CardContent>
          </Box>
        </Card>
      </Box>
    </ThemeProvider>
  );
}
