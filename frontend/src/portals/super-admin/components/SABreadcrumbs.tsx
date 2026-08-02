import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface Props {
  items?: Breadcrumb[];
}

export function SABreadcrumbs({ items }: Props) {
  const location = useLocation();
  
  // If no items provided, try to auto-generate from path (simple fallback)
  const paths = items || location.pathname
    .split('/')
    .filter((p) => p && p !== 'super-admin')
    .map((p, i, arr) => ({
      label: p.charAt(0).toUpperCase() + p.slice(1).replace(/-/g, ' '),
      href: i === arr.length - 1 ? undefined : `/super-admin/${arr.slice(0, i + 1).join('/')}`
    }));

  if (paths.length === 0) return null;

  return (
    <nav className="flex items-center space-x-1 text-sm text-slate-500 dark:text-slate-400 mb-6" aria-label="Breadcrumb">
      <Link
        to="/super-admin/dashboard"
        className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center"
      >
        <Home className="h-4 w-4" />
      </Link>
      
      {paths.map((item, index) => (
        <div key={item.label} className="flex items-center">
          <ChevronRight className="h-4 w-4 mx-1 flex-shrink-0 text-slate-400" />
          {item.href ? (
            <Link
              to={item.href}
              className="hover:text-slate-900 dark:hover:text-white transition-colors truncate max-w-[150px] sm:max-w-[200px]"
            >
              {item.label}
            </Link>
          ) : (
            <span
              className="font-medium text-slate-900 dark:text-slate-200 truncate max-w-[150px] sm:max-w-[200px]"
              aria-current="page"
            >
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
