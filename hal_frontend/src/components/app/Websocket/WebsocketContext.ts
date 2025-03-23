import { createContext } from "react";

// @ts-expect-error check error
const WSContext = createContext({sendWSMessage: (message:  string | ArrayBufferLike | Blob | ArrayBufferView): void =>{}})

export default WSContext;