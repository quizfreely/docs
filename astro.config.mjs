// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
    site: "https://quizfreely.org",
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
			head: [{
				tag: "script",
				attrs: {
					defer: true,
					src: "https://quizfreely.org/umami/script.js",
					"data-website-id": "66bb49b5-7ae1-47a7-b53a-4be4adcccad9"
				}
			}],
			sidebar: [
				{
					label: 'Overview',
                    autogenerate: {directory: 'overview'}
				},
				{
					label: 'Web App',
                    autogenerate: {directory: 'web'}
				},
				{
					label: 'API',
                    autogenerate: {directory: 'api'}
				},
				{
					label: 'IDB API Layer',
                    autogenerate: {directory: 'idb-api-layer'}
				},
				{
					label: 'DevOps Reference',
                    autogenerate: {directory: 'devops'}
				},
			],
		}),
	],
});
