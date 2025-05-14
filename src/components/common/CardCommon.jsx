import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils";

const CardCommon = ({ style, cardTitle, cardContent, ...props }) => {
  return (
    <Card className={cn(style, "")} {...props}>
      <CardHeader className="!px-4">
        <CardTitle className="font-normal">{cardTitle}</CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-gray-500  !px-4">
        {cardContent}
      </CardContent>
    </Card>
  );
};

export default CardCommon;
