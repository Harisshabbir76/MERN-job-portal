"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("https://mern-job-portal-6i94.onrender.com/login", {
        email,
        password,
      });
      const token=res.data.token
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(res.data.user)); 
        alert("Login Successful!");
        router.push("/")
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials!");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="glassmorphism p-4 text-light" style={{ width: "450px" }}>
        <h2 className="text-center fw-bold mb-3">Welcome Back</h2>
        <p className="text-center text-white">Don't have an account? <a href="/register" className="text-primary">Sign Up</a></p>
        {error && <p className="text-danger text-center">{error}</p>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control 
              type="email" 
              placeholder="Enter your email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="custom-input"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control 
              type="password" 
              placeholder="Enter your password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="custom-input"
            />
          </Form.Group>

          <Row className="mt-4">
            <Col>
              <Button variant="secondary" href="/Forgot-Password" className="btn-secondary-custom w-100">Forgot Password?</Button>
            </Col>
            <Col>
              <Button type="submit" className="btn-primary-custom w-100">Login</Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </Container>
  );
}


