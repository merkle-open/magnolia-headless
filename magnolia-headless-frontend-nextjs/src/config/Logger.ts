import { token } from '../Constants.ts';

export enum Level {
	DEBUG = 'DEBUG',
	INFO = 'INFO',
	WARN = 'WARN',
	ERROR = 'ERROR',
}

export interface LoggerI {
	log(level: Level, message: string): void;
}
export const LOGGER_TOKEN = token('LoggerI');
