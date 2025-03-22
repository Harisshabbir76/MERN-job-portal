"use client";

import { useEffect,useState } from "react";
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function PostJobs() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyLocation, setCompanyLocation] = useState("");
  const [jobtype, setJobtype] = useState("");
  const [salary, setSalary] = useState(0);
  const [error, setError] = useState("");

  const router=useRouter()

   useEffect(() => {
          const token = localStorage.getItem("token");
          if (!token) {
              router.push("/login");
              return;
          }
        })
        const handleSubmit = async (e) => {
          e.preventDefault();
          setError("");
      
          try {
              const token = localStorage.getItem("token"); // Get token from local storage
              if (!token) {
                  setError("Unauthorized! Please log in first.");
                  return;
              }
      
              const res = await axios.post(
                  "http://localhost:5000/api/post-jobs",
                  {
                      title,
                      description,
                      companyName,
                      companyDescription,
                      companyEmail,
                      companyLocation,
                      jobtype,
                      salary: Number(salary),
                  },
                  {
                      headers: { Authorization: `Bearer ${token}` }, // ✅ Add token in headers
                  }
              );
      
              alert("Job posted successfully!");
              router.push("/");
          } catch (err) {
              setError(err.response?.data?.error || "Something went wrong!");
          }
      };
      
  return (
    <div>
      <Container className="d-flex justify-content-center align-items-center mt-5">
        <Card
          className="p-4 text-black shadow-lg rounded-4"
          style={{ width: "500px", background: "linear-gradient(135deg, #ffffff, #f8f9fa)" }}
        >
          <h2 className="text-center fw-bold mb-4 text-primary">Post a Job</h2>
          {error && <p className="text-danger text-center">{error}</p>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Job Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter job title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Job Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter job description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Company Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter company name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Company Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Enter company description"
                value={companyDescription}
                onChange={(e) => setCompanyDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Company Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter company email"
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Company Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter company location"
                value={companyLocation}
                onChange={(e) => setCompanyLocation(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Job Type</Form.Label>
              <Form.Select value={jobtype} onChange={(e) => setJobtype(e.target.value)}>
                <option value="">Select job type</option>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Salary</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter salary"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
              />
            </Form.Group>

            <Row className="mt-4">
              <Col>
                <Button type="submit" className="w-100 btn btn-primary fw-bold shadow-sm">
                  Post Job
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </Container>
    </div>
  );
}
