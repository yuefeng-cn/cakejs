import {EggAppInfo} from 'egg-core';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
export default (appInfo: EggAppInfo) => {
	const config: {[key: string]: any} = {};
	['auth'].forEach((mw) => {
		config[mw] = {
			framework: true,
		};
	});
	return config;
};
