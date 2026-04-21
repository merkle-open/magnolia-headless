import React, { ReactNode } from 'react';
import ErrorStaticProps from './ErrorStaticProps.ts';
import { injectable } from 'tsyringe';

@injectable()
export class StaticErrorPage {
	protected errorMessages = new Map(
		Object.entries({
			en: 'This website is currently not available.',
			de: 'Diese Seite ist momentan nicht verfügbar.',
			fr: "Ce site web n'est actuellement pas disponible.",
			it: 'Questo sito web non è attualmente disponibile.',
		}),
	);

	public render({ errorType, language }: ErrorStaticProps): ReactNode {
		const errorMessages = this.errorMessages;
		return (
			<div>
				<main>
					<div>
						<h1>{errorType}</h1>
						<p>{errorMessages.get(language) || errorMessages.get('en')}</p>
					</div>
				</main>
			</div>
		);
	}
}
