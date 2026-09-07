import React from 'react';

interface TelegramIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

/**
 * Bootstrap Icons: Telegram
 * Official SVG from icons.getbootstrap.com/icons/telegram/
 */
export const TelegramIcon: React.FC<TelegramIconProps> = ({ 
  size = 16, 
  className = "w-4 h-4", 
  ...props 
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="currentColor"
      className={`bi bi-telegram inline-block shrink-0 ${className}`}
      viewBox="0 0 16 16"
      {...props}
    >
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.287 5.906q-1.168.486-4.666 2.01-.567.225-.595.442c-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294q.39.01.868-.32 3.269-2.206 3.374-2.23c.05-.012.12-.026.166.016s.042.12.037.141c-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8 8 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629q.14.092.27.187c.331.236.63.448.997.414.214-.02.435-.22.547-.82q.403-2.148 1.01-5.187.126-.64-.002-.883a.7.7 0 0 0-.52-.27q-.38-.01-1.285.352"/>
    </svg>
  );
};

export default TelegramIcon;
