const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const loadKnowledgeBase = () => {
    try {
        const knowledgeDir = path.join(__dirname, 'knowledge');
        if (!fs.existsSync(knowledgeDir)) {
            console.warn(`Knowledge directory not found at: ${knowledgeDir}`);
            return '';
        }

        const files = fs.readdirSync(knowledgeDir);
        let consolidatedContext = '';

        files.forEach(file => {
            if (file.endsWith('.md')) {
                const filePath = path.join(knowledgeDir, file);
                const fileContent = fs.readFileSync(filePath, 'utf8');
                const parsed = matter(fileContent);

                const title = parsed.data.title || file.replace('.md', '');
                const content = parsed.content.trim();

                consolidatedContext += `\n--- SECTION: ${title} ---\n${content}\n`;
            }
        });

        return consolidatedContext;
    } catch (error) {
        console.error('Error loading knowledge base:', error);
        return '';
    }
};

module.exports = { loadKnowledgeBase };
