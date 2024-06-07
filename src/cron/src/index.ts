import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { CloudflareWorkersAIEmbeddings } from '@langchain/cloudflare';
import { UpstashVectorStore } from '@langchain/community/vectorstores/upstash';
import { Index } from '@upstash/vector';
import { Document } from 'langchain/document';
import { Fetcher } from '@cloudflare/workers-types';

const obj = {
	async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
		const index = new Index({
			url: env.UPSTASH_INDEX_URL,
			token: env.UPSTASH_TOKEN,
			cache: false,
		});

		const embeddings = new CloudflareWorkersAIEmbeddings({
			binding: env.AI as Fetcher,
			model: '@cf/baai/bge-base-en-v1.5',
		});
		const UpstashVector = new UpstashVectorStore(embeddings, { index });
		const splitter = new RecursiveCharacterTextSplitter({
			chunkSize: 400,
			chunkOverlap: 20,
		});

		const manageVectorEmbeddings = async () => {
			// Deleting all those chunks with flag="delete"
			while (true) {
				const IDs_to_delete = await index.query({
					filter: 'flag = "delete"',
					includeMetadata: true,
					data: 'everything',
					topK: 1000,
				});
				console.log('IDs to delete', IDs_to_delete.length);
				if (IDs_to_delete.length == 0) {
					break;
				}
				const ID_list: string[] = [];
				for (const article of IDs_to_delete) {
					ID_list.push(article.id as string);
				}
				if (ID_list.length > 0) {
					console.log(await index.delete(ID_list));
				}
			}

			// update all those chunks with flag="new" to "delete"
			while (true) {
				const IDs_to_change = await index.query({
					filter: 'flag = "new"',
					includeMetadata: true,
					data: 'everything',
					topK: 1000,
				});
				console.log('IDs to update', IDs_to_change.length);
				if (IDs_to_change.length == 0) {
					break;
				}
				const ID_list: any = [];
				for (const article of IDs_to_change) {
					const id = article.id;
					const metadata = article.metadata;
					const updateMetadata = { ...metadata, flag: 'delete' };
					ID_list.push({ id, data: 'Data flag', metadata: updateMetadata });
				}
				await index.upsert(ID_list);
			}
		};
		const keywords_to_delete = [
			'video_url',
			'content',
			'source_priority',
			'source_url',
			'source_icon',
			'language',
			'ai_tag',
			'sentiment',
			'sentiment_stats',
			'ai_region',
			'ai_org',
		];
		const addEmbeddings = async (news_list: any, KV_key: string) => {
			for (const element of news_list) {
				const link = element.link;
				const response = await fetch(`https://r.jina.ai/${link}`);
				const data = await response.text();
				console.log(data.substring(0, 20));
				const splitDocs = await splitter.splitDocuments([
					new Document({
						pageContent: data,
						metadata: { pageURL: link, flag: 'new' },
					}),
				]);
				await UpstashVector.addDocuments(splitDocs);
				for (const keys of keywords_to_delete) {
					delete element[keys];
				}
			}
			await env.KV.put(KV_key, JSON.stringify(news_list));
		};

		const add_top_10_news = async () => {
			const top10 = await fetch(
				`https://newsdata.io/api/1/news?apikey=${env.newsdataAPI}&country=in&language=en&category=business,crime,politics,sports,technology `
			);
			const top_10_news: any = await top10.json();
			await addEmbeddings(top_10_news.results.slice(0, 5), 'top10');
		};

		const add_technology_news = async () => {
			const technology = await fetch(
				`https://newsdata.io/api/1/news?apikey=${env.newsdataAPI}&q=programming%20OR%20coding&language=en&category=technology`
			);
			const technology_news: any = await technology.json();
			await addEmbeddings(technology_news.results.slice(0, 5), 'tech');
		};

		const add_sports_news = async () => {
			const sports = await fetch(`https://newsdata.io/api/1/news?apikey=${env.newsdataAPI}&country=in&language=en&category=sports`);
			const sports_news: any = await sports.json();
			await addEmbeddings(sports_news.results.slice(0, 5), 'sports');
		};

		const add_politics_news = async () => {
			const politics = await fetch(`https://newsdata.io/api/1/news?apikey=${env.newsdataAPI}&country=in&language=en&category=politics `);
			const politics_news: any = await politics.json();
			await addEmbeddings(politics_news.results.slice(0, 5), 'politics');
		};

		const add_business_news = async () => {
			const business = await fetch(`https://newsdata.io/api/1/news?apikey=${env.newsdataAPI}&country=in&language=en&category=business`);
			const business_news: any = await business.json();
			await addEmbeddings(business_news.results.slice(0, 5), 'business');
		};

		switch (event.cron) {
			case '0 0,12 * * *':
				await manageVectorEmbeddings();
				break;
			case '3 0,12 * * *':
				await add_top_10_news();
				break;
			case '6 0,12 * * *':
				await add_business_news();
				break;
			case '9 0,12 * * *':
				await add_politics_news();
				break;
			case '12 0,12 * * *':
				await add_sports_news();
				break;
			case '15 0,12 * * *':
				await add_technology_news();
				break;
		}
	},
};

export default obj;
