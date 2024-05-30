import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })} className="bg-blue-150 rounded-md text-white px-4 py-1 transition duration-500 hover:bg-white hover:text-blue-150 hover:outline hover:outline-2 hover:outline-blue-150">
      Log Out
    </button>
  );
};

export default LogoutButton;