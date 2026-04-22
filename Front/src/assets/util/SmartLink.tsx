import { useLocation, useNavigate } from "react-router-dom";

interface SmartLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

export function SmartLink({ to, children, className }: SmartLinkProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const toUrl = new URL(to, window.location.origin);
    const toPathname = toUrl.pathname;
    if (location.pathname === toPathname) {
      window.location.href = to;
      return;
    }
    navigate(to);
  };

  return (
    <a href={to} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
