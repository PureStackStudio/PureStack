import type { CreateSiteResult } from '../../init/create-site'
import { clip, pad, safeText, wrap } from './layout'

export interface CreationOutput {
  write(text: string): unknown
  isTTY?: boolean
  columns?: number
}

type Tone = 'accent' | 'success' | 'warning' | 'error' | 'muted' | 'command'
const colors: Record<Tone, string> = {
  accent: '1;38;2;111;214;228',
  success: '1;38;2;119;224;169',
  warning: '1;38;2;245;200;112',
  error: '1;38;2;255;135;150',
  muted: '38;2;133;155;180',
  command: '1;38;2;193;166;255',
}
const ansiEscape = String.fromCharCode(27)

/** Scrollback output shares Forge's palette, without framing shell commands. */
export class CreationView {
  private readonly columns: number
  private readonly color: boolean

  constructor(output: Pick<CreationOutput, 'columns' | 'isTTY'>) {
    this.columns = Math.max(6, Math.min(88, (output.columns ?? 80) - 1))
    this.color = Boolean(
      output.isTTY &&
        process.env.NO_COLOR === undefined &&
        process.env.FORCE_COLOR !== '0' &&
        process.env.TERM !== 'dumb',
    )
  }

  private paint(text: string, tone: Tone) {
    return this.color
      ? `${ansiEscape}[${colors[tone]}m${text}${ansiEscape}[0m`
      : text
  }

  private frame(heading: string, lines: string[], tone: Tone) {
    const inner = this.columns - 4
    const edge = (text: string) => this.paint(text, 'muted')
    const row = (text: string, headingRow = false) =>
      edge('│ ') +
      (headingRow ? this.paint(pad(text, inner), tone) : pad(text, inner)) +
      edge(' │')
    return [
      edge(`╭${'─'.repeat(this.columns - 2)}╮`),
      ...wrap(heading, inner).map((text) => row(text, true)),
      edge(`├${'─'.repeat(this.columns - 2)}┤`),
      ...lines.flatMap((line) =>
        (line ? wrap(line, inner) : ['']).map((text) => row(text)),
      ),
      edge(`╰${'─'.repeat(this.columns - 2)}╯`),
    ].join('\n')
  }

  start(title: string, directory: string, version: string) {
    return `\n${this.frame(
      '◈ PURESTACK · CREATE SITE',
      [title, '', `Directory  ${directory}`, `PureStack CLI  ${version}`],
      'accent',
    )}\n\n`
  }

  openForge(url: string, cwd: string) {
    return [
      '',
      this.frame(
        '◈ PURESTACK FORGE',
        [
          'Open the link below to configure your new site.',
          `Working folder  ${cwd}`,
          '',
          'Configure your project in the browser.',
          'Press Ctrl+C here to stop Forge.',
        ],
        'accent',
      ),
      '',
      this.paint(`  ${url}`, 'accent'),
      '',
    ].join('\n')
  }

  progress(label: string, symbol: string, tone: Tone) {
    return this.paint(
      clip(`  ${symbol} ${safeText(label)}`, this.columns),
      tone,
    )
  }

  complete(result: CreateSiteResult, commands: string[]) {
    const tone = result.failures.length ? 'warning' : 'success'
    const summary = this.frame(
      result.failures.length
        ? '◇ SITE CREATED · SETUP NEEDS ATTENTION'
        : '✓ YOUR PURESTACK SITE IS READY',
      [
        `Directory  ${result.directory}`,
        `Template   ${result.template}`,
        `PureStack CLI  ${result.version}`,
      ],
      tone,
    )
    const warnings = result.failures.length
      ? `\n\n${this.frame(
          '◇ FINISH SETUP',
          result.failures.flatMap((failure) => failure.split('\n')),
          'warning',
        )}`
      : ''
    const label = clip('  ┌─ NEXT STEPS ', this.columns - 1)
    const section = this.paint(
      `${label}${'─'.repeat(Math.max(0, this.columns - label.length - 1))}┐`,
      'accent',
    )
    return [
      `\n${summary}${warnings}\n`,
      section,
      this.paint('  Copy and run these commands in order:', 'muted'),
      '',
      ...commands.map((command) => this.paint(`  ${command}`, 'command')),
      '',
      this.paint(`  └${'─'.repeat(Math.max(0, this.columns - 4))}┘`, 'accent'),
      '',
      this.paint(
        '  ↳ README.md and AGENTS.md guide your next changes.',
        'muted',
      ),
      '',
    ].join('\n')
  }
}
