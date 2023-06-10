
export const emptyFunction = (): void => {}

export const fetcher = async (url: string): Promise<any> => await fetch(url).then(async r => r.ok ? await r.json() : null)
