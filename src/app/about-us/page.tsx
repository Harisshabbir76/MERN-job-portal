"use client";

import { Container, Card } from "react-bootstrap";

export default function AboutUs() {
  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100 mt-5">
      <Card className="p-5 shadow-lg rounded-4 text-center" style={{ maxWidth: "700px", background: "linear-gradient(135deg, #ffffff, #f8f9fa)" }}>
        <h2 className="fw-bold text-primary">About Us</h2>
        <p className="mt-3 text-muted">
          Welcome to <strong>Roozagar</strong>, your one-stop platform for connecting talented professionals with top companies. 
          Whether you're looking for your next big opportunity or seeking the perfect candidate for your company, 
          we've got you covered!
        </p>
        <h4 className="fw-bold mt-4">🚀 Our Mission</h4>
        <p className="text-muted">
          Our mission is to make job searching and hiring seamless, efficient, and transparent**. 
          We bridge the gap between employers and job seekers, helping both parties find the right match.
        </p>
        <h4 className="fw-bold mt-4">🌟 Why Choose Us?</h4>
        <ul className="list-unstyled text-muted">
          <li>✔️ Easy job posting for employers</li>
          <li>✔️ Simple & quick job application process</li>
          <li>✔️ Verified job listings for a reliable experience</li>
        </ul>
        <p className="fw-semibold text-primary mt-4">Join us today and take the next step in your career!</p>
      </Card>
    </Container>
  );
}
