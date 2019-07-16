import React from 'react';
import { Article } from './article';

export enum SortFlag {
	Index,
	CleanPush,
	Push,
	Fuck,
	DiffPush,
	DiffFuck,
	Total
}

function getArticleValue(article: Article, flag: SortFlag): number {
	switch (flag) {
		case SortFlag.Index:
			return article.index;
		case SortFlag.CleanPush:
			return article.clean_push;
		case SortFlag.Push:
			return article.push;
		case SortFlag.Fuck:
			return article.fuck;
		case SortFlag.DiffPush:
			return article.diff_push;
		case SortFlag.DiffFuck:
			return article.diff_fuck;
		case SortFlag.Total:
			return article.total;
	}
}

export function sortArticles(articles: Article[], flag: SortFlag): Article[] {
	articles = [...articles];
	articles.sort((a, b) => {
		let res = getArticleValue(b, flag) - getArticleValue(a, flag);
		if (res == 0) {
			return b.index - a.index;
		} else {
			return res;
		}
	});
	return articles;
}
export const FlagContext = React.createContext({
	cur_flag: SortFlag.Index,
	switchFlag: (_f: SortFlag) => {}
});