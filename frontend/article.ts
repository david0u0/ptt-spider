import { SortFlag, getArticleValue } from './sort_flag';

export enum CommentType { Push, Arrow, Fuck }

function stringBytes(c: string): number {
	let n = c.length, s;
	let len = 0;
	for (let i = 0; i < n; i++) {
		s = c.charCodeAt(i);
		while (s > 0) {
			len++;
			s = s >> 8;
		}
	}
	return len;
}
function padString(s: string, max_len: number): string {
	let res = s;
	for (let i = stringBytes(s); i < max_len; i++) {
		res += ' ';
	}
	return res;
}

class Comment {
	constructor(
		public readonly author: string,
		public readonly type: CommentType
	) { }
}

export type IdDict = { [id: string]: number };

export class Article {
	public index: number;

	private _comments: Comment[];
	public get comments(): Comment[] { return this._comments; }

	private _push: number;
	private _fuck: number;
	private _arrow: number;
	public get push(): number { return this._push; }
	public get fuck(): number { return this._fuck; }
	public get arrow(): number { return this._arrow; }
	private _diff_push: number;
	private _diff_fuck: number;
	private _diff_arrow: number;
	public get diff_push(): number { return this._diff_push; }
	public get diff_fuck(): number { return this._diff_fuck; }
	public get diff_arrow(): number { return this._diff_arrow; }
	private _push_id_dict: IdDict;
	private _fuck_id_dict: IdDict;
	private _arrow_id_dict: IdDict;
	public get push_id_dict(): IdDict { return { ...this._push_id_dict }; }
	public get fuck_id_dict(): IdDict { return { ...this._fuck_id_dict }; }
	public get arrow_id_dict(): IdDict { return { ...this._arrow_id_dict }; }

	public get total(): number { return this._push + this._fuck + this._arrow; }
	public get clean_push(): number { return this._push - this._fuck; }

	constructor(
		public readonly url: string,
		public readonly title: string,
		public readonly author: string,
		public readonly date: Date
	) {
		this.index = 0;
		this._comments = [];
		this._push = this._fuck = this._arrow = 0;
		this._diff_push = this._diff_fuck = this._diff_arrow = 0;
		this._push_id_dict = {};
		this._fuck_id_dict = {};
		this._arrow_id_dict = {};
	}
	public addComment(author: string, str_type: string): void {
		let type = (() => {
			if (str_type.startsWith('推')) {
				if (this.push_id_dict[author]) {
					this._push_id_dict[author]++;
				} else {
					this._push_id_dict[author] = 1;
					this._diff_push++;
				}
				this._push++;
				return CommentType.Push;
			} else if (str_type.startsWith('噓')) {
				if (this.fuck_id_dict[author]) {
					this._fuck_id_dict[author]++;
				} else {
					this._fuck_id_dict[author] = 1;
					this._diff_fuck++;
				}
				this._fuck++;
				return CommentType.Fuck;
			} else {
				if (this.arrow_id_dict[author]) {
					this._arrow_id_dict[author]++;
				} else {
					this._arrow_id_dict[author] = 1;
					this._diff_arrow++;
				}
				this._arrow++;
				return CommentType.Arrow;
			}
		})();
		this._comments.push(new Comment(author, type));
	}
	public stringify(flag: SortFlag): string {
		return `${padString(this.author, 15)} ${padString(this.title, 40)} ${getArticleValue(this, flag)}`;
	}
}