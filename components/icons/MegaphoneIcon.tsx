
import React from 'react';

const MegaphoneIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-2.236 9.168-5.514C18.378 1.985 18.79 1.5 19.5 1.5c.665 0 1.305.475 1.625 1.122 1.052 2.182.998 4.657-.14 6.788-1.138 2.13-3.15 3.593-5.488 4.221M11 5.882l1.632-1.632a4.001 4.001 0 015.656 0l2.828 2.828a4.001 4.001 0 010 5.656l-1.632 1.632" />
  </svg>
);

export default MegaphoneIcon;
