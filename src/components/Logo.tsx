import { cn } from "@/lib/utils";

type LogoVariant = "light" | "dark";

const variantSrc: Record<LogoVariant, string> = {
  light: "/logos/logo-new-light.svg",
  dark: "/logos/logo-new-dark.svg",
};

type LogoProps = {
  variant?: LogoVariant;
  className?: string;
};

export const Logo = ({ variant = "light", className }: LogoProps) => {
  return (
    <img
      src={variantSrc[variant]}
      alt="Carbon Finance"
      className={cn("h-10 w-auto", className)}
      loading="lazy"
      draggable={false}
    />
  );
};
