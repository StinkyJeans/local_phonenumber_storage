import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'data', 'phoneNumbers.json');

export default function handler(req, res) {
    if (req.method === 'PUT') {
        const { number } = req.body;

        
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).json({ message: 'Error reading file' });
            }

            let phoneNumbers;
            try {
                phoneNumbers = JSON.parse(data);
            } catch (parseError) {
                return res.status(500).json({ message: 'Error parsing file' });
            }

            
            const index = phoneNumbers.findIndex(n => n === number);
            if (index !== -1) {
                phoneNumbers[index] = number;
            } else {
                return res.status(404).json({ message: 'Number not found' });
            }

            
            fs.writeFile(dataPath, JSON.stringify(phoneNumbers), (writeError) => {
                if (writeError) {
                    return res.status(500).json({ message: 'Error writing to file' });
                }

                return res.status(200).json(phoneNumbers);
            });
        });
    } else {
        res.setHeader('Allow', ['PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
