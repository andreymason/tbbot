import * as express from "express";
import { Document, model, Model, Schema } from "mongoose";
const router = express.Router()

interface InstallLog extends Document {
    ip: string,
    date: number,
    conversionData: string,
    referrer: string,
    appName: string
}

const InstallLogSchema = new Schema({
    ip: String,
    date: Number,
    conversionData: String,
    referrer: String,
    appName: {
        type: String,
        default: "Lucky Coin"
    }
});

export const InstallLogModel: Model<InstallLog> = model<InstallLog>('InstallLog', InstallLogSchema);

export const getAllLogs = (): Promise<InstallLog[]> => {
    return InstallLogModel.find().exec()
}

export const getLogsForApp = async (appName: string): Promise<InstallLog[]> => {
    return InstallLogModel.find({appName: appName}).exec()
}

export const addLog = async (ip: string, conversionData: string, referrer: string, appName: string) => {
    let log = await InstallLogModel.create({
        conversionData: conversionData,
        referrer: referrer,
        appName: appName,
        ip: ip,
        date: Date.now()
    })
}

router.post("/create", async function (req: express.Request, res: express.Response, next: Function) {
    let appName = req.body.appName || "Lucky Coin"
    let conversionData = req.body.conversionData
    let referrer = req.body.referrer
    let version = req.body.version || 0
    let ip = req.headers['x-real-ip']?.toString() || req.connection.remoteAddress || ""

    if (version < 1) {
        console.log("low version")
        return res.status(200).json({ success: true })
    }

    try {
        await addLog(ip, conversionData, referrer, appName)

        return res.status(200).json({ success: true })
    } catch (e) {
        return res.status(500).send(e)
    }
})

router.get("/", async function (req: express.Request, res: express.Response, next: Function) {
    try {
        let logs = await getAllLogs()

        return res.status(200).send(logs)
    } catch (e) {
        return res.status(500).send(e)
    }
})

router.get("/:name", async function (req: express.Request, res: express.Response, next: Function) {
    try {
        let logs = await getLogsForApp(req.params.name)

        return res.status(200).send(logs)
    } catch (e) {
        return res.status(500).send(e)
    }
})

export { router as Router };

