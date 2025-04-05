import {retrieveAllDataByTableName, updateDataByTableName} from "./databaseFn.js";


export const fnMap = {
    'retrieveAllDataByTableName': retrieveAllDataByTableName,
    'updateDataByTableName':updateDataByTableName
}