
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const dataPath = path.join(process.cwd(), 'uploads', 'audios.json');
  let audios = [];
  if (fs.existsSync(dataPath)) {
    audios = JSON.parse(fs.readFileSync(dataPath));
  }
  res.status(200).json(audios);
}
