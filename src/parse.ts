import fetch from 'node-fetch';
import { parseStringPromise } from 'xml2js';

export interface IconSymbol {
	$: {
		viewBox: string;
		id: string;
	};
	path: Array<{
		$: {
			d: string;
			fill?: string;
			extra?: Record<string, any>;
		};
	}>;
}

interface XmlData {
	svg: {
		symbol: Array<IconSymbol>;
	};
}

const resolveUrl = (url: string) => {
	if (url.includes('iconpark')) return url;
	if (url.includes('alicdn')) return 'https:' + url;
	return url;
};

export const parseIconfont = async (url: string): Promise<XmlData> => {
	const response = await fetch(resolveUrl(url));
	const data = await response.text();
	const matches = data.match(/'<svg>(.+?)<\/svg>'/);

	return parseStringPromise(`<svg>${matches![1]}</svg>`);
};
