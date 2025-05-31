
import fs from 'fs';
import path from 'path';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  const form = formidable({ multiples: false });
  form.parse(req, (err, fields, files) => {
    if (err) {
      res.status(500).json({ error: 'Erro no upload' });
      return;
    }

    const author = fields.author;
    const file = files.audio;

    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

    const newPath = path.join(uploadsDir, file.originalFilename);
    fs.renameSync(file.filepath, newPath);

    const dataPath = path.join(process.cwd(), 'uploads', 'audios.json');
    let audios = [];
    if (fs.existsSync(dataPath)) {
      audios = JSON.parse(fs.readFileSync(dataPath));
    }

    audios.push({
      author,
      url: `/uploads/${file.originalFilename}`
    });

    fs.writeFileSync(dataPath, JSON.stringify(audios));

    res.status(200).json({ message: 'Upload feito com sucesso' });
  });
}
