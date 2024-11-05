// Form used to display the MemberRegisterForm

import React from "react";
import MemberRegisterForm from "./MemberRegisterForm";

export default function RegisterMemberPage() {
  return (
    <div
      className="flex items-center justify-center"
      style={{ height: "calc(100vh - 64px)" }}
    >
      <MemberRegisterForm />
    </div>
  );
}
