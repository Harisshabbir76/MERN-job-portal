"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";

export default function Jobs() {
    const router = useRouter();
    const [jobs, setJobs] = useState([]);
    const [appliedJobs, setAppliedJobs] = useState([]); // Track applied jobs
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [user, setUser] = useState(null);
    const [filteredJobs, setFilteredJobs] = useState([]); // Store jobs **excluding user-posted jobs**

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        const fetchData = async () => {
            try {
                // Fetch user
                const userRes = await axios.get("http://localhost:5000/user", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(userRes.data);

                // Fetch jobs
                const jobsRes = await axios.get("http://localhost:5000/api/jobs");
                setJobs(jobsRes.data);

                // Filter out jobs **posted by the logged-in user**
                const jobsNotPostedByUser = jobsRes.data.filter((job) => job.createdBy !== userRes.data._id);
                setFilteredJobs(jobsNotPostedByUser);

                // Fetch applied jobs
                const appliedJobsRes = await axios.get("http://localhost:5000/user/applied-jobs", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAppliedJobs(appliedJobsRes.data);
            } catch (err) {
                setError("Failed to fetch jobs or user data");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="danger" className="text-center mt-5">
                {error}
            </Alert>
        );
    }

    return (
        <Container className="my-5">
            <h1 className="text-center text-primary fw-bold mb-5">Available Jobs</h1>

            {filteredJobs.length > 0 ? (
                <Row className="g-4">
                    {filteredJobs.map((job) => {
                        const hasApplied = appliedJobs.includes(job._id); // Check if applied
                        return (
                            <Col key={job._id} md={6} lg={4}>
                                <Card className="h-100 shadow-sm border-10 rounded-3">
                                    <Card.Body className="d-flex flex-column">
                                        <Card.Title className="fw-bold text-primary">{job.title}</Card.Title>
                                        <Card.Subtitle className="text-muted mb-3">
                                            {job.companyName} - {job.companyLocation}
                                        </Card.Subtitle>
                                        <Card.Text className="flex-grow-1">{job.description}</Card.Text>
                                        <p className="fw-semibold">Salary: ${job.salary}</p>
                                        <p className="badge bg-info text-dark">{job.jobtype}</p>

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
                <Alert variant="info" className="text-center mt-4">
                    No jobs available at the moment.
                </Alert>
            )}
        </Container>
    );
}