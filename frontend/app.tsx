import React from 'react';
import ReactDOM from 'react-dom';
import { startCrawl } from './spider';
import { Article } from './article';
import { ArticleList } from './article_list';
import { SortFlag, sortArticles, FlagContext } from './sort_flag';

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
		width: '100%',
	};
	let [i_board_name, board_name] = useInput('看板名稱', input_style, checkNotEmpty, 'WomenTalk');
	let [i_keyword, keyword] = useInput('關鍵字', input_style, checkNotEmpty, '[活動]');
	let [i_date, date] = useInput('日期 (YYYY/MM/DD)', input_style, checkDate, '2019/7/13');
	let [articles, setArticle] = React.useState<Article[]>([]);
	let [fetching, setFetching] = React.useState(false);
	let [cur_flag, setCurFlag] = React.useState(SortFlag.Index);
	let [log, setLog] = React.useState('');

	function switchFlag(flag: SortFlag): void {
		setCurFlag(flag);
		setArticle(sortArticles(articles, flag));
	}

	function appendLog(s: string): void {
		setLog(prev_log => prev_log + '\n' + s);
	}

	return <div style={{
		height: '100vh',
		width: '100vw',
		display: 'grid',
		gridTemplateColumns: '20vw 80vw',
	}}>
		<div style={{
			display: 'grid',
			borderRightColor: 'gray',
			borderRightStyle: 'solid',
			borderRightWidth: 1,
			gridColumn: '1/2',
			gridTemplateRows: '50vh 50vh',
		}}>
			<div style={{
				paddingLeft: '5%',
				paddingRight: '5%',
				marginTop: 5,
				gridRow: '1/2',
				borderBottomColor: 'gray',
				borderBottomStyle: 'solid',
				borderBottomWidth: 1,
			}}>
				{i_board_name}
				{i_keyword}
				{i_date}
				<button onClick={async () => {
					setFetching(true);
					let res = await startCrawl(board_name, new Date(date), keyword, appendLog);
					setArticle(sortArticles(res, cur_flag));
					setFetching(false);
				}}
				disabled={!checkDate(date) || fetching}>
					開始查詢
				</button>
				<button onClick={() => {
					let txt = articles.map(a => a.stringify(cur_flag));
					setLog(txt.join('\n'));
				}}
				disabled={!checkDate(date) || fetching}>
					轉為文字
				</button>
			</div>
			<pre style={{
				gridRow: '2/3',
				overflowY: 'scroll'
			}}>{log}</pre>
		</div>
		<FlagContext.Provider value={{ cur_flag, switchFlag }}>
			<div style={{
				gridColumnStart: 2,
				gridColumnEnd: 3,
				overflowY: 'scroll'
			}}>
				<ArticleList articles={articles} />
			</div>
		</FlagContext.Provider>
	</div>;
}

ReactDOM.render(
	<App />,
	document.getElementById('root')
);