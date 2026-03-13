import { inject, injectable } from 'tsyringe';

import { Level, type LoggerI, LOGGER_TOKEN } from '../config/Logger.ts';

@injectable()
export class Logger {
	constructor(@inject(LOGGER_TOKEN) private readonly logger: LoggerI) {}

	public debug(message: string): void {
		this.logger.log(Level.DEBUG, message);
	}
	public info(message: string): void {
		this.logger.log(Level.INFO, message);
	}
	public warn(message: string): void {
		this.logger.log(Level.WARN, message);
	}
	public error(message: string): void {
		this.logger.log(Level.ERROR, message);
	}
}
