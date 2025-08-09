"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Container, Row, Col, Card, Spinner, Button } from "react-bootstrap";
import Link from "next/link";

interface Job {
  _id: string;
  title: string;
  companyName: string;
  description: string;
  salary: number;
}

export default function SearchResults() {
  const { query } = useParams();
  const router = useRouter();

  // Ensure query is a string, not array or undefined
  const searchQuery = Array.isArray(query) ? query[0] : query || "";

  const [jobs, setJobs] = useState<Job[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]); // array of applied job IDs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch all jobs
        const res = await axios.get<Job[]>("https://mern-job-portal-6i94.onrender.com/api/jobs");
        const filteredJobs = res.data.filter((job: Job) =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.companyName.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setJobs(filteredJobs);

        // Fetch applied jobs
        const appliedRes = await axios.get<string[]>("https://mern-job-portal-6i94.onrender.com/user/applied-jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppliedJobs(appliedRes.data);
      } catch (err) {
        console.error("Error fetching search results:", err);
        setError("Failed to fetch search results.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchQuery, router]);

  return (
    <Container className="mt-5">
      <h2 className="text-center text-primary fw-bold">Search Results for "{searchQuery}"</h2>

      {loading ? (
        <div className="text-center mt-4">
          <Spinner animation="border" />
        </div>
      ) : error ? (
        <p className="text-center text-danger">{error}</p>
      ) : jobs.length > 0 ? (
        <Row className="mt-4">
          {jobs.map((job) => {
            const hasApplied = appliedJobs.includes(job._id);

            return (
              <Col key={job._id} md={6} lg={4} className="mb-4">
                <Card className="shadow-lg p-3 rounded">
                  <Card.Body>
                    <Card.Title className="fw-bold">{job.title}</Card.Title>
                    <Card.Subtitle className="text-muted">{job.companyName}</Card.Subtitle>
                    <Card.Text className="mt-2">{job.description}</Card.Text>
                    <p className="fw-semibold">Salary: ${job.salary}</p>

                    {hasApplied ? (
                      <Button variant="secondary" className="w-100 mt-3" disabled>
                        Applied
                      </Button>
                    ) : (
                      <Link href={`/apply/${job._id}`} passHref legacyBehavior>
                        <Button variant="primary" className="w-100 mt-3">
                          Apply Now
                        </Button>
                      </Link>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      ) : (
        <p className="text-center mt-4 text-warning">No jobs found matching "{searchQuery}".</p>
      )}
    </Container>
  );
}
