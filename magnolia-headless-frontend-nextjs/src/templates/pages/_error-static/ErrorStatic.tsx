'use client';

import React, { ReactNode } from 'react';
import ErrorStaticProps from './ErrorStaticProps.ts';

export function ErrorStatic({ errorType, language }: ErrorStaticProps): ReactNode {
	const errorMessages = new Map(
		Object.entries({
			en: 'This website is currently not available.',
			de: 'Diese Seite ist momentan nicht verfügbar.',
			fr: "Ce site web n'est actuellement pas disponible.",
			it: 'Questo sito web non è attualmente disponibile.',
		}),
	);

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
