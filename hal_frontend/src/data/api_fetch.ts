import {SettingsModel, TemplateTypeModel} from "typesafe-actions";
import {LlmRequest, ToolRequest} from "@/store/types";

export {loadTools, loadConfiguration, upsertTool, deleteTool, loadLlm, upsertLlm, deleteLlm,updateConfiguration};

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
                resolve(data);
            });

    });
}

function updateConfiguration(settings : {[key:string]:string|number}): Promise<SettingsModel>  {
    return new Promise((resolve) => {
        fetch("/api/configuration", {
            method: "POST",
            body: JSON.stringify(settings),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                resolve(data);
            });

    });
}

function loadTools(): Promise<TemplateTypeModel>  {
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
                resolve(data);
            });

    });
}

function upsertTool(tool: ToolRequest): Promise<TemplateTypeModel>  {
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
                resolve(data);
            });

    });
}

function deleteTool(data: {tool_uuid:string, agent_uuid:string, tool_name:string}): Promise<TemplateTypeModel>  {
    return new Promise((resolve) => {
        fetch("/api/tool", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                tool_uuid: data.tool_uuid,
                agent_uuid: data.agent_uuid,
                tool_name: data.tool_name,
            }),
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                resolve(data);
            });
    });
}

function loadLlm(): Promise<TemplateTypeModel>  {
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
                resolve(data);
            });

    });
}


function upsertLlm(llm: LlmRequest): Promise<TemplateTypeModel>  {
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
                resolve(data);
            });

    });
}


function deleteLlm(data: {llm_uuid:string,
    agent_uuid:string,
    llm_name:string}): Promise<TemplateTypeModel>  {
    return new Promise((resolve) => {
        fetch("/api/llm", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                llm_uuid: data.llm_uuid,
                agent_uuid: data.agent_uuid,
                llm_name: data.llm_name,
            }),
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                resolve(data);
            });
    });
}