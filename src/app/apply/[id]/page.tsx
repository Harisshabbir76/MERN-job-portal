"use client";

import { useEffect, useState } from "react";
import { Form, Button, Card, Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";

export default function ApplyPage() {
  const [experience, setExperience] = useState("");
  const [coverletter, setCoverLetter] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string; // Extract jobId safely

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!jobId) return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchJob = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/jobs/${jobId}`);
        setJob(res.data);
      } catch (err) {
        setError("Failed to fetch job details");
        console.error("API Fetch Error:", err); // Debugging
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("token");

    if (!token) {
        alert("You must be logged in to apply for jobs.");
        router.push("/login");
        return;
    }

    // Create FormData to send file
    const formData = new FormData();
    formData.append("experience", experience);
    formData.append("coverletter", coverletter);
    if (resume) {
        formData.append("resume", resume); // Attach file
    }

    try {
        const res = await axios.post(
            `http://localhost:5000/api/jobs/${jobId}/apply`,
            formData,
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        alert("Application submitted and email sent to the company!");
        router.push("/");
    } catch (err) {
        console.error("API Error:", err.response?.data);
        setError(err.response?.data?.error || "Something went wrong!");
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );

  if (error) return (
    <Alert variant="danger" className="text-center mt-5">
      {error}
    </Alert>
  );

  if (!job) return (
    <Alert variant="warning" className="text-center mt-5">
      Job not found
    </Alert>
  );

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-lg">
            <Card.Header className="bg-primary text-white">
              <h1 className="text-center mb-0">Applying for Job: {job.title}</h1>
            </Card.Header>
            <Card.Body>
              <p><strong>Company:</strong> {job.companyName}</p>
              <p><strong>Description:</strong> {job.description}</p>
              <p><strong>Location:</strong> {job.companyLocation}</p>
              <p><strong>Salary:</strong> {job.salary}</p>

              <hr />

              <h2 className="text-center mb-4">Application Form</h2>
              {error && <Alert variant="danger" className="text-center">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label><strong>Experience (Years)</strong></Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter your experience"
                    value={experience}
                    required
                    onChange={(e) => setExperience(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label><strong>Cover Letter</strong></Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    placeholder="Write your cover letter here..."
                    value={coverletter}
                    required
                    onChange={(e) => setCoverLetter(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label><strong>Resume (PDF/DOC)</strong></Form.Label>
                  <Form.Control
                    type="file"
                    accept=".pdf,.doc,.docx"
                    required
                    onChange={(e) => setResume(e.target.files?.[0] || null)}
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button type="submit" variant="primary" size="lg" className="fw-bold">
                    Submit Application
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}