"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
exports.__esModule = true;
exports.updateChatApp = exports.updateChatUploadMessageId = exports.updateChatStatus = exports.getChatStatusByUsername = exports.getChatStatusByChatId = exports.createChatStatus = exports.validApp = exports.allStatuses = exports.getUser = exports.removeApp = exports.updateApp = exports.reformatDb = exports.addApp = exports.getApp = exports.getApps = exports.updateAppRating = exports.markAppAsPublished = exports.markAppAsBanned = exports.removeUsers = exports.addUsers = exports.App = exports.getUsersData = exports.ChatStatusModel = exports.OSGroupModel = exports.OSSegmentModel = exports.WAITING_FOR_REMOVE_USERNAMES = exports.WAITING_FOR_APP_ADD = exports.WAITING_FOR_IDS_REMOVE = exports.WAITING_FOR_IDS_ADD = exports.PROCESSING_IDS = exports.WAITING_FOR_USERNAMES = exports.IDLE = void 0;
var mongoose_1 = require("mongoose");
exports.IDLE = 0;
exports.WAITING_FOR_USERNAMES = 2;
exports.PROCESSING_IDS = 3;
exports.WAITING_FOR_IDS_ADD = 1;
exports.WAITING_FOR_IDS_REMOVE = 4;
exports.WAITING_FOR_APP_ADD = 5;
exports.WAITING_FOR_REMOVE_USERNAMES = 6;
var OSSegmentSchema = new mongoose_1.Schema({
    at: [Object],
    country: Object,
    titles: [String],
    bodies: [String],
    images: [String],
    titleIndex: Number,
    bodyIndex: Number,
    imageIndex: Number
});
exports.OSSegmentModel = mongoose_1.model('OSSegment', OSSegmentSchema);
var OSGroupSchema = new mongoose_1.Schema({
    name: String,
    customization: Object
});
exports.OSGroupModel = mongoose_1.model('OSGroup', OSGroupSchema);
var ChatStatusSchema = new mongoose_1.Schema({
    chatId: Number,
    username: String,
    status: Number,
    app: Object,
    uploadMessageId: Number
});
exports.ChatStatusModel = mongoose_1.model('ChatStatus', ChatStatusSchema);
var UserSchema = new mongoose_1.Schema({
    username: String,
    addedBy: {
        type: String,
        "default": "Nobody"
    }
});
var User = mongoose_1.models.User || mongoose_1.model('User', UserSchema);
var AppSchema = new mongoose_1.Schema({
    name: String,
    facebookId: String,
    bundle: { type: String, unique: true },
    onesignalId: String,
    rating: {
        type: String,
        "default": "0.0"
    },
    appsflyerUnitsLeft: Number,
    appsflyerLogin: String,
    appsflyerPassword: String,
    appsflyerDevKey: String,
    metricaPostApiKey: String,
    metricaSdkKey: String,
    metricaAppId: String,
    privacyPolicyUrl: String,
    banned: {
        type: Boolean,
        "default": false
    },
    published: {
        type: Boolean,
        "default": false
    },
    removed: {
        type: Boolean,
        "default": false
    },
    facebook: {
        type: Boolean,
        "default": true
    }
});
exports.getUsersData = function () { return __awaiter(void 0, void 0, void 0, function () {
    var users, text, _i, users_1, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, User.find()];
            case 1:
                users = _a.sent();
                text = "";
                for (_i = 0, users_1 = users; _i < users_1.length; _i++) {
                    user = users_1[_i];
                    text += "@" + user.username + ", \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D @" + user.addedBy + "\n";
                }
                return [2 /*return*/, text];
        }
    });
}); };
// showUsers()
exports.App = mongoose_1.models.App || mongoose_1.model('App', AppSchema);
exports.addUsers = function (by, users) { return __awaiter(void 0, void 0, void 0, function () {
    var _i, users_2, username, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _i = 0, users_2 = users;
                _a.label = 1;
            case 1:
                if (!(_i < users_2.length)) return [3 /*break*/, 5];
                username = users_2[_i];
                return [4 /*yield*/, User.findOne({ username: username })];
            case 2:
                user = _a.sent();
                if (user || !username)
                    return [3 /*break*/, 4];
                return [4 /*yield*/, User.create({
                        username: username,
                        addedBy: by
                    })];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 1];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.removeUsers = function (users) { return __awaiter(void 0, void 0, void 0, function () {
    var _i, users_3, username, result, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _i = 0, users_3 = users;
                _a.label = 1;
            case 1:
                if (!(_i < users_3.length)) return [3 /*break*/, 5];
                username = users_3[_i];
                console.log(username);
                return [4 /*yield*/, User.deleteOne({
                        username: username
                    }).exec()];
            case 2:
                result = _a.sent();
                return [4 /*yield*/, User.findOne({
                        username: username
                    })];
            case 3:
                user = _a.sent();
                console.log(user);
                console.log(result);
                _a.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 1];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.markAppAsBanned = function (app) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, exports.App.updateOne({ facebookId: app.facebookId }, { banned: true }).exec()];
    });
}); };
exports.markAppAsPublished = function (app) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (exports.App.findById(app._id)).update({ published: true }).exec()];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.updateAppRating = function (app, rating) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (exports.App.findById(app._id)).update({ rating: rating }).exec()];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.getApps = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, exports.App.find()];
    });
}); };
exports.getApp = function (facebookId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, exports.App.findOne({ facebookId: facebookId })];
    });
}); };
// App.updateOne({bundle: "jok.games.infinity"}, {published: true}).exec()
// App.remove({ bundle: "vik.kingage.paptoss", facebook: true }).exec()
// App.remove({ bundle: "pol.wolfsca"}).exec()
exports.addApp = function (app) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.App.findOne({ bundle: app.bundle }).exec()];
            case 1:
                if (_a.sent()) {
                    return [2 /*return*/, exports.App.updateOne({ bundle: app.bundle }, app).exec()];
                }
                else
                    return [2 /*return*/, exports.App.create(__assign(__assign({}, app), { banned: false, published: false, rating: "0.0", group: null }))];
                return [2 /*return*/];
        }
    });
}); };
exports.reformatDb = function () { return __awaiter(void 0, void 0, void 0, function () {
    var apps, _i, apps_1, app;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.App.find()];
            case 1:
                apps = _a.sent();
                _i = 0, apps_1 = apps;
                _a.label = 2;
            case 2:
                if (!(_i < apps_1.length)) return [3 /*break*/, 5];
                app = apps_1[_i];
                return [4 /*yield*/, app.update({ facebookId: app.facebookId }).exec()];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.updateApp = function (facebookId, bundle, onesignalId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, exports.App.update({ facebookId: facebookId }, { bundle: bundle, onesignalId: onesignalId, banned: false }).exec()];
    });
}); };
exports.removeApp = function (facebookId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, exports.App.update({ facebookId: facebookId }, { removed: true }).exec()];
    });
}); };
exports.getUser = function (username) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, User.findOne({ username: username })];
    });
}); };
exports.allStatuses = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.ChatStatusModel.find()];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.validApp = function (facebookId) { return __awaiter(void 0, void 0, void 0, function () {
    var app;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.App.findOne({ facebookId: facebookId })];
            case 1:
                app = _a.sent();
                return [2 /*return*/, app !== null];
        }
    });
}); };
/** Chat status */
exports.createChatStatus = function (chatId, username) { return __awaiter(void 0, void 0, void 0, function () {
    var status;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.ChatStatusModel.findOne({ chatId: chatId })];
            case 1:
                status = _a.sent();
                if (!status) return [3 /*break*/, 3];
                return [4 /*yield*/, status.remove()];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [4 /*yield*/, exports.ChatStatusModel.create({
                    chatId: chatId,
                    username: username,
                    status: exports.IDLE,
                    app: null,
                    uploadMessageId: null
                })];
            case 4: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.getChatStatusByChatId = function (chatId) { return __awaiter(void 0, void 0, void 0, function () {
    var chatStatus;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.ChatStatusModel.findOne({ chatId: chatId })];
            case 1:
                chatStatus = _a.sent();
                if (chatStatus)
                    return [2 /*return*/, chatStatus];
                return [2 /*return*/];
        }
    });
}); };
exports.getChatStatusByUsername = function (username) { return __awaiter(void 0, void 0, void 0, function () {
    var chatStatus;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.ChatStatusModel.findOne({ username: username })];
            case 1:
                chatStatus = _a.sent();
                if (chatStatus)
                    return [2 /*return*/, chatStatus];
                return [2 /*return*/];
        }
    });
}); };
exports.updateChatStatus = function (chatId, status) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.ChatStatusModel.updateOne({ chatId: chatId }, { status: status }).exec()];
            case 1:
                _a.sent();
                return [2 /*return*/, exports.ChatStatusModel.findOne({ chatId: chatId })];
        }
    });
}); };
exports.updateChatUploadMessageId = function (chatId, messageId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.ChatStatusModel.updateOne({ chatId: chatId }, { uploadMessageId: messageId }).exec()];
            case 1:
                _a.sent();
                return [2 /*return*/, exports.ChatStatusModel.findOne({ chatId: chatId })];
        }
    });
}); };
exports.updateChatApp = function (chatId, app) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.ChatStatusModel.updateOne({ chatId: chatId }, { app: app }).exec()];
            case 1:
                _a.sent();
                return [2 /*return*/, exports.ChatStatusModel.findOne({ chatId: chatId })];
        }
    });
}); };
// App.update({},{appsflyerUnitsLeft:12000}).exec()
