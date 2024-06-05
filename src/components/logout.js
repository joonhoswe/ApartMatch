import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })} className="bg-red-500 text-xs md:text-sm w-20 h-8 rounded-md text-white px-2 py-1 transition duration-500 hover:bg-white hover:text-red-500 hover:outline hover:outline-2 hover:red-500">
      Log Out
    </button>
  );
};

export default LogoutButton;