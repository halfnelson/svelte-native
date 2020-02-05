import { isEnabled } from 'tns-core-modules/trace'
export enum LogLevel {
    Debug,
    Info,
    Warn,
    Error
}

type LoggerCallback = (message: string, level: LogLevel) => void

// const nullLogger = () => { };

class Logger {
    onLog: LoggerCallback

    constructor() {
        // this.onLog = () => nullLogger;
    }

    setHandler(logger: LoggerCallback): void {
        this.onLog = logger
    }

    get enabled() {
        return !!this.onLog && isEnabled()
    }

    debug(message: string): void {
        this.onLog && this.onLog(message, LogLevel.Debug);
    }

    info(message: string): void {
        this.onLog && this.onLog(message, LogLevel.Info);
    }

    warn(message: string): void {
        this.onLog && this.onLog(message, LogLevel.Warn);
    }

    error(message: string): void {
        this.onLog && this.onLog(message, LogLevel.Error);
    }
}

export const logger = new Logger();