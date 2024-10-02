import React from "react";
import Link from "next/link";
import { Button } from "@nextui-org/react";

export default function ModifyEventPage() {
  return (
    <div>
      <h3 className="text-3xl">This will be the modify event page</h3>

      <div>
        <Button as={Link} href="/Admin" color="primary" variant="bordered">
          Back to Admin
        </Button>
      </div>

      <div>
        <Button as={Link} href="/" color="primary" variant="bordered">
          Back to Homepage
        </Button>
      </div>

      <div className="formCreate">
        <h1>Change Event Form</h1>

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
              <label>Change Event Date:</label>
              <input type="text" />
            </div>

            <div>
              <label>Change Event Title:</label>
              <input type="text" />
            </div>

            <div>
              <label>Change Event Description:</label>
              <input type="text" />
            </div>

            {/* Edit Event Button moved outside of select */}
            <Button>Submit Changes </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
