# How to create a tool

The idea behind the design of this application is to create a function template,an abstract object,
that you can reuse as many times as needed, changing only the parameters, to suit each specific case. 
This way, whenever you need a new tool, you can choose one of the predefined templates, 
configure it with the appropriate database table and fields, and add a description (a very important part) 
that will trigger its usage.

Below, you'll find the steps I follow to create a new tool.

## Tool Creation Overview
In my mind, a tool is defined as a function template that allows you to update or query the database
by simply specifying the necessary parameters.
An abstraction that enables the system to generate the appropriate user interface (UI) dynamically
and trigger the tool with relevant context when needed. I suppose that this template will change during the
time when new tools and new LLM will be introduced.

### 1. Insert a Row in the Tools Table 
Add a new entry into the tool table in your database. The row should include:
   - name: The name of the JavaScript function you plan to provide (this must match exactly the function name that you later define).
   - label:  A descriptive label that will appear in the list of available tools.
   - template: a json template defining the dynamic UI form. This template specifies the fields necessary to configure the tool.
### 2. Create the JavaScript Function
Create the JavaScript function that implements the tool’s logic.
The function must have **the same name** as specified in the name field of the tool table.

### 3. Register the Function for the Agent
Make the tool available to your agents by adding it to a mapping object in your project. 
For example, update the file toolMap.js (located under server/tools) as follows:
```
// /src/server/tools/toolMap.js
export const fnMap = {
// ... other tools,
'retrieveAllDataByTableName': retrieveAllDataByTableName
};
```

And this is all we need to create a tool. 

The tools provided are then defined as follows.

### retrieveAllDataByTableName
1. Values used into the database field
  
    - name:retrieveAllDataByTableName
    - label: Tool to retrieve data from the database
    - template:
     ```yaml
     {
      "description":{"type":"textarea","label":"Description"},
      "tool_name": {"type":"input","label":"Name"},
      "table": {"type": "select","items":["item","category","pantry"],"label": "Table"},
      "fields": {
          "type":"array",
          "label":"Fields",
          "arrayType":"string",
          "description":"Add field that you want use retrieve from the table"
          }
     }
     
### Some explanation about the content of this template.
    
 Every key define a piece of the form that you need to define the tool, the value of this key will be an object with
    
- label: the label that will describe the component into the form
- type: the value of type define the kind of component the available are

  - texarea
  - input
  - select: this type need an array of string, in this example are some table that you can query
  - array: this type is the more complex and is used to 
  create a dynamical component where you can add or remove value, in this example I used this type to add and remove the 
  field in the select that the function will use. The arrayType define in this case the type of the object collected.

2. Building of the Javascript function 

   ```javascript
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
   } }

a quite simple function, using prisma to query the db, the def_tool parameter contains the data
based on the template choose, in this case an array of fields to populate the select and the table value.
The parameter argsFromAssistant, will be present in all the function even if is not used as in this case.

3. Add the function to the available for an agent

   ```javascript
   /src/server/tools/toolMap.js
   
   export const fnMap = {
   ...
   'retrieveAllDataByTableName': retrieveAllDataByTableName
   }
   
### updateDataByTableName

This tool is used to update existing items (or create them if they don't exist) using parameters determined by the assistant. It allows you to update a specific field (e.g., quantity or unit) based on a condition (e.g., the name of the item).

1. Values used into the database field

    - name:updateDataByTableName
    - label: Tool to update the database
    - template:
     ```yaml
     {
        "description": {"type":"textarea","label":"Description"},
        "tool_name": {"type":"input","label":"Name"},
        "table": {
            "type":"select",
            "label": "Table","items":["item","pantry","category"]},
            "parameters": 
                {
                 "type":"textarea",
                 "label":"Parameters",
                 "description":"Add the parameters to send at the assistant"
                }
     }

in this template the value of parameters is a json that is used to create a tool for openAi specifically as you can see 
looking into the tool create using this template (see Update_pantry using the client or directly in the table agent_tool of the database)

2. The Javascript function

   ```javascript
   export const updateDataByTableName = (argsFromAssistant,def_tool) => {
    try { 
        const table = def_tool.tool_config.table; 
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
        })
        return "Updated successfully.";
    } catch (error) {
        console.error("Error updating data:", error);
        return "Something went wrong, no updated done.";
    }};
    ```

just a bit complex but no more than this. In this case the function is build to accept both arguments, from the
llm and the value defined inside the template instance used for this function.

3. Register the Function for the Agent

   ```javascript
   /src/server/tools/toolMap.js
   
   export const fnMap = {
   ...
   'updateDataByTableName':updateDataByTableName
   }
   ```

**Contact me for any questions or doubts**  😏
