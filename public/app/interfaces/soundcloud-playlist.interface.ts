export class ISoundcloudPlaylist {
	public kind: string;
	public id: number;
	public created_at: string;
	public user_id: number;
	public duration: number;
	public sharing: string;
	public tag_list: string;
	public permalink: string;
	public track_count: number;
	public streamable: boolean;
	public downloadable: boolean;
	public embeddable_by: string;
	public purchase_url: string|null;
	public label_id: string|null;
	public type: string;
	public playlist_type: string;
	public ean: string;
	public description: string;
	public genre: string;
	public release: string;
	public purchase_title: string|null;
	public label_name: string;
	public title: string;
	public release_year: string|number|null;
	public release_month: string|number|null;
	public release_day: string|number|null;
	public license: string;
	public uri: string;
	public permalink_url: string;
	public artwork_url: string;
	public user: {
		id: number,
		kind: string,
		permalink: string,
		username: string,
		uri: string,
		permalink_url: string,
		avatar_url: string
	};
	public tracks: any[] = [];
}
