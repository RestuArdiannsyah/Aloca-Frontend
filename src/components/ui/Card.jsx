export const Card = ({ children, className = '', onClick }) => (
  <div
    className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} ${className}`}
    onClick={onClick}
  >
    {children}
  </div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);
