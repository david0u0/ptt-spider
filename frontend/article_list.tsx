import React, { ReactNode, useContext } from 'react';
import { Article } from './article';
import { SortFlag, FlagContext } from './sort_flag';

function SortingCell(
	props: {
		txt: string,
		flag: SortFlag,
	}
): JSX.Element {
	const { cur_flag, switchFlag } = useContext(FlagContext);
	return <div style={{
		textAlign: 'center',
		backgroundColor: cur_flag == props.flag ? '#b1d6fc' : 'inherit',
	}}>
		<span>{props.txt}</span>
		<span style={{
			color: cur_flag == props.flag ? 'red' : 'inherit',
			cursor: 'pointer'
		}} onClick={() => {
			if (props.flag == cur_flag) {
				switchFlag(SortFlag.Index);
			} else {
				switchFlag(props.flag);
			}
		}}>⬆</span>
	</div>;
}

export function ArticleList(props: { articles: Article[] }): JSX.Element {
	return <>
		<div style={{
			display: 'grid',
			gridTemplateColumns: '35fr 10fr 10fr 10fr 10fr 10fr 10fr',
		}}>
			<div style={{ textAlign: 'center' }}>標題/作者</div>
			<SortingCell txt='推噓相抵' flag={SortFlag.CleanPush}/>
			<SortingCell txt='總推數' flag={SortFlag.Push}/>
			<SortingCell txt='總噓數' flag={SortFlag.Fuck}/>
			<SortingCell txt='不同帳號推文數' flag={SortFlag.DiffPush}/>
			<SortingCell txt='不同帳號噓文數' flag={SortFlag.DiffFuck}/>
			<SortingCell txt='總留言數' flag={SortFlag.Total}/>
		</div>
		<hr style={{ borderColor: 'gray' }} />
		<div style={{
			display: 'grid',
			gridTemplateColumns: '35fr 10fr 10fr 10fr 10fr 10fr 10fr',
		}}>
			{
				props.articles.map((article, i) => {
					return <SingleArticle key={i} article={article} />;
				})
			}
		</div>
	</>;
}

function ValueDiv(props: { children: ReactNode, flag?: SortFlag }): JSX.Element {
	const { cur_flag } = useContext(FlagContext);
	return <div style={{
		textAlign: 'center',
		borderBottomColor: '#ddd',
		borderBottomStyle: 'solid',
		borderBottomWidth: 1,
		backgroundColor: cur_flag == props.flag ? '#b1d6fc' : 'inherit'
	}}>{props.children}</div>;
}

function SingleArticle(props: { article: Article }): JSX.Element {
	let article = props.article;
	return <>
		<ValueDiv>
			<div><a href={article.url}>{article.title}</a></div>
			<div>{article.author}</div>
		</ValueDiv>
		<ValueDiv flag={SortFlag.CleanPush}>{article.clean_push}</ValueDiv>
		<ValueDiv flag={SortFlag.Push}>{article.push}</ValueDiv>
		<ValueDiv flag={SortFlag.Fuck}>{article.fuck}</ValueDiv>
		<ValueDiv flag={SortFlag.DiffPush}>{article.diff_push}</ValueDiv>
		<ValueDiv flag={SortFlag.DiffFuck}>{article.diff_fuck}</ValueDiv>
		<ValueDiv flag={SortFlag.Total}>{article.total}</ValueDiv>
	</>;
}

function Cell(props: { num: number, getList: () => string[] }): JSX.Element {
	return <div>{props.num}</div>;
}