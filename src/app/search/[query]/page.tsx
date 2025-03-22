"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Container, Row, Col, Card, Spinner, Button } from "react-bootstrap";
import Link from "next/link";

export default function SearchResults() {
  const { query } = useParams();
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]); // Store applied jobs
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
        const res = await axios.get("http://localhost:5000/api/jobs");
        const filteredJobs = res.data.filter(
          (job) =>
            job.title.toLowerCase().includes(query.toLowerCase()) ||
            job.companyName.toLowerCase().includes(query.toLowerCase())
        );
        setJobs(filteredJobs);

        // Fetch applied jobs
        const appliedRes = await axios.get("http://localhost:5000/user/applied-jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppliedJobs(appliedRes.data); // Store applied job IDs
      } catch (err) {
        console.error("Error fetching search results:", err);
        setError("Failed to fetch search results.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query, router]);

  return (
    <Container className="mt-5">
      <h2 className="text-center text-primary fw-bold">Search Results for "{query}"</h2>

      {loading ? (
        <div className="text-center mt-4">
          <Spinner animation="border" />
        </div>
      ) : error ? (
        <p className="text-center text-danger">{error}</p>
      ) : jobs.length > 0 ? (
        <Row className="mt-4">
          {jobs.map((job) => {
            const hasApplied = appliedJobs.includes(job._id); // Check if applied

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
                      <Link href={`/apply/${job._id}`} passHref>
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
        <p className="text-center mt-4 text-warning">No jobs found matching "{query}".</p>
      )}
    </Container>
  );
}
