// Form used to display the MemberRegisterForm

import React from "react";
import MemberRegisterForm from "./MemberRegisterForm";
import hills2 from "../../Images/hills2.jpg"

export default function RegisterMemberPage() {
  return (
    <div
      className="flex items-center justify-center min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{ 
        backgroundImage: `url(${hills2.src})`,
      }}
    >
      <MemberRegisterForm />
    </div>
  );
}
