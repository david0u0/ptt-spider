import React from 'react';
import ReactDOM from 'react-dom';
import { startCrawl } from './spider';
import { Article } from './article';
import { ArticleList } from './article_list';

function useInput(
	placeholder: string,
	style: { [name: string]: string }={},
	check: (s: string) => boolean = () => true,
	init_value: string='',
): [JSX.Element, string] {
	let [value, setValue] = React.useState(init_value);
	return [<input
		type='text'
		value={value}
		placeholder={placeholder}
		onChange={evt => {
			setValue(evt.target.value);
		}}
		style={{
			...style,
			boxShadow: check(value) ? 'none' : '0 0 10px red'
		}}
	/>, value];
}
function checkDate(s: string): boolean {
	if (/\d+\/\d+\/\d+/.test(s)) {
		let d = new Date(s);
		if (!isNaN(d.getTime()) && d.getTime() > 1000) {
			return true;
		}
	}
	return false;
}
function checkNotEmpty(s: string): boolean {
	if (s.indexOf(' ') != -1) {
		return false;
	} else {
		return s.length > 0;
	}
}

function App(): JSX.Element {
	let input_style = {
		display: 'block',
		width: '90%',
		marginLeft: 'auto',
		marginRight: 'auto',
	};
	let [i_board_name, board_name] = useInput('看板名稱', input_style, checkNotEmpty, 'WomenTalk');
	let [i_keyword, keyword] = useInput('關鍵字', input_style, checkNotEmpty, '[活動]');
	let [i_date, date] = useInput('日期 (YYYY/MM/DD)', input_style, checkDate, '2019/7/13');
	let [articles, setArticle] = React.useState<Article[]>([]);
	let [fetching, setFetching] = React.useState(false);

	return <div style={{
		height: '100%',
		width: '100%',
		display: 'grid',
		gridTemplateColumns: '20fr 80fr',
	}}>
		<div style={{
			borderRightColor: 'gray',
			borderRightStyle: 'solid',
			borderRightWidth: 1,
			gridColumnStart: 1,
			gridColumnEnd: 2
		}}>
			{i_board_name}
			{i_keyword}
			{i_date}
			<button onClick={async () => {
				setFetching(true);
				let res = await startCrawl(board_name, new Date(date), keyword);
				setArticle(res);
				setFetching(false);
			}} disabled={!checkDate(date) || fetching}>開始查詢</button>
		</div>
		<div style={{
			gridColumnStart: 2,
			gridColumnEnd: 3,
			overflowY: 'scroll'
		}}>
			<ArticleList articles={articles} />
		</div>
	</div>;
}

ReactDOM.render(
	<App />,
	document.getElementById('root')
);