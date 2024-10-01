import Link from "next/link";
import Image from "next/image";
import profile_img from "../Images/profile.png"
import admin_img from "../Images/admin.png"
import home_img from "../Images/home.png"
import logout_img from "../Images/logout.png"
import member_img from "../Images/member.png"
import calander_img from "../Images/calendar.png"

const menuItems = [
    {
      title: "MENU",
      items: [
        {
          icon: home_img,
          label: "Homepage",
          href: "/",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: admin_img,
          label: "Admin Login",
          href: "",
          visible: ["admin", "teacher"],
        },
        {
          icon: member_img,
          label: "Member Login",
          href: "",
          visible: ["admin", "teacher"],
        },
        {
          icon: calander_img,
          label: "Events",
          href: "",
          visible: ["admin", "teacher", "student", "parent"],
        },
      ],
    },
    {
      title: "OTHER",
      items: [
        {
          icon: profile_img,
          label: "Profile",
          href: "",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: logout_img,
          label: "Logout",
          href: "/Logout",
          visible: ["admin", "teacher", "student", "parent"],
        },
      ],
    },
  ];



const Menu = () => {
    return (
        <div className="mt-4 text-sm">
            {menuItems.map((i) => (
                <div className="flex flex-col gap-2" key={i.title}>
                <span className="hidden lg:block text-grat-400 font-light my-4">{i.title}</span>
                {i.items.map((item) => (
                    <Link href={item.href} key={item.label} className="flex items-center justify-center lg: justify-start gap-4 text-gray-500 py-2">
                        <Image src={item.icon} alt="" width={20} height={20} />
                        <span  className="hidden lg:block">{item.label}</span>
                    </Link>
                ))}
            </div>
            ))}
        </div>
    );
};

export default Menu