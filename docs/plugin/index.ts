import path from 'path'
import fs from 'fs'
import type MarkdownIt from 'markdown-it'
import container from 'markdown-it-container'

const docRoot = path.resolve(__dirname, '..')

export function registerPlugin(md: MarkdownIt) {
  md.use(container, 'demo', {
    validate(params: string) {
      return !!params.trim().match(/^demo\s*(.*)$/)
    },
    render(tokens: any[], idx: number) {
      const m = tokens[idx].info.trim().match(/^demo\s*(.*)$/)
      if (tokens[idx].nesting === 1) {
        const description = m && m.length > 1 ? m[1] : ''
        const sourceFileToken = tokens[idx + 2]
        let source = ''
        const sourceFile = sourceFileToken.children?.[0].content ?? ''
        if (sourceFileToken.type === 'inline') {
          source = fs.readFileSync(path.resolve(docRoot, 'demo', `${sourceFile}.json`), 'utf-8')
        }
        if (!source) throw new Error(`Incorrect source file: ${sourceFile}`)
        return `<Demo path="${sourceFile}" schema="${encodeURIComponent(source)}" description="${encodeURIComponent(description)}">`
      }
      return '</Demo>'
    },
  })
}
