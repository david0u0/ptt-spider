import React, { ReactNode, useContext } from 'react';
import { Article, IdDict } from './article';
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
			gridTemplateColumns: '5fr 35fr 10fr 10fr 10fr 10fr 10fr 10fr',
		}}>
			<div/>
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
			gridTemplateColumns: '5fr 35fr 10fr 10fr 10fr 10fr 10fr 10fr',
		}}>
			{
				props.articles.map((article, i) => {
					return <SingleArticle key={i} index={i} article={article} />;
				})
			}
		</div>
	</>;
}

function ValueDiv(props: {
	children: ReactNode,
	flag?: SortFlag
	getList?: () => IdDict
}): JSX.Element {
	const { cur_flag } = useContext(FlagContext);
	const [expand, setExpand] = React.useState(false);
	return <div style={{
		textAlign: 'center',
		borderBottomColor: '#ddd',
		borderBottomStyle: 'solid',
		borderBottomWidth: 1,
		backgroundColor: cur_flag == props.flag ? '#b1d6fc' : 'inherit'
	}}>
		<span>{props.children}</span>
		{
			(() => {
				if (typeof props.getList != 'undefined') {
					let dict = props.getList();
					if (Object.keys(dict).length == 0) {
						return null;
					} else {
						return <div style={{ position: 'relative' }}>
							<div onClick={() => {
								setExpand(true);
								document.addEventListener('mouseup', () => setExpand(false));
							}} style={{
								cursor: 'pointer',
							}}>
								+
							</div>
							<div style={{
								position: 'absolute',
								borderStyle: 'solid',
								borderColor: 'gray',
								backgroundColor: 'white',
								top: 0,
								padding: 5,
								zIndex: 1,
								visibility: expand ? 'visible' : 'hidden'
							}}>
								{
									Object.keys(dict).map(id => {
										return <div>
											{`${id}:${dict[id]}`}
										</div>;
									})
								}
							</div>
						</div>;
					}
				}
			})()
		}
	</div>;
}

function SingleArticle(props: { article: Article, index: number }): JSX.Element {
	let article = props.article;
	return <>
		<ValueDiv>{props.index + 1}</ValueDiv>
		<ValueDiv>
			<div><a href={article.url}>{article.title}</a></div>
			<div>{article.author}</div>
		</ValueDiv>
		<ValueDiv flag={SortFlag.CleanPush}> {article.clean_push} </ValueDiv>
		<ValueDiv flag={SortFlag.Push} getList={() => article.push_id_dict}>
			{article.push}
		</ValueDiv>
		<ValueDiv flag={SortFlag.Fuck} getList={() => article.fuck_id_dict}>
			{article.fuck}
		</ValueDiv>
		<ValueDiv flag={SortFlag.DiffPush}>{article.diff_push}</ValueDiv>
		<ValueDiv flag={SortFlag.DiffFuck}>{article.diff_fuck}</ValueDiv>
		<ValueDiv flag={SortFlag.Total}>{article.total}</ValueDiv>
	</>;
}