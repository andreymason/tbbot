"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = exports.startAppsflyerThread = exports.checkAppsflyer = exports.EntryType = exports.checkAppsflyerUnits = exports.initFacebook = exports.clearAdAccounts = exports.removeAdAccounts = exports.addAdAccounts = exports.unpairAllAdAccounts = exports.addRequest = void 0;
var express = __importStar(require("express"));
var selenium = __importStar(require("selenium-webdriver"));
var _1 = require(".");
var models_1 = require("./models");
var firefox = require('selenium-webdriver/firefox');
var router = express.Router();
exports.Router = router;
var FACEBOOK_USERNAME = "pazyukrus84@gmail.com";
var FACEBOOK_PASSWORD = "abakanaNa19";
var fbIsReady = false;
var processing = false;
var queue = [];
var facebookWebdriver;
var appsflyerWebdriver;
try {
    facebookWebdriver = new selenium.Builder()
        .withCapabilities(selenium.Capabilities.firefox())
        //.setFirefoxOptions(new firefox.Options().headless())
        .build();
    appsflyerWebdriver = new selenium.Builder()
        .withCapabilities(selenium.Capabilities.firefox())
        .setFirefoxOptions(new firefox.Options().headless())
        .build();
    checkAppsflyer();
}
catch (e) {
    console.log(e);
}
// App.findOneAndUpdate({ bundle: "boo.bast.jo" }, { appsflyerLogin: "boombastic.joker@yandex.com", appsflyerPassword: "Qwerty1234!" }).exec()
// App.findOneAndUpdate({ bundle: "pol.wolfsca" }, { appsflyerLogin: "wolvescards-hd@yandex.ru", appsflyerPassword: "Qwerty1234!" }).exec()
// App.findOneAndUpdate({ bundle: "jok.games.infinity" }, { appsflyerLogin: "jokerinfinity@yandex.ru", appsflyerPassword: "Jokerinfinity123!" }).exec()
// App.findOneAndUpdate({ bundle: "com.firejo.jok" }, { appsflyerLogin: "JokeInFire@yandex.ru", appsflyerPassword: "Qwerty1234!" }).exec()
// App.findOneAndUpdate({ bundle: "com.crzbanana.crz" }, { appsflyerLogin: "crzbanana@yandex.ru", appsflyerPassword: "Qwerty1234!" }).exec()
// App.findOneAndUpdate({ bundle: "com.egyptdynas" }, { appsflyerLogin: "boombasticegypt@yandex.com", appsflyerPassword: "Qwerty1234!" }).exec()
function addRequest(entry) {
    queue.push(entry);
    console.log("Added entry, " + queue.length + " entries total.");
    checkQueue();
}
exports.addRequest = addRequest;
function unpairAllAdAccounts(app) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    addRequest({
                        type: EntryType.FACEBOOK_CLEAR,
                        app: app,
                        ids: [],
                        callback: resolve
                    });
                })];
        });
    });
}
exports.unpairAllAdAccounts = unpairAllAdAccounts;
function checkQueue() {
    if (fbIsReady && !processing && queue.length > 0) {
        var nextEntry = queue.shift();
        if (nextEntry) {
            try {
                switch (nextEntry.type) {
                    case EntryType.FACEBOOK_ADD:
                        addAdAccounts(nextEntry);
                        break;
                    case EntryType.FACEBOOK_REMOVE:
                        removeAdAccounts(nextEntry);
                        break;
                    case EntryType.FACEBOOK_CLEAR:
                        clearAdAccounts(nextEntry);
                        break;
                }
            }
            catch (e) {
                console.log(e);
            }
        }
    }
}
function addAdAccounts(entry, tries) {
    if (tries === void 0) { tries = 0; }
    return __awaiter(this, void 0, void 0, function () {
        var e_1, parentDiv, input, e_2, result, _a, _b, accountId, e_3, e_4_1, e_5;
        var e_4, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    processing = true;
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, facebookWebdriver.get("https://developers.facebook.com/apps/" + entry.app.facebookId + "/settings/advanced/")];
                case 2:
                    _d.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _d.sent();
                    processing = false;
                    entry.callback(null);
                    console.log("Can't open advanced settings.");
                    checkQueue();
                    return [3 /*break*/, 4];
                case 4:
                    parentDiv = null;
                    input = null;
                    _d.label = 5;
                case 5:
                    _d.trys.push([5, 8, , 9]);
                    return [4 /*yield*/, facebookWebdriver.findElement(selenium.By.id('advertiser_account_ids'))];
                case 6:
                    parentDiv = _d.sent();
                    return [4 /*yield*/, parentDiv.findElement(selenium.By.css("div>div>div>span>label>input"))];
                case 7:
                    input = _d.sent();
                    return [3 /*break*/, 9];
                case 8:
                    e_2 = _d.sent();
                    processing = false;
                    entry.callback(null);
                    console.log("Can't find input.");
                    checkQueue();
                    return [3 /*break*/, 9];
                case 9:
                    result = [];
                    _d.label = 10;
                case 10:
                    _d.trys.push([10, 30, , 31]);
                    if (!(parentDiv && input)) return [3 /*break*/, 27];
                    _d.label = 11;
                case 11:
                    _d.trys.push([11, 25, 26, 27]);
                    _a = __values(entry.ids), _b = _a.next();
                    _d.label = 12;
                case 12:
                    if (!!_b.done) return [3 /*break*/, 24];
                    accountId = _b.value;
                    accountId = accountId.trim();
                    _d.label = 13;
                case 13:
                    _d.trys.push([13, 15, , 16]);
                    return [4 /*yield*/, parentDiv.findElement(selenium.By.xpath("//span[@title='" + accountId + "']"))];
                case 14:
                    _d.sent();
                    result.push({ id: accountId, success: false });
                    console.log("Already present: " + accountId);
                    return [3 /*break*/, 23];
                case 15:
                    e_3 = _d.sent();
                    return [3 /*break*/, 16];
                case 16: return [4 /*yield*/, input.sendKeys(accountId)];
                case 17:
                    _d.sent();
                    return [4 /*yield*/, facebookWebdriver.wait(function () {
                            return selenium.until.elementLocated(selenium.By.xpath("//span[text()[contains(., '" + accountId + "')]]"));
                        })];
                case 18:
                    _d.sent();
                    return [4 /*yield*/, facebookWebdriver.sleep(600)];
                case 19:
                    _d.sent();
                    return [4 /*yield*/, input.sendKeys(selenium.Key.ENTER)];
                case 20:
                    _d.sent();
                    return [4 /*yield*/, facebookWebdriver.wait(function () {
                            return selenium.until.elementLocated(selenium.By.xpath("//span[@title='" + accountId + "']"));
                        })];
                case 21:
                    _d.sent();
                    result.push({ id: accountId, success: true });
                    return [4 /*yield*/, facebookWebdriver.sleep(300)];
                case 22:
                    _d.sent();
                    _d.label = 23;
                case 23:
                    _b = _a.next();
                    return [3 /*break*/, 12];
                case 24: return [3 /*break*/, 27];
                case 25:
                    e_4_1 = _d.sent();
                    e_4 = { error: e_4_1 };
                    return [3 /*break*/, 27];
                case 26:
                    try {
                        if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                    }
                    finally { if (e_4) throw e_4.error; }
                    return [7 /*endfinally*/];
                case 27: return [4 /*yield*/, facebookWebdriver.findElement(selenium.By.name("save_changes"))];
                case 28: return [4 /*yield*/, (_d.sent()).click()];
                case 29:
                    _d.sent();
                    return [3 /*break*/, 31];
                case 30:
                    e_5 = _d.sent();
                    console.log(e_5);
                    if (tries >= 3) {
                        processing = false;
                        entry.callback(null);
                    }
                    else {
                        addAdAccounts(entry, tries + 1);
                    }
                    return [2 /*return*/];
                case 31:
                    entry.callback(result);
                    processing = false;
                    checkQueue();
                    return [2 /*return*/];
            }
        });
    });
}
exports.addAdAccounts = addAdAccounts;
function removeAdAccounts(entry, tries) {
    if (tries === void 0) { tries = 0; }
    return __awaiter(this, void 0, void 0, function () {
        var e_6, result, _a, _b, accountId, span, button, e_7, e_8_1, e_9;
        var e_8, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    processing = true;
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, facebookWebdriver.get("https://developers.facebook.com/apps/" + entry.app.facebookId + "/settings/advanced/")];
                case 2:
                    _d.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_6 = _d.sent();
                    processing = false;
                    entry.callback(null);
                    console.log("Can't open advanced settings.");
                    checkQueue();
                    return [3 /*break*/, 4];
                case 4:
                    result = [];
                    _d.label = 5;
                case 5:
                    _d.trys.push([5, 22, , 23]);
                    _d.label = 6;
                case 6:
                    _d.trys.push([6, 17, 18, 19]);
                    _a = __values(entry.ids), _b = _a.next();
                    _d.label = 7;
                case 7:
                    if (!!_b.done) return [3 /*break*/, 16];
                    accountId = _b.value;
                    _d.label = 8;
                case 8:
                    _d.trys.push([8, 12, , 13]);
                    return [4 /*yield*/, facebookWebdriver.findElement(selenium.By.xpath("//span[@title='" + accountId + "']"))];
                case 9:
                    span = _d.sent();
                    return [4 /*yield*/, span.findElement(selenium.By.xpath("./../span[2]/button"))];
                case 10:
                    button = _d.sent();
                    return [4 /*yield*/, button.sendKeys(selenium.Key.ENTER)];
                case 11:
                    _d.sent();
                    return [3 /*break*/, 13];
                case 12:
                    e_7 = _d.sent();
                    result.push({ id: accountId, success: false });
                    return [3 /*break*/, 15];
                case 13:
                    result.push({ id: accountId, success: true });
                    return [4 /*yield*/, facebookWebdriver.sleep(300)];
                case 14:
                    _d.sent();
                    _d.label = 15;
                case 15:
                    _b = _a.next();
                    return [3 /*break*/, 7];
                case 16: return [3 /*break*/, 19];
                case 17:
                    e_8_1 = _d.sent();
                    e_8 = { error: e_8_1 };
                    return [3 /*break*/, 19];
                case 18:
                    try {
                        if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                    }
                    finally { if (e_8) throw e_8.error; }
                    return [7 /*endfinally*/];
                case 19: return [4 /*yield*/, facebookWebdriver.findElement(selenium.By.name("save_changes"))];
                case 20: return [4 /*yield*/, (_d.sent()).click()];
                case 21:
                    _d.sent();
                    return [3 /*break*/, 23];
                case 22:
                    e_9 = _d.sent();
                    if (tries >= 3) {
                        processing = false;
                        entry.callback(null);
                    }
                    else {
                        removeAdAccounts(entry, tries + 1);
                    }
                    return [2 /*return*/];
                case 23:
                    entry.callback(result);
                    processing = false;
                    checkQueue();
                    return [2 /*return*/];
            }
        });
    });
}
exports.removeAdAccounts = removeAdAccounts;
function clearAdAccounts(entry, tries) {
    if (tries === void 0) { tries = 0; }
    return __awaiter(this, void 0, void 0, function () {
        var e_10, result, buttons, buttons_1, buttons_1_1, button, e_11_1, e_12;
        var e_11, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    processing = true;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, facebookWebdriver.get("https://developers.facebook.com/apps/" + entry.app.facebookId + "/settings/advanced/")];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_10 = _b.sent();
                    processing = false;
                    entry.callback(null);
                    console.log("Can't open advanced settings.");
                    checkQueue();
                    return [3 /*break*/, 4];
                case 4:
                    result = [];
                    _b.label = 5;
                case 5:
                    _b.trys.push([5, 18, , 19]);
                    return [4 /*yield*/, facebookWebdriver.wait(function () {
                            return selenium.until.elementLocated(selenium.By.xpath("//div[contains(@class,'_59_n')]"));
                        })];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, facebookWebdriver.findElements(selenium.By.xpath("//button[contains(@class,'_1z6_ _50zy _50zz _50z- _5upp _42ft')]"))];
                case 7:
                    buttons = _b.sent();
                    _b.label = 8;
                case 8:
                    _b.trys.push([8, 13, 14, 15]);
                    buttons_1 = __values(buttons), buttons_1_1 = buttons_1.next();
                    _b.label = 9;
                case 9:
                    if (!!buttons_1_1.done) return [3 /*break*/, 12];
                    button = buttons_1_1.value;
                    return [4 /*yield*/, facebookWebdriver.executeScript("arguments[0].click()", button)];
                case 10:
                    _b.sent();
                    _b.label = 11;
                case 11:
                    buttons_1_1 = buttons_1.next();
                    return [3 /*break*/, 9];
                case 12: return [3 /*break*/, 15];
                case 13:
                    e_11_1 = _b.sent();
                    e_11 = { error: e_11_1 };
                    return [3 /*break*/, 15];
                case 14:
                    try {
                        if (buttons_1_1 && !buttons_1_1.done && (_a = buttons_1.return)) _a.call(buttons_1);
                    }
                    finally { if (e_11) throw e_11.error; }
                    return [7 /*endfinally*/];
                case 15: return [4 /*yield*/, facebookWebdriver.findElement(selenium.By.name("save_changes"))];
                case 16: return [4 /*yield*/, (_b.sent()).click()];
                case 17:
                    _b.sent();
                    return [3 /*break*/, 19];
                case 18:
                    e_12 = _b.sent();
                    if (tries >= 3) {
                        processing = false;
                        entry.callback(null);
                    }
                    else {
                        clearAdAccounts(entry, tries + 1);
                    }
                    return [2 /*return*/];
                case 19:
                    entry.callback(result);
                    processing = false;
                    checkQueue();
                    return [2 /*return*/];
            }
        });
    });
}
exports.clearAdAccounts = clearAdAccounts;
function initFacebook() {
    return __awaiter(this, void 0, void 0, function () {
        var e_13;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, facebookWebdriver.get("https://developers.facebook.com/apps/")];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 6, , 7]);
                    return [4 /*yield*/, facebookWebdriver.wait(function () {
                            return selenium.until.elementLocated(selenium.By.xpath("//button[@data-cookiebanner='accept_button']"));
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, facebookWebdriver.findElement(selenium.By.xpath("//button[@data-cookiebanner='accept_button']"))];
                case 4: return [4 /*yield*/, (_a.sent()).click()];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    e_13 = _a.sent();
                    return [3 /*break*/, 7];
                case 7: return [4 /*yield*/, facebookWebdriver.findElement(selenium.By.name('email')).sendKeys(FACEBOOK_USERNAME)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, facebookWebdriver.findElement(selenium.By.name('pass')).sendKeys(FACEBOOK_PASSWORD)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, facebookWebdriver.findElement(selenium.By.name('login')).click()];
                case 10:
                    _a.sent();
                    fbIsReady = true;
                    checkQueue();
                    return [2 /*return*/];
            }
        });
    });
}
exports.initFacebook = initFacebook;
function checkAppsflyerUnits(app) {
    return __awaiter(this, void 0, void 0, function () {
        var unitsLeft, unitsLeftNumber, _a, e_14;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, appsflyerWebdriver.get("https://hq1.appsflyer.com/auth/login")];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, appsflyerWebdriver.findElement(selenium.By.id('user-email')).sendKeys(app.appsflyerLogin)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, appsflyerWebdriver.findElement(selenium.By.id('password-field')).sendKeys(app.appsflyerPassword)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, appsflyerWebdriver.findElement(selenium.By.xpath("//button[contains(@class,'btn btn-lg btn-primary submit-btn')]")).click()];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, appsflyerWebdriver.get("https://hq1.appsflyer.com/account/myplan/overview")];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, appsflyerWebdriver.sleep(4000)];
                case 6:
                    _b.sent();
                    _b.label = 7;
                case 7:
                    _b.trys.push([7, 12, , 14]);
                    return [4 /*yield*/, appsflyerWebdriver.wait(function () {
                            return selenium.until.elementLocated(selenium.By.xpath("//span[contains(@class,'af-formatted-number')]"));
                        })];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, appsflyerWebdriver.findElement(selenium.By.xpath("(//span[contains(@class,'af-formatted-number')])[2]"))];
                case 9:
                    unitsLeft = _b.sent();
                    _a = parseInt;
                    return [4 /*yield*/, unitsLeft.getText()];
                case 10:
                    unitsLeftNumber = _a.apply(void 0, [(_b.sent()).replace(',', '').replace('.', '')]);
                    console.log(app.name + ": " + unitsLeftNumber + " left (" + app.appsflyerLogin + " / " + app.appsflyerPassword + ")}");
                    return [4 /*yield*/, models_1.App.updateOne({ _id: app._id }, { appsflyerUnitsLeft: unitsLeftNumber }).exec()];
                case 11:
                    _b.sent();
                    return [3 /*break*/, 14];
                case 12:
                    e_14 = _b.sent();
                    console.log(e_14);
                    return [4 /*yield*/, models_1.App.updateOne({ _id: app._id }, { appsflyerUnitsLeft: 0 }).exec()];
                case 13:
                    _b.sent();
                    return [3 /*break*/, 14];
                case 14: return [2 /*return*/];
            }
        });
    });
}
exports.checkAppsflyerUnits = checkAppsflyerUnits;
function sleep(ms) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    setTimeout(resolve, ms);
                })];
        });
    });
}
var EntryType;
(function (EntryType) {
    EntryType[EntryType["FACEBOOK_ADD"] = 0] = "FACEBOOK_ADD";
    EntryType[EntryType["FACEBOOK_REMOVE"] = 1] = "FACEBOOK_REMOVE";
    EntryType[EntryType["FACEBOOK_CLEAR"] = 2] = "FACEBOOK_CLEAR";
    EntryType[EntryType["APPSFLYER_CHECK"] = 3] = "APPSFLYER_CHECK";
})(EntryType = exports.EntryType || (exports.EntryType = {}));
function checkAppsflyer() {
    return __awaiter(this, void 0, void 0, function () {
        var apps, apps_1, apps_1_1, app, success, index, e_15, e_16_1;
        var e_16, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, models_1.App.find()];
                case 1:
                    apps = _b.sent();
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 14, 15, 16]);
                    apps_1 = __values(apps), apps_1_1 = apps_1.next();
                    _b.label = 3;
                case 3:
                    if (!!apps_1_1.done) return [3 /*break*/, 13];
                    app = apps_1_1.value;
                    // console.log(`${app.name} - ${app.appsflyerUnitsLeft}`)
                    if (app.banned || !app.published || !app.appsflyerLogin) {
                        return [3 /*break*/, 12];
                    }
                    else {
                        console.log("" + app);
                    }
                    success = false;
                    index = 0;
                    _b.label = 4;
                case 4:
                    if (!(index < 3)) return [3 /*break*/, 9];
                    _b.label = 5;
                case 5:
                    _b.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, checkAppsflyerUnits(app)];
                case 6:
                    _b.sent();
                    success = true;
                    return [3 /*break*/, 9];
                case 7:
                    e_15 = _b.sent();
                    console.log(app.appsflyerLogin + " / " + app.appsflyerPassword);
                    return [3 /*break*/, 8];
                case 8:
                    index++;
                    return [3 /*break*/, 4];
                case 9:
                    if (!!success) return [3 /*break*/, 12];
                    return [4 /*yield*/, _1.showAppsflyerIsBroken(app)];
                case 10:
                    _b.sent();
                    return [4 /*yield*/, models_1.App.updateOne({ _id: app._id }, { appsflyerUnitsLeft: 0 }).exec()];
                case 11:
                    _b.sent();
                    _b.label = 12;
                case 12:
                    apps_1_1 = apps_1.next();
                    return [3 /*break*/, 3];
                case 13: return [3 /*break*/, 16];
                case 14:
                    e_16_1 = _b.sent();
                    e_16 = { error: e_16_1 };
                    return [3 /*break*/, 16];
                case 15:
                    try {
                        if (apps_1_1 && !apps_1_1.done && (_a = apps_1.return)) _a.call(apps_1);
                    }
                    finally { if (e_16) throw e_16.error; }
                    return [7 /*endfinally*/];
                case 16:
                    console.log("Finished AppsFlyer checking");
                    return [2 /*return*/];
            }
        });
    });
}
exports.checkAppsflyer = checkAppsflyer;
var wait = function (ms) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve) {
                setTimeout(resolve, ms);
            })];
    });
}); };
var startAppsflyerThread = function () { return __awaiter(void 0, void 0, void 0, function () {
    var e_17;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!true) return [3 /*break*/, 6];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                console.log("Starting AppsFlyer check");
                return [4 /*yield*/, checkAppsflyer()];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                e_17 = _a.sent();
                console.log(e_17);
                return [3 /*break*/, 4];
            case 4: return [4 /*yield*/, wait(3 * 60 * 60 * 1000)];
            case 5:
                _a.sent();
                return [3 /*break*/, 0];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.startAppsflyerThread = startAppsflyerThread;
