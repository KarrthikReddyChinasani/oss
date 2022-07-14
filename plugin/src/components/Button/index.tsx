import * as React from "react";
import { useEffect } from "react";
import { MessageType } from "../../types";
import "./styles.css";

const Button = ({ isOnBefore = false}) => {

  const [isEnabled, setIsEnabled] = React.useState(false);

  useEffect(() => {
    chrome.runtime.sendMessage({ type: "TOGGLE_ON_OFF", isEnabled: isOnBefore });
  }, []);

  React.useEffect(() => {
    chrome.runtime.sendMessage({ type: "REQ_TOGGLE_STATUS" });

    chrome.runtime.onMessage.addListener((message: MessageType) => {
      switch (message.type) {
        case "TOGGLE_STATUS":
          setIsEnabled(message.isEnabled);
          break;
        default:
          break;
      }
    });
  }, []);

  const onClick = () => {
    chrome.runtime.sendMessage({ type: "TOGGLE_ON_OFF", isEnabled: !isEnabled });
  };

  return (
    <div className="buttonContainer">
      <button className="snowButton" onClick={onClick}>
        {isEnabled ? "Disable the snow 🥶" : "Let it snow! ❄️"}
      </button>
    </div>
  );
};

export default React.memo(Button);