import Image from "next/image";
import WVAnobg from "../../Images/WVAnobg.png";

export default function BottomBar() {
  return (
    <div
      className="fixed bottom-0 left-0 w-full bg-gradient-to-r from-[#f7960d] to-[#f95d09] text-black flex items-center justify-center h-[110px] shadow-md z-50"
    >
      <div className="flex flex-row items-center justify-between w-full max-w-6xl px-0">
        {/* Contact Us Section with Image */}
        <div className="flex items-center">
          <Image
            src={WVAnobg}
            alt="WVA Logo"
            width={200} 
            height={200} 
            className="mr-8" 
          />

          <div>
            <h3 className="text-lg font-bold">Contact Us</h3>
            <p className="text-sm">
              Email:{" "}
              <a href="mailto: ____" className="underline">
                ____
              </a>
            </p>
            <p className="text-sm">Phone: +1 (111) 111-1111</p>
          </div>
        </div>

        {/* Links Section */}
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-bold">Help & Support</h3>
          <div className="flex space-x-4 mt-2">
            <a href="/Support/external" className="text-sm underline">
              External Resources
            </a>
            <a href="/Support/community" className="text-sm underline">
              Community Questions
            </a>
            <a href="/Support/issue" className="text-sm underline">
              Report a Problem
            </a>
          </div>
        </div>

        {/* Branding */}
        <div className="text-right">
          <p className="text-lg font-bold">Veteran e-Post Hub © 2025</p>
        </div>
      </div>
    </div>
  );
}
