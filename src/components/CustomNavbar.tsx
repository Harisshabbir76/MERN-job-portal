import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { useRouter } from "next/navigation";
import axios from "axios";

const RoozagarNavbar = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:5000/user", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log("User ID from API:", res.data._id); // 🔍 Debugging
          setUserId(res.data._id);
          setIsLoggedIn(true);
        })
        .catch((err) => {
          console.error("Failed to fetch user data:", err);
          setIsLoggedIn(false);
        });
    }
  }, []);
  

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:5000/logout");
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand href="/" className="fw-bold">Roozagar</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/about-us">About Us</Nav.Link>
            <Nav.Link href="/contact-us">Contact Us</Nav.Link>
          </Nav>

          <Nav>
            {isLoggedIn ? (
              <NavDropdown title="Profile" id="more-dropdown">
                <NavDropdown.Item href={`/profile/${userId}`}>Profile</NavDropdown.Item>
                <NavDropdown.Item href="/post-jobs">Post Job</NavDropdown.Item>
                <NavDropdown.Item href="/posted-jobs">Posted Jobs</NavDropdown.Item>
                <NavDropdown.Item href="/applied-jobs">Applied Jobs</NavDropdown.Item>
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                <NavDropdown.Item href="/Forgot-Password" >Forget Password</NavDropdown.Item>
                
              </NavDropdown>
            ) : (
              <>
                <Nav.Link href="/login">Login</Nav.Link>
                <Nav.Link href="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default RoozagarNavbar;
