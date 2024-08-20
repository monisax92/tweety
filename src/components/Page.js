import React, { useEffect } from "react";
import Container from "./Container";

function Page(props) {
  useEffect(() => {
    document.title = `${props.title} | Tweety`;
    window.scrollTo(0, 0);
  }, [props.title]);

  return <Container wider={props.wider}>{props.children}</Container>;
}

export default Page;
