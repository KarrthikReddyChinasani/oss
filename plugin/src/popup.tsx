import * as React from "react";
import * as ReactDOM from "react-dom";
import {
    QueryClient,
    QueryClientProvider,
} from 'react-query';

import App from "./App";
import "./popup.css";

var mountNode = document.getElementById("popup");
const queryClient = new QueryClient();
ReactDOM.render(
    <QueryClientProvider client={queryClient}>
        <App />
    </QueryClientProvider>,
mountNode);
