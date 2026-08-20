import DefaultTheme from 'vitepress/theme'
import { enhanceMermaid } from '../../../src/client'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    enhanceMermaid(app)
  },
}
