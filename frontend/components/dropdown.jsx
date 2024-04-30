import React, { useState } from "react";

const ExpandableBox = ({ initialText, expandedText }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="border border-gray-300 p-4 w-1/2 mx-auto">
      <div className="flex justify-between items-center">
        <div>{isExpanded ? expandedText : initialText}</div>
        <div>
          <button onClick={toggleExpansion}>
            {isExpanded ? "▲ Less" : "▼ More"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpandableBox;
