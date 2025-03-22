"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Container, Card, Spinner, Button, Alert, Row, Col, Badge, Form } from "react-bootstrap";

export default function ProfilePage() {
  const router = useRouter();
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false); // 👈 Track form visibility
  const [formData, setFormData] = useState({
    skills: "",
    linkedin: "",
    portfolio: "",
    phone: "",
    institution: "",
    degree: "",
    year: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        setError("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("Authentication token missing. Please log in again.");
      router.push("/login");
      return;
    }
  
    try {
      // Merge old and new skills
      const updatedSkills = [...(user.skills || []), ...formData.skills.split(",").map((s) => s.trim())];
  
      const res = await axios.put(
        "http://localhost:5000/user/update",
        {
          skills: Array.from(new Set(updatedSkills)), // Remove duplicates
          linkedin: formData.linkedin || user.linkedin,
          portfolio: formData.portfolio || user.portfolio,
          phone: formData.phone || user.phone,
          education: {
            institution: formData.institution || user.education?.institution,
            degree: formData.degree || user.education?.degree,
            year: formData.year ? Number(formData.year) : user.education?.year,
          },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setUser(res.data); // Update frontend with new user data
      setShowForm(false); // Hide form after successful update
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
      alert("Error updating profile.");
    }
  };
  

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-lg border-0 rounded-4">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2 className="text-primary fw-bold">{user.name}</h2>
                <Badge bg="info" className="fs-6">{user.role}</Badge>
              </div>

              {/* User Details */}
              <Row>
                <Col><p><strong>Email:</strong> {user.email}</p></Col>
                <Col><p><strong>Age:</strong> {user.age}</p></Col>
              </Row>
              <p><strong>Applied Jobs:</strong> {user.appliedJobs?.length || 0} Jobs</p>

              {/* User Skills & Links */}
              {user.skills && user.skills.length > 0 && (
                <>
                  <p><strong>Skills:</strong> {user.skills.join(", ")}</p>
                  <p><strong>LinkedIn:</strong> <a href={user.linkedin} target="_blank">{user.linkedin}</a></p>
                  <p><strong>Portfolio:</strong> <a href={user.portfolio} target="_blank">{user.portfolio}</a></p>
                  <p><strong>Phone:</strong> {user.phone}</p>
                  <p><strong>Education:</strong> {user.education?.institution} ({user.education?.degree}, {user.education?.year})</p>
                </>
              )}

              {/* Edit Profile Button */}
              <div className="d-grid gap-2">
                <Button
                  variant="warning"
                  size="lg"
                  className="fw-bold"
                  onClick={() => setShowForm(!showForm)} // 👈 Toggle form visibility
                >
                  {showForm ? "Cancel" : "Edit Profile"}
                </Button>
              </div>

              {/* Show Form Only When Button Clicked */}
              {showForm && (
                <Form onSubmit={handleSubmit} className="mt-4">
                  <Form.Group className="mb-3">
                    <Form.Label>Skills (comma separated)</Form.Label>
                    <Form.Control type="text" name="skills" onChange={handleChange} />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>LinkedIn Profile</Form.Label>
                    <Form.Control type="url" name="linkedin" onChange={handleChange} />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Portfolio Link</Form.Label>
                    <Form.Control type="url" name="portfolio" onChange={handleChange} />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control type="text" name="phone" onChange={handleChange} />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Institution</Form.Label>
                    <Form.Control type="text" name="institution" onChange={handleChange} />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Degree</Form.Label>
                    <Form.Control type="text" name="degree" onChange={handleChange} />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Graduation Year</Form.Label>
                    <Form.Control type="number" name="year" onChange={handleChange} />
                  </Form.Group>

                  <Button type="submit" variant="success" className="w-100">Update Profile</Button>
                </Form>
              )}

            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}


