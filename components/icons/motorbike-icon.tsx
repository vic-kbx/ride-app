import { cn } from "@/lib/utils";

type MotorbikeIconProps = {
  className?: string;
};

function MotorbikeIcon({ className }: MotorbikeIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("size-4", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="6" cy="16.5" r="2.5" />
      <circle cx="18" cy="16.5" r="2.5" />
      <path d="M8.5 16.5h6.5a2.5 2.5 0 0 0-2.5-2.5h-3l2-3h3" />
      <path d="M14.5 11h2.7l2.2 2.2" />
      <path d="M9.8 13.1 8.7 11H6.5" />
    </svg>
  );
}

export { MotorbikeIcon };
