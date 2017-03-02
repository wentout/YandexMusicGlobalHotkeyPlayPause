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

chrome.commands.onCommand.addListener((command) => {
	getTabsList((err, list) => {
		list.forEach((tab) => {
			if (tab.pinned && tab.url.indexOf('music.yandex.ru') > 0) {
				chrome.tabs.executeScript(tab.id, {
					file : `page${tab.audible}.js`
				}, () => {
					// toggle = !toggle;
				});
			}
		});
	});
});
