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
exports.__esModule = true;
exports.Router = exports.testApps = exports.EntryType = exports.checkAppsflyerUnits = exports.initFacebook = exports.clearAdAccounts = exports.removeAdAccounts = exports.addAdAccounts = exports.unpairAllAdAccounts = exports.addRequest = void 0;
var express = require("express");
var selenium = require("selenium-webdriver");
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
        .setFirefoxOptions(new firefox.Options().headless())
        .build();
    // appsflyerWebdriver = new selenium.Builder()
    //     .withCapabilities(selenium.Capabilities.firefox())
    //     .setFirefoxOptions(new firefox.Options().headless())
    //     .build()
}
catch (e) {
    console.log(e);
}
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
        var e_1, parentDiv, input, e_2, result, _i, _a, accountId, e_3, e_4;
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
                    e_1 = _b.sent();
                    processing = false;
                    entry.callback(null);
                    console.log("Can't open advanced settings.");
                    checkQueue();
                    return [3 /*break*/, 4];
                case 4:
                    parentDiv = null;
                    input = null;
                    _b.label = 5;
                case 5:
                    _b.trys.push([5, 8, , 9]);
                    return [4 /*yield*/, facebookWebdriver.findElement(selenium.By.id('advertiser_account_ids'))];
                case 6:
                    parentDiv = _b.sent();
                    return [4 /*yield*/, parentDiv.findElement(selenium.By.css("div>div>div>span>label>input"))];
                case 7:
                    input = _b.sent();
                    return [3 /*break*/, 9];
                case 8:
                    e_2 = _b.sent();
                    processing = false;
                    entry.callback(null);
                    console.log("Can't find input.");
                    checkQueue();
                    return [3 /*break*/, 9];
                case 9:
                    result = [];
                    _b.label = 10;
                case 10:
                    _b.trys.push([10, 26, , 27]);
                    if (!(parentDiv && input)) return [3 /*break*/, 23];
                    _i = 0, _a = entry.ids;
                    _b.label = 11;
                case 11:
                    if (!(_i < _a.length)) return [3 /*break*/, 23];
                    accountId = _a[_i];
                    accountId = accountId.trim();
                    _b.label = 12;
                case 12:
                    _b.trys.push([12, 14, , 15]);
                    return [4 /*yield*/, parentDiv.findElement(selenium.By.xpath("//span[@title='" + accountId + "']"))];
                case 13:
                    _b.sent();
                    result.push({ id: accountId, success: false });
                    console.log("Already present: " + accountId);
                    return [3 /*break*/, 22];
                case 14:
                    e_3 = _b.sent();
                    return [3 /*break*/, 15];
                case 15: return [4 /*yield*/, input.sendKeys(accountId)];
                case 16:
                    _b.sent();
                    return [4 /*yield*/, facebookWebdriver.wait(function () {
                            return selenium.until.elementLocated(selenium.By.xpath("//span[text()[contains(., '" + accountId + "')]]"));
                        })];
                case 17:
                    _b.sent();
                    return [4 /*yield*/, facebookWebdriver.sleep(600)];
                case 18:
                    _b.sent();
                    return [4 /*yield*/, input.sendKeys(selenium.Key.ENTER)];
                case 19:
                    _b.sent();
                    return [4 /*yield*/, facebookWebdriver.wait(function () {
                            return selenium.until.elementLocated(selenium.By.xpath("//span[@title='" + accountId + "']"));
                        })];
                case 20:
                    _b.sent();
                    result.push({ id: accountId, success: true });
                    return [4 /*yield*/, facebookWebdriver.sleep(300)];
                case 21:
                    _b.sent();
                    _b.label = 22;
                case 22:
                    _i++;
                    return [3 /*break*/, 11];
                case 23: return [4 /*yield*/, facebookWebdriver.findElement(selenium.By.name("save_changes"))];
                case 24: return [4 /*yield*/, (_b.sent()).click()];
                case 25:
                    _b.sent();
                    return [3 /*break*/, 27];
                case 26:
                    e_4 = _b.sent();
                    console.log(e_4);
                    if (tries >= 3) {
                        processing = false;
                        entry.callback(null);
                    }
                    else {
                        addAdAccounts(entry, tries + 1);
                    }
                    return [2 /*return*/];
                case 27:
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
        var e_5, result, _i, _a, accountId, span, button, e_6, e_7;
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
                    e_5 = _b.sent();
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
                    _i = 0, _a = entry.ids;
                    _b.label = 6;
                case 6:
                    if (!(_i < _a.length)) return [3 /*break*/, 15];
                    accountId = _a[_i];
                    _b.label = 7;
                case 7:
                    _b.trys.push([7, 11, , 12]);
                    return [4 /*yield*/, facebookWebdriver.findElement(selenium.By.xpath("//span[@title='" + accountId + "']"))];
                case 8:
                    span = _b.sent();
                    return [4 /*yield*/, span.findElement(selenium.By.xpath("./../span[2]/button"))];
                case 9:
                    button = _b.sent();
                    return [4 /*yield*/, button.sendKeys(selenium.Key.ENTER)];
                case 10:
                    _b.sent();
                    return [3 /*break*/, 12];
                case 11:
                    e_6 = _b.sent();
                    result.push({ id: accountId, success: false });
                    return [3 /*break*/, 14];
                case 12:
                    result.push({ id: accountId, success: true });
                    return [4 /*yield*/, facebookWebdriver.sleep(300)];
                case 13:
                    _b.sent();
                    _b.label = 14;
                case 14:
                    _i++;
                    return [3 /*break*/, 6];
                case 15: return [4 /*yield*/, facebookWebdriver.findElement(selenium.By.name("save_changes"))];
                case 16: return [4 /*yield*/, (_b.sent()).click()];
                case 17:
                    _b.sent();
                    return [3 /*break*/, 19];
                case 18:
                    e_7 = _b.sent();
                    console.log(e_7);
                    if (tries >= 3) {
                        processing = false;
                        entry.callback(null);
                    }
                    else {
                        removeAdAccounts(entry, tries + 1);
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
exports.removeAdAccounts = removeAdAccounts;
function clearAdAccounts(entry, tries) {
    if (tries === void 0) { tries = 0; }
    return __awaiter(this, void 0, void 0, function () {
        var e_8, result, buttons, _i, buttons_1, button, e_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    processing = true;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, facebookWebdriver.get("https://developers.facebook.com/apps/" + entry.app.facebookId + "/settings/advanced/")];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_8 = _a.sent();
                    processing = false;
                    entry.callback(null);
                    console.log("Can't open advanced settings.");
                    checkQueue();
                    return [3 /*break*/, 4];
                case 4:
                    result = [];
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 14, , 15]);
                    return [4 /*yield*/, facebookWebdriver.wait(function () {
                            return selenium.until.elementLocated(selenium.By.xpath("//div[contains(@class,'_59_n')]"));
                        })];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, facebookWebdriver.findElements(selenium.By.xpath("//button[contains(@class,'_1z6_ _50zy _50zz _50z- _5upp _42ft')]"))];
                case 7:
                    buttons = _a.sent();
                    _i = 0, buttons_1 = buttons;
                    _a.label = 8;
                case 8:
                    if (!(_i < buttons_1.length)) return [3 /*break*/, 11];
                    button = buttons_1[_i];
                    return [4 /*yield*/, facebookWebdriver.executeScript("arguments[0].click()", button)];
                case 9:
                    _a.sent();
                    _a.label = 10;
                case 10:
                    _i++;
                    return [3 /*break*/, 8];
                case 11: return [4 /*yield*/, facebookWebdriver.findElement(selenium.By.name("save_changes"))];
                case 12: return [4 /*yield*/, (_a.sent()).click()];
                case 13:
                    _a.sent();
                    return [3 /*break*/, 15];
                case 14:
                    e_9 = _a.sent();
                    if (tries >= 3) {
                        processing = false;
                        entry.callback(null);
                    }
                    else {
                        clearAdAccounts(entry, tries + 1);
                    }
                    return [2 /*return*/];
                case 15:
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
        var e_10;
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
                    e_10 = _a.sent();
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
        var unitsLeft, unitsLeftText;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, appsflyerWebdriver.get("https://hq1.appsflyer.com/auth/login")];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, appsflyerWebdriver.findElement(selenium.By.id('user-email')).sendKeys(app.appsflyerLogin)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, appsflyerWebdriver.findElement(selenium.By.id('password-field')).sendKeys(app.appsflyerPassword)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, appsflyerWebdriver.findElement(selenium.By.xpath("//button[contains(@class,'btn btn-lg btn-primary submit-btn')]")).click()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, appsflyerWebdriver.get("https://hq1.appsflyer.com/account/myplan/overview")];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, appsflyerWebdriver.sleep(4000)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, appsflyerWebdriver.wait(function () {
                            return selenium.until.elementLocated(selenium.By.xpath("//span[contains(@class,'af-formatted-number')]"));
                        })];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, appsflyerWebdriver.findElement(selenium.By.xpath("(//span[contains(@class,'af-formatted-number')])[2]"))];
                case 8:
                    unitsLeft = _a.sent();
                    return [4 /*yield*/, unitsLeft.getText()];
                case 9:
                    unitsLeftText = (_a.sent()).replace(',', '').replace('.', '');
                    console.log(parseInt(unitsLeftText));
                    return [2 /*return*/];
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
function testApps() {
    return __awaiter(this, void 0, void 0, function () {
        var e_11;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    // let app = await App.findOne({ facebookId: "143740674106408" })
                    // if (app) {
                    return [4 /*yield*/, checkAppsflyerUnits({ appsflyerLogin: "JokeInFire@yandex.ru", appsflyerPassword: "Qwerty1234!" })
                        // }
                    ];
                case 1:
                    // let app = await App.findOne({ facebookId: "143740674106408" })
                    // if (app) {
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    e_11 = _a.sent();
                    console.log(e_11);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.testApps = testApps;
