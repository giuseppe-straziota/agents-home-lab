import prismaClient from "../lib/prisma.js";

/**
 * retrieveAllDataByTableName
 *
 * This tool function takes two parameters:
 *  - argsFromAssistant: Ignored for this function
 *  - def_tool: A configuration object containing tool configuration,
 *       e.g. {
 *         tool_config: {
 *           table: "item",
 *           fields: ['name','quantity']
 *         }
 *       }
 *
 * The function builds a SELECT query based on the provided configuration and arguments,
 * executes it against the PostgreSQL database, and returns the selected rows.
 */
export const retrieveAllDataByTableName = async (argsFromAssistant, def_tool) => {

    try {
        const fields = def_tool.tool_config.fields?def_tool.tool_config.fields.join(','):'*';
        const query = `
          SELECT ${fields} 
          FROM ${def_tool.tool_config.table}
        `;
        const result = await prismaClient.$queryRawUnsafe(query);

        return result
    } catch (error) {
        console.log(error)
        return []
    }

}

/**
 * updateDataByTableName
 *
 * This tool function takes two parameters:
 *  - argsFromAssistant: The arguments sent by OpenAI, e.g.
 *       [{
 *         fieldToUpdate: "quantity",
 *         newValue: 42,
 *         fieldCondition: "name",
 *         conditionValue: "apple"
 *       }]
 *  - def_tool: A configuration object containing tool configuration,
 *       e.g. {
 *         tool_config: {
 *           table: "item",
 *           fields: ["name", "quantity"]
 *         }
 *       }
 *
 * The function builds an UPDATE query based on the provided configuration and arguments,
 * executes it against the PostgreSQL database, and returns the updated rows.
 *

 */
export const updateDataByTableName = (argsFromAssistant,def_tool) => {
    try {
        // Extract table name and the field names from the configuration.
        // These should come from a trusted configuration to avoid SQL injection.
        const table = def_tool.tool_config.table;
        console.log('updateDataByTableName', argsFromAssistant);
        const conflictField = argsFromAssistant.conflictField;
        argsFromAssistant.updates.forEach(async (value) => {

            const condition = {}
            condition[conflictField] = value.conditionValue
            const createItem = {}
            createItem[value.fieldCondition] = value.conditionValue;
            createItem[value.fieldToUpdate] = value.newValue;
            const updateItem = {}
            updateItem[value.fieldToUpdate] = value.newValue;
            const result = await prismaClient[table].upsert({
                where:  condition                 ,
                update: updateItem,
                create: createItem,
            })
            console.log(result)
        })
        return "Updated successfully.";
    } catch (error) {
        console.error("Error updating data:", error);
        return "Something went wrong, no updated done.";
    }
};

