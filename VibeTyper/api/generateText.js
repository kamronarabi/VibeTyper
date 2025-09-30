export default async function handler(req, res) {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-5-20250929',
          max_tokens: 200,
          messages: [{
            role: 'user',
            content: 'Generate a random 2-3 sentence paragraph for typing practice. Make it interesting and varied. Just return the text, nothing else.'
          }]
        })
      });
  
      const data = await response.json();
      res.status(200).json({ text: data.content[0].text.trim() });
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate text' });
    }
  }