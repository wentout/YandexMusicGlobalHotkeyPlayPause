// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

const getTabsList = (cb) => {
	const tabs = [];
	chrome.windows.getAll({ populate: true }, (windowList) => {
		windowList.forEach((win) => {
			win.tabs.forEach((tab, idx) => {
				tabs.push(tab);
			});
			cb(null, tabs);
		});
	});
}


const activateTab = (tabId, cb) => {
	chrome.tabs.update(tabId, {
		'active' : true
	}, cb);
};
const makeAction = (tab, cb) => {
	chrome.tabs.executeScript(tab.id, {
		file : `page${tab.audible}.js`
	}, cb);
};

let firstRound = true;
const finAction = (YMTab, activeTabId) => {
	setTimeout(() => {
		makeAction(YMTab, () => {
			setTimeout(() => {
				activateTab(activeTabId, () => {
					firstRound = false;
				});
			}, 2000);
		});
	}, 1000);
};


chrome.commands.onCommand.addListener((command) => {
	getTabsList((err, list) => {
		let YMTab = null;
		let activeTabId = null;
		list.forEach((tab) => {
			if (tab.pinned && tab.url.indexOf('music.yandex.ru') > 0) {
				YMTab = tab;
			}
			if (tab.active) {
				activeTabId = tab.id;
			}
		});
		if (YMTab) {
			if (firstRound) {
				const checkAndFin = (tab) => {
					if (tab.status == 'complete' && tab.selected) {
						finAction(YMTab, activeTabId);
					} else {
						checkAndFin(tab);
					}
				};
				activateTab(YMTab.id, checkAndFin);
			} else {
				makeAction(YMTab);
			}
		}
	});
});
