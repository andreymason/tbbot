import * as express from "express";
import * as selenium from 'selenium-webdriver';
import { showAppsflyerIsBroken, showAppsIsDenied, showAppsIsLimited, showAppsIsZero } from ".";
// import { showAppsflyerIsBroken } from ".";
import { App, IApp } from './models';

const firefox = require('selenium-webdriver/firefox');
const router = express.Router()

let processing = false

let queue: QueueEntry[] = []

let drivers: Map<string, selenium.ThenableWebDriver> = new Map()

// let test = async () => {
//     let apps = await App.find({})

//     let map: Map<string, FacebookCredentials> = new Map()

//     for (let app of apps) {
//         let credential: FacebookCredentials = {
//                 login: app.facebookLog,
//                 password: app.facebookPass
//         }

//         map.set(app.facebookLog, credential)
//     }

//     console.log(map)
// } 

// test()

const MAX_TRIES = 1

let getFacebookDriver = async (credentials: FacebookCredentials): Promise<selenium.ThenableWebDriver | null> => {
    if (drivers.has(credentials.login)) return drivers.get(credentials.login)!

    let driver = new selenium.Builder()
        .withCapabilities(selenium.Capabilities.firefox())
        // .setFirefoxOptions(new firefox.Options().headless())
        .build()

    drivers.set(credentials.login, driver)


    console.log(`Started FB initialization for ${credentials.login}`)
    try {
        await (await driver).get("https://facebook.com")
        console.log("Loaded developers.facebook.com/apps")

        await driver.wait(() => {
            return selenium.until.elementLocated(selenium.By.xpath(`//button[@data-cookiebanner='accept_button']`))
        })

        await (await driver.findElement(selenium.By.xpath(`//button[@data-cookiebanner='accept_button']`))).click()

        await driver.findElement(selenium.By.name('email')).sendKeys(credentials.login);
        await driver.findElement(selenium.By.name('pass')).sendKeys(credentials.password);
        await driver.findElement(selenium.By.name('login')).click()

        await (await driver).sleep(3000)
    }
    catch (e) {
        (await driver).quit()
        drivers.delete(credentials.login)

        return null
    }

    return driver
}

let appsflyerWebdriver: selenium.ThenableWebDriver
try {

    appsflyerWebdriver = new selenium.Builder()
        .withCapabilities(selenium.Capabilities.firefox())
        .setFirefoxOptions(new firefox.Options().headless())
        .build()

    //checkAppsflyer()

} catch (e) {
    console.log(e)
}

// App.findOneAndUpdate({ bundle: "boo.bast.jo" }, { appsflyerLogin: "boombastic.joker@yandex.com", appsflyerPassword: "Qwerty1234!" }).exec()
// App.findOneAndUpdate({ bundle: "pol.wolfsca" }, { appsflyerLogin: "wolvescards-hd@yandex.ru", appsflyerPassword: "Qwerty1234!" }).exec()
// App.findOneAndUpdate({ bundle: "jok.games.infinity" }, { appsflyerLogin: "jokerinfinity@yandex.ru", appsflyerPassword: "Jokerinfinity123!" }).exec()
// App.findOneAndUpdate({ bundle: "com.firejo.jok" }, { appsflyerLogin: "JokeInFire@yandex.ru", appsflyerPassword: "Qwerty1234!" }).exec()
// App.findOneAndUpdate({ bundle: "com.crzbanana.crz" }, { appsflyerLogin: "crzbanana@yandex.ru", appsflyerPassword: "Qwerty1234!" }).exec()
// App.findOneAndUpdate({ bundle: "com.egyptdynas" }, { appsflyerLogin: "boombasticegypt@yandex.com", appsflyerPassword: "Qwerty1234!" }).exec()

export async function addRequest(entry: QueueEntry) {
    queue.push(entry)

    console.log(`Added entry, ${queue.length} entries total.`)

    await checkQueue()
}

export async function unpairAllAdAccounts(app: IApp) {
    return new Promise(resolve => {
        addRequest({
            type: EntryType.FACEBOOK_CLEAR,
            app: app,
            credentials: {
                login: app.facebookLog,
                password: app.facebookPass
            },
            ids: [],
            callback: resolve
        } as FacebookQueueEntry)
    })

}

async function checkQueue() {
    if (!processing && queue.length > 0) {
        let nextEntry = queue.shift()
        if (nextEntry) {

            try {
                let driver: selenium.WebDriver | null
                switch (nextEntry.type) {
                    case EntryType.FACEBOOK_ADD:
                        driver = await getFacebookDriver((nextEntry as FacebookQueueEntry).credentials)
                        if (!driver) return
                        addAdAccounts(nextEntry as FacebookQueueEntry, driver)
                        break;
                    case EntryType.FACEBOOK_REMOVE:
                        driver = await getFacebookDriver((nextEntry as FacebookQueueEntry).credentials)
                        if (!driver) return
                        removeAdAccounts(nextEntry as FacebookQueueEntry, driver)
                        break;
                    case EntryType.FACEBOOK_CLEAR:
                        driver = await getFacebookDriver((nextEntry as FacebookQueueEntry).credentials)
                        if (!driver) return
                        clearAdAccounts(nextEntry as FacebookQueueEntry, driver)
                        break;
                }
            } catch (e) {
                console.log(e)
            }
        }
    }
}

export async function addAdAccounts(entry: FacebookQueueEntry, driver: selenium.WebDriver, tries: number = 0) {
    processing = true

    try {
        console.log("Going to the advanced")
        await driver.get(`https://developers.facebook.com/apps/${entry.app.facebookId}/settings/advanced/`)
    }
    catch (e) {
        processing = false
        entry.callback(null)
        console.log("Can't open advanced settings.")
        console.log(e)
        await checkQueue()
    }

    let parentDiv = null
    let input = null
    try {
        parentDiv = await driver.findElement(selenium.By.id('advertiser_account_ids'))
        input = await parentDiv.findElement(selenium.By.css(`div>div>div>span>label>input`))
    } catch (e) {
        processing = false
        entry.callback(null)
        console.log("Can't find input.")
        await checkQueue()
    }

    let result: FacebookResult[] = []

    try {
        if (parentDiv && input)
            for (var accountId of entry.ids) {
                accountId = accountId.trim()
                try {
                    await parentDiv.findElement(selenium.By.xpath(`//span[@title='${accountId}']`))
                    result.push({ id: accountId, success: false })
                    console.log(`Already present: ${accountId}`)
                    continue
                } catch (e) {

                }

                await input.sendKeys(accountId)
                await driver.wait(() => {
                    return selenium.until.elementLocated(selenium.By.xpath(`//span[text()[contains(., '${accountId}')]]`))
                })

                await driver.sleep(600)
                await input.sendKeys(selenium.Key.ENTER)

                await driver.wait(() => {
                    return selenium.until.elementLocated(selenium.By.xpath(`//span[@title='${accountId}']`))
                })

                result.push({ id: accountId, success: true })
                await driver.sleep(300)
            }

        await (await driver.findElement(selenium.By.name(`save_changes`))).click()
    } catch (e) {
        console.log(e)
        if (tries >= MAX_TRIES) {
            processing = false
            entry.callback(null)
        } else {
            await addAdAccounts(entry, driver, tries + 1)
        }
        return
    }

    entry.callback(result)

    processing = false
    await checkQueue()
}

export async function removeAdAccounts(entry: FacebookQueueEntry, driver: selenium.WebDriver, tries: number = 0) {
    processing = true

    try {
        await driver.get(`https://developers.facebook.com/apps/${entry.app.facebookId}/settings/advanced/`)
    }
    catch (e) {
        processing = false
        entry.callback(null)
        console.log("Can't open advanced settings.")
        await checkQueue()
    }

    let result: FacebookResult[] = []

    try {
        for (var accountId of entry.ids) {
            try {
                let span = await driver.findElement(selenium.By.xpath(`//span[@title='${accountId}']`))
                let button = await span.findElement(selenium.By.xpath("./../span[2]/button"))

                await button.sendKeys(selenium.Key.ENTER)
            } catch (e) {
                result.push({ id: accountId, success: false })
                continue
            }

            result.push({ id: accountId, success: true })
            await driver.sleep(300)
        }

        await (await driver.findElement(selenium.By.name(`save_changes`))).click()

    } catch (e) {
        if (tries >= MAX_TRIES) {
            processing = false
            entry.callback(null)
        } else {
            await removeAdAccounts(entry, driver, tries + 1)
        }
        return
    }

    entry.callback(result)

    processing = false
    await checkQueue()
}

export async function clearAdAccounts(entry: FacebookQueueEntry, driver: selenium.WebDriver, tries: number = 0) {
    processing = true

    try {
        await driver.get(`https://developers.facebook.com/apps/${entry.app.facebookId}/settings/advanced/`)
    }
    catch (e) {
        processing = false
        entry.callback(null)
        console.log("Can't open advanced settings.")
        await checkQueue()
    }

    let result: FacebookResult[] = []

    try {
        await driver.wait(() => {
            return selenium.until.elementLocated(selenium.By.xpath(`//div[contains(@class,'_59_n')]`))
        })

        let buttons = await driver.findElements(selenium.By.xpath("//button[contains(@class,'_1z6_ _50zy _50zz _50z- _5upp _42ft')]"))
        for (let button of buttons) {
            await driver.executeScript("arguments[0].click()", button)
        }

        await (await driver.findElement(selenium.By.name(`save_changes`))).click()

    } catch (e) {
        if (tries >= MAX_TRIES) {
            processing = false
            entry.callback(null)
        } else {
            await clearAdAccounts(entry, driver, tries + 1)
        }
        return
    }

    entry.callback(result)

    processing = false
    await checkQueue()
}

export async function checkAppsflyerUnits(app: IApp) {
    try {
        await appsflyerWebdriver.get("https://hq1.appsflyer.com/auth/login")

        await appsflyerWebdriver.findElement(selenium.By.id('user-email')).sendKeys(app.appsflyerLogin);
        await appsflyerWebdriver.findElement(selenium.By.id('password-field')).sendKeys(app.appsflyerPassword);
        await appsflyerWebdriver.findElement(selenium.By.xpath(`//button[contains(@class,'btn btn-lg btn-primary submit-btn')]`)).click()


        await appsflyerWebdriver.get("https://hq1.appsflyer.com/account/plan-details")

        let pre = await appsflyerWebdriver.executeScript(`return document.getElementById('json').innerHTML`) as string

        let appObject = JSON.parse(pre)

        let plan = appObject.currentPackage.name

        let remaining_units = 0

        if (appObject.currentPackage.remaining_units == null) {
            remaining_units = 0
        }
        else {
            remaining_units = parseInt(appObject.currentPackage.remaining_units)
        }

        if (plan == "Zero Plan" && app.appsStatus && !app.banned) {
            let res = await appsflyerWebdriver.get("https://integr-testing.site/tb/appsChecker/index.php?bundle=" + app.bundle)

            let textOfResult = await appsflyerWebdriver.findElement(selenium.By.id('plan')).getText()

            await App.updateOne({ _id: app._id }, { appsStatus: false }).exec()

            console.log(`${textOfResult}`)

            await showAppsIsZero(app)
        }

        console.log(`${app.name}: ${remaining_units} left (${app.appsflyerLogin} / ${app.appsflyerPassword})}`)

        await App.updateOne({ _id: app._id }, { appsflyerUnitsLeft: remaining_units }).exec()

        if (app.appsflyerUnitsLeft <= 2000 && app.appsStatus && !app.banned && plan != "Zero Plan") {
            await showAppsIsLimited(app)
        }

    }
    catch (e) {
        if (!app.banned)
            showAppsIsDenied(app)
    }
}

async function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}

interface QueueEntry {
    app: IApp
    type: EntryType
}

export interface AppsflyerQueueEntry extends QueueEntry {
    callback: (result: AppsflyerResult) => void
}

export interface FacebookCredentials {
    login: string,
    password: string
}
export interface FacebookQueueEntry extends QueueEntry {
    ids: string[],
    credentials: FacebookCredentials
    callback: (result: FacebookResult[] | null) => void
}

export interface AppsflyerResult {
    unitsLeft: number
    success: boolean
}
export interface FacebookResult {
    id: string
    success: boolean
}

export enum EntryType {
    FACEBOOK_ADD, FACEBOOK_REMOVE, FACEBOOK_CLEAR, APPSFLYER_CHECK
}

export async function checkAppsflyer() {
    // let apps = await App.find()
    // for (let app of apps) {
    //     await App.update({ _id: app._id }, { appsflyerUnitsLeft: 12000 })
    // }
    let apps = await App.find()
    for (let app of apps) {
        // console.log(`${app.name} - ${app.appsflyerUnitsLeft}`)
        if (app.banned || !app.published || !app.appsflyerLogin) {
            continue
        } else {
            //console.log(`${app}`)
        }

        let success = false
        for (let index = 0; index < 3; index++) {
            try {
                if (!app.banned) {
                    await checkAppsflyerUnits(app)
                }

                success = true
                break
            } catch (e) {
                console.log(e)
                console.log(`${app.appsflyerLogin} / ${app.appsflyerPassword}`)
            }
        }

        if (!success) {
            await showAppsflyerIsBroken(app)
            await App.updateOne({ _id: app._id }, { appsflyerUnitsLeft: 0 }).exec()
        }

    }

    console.log("Finished AppsFlyer checking")
}

let wait = async (ms: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}

// checkAppsflyerUnits({
//     appsflyerLogin: "NeonCards3@yandex.ru",
//     appsflyerPassword: "Qwert123!"
// } as any)

export let startAppsflyerThread = async () => {
    while (true) {
        try {
            console.log("Starting AppsFlyer check")
            await checkAppsflyer()
        } catch (e) {
            console.log(e)
        }

        await wait(3 * 60 * 60 * 1000)
    }
}

export { router as Router };
