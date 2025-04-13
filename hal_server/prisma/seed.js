
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
                    "type":"input",
                    "label": "Table"
                },
                "fields": {
                    "type":"array",
                    "label":"Fields",
                    "arrayType":"string",
                    "description":"Add field that you want use retrieve from the table"
                },
                "action": {
                    "type": "select",
                    "items":["SELECT"],
                    "label":"Action"
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
                    "type":"input",
                    "label": "Table"
                },
                "parameters": {
                    "type":"textarea",
                    "label":"Parameters",
                    "description":"Add the parameters to send at the assistant "
                },
                "action": {
                    "type": "select",
                    "items":["UPDATE"],
                    "label":"Action"
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
            config: {"tool_name":"Pantry_stock","table":"item","fields":["name","quantity","expiration_date"],"action":"SELECT","description":"Retrieve the list of items from my pantry store with name and quantity"}
        }
    })
    await prismaClient.agent_tool.create({
        data:{
            id_agent: agent.id,
            id_tool: tool_update.id,
            uuid: uuidv4(),
            config: {"tool_name":"Update_pantry","table":"item","parameters":{"type":"object","required":["updates"],"properties":{"updates":{"type":"array","description":"Array of objects containing fields to update.","items":{"type":"object","required":["fieldToUpdate","newValue","fieldCondition","conditionValue"],"properties":{"fieldToUpdate":{"type":"string","description":"The field that needs to be updated"},"newValue":{"type":"number","description":"The new value to set for the field being updated"},"fieldCondition":{"type":"string","description":"The field name to check against for the condition"},"conditionValue":{"type":"string","description":"The value to match for the condition field"}},"additionalProperties":false}}},"additionalProperties":false},"fields":[],"action":"UPDATE","description":"Use this function to update the quantities of items by passing an array of objects like this\n { \n  fieldToUpdate: \"quantity\",\n  newValue: 42,\n  fieldCondition: \"name\",\n  conditionValue: \"apple\"\n}"}
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
            name: "Milk",
            quantity: 1,
            unit: "litre"
        }
    })

    await prismaClient.item.create({
       data:{
           pantry_id: pantry.id,
           category_id: category.id,
           name: "Eggs",
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