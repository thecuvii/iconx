```
pnpm install @smashjs/iconx
touch iconx.config.ts
```

```ts
// iconx.config.ts
import { defineIconXConfig } from '@smashjs/iconx';

export default defineIconXConfig({
	url: 'https://lf1-cdn-tos.bytegoofy.com/obj/iconpark/svg_14273_10.c17e70c41ad09b3a9bb5913756e77cb3.js',
	output: 'playground',
	prefix: 'XIcon',
	platforms: ['taro', 'react'],
});
```
