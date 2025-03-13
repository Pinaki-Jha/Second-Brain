import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";


const PopupMenu = ({ isVisible, position, options, onClose }) => {
  if (!isVisible) return null;

  return ReactDOM.createPortal(
    <div
      className="absolute w-32 py-2 h-24 bg-white text-center border-2 z-50"
      style={{ top: position.top, left: position.left }}
    >
      {options.map((option, idx) => (
        <div key={idx}>
          <button onClick={option.action}>{option.label}</button>
          {idx < options.length - 1 && <hr />}
        </div>
      ))}
    </div>,
    document.body // Render outside the scrollable div
  );
};

/* const PopupMenu = ({ isVisible, position, options, onClose }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isVisible) return;

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose(); // Close the popup if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return ReactDOM.createPortal(
    <div
      ref={menuRef}
      className="absolute w-32 py-2 bg-white text-center border-2 z-50"
      style={{ top: position.top, left: position.left }}
    >
      {options.map((option, idx) => (
        <React.Fragment key={idx}>
          <button onClick={option.action}>{option.label}</button>
          {idx < options.length - 1 && <hr />}
        </React.Fragment>
      ))}
    </div>,
    document.body // Render outside the scrollable div
  );
};
 */
export default PopupMenu;
