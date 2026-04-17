interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Card({ title, children, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      {title && <h2 className="text-lg font-semibold text-gray-800 mb-3">{title}</h2>}
      {children}
    </div>
  );
}
