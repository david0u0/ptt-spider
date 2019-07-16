import React, { ReactNode } from 'react';
import { Article } from './article';

export function ArticleList(props: { articles: Article[] }): JSX.Element {
	return <>
		<div style={{
			display: 'grid',
			gridTemplateColumns: '35fr 10fr 10fr 10fr 10fr 10fr 10fr',
			gridColumnGap: '5px'
		}}>
			<div>標題/作者</div>
			<div>總推噓</div>
			<div>總推數</div>
			<div>總噓數</div>
			<div>不同帳號推文數</div>
			<div>不同帳號噓文數</div>
			<div>總箭頭數</div>
		</div>
		<hr style={{ borderColor: 'gray' }} />
		<div style={{
			display: 'grid',
			gridTemplateColumns: '35fr 10fr 10fr 10fr 10fr 10fr 10fr'
		}}>
			{
				props.articles.map((article, i) => {
					return <SingleArticle key={i} article={article} />;
				})
			}
		</div>
	</>;
}

function BottomedDiv(props: { children: ReactNode }): JSX.Element {
	return <div style={{
		borderBottomColor: '#ddd',
		borderBottomStyle: 'solid',
		borderBottomWidth: 1
	}}>{props.children}</div>;
}

function SingleArticle(props: { article: Article }): JSX.Element {
	let article = props.article;
	return <>
		<BottomedDiv>
			<div><a href={article.url}>{article.title}</a></div>
			<div>{article.author}</div>
		</BottomedDiv>
		<BottomedDiv>{article.total}</BottomedDiv>
		<BottomedDiv>{article.push}</BottomedDiv>
		<BottomedDiv>{article.fuck}</BottomedDiv>
		<BottomedDiv>{article.diff_push}</BottomedDiv>
		<BottomedDiv>{article.diff_fuck}</BottomedDiv>
		<BottomedDiv>{article.arrow}</BottomedDiv>
	</>;
}

function Cell(props: { num: number, getList: () => string[] }): JSX.Element {
	return <div>{props.num}</div>;
}