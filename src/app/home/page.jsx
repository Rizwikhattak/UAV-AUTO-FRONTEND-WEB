import HomePage from "@/components/Home/page";
import ProtectedLayout from "@/components/ProtectedLayout/ProtectedLayout";
import React from "react";

const home = () => {
  return (
    <>
      {/* <ProtectedLayout> */}
        <HomePage />
      {/* </ProtectedLayout> */}
    </>
  );
};

export default home;
