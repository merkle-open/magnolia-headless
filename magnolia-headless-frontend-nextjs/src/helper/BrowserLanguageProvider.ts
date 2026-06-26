import { injectable, inject } from 'tsyringe';
import { Logger } from './Logger.ts';

interface BrowserLanguageRequest {
	headers: Headers;
}

@injectable()
export class BrowserLanguageProvider {
	constructor(@inject(Logger) private readonly logger: Logger) {}

	public getBrowserLanguage(req: BrowserLanguageRequest): string {
		try {
			if (req.headers.has('accept-language')) {
				return this.parseAcceptLanguageHeader(req.headers.get('accept-language'));
			}
		} catch (e) {
			this.logger.debug(`failed to get language! ${e.message}`);
		}
		return 'de';
	}

	private parseAcceptLanguageHeader(value: string): string {
		try {
			this.logger.debug('parsing language from ' + value);
			return /^([^,-]{2}).*$/g.exec(value)[1];
		} catch {
			throw new Error('Failed to parse language from accept-language header ' + value);
		}
	}
}
