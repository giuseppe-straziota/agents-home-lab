import {LlmModel, SettingsModel, ToolsModel} from "typesafe-actions";
import {LlmRequest, ToolRequest} from "@/store/types";

export {loadTools, loadConfiguration, upsertTool, deleteTool, loadLlm, upsertLlm, deleteLlm};

function loadConfiguration(): Promise<SettingsModel>  {
    return new Promise((resolve) => {
        fetch("/api/configuration", {
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

    });
}
function loadTools(): Promise<ToolsModel>  {
    return new Promise((resolve) => {
        fetch("/api/tool", {
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

    });
}

function upsertTool(tool: ToolRequest): Promise<ToolsModel>  {
    return new Promise((resolve) => {
        fetch("/api/tool", {
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

    });
}

function deleteTool(data: {tool_uuid:string}): Promise<ToolsModel>  {
    return new Promise((resolve) => {
        fetch("/api/tool", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                tool_uuid: data.tool_uuid
            }),
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log("data from api add agent", data);
                resolve(data);
            });
    });
}

function loadLlm(): Promise<LlmModel>  {
    return new Promise((resolve) => {
        fetch("/api/llm", {
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

    });
}


function upsertLlm(llm: LlmRequest): Promise<ToolsModel>  {
    return new Promise((resolve) => {
        fetch("/api/llm", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(
                llm
            ),
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log(data);
                resolve(data);
            });

    });
}


function deleteLlm(data: {llm_uuid:string}): Promise<ToolsModel>  {
    return new Promise((resolve) => {
        fetch("/api/llm", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                llm_uuid: data.llm_uuid
            }),
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log("data from api add agent", data);
                resolve(data);
            });
    });
}