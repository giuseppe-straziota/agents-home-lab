
import {v4 as uuidv4} from "uuid";
import {PrismaClient} from "@prisma/client";

const prismaClient = new PrismaClient()

async function main() {
    const agent = await prismaClient.agent.upsert({
        where: {
            name: 'Alfred'
        },
        update: {
        },
        create: {
            name: 'Alfred',
            active: true,
            uuid: uuidv4(),
            description: 'Your lovely house keeper',
        },
    })

    const llm = await prismaClient.llm.create({
       data: {
           name: 'OpenAI',
           template: {
               "description":{
                   "type":"input",
                   "label": "Description"
               },
               "prompt": {
                   "type":"textarea",
                   "label":"Prompt"
               },
               "model": {
                   "type":"input",
                   "label":"Model"
               }
           },
           uuid: uuidv4(),
           label: "OpenAI"
       }
    })

    const tool_retrieve = await prismaClient.tool.create({
        data: {
            name: "retrieveAllDataByTableName",
            template: {
                "description":{
                    "type":"textarea",
                    "label":"Description"
                },
                "tool_name": {
                    "type":"input",
                    "label":"Name"
                },
                "table": {
                    "type": "select",
                    "items":["item","category","pantry"],
                    "label": "Table"
                },
                "fields": {
                    "type":"array",
                    "label":"Fields",
                    "arrayType":"string",
                    "description":"Add a field that you want to use to retrieve from the table"
                }
            },
            label: "Tool to retrieve data from the database"
        }
    })

    const tool_update = await prismaClient.tool.create({

        data:{
            template: {
                "description":{
                    "type":"textarea",
                    "label":"Description"
                },
                "tool_name": {
                    "type":"input",
                    "label":"Name"
                },
                "table": {
                    "type":"select",
                    "label": "Table",
                    "items":["item","pantry","category"]
                },
                "parameters": {
                    "type":"textarea",
                    "label":"Parameters",
                    "description":"Add the parameters to send at the assistant"
                }
            },
            label:"Tool to update the database",
            name: "updateDataByTableName"

        }
    })

    await prismaClient.agent_llm.create({
       data:{
           id_agent: agent.id,
           id_llm: llm.id,
           config: {"prompt":"You are a polite home assistant named Alfred who helps with groceries and chores","description":"My personal housekeeper","model":"gpt-4o-mini"},
           uuid: uuidv4(),

       }
    })

    await prismaClient.agent_tool.create({
        data:{
            id_agent: agent.id,
            id_tool: tool_retrieve.id,
            uuid: uuidv4(),
            config: {"tool_name":"Pantry_retrieval","table":"item","fields":["name","quantity","expiration_date","unit"],"description":"Get the list of items from my pantry store, including their names and quantities; please avoid using a list format."}
        }
    })
    await prismaClient.agent_tool.create({
        data:{
            id_agent: agent.id,
            id_tool: tool_update.id,
            uuid: uuidv4(),
            config: {"tool_name":"Update_pantry","table":"item","parameters":{"type":"object","properties":{"conflictField":{"type":"string","description":"The field to be used for conflict detection. For example: 'name'."},"updates":{"type":"array","description":"An array of objects specifying the updates to be performed.","items":{"type":"object","required":["fieldToUpdate","newValue","fieldCondition","conditionValue"],"properties":{"fieldToUpdate":{"type":"string","description":"The column to update (e.g., 'quantity' or 'unit')."},"newValue":{"type":"number","description":"The new numeric value to set."},"fieldCondition":{"type":"string","description":"The field name used to determine which row to update (e.g., 'name')."},"conditionValue":{"type":"string","description":"The value that must match in the fieldCondition (e.g., 'carota')."}},"additionalProperties":false}}},"required":["conflictField","updates"],"additionalProperties":false},"fields":[],"description":"Update or create items in the database. Use this function to update the quantity and unit for an existing item or create a new item if it does not exist. For example, from the prompt 'add 1kg of carrots and 4 apples', extract the items with their quantities and units."}
        }
    })
    await prismaClient.configuration.create({
       data:{
           name: "redis_max_msg_send",
           value: "5",
           type: "number",
           description: "Max number of messages to send to the LLM"
       }
    })
    await prismaClient.configuration.create({
        data:{
            name: "redis_max_stored",
            value: "17",
            type: "number",
            description: "Max number of messages retrieved by the store for sending to the client"
        }
    })
    await prismaClient.configuration.create({
        data:{
            name: "llm_max_istance",
            value: "1",
            type: "number",
            description: "Max LLM instances for an agent"
        }
    })

    const pantry = await prismaClient.pantry.create({
        data:{
            name: "Main Pantry",
            location: "Kitchen"
        }
    })
    const category = await prismaClient.category.create({
        data:{
            description:"Dairy products like milk, cheese, etc.",
            name: "Dairy",
        },
    })

    await prismaClient.item.create({
        data:{
            pantry_id: pantry.id,
            category_id: category.id,
            name: "milk",
            quantity: 1,
            unit: "liter"
        }
    })

    await prismaClient.item.create({
       data:{
           pantry_id: pantry.id,
           category_id: category.id,
           name: "eggs",
           quantity: 4,
           unit: "pieces"
       }
    })
}

main()
    .then(async () => {
        await prismaClient.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prismaClient.$disconnect()
        process.exit(1)
    })