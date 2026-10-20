const ENDPOINT_BASE = 'https://generativelanguage.googleapis.com/v1beta/models'

 const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

const MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash'

const SYSTEM_INSTRUCTION = `You are Pip, a friendly, upbeat health buddy chatting with a child (around 8-12 years old).

Rules you must always follow:

- Use short sentences and simple, warm, encouraging language a child can understand.

- You are NOT a doctor and must never give a diagnosis, medication advice, or dosages.

- Only give general, safe, everyday wellness suggestions (rest, water, telling a grown-up, etc).

- If anything sounds serious, urgent, or you are unsure, tell the child to go find a grown-up or doctor right away.

- Keep replies brief: 2-5 short sentences, plus at most one follow-up question.

- Be kind and never scary, even when telling them to get help.`
export async function askGemini({ apiKey, model, history = [], message, vitals = null }) {

  if (!apiKey) {

    throw new Error('Add your Gemini API key in the Me tab first.')

  }

 

  const vitalsLine = vitals

    ? `\n\nHere is the child's latest check-in data as parameters — use it to personalise your answer:\n` +

      `symptoms: ${vitals.symptoms.length ? vitals.symptoms.join(', ') : 'none'}\n` +

      `mood: ${vitals.mood || 'not given'}\n` +

      `temperature_celsius: ${vitals.temperature}\n` +

      `heart_rate_bpm: ${vitals.heartRate}`

    : ''

 

  const contents = [

    ...history.map((h) => ({ role: h.role, parts: [{ text: h.text }] })),

    { role: 'user', parts: [{ text: message + vitalsLine }] },

  ]

 

  const url = `${ENDPOINT_BASE}/${model}:generateContent`

 

  const res = await fetch(url, {

    method: 'POST',

    headers: {

      'Content-Type': 'application/json',

      'x-goog-api-key': apiKey,

    },

body: JSON.stringify({

      systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },

      contents,

      generationConfig: { temperature: 0.6, maxOutputTokens: 300 },

    }),

  })

 

  if (!res.ok) {

    const errBody = await res.text().catch(() => '')

    throw new Error(`Gemini request failed (${res.status}). ${errBody.slice(0, 200)}`)

  }

 

  const data = await res.json()

  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || ''

  if (!text) throw new Error('Gemini returned an empty response.')

  return text.trim()

}