export function getElapsedTime(createdAt: string | Date): number {
    const createdDate = new Date(createdAt);
    const now = new Date();
    let elapsedTime = now.getTime() - createdDate.getTime();
    elapsedTime = Math.floor(elapsedTime / 1000);

    if (elapsedTime < 60) return elapsedTime;
    else if (elapsedTime < 3600) return Math.floor(elapsedTime / 60);
    else if (elapsedTime < 86400) return Math.floor(elapsedTime / 3600);
    else return Math.floor(elapsedTime / 86400);
}

export function getDateFormat(createdAt: Date | string): string | undefined {
    let formattedDate;
    const date = new Date(createdAt);
    formattedDate = date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
    return formattedDate;
}
