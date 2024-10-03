import React from "react";
import Link from "next/link";
import { Button } from "@nextui-org/react";

export default function EditEventPage() {
  return (
    <div>
      <h3 className="text-3xl">This will be the modify event page</h3>

      <div style={{ margin: "20px 0" }}>
        <Button as={Link} href="/Admin" color="primary" variant="bordered">
          Back to Admin
        </Button>
      </div>

      <div style={{ margin: "20px 0" }}>
        <Button as={Link} href="/" color="primary" variant="bordered">
          Back to Homepage
        </Button>
      </div>

      <div className="formCreate">
        <h1>Edit Event Form</h1>

        <div>
          <form>
            <div>
              <label>Select Event ID:</label>
              <select>
                <option value="Event 1" id="">
                  Event 1
                </option>
                <option value="Event 2" id="">
                  Event 2
                </option>
              </select>
            </div>

            <div>
              <label>Edit Event Date:</label>
              <input type="text" placeholder="Enter new event date here" />
            </div>

            <div>
              <label>Edit Event Title:</label>
              <input type="text" placeholder="Enter new event title here" />
            </div>

            <div>
              <label> Edit Event Description:</label>
              <input
                type="text"
                placeholder="Enter the new event description"
              />
            </div>

            <div>
              <label>Edit Contact information:</label>
              <input
                type="text"
                placeholder="Enter new contact information here"
              />
            </div>

            <Button>Upload New Flyer</Button>
            <Button>Clear</Button>
            <Button>Delete Event</Button>
            <Button>Save Changes</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
