"use client";

import React, { useState, useEffect } from "react";
import { Checkbox } from "@nextui-org/react";

type Link = {
  id: string;
  title: string;
  description: string;
  url: string;
  location: string;
  category?: string;
};

export default function ResourcesPage() {
  const [links, setLinks] = useState<Link[]>([]); // Store fetched links
  const [locationFilter, setLocationFilter] = useState<string>("All"); // Filter for location
  const [categoryFilter, setCategoryFilter] = useState<string>("All"); // Filter for category
  const [showLocationFilters, setShowLocationFilters] = useState(false); // Toggle location filter visibility
  const [showCategoryFilters, setShowCategoryFilters] = useState(false); // Toggle category filter visibility

  useEffect(() => {
    // Fetch links with applied filters
    const fetchLinks = async () => {
      const query = new URLSearchParams();
      if (locationFilter !== "All") query.append("location", locationFilter);
      if (categoryFilter !== "All") query.append("category", categoryFilter);

      try {
        const response = await fetch(`/api/externalHub?${query.toString()}`);
        if (response.ok) {
          const data = await response.json();
          setLinks(data); // Set fetched links
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
  }, [locationFilter, categoryFilter]); // Refetch on filter changes

  return (
    <div className="flex">
      {/* Sidebar for filters */}
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
                isSelected={categoryFilter === "Financial Assistance"}
                onChange={() => setCategoryFilter("Financial Assistance")}
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
                isSelected={categoryFilter === "Legal Advice"}
                onChange={() => setCategoryFilter("Legal Advice")}
              >
                Legal Advice
              </Checkbox>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-4">
        <div className="grid grid-cols-1 gap-6">
          {links.length === 0 ? (
            <p>No links found for the selected filters.</p>
          ) : (
            links.map((link) => (
              <div
                key={link.id}
                className="p-6 bg-white border border-gray-200 rounded-lg shadow-lg"
              >
                <h2 className="text-lg font-semibold mb-2 text-orange-600">
                  {/* Link Title */}
                  <a
                    href={
                      link.url.startsWith("http")
                        ? link.url
                        : `https://${link.url}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {link.title}
                  </a>
                </h2>
                <p className="text-gray-700 mb-4">{link.description}</p>
                <div className="text-sm text-gray-500">
                  <p>
                    <strong>Location:</strong> {link.location}
                  </p>
                  <p>
                    <strong>Category:</strong>{" "}
                    {link.category || "Uncategorized"}{" "}
                    {/* Handle missing category */}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
