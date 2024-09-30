import EventCalendar from "@/app/Components/EventCalendar"

const AdminPage = () => {
    return (
        <div className="p-4 flex gap-4 flex-col md:flex-row">
            {/*LEFT*/}
            <div className="w-full lg:w-2/3">l</div>
            {/*RIGHT*/}
            <div className="w-full lg:w-1/3 flex flex-col gap-8">
                {/* <EventCalendar /> */}
            </div>
        </div>
    )
}

export default AdminPage