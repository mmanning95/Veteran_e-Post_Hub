import Link from "next/link";
import Image from "next/image";
import whitman from "../Images/whitman.png"
import Menu from "../Components/Menu";
import Navbar from "../Components/Navbar";

export default function DashboardLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <div className="h-screen flex">
            {/*LEFT */}
            <div className="w-[18%] md:w-[12%] lg:w-[20%] xl:w-[18%] bg-orange-200">
            <Link href="/"
                className="flex items-center justify-center lg:justify-start gap-2" >
                <Image src={whitman} alt="Whitman County Logo" width={32} height={32}/>
                <span className="hidden lg:block">Veteran e-Post Hub</span>
                </Link>
                <Menu />
            </div>
            {/*RIGHT */}
            <div className="w-[82%] md:w-[88%] lg:w-[80%] xl:w-[82%] bg-[#F78FA] overflow-scroll">
                <Navbar />
                {children}
            </div>
        </div>
    );
  }