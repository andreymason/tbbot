import axios from 'axios';
import { showAppIsBannedMessage, showAppIsPublishedMessage } from '.';
import { unpairAllAdAccounts } from './automatizer';
import { getApps, IApp, markAppAsBanned, markAppAsPublished, updateAppRating } from './models';

var request = require("request")

var Agent = require('socks5-https-client/lib/Agent');

export let checkApps = async () => {
	try {
		let apps = await getApps()

		for (let app of apps) {
			if (app.banned || app.removed) continue

			console.log(`Checking ${app.name} (${app.bundle}), banned: ${app.banned}, removed: ${app.removed}, published: ${app.published}`)

			try {
				let published = await checkApp(app.bundle, app)
				if (app.published && !published) {
					await unpairAllAdAccounts(app)
					await markAppAsBanned(app)
					await showAppIsBannedMessage(app)

					console.log(`${app.name} is banned`)
				} else if (!app.published && published) {
					await markAppAsPublished(app)
					await showAppIsPublishedMessage(app)
				}
			} catch (e) {

			}

			await changeIp()
		}
	} catch (e) {
		console.error(e)
	}
}

let changeIp = async () => {
	return new Promise(async (resolve) => {
		try {
			await axios.request({
				url: "http://178.151.69.50:8080/20_reconnect+ID-92263480-ks.php",
				method: "GET",
				timeout: 8 * 1000
			})
		} catch (e) {

		}

		setTimeout(resolve, 5 * 1000 + (1 * 60 * 1000) * Math.random())
	})
}

let checkApp = async (bundle: string, app: IApp) => {
	return new Promise<boolean>((resolve, reject) => {
		request({
			url: `https://play.google.com/store/apps/details?id=${bundle}`,
			strictSSL: true,
			agentClass: Agent,
			agentOptions: {
				socksHost: '178.151.69.50',
				socksPort: 7020,
				socksUsername: 'user20',
				socksPassword: 'BKwRjj8t',
			},
			timeout: 10
		}, function (err: any, res: any) {
			if (err) {
				reject(err)
			}

			if (res) {
				if (res.body.includes("We're sorry, the requested URL was not found on this server.")) {
					resolve(false)
				} else {
					let ratingMatch = res.body.match(/<div class="pf5lIe"><div aria-label="Rated (.{3})/)
					if (ratingMatch && ratingMatch[1] !== "0.0") {
						updateAppRating(app, ratingMatch[1])
					}

					resolve(true)
				}
			} else {
				reject()
			}
		});
	})
}

let wait = async (ms: number) => {
	return new Promise((resolve) => {
		setTimeout(resolve, ms)
	})
}

export let startCheckerThread = async () => {
	while (true) {
		try {
			await checkApps()
		} catch (e) {
			console.log(e)
		}
		await wait((25 + (Math.random() * 15)) * 60 * 1000)
	}
}