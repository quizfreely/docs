// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
    site: "https://quizfreely.org",
    base: "/docs/",
	integrations: [
		starlight({
			title: 'Quizfreely',
            logo: {
                src: "./src/assets/logo.svg",
                replacesTitle: true
            },
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/quizfreely' }],
            editLink: {
                baseUrl: "https://github.com/quizfreely/docs/edit/main/"
            },
			sidebar: [
				{
					label: 'Overview',
                    autogenerate: {
                        directory: 'overview'
                    }
				},
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' },
				},
				{
					label: 'DevOps Reference',
                    autogenerate: {
                        directory: 'devops'
                    }
				},
			],
		}),
	],
});
