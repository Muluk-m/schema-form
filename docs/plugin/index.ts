import path from 'path';
import fs from 'fs';
import MarkdownIt from 'markdown-it';
import container from 'markdown-it-container';
import { docRoot } from '../constants';

export const registerPlugin = (md: MarkdownIt) => {
  md.use(...mdDemoPlugin);
};

const mdDemoPlugin = [
  container,
  'demo',
  {
    validate(params) {
      return !!params.trim().match(/^demo\s*(.*)$/);
    },

    render(tokens, idx) {
      const m = tokens[idx].info.trim().match(/^demo\s*(.*)$/);

      if (tokens[idx].nesting === 1 /* means the tag is opening */) {
        const description = m && m.length > 1 ? m[1] : '';
        const sourceFileToken = tokens[idx + 2];
        let source = '';
        const sourceFile = sourceFileToken.children?.[0].content ?? '';

        if (sourceFileToken.type === 'inline') {
          source = fs.readFileSync(path.resolve(docRoot, 'demo', `${sourceFile}.json`), 'utf-8');
        }

        if (!source) throw new Error(`Incorrect source file: ${sourceFile}`);

        return `<Demo
                  path="${sourceFile}"
                  schema="${encodeURIComponent(source)}"
                  description="${encodeURIComponent(description)}"
                >`;
      }

      return '</Demo>';
    },
  },
] as const;
