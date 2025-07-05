"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncContext = void 0;
exports.useSync = useSync;
const react_1 = require("react");
exports.SyncContext = (0, react_1.createContext)(undefined);
function useSync() {
    const context = (0, react_1.useContext)(exports.SyncContext);
    if (!context)
        throw new Error("useSync doit être utilisé dans un SyncProvider");
    return context;
}
