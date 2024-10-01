import { redirect } from "next/navigation"
import GuestPage from "./dashboard/Guest/page"



export default function Homepage() {
  redirect('dashboard/Guest')
}