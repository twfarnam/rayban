import { parse } from 'query-string'

const query = parse(location.search)

export const isDebug = 'secret_debug_mode' in query

export const isMexico =
  'mexico' in query || window.location.hostname == 'theiconseriesmexico.com'

// User-Agent parsing is not the best way to control features but this is only
// used to control whether they are forced to use landscape on their device and
// whether they see the native select box
export const isMobile = /android|iphone|ipad|ipod/i.test(
  window.navigator.userAgent,
)
