import React, { ReactNode, useEffect, useState } from "react";

interface PopupProps {
    children: React.ReactNode;
    className?: string;
    x: number;
    y: number;
    direction: string;
    style?: any;
}

const Popup: React.FC<PopupProps> = ({ children, className, x, y, direction, style }) => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const updateScreenWidth = () => {
    setScreenWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", updateScreenWidth);
  }, []);

  return (
    <div
      className={
        "fixed rounded-md z-10 w-[70%] max-w-[20rem] translate-x-[-50%] translate-y-[-50%] lg:translate-y-0 " +
        (className +
          (direction === "left"
            ? " lg:translate-x-[-100%]"
            : " lg:translate-x-0"))
      }
      style={
        screenWidth > 1024
          ? { left: x, top: y, ...style }
          : {
              left: "50%",
              top: "50%",
              ...style,
            }
      }
    >
      {children}
    </div>
  );
}

interface PopupButtonProps {
    onClick: () => any;
    className?: string;
    color: string;
    backgroundColor: string;
    children: ReactNode
}

export const PopupButton: React.FC<PopupButtonProps> = ({ onClick, className, color, backgroundColor, children }) => {
    return (
        <button
            onClick={onClick}
            className={
                "px-4 py-2 w-full hover:opacity/80 transition-all active:scale-110 " +
                className
            }
            style={{ backgroundColor: backgroundColor, color: color }}
        >
            {children}
        </button>
    );
}

export default Popup;