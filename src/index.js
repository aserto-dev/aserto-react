var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import React, { useCallback, useContext, useMemo, useState } from 'react';
import createAsertoClient from '@aserto/aserto-spa-js';
export var AsertoContext = React.createContext(null);
export var useAserto = function () { return useContext(AsertoContext); };
export var AsertoProvider = function (_a) {
    var children = _a.children;
    var _b = useState(), asertoClient = _b[0], setAsertoClient = _b[1];
    var _c = useState(true), loading = _c[0], setLoading = _c[1];
    var _d = useState(false), isLoaded = _d[0], setIsLoaded = _d[1];
    var _e = useState(), error = _e[0], setError = _e[1];
    var _f = useState(), displayStateMap = _f[0], setDisplayStateMap = _f[1];
    var _g = useState(), identity = _g[0], setIdentity = _g[1];
    var _h = useState(true), throwOnError = _h[0], setThrowOnError = _h[1];
    var _j = useState({
        visible: false,
        enabled: false,
    }), defaultDisplayState = _j[0], setDefaultDisplayState = _j[1];
    var init = useCallback(function (initOptions, body) { return __awaiter(void 0, void 0, void 0, function () {
        var asertoFromHook, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    if (initOptions && initOptions.throwOnError === false) {
                        setThrowOnError(false);
                    }
                    if (initOptions && initOptions.defaultDisplayState) {
                        setDefaultDisplayState(initOptions.defaultDisplayState);
                    }
                    setLoading(true);
                    return [4 /*yield*/, createAsertoClient(initOptions, body)];
                case 1:
                    asertoFromHook = _a.sent();
                    setAsertoClient(asertoFromHook);
                    setDisplayStateMap(asertoFromHook.displayStateMap());
                    setIsLoaded(true);
                    setLoading(false);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    setError(error_1.message);
                    setIsLoaded(false);
                    setLoading(false);
                    if (!initOptions || initOptions.throwOnError) {
                        throw error_1;
                    }
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); }, []);
    var reload = useCallback(function (body, headers) { return __awaiter(void 0, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    if (!asertoClient) return [3 /*break*/, 2];
                    setLoading(true);
                    if (identity) {
                        if (headers) {
                            headers['identity'] = identity;
                        }
                        else {
                            headers = { identity: identity };
                        }
                    }
                    return [4 /*yield*/, asertoClient.reload(body, headers)];
                case 1:
                    _a.sent();
                    setDisplayStateMap(asertoClient.displayStateMap());
                    setLoading(false);
                    _a.label = 2;
                case 2: return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    if (throwOnError) {
                        throw error_2;
                    }
                    setError(error_2);
                    setIsLoaded(false);
                    setLoading(false);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [asertoClient, throwOnError, identity]);
    var getDisplayState = useCallback(function (method, path, policyRoot) {
        try {
            if (asertoClient && method) {
                return asertoClient.getDisplayState(method, path, policyRoot);
            }
            // no client or path
            if (throwOnError) {
                if (!asertoClient) {
                    throw new Error('aserto-react: must call init() before getDisplayState()');
                }
                if (!method) {
                    throw new Error('aserto-react: missing required parameter');
                }
            }
            else {
                // return the default display state
                return defaultDisplayState;
            }
        }
        catch (error) {
            if (throwOnError) {
                throw error;
            }
            setError(error);
            setIsLoaded(false);
            setLoading(false);
        }
    }, [asertoClient, defaultDisplayState, throwOnError]);
    var value = useMemo(function () { return ({
        loading: loading,
        displayStateMap: displayStateMap,
        init: init,
        reload: reload,
        getDisplayState: getDisplayState,
        isLoaded: isLoaded,
        identity: identity,
        setIdentity: setIdentity,
        error: error,
    }); }, [displayStateMap, error, getDisplayState, identity, init, isLoaded, loading, reload]);
    return React.createElement(AsertoContext.Provider, { value: value }, children);
};
//# sourceMappingURL=index.js.map