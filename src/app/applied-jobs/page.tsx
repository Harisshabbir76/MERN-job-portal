"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, Container, Row, Col, Button, Spinner } from "react-bootstrap"; // Import Spinner

export default function AppliedJobs() {
    const router = useRouter();
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        const fetchAppliedJobs = async () => {
            try {
                const res = await axios.get("http://localhost:5000/user/applied-jobs", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // Get full job details
                const jobsRes = await axios.get("http://localhost:5000/api/jobs");
                const appliedJobsData = jobsRes.data.filter(job => res.data.includes(job._id));

                setAppliedJobs(appliedJobsData);
            } catch (err) {
                setError("Failed to fetch applied jobs");
            } finally {
                setLoading(false);
            }
        };

        fetchAppliedJobs();
    }, [router]);

    return (
        <Container className="mt-5">
            <h1 className="text-center text-primary fw-bold mb-5">Jobs You Applied To</h1>

            {/* Loading Spinner */}
            {loading && (
                <div className="text-center">
                    <Spinner animation="border" role="status" variant="primary">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    <p className="mt-2">Loading applied jobs...</p>
                </div>
            )}

            {/* Error Message */}
            {error && <p className="text-center text-danger">{error}</p>}

            {/* Applied Jobs List */}
            <Row className="mt-4">
                {appliedJobs.length > 0 ? (
                    appliedJobs.map((job) => (
                        <Col key={job._id} md={6} lg={4} className="mb-4">
                            <Card className="shadow-lg p-3 rounded">
                                <Card.Body>
                                    <Card.Title className="fw-bold">{job.title}</Card.Title>
                                    <Card.Subtitle className="text-muted">
                                        {job.companyName} - {job.companyLocation}
                                    </Card.Subtitle>
                                    <Card.Text className="mt-2">{job.description}</Card.Text>
                                    <p className="fw-semibold">Salary: ${job.salary}</p>
                                    <p className="badge bg-primary">{job.jobtype}</p>

                                    <Button variant="secondary" className="w-100 mt-3" disabled>
                                        Applied
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    !loading && <p className="text-center mt-4">You haven't applied to any jobs yet.</p>
                )}
            </Row>
        </Container>
    );
}