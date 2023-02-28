export interface Config {
	url: string;
	output: string;
	prefix?: string;
	platforms: Array<'taro' | 'react'>;
}

export const defineIconXConfig = (config: Config) => config;
