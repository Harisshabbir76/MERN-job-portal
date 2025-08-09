"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSendCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("https://mern-job-portal-6i94.onrender.com/forgot-password", { email });
      setMessage(res.data.message);
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to send code.");
    }
  };

  const handleVerifyCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("https://mern-job-portal-6i94.onrender.com/verify-code", { email, code: verificationCode });
      setMessage(res.data.message);
      setStep(3);
    } catch (err: any) {
      setError(err.response?.data?.error || "Invalid verification code.");
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("https://mern-job-portal-6i94.onrender.com/reset-password", { email, code: verificationCode, newPassword });
      setMessage(res.data.message);
      setTimeout(() => {
        router.push("/login"); // Redirect after 2 seconds
      }, 2000);
      setStep(1);
      setEmail("");
      setVerificationCode("");
      setNewPassword("");
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to reset password.");
    }
  };

  return (
    <Container className="my-5">
      <Card className="shadow-lg p-4">
        <h3 className="text-center text-primary fw-bold">Forgot Password</h3>

        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        {step === 1 && (
          <Form onSubmit={handleSendCode}>
            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100">
              Send Verification Code
            </Button>
          </Form>
        )}

        {step === 2 && (
          <Form onSubmit={handleVerifyCode}>
            <Form.Group className="mb-3">
              <Form.Label>Enter Verification Code</Form.Label>
              <Form.Control
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100">
              Verify Code
            </Button>
          </Form>
        )}

        {step === 3 && (
          <Form onSubmit={handleResetPassword}>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" variant="success" className="w-100">
              Reset Password
            </Button>
          </Form>
        )}
      </Card>
    </Container>
  );
}
