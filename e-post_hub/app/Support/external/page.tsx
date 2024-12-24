"use client";

import React, { useState, useEffect } from "react";
import { Checkbox } from "@nextui-org/react";

type Link = {
  id: string;
  title: string;
  description: string;
  url: string;
  location: string;
  category: { name: string };
};

export default function ResourcesPage() {
  const [links, setLinks] = useState<Link[]>([]);
  const [locationFilter, setLocationFilter] = useState<string>("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [showLocationFilters, setShowLocationFilters] = useState(false);
  const [showCategoryFilters, setShowCategoryFilters] = useState(false);

  useEffect(() => {
    // Fetch links with filters
    const fetchLinks = async () => {
      const query = new URLSearchParams();
      if (locationFilter !== "All") query.append("location", locationFilter);
      if (categoryFilter !== "All") query.append("category", categoryFilter);

      try {
        const response = await fetch(`/api/externalHub?${query.toString()}`);
        if (response.ok) {
          const data = await response.json();
          setLinks(data);
        } else {
          console.error("Failed to fetch links");
          setLinks([]);
        }
      } catch (error) {
        console.error("Error fetching links:", error);
        setLinks([]);
      }
    };

    fetchLinks();
  }, [locationFilter, categoryFilter]);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-1/4 p-4 bg-gray-100">
        <h3 className="text-xl font-bold mb-4">Filters</h3>

        {/* Location Filter */}
        <div>
          <h4
            className="text-lg font-semibold mb-2 cursor-pointer"
            onClick={() => setShowLocationFilters(!showLocationFilters)}
          >
            Locations {showLocationFilters ? "-" : "+"}
          </h4>
          {showLocationFilters && (
            <div>
              <Checkbox
                isSelected={locationFilter === "All"}
                onChange={() => setLocationFilter("All")}
              >
                All Locations
              </Checkbox>
              <Checkbox
                isSelected={locationFilter === "Moscow"}
                onChange={() => setLocationFilter("Moscow")}
              >
                Moscow
              </Checkbox>
              <Checkbox
                isSelected={locationFilter === "Pullman"}
                onChange={() => setLocationFilter("Pullman")}
              >
                Pullman
              </Checkbox>
            </div>
          )}
        </div>

        {/* Category Filter */}
        <div className="mt-6">
          <h4
            className="text-lg font-semibold mb-2 cursor-pointer"
            onClick={() => setShowCategoryFilters(!showCategoryFilters)}
          >
            Categories {showCategoryFilters ? "-" : "+"}
          </h4>
          {showCategoryFilters && (
            <div>
              <Checkbox
                isSelected={categoryFilter === "All"}
                onChange={() => setCategoryFilter("All")}
              >
                All Categories
              </Checkbox>
              <Checkbox
                isSelected={categoryFilter === "Volunteer"}
                onChange={() => setCategoryFilter("Volunteer")}
              >
                Volunteer Services
              </Checkbox>
              <Checkbox
                isSelected={categoryFilter === "Financial"}
                onChange={() => setCategoryFilter("Financial")}
              >
                Financial Assistance
              </Checkbox>
              <Checkbox
                isSelected={categoryFilter === "Healthcare"}
                onChange={() => setCategoryFilter("Healthcare")}
              >
                Healthcare
              </Checkbox>
              <Checkbox
                isSelected={categoryFilter === "Legal"}
                onChange={() => setCategoryFilter("Legal")}
              >
                Legal Advice
              </Checkbox>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-4">
        <h1 className="text-2xl font-bold mb-6">Helpful Links</h1>

        {/* Links */}
        <div className="grid grid-cols-1 gap-4">
          {links.length === 0 ? (
            <p>No links found for the selected filters.</p>
          ) : (
            links.map((link) => (
              <div key={link.id} className="p-4 border rounded shadow">
                <h2 className="text-xl font-semibold mb-2">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {link.title}
                  </a>
                </h2>
                <p className="text-gray-700">{link.description}</p>
                <p className="text-sm text-gray-500">
                  Location: {link.location} | Category: {link.category.name}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
