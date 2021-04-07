const API_KEY = "1645312068:AAHp1QfOb61mqvvVQA0olqpMUyKx2G1aLw8"
const PORT = 4012
const MONGO = "mongodb://127.0.0.1:27017/tb"
//const MONGO = "mongodb://admin:fweifjwoi234sa@127.0.0.1:27017/tb"

import TelegramBot = require('node-telegram-bot-api')
import { createServer } from 'http';
import { connect } from 'mongoose';
import { AddressInfo } from 'net';
import { startCheckerThread } from './app_checker';
import { addRequest, EntryType, FacebookQueueEntry, FacebookResult, initFacebook } from './automatizer';
import { Router as InstallLogRouter } from './install_log';
import { addApp, addUsers, allUsers, allStatuses, App, createChatStatus, getApp, getApps, getChatStatusByChatId, getChatStatusByUsername, getUser, getUsersData, IApp, IChatStatus, IDLE, IUser, PROCESSING_IDS, removeApp, removeUsers, updateChatApp, updateChatStatus, updateChatUploadMessageId, WAITING_FOR_APP_ADD, WAITING_FOR_IDS_ADD, WAITING_FOR_IDS_REMOVE, WAITING_FOR_REMOVE_USERNAMES, WAITING_FOR_USERNAMES } from './models';
import e = require('express');

const logger = require('morgan');
const bodyParser = require('body-parser')
const cors = require('cors')
const express = require("express")

let admins = [
    "andreymason",
    "levenatko",
    "Halynahh",
    "TBraza",
    "soboleva_vera",
    "lilipuhtb",
    "Calkovets",
    "vivchik1337", 
    "leraTB"
]

connect(MONGO, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, function (error) {
    if (error) {
        console.error(error)
        return
    }
    console.log(`Connected to MongoDB`);
});

let app = express()
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/install_logs', InstallLogRouter)
app.use(logger('dev'));

app.set('trust proxy', true)
app.set('port', PORT);

let server = createServer(app)

server.listen(PORT)

function onListening() {
    var addr = server.address();
    console.log(`Server listening on ${(addr as AddressInfo).port}`);
}

server.on('listening', onListening);

const bot = new TelegramBot(API_KEY, { polling: true })
//bot.setWebHook('tbraza.club', {
//    certificate: '/home/admin/conf/web/ssl.tbraza.club.pem'
//});

addUsers("admin", ["andreymason"])

bot.on('callback_query', async (callbackQuery) => {
    const { data, message } = callbackQuery

    let chatId = message?.chat.id
    let username = message?.chat.username || ""
    let messageId = message?.message_id

    let user = await validateUser(chatId!, username)

    if (!user || !chatId || !messageId) return

    switch (data) {
        case CANCEL:
            showActionPicker(chatId, username, messageId)
            return
        case CHOOSE_APP_ADD:
        case CHANGE_APP_ADD:
            showAppsPicker(chatId, true, messageId)
            return
        case CHOOSE_APP_REMOVE:
        case CHANGE_APP_REMOVE:
            showAppsPicker(chatId, false, messageId)
            return
        case ADD_USER:
            showEnterUserIds(chatId, messageId, username)
            return
        case REMOVE_USERS:
            showEnterRemoveUsersIds(chatId, messageId, username)
            return
        case ADMIN_ADD_APP:
            showAdminAddOrUpdateApp(chatId, messageId)
            return
        case ADMIN_REMOVE_APP:
            showAdminRemoveApp(chatId, messageId)
            return
        case ADMIN_SHOW_RATING:
            await showRatings(chatId, messageId, username)
            return
        case SHOW_APPSFLYER_UNITS_LEFT:
            showAppsflyerUnits(chatId, messageId, username)
            return
        case SHOW_USERS:
            showUsers(chatId, username, messageId)
            return
    }

    let appMatch = data?.match(/app:(.*)/)
    if (appMatch) {
        let match = appMatch[1].split(":")
        let add = match[0] === "add"
        let appId = match[1]
        showEnterAdIds(appId, chatId, messageId, add)

        return
    }

    let answerMatch = data?.match(/addUser:(.*)/)
    if (answerMatch) {
        let answer = answerMatch[1]

        if (answer === "yes") {
            bot.editMessageText("Пользователи добавлены.", { message_id: messageId, chat_id: chatId })
        } else if (answer === "no") {
            showActionPicker(chatId, username, messageId)
        }

        return
    }

    let adminMatch = data?.match(/admin:remove:(.*)/)
    if (adminMatch) {
        let appId = adminMatch[1]

        let result = await removeApp(appId)
        if (result) {
            bot.editMessageText("Приложение удалено.", { message_id: messageId, chat_id: chatId })
        } else {
            bot.editMessageText("Приложение не найдено.", { message_id: messageId, chat_id: chatId })
        }

        showActionPicker(chatId, username)
        return
    }
})

bot.onText(/\/start/, async (msg) => {
    let chatId = msg.chat.id
    let username = msg.chat.username || "empty"

    await createChatStatus(chatId, username)

    let user = await validateUser(chatId, username || "")
    if (!user) return

    showActionPicker(chatId, username)
});

bot.onText(RegExp(""), async (msg) => {
    let chatId = msg?.chat.id
    let username = msg?.chat.username
    let messageId = msg?.message_id

    let user = await validateUser(chatId!, username || "")
    if (!user || !chatId || !messageId) return

    let chatStatus = await getChatStatusByChatId(chatId)

    if (chatStatus) {
        let text = msg.text
        if (text) {

            if (chatStatus.status === WAITING_FOR_APP_ADD) {
                let result, app
                try {
                    app = JSON.parse(text) as IApp

                    result = !(app.bundle) ? null : await addApp(app)
                } catch (e) {
                    result = null
                    console.log(e)
                }
				
				let found = await App.findOne({bundle: app.bundle})
				
				console.log({
					initial: app,
					result: result,
					found: found
				})

                if (result && app) {
                    bot.sendMessage(chatId, `Приложение ${app.name} добавлено/изменено.\nFacebook ID: ${app.facebookId}\nBundle: ${app.bundle}\nOnesignal ID: ${app.onesignalId}\nAppsFlyer Login: ${app.appsflyerLogin}\nAppsFlyer Password: ${app.appsflyerPassword}\nAppsFlyer Dev Key: ${app.appsflyerDevKey}\nMetrica App ID: ${app.metricaAppId}\nMetrica POST Api Key: ${app.metricaPostApiKey}\nMetrica SDK Key: ${app.metricaSdkKey}\nPrivacy Policy URL: ${app.privacyPolicyUrl}\nFacebook Enabled: ${app.facebook}`)
                } else {
                    bot.sendMessage(chatId, "Приложение не добавлено.")
                }

                if (chatStatus.uploadMessageId) {
                    bot.deleteMessage(chatId, chatStatus.uploadMessageId.toString())
                }

                updateChatStatus(chatId, IDLE)

                showActionPicker(chatId, username)

                return
            }

            let ids = text.split("\n")

            if (chatStatus.status === WAITING_FOR_IDS_ADD || chatStatus.status === WAITING_FOR_IDS_REMOVE) {
                let add = chatStatus.status === WAITING_FOR_IDS_ADD
                showIdsUploadMessage(chatId, ids, add, username)
            } else if (chatStatus.status === WAITING_FOR_USERNAMES && chatStatus.uploadMessageId) {
                showUsersUploadMessage(chatId, ids, username)
            } else if (chatStatus.status === WAITING_FOR_REMOVE_USERNAMES && chatStatus.uploadMessageId) {
                showUsersRemoveMessage(chatId, ids, username)
            }
        }
    }
})

let showRatings = async (chatId: number, messageId: number, username: string) => {
    const options: TelegramBot.EditMessageTextOptions = {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: "HTML"
    }

    let apps = await getApps()
    let data = ""
    for (let app of apps) {
        if (app.banned) continue
        data += `<b>${app.name}</b>: ${app.rating}\n`
    }

    bot.editMessageText(data, options)

    showActionPicker(chatId, username)
}

let showEnterUserIds = (chatId: number, messageId: number, username: string | null) => {
    const options: TelegramBot.EditMessageTextOptions = {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: "HTML",
        reply_markup: {
            inline_keyboard: [[{
                text: "Отмена",
                callback_data: CANCEL
            }]]
        }
    }

    updateChatStatus(chatId, WAITING_FOR_USERNAMES)
    updateChatUploadMessageId(chatId, messageId)

    bot.editMessageText('<b>Добавление пользователей в бот.</b>\nВведите айди, каждый с новой строки. Пример:\n@nickname1\n@nickname2', options)
}

let showEnterRemoveUsersIds = (chatId: number, messageId: number, username: string | null) => {
    const options: TelegramBot.EditMessageTextOptions = {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: "HTML",
        reply_markup: {
            inline_keyboard: [[{
                text: "Отмена",
                callback_data: CANCEL
            }]]
        }
    }

    updateChatStatus(chatId, WAITING_FOR_REMOVE_USERNAMES)
    updateChatUploadMessageId(chatId, messageId)

    bot.editMessageText('<b>Удаление пользователей из бота.</b>\nВведите айди, каждый с новой строки. Пример:\n@nickname1\n@nickname2', options)
}

export let showAppIsBannedMessage = async (app: IApp) => {
    const options: TelegramBot.SendMessageOptions = {
        parse_mode: "HTML"
    }

    let users = await allUsers()

    for (let user of users) {
			let status = await getChatStatusByUsername(user.username)
			if (status) {
				await bot.sendMessage(status.chatId, `❗️❗️❗️ <b>${app.name}</b> забанена в Google Play ❗️❗️❗️\nВсе РК отвязаны. \nОстанавливайте трафик, господа.`, options)
			}
    }
}

export let showAppsIsZero = async (app: IApp) => {
    const options: TelegramBot.SendMessageOptions = {
        parse_mode: "HTML"
    }

    let users = await allUsers()
    for (let user of users) {
        let status = await getChatStatusByUsername(user.username)
        if (status) {
            await bot.sendMessage(status.chatId, `❗️❗️❗️ У прилы <b>${app.name}</b> закончились инсталлы ❗️❗️❗️`, options)
        }
    }
}

export let showAppsIsLimited = async (app: IApp) => {
    const options: TelegramBot.SendMessageOptions = {
        parse_mode: "HTML"
    }

    let users = await allUsers()
    for (let user of users) {
        
        let status = await getChatStatusByUsername(user.username)
        if (status) { 
            await bot.sendMessage(status.chatId, `❗️❗️❗️ У прилы <b>${app.name}</b> осталось ${app.appsflyerUnitsLeft} инсталлов ❗️❗️❗️`, options)
        }
        
    }
}

export let showAppsflyerIsBroken = async (app: IApp) => {
    const options: TelegramBot.SendMessageOptions = {
        parse_mode: "HTML"
    }

    try {
        let status = await getChatStatusByUsername("andreymason")

        if (status) {
            await bot.sendMessage(status.chatId, `<b>${app.name}</b> поломана.\n${app.appsflyerLogin}\n${app.appsflyerPassword}`, options)
        }
    } catch (e) {

    }
}

export let showAppIsPublishedMessage = async (app: IApp) => {
    const options: TelegramBot.SendMessageOptions = {
        parse_mode: "HTML"
    }

    try {
		let users = ["andreymason", "levenatko", "Halynahh"]
		
		for (let user of users) {
			let status = await getChatStatusByUsername(user)

			if (status) {
				await bot.sendMessage(status.chatId, `<b>${app.name}</b> опубликована в Google Play.\nhttps://play.google.com/store/apps/details?id=${app.bundle}`, options)
			}
		}
        
    } catch (e) {

    }
}

export let showAppsIsDenied = async (app: IApp) => {
    const options: TelegramBot.SendMessageOptions = {
        parse_mode: "HTML"
    }

    try {
		let users = ["andreymason"]
		
		for (let user of users) {
			let status = await getChatStatusByUsername(user)

			if (status) {
				await bot.sendMessage(status.chatId, `По приле <b>${app.name}</b> невозможно увидеть кол-во оставшихся инсталлов\nПожалуйста, обновите доступы :)`, options)
			}
		}
        
    } catch (e) {

    }
}

let showActionPicker = (chatId: number, username: string | undefined, messageToEditId: number | null = null) => {
    let buttons = [[
        {
            text: "Расшарить ID",
            callback_data: CHOOSE_APP_ADD
        },
        {
            text: "Удалить ID",
            callback_data: CHOOSE_APP_REMOVE
        }
    ]]

    if (admins.includes(username || "")) {
        buttons.push([
            {
                text: "Добавить/изменить приложение",
                callback_data: ADMIN_ADD_APP
            },
            {
                text: "Удалить приложение",
                callback_data: ADMIN_REMOVE_APP
            }],
            [{
                text: "Добавить пользователя",
                callback_data: ADD_USER
            },
            {
                text: "Удалить пользователя",
                callback_data: REMOVE_USERS,
            },
            {
                text: "Список пользователей",
                callback_data: SHOW_USERS,
            }
            ])
        if (username == "lilipuhtb" || username == "levenatko" || username == "leraTB" || username == "Halynahh") buttons.push([{ text: "Посмотреть оценки", callback_data: ADMIN_SHOW_RATING }])
    }

    buttons.push([{
        text: "Ну как там с апсфлаером?",
        callback_data: SHOW_APPSFLYER_UNITS_LEFT
    }])

    if (messageToEditId) {
        bot.editMessageText('Привет. Выбери действие.', { reply_markup: { inline_keyboard: buttons }, chat_id: chatId, message_id: messageToEditId })
    } else {
        bot.sendMessage(chatId, 'Привет. Выбери действие.', { reply_markup: { inline_keyboard: buttons } })
    }
}

let showIdsUploadMessage = async (chatId: number, ids: string[], add: boolean, username: string | undefined) => {
    let app: IApp
    let chatStatus: IChatStatus | null

    try {
        chatStatus = await updateChatStatus(chatId, PROCESSING_IDS)
        if (chatStatus && chatStatus.app) {
            app = chatStatus.app
        } else {
            throw "App is null"
        }
    } catch (e) {
        showActionPicker(chatId, username)
        return
    }

    if (!chatStatus) {
        return
    }

    let message: TelegramBot.Message

    let typeText = add ? 'Выгрузка' : 'Удаление'
    if (chatStatus.uploadMessageId) {
        message = await bot.editMessageText(`${typeText} ID для приложения ${app.name}...`, { chat_id: chatId, message_id: chatStatus.uploadMessageId }) as TelegramBot.Message
    } else {
        message = await bot.sendMessage(chatId, `${typeText} ID для приложения ${app.name}...`)
    }

    console.log(`${chatStatus.username} is making a request.`)

    if (add) {
        addRequest({
            app: app,
            ids: ids,
            type: EntryType.FACEBOOK_ADD,
            callback: (result: FacebookResult[] | null) => {
                if (result) {
                    if (chatStatus) {
                        console.log(`${chatStatus.username} request has succeed.`)
                    }
                    let succeed = 0
                    result.forEach(res => { if (res.success) succeed++ })
                    bot.editMessageText(`${succeed}/${result.length} ID  для ${app?.name} успешно добавлены.`, { chat_id: chatId, message_id: message.message_id })
                } else {
                    if (chatStatus) {
                        console.log(`${chatStatus.username} request has failed.`)
                    }
                    bot.editMessageText("Ошибка при добавлении ID, попробуйте снова", { chat_id: chatId, message_id: message.message_id })
                }

                updateChatStatus(chatId, IDLE)
                updateChatUploadMessageId(chatId, null)
                updateChatApp(chatId, null)

                showActionPicker(chatId, username)
            }
        } as FacebookQueueEntry)
    } else {
        addRequest({
            app: app,
            ids: ids,
            type: EntryType.FACEBOOK_REMOVE,
            callback: (result: FacebookResult[] | null) => {
                if (result) {
                    if (chatStatus) {
                        console.log(`${chatStatus.username} request has succeed.`)
                    }
                    let succeed = 0
                    result.forEach(res => { if (res.success) succeed++ })
                    bot.editMessageText(`${succeed}/${result.length} ID  для ${app?.name} успешно удалены.`, { chat_id: chatId, message_id: message.message_id })
                } else {
                    if (chatStatus) {
                        console.log(`${chatStatus.username} request has failed.`)
                    }
                    bot.editMessageText("Ошибка при удалении ID, попробуйте снова", { chat_id: chatId, message_id: message.message_id })
                }

                updateChatStatus(chatId, IDLE)
                updateChatUploadMessageId(chatId, null)
                updateChatApp(chatId, null)

                showActionPicker(chatId, username)
            }
        } as FacebookQueueEntry)
    }
}

let showUsersRemoveMessage = async (chatId: number, ids: string[], username: string | undefined) => {
    let chatStatus: IChatStatus | null
    try {
        chatStatus = await updateChatStatus(chatId, PROCESSING_IDS)
    } catch (e) {
        showActionPicker(chatId, username)
        return
    }

    if (!chatStatus) {
        return
    }

    if (chatStatus.username && chatStatus.uploadMessageId) {
        let usernames = ids.map((entry) => entry.split("@")[1])
        await removeUsers(usernames)

        bot.editMessageText(`Пользователь(и) удалены.`, { chat_id: chatId, message_id: chatStatus.uploadMessageId })
    }

    updateChatStatus(chatId, IDLE)
    updateChatUploadMessageId(chatId, null)

    showActionPicker(chatId, username)
}

let showUsersUploadMessage = async (chatId: number, ids: string[], username: string | undefined) => {
    let chatStatus: IChatStatus | null
    try {
        chatStatus = await updateChatStatus(chatId, PROCESSING_IDS)
    } catch (e) {
        showActionPicker(chatId, username)
        return
    }

    if (!chatStatus) {
        return
    }

    if (chatStatus.username && chatStatus.uploadMessageId) {
        let usernames = ids.map((entry) => entry.split("@")[1])
        await addUsers(chatStatus.username, usernames)

        bot.editMessageText(`Пользователь(и) успешно добавлены.`, { chat_id: chatId, message_id: chatStatus.uploadMessageId })
    }

    updateChatStatus(chatId, IDLE)
    updateChatUploadMessageId(chatId, null)

    showActionPicker(chatId, username)
}

let showEnterAdIds = async (appId: string, chatId: number, messageId: number, add: boolean) => {
    const options: TelegramBot.EditMessageTextOptions = {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: "HTML",
        reply_markup: {
            inline_keyboard: [[{
                text: "Сменить приложение",
                callback_data: add ? CHANGE_APP_ADD : CHANGE_APP_REMOVE
            }]]
        }
    }

    let app = await getApp(appId)
    if (app) {
        updateChatStatus(chatId, add ? WAITING_FOR_IDS_ADD : WAITING_FOR_IDS_REMOVE)
        updateChatApp(chatId, app)
        updateChatUploadMessageId(chatId, messageId)

        let caption = add ? "Добавление" : "Удаление"

        bot.editMessageText(`<b>${caption} ID для ${app?.name}.</b>\nВведите айди, каждый с новой строки.  Пример:\n987654321\n123456789`, options)
    }
}

let showAppsPicker = async (chatId: number, add: boolean, messageToEditId: number | null = null) => {
    let inlineButtons: any[] = []
    let row = []
    for (let app of await getApps()) {
        // if (app.bundle === "jok.games.infinity") console.log(app)
        if (app.banned || !app.published || app.removed || !app.facebook) continue

        row.push({
            text: app.name,
            callback_data: `app:${add ? "add" : "remove"}:${app.facebookId}`
        })

        if (row.length == 2) {
            inlineButtons.push(row)
            row = []
        }
    }

    if (row.length != 0) {
        inlineButtons.push(row)
    }

    inlineButtons.push([{
        text: "Отмена",
        callback_data: CANCEL
    }])

    let caption = add ? "расшарки" : "удаления ID"

    try {
        if (messageToEditId) {
            await bot.editMessageText(`Выбери приложение для ${caption}: `, { reply_markup: { inline_keyboard: inlineButtons }, chat_id: chatId, message_id: messageToEditId })
        } else {
            await bot.sendMessage(chatId, `Выбери приложение для ${caption}: `, { reply_markup: { inline_keyboard: inlineButtons } })
        }
    } catch (e) {
        console.log(e)
        console.log(row)
    }
}

let showUsers = async (chatId: number, username: string, messageToEditId: number | null = null) => {
    let caption = await getUsersData()

    try {
        if (messageToEditId) {
            await bot.editMessageText(caption, {chat_id: chatId, message_id: messageToEditId})
        } else {
            await bot.sendMessage(chatId, caption)
        }
    } catch (e) {

    }

    showActionPicker(chatId, username)
}

let showAppsflyerUnits = async (chatId: number, messageToEditId: number | null = null, username: string) => {
    let apps = await App.find()

    let actualApps: IApp[] = []
    let overLimitApps: IApp[] = []
    for (let app of apps) {
        if (!app.published || app.banned) continue
        if (app.appsflyerUnitsLeft > 0) {
            actualApps.push(app)
        } else {
            overLimitApps.push(app)
        }
    }
    let text = "❗️ Осталось инсталлов:\n\n"

    for (let app of actualApps) {
        if(!app.banned) {
            text += `<b>${app.name}</b>: ${app.appsflyerUnitsLeft}\n`
        }
    }

    if (overLimitApps.length > 0) {
        text += "\nЗакончились инсталлы: "
        for (let i = 0; i < overLimitApps.length; i++) {
            text += `${overLimitApps[i].name}`
            if (i != overLimitApps.length - 1) text += ", "
        }
    }

    if (messageToEditId) {
        bot.editMessageText(text, { chat_id: chatId, message_id: messageToEditId, parse_mode: "HTML" })
    } else {
        bot.sendMessage(chatId, text, { parse_mode: "HTML" })
    }

    showActionPicker(chatId, username)
}

let showAdminRemoveApp = async (chatId: number, messageToEditId: number | null = null) => {
    let inlineButtons: any[] = []
    let row = []
    for (let app of await getApps()) {
        if (app.removed) continue
        row.push({
            text: app.name,
            callback_data: `admin:remove:${app.facebookId}`
        })

        if (row.length == 2) {
            inlineButtons.push(row)
            row = []
        }
    }

    inlineButtons.push([{
        text: "Отмена",
        callback_data: CANCEL
    }])

    if (messageToEditId) {
        bot.editMessageText(`Выбери приложение для удаления: `, { reply_markup: { inline_keyboard: inlineButtons }, chat_id: chatId, message_id: messageToEditId })
    } else {
        bot.sendMessage(chatId, `Выбери приложение для удаления: `, { reply_markup: { inline_keyboard: inlineButtons } })
    }
}

let showAdminAddOrUpdateApp = async (chatId: number, messageToEditId: number | null = null) => {
    let inlineButtons: any[] = []

    inlineButtons.push([{
        text: "Отмена",
        callback_data: CANCEL
    }])

    updateChatStatus(chatId, WAITING_FOR_APP_ADD)
    updateChatUploadMessageId(chatId, messageToEditId)

    if (messageToEditId) {
        bot.editMessageText(`Введи инфу для добавления: `, { reply_markup: { inline_keyboard: inlineButtons }, chat_id: chatId, message_id: messageToEditId })
    } else {
        bot.sendMessage(chatId, `Введи инфу для добавления: `, { reply_markup: { inline_keyboard: inlineButtons } })
    }
}

const validateUser = async (chatId: number, username: string): Promise<IUser | null> => {
    let user = await getUser(username)
    if (user) return user

    bot.sendMessage(chatId, 'Нет доступа')
    return null
}

const CHOOSE_APP_ADD = "choose_app_add"
const CHOOSE_APP_REMOVE = "choose_app_remove"
const ADD_USER = "add_user"
const REMOVE_USERS = "remove_users"
const CANCEL = "cancel"
const CHANGE_APP_ADD = "change_app_add"
const CHANGE_APP_REMOVE = "change_app_remove"
const SHOW_USERS = "show_users"

const ADMIN_ADD_APP = "admin_add_app"
const ADMIN_REMOVE_APP = "admin_remove_app"
const ADMIN_SHOW_RATING = "admin_show_rating"

const SHOW_APPSFLYER_UNITS_LEFT = "show_appsflyer_units_left"

initFacebook().then(() => console.log("Selenium initialized successfully."), (e) => console.log(e))

// testApps().then(() => console.log(), (e) => console.error(e))
startCheckerThread()
