import { App } from "../models"

export const changeAppGroup = async (appId: string, groupId: string | null) => {
    return await App.findByIdAndUpdate(appId, {group: groupId})
}