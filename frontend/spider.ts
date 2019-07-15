import Axios from 'axios';
import cheerio from 'cheerio';
import { Article } from './article';

//const request = remote.require('request');
const BASE = 'https://www.ptt.cc/';

async function crawlArticle(url: string, date: Date): Promise<Article | null> {
	let rs = await Axios.get(url);
	let body = cheerio.load(rs.data, { decodeEntities: false });

	let lines = body('.article-metaline');
	let author = body(lines[0]).find('.article-meta-value').html();
	let title = body(lines[1]).find('.article-meta-value').html();
	let cur_date = new Date(body(lines[2]).find('.article-meta-value').html());
	if (cur_date < date) {
		return null;
	} else {
		let article = new Article(title, author, cur_date);
		body('.push').each((_, push) => {
			let str_type = body(push).find('.push-tag').html();
			let author = body(push).find('.push-userid').html();
			article.addComment(author, str_type);
		});

		return article;
	}
}

function crawlSingleList(date: Date, body: CheerioStatic): Promise<Article[]>;
function crawlSingleList(
	date: Date,
	b_name: string,
	keyword: string,
	page: number
): Promise<Article[]>;
async function crawlSingleList(
	date: Date,
	arg?: CheerioStatic | string,
	keyword?: string,
	page?: number
): Promise<Article[]> {
	if (typeof arg == 'string') {
		let url = `${BASE}/bbs/${arg}/search?q=${keyword}&page=${page}`;
		let rs = await Axios.get(url);
		let body = cheerio.load(rs.data);
		return await crawlSingleList(date, body);
	} else {
		let promises = new Array<Promise<Article>>();
		arg('.title').each((_, title) => {
			let href = arg(title).find('a').attr('href');
			promises.push(crawlArticle(`${BASE}/${href}`, date));
		});
		let articles = await Promise.all(promises);
		for (let [i, a] of articles.entries()) {
			if (!a) {
				articles = articles.slice(0, i);
				break;
			}
		}
		return articles;
	}
}

export async function startCrawl(b_name: string, date: Date, keyword: string): Promise<Article[]> {
	let url = `${BASE}/bbs/${b_name}/search?q=${keyword}`;
	let rs = await Axios.get(url);
	let body = cheerio.load(rs.data);

	let oldest_href = body('.btn-group-paging').find('a').attr('href');
	let page_max = parseInt(oldest_href.match(/\w*\/search\?\w*page=(\d+)\w*/)[1]);

	console.log(oldest_href);
	console.log(page_max);
	let articles = new Array<Article>();
	articles.concat(await crawlSingleList(date, body));
	for (let i = 2; i <= page_max; i++) {
		console.log(`正在處理第${i}頁...`);
		let t = await crawlSingleList(date, b_name, keyword, i);
		console.log(t);
		if (t.length == 0) {
			break;
		}
		articles = articles.concat(t);
	}
	return articles;
}