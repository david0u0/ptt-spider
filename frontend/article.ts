export enum CommentType { Push, Arrow, Fuck }

class Comment {
	constructor(
		public readonly author: string,
		public readonly type: CommentType
	) {}
}

type Dict = { [id: string]: number };

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
	private _push_id_dict: Dict;
	private _fuck_id_dict: Dict;
	private _arrow_id_dict: Dict;
	public get push_id_dict(): Dict { return { ...this._push_id_dict }; }
	public get fuck_id_dict(): Dict { return { ...this._fuck_id_dict }; }
	public get arrow_id_dict(): Dict { return { ...this._arrow_id_dict }; }

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
}