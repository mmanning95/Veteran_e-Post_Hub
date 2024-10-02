import { Button } from "@nextui-org/react";
import Link from "next/link";
import React from "react";

export default function Adminpage() {
  return (
    <div>
      <h3 className="text-3xl">This will be the admin page</h3>

      <div style={{ margin: "20px 0" }}>
        <Button
          as={Link}
          href="/Admin/modifyevent"
          color="primary"
          variant="bordered"
        >
          Modify Event
        </Button>
      </div>

      <div style={{ margin: "20px 0" }}>
        <Button as={Link} href="/" color="primary" variant="bordered">
          Back to Homepage
        </Button>
      </div>
    </div>
  );
}
