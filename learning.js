export const WORDS = {
  cat: { meaning: 'A small furry animal that says meow.', sentence: 'The cat curled up on the rug.' },
  sun: { meaning: 'The star that gives our world light and warmth.', sentence: 'The sun shone over the garden.' },
  dog: { meaning: 'An animal often kept as a pet that barks.', sentence: 'Our dog loves going for walks.' },
  rain: { meaning: 'Drops of water that fall from clouds.', sentence: 'The rain made little puddles.' },
  ship: { meaning: 'A large boat that carries people or things.', sentence: 'The ship sailed across the sea.' },
  bright: { meaning: 'Giving out lots of light, or full of light.', sentence: 'The bright star lit up the sky.' },
  garden: { meaning: 'A place where people grow flowers, vegetables or other plants.', sentence: 'We planted seeds in the garden.' },
  gentle: { meaning: 'Careful and kind, without being rough.', sentence: 'Be gentle when you stroke the kitten.' },
  curious: { meaning: 'Wanting to find out more about something.', sentence: 'The curious rabbit peeked inside the box.' },
  enormous: { meaning: 'Very, very big.', sentence: 'An enormous elephant walked past.' },
  adventure: { meaning: 'An exciting experience or journey.', sentence: 'Our woodland walk became an adventure.' },
  together: { meaning: 'With someone else, rather than alone.', sentence: 'We built the den together.' },
  discover: { meaning: 'To find or learn something you did not know before.', sentence: 'I hope we discover a new path.' },
  cheerful: { meaning: 'Feeling happy or showing happiness.', sentence: 'Her cheerful smile made me smile too.' },
  favourite: { meaning: 'The one you like best.', sentence: 'Purple is my favourite colour.' },
  beautiful: { meaning: 'Lovely to look at, hear or experience.', sentence: 'The butterfly had beautiful wings.' },
  because: { meaning: 'A word that tells us the reason for something.', sentence: 'I wore boots because it was muddy.' },
  different: { meaning: 'Not the same as something else.', sentence: 'We each chose a different colour.' },
  friend: { meaning: 'Someone you like and enjoy spending time with.', sentence: 'My friend helped me build a tower.' },
  school: { meaning: 'A place where children learn together.', sentence: 'We read a funny story at school.' }
};
export const localDay = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
export function cleanWords(text) {
  return [...new Set(text.split(/[\n,;]+/).map(x => x.trim().toLowerCase()).filter(x => /^[a-z]+(?:[-'][a-z]+)*$/.test(x)))].slice(0,20);
}
export function normaliseTables(values) {
  return [...new Set(values.map(Number).filter(x => Number.isInteger(x) && x >= 1 && x <= 12))].sort((a,b) => a-b);
}
export function practiceWords(words, cursor = 0, count = 3) {
  if (!words.length) return [];
  const start = ((cursor % words.length) + words.length) % words.length;
  return Array.from({length:Math.min(count,words.length)},(_,i)=>words[(start+i)%words.length]);
}
export function makeQuestions(tables, count = 5, random = Math.random) {
  const selected = normaliseTables(tables);
  if (!selected.length) return [];
  const pool = selected.flatMap(a => Array.from({ length:12 }, (_, i) => ({ a, b:i+1, answer:a*(i+1) })));
  for (let i=pool.length-1; i>0; i--) { const j = Math.floor(random()*(i+1)); [pool[i],pool[j]] = [pool[j],pool[i]]; }
  return pool.slice(0,count);
}
export function awardActivity(profile, activity, day = localDay()) {
  if (!['spelling','tables','creative'].includes(activity)) throw new Error('Unknown activity');
  const current = profile.days[day] || [];
  if (current.includes(activity)) return { earned:0, bonus:0 };
  profile.days[day] = [...current,activity];
  const bonus = profile.days[day].length === 3 ? 15 : 0;
  profile.stars += 10 + bonus;
  return { earned:10,bonus };
}
export function hasWord(sentence, word) {
  return sentence.toLowerCase().split(/[^a-z'-]+/).includes(word.toLowerCase());
}
