"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, Container, Row, Col, Button, Spinner } from "react-bootstrap"; // Import Spinner

export default function Jobs() {
    const router = useRouter();
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]); // Store only user-posted jobs
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        const fetchUserAndJobs = async () => {
            try {
                // Fetch user
                const userRes = await axios.get("http://localhost:5000/user", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(userRes.data);

                // Fetch jobs
                const jobsRes = await axios.get("http://localhost:5000/api/jobs");
                setJobs(jobsRes.data);

                // Filter jobs **after** both user and jobs are loaded
                setFilteredJobs(jobsRes.data.filter((job) => job.createdBy === userRes.data._id));
            } catch (err) {
                setError("Failed to fetch jobs or user data");
            } finally {
                setLoading(false);
            }
        };

        fetchUserAndJobs();
    }, [router]);

    return (
        <Container className="mt-5">
            <h1 className="text-center text-primary fw-bold mb-5">Your Posted Jobs</h1>

            {/* Loading Spinner */}
            {loading && (
                <div className="text-center">
                    <Spinner animation="border" role="status" variant="primary">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    <p className="mt-2">Loading jobs...</p>
                </div>
            )}

            {/* Error Message */}
            {error && <p className="text-center text-danger">{error}</p>}

            {/* Job List */}
            <Row className="mt-4">
                {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
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

                                    <Link href={`/edit-job/${job._id}`} passHref>
                                        <Button variant="warning" className="w-100 mt-2">Edit</Button>
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    !loading && <p className="text-center mt-4">You haven't posted any jobs yet.</p>
                )}
            </Row>
        </Container>
    );
}