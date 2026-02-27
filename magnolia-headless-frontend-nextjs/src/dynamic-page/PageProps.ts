import { headers } from 'next/headers';
import { injectable } from 'tsyringe';

export type SearchParams = Record<string, string | string[]>;
export interface Params {
	pathname: string[];
}
export default interface PageProps {
	params: Promise<Params>;
	searchParams?: Promise<SearchParams>;
}

@injectable()
export class UrlProvider {
	public async getUrl(props: PageProps): Promise<URL> {
		const headersList = await headers();
		const { pathname } = await props.params;
		const url = new URL(`https://${headersList.get('host')}/${pathname.join('/')}`);
		const queryParams = props ? await props.searchParams : null;
		if (queryParams) {
			url.search = this.toUrlSearchParams(queryParams).toString();
		}
		return url;
	}

	private toUrlSearchParams(searchParams: Record<string, string | string[] | undefined>): URLSearchParams {
		const params = new URLSearchParams();
		Object.entries(searchParams).forEach(([key, value]) => {
			if (!value) {
				return;
			}
			if (Array.isArray(value)) {
				value.forEach((v) => params.append(key, v));
			} else {
				params.append(key, value);
			}
		});
		return params;
	}
}
