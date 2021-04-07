import * as express from "express";
import * as selenium from 'selenium-webdriver';
import { showAppsflyerIsBroken } from ".";
import { showAppsIsZero } from ".";
import { showAppsIsLimited } from ".";
// import { showAppsflyerIsBroken } from ".";
import { App, IApp } from './models';
const firefox = require('selenium-webdriver/firefox');
const router = express.Router()

const FACEBOOK_USERNAME = "pazyukrus84@gmail.com"
const FACEBOOK_PASSWORD = "ABaKaNaNa20"

let fbIsReady = false

let processing = false

let queue: QueueEntry[] = []

let facebookWebdriver: selenium.ThenableWebDriver
let appsflyerWebdriver: selenium.ThenableWebDriver
try {
    facebookWebdriver = new selenium.Builder()
        .withCapabilities(selenium.Capabilities.firefox())
        .setFirefoxOptions(new firefox.Options().headless())
        .build()

    appsflyerWebdriver = new selenium.Builder()
        .withCapabilities(selenium.Capabilities.firefox())
        .setFirefoxOptions(new firefox.Options().headless())
        .build()

    checkAppsflyer()

} catch (e) {
    console.log(e)
}

// App.findOneAndUpdate({ bundle: "boo.bast.jo" }, { appsflyerLogin: "boombastic.joker@yandex.com", appsflyerPassword: "Qwerty1234!" }).exec()
// App.findOneAndUpdate({ bundle: "pol.wolfsca" }, { appsflyerLogin: "wolvescards-hd@yandex.ru", appsflyerPassword: "Qwerty1234!" }).exec()
// App.findOneAndUpdate({ bundle: "jok.games.infinity" }, { appsflyerLogin: "jokerinfinity@yandex.ru", appsflyerPassword: "Jokerinfinity123!" }).exec()
// App.findOneAndUpdate({ bundle: "com.firejo.jok" }, { appsflyerLogin: "JokeInFire@yandex.ru", appsflyerPassword: "Qwerty1234!" }).exec()
// App.findOneAndUpdate({ bundle: "com.crzbanana.crz" }, { appsflyerLogin: "crzbanana@yandex.ru", appsflyerPassword: "Qwerty1234!" }).exec()
// App.findOneAndUpdate({ bundle: "com.egyptdynas" }, { appsflyerLogin: "boombasticegypt@yandex.com", appsflyerPassword: "Qwerty1234!" }).exec()

export function addRequest(entry: QueueEntry) {
    queue.push(entry)

    console.log(`Added entry, ${queue.length} entries total.`)

    checkQueue()
}

export async function unpairAllAdAccounts(app: IApp) {
    return new Promise(resolve => {
        addRequest({
            type: EntryType.FACEBOOK_CLEAR,
            app: app,
            ids: [],
            callback: resolve
        } as FacebookQueueEntry)
    })

}

function checkQueue() {
    if (fbIsReady && !processing && queue.length > 0) {
        let nextEntry = queue.shift()
        if (nextEntry) {
            try {
                switch (nextEntry.type) {
                    case EntryType.FACEBOOK_ADD:
                        addAdAccounts(nextEntry as FacebookQueueEntry)
                        break;
                    case EntryType.FACEBOOK_REMOVE:
                        removeAdAccounts(nextEntry as FacebookQueueEntry)
                        break;
                    case EntryType.FACEBOOK_CLEAR:
                        clearAdAccounts(nextEntry as FacebookQueueEntry)
                        break;
                }
            } catch (e) {
                console.log(e)
            }
        }
    }
}

export async function addAdAccounts(entry: FacebookQueueEntry, tries: number = 0) {

    processing = true

    try {
        await facebookWebdriver.get(`https://developers.facebook.com/apps/${entry.app.facebookId}/settings/advanced/`)
    }
    catch (e) {
        processing = false
        entry.callback(null)
        console.log("Can't open advanced settings.")
        checkQueue()
    }

    let parentDiv = null
    let input = null
    try {
        parentDiv = await facebookWebdriver.findElement(selenium.By.id('advertiser_account_ids'))
        input = await parentDiv.findElement(selenium.By.css(`div>div>div>span>label>input`))
    } catch (e) {
        processing = false
        entry.callback(null)
        console.log("Can't find input.")
        checkQueue()
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
                await facebookWebdriver.wait(() => {
                    return selenium.until.elementLocated(selenium.By.xpath(`//span[text()[contains(., '${accountId}')]]`))
                })

                await facebookWebdriver.sleep(600)
                await input.sendKeys(selenium.Key.ENTER)

                await facebookWebdriver.wait(() => {
                    return selenium.until.elementLocated(selenium.By.xpath(`//span[@title='${accountId}']`))
                })

                result.push({ id: accountId, success: true })
                await facebookWebdriver.sleep(300)
            }

        await (await facebookWebdriver.findElement(selenium.By.name(`save_changes`))).click()
    } catch (e) {
        console.log(e)
        if (tries >= 3) {
            processing = false
            entry.callback(null)
        } else {
            addAdAccounts(entry, tries + 1)
        }
        return
    }

    entry.callback(result)

    processing = false
    checkQueue()
}

export async function removeAdAccounts(entry: FacebookQueueEntry, tries: number = 0) {
    processing = true

    try {
        await facebookWebdriver.get(`https://developers.facebook.com/apps/${entry.app.facebookId}/settings/advanced/`)
    }
    catch (e) {
        processing = false
        entry.callback(null)
        console.log("Can't open advanced settings.")
        checkQueue()
    }

    let result: FacebookResult[] = []

    try {
        for (var accountId of entry.ids) {
            try {
                let span = await facebookWebdriver.findElement(selenium.By.xpath(`//span[@title='${accountId}']`))
                let button = await span.findElement(selenium.By.xpath("./../span[2]/button"))

                await button.sendKeys(selenium.Key.ENTER)
            } catch (e) {
                result.push({ id: accountId, success: false })
                continue
            }

            result.push({ id: accountId, success: true })
            await facebookWebdriver.sleep(300)
        }

        await (await facebookWebdriver.findElement(selenium.By.name(`save_changes`))).click()

    } catch (e) {
        if (tries >= 3) {
            processing = false
            entry.callback(null)
        } else {
            removeAdAccounts(entry, tries + 1)
        }
        return
    }

    entry.callback(result)

    processing = false
    checkQueue()
}

export async function clearAdAccounts(entry: FacebookQueueEntry, tries: number = 0) {
    processing = true

    try {
        await facebookWebdriver.get(`https://developers.facebook.com/apps/${entry.app.facebookId}/settings/advanced/`)
    }
    catch (e) {
        processing = false
        entry.callback(null)
        console.log("Can't open advanced settings.")
        checkQueue()
    }

    let result: FacebookResult[] = []

    try {
        await facebookWebdriver.wait(() => {
            return selenium.until.elementLocated(selenium.By.xpath(`//div[contains(@class,'_59_n')]`))
        })

        let buttons = await facebookWebdriver.findElements(selenium.By.xpath("//button[contains(@class,'_1z6_ _50zy _50zz _50z- _5upp _42ft')]"))
        for (let button of buttons) {
            await facebookWebdriver.executeScript("arguments[0].click()", button)
        }

        await (await facebookWebdriver.findElement(selenium.By.name(`save_changes`))).click()

    } catch (e) {
        if (tries >= 3) {
            processing = false
            entry.callback(null)
        } else {
            clearAdAccounts(entry, tries + 1)
        }
        return
    }

    entry.callback(result)

    processing = false
    checkQueue()
}

export async function initFacebook() {

    await facebookWebdriver.get("https://developers.facebook.com/apps/")

    try {
        await facebookWebdriver.wait(() => {
            return selenium.until.elementLocated(selenium.By.xpath(`//button[@data-cookiebanner='accept_button']`))
        })

        await (await facebookWebdriver.findElement(selenium.By.xpath(`//button[@data-cookiebanner='accept_button']`))).click()
    } catch (e) { }

    await facebookWebdriver.findElement(selenium.By.name('email')).sendKeys(FACEBOOK_USERNAME);
    await facebookWebdriver.findElement(selenium.By.name('pass')).sendKeys(FACEBOOK_PASSWORD);
    await facebookWebdriver.findElement(selenium.By.name('login')).click()

    fbIsReady = true
    checkQueue()
}

export async function checkAppsflyerUnits(app: IApp) {
    await appsflyerWebdriver.get("https://hq1.appsflyer.com/auth/login")

    await appsflyerWebdriver.findElement(selenium.By.id('user-email')).sendKeys(app.appsflyerLogin);
    await appsflyerWebdriver.findElement(selenium.By.id('password-field')).sendKeys(app.appsflyerPassword);
    await appsflyerWebdriver.findElement(selenium.By.xpath(`//button[contains(@class,'btn btn-lg btn-primary submit-btn')]`)).click()


    await appsflyerWebdriver.get("https://hq1.appsflyer.com/account/get-account-info/" + app.appsflyerLogin)

    let pre = await appsflyerWebdriver.executeScript(`return document.getElementById('json').innerHTML`) as string

    let appObject = JSON.parse(pre)

    try {
        console.log(app.name + " \nОсталось инсталлов: " + appObject.account.installsLeft + "\n\n")
    }
    catch (e) {   
        console.log(app.name + " \nОшибка\n\n")
    }

    //await appsflyerWebdriver.get("https://hq1.appsflyer.com/account/myplan/overview")

    /*await appsflyerWebdriver.sleep(4000)

    try {

        let result = await appsflyerWebdriver.executeScript(`return document.getElementsByTagName('af-web-component')[0].shadowRoot.innerHTML`) as string

        let plan = /<div class="af-layout-header-title test__layout-title"><span class="title">(.*?)<\/span><\/div>/

        let planType = plan.exec(result) || []

        let plann = planType[1]
        if(plann == "Zero Plan" && app.appsStatus) {
            let res = await appsflyerWebdriver.get("https://integr-testing.site/tb/appsChecker/index.php?bundle=" + app.bundle)
            
            let textOfResult = await appsflyerWebdriver.findElement(selenium.By.id('plan')).getText()
            
            await App.updateOne({ _id: app._id }, { appsStatus: false }).exec()
            
            console.log(`${textOfResult}`)

            await showAppsIsZero(app)
        }
        
        let regex = /Remaining units<\/span><span class="af-features-feature-data-value"><span class="af-formatted-number ">(.*?)</g

        let matches = regex.exec(result) || []

        let unitsLeft = matches[1]

        let unitsLeftNumber = parseInt(unitsLeft.replace(',', '').replace('.', ''))

        console.log(`${app.name}: ${unitsLeftNumber} left (${app.appsflyerLogin} / ${app.appsflyerPassword})}`)

        await App.updateOne({ _id: app._id }, { appsflyerUnitsLeft: unitsLeftNumber }).exec()

        if(app.appsflyerUnitsLeft <= 2000 && app.appsStatus) {
            await showAppsIsLimited(app)
        }
    } catch (e) {   
        console.log(e)
        await App.updateOne({ _id: app._id }, { appsflyerUnitsLeft: 0 }).exec()
        if(app.appsStatus) {
            await App.updateOne({ _id: app._id }, { appsStatus: false }).exec()
            await showAppsIsZero(app)
        }

    }
    */
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

export interface FacebookQueueEntry extends QueueEntry {
    ids: string[]
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
            console.log(`${app}`)
        }

        let success = false
        for (let index = 0; index < 3; index++) {
            try {
                await checkAppsflyerUnits(app)

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
