import { signOut } from "next-auth/react";
import { useLayoutEffect } from "react";

const LogoutPage = () => {
  useLayoutEffect(() => {
    void signOut({
      callbackUrl: "/auth/sign-in",
    });
  }, []);

  return null;
};

export default LogoutPage;
