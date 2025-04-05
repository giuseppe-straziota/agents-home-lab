import pool from "../lib/db.js";

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
        const result = await pool.query('SELECT '+fields+' FROM ' + def_tool.tool_config.table)
        console.log(def_tool.tool_config.table+" select call")
        return result.rows
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
 * openai parameters example
 * "parameters": {
 *         "type": "object",
 *         "required": [
 *             "updates"
 *         ],
 *         "properties": {
 *             "updates": {
 *                 "type": "array",
 *                 "description": "Array of objects containing fields to update.",
 *                 "items": {
 *                     "type": "object",
 *                     "required": [
 *                         "fieldToUpdate",
 *                         "newValue",
 *                         "fieldCondition",
 *                         "conditionValue"
 *                     ],
 *                     "properties": {
 *                         "fieldToUpdate": {
 *                             "type": "string",
 *                             "description": "The field that needs to be updated"
 *                         },
 *                         "newValue": {
 *                             "type": "number",
 *                             "description": "The new value to set for the field being updated"
 *                         },
 *                         "fieldCondition": {
 *                             "type": "string",
 *                             "description": "The field name to check against for the condition"
 *                         },
 *                         "conditionValue": {
 *                             "type": "string",
 *                             "description": "The value to match for the condition field"
 *                         }
 *                     },
 *                     "additionalProperties": false
 *                 }
 *
 */
export const updateDataByTableName = async (argsFromAssistant,def_tool) => {
    try {
        // Extract table name and the field names from the configuration.
        // These should come from a trusted configuration to avoid SQL injection.
        const table = def_tool.tool_config.table;
        console.log('updateDataByTableName', argsFromAssistant, def_tool);
        argsFromAssistant.updates.forEach( (value) => {
            const updateField = value.fieldToUpdate;
            const conditionField = value.fieldCondition;

            // Build the SQL query. Note: parameterized queries are used only for values.
            // const queryText = `UPDATE ${table} SET ${updateField} = $1 WHERE ${conditionField} = $2`;
            const queryText = `INSERT INTO ${table} ( ${updateField},  ${conditionField}) VALUES ($1,$2)  ON CONFLICT ( ${conditionField}) WHERE ${conditionField} = $2 DO UPDATE SET ${updateField} = $1`
            // Execute the query with the new value and condition value.
           console.log('queryText', queryText);
            pool.query(queryText, [value.newValue, value.conditionValue])
                .then(result => {
                    console.log(`Updated ${result.rowCount} row(s) in table ${table}`);
                });
        })
        return "Updated successfully.";
    } catch (error) {
        console.error("Error updating data:", error);
        return "Something went wrong, no updated done.";
    }
};

