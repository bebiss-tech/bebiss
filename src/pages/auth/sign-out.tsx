import { signOut } from "next-auth/react";
import { useEffect } from "react";

const LogoutPage = () => {
  useEffect(() => {
    void signOut({
      callbackUrl: "/auth/sign-in",
    });
  }, []);

  return null;
};

export default LogoutPage;
