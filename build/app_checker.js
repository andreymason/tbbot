"use strict";
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
        while (_) try {
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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startCheckerThread = exports.checkApps = void 0;
var axios_1 = __importDefault(require("axios"));
var _1 = require(".");
var automatizer_1 = require("./automatizer");
var models_1 = require("./models");
var request = require("request");
var Agent = require('socks5-https-client/lib/Agent');
var checkApps = function () { return __awaiter(void 0, void 0, void 0, function () {
    var apps, apps_1, apps_1_1, app, published, e_1, e_2_1, e_3;
    var e_2, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 21, , 22]);
                return [4 /*yield*/, models_1.getApps()];
            case 1:
                apps = _b.sent();
                _b.label = 2;
            case 2:
                _b.trys.push([2, 18, 19, 20]);
                apps_1 = __values(apps), apps_1_1 = apps_1.next();
                _b.label = 3;
            case 3:
                if (!!apps_1_1.done) return [3 /*break*/, 17];
                app = apps_1_1.value;
                if (app.banned || app.removed)
                    return [3 /*break*/, 16];
                console.log("Checking " + app.name + " (" + app.bundle + "), banned: " + app.banned + ", removed: " + app.removed + ", published: " + app.published);
                _b.label = 4;
            case 4:
                _b.trys.push([4, 13, , 14]);
                return [4 /*yield*/, checkApp(app.bundle, app)];
            case 5:
                published = _b.sent();
                if (!(app.published && !published)) return [3 /*break*/, 9];
                return [4 /*yield*/, automatizer_1.unpairAllAdAccounts(app)];
            case 6:
                _b.sent();
                return [4 /*yield*/, models_1.markAppAsBanned(app)];
            case 7:
                _b.sent();
                return [4 /*yield*/, _1.showAppIsBannedMessage(app)];
            case 8:
                _b.sent();
                console.log(app.name + " is banned");
                return [3 /*break*/, 12];
            case 9:
                if (!(!app.published && published)) return [3 /*break*/, 12];
                return [4 /*yield*/, models_1.markAppAsPublished(app)];
            case 10:
                _b.sent();
                return [4 /*yield*/, _1.showAppIsPublishedMessage(app)];
            case 11:
                _b.sent();
                _b.label = 12;
            case 12: return [3 /*break*/, 14];
            case 13:
                e_1 = _b.sent();
                return [3 /*break*/, 14];
            case 14: return [4 /*yield*/, changeIp()];
            case 15:
                _b.sent();
                _b.label = 16;
            case 16:
                apps_1_1 = apps_1.next();
                return [3 /*break*/, 3];
            case 17: return [3 /*break*/, 20];
            case 18:
                e_2_1 = _b.sent();
                e_2 = { error: e_2_1 };
                return [3 /*break*/, 20];
            case 19:
                try {
                    if (apps_1_1 && !apps_1_1.done && (_a = apps_1.return)) _a.call(apps_1);
                }
                finally { if (e_2) throw e_2.error; }
                return [7 /*endfinally*/];
            case 20: return [3 /*break*/, 22];
            case 21:
                e_3 = _b.sent();
                console.error(e_3);
                return [3 /*break*/, 22];
            case 22: return [2 /*return*/];
        }
    });
}); };
exports.checkApps = checkApps;
var changeIp = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve) { return __awaiter(void 0, void 0, void 0, function () {
                var e_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, axios_1.default.request({
                                    url: "http://178.151.69.50:8080/20_reconnect+ID-92263480-ks.php",
                                    method: "GET",
                                    timeout: 8 * 1000
                                })];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            e_4 = _a.sent();
                            return [3 /*break*/, 3];
                        case 3:
                            setTimeout(resolve, 5 * 1000 + (2 * 60 * 1000) * Math.random());
                            return [2 /*return*/];
                    }
                });
            }); })];
    });
}); };
var checkApp = function (bundle, app) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                request({
                    url: "https://play.google.com/store/apps/details?id=" + bundle,
                    strictSSL: true,
                    agentClass: Agent,
                    agentOptions: {
                        socksHost: '178.151.69.50',
                        socksPort: 7020,
                        socksUsername: 'user20',
                        socksPassword: 'BKwRjj8t',
                    },
                    timeout: 10
                }, function (err, res) {
                    if (err) {
                        reject(err);
                    }
                    if (res) {
                        if (res.body.includes("We're sorry, the requested URL was not found on this server.")) {
                            resolve(false);
                        }
                        else {
                            var ratingMatch = res.body.match(/<div class="pf5lIe"><div aria-label="Rated (.{3})/);
                            if (ratingMatch && ratingMatch[1] !== "0.0") {
                                models_1.updateAppRating(app, ratingMatch[1]);
                            }
                            resolve(true);
                        }
                    }
                    else {
                        reject();
                    }
                });
            })];
    });
}); };
var wait = function (ms) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve) {
                setTimeout(resolve, ms);
            })];
    });
}); };
var startCheckerThread = function () { return __awaiter(void 0, void 0, void 0, function () {
    var e_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!true) return [3 /*break*/, 6];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, exports.checkApps()];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                e_5 = _a.sent();
                console.log(e_5);
                return [3 /*break*/, 4];
            case 4: return [4 /*yield*/, wait((45 + (Math.random() * 25)) * 60 * 1000)];
            case 5:
                _a.sent();
                return [3 /*break*/, 0];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.startCheckerThread = startCheckerThread;
