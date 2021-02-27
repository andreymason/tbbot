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
exports.showAppIsPublishedMessage = exports.showAppsflyerIsBroken = exports.showAppIsBannedMessage = void 0;
var API_KEY = "1645312068:AAG_DnYL15Aj5n0qupdzSXnwyhcqNK1sc2g";
var PORT = 4012;
var MONGO = "mongodb://127.0.0.1:27017/tb";
//const MONGO = "mongodb://admin:fweifjwoi234sa@127.0.0.1:27017/tb"
var TelegramBot = require("node-telegram-bot-api");
var http_1 = require("http");
var mongoose_1 = require("mongoose");
var app_checker_1 = require("./app_checker");
var automatizer_1 = require("./automatizer");
var install_log_1 = require("./install_log");
var models_1 = require("./models");
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
var express = require("express");
var admins = [
    "andreymason",
    "levenatko",
    "TBraza",
    "soboleva_vera",
    "lilipuhtb",
    "Calkovets",
    "vivchik1337",
    "leraTB"
];
mongoose_1.connect(MONGO, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, function (error) {
    if (error) {
        console.error(error);
        return;
    }
    console.log("Connected to MongoDB");
});
var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api/install_logs', install_log_1.Router);
app.use(logger('dev'));
app.set('trust proxy', true);
app.set('port', PORT);
var server = http_1.createServer(app);
server.listen(PORT);
function onListening() {
    var addr = server.address();
    console.log("Server listening on " + addr.port);
}
server.on('listening', onListening);
var bot = new TelegramBot(API_KEY, { polling: true });
//bot.setWebHook('tbraza.club', {
//    certificate: '/home/admin/conf/web/ssl.tbraza.club.pem'
//});
models_1.addUsers("admin", ["andreymason"]);
bot.on('callback_query', function (callbackQuery) { return __awaiter(void 0, void 0, void 0, function () {
    var data, message, chatId, username, messageId, user, _a, appMatch, match, add, appId, answerMatch, answer, adminMatch, appId, result;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                data = callbackQuery.data, message = callbackQuery.message;
                chatId = message === null || message === void 0 ? void 0 : message.chat.id;
                username = (message === null || message === void 0 ? void 0 : message.chat.username) || "";
                messageId = message === null || message === void 0 ? void 0 : message.message_id;
                return [4 /*yield*/, validateUser(chatId, username)];
            case 1:
                user = _b.sent();
                if (!user || !chatId || !messageId)
                    return [2 /*return*/];
                _a = data;
                switch (_a) {
                    case CANCEL: return [3 /*break*/, 2];
                    case CHOOSE_APP_ADD: return [3 /*break*/, 3];
                    case CHANGE_APP_ADD: return [3 /*break*/, 3];
                    case CHOOSE_APP_REMOVE: return [3 /*break*/, 4];
                    case CHANGE_APP_REMOVE: return [3 /*break*/, 4];
                    case ADD_USER: return [3 /*break*/, 5];
                    case REMOVE_USERS: return [3 /*break*/, 6];
                    case ADMIN_ADD_APP: return [3 /*break*/, 7];
                    case ADMIN_REMOVE_APP: return [3 /*break*/, 8];
                    case ADMIN_SHOW_RATING: return [3 /*break*/, 9];
                    case SHOW_APPSFLYER_UNITS_LEFT: return [3 /*break*/, 11];
                    case SHOW_USERS: return [3 /*break*/, 12];
                }
                return [3 /*break*/, 13];
            case 2:
                showActionPicker(chatId, username, messageId);
                return [2 /*return*/];
            case 3:
                showAppsPicker(chatId, true, messageId);
                return [2 /*return*/];
            case 4:
                showAppsPicker(chatId, false, messageId);
                return [2 /*return*/];
            case 5:
                showEnterUserIds(chatId, messageId, username);
                return [2 /*return*/];
            case 6:
                showEnterRemoveUsersIds(chatId, messageId, username);
                return [2 /*return*/];
            case 7:
                showAdminAddOrUpdateApp(chatId, messageId);
                return [2 /*return*/];
            case 8:
                showAdminRemoveApp(chatId, messageId);
                return [2 /*return*/];
            case 9: return [4 /*yield*/, showRatings(chatId, messageId, username)];
            case 10:
                _b.sent();
                return [2 /*return*/];
            case 11:
                showAppsflyerUnits(chatId, messageId, username);
                return [2 /*return*/];
            case 12:
                showUsers(chatId, username, messageId);
                return [2 /*return*/];
            case 13:
                appMatch = data === null || data === void 0 ? void 0 : data.match(/app:(.*)/);
                if (appMatch) {
                    match = appMatch[1].split(":");
                    add = match[0] === "add";
                    appId = match[1];
                    showEnterAdIds(appId, chatId, messageId, add);
                    return [2 /*return*/];
                }
                answerMatch = data === null || data === void 0 ? void 0 : data.match(/addUser:(.*)/);
                if (answerMatch) {
                    answer = answerMatch[1];
                    if (answer === "yes") {
                        bot.editMessageText("Пользователи добавлены.", { message_id: messageId, chat_id: chatId });
                    }
                    else if (answer === "no") {
                        showActionPicker(chatId, username, messageId);
                    }
                    return [2 /*return*/];
                }
                adminMatch = data === null || data === void 0 ? void 0 : data.match(/admin:remove:(.*)/);
                if (!adminMatch) return [3 /*break*/, 15];
                appId = adminMatch[1];
                return [4 /*yield*/, models_1.removeApp(appId)];
            case 14:
                result = _b.sent();
                if (result) {
                    bot.editMessageText("Приложение удалено.", { message_id: messageId, chat_id: chatId });
                }
                else {
                    bot.editMessageText("Приложение не найдено.", { message_id: messageId, chat_id: chatId });
                }
                showActionPicker(chatId, username);
                return [2 /*return*/];
            case 15: return [2 /*return*/];
        }
    });
}); });
bot.onText(/\/start/, function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var chatId, username, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                chatId = msg.chat.id;
                username = msg.chat.username || "empty";
                return [4 /*yield*/, models_1.createChatStatus(chatId, username)];
            case 1:
                _a.sent();
                return [4 /*yield*/, validateUser(chatId, username || "")];
            case 2:
                user = _a.sent();
                if (!user)
                    return [2 /*return*/];
                showActionPicker(chatId, username);
                return [2 /*return*/];
        }
    });
}); });
bot.onText(RegExp(""), function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var chatId, username, messageId, user, chatStatus, text, result, app_1, ids, add;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                chatId = msg === null || msg === void 0 ? void 0 : msg.chat.id;
                username = msg === null || msg === void 0 ? void 0 : msg.chat.username;
                messageId = msg === null || msg === void 0 ? void 0 : msg.message_id;
                return [4 /*yield*/, validateUser(chatId, username || "")];
            case 1:
                user = _a.sent();
                if (!user || !chatId || !messageId)
                    return [2 /*return*/];
                return [4 /*yield*/, models_1.getChatStatusByChatId(chatId)];
            case 2:
                chatStatus = _a.sent();
                if (chatStatus) {
                    text = msg.text;
                    if (text) {
                        if (chatStatus.status === models_1.WAITING_FOR_APP_ADD) {
                            result = void 0;
                            try {
                                app_1 = JSON.parse(text);
                                result = !(app_1.bundle) ? null : models_1.addApp(app_1);
                            }
                            catch (e) {
                                result = null;
                                console.log(e);
                            }
                            if (result && app_1) {
                                bot.sendMessage(chatId, "\u041F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435 " + app_1.name + " \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u043E/\u0438\u0437\u043C\u0435\u043D\u0435\u043D\u043E.\nFacebook ID: " + app_1.facebookId + "\nBundle: " + app_1.bundle + "\nOnesignal ID: " + app_1.onesignalId + "\nAppsFlyer Login: " + app_1.appsflyerLogin + "\nAppsFlyer Password: " + app_1.appsflyerPassword + "\nAppsFlyer Dev Key: " + app_1.appsflyerDevKey + "\nMetrica App ID: " + app_1.metricaAppId + "\nMetrica POST Api Key: " + app_1.metricaPostApiKey + "\nMetrica SDK Key: " + app_1.metricaSdkKey + "\nPrivacy Policy URL: " + app_1.privacyPolicyUrl + "\nFacebook Enabled: " + app_1.facebook);
                            }
                            else {
                                bot.sendMessage(chatId, "Приложение не добавлено.");
                            }
                            if (chatStatus.uploadMessageId) {
                                bot.deleteMessage(chatId, chatStatus.uploadMessageId.toString());
                            }
                            models_1.updateChatStatus(chatId, models_1.IDLE);
                            showActionPicker(chatId, username);
                            return [2 /*return*/];
                        }
                        ids = text.split("\n");
                        if (chatStatus.status === models_1.WAITING_FOR_IDS_ADD || chatStatus.status === models_1.WAITING_FOR_IDS_REMOVE) {
                            add = chatStatus.status === models_1.WAITING_FOR_IDS_ADD;
                            showIdsUploadMessage(chatId, ids, add, username);
                        }
                        else if (chatStatus.status === models_1.WAITING_FOR_USERNAMES && chatStatus.uploadMessageId) {
                            showUsersUploadMessage(chatId, ids, username);
                        }
                        else if (chatStatus.status === models_1.WAITING_FOR_REMOVE_USERNAMES && chatStatus.uploadMessageId) {
                            showUsersRemoveMessage(chatId, ids, username);
                        }
                    }
                }
                return [2 /*return*/];
        }
    });
}); });
var showRatings = function (chatId, messageId, username) { return __awaiter(void 0, void 0, void 0, function () {
    var options, apps, data, _i, apps_1, app_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                options = {
                    chat_id: chatId,
                    message_id: messageId,
                    parse_mode: "HTML"
                };
                return [4 /*yield*/, models_1.getApps()];
            case 1:
                apps = _a.sent();
                data = "";
                for (_i = 0, apps_1 = apps; _i < apps_1.length; _i++) {
                    app_2 = apps_1[_i];
                    if (app_2.banned)
                        continue;
                    data += "<b>" + app_2.name + "</b>: " + app_2.rating + "\n";
                }
                bot.editMessageText(data, options);
                showActionPicker(chatId, username);
                return [2 /*return*/];
        }
    });
}); };
var showEnterUserIds = function (chatId, messageId, username) {
    var options = {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: "HTML",
        reply_markup: {
            inline_keyboard: [[{
                        text: "Отмена",
                        callback_data: CANCEL
                    }]]
        }
    };
    models_1.updateChatStatus(chatId, models_1.WAITING_FOR_USERNAMES);
    models_1.updateChatUploadMessageId(chatId, messageId);
    bot.editMessageText('<b>Добавление пользователей в бот.</b>\nВведите айди, каждый с новой строки. Пример:\n@nickname1\n@nickname2', options);
};
var showEnterRemoveUsersIds = function (chatId, messageId, username) {
    var options = {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: "HTML",
        reply_markup: {
            inline_keyboard: [[{
                        text: "Отмена",
                        callback_data: CANCEL
                    }]]
        }
    };
    models_1.updateChatStatus(chatId, models_1.WAITING_FOR_REMOVE_USERNAMES);
    models_1.updateChatUploadMessageId(chatId, messageId);
    bot.editMessageText('<b>Удаление пользователей из бота.</b>\nВведите айди, каждый с новой строки. Пример:\n@nickname1\n@nickname2', options);
};
exports.showAppIsBannedMessage = function (app) { return __awaiter(void 0, void 0, void 0, function () {
    var options, statuses, _i, statuses_1, status_1, user, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                options = {
                    parse_mode: "HTML"
                };
                return [4 /*yield*/, models_1.allStatuses()];
            case 1:
                statuses = _a.sent();
                _i = 0, statuses_1 = statuses;
                _a.label = 2;
            case 2:
                if (!(_i < statuses_1.length)) return [3 /*break*/, 8];
                status_1 = statuses_1[_i];
                _a.label = 3;
            case 3:
                _a.trys.push([3, 6, , 7]);
                return [4 /*yield*/, models_1.getUser(status_1.username)];
            case 4:
                user = _a.sent();
                if (!user)
                    return [3 /*break*/, 7];
                return [4 /*yield*/, bot.sendMessage(status_1.chatId, "\u2757\uFE0F\u2757\uFE0F\u2757\uFE0F <b>" + app.name + "</b> \u0437\u0430\u0431\u0430\u043D\u0435\u043D\u0430 \u0432 Google Play \u2757\uFE0F\u2757\uFE0F\u2757\uFE0F\n\u0412\u0441\u0435 \u0420\u041A \u043E\u0442\u0432\u044F\u0437\u0430\u043D\u044B. \n\u041E\u0441\u0442\u0430\u043D\u0430\u0432\u043B\u0438\u0432\u0430\u0439\u0442\u0435 \u0442\u0440\u0430\u0444\u0438\u043A, \u0433\u043E\u0441\u043F\u043E\u0434\u0430.", options)];
            case 5:
                _a.sent();
                return [3 /*break*/, 7];
            case 6:
                e_1 = _a.sent();
                return [3 /*break*/, 7];
            case 7:
                _i++;
                return [3 /*break*/, 2];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.showAppsflyerIsBroken = function (app) { return __awaiter(void 0, void 0, void 0, function () {
    var options, status_2, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                options = {
                    parse_mode: "HTML"
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, models_1.getChatStatusByUsername("bprtsk")];
            case 2:
                status_2 = _a.sent();
                if (!status_2) return [3 /*break*/, 4];
                return [4 /*yield*/, bot.sendMessage(status_2.chatId, "<b>" + app.name + "</b> \u043F\u043E\u043B\u043E\u043C\u0430\u043D\u0430.\n" + app.appsflyerLogin + "\n" + app.appsflyerPassword, options)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                e_2 = _a.sent();
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.showAppIsPublishedMessage = function (app) { return __awaiter(void 0, void 0, void 0, function () {
    var options, status_3, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                options = {
                    parse_mode: "HTML"
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, models_1.getChatStatusByUsername("andreymason")];
            case 2:
                status_3 = _a.sent();
                if (!status_3) return [3 /*break*/, 4];
                return [4 /*yield*/, bot.sendMessage(status_3.chatId, "<b>" + app.name + "</b> \u043E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u043D\u0430 \u0432 Google Play.\nhttps://play.google.com/store/apps/details?id=" + app.bundle, options)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                e_3 = _a.sent();
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
var showActionPicker = function (chatId, username, messageToEditId) {
    if (messageToEditId === void 0) { messageToEditId = null; }
    var buttons = [[
            {
                text: "Расшарить ID",
                callback_data: CHOOSE_APP_ADD
            },
            {
                text: "Удалить ID",
                callback_data: CHOOSE_APP_REMOVE
            }
        ]];
    if (admins.includes(username || "")) {
        buttons.push([
            {
                text: "Добавить/изменить приложение",
                callback_data: ADMIN_ADD_APP
            },
            {
                text: "Удалить приложение",
                callback_data: ADMIN_REMOVE_APP
            }
        ], [{
                text: "Добавить пользователя",
                callback_data: ADD_USER
            },
            {
                text: "Удалить пользователя",
                callback_data: REMOVE_USERS
            },
            {
                text: "Список пользователей",
                callback_data: SHOW_USERS
            }
        ]);
        if (username == "lilipuhtb" || username == "levenatko" || username == "leraTB")
            buttons.push([{ text: "Посмотреть оценки", callback_data: ADMIN_SHOW_RATING }]);
    }
    buttons.push([{
            text: "Ну как там с апсфлаером?",
            callback_data: SHOW_APPSFLYER_UNITS_LEFT
        }]);
    if (messageToEditId) {
        bot.editMessageText('Привет. Выбери действие.', { reply_markup: { inline_keyboard: buttons }, chat_id: chatId, message_id: messageToEditId });
    }
    else {
        bot.sendMessage(chatId, 'Привет. Выбери действие.', { reply_markup: { inline_keyboard: buttons } });
    }
};
var showIdsUploadMessage = function (chatId, ids, add, username) { return __awaiter(void 0, void 0, void 0, function () {
    var app, chatStatus, e_4, message, typeText;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, models_1.updateChatStatus(chatId, models_1.PROCESSING_IDS)];
            case 1:
                chatStatus = _a.sent();
                if (chatStatus && chatStatus.app) {
                    app = chatStatus.app;
                }
                else {
                    throw "App is null";
                }
                return [3 /*break*/, 3];
            case 2:
                e_4 = _a.sent();
                showActionPicker(chatId, username);
                return [2 /*return*/];
            case 3:
                if (!chatStatus) {
                    return [2 /*return*/];
                }
                typeText = add ? 'Выгрузка' : 'Удаление';
                if (!chatStatus.uploadMessageId) return [3 /*break*/, 5];
                return [4 /*yield*/, bot.editMessageText(typeText + " ID \u0434\u043B\u044F \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u044F " + app.name + "...", { chat_id: chatId, message_id: chatStatus.uploadMessageId })];
            case 4:
                message = (_a.sent());
                return [3 /*break*/, 7];
            case 5: return [4 /*yield*/, bot.sendMessage(chatId, typeText + " ID \u0434\u043B\u044F \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u044F " + app.name + "...")];
            case 6:
                message = _a.sent();
                _a.label = 7;
            case 7:
                console.log(chatStatus.username + " is making a request.");
                if (add) {
                    automatizer_1.addRequest({
                        app: app,
                        ids: ids,
                        type: automatizer_1.EntryType.FACEBOOK_ADD,
                        callback: function (result) {
                            if (result) {
                                if (chatStatus) {
                                    console.log(chatStatus.username + " request has succeed.");
                                }
                                var succeed_1 = 0;
                                result.forEach(function (res) { if (res.success)
                                    succeed_1++; });
                                bot.editMessageText(succeed_1 + "/" + result.length + " ID  \u0434\u043B\u044F " + (app === null || app === void 0 ? void 0 : app.name) + " \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u044B.", { chat_id: chatId, message_id: message.message_id });
                            }
                            else {
                                if (chatStatus) {
                                    console.log(chatStatus.username + " request has failed.");
                                }
                                bot.editMessageText("Ошибка при добавлении ID, попробуйте снова", { chat_id: chatId, message_id: message.message_id });
                            }
                            models_1.updateChatStatus(chatId, models_1.IDLE);
                            models_1.updateChatUploadMessageId(chatId, null);
                            models_1.updateChatApp(chatId, null);
                            showActionPicker(chatId, username);
                        }
                    });
                }
                else {
                    automatizer_1.addRequest({
                        app: app,
                        ids: ids,
                        type: automatizer_1.EntryType.FACEBOOK_REMOVE,
                        callback: function (result) {
                            if (result) {
                                if (chatStatus) {
                                    console.log(chatStatus.username + " request has succeed.");
                                }
                                var succeed_2 = 0;
                                result.forEach(function (res) { if (res.success)
                                    succeed_2++; });
                                bot.editMessageText(succeed_2 + "/" + result.length + " ID  \u0434\u043B\u044F " + (app === null || app === void 0 ? void 0 : app.name) + " \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0443\u0434\u0430\u043B\u0435\u043D\u044B.", { chat_id: chatId, message_id: message.message_id });
                            }
                            else {
                                if (chatStatus) {
                                    console.log(chatStatus.username + " request has failed.");
                                }
                                bot.editMessageText("Ошибка при удалении ID, попробуйте снова", { chat_id: chatId, message_id: message.message_id });
                            }
                            models_1.updateChatStatus(chatId, models_1.IDLE);
                            models_1.updateChatUploadMessageId(chatId, null);
                            models_1.updateChatApp(chatId, null);
                            showActionPicker(chatId, username);
                        }
                    });
                }
                return [2 /*return*/];
        }
    });
}); };
var showUsersRemoveMessage = function (chatId, ids, username) { return __awaiter(void 0, void 0, void 0, function () {
    var chatStatus, e_5, usernames;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, models_1.updateChatStatus(chatId, models_1.PROCESSING_IDS)];
            case 1:
                chatStatus = _a.sent();
                return [3 /*break*/, 3];
            case 2:
                e_5 = _a.sent();
                showActionPicker(chatId, username);
                return [2 /*return*/];
            case 3:
                if (!chatStatus) {
                    return [2 /*return*/];
                }
                if (!(chatStatus.username && chatStatus.uploadMessageId)) return [3 /*break*/, 5];
                usernames = ids.map(function (entry) { return entry.split("@")[1]; });
                return [4 /*yield*/, models_1.removeUsers(usernames)];
            case 4:
                _a.sent();
                bot.editMessageText("\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C(\u0438) \u0443\u0434\u0430\u043B\u0435\u043D\u044B.", { chat_id: chatId, message_id: chatStatus.uploadMessageId });
                _a.label = 5;
            case 5:
                models_1.updateChatStatus(chatId, models_1.IDLE);
                models_1.updateChatUploadMessageId(chatId, null);
                showActionPicker(chatId, username);
                return [2 /*return*/];
        }
    });
}); };
var showUsersUploadMessage = function (chatId, ids, username) { return __awaiter(void 0, void 0, void 0, function () {
    var chatStatus, e_6, usernames;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, models_1.updateChatStatus(chatId, models_1.PROCESSING_IDS)];
            case 1:
                chatStatus = _a.sent();
                return [3 /*break*/, 3];
            case 2:
                e_6 = _a.sent();
                showActionPicker(chatId, username);
                return [2 /*return*/];
            case 3:
                if (!chatStatus) {
                    return [2 /*return*/];
                }
                if (!(chatStatus.username && chatStatus.uploadMessageId)) return [3 /*break*/, 5];
                usernames = ids.map(function (entry) { return entry.split("@")[1]; });
                return [4 /*yield*/, models_1.addUsers(chatStatus.username, usernames)];
            case 4:
                _a.sent();
                bot.editMessageText("\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C(\u0438) \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u044B.", { chat_id: chatId, message_id: chatStatus.uploadMessageId });
                _a.label = 5;
            case 5:
                models_1.updateChatStatus(chatId, models_1.IDLE);
                models_1.updateChatUploadMessageId(chatId, null);
                showActionPicker(chatId, username);
                return [2 /*return*/];
        }
    });
}); };
var showEnterAdIds = function (appId, chatId, messageId, add) { return __awaiter(void 0, void 0, void 0, function () {
    var options, app, caption;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                options = {
                    chat_id: chatId,
                    message_id: messageId,
                    parse_mode: "HTML",
                    reply_markup: {
                        inline_keyboard: [[{
                                    text: "Сменить приложение",
                                    callback_data: add ? CHANGE_APP_ADD : CHANGE_APP_REMOVE
                                }]]
                    }
                };
                return [4 /*yield*/, models_1.getApp(appId)];
            case 1:
                app = _a.sent();
                if (app) {
                    models_1.updateChatStatus(chatId, add ? models_1.WAITING_FOR_IDS_ADD : models_1.WAITING_FOR_IDS_REMOVE);
                    models_1.updateChatApp(chatId, app);
                    models_1.updateChatUploadMessageId(chatId, messageId);
                    caption = add ? "Добавление" : "Удаление";
                    bot.editMessageText("<b>" + caption + " ID \u0434\u043B\u044F " + (app === null || app === void 0 ? void 0 : app.name) + ".</b>\n\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0430\u0439\u0434\u0438, \u043A\u0430\u0436\u0434\u044B\u0439 \u0441 \u043D\u043E\u0432\u043E\u0439 \u0441\u0442\u0440\u043E\u043A\u0438.  \u041F\u0440\u0438\u043C\u0435\u0440:\n987654321\n123456789", options);
                }
                return [2 /*return*/];
        }
    });
}); };
var showAppsPicker = function (chatId, add, messageToEditId) {
    if (messageToEditId === void 0) { messageToEditId = null; }
    return __awaiter(void 0, void 0, void 0, function () {
        var inlineButtons, row, _i, _a, app_3, caption, e_7;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    inlineButtons = [];
                    row = [];
                    _i = 0;
                    return [4 /*yield*/, models_1.getApps()];
                case 1:
                    _a = _b.sent();
                    _b.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    app_3 = _a[_i];
                    // if (app.bundle === "jok.games.infinity") console.log(app)
                    if (app_3.banned || !app_3.published || app_3.removed || !app_3.facebook)
                        return [3 /*break*/, 3];
                    row.push({
                        text: app_3.name,
                        callback_data: "app:" + (add ? "add" : "remove") + ":" + app_3.facebookId
                    });
                    if (row.length == 2) {
                        inlineButtons.push(row);
                        row = [];
                    }
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 2];
                case 4:
                    if (row.length != 0) {
                        inlineButtons.push(row);
                    }
                    inlineButtons.push([{
                            text: "Отмена",
                            callback_data: CANCEL
                        }]);
                    caption = add ? "расшарки" : "удаления ID";
                    _b.label = 5;
                case 5:
                    _b.trys.push([5, 10, , 11]);
                    if (!messageToEditId) return [3 /*break*/, 7];
                    return [4 /*yield*/, bot.editMessageText("\u0412\u044B\u0431\u0435\u0440\u0438 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u0434\u043B\u044F " + caption + ": ", { reply_markup: { inline_keyboard: inlineButtons }, chat_id: chatId, message_id: messageToEditId })];
                case 6:
                    _b.sent();
                    return [3 /*break*/, 9];
                case 7: return [4 /*yield*/, bot.sendMessage(chatId, "\u0412\u044B\u0431\u0435\u0440\u0438 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u0434\u043B\u044F " + caption + ": ", { reply_markup: { inline_keyboard: inlineButtons } })];
                case 8:
                    _b.sent();
                    _b.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    e_7 = _b.sent();
                    console.log(e_7);
                    console.log(row);
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/];
            }
        });
    });
};
var showUsers = function (chatId, username, messageToEditId) {
    if (messageToEditId === void 0) { messageToEditId = null; }
    return __awaiter(void 0, void 0, void 0, function () {
        var caption, e_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, models_1.getUsersData()];
                case 1:
                    caption = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 7, , 8]);
                    if (!messageToEditId) return [3 /*break*/, 4];
                    return [4 /*yield*/, bot.editMessageText(caption, { chat_id: chatId, message_id: messageToEditId })];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, bot.sendMessage(chatId, caption)];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    e_8 = _a.sent();
                    return [3 /*break*/, 8];
                case 8:
                    showActionPicker(chatId, username);
                    return [2 /*return*/];
            }
        });
    });
};
var showAppsflyerUnits = function (chatId, messageToEditId, username) {
    if (messageToEditId === void 0) { messageToEditId = null; }
    return __awaiter(void 0, void 0, void 0, function () {
        var apps, actualApps, overLimitApps, _i, apps_2, app_4, text, _a, actualApps_1, app_5, i;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, models_1.App.find()];
                case 1:
                    apps = _b.sent();
                    actualApps = [];
                    overLimitApps = [];
                    for (_i = 0, apps_2 = apps; _i < apps_2.length; _i++) {
                        app_4 = apps_2[_i];
                        if (!app_4.published || app_4.banned)
                            continue;
                        if (app_4.appsflyerUnitsLeft > 0) {
                            actualApps.push(app_4);
                        }
                        else {
                            overLimitApps.push(app_4);
                        }
                    }
                    text = "❗️ Осталось инсталлов:\n\n";
                    for (_a = 0, actualApps_1 = actualApps; _a < actualApps_1.length; _a++) {
                        app_5 = actualApps_1[_a];
                        text += "<b>" + app_5.name + "</b>: " + app_5.appsflyerUnitsLeft + "\n";
                    }
                    if (overLimitApps.length > 0) {
                        text += "\nЗакончились инсталлы: ";
                        for (i = 0; i < overLimitApps.length; i++) {
                            text += "" + overLimitApps[i].name;
                            if (i != overLimitApps.length - 1)
                                text += ", ";
                        }
                    }
                    if (messageToEditId) {
                        bot.editMessageText(text, { chat_id: chatId, message_id: messageToEditId, parse_mode: "HTML" });
                    }
                    else {
                        bot.sendMessage(chatId, text, { parse_mode: "HTML" });
                    }
                    showActionPicker(chatId, username);
                    return [2 /*return*/];
            }
        });
    });
};
var showAdminRemoveApp = function (chatId, messageToEditId) {
    if (messageToEditId === void 0) { messageToEditId = null; }
    return __awaiter(void 0, void 0, void 0, function () {
        var inlineButtons, row, _i, _a, app_6;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    inlineButtons = [];
                    row = [];
                    _i = 0;
                    return [4 /*yield*/, models_1.getApps()];
                case 1:
                    _a = _b.sent();
                    _b.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    app_6 = _a[_i];
                    if (app_6.removed)
                        return [3 /*break*/, 3];
                    row.push({
                        text: app_6.name,
                        callback_data: "admin:remove:" + app_6.facebookId
                    });
                    if (row.length == 2) {
                        inlineButtons.push(row);
                        row = [];
                    }
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 2];
                case 4:
                    inlineButtons.push([{
                            text: "Отмена",
                            callback_data: CANCEL
                        }]);
                    if (messageToEditId) {
                        bot.editMessageText("\u0412\u044B\u0431\u0435\u0440\u0438 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u0434\u043B\u044F \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u044F: ", { reply_markup: { inline_keyboard: inlineButtons }, chat_id: chatId, message_id: messageToEditId });
                    }
                    else {
                        bot.sendMessage(chatId, "\u0412\u044B\u0431\u0435\u0440\u0438 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u0434\u043B\u044F \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u044F: ", { reply_markup: { inline_keyboard: inlineButtons } });
                    }
                    return [2 /*return*/];
            }
        });
    });
};
var showAdminAddOrUpdateApp = function (chatId, messageToEditId) {
    if (messageToEditId === void 0) { messageToEditId = null; }
    return __awaiter(void 0, void 0, void 0, function () {
        var inlineButtons;
        return __generator(this, function (_a) {
            inlineButtons = [];
            inlineButtons.push([{
                    text: "Отмена",
                    callback_data: CANCEL
                }]);
            models_1.updateChatStatus(chatId, models_1.WAITING_FOR_APP_ADD);
            models_1.updateChatUploadMessageId(chatId, messageToEditId);
            if (messageToEditId) {
                bot.editMessageText("\u0412\u0432\u0435\u0434\u0438 \u0438\u043D\u0444\u0443 \u0434\u043B\u044F \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u044F: ", { reply_markup: { inline_keyboard: inlineButtons }, chat_id: chatId, message_id: messageToEditId });
            }
            else {
                bot.sendMessage(chatId, "\u0412\u0432\u0435\u0434\u0438 \u0438\u043D\u0444\u0443 \u0434\u043B\u044F \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u044F: ", { reply_markup: { inline_keyboard: inlineButtons } });
            }
            return [2 /*return*/];
        });
    });
};
var validateUser = function (chatId, username) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, models_1.getUser(username)];
            case 1:
                user = _a.sent();
                if (user)
                    return [2 /*return*/, user];
                bot.sendMessage(chatId, 'Нет доступа');
                return [2 /*return*/, null];
        }
    });
}); };
var CHOOSE_APP_ADD = "choose_app_add";
var CHOOSE_APP_REMOVE = "choose_app_remove";
var ADD_USER = "add_user";
var REMOVE_USERS = "remove_users";
var CANCEL = "cancel";
var CHANGE_APP_ADD = "change_app_add";
var CHANGE_APP_REMOVE = "change_app_remove";
var SHOW_USERS = "show_users";
var ADMIN_ADD_APP = "admin_add_app";
var ADMIN_REMOVE_APP = "admin_remove_app";
var ADMIN_SHOW_RATING = "admin_show_rating";
var SHOW_APPSFLYER_UNITS_LEFT = "show_appsflyer_units_left";
automatizer_1.initFacebook().then(function () { return console.log("Selenium initialized successfully."); }, function (e) { return console.log(e); });
// testApps().then(() => console.log(), (e) => console.error(e))
app_checker_1.startCheckerThread();
