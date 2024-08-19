const getTimeStamp = (): string => {
    return new Date().toISOString();
};

const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",

    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",

    bgBlack: "\x1b[40m",
    bgRed: "\x1b[41m",
    bgGreen: "\x1b[42m",
    bgYellow: "\x1b[43m",
    bgBlue: "\x1b[44m",
    bgMagenta: "\x1b[45m",
    bgCyan: "\x1b[46m",
    bgWhite: "\x1b[47m",
};

const info = (namespace: string, message: string, object?: any) => {
    const output = `[${getTimeStamp()}] [INFO] [${namespace}] ${message} [${process.env.NODE_ENV}]`;
    if (object) {
        console.log(colors.cyan + output, object, colors.reset);
    } else {
        console.log(colors.cyan + output + colors.reset);
    }
};

const warn = (namespace: string, message: string, object?: any) => {
    const output = `[${getTimeStamp()}] [WARN] [${namespace}] ${message} [${process.env.NODE_ENV}]`;
    if (object) {
        console.warn(colors.bright + colors.yellow + output, object, colors.reset);
    } else {
        console.warn(colors.bright + colors.yellow + output + colors.reset);
    }
};

const error = (namespace: string, message: string, object?: any) => {
    const output = `[${getTimeStamp()}] [ERROR] [${namespace}] ${message} [${process.env.NODE_ENV}]`;
    if (object) {
        console.error(colors.bright + colors.red + output, object, colors.reset);
    } else {
        console.error(colors.bright + colors.red + output + colors.reset);
    }
};

const debug = (namespace: string, message: string, object?: any) => {
    const output = `[${getTimeStamp()}] [DEBUG] [${namespace}] ${message} [${process.env.NODE_ENV}]`;
    if (object) {
        console.debug(colors.bright + colors.magenta + output, object, colors.reset);
    } else {
        console.debug(colors.bright + colors.magenta + output + colors.reset);
    }
};

const success = (namespace: string, message: string, object?: any) => {
    const output = `[${getTimeStamp()}] [SUCCESS] [${namespace}] ${message} [${process.env.NODE_ENV}]`;
    if (object) {
        console.log(colors.bright + colors.green + output, object, colors.reset);
    } else {
        console.log(colors.bright + colors.green + output + colors.reset);
    }
};

const note = (namespace: string, message: string, object?: any) => {
    const output = `[${getTimeStamp()}] [NOTE] [${namespace}] ${message} [${process.env.NODE_ENV}]`;
    if (object) {
        console.log(colors.bright + colors.underscore + colors.magenta + output, object, colors.reset);
    } else {
        console.log(colors.bright + colors.underscore + colors.magenta + output + colors.reset);
    }
};

export default {
    info,
    warn,
    error,
    debug,
    success,
    note
};
