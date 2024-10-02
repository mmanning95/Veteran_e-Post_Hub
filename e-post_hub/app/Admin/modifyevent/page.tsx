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
    </div>
  );
}
