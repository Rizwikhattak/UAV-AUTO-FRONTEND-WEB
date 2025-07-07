"use client";
import { CONSTANTS, ROUTES } from "@/utils/constants";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ProtectedLayout = ({ children }) => {
  const auth = useSelector((state) => state.auth);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!auth.isAuthorized) {
      return router.push(ROUTES.LOGIN);
    } else {
      // if (auth.data.role === CONSTANTS.MAINTENANCE_ROLE)
      //   router.push(ROUTES.MAINTENANCE_MISSIONS);
      // else router.push(ROUTES.HOME);
      setIsLoading(false);
    }
  }, []);
  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="relative h-[80vh] w-[40vw]">
          <Image src="/Images/loading_image.png" fill />
        </div>
      </div>
    );
  return <>{children}</>;
};

export default ProtectedLayout;
