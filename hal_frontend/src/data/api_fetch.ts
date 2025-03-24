import {SettingsModel, ToolsModel} from "typesafe-actions";
import {ToolRequest} from "@/store/types";

export {loadTools, loadConfiguration, createTool};

function loadConfiguration(): Promise<SettingsModel>  {
    return new Promise((resolve) => {
        fetch('/api/configuration', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log(data);
                resolve(data);
            });

    })
}
function loadTools(): Promise<ToolsModel>  {
    return new Promise((resolve) => {
        fetch('/api/tool', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log(data);
                resolve(data);
            });

    })
}

function createTool(tool: ToolRequest): Promise<ToolsModel>  {
    return new Promise((resolve) => {
        fetch('/api/tool', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(
                  tool
            ),
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log(data);
                resolve(data);
            });

    })
}