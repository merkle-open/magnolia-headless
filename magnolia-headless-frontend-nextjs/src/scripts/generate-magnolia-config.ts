import fs from 'fs';
import path from 'path';

interface Template {
	templateId: string;
	file: string;
}

function getAllTemplateJsonFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
	fs.readdirSync(dirPath).forEach(function (file) {
		if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
			arrayOfFiles = getAllTemplateJsonFiles(path.join(dirPath, file).replace(/\\/g, '/'), arrayOfFiles);
		} else {
			arrayOfFiles.push(path.join(dirPath, file).replace(/\\/g, '/'));
		}
	});
	return arrayOfFiles.filter((filePath) => {
		return 'template.json' === path.basename(filePath);
	});
}

function getMapping(magnoliaTemplatesRootDirs: string[], outputDir: string): Map<string, string> {
	const files: string[] = magnoliaTemplatesRootDirs.flatMap((magnoliaTemplatesRootDir) => getAllTemplateJsonFiles(magnoliaTemplatesRootDir, []));
	const mapping = new Map();

	for (const file of files) {
		const template: Template = JSON.parse(fs.readFileSync(file, 'utf8'));
		mapping.set(template.templateId, path.relative(outputDir, file).replace('template.json', template.file).replace(/\\/g, '/'));
	}
	return mapping;
}

function getReferenceName(templatePath: string): string {
	return templatePath.replace(/[\W_]+/g, '_');
}

function writeConfig(mapping: Map<string, string>, file: string): void {
	fs.writeFileSync(file, '//generated - do not edit\n');
	fs.writeFileSync(file, "import { ComponentMappings } from '@magnolia/react-editor';\n");
	mapping.forEach((value) => fs.appendFileSync(file, 'import ' + getReferenceName(value) + " from './" + value + "';\n"));
	fs.appendFileSync(file, '\nexport default function getComponentMappings(): ComponentMappings {\n');
	fs.appendFileSync(file, '	return {\n');
	mapping.forEach((value, key) => fs.appendFileSync(file, "		'" + key + "': " + getReferenceName(value) + ',\n'));
	fs.appendFileSync(file, '	};\n');
	fs.appendFileSync(file, '}\n');
}

try {
	const outputDir = process.argv[2];
	const magnoliaTemplatesRootDirs = process.argv.slice(2);
	writeConfig(getMapping(magnoliaTemplatesRootDirs, outputDir), path.join(outputDir, 'magnolia.config.ts'));
} catch (error) {
	console.error(error);
	process.exit(1);
}
