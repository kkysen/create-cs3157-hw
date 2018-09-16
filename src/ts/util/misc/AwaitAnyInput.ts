export function anyInput(): Promise<void> {
    return new Promise((resolve, reject) => {
        // process.stdin.once("error", reject);
        process.stdin.once("data", resolve);
    });
}