import Image from "next/image"
import search_png from "../Images/search.png"

const Navbar = () => {
    return (
        <div className="flex items-center justify-between p-4">
            {/*Filter Mechanics */}
            <div className="hidden md:flex">
                <Image src= {search_png} alt="" width={10} height={10}/>
                <input type="text" placeholder="Change to dropdown later" />
            </div>
            {/* Icons and User */}
            <div className="flex items-center gap-6">
                <div className="flex flex-col">
                    <span className="text-xs leading-3 font-medium"> Jane Doe</span>
                    <span className="text-[10px] text-gray-500 text-right">Admin</span>
                </div>
            </div>
        </div>
    )
}

export default Navbar