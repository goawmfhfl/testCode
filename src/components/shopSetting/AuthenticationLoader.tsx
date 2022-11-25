import { useState, useEffect } from "react";

import ValidText from "@components/common/ValidText";

const AuthenticationLoader = () => {
  const [text, setText] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(() => {
      setText((prev) => {
        if (prev.length < 3) {
          return prev + ".";
        }

        return "";
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return <ValidText valid={true}>인증 중{text}</ValidText>;
};

export default AuthenticationLoader;
