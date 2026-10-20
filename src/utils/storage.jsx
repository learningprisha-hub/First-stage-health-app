const STATE_KEY = 'pip-website-state:v1'
const GEMINI_KEY = 'pip-website-gemini:v1'
const DEFAULT_GEMINI = { apiKey: '', model: 'gemini-2.5-flash' }

export function loadState(uid) {
  try {
    const raw = window.localStorage.getItem(`${STATE_KEY}:${uid}`)
    const parsed = raw ? JSON.parse(raw) : null
    return parsed && typeof parsed === 'object' && Array.isArray(parsed.history) ? parsed : null
  } catch {
    return null
  }
}

export function saveState(uid, state) {
  try {
    window.localStorage.setItem(`${STATE_KEY}:${uid}`, JSON.stringify(state))
  } catch {
    console.warn('could not save data')
  }
}

export function clearState(uid) {
  try {
    window.localStorage.removeItem(`${STATE_KEY}:${uid}`)
  } catch {
    console.warn('could not clear data')
  }
}
export function loadGeminiSettings() {
  try {
    const raw = window.localStorage.getItem(GEMINI_KEY)
    return raw ? { ...DEFAULT_GEMINI, ...JSON.parse(raw) } : DEFAULT_GEMINI
  } catch {
    return DEFAULT_GEMINI
  }
}

export function saveGeminiSettings(settings) {
  try {
    window.localStorage.setItem(GEMINI_KEY, JSON.stringify(settings))
  } catch {
    console.warn('could not save settings')
  }
}