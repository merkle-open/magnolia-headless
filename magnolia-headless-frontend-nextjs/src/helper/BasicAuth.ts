export function createBasicAuthHeader(username: string, password: string): string {
	return `Basic ${btoa(`${username}:${password}`)}`;
}
