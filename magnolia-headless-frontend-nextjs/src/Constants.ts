export const TOKEN_PREFIX = 'com.merkle.oss.magnolia.headless.';

export function token(suffix: string): symbol {
	return Symbol(TOKEN_PREFIX + suffix);
}
