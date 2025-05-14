import React from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import { Skeleton } from "../ui/skeleton";
import SpinnerCommon from "./SpinnerCommon";

const NavigationCommon = ({
  navList = [],
  activeTab,
  handleClick,
  isLoading = false,
  ...props
}) => {
  return (
    <>
      <NavigationMenu>
        <NavigationMenuList>
          {isLoading ? (
            <SpinnerCommon className="w-10 h-10" />
          ) : (
            navList &&
            navList.map((navItem) => (
              <NavigationMenuItem
                key={navItem?.id}
                className={`${
                  activeTab === navItem?.name
                    ? "!text-primary-custom border-b border-primary-custom group"
                    : ""
                } !pb-2 box-border hover:border-b hover:border-primary-custom  h-10`}
              >
                <NavigationMenuLink
                  className={`flex hover:!bg-transparent items-center gap-2 ${navigationMenuTriggerStyle()} cursor-pointer`}
                  onClick={() => handleClick(navItem?.name)}
                  {...props}
                >
                  <span
                    className={`${
                      activeTab === navItem?.name
                        ? "group-hover:text-primary-custom"
                        : ""
                    }`}
                  >
                    {navItem?.name}
                  </span>
                  {(navItem?.count || navItem?.count === 0) && (
                    <span
                      className={`total-count mb-1 text-white w-6 h-6 flex items-center justify-center rounded-lg text-xs ${
                        activeTab === navItem?.name
                          ? "!bg-primary-custom"
                          : "bg-gray-300"
                      }`}
                    >
                      <span>{navItem?.count}</span>
                    </span>
                  )}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </>
  );
};

export default NavigationCommon;
