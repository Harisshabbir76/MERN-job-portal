"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { Form, Button, Container, Card } from "react-bootstrap";

export default function EditJob() {
  const router = useRouter();
  const params = useParams();
  const jobId = params?.jobId;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyLocation, setCompanyLocation] = useState("");
  const [jobtype, setJobtype] = useState("");
  const [salary, setSalary] = useState<number | string>(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchJob = async () => {
      if (!jobId) {
        setError("Invalid job ID");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`http://localhost:5000/api/jobs/${jobId}`);
        const job = res.data;
        setTitle(job.title);
        setDescription(job.description);
        setCompanyName(job.companyName);
        setCompanyDescription(job.companyDescription);
        setCompanyEmail(job.companyEmail);
        setCompanyLocation(job.companyLocation);
        setJobtype(job.jobtype);
        setSalary(job.salary);
        setLoading(false);
      } catch (err) {
        setError("Failed to load job details.");
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId, router]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized! Please log in.");
        return;
      }

      await axios.put(
        `http://localhost:5000/api/jobs/${jobId}/edit`,
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
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Job updated successfully!");
      router.push("/");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || err.message || "Something went wrong!");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong!");
      }
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center mt-5">
      <Card className="p-4 text-black shadow-lg rounded-4" style={{ width: "500px" }}>
        <h2 className="text-center fw-bold mb-4 text-warning">Edit Job</h2>
        {error && <p className="text-danger text-center">{error}</p>}
        {loading ? (
          <p className="text-center">Loading job details...</p>
        ) : (
          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3">
              <Form.Label>Job Title</Form.Label>
              <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Company Name</Form.Label>
              <Form.Control
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Company Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={companyDescription}
                onChange={(e) => setCompanyDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Company Email</Form.Label>
              <Form.Control
                type="email"
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Company Location</Form.Label>
              <Form.Control
                type="text"
                value={companyLocation}
                onChange={(e) => setCompanyLocation(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Job Type</Form.Label>
              <Form.Select value={jobtype} onChange={(e) => setJobtype(e.target.value)}>
                <option value="">Select job type</option>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Salary</Form.Label>
              <Form.Control
                type="number"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
              />
            </Form.Group>

            <Button type="submit" className="w-100 btn btn-warning fw-bold">
              Update Job
            </Button>
          </Form>
        )}
      </Card>
    </Container>
  );
}
