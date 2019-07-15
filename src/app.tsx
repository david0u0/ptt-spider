import React from 'react';
import ReactDOM from 'react-dom';
import { isNull } from 'util';
import { startQuery } from './spider';

function useInput(
	placeholder: string,
	style: { [name: string]: string }={},
	check: (s: string) => boolean = () => true
): [JSX.Element, string] {
	let [value, setValue] = React.useState('');
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

function App(): JSX.Element {
	function checkDate(s: string): boolean {
		if (/\d+\/\d+\/\d+/.test(s)) {
			let d = new Date(s);
			if (!isNaN(d.getTime()) && d.getTime() > 1000) {
				return true;
			}
		}
		return false;
	}

	let input_style = {
		display: 'block',
		width: '90%',
		marginLeft: 'auto',
		marginRight: 'auto',
	};
	let [i_board_name, board_name] = useInput('看板名稱', input_style);
	let [i_keyword, keyword] = useInput('關鍵字', input_style);
	let [i_date, date] = useInput('日期 (YYYY/MM/DD)', input_style, checkDate);

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
			<button onClick={() => {
				startQuery(board_name, new Date(date), keyword);
			}} disabled={!checkDate(date)}>開始查詢</button>
		</div>
	</div>;
}

ReactDOM.render(
	<App />,
	document.getElementById('root')
);