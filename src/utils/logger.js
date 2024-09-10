export default function logger(label) {
    return {
        debug: (message) => console.debug(`[${label}] ${message}`)
    };
}
