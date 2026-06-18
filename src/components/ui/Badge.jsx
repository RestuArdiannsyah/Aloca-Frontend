const variants = {
  success: 'bg-green-100 text-green-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
  warning: 'bg-yellow-100 text-yellow-700',
  primary: 'bg-[#00C2A8]/10 text-[#009F8A]',
  gray: 'bg-gray-100 text-gray-600',
};

export const Badge = ({ children, variant = 'gray', className = '' }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
  >
    {children}
  </span>
);
