
import fs from 'fs';
import path from 'path';

const directoryPath = 'c:/Users/SAHIL/OS_prac_help/OS_prac';
const outputPath = 'c:/Users/SAHIL/OS_prac_help/OS_prac_ui/src/data.json';

const stripComments = (code) => {
    // Remove multi-line comments
    code = code.replace(/\/\*[\s\S]*?\*\//g, '');
    // Remove single-line comments (be careful with URLs, but here it's C code)
    code = code.replace(/\/\/.*$/gm, '');
    return code.trim();
};

const files = fs.readdirSync(directoryPath);
const experiments = files.map(file => {
    const content = fs.readFileSync(path.join(directoryPath, file), 'utf8');
    
    // Split into Source and Steps
    let code = "";
    let steps = "";
    
    const sourceIndex = content.indexOf('Source:');
    const stepsIndex = content.indexOf('Steps to run');
    
    if (sourceIndex !== -1 && stepsIndex !== -1) {
        code = content.substring(sourceIndex + 7, stepsIndex).trim();
        steps = content.substring(stepsIndex + 12).trim();
    } else if (sourceIndex !== -1) {
        code = content.substring(sourceIndex + 7).trim();
    } else {
        code = content.trim();
    }
    
    // Clean code (remove comments)
    const cleanCode = stripComments(code);
    
    return {
        title: file.replace('.txt', '').replace('.pdf', ''),
        code: cleanCode,
        steps: steps,
        filename: file
    };
});

fs.writeFileSync(outputPath, JSON.stringify(experiments, null, 2));
console.log('Data generated successfully with separated code and steps');
