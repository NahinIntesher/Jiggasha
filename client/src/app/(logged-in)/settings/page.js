import HeaderAlt from "@/components/ui/HeaderAlt";
import Link from "next/link";
import { FaAddressCard, FaCamera, FaImage } from "react-icons/fa";
import { FaKey, FaTrash } from "react-icons/fa6";

export default function Quests() {
  return (
    <div className="">
      <HeaderAlt title="Settings" />

      <div className="settingsContainer">
        <Link href={"/settings/change-profile-picture"} className="settingOption">
          <div className="icon"><FaCamera /></div>
          <div className="name">Change Profile Picture</div>
        </Link>
        <Link href={"/settings/change-profile-details"} className="settingOption">
          <div className="icon"><FaAddressCard /></div>
          <div className="name">Change Profile Details</div>
        </Link>
        <Link href={"/settings/change-password"} className="settingOption">
          <div className="icon"><FaKey /></div>
          <div className="name">Change Password</div>
        </Link>
        <div className="settingOption delete">
          <div className="icon"><FaTrash /></div>
          <div className="name">Delete Account</div>
        </div>
      </div>
    </div>
  );
}
