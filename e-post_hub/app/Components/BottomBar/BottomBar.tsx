import Image from "next/image";
import WVAnobg from "../../Images/WVAnobg.png";
import hero from "../../Images/hero.jpg"

export default function BottomBar() {
  return (
<div className="w-full overflow-auto">
<div 
className="relative w-full bg-gradient-to-r from-[#f7960d] to-[#f95d09] text-black flex flex-col md:flex-row items-center 
justify-between gap-4 md:gap-0 h-auto p-4 md:h-[110px] shadow-md">

<div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full px-6 overflow-auto">
        {/* Contact Us Section with Image */}
        <div className="flex items-center">
          <Image
            src={WVAnobg}
            alt="WVA Logo"
            width={150}
            height={150}
            className="mr-8"
          />

          <div>
            <h3 className="text-lg font-bold">Contact Us</h3>
            <p className="text-sm">
              Email:{" "}
              <a href="mailto:BeckyBuri@whitmancounty.gov" className="underline">
              BeckyBuri@whitmancounty.gov
              </a>
            </p>
            <p className="text-sm">Phone: +1 (509)-397-5246 </p>
          </div>
        </div>

        {/* Links Section */}
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-bold">Help & Support</h3>
          <div className="flex space-x-4 mt-2">
            <a href="https://www.whitmancounty.org/628/Veteran-Services-Officer" className="text-sm underline">
              External Resources
            </a>
            <a href="/Support/community" className="text-sm underline">
              Community Questions
            </a>
            {/* <a href="/Support/issue" className="text-sm underline">
              Report a Problem
            </a> */}
          </div>
        </div>

        {/* Branding */}
        <div className="text-right flex items-center gap-2 "> 
      <p className="text-lg font-bold">By: Hero's Hub</p>

  <Image
    src={hero}
    alt="Hero Logo"
    width={40}
    height={40}
    className="rounded-md"
  />
</div>
      </div>
    </div>
    </div>
  );
}
