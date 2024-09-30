import Image from "next/image"
import search_png from "../Images/search.png"
import avatart_png from "../Images/avatar.png"
import annoucement_png from "../Images/annoucements.png"

const Navbar = () => {
    return (
        <div className="flex items-center justify-between p-4">
            {/*Filter Mechanics */}
            <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-orange-400 px-4">
                <Image src= {search_png} alt="" width={10} height={10}/>
                <input type="text" placeholder="Change to dropdown later" className="w-[200px] p-2 bg-transparent outline-none"/>
            </div>
            {/* Icons and User */}
            <div className="flex items-center gap-6 justify-end w-full">
                <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
                    <Image src= {annoucement_png} alt="" width={25} height={25} className="rounded-full"/> 
                    <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-orange-400 text-white rounded-full text-xs">1</div>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs leading-3 font-medium"> Jane Doe</span>
                    <span className="text-[10px] text-gray-500 text-right">Admin</span>

                </div>
                <Image src={avatart_png} alt="" width={36} height={36} className="rounded-full"/>
            </div>
        </div>
    )
}

export default Navbar