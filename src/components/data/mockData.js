// Mock data helpers: generateMockRecords(count, shape) builds fake rows from a field-type map; fakeFetch(data, delayMs) simulates an async API call.

const WORDS = [
  'alpha', 'bravo', 'charlie', 'delta', 'echo', 'foxtrot', 'golf', 'hotel',
  'india', 'juliet', 'kilo', 'lima', 'mike', 'november', 'oscar', 'papa',
]

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomWord() {
  return WORDS[randomInt(0, WORDS.length - 1)]
}

function randomDate() {
  const start = new Date(2023, 0, 1).getTime()
  const end = Date.now()
  return new Date(start + Math.random() * (end - start)).toISOString().slice(0, 10)
}

const GENERATORS = {
  id: (i) => i + 1,
  uuid: () => crypto.randomUUID(),
  string: () => `${randomWord()} ${randomWord()}`,
  name: () => `${randomWord()} ${randomWord()}`.replace(/\b\w/g, (c) => c.toUpperCase()),
  email: () => `${randomWord()}${randomInt(1, 99)}@example.com`,
  number: () => randomInt(1, 1000),
  boolean: () => Math.random() > 0.5,
  date: randomDate,
}

// shape: { fieldName: typeKeyword | (index) => value }
export function generateMockRecords(count, shape = {}) {
  return Array.from({ length: count }, (_, i) => {
    const record = {}
    for (const [field, spec] of Object.entries(shape)) {
      if (typeof spec === 'function') {
        record[field] = spec(i)
      } else {
        const generator = GENERATORS[spec] ?? GENERATORS.string
        record[field] = generator(i)
      }
    }
    return record
  })
}

// Resolves with `data` after `delayMs`, simulating a network request.
export function fakeFetch(data, delayMs = 600) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delayMs)
  })
}
