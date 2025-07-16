import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";


const StatCard = ({ title, desc, keys, values }) => {
  return (
    <Card className=" p-0 gap-0 w-full">
      <CardHeader className="p-3">
        <CardTitle>{title}</CardTitle>
        <CardDescription className=" truncate ">{desc}</CardDescription>{" "}
      </CardHeader>
      <Separator />
      <CardContent className="p-3 space-y-2">
        <ol className="space-y-1">
          {keys.map((key, index) => (
            <li key={index} className="flex justify-between">
              <span className="text-base">{key}</span>
              <span className="text-primary font-semibold ml-2">
                {values[index]}
              </span>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
};

export default StatCard;
