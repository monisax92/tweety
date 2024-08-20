import React from "react";

function Container(props) {
  return (
    <div
      className={
        "container py-md-5 " + (props.wider ? "" : "container--narrow")
      }
    >
      {props.children}
    </div>
  );
}

export default Container;
