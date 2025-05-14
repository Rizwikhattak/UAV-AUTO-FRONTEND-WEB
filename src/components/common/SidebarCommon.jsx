import React, { useEffect } from "react";
import AvatarImg from "../../Asset/Image/Avatar.png";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ChevronsUp, ChevronsUpDown, Flame, Search } from "lucide-react";
import IconInputCommon from "./IconInputCommon";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../Store/Actions/authActions";
import { usePermissions } from "../../Utils/PermissionsContext";
import { authRequiredRoutes } from "../../routes";
import {
  setActiveBusiness,
  setAuthState,
} from "../../Store/Reducers/authSlice";
import { DASHBOARD_ROUTE } from "../../Utils/Constants";

const SidebarCommon = ({ currentElement, hadnleCurrentElement }) => {
  const { state } = useSidebar();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isRouteAccessible } = usePermissions();
  const auth = useSelector((state) => state.auth);
  console.log("Auth", auth);
  // Filter routes for sidebar display
  const allowedRoutes = authRequiredRoutes.filter(
    (route) => route.withSidebar && isRouteAccessible(route)
  );
  console.log("Authassadasdasd", JSON.parse(localStorage.getItem("newUser")));
  // const allowedRoutes = routes.filter((route) => {
  //   if (route.name === "Unauthorized") return false;
  //   if (!route.protected) return true;
  //   if (route.permission) {
  //     console.log(route.permission, permissions[route.permission] === true);
  //     return permissions[route.permission] === true;
  //   }
  //   return true;
  // });

  const handleLogOutUser = () => {
    dispatch(logoutUser());
  };
  return (
    <>
      <Sidebar className="h-full" collapsible="icon">
        <SidebarHeader>
          <SidebarGroup>
            <SidebarMenu className="!gap-4">
              <SidebarMenuItem>
                <ChevronsUp stroke="#1976D2" />
              </SidebarMenuItem>
              {state === "expanded" && (
                <SidebarMenuItem>
                  <IconInputCommon
                    type="text"
                    placeholder="Search"
                    id="search"
                    Icon={Search}
                  />
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup className="!p-0">
            <SidebarGroupLabel className="text-gray-500 !text-xs !p-0">
              CLIENTS
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="!h-11" asChild>
                      <SidebarMenuButton
                        asChild
                        className="bg-[#F766590D] hover:bg-[#F766590D]/65 cursor-pointer"
                      >
                        <span className="">
                          <Flame
                            fill="none"
                            stroke="#F76659"
                            strokeWidth={4}
                            className="bg-[#F766590D]"
                          />
                          <span className="">
                            <h1 className="text-nowrap font-medium">
                              {auth.active_business?.business?.business_name}
                            </h1>
                            <p className="text-nowrap text-xs text-gray-500">
                              Some other details
                            </p>
                          </span>
                          <ChevronsUpDown className="ml-auto" />
                        </span>
                      </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[18rem]">
                      {auth.role_permissions.length <= 1 ? (
                        <DropdownMenuItem disabled>
                          No Business
                        </DropdownMenuItem>
                      ) : (
                        auth.role_permissions
                          .filter(
                            (item) =>
                              item?.business?.id !==
                              auth.active_business?.business?.id
                          )
                          .map((item) => {
                            return (
                              <DropdownMenuItem
                                onClick={() => {
                                  dispatch(
                                    setActiveBusiness({
                                      ...item,
                                      bypass_permission: true,
                                    })
                                  );
                                  navigate(DASHBOARD_ROUTE);
                                }}
                              >
                                {item?.business?.business_name}
                              </DropdownMenuItem>
                            );
                          })
                      )}

                      {/* <DropdownMenuItem>
                        <span>Acme Inc.</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <span>Acme Corp.</span>
                      </DropdownMenuItem> */}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-gray-500 !text-xs !px-0">
              PAGES
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {allowedRoutes.map((item) =>
                  item.withSidebar ? (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton
                        className={cn(
                          "p-5 h-12 ",
                          currentElement === item.name &&
                            "bg-[#D7EDFF40] hover:bg-[#D7EDFF40] text-primary-custom hover:text-primary-custom font-medium text-sm"
                        )}
                        onClick={() => hadnleCurrentElement(item.name)}
                        asChild
                      >
                        <Link to={item.path}>
                          {item?.icon && <item.icon />}
                          <span>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ) : (
                    <></>
                  )
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    className={`!text-white ${
                      state === "collapsed"
                        ? "bg-none p-5 flex items-center justify-center"
                        : "!bg-[#1976D2]"
                    } !h-14 `}
                  >
                    <Avatar className="w-7 h-7">
                      <AvatarImage src={AvatarImg} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <span>
                      <h1 className="font-medium">Sarah Lee</h1>
                      <p className="text-xs">Sarah.lee@talent.inc</p>
                    </span>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      Profile
                      <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      Billing
                      <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      Settings
                      <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      Keyboard shortcuts
                      <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>Team</DropdownMenuItem>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        Invite users
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem>Email</DropdownMenuItem>
                          <DropdownMenuItem>Message</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>More...</DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuItem>
                      New Team
                      <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>GitHub</DropdownMenuItem>
                  <DropdownMenuItem>Support</DropdownMenuItem>
                  <DropdownMenuItem disabled>API</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogOutUser}>
                    Log out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </>
  );
};

export default SidebarCommon;
