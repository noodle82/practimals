// Parent-editable example list. These are the only target words in a new profile.
export const SAMPLE_WORDS = [
 ['forgotten','Not remembered.','I had forgotten my lunch.'],
 ['forgetting','Not remembering something.','I keep forgetting where my socks are.'],
 ['gardener','Someone who looks after plants and gardens.','The gardener planted some flowers.'],
 ['gardening','Growing plants and looking after a garden.','We enjoy gardening together.'],
 ['beginner','Someone who is just starting to learn something.','I am a beginner at swimming.'],
 ['beginning','The start of something.','I liked the beginning of the story.'],
 ['prefer','To like one thing more than another.','I prefer apples to pears.'],
 ['preferred','Liked one thing more than another.','She preferred the blue hat.'],
 ['limiting','Keeping the amount or size of something small.','We are limiting our screen time.'],
 ['limited','Only a small amount, number or size.','We have limited space for toys.'],
 ['happiest','Feeling the most happy.','I am happiest when we play together.'],
 ['happier','Feeling more happy.','He felt happier after a hug.'],
 ['benefited','Was helped by something.','The plants benefited from the rain.'],
 ['drizzling','Raining very lightly in tiny drops.','It was drizzling when we went out.'],
 ['multiplying','Finding the total in equal groups, like three groups of two.','We are multiplying numbers at school.']
].map(([word,meaning,sentence])=>({word,meaning,sentence,meaningSource:'Practimals simple glossary'}));
