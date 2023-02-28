import Handlebars from 'handlebars';

import { IconSymbol } from './parse';

export interface Template {
	name: string;
	viewBox: string;
	path: {
		d: string;
		fill?: string;
		extra?: Record<string, any>;
	}[];
}

export type TemplateData = Handlebars.TemplateDelegate<Template>;

export const getTemplateData = (icon: IconSymbol) => {
	const { id, viewBox } = icon.$;
	/**
	 * 一个svg可能由多个path组成
	 */
	const path = icon.path.map((path) => {
		const { d, fill, ...extra } = path.$;

		return { d, fill, extra };
	});

	return { name: id, viewBox, path };
};
