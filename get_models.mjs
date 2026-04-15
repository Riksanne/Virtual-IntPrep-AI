import "dotenv/config";

async function run() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GOOGLE_GENERATIVE_AI_API_KEY}`);
    const data = await response.json();
    console.log(JSON.stringify(data.models.map(m => m.name)));
  } catch (e) {
    console.error(e);
  }
}
run();
