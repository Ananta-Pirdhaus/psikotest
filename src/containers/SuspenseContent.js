import "../loading.scss";
import React from "react";

function SuspenseContent() {
  return (
    <div className="blur-background">
      <div className="ring">
        Loading
        <div className="circle"></div>
      </div>
    </div>
  );
}

export default SuspenseContent;
