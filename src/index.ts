import { pascalCase } from 'change-case';
import fs from 'fs-extra';
import handlebars from 'handlebars';
import { dirname, join } from 'pathe';
import { loadConfig } from 'unconfig';
import { fileURLToPath } from 'url';

import { Config } from './config';
import { getTemplateData, Template } from './gen';
import { parseIconfont } from './parse';

const { emptyDir, outputFile, outputFileSync, readFileSync } = fs;

const __dirname = dirname(fileURLToPath(import.meta.url));

const generate = async ({ url, output, prefix, platforms }: Config) => {
	if (!platforms.length) {
		process.exit(1);
	}

	const { svg } = await parseIconfont(url);
	const icons = svg.symbol;

	const outputPath = join(process.cwd(), output);
	const taroTemplatePath = join(__dirname, '../templates/taro.handlebars');
	const reactTemplatePath = join(__dirname, '../templates/react.handlebars');
	const taroIndexPath = join(outputPath, 'index.taro.ts');
	const reactIndexPath = join(outputPath, 'index.react.ts');
	let taroIndexCode = '';
	let reactIndexCode = '';

	if (icons.length) {
		await emptyDir(outputPath);
	}

	const taroSource = readFileSync(taroTemplatePath, 'utf-8');
	const taroTemplate = handlebars.compile<Template>(taroSource);

	const webSource = readFileSync(reactTemplatePath, 'utf-8');
	const webTemplate = handlebars.compile<Template>(webSource);

	console.time('耗时');
	await Promise.all(
		icons.map(async (icon) => {
			const data = getTemplateData(icon);
			const name = pascalCase(`${prefix} ${data.name}`);

			if (platforms.includes('taro')) {
				const taroCode = taroTemplate(data);
				await outputFile(join(outputPath, `${name}.taro.tsx`), taroCode);
				taroIndexCode += `export * from './${name}.taro';\n`;
			}

			if (platforms.includes('react')) {
				const webCode = webTemplate(data);
				await outputFile(join(outputPath, `${name}.react.tsx`), webCode);
				reactIndexCode += `export * from './${name}.react';\n`;
			}

			console.log(`✅ ${name}`);
		}),
	);

	if (platforms.includes('taro')) {
		outputFileSync(taroIndexPath, taroIndexCode);
	}

	if (platforms.includes('react')) {
		outputFileSync(reactIndexPath, reactIndexCode);
	}

	console.timeEnd('耗时');
};

export const start = async () => {
	const { config } = await loadConfig<Config>({
		sources: [{ files: 'iconx.config' }],
	});

	config.url && config.output && config.platforms.length && generate(config);
};

export * from './config';
