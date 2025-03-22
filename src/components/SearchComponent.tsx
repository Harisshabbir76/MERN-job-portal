"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, InputGroup, Button } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

const SearchComponent = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim() !== "") {
      router.push(`/search/${query.trim()}`); // Redirect to search results page
    }
  };

  return (
    <div className="p-3 bg-dark text-white">
      <InputGroup>
        <Form.Control
          type="text"
          placeholder="Search jobs or companies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()} // Search on Enter key
        />
        <Button variant="primary" onClick={handleSearch}>
          <FaSearch />
        </Button>
      </InputGroup>
    </div>
  );
};

export default SearchComponent;
