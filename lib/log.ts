// lib/logger.ts
type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';

const LOG_LEVELS: Record<LogLevel, number> = {
	debug: 0,
	info: 1,
	warn: 2,
	error: 3,
	silent: 4,
};

const envLevel = (process.env.LOG_LEVEL ||
	(process.env.NODE_ENV === 'development' ? 'debug' : 'info')) as LogLevel;
const currentLevel = LOG_LEVELS[envLevel] ?? LOG_LEVELS.info;

const color = {
	reset: '\x1b[0m',
	dim: '\x1b[2m',
	bright: '\x1b[1m',
	red: '\x1b[31m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
};

function formatLabel(level: LogLevel) {
	switch (level) {
		case 'debug':
			return `${color.blue}[DEBUG] ${color.dim}${color.reset}`;
		case 'info':
			return `${color.green}[INFO] ${color.dim}${color.reset}`;
		case 'warn':
			return `${color.yellow}[WARN] ${color.dim}${color.reset}`;
		case 'error':
			return `${color.red}[ERROR] ${color.dim}${color.reset}`;
		default:
			return `${color.dim}${color.reset}`;
	}
}

export const log = {
	debug: (...args: any[]) => {
		if (currentLevel <= LOG_LEVELS.debug) {
			console.debug(formatLabel('debug'), ...args);
		}
	},
	info: (...args: any[]) => {
		if (currentLevel <= LOG_LEVELS.info) {
			console.info(formatLabel('info'), ...args);
		}
	},
	warn: (...args: any[]) => {
		if (currentLevel <= LOG_LEVELS.warn) {
			console.warn(formatLabel('warn'), ...args);
		}
	},
	error: (...args: any[]) => {
		if (currentLevel <= LOG_LEVELS.error) {
			console.error(formatLabel('error'), ...args);
		}
	},
};
