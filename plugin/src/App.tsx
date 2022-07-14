import * as React from "react";
import "./App.css";
import Button from "./components/Button";
import Main from "./pages/Main";
import { useState } from "react";
import { useEffect } from "react";
import AccountBox from "pages/AccountBox";

const App = () => {
  const isOnBefore = JSON.parse(localStorage?.getItem("isTurnedOn") + "") || false;
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const onLoginSuccess = () => {
    setIsLoggedIn(true);
  }

  useEffect(() => {
    const loggedIn = localStorage.getItem("authKey") || false;
    if(loggedIn) {
      setIsLoggedIn(Boolean(loggedIn));
    }
  }, []);

  useEffect(() => {
    chrome.runtime.onMessage.addListener((message: any) => {
      switch (message.type) {
        case "OPEN_PLUGIN":
            chrome.runtime.openOptionsPage();
          break;
        default:
          break;
      }
    });
  }, [])

  return (
    <div className="App">
        <Button isOnBefore={isOnBefore}/>
        {
          isLoggedIn ? <Main /> : 
          <AccountBox onLoginSuccess={onLoginSuccess} />
        }
    </div>
  );
};

export default React.memo(App);