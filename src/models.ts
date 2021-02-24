
import { Document, Model, model, models, Schema } from 'mongoose';

export const IDLE = 0
export const WAITING_FOR_USERNAMES = 2
export const PROCESSING_IDS = 3
export const WAITING_FOR_IDS_ADD = 1
export const WAITING_FOR_IDS_REMOVE = 4
export const WAITING_FOR_APP_ADD = 5
export const WAITING_FOR_REMOVE_USERNAMES = 6

// OneSignal
export interface IOSSegment extends Document {
    at: IOSAt[]

    country: IOSCountry

    titles: string[]
    bodies: string[]
    images: string[]

    titleIndex: number
    bodyIndex: number
    imageIndex: number
}

const OSSegmentSchema = new Schema({
    at: [Object],
    country: Object,
    titles: [String],
    bodies: [String],
    images: [String],
    titleIndex: Number,
    bodyIndex: Number,
    imageIndex: Number
})

export const OSSegmentModel: Model<IOSSegment> = model<IOSSegment>('OSSegment', OSSegmentSchema);

export interface IOSCountry {
    code: string,
    name: string
}

export interface IOSSegmentCustomization {
    at: IOSAt[]
}

export interface IOSAt {
    h: number
    m: number
}

export interface IOSGroup extends Document {
    name: string
    customization: Map<string, IOSSegmentCustomization>
}

const OSGroupSchema = new Schema({
    name: String,
    customization: Object
})

export const OSGroupModel: Model<IOSGroup> = model<IOSGroup>('OSGroup', OSGroupSchema);

export interface IApp extends Document {
    name: string
    bundle: string
    facebookId: string
    onesignalId: string
    appsflyerLogin: string
    appsflyerPassword: string
    appsflyerDevKey: string
    metricaPostApiKey: string
    metricaSdkKey: string
    metricaAppId: string

    privacyPolicyUrl: string

    banned: boolean
    published: boolean
    rating: string
    appsflyerUnitsLeft: number
    group: IOSGroup | string | null

    removed: boolean,
    facebook: boolean
}

export interface IUser extends Document {
    username: string
    addedBy: string
}

export interface IChatStatus extends Document {
    chatId: number
    username: string
    status: number
    app: IApp | null
    uploadMessageId: number | null
}

const ChatStatusSchema = new Schema({
    chatId: Number,
    username: String,
    status: Number,
    app: Object,
    uploadMessageId: Number
})

export const ChatStatusModel: Model<IChatStatus> = model<IChatStatus>('ChatStatus', ChatStatusSchema);

const UserSchema = new Schema({
    username: String,
    addedBy: {
        type: String,
        default: "Nobody"
    }
})

const User: Model<IUser> = models.User || model<IUser>('User', UserSchema);

const AppSchema = new Schema({
    name: String,
    facebookId: String,
    bundle: { type: String, unique: true },
    onesignalId: String,
    rating: {
        type: String,
        default: "0.0"
    }, // TODO fix rating checking
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
        default: false
    },
    published: {
        type: Boolean,
        default: false
    },
    removed: {
        type: Boolean,
        default: false
    },
    facebook: {
        type: Boolean,
        default: true
    }
})

export const getUsersData = async () => {
    let users = await User.find()

    let text = ""
    for (let user of users) {
        text += `@${user.username}, добавлен @${user.addedBy}\n`
    }

    return text
}

// showUsers()

export const App: Model<IApp> = models.App || model<IApp>('App', AppSchema);

export const addUsers = async (by: string, users: string[]) => {
    for (let username of users) {
        let user = await User.findOne({ username: username })
        if (user || !username) continue

        await User.create({
            username: username,
            addedBy: by
        })
    }
}

export const removeUsers = async (users: string[]) => {
    for (let username of users) {
        console.log(username)
        let result = await User.deleteOne({
            username: username
        }).exec()

        let user = await User.findOne({
            username: username
        })

        console.log(user)

        console.log(result)
    }
}

export const markAppAsBanned = async (app: IApp) => {
    return App.updateOne({ facebookId: app.facebookId }, { banned: true }).exec()
}

export const markAppAsPublished = async (app: IApp) => {
    return await (App.findById(app._id)).update({ published: true }).exec()
}

export const updateAppRating = async (app: IApp, rating: string) => {
    return await (App.findById(app._id)).update({ rating: rating }).exec()
}

export const getApps = async () => {
    return App.find()
}

export const getApp = async (facebookId: string) => {
    return App.findOne({ facebookId: facebookId })
}


// App.updateOne({bundle: "jok.games.infinity"}, {published: true}).exec()
// App.remove({ bundle: "vik.kingage.paptoss", facebook: true }).exec()
// App.remove({ bundle: "pol.wolfsca"}).exec()

export const addApp = async (app: any) => {

    if (await App.findOne({ bundle: app.bundle }).exec()) {
        return App.updateOne({ bundle: app.bundle }, app).exec()
    } else return App.create({
        ...app,
        banned: false, published: false, rating: "0.0", group: null
    })
}

export const reformatDb = async () => {
    let apps = await App.find()

    for (let app of apps) {
        await app.update({ facebookId: app.facebookId }).exec()
    }
}

export const updateApp = async (facebookId: string, bundle: string, onesignalId: string) => {
    return App.update({ facebookId: facebookId }, { bundle: bundle, onesignalId: onesignalId, banned: false }).exec()
}

export const removeApp = async (facebookId: string) => {
    return App.update({ facebookId: facebookId }, { removed: true }).exec()
}

export const getUser = async (username: string) => {
    return User.findOne({ username: username })
}

export const allStatuses = async () => {
    return await ChatStatusModel.find()
}

export const validApp = async (facebookId: string): Promise<boolean> => {
    let app = await App.findOne({ facebookId: facebookId })

    return app !== null
}

/** Chat status */
export const createChatStatus = async (chatId: number, username: string): Promise<IChatStatus> => {
    let status = await ChatStatusModel.findOne({ chatId: chatId })

    if (status) await status.remove()

    return await ChatStatusModel.create({
        chatId: chatId,
        username: username,
        status: IDLE,
        app: null,
        uploadMessageId: null
    })
}

export const getChatStatusByChatId = async (chatId: number): Promise<IChatStatus | undefined> => {
    let chatStatus = await ChatStatusModel.findOne({ chatId: chatId })

    if (chatStatus) return chatStatus
}

export const getChatStatusByUsername = async (username: string): Promise<IChatStatus | undefined> => {
    let chatStatus = await ChatStatusModel.findOne({ username: username })

    if (chatStatus) return chatStatus
}

export const updateChatStatus = async (chatId: number, status: number): Promise<IChatStatus | null> => {
    await ChatStatusModel.updateOne({ chatId: chatId }, { status: status }).exec()

    return ChatStatusModel.findOne({ chatId: chatId })
}

export const updateChatUploadMessageId = async (chatId: number, messageId: number | null): Promise<IChatStatus | null> => {
    await ChatStatusModel.updateOne({ chatId: chatId }, { uploadMessageId: messageId }).exec()

    return ChatStatusModel.findOne({ chatId: chatId })
}

export const updateChatApp = async (chatId: number, app: IApp | null): Promise<IChatStatus | null> => {
    await ChatStatusModel.updateOne({ chatId: chatId }, { app: app }).exec()

    return ChatStatusModel.findOne({ chatId: chatId })
}

// App.update({},{appsflyerUnitsLeft:12000}).exec()