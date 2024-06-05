import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Link from "next/link";

function LoginButton() {
  const { loginWithRedirect, user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div> Loading... </div>;
  }

  return isAuthenticated ? (
    <Link href='/profile' className="flex items-center flex-row space-x-2 font-bold transition duration-300 ease-in-out text-black bg-white rounded-2xl px-4 py-2">
      <img src={user.picture} alt={user.name} className="w-6 h-6 rounded-full" />
      <p className="font-bold transition duration-300 ease-in-out hover:text-gray-400"> {user.nickname} </p>
    </Link>
  ) : (
    <button onClick={() => loginWithRedirect()} className="font-bold transition duration-300 ease-in-out hover:text-gray-400">
      Login / Register
    </button>
  );
}

export default LoginButton;