import React from "react";
import { Label } from "../ui/label";
import { Search } from "lucide-react";
import { Input } from "../ui/input";

const IconInputCommon = ({ type, id, placeholder, Icon, ...props }) => {
  return (
    <div className="relative w-full">
      <Label htmlFor={id}>
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
      </Label>

      <Input
        type={type}
        id={id}
        placeholder={placeholder}
        className="!pl-10" // Extra padding to prevent overlap with the icon
        {...props}
      />
    </div>
  );
};

export default IconInputCommon;
