export const TOKEN_PREFIX = 'com.merkle.oss.magnolia.headless.';

export const CONTAINER_PROVIDER_TOKEN = token('Container');

export function token(suffix: string): symbol {
	return Symbol(TOKEN_PREFIX + suffix);
}
