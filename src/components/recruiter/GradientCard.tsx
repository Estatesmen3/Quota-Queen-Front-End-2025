
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface GradientCardProps {
  className?: string;
  children: React.ReactNode;
  gradientClassName?: string;
  footer?: React.ReactNode;
  header?: React.ReactNode;
}

const GradientCard = ({
  className,
  children,
  gradientClassName = "dopamine-gradient-1",
  footer,
  header,
}: GradientCardProps) => {
  return (
    <Card className={cn("overflow-hidden border-0 shadow-md card-hover-effect", className)}>
      <div className={cn("h-2 w-full", gradientClassName)} />
      {header && <CardHeader>{header}</CardHeader>}
      <CardContent className={cn("pt-6", !header && "pt-6")}>
        {children}
      </CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
};

export default GradientCard;
