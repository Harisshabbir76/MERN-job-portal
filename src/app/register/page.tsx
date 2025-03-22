"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import axios from "axios";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge]=useState("");
  const[role, setRole] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/register", {
        name,
        email,
        password,
        age,
        role,
      });

      console.log("User registered:", res.data);
      alert("Registration Successful!");
      if (role === "Looking for job"){
        router.push("/jobs");
      }else if (role === "Hiring job"){
        router.push("/hire");
      }else{
        router.push("/profile");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="glassmorphism p-4 text-light" style={{ width: "450px" }}>
        <h2 className="text-center fw-bold mb-3">Create new account</h2>
        <p className="text-center text-white">Already a Member? <a href="/" className="text-primary">Log In</a></p>
        {error && <p className="text-danger text-center">{error}</p>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Enter your full name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="custom-input"
            />
          </Form.Group>

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
            <Form.Label>Age</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Enter your age" 
              value={age}  
              onChange={(e) => setAge(e.target.value)} 
              className="custom-input"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Select 
              value={role} 
              onChange={(e) => setRole(e.target.value)} 
              className="custom-input"
            >
              <option className="text-black" value="">Select Role</option>
              <option className="text-black" value="Looking for job">Looking for a Job</option>
              <option className="text-black" value="Hiring job">Hiring for a Job</option>
            </Form.Select>
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
              <Button type="submit" className="btn-primary-custom w-100">Create account</Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </Container>
  );
}



