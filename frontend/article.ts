export enum CommentType { Push, Arrow, Fuck }

class Comment {
	constructor(
		public readonly author: string,
		public readonly type: CommentType
	) {}
}

export class Article {
	private _comments: Comment[];
	public get comment(): Comment[] { return this._comments; }
	constructor(
		public readonly title: string,
		public readonly author: string,
		public readonly date: Date
	) {
		this._comments = [];
	}
	public addComment(author: string, str_type: string): void {
		let type = (() => {
			if (str_type == '推') {
				return CommentType.Push;
			} else if (str_type == '噓') {
				return CommentType.Fuck;
			} else {
				return CommentType.Arrow;
			}
		})();
		this._comments.push(new Comment(author, type));
	}
}