import { Navbar } from "./navbar";

interface ContentLayoutProps {
  title?: string;
  children: React.ReactNode;
}

export function ContentLayout({ title, children }: ContentLayoutProps) {
  return (
    <div>
      <Navbar />
      <div className="pt-6 pb-6 px-4 sm:px-6">{children}</div>
    </div>
  );
}
