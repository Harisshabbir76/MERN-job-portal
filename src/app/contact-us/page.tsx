"use client"

import axios from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";


export default function ContactUs(){

    const [name, setName]=useState("");
    const [email, setEmail]=useState("");  
    const [message, setMessage]=useState("");
    const [error, setError] = useState("");
    

    const router=useRouter()

    const handleMessage=async  (e: React.FormEvent)=>{
        e.preventDefault()
        setError("")

        try{
            const res=await axios.post("http://localhost:5000/reach-out/contact-us",{
                name,
                email,
                message

            })
            alert("Message send successfully")
            router.push("/")
        }catch(err){
          setError(err.response?.data?.error || err.message || "Something went wrong!");
        }

    }


    return (
        
        <div>
      <Container className="d-flex justify-content-center align-items-center mt-5">
        <Card
          className="p-4 text-black shadow-lg rounded-4"
          style={{ width: "500px", background: "linear-gradient(135deg, #ffffff, #f8f9fa)" }}
        >
          <h2 className="text-center fw-bold mb-4 text-primary">Contact Us</h2>
          {error && <p className="text-danger text-center">{error}</p>}

          <Form onSubmit={handleMessage}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Your name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="write your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </Form.Group>

            
            <Row className="mt-4">
              <Col>
                <Button type="submit" className="w-100 btn btn-primary fw-bold shadow-sm">
                  Send message
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </Container>
    </div>




    )
}