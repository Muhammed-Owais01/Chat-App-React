const getCookie = (name: string) => {
    const value: string = `; ${document.cookie}`;
    const parts: string[] = value.split(`; ${name}=`);
    if (parts.length === 2) {
        const cookiePart = parts.pop();
        if (cookiePart) {
            return cookiePart.split(';').shift(); 
        }
    }
    return null;
}

export default getCookie;