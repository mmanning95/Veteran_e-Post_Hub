import React from "react";
import Link from "next/link";

export default function ModifyEventPage() {
  return (
    <div>
      <h3 className="text-3xl">This will be the modify Event Page</h3>

      {/* Button to go back to Admin page */}
      <div>
        <Link href="/Admin">Go back to Admin Page</Link>
      </div>

      {/* Button to go back to Home page */}
      <div>
        <Link href="/">Go back to Homepage</Link>
      </div>
    </div>
  );
}
