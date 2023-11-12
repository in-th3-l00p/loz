import React, { ReactNode, useEffect, useRef, useState } from "react";
import { Location } from "../utils/types";
import api from "../utils/api";

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
    className?: string;
    color: string;
    backgroundColor: string;
    children: ReactNode;
    location: Location;
    onClick?: () => void;
}

export const PopupButton: React.FC<PopupButtonProps> = ({ onClick, location, className, color, backgroundColor, children }) => {
    const input = useRef<HTMLInputElement>(null);

    return (
      <>
        <input 
          ref={input} type="file" accept="image/png" className="hidden"
          onChange={(e) => {
            if (e.currentTarget.files?.length !== 1)
                return;
            const formData = new FormData();
            formData.append("image", e.currentTarget.files.item(0)!);
            api.post(
                `/api/maps/${location.map_id}/locations/${location.id}/image`, 
                formData
            )
                .then(() => window.location.reload());
          }}
        />
        <button
            onClick={() => {
              if (onClick) {
                onClick();
                return;
              }

              if (input.current)
                input.current.click(); 
            }}
            className={
                "px-4 py-2 w-full hover:opacity/80 transition-all active:scale-110 " +
                className
            }
            style={{ backgroundColor: backgroundColor, color: color }}
        >
            {children}
        </button>
      </>
    );
}

export default Popup;