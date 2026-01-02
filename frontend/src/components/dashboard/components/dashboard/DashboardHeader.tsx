interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
}

export default function DashboardHeader({ 
  title = "Welcome back", 
  subtitle = "Continue where you left off" 
}: DashboardHeaderProps) {
  return (
    <div className="mb-10">
      <h1 className="text-2xl font-normal text-neutral-800 mb-1">
        {title}
      </h1>
      <p className="text-neutral-400 text-sm font-light">
        {subtitle}
      </p>
    </div>
  );
}
