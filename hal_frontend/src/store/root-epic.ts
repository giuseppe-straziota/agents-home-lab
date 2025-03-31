import { combineEpics } from "redux-observable";

import * as agent from "@/components/agentCanvas/data/epics";
import * as settings from "../data/epics";

export default combineEpics(
    ...Object.values(agent),
    ...Object.values(settings)
);