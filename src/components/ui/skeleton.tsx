
import { cn } from "@/lib/utils";
import { CSSProperties } from "react";

interface SkeletonProps {
  className?: string;
  style?: CSSProperties;
}

export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      style={style}
    />
  );
}

export function SkeletonCard({ className, style }: SkeletonProps) {
  return (
    <div 
      className={cn("animate-pulse rounded-md bg-muted", className)} 
      style={style}
    />
  );
}
