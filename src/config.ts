import { parse } from 'query-string'

const query = parse(location.search)

export const isDebug = 'secret_debug_mode' in query
export const isMexico = 'mexico' in query
