import "./content.css";
import { MessageType } from "./types";
import { getContentApi } from "./contentApi";

const REGEXP_GIT_REPO_URI = new RegExp(/^(((https?\:\/\/)(((([a-zA-Z0-9][a-zA-Z0-9\-\_]{1,252})\.){1,8}[a-zA-Z]{2,63})\/))|((ssh\:\/\/)?git\@)(((([a-zA-Z0-9][a-zA-Z0-9\-\_]{1,252})\.){1,8}[a-zA-Z]{2,63})(\:)))([a-zA-Z0-9][a-zA-Z0-9\_\-]{1,36})(\/)([a-zA-Z0-9][a-zA-Z0-9\_\-]{1,36})((\.git)?)$/);

const colors = {
    "BEGINNER": "#2ae015",
    "INTERMEDIATTE": "#f8a01c",
    "HARD": "#01548a",
    "EXPERT": "#b40537" 
}

let dataContainer: any;

chrome.runtime.sendMessage({ type: "REQ_TOGGLE_STATUS" });

interface IDifficultyInterface {
    difficultyLevel: "BEGINNER" | "INTERMEDIATTE" | "HARD" | "EXPERT";
    _count: {
        rating: number
    }
}

const createElement = (response: any) => {
    dataContainer = document.createElement("div");
    const listContainer = document.createElement("ul");
    listContainer.className = "list-style-none";
    let children = ""
    response.difficulty.forEach((item: IDifficultyInterface) => {
        children = children+`<span>
                <svg class="octicon octicon-dot-fill mr-2" style="color:${colors[item?.difficultyLevel]};" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8z"></path></svg>
                <span class="color-text-primary text-bold mr-1">${item?.difficultyLevel}</span>
                <span>X ${item?._count?.rating || 0}</span>
            <span>
            `
    })
    children = children + `
    <a onClick="onRateClick()">
        <span>
            <span class="color-text-primary text-bold mr-1">rate</span>
        <span>
    </a>`;

    function onRateClick() {
        chrome.runtime.sendMessage("OPEN_PLUGIN");
    }

    dataContainer.className="BorderGrid-row"
    dataContainer.innerHTML=`<div class="BorderGrid-cell">
        <h2 class="h4 mb-3">Rating</h2>
        ${children}
    </div>`
    const parentDom = document.getElementsByClassName('BorderGrid')[0];
    parentDom.appendChild(dataContainer);
}

const getContentData = async (projectId: any) => {
    const slugs = window?.location?.href.split('/');
    const projectName = slugs[2] || "";
    const ownerName = slugs[1] || "";
    const response = await getContentApi(projectId, {
        name: projectName,
        ownerName
    })
    createElement(response);
}

let isEnabled = false;
// let token = "";
chrome.runtime.onMessage.addListener((message: MessageType) => {
    switch (message.type) {
        case "TOGGLE_STATUS":
            if (message.isEnabled) {
                if (!isEnabled && REGEXP_GIT_REPO_URI.test(window?.location?.href)) {
                    const metas = Array.from(document.getElementsByTagName("meta"));
                    const meta = metas.find(item => item.name === 'optimizely-datafile')
                    if(meta?.content) {
                        const content = JSON.parse(meta?.content) || {};
                        const projectId = content?.projectId || "";
                        getContentData(projectId)
                    }
                }
            } else {
                dataContainer?.parentNode?.removeChild(dataContainer);
            }
            isEnabled = message.isEnabled;
            break;
        // case "TOKEN":
        //     token = message.token;
        default:
            break;
    }
});