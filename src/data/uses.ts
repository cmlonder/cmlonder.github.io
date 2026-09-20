import type { Locale } from '../config';

/**
 * /uses araç kutusu — veri olarak.
 *
 * Yöntem anlatısı (AGENTS.md, skill'ler, doğrulama) markdown'da kalıyor;
 * sayfanın fikri o. Araçlar ise liste: kartta bir ad, tek satır neden,
 * varsa bağlantı. Buradaki her şey uses.md'de zaten yazılıydı, yalnızca
 * yapıya döküldü — uydurma araç yok.
 */
/** icon: simple-icons dışa aktarma adı (siClaude gibi). Yoksa monogram. primary: çalışma şeklini değiştiren araç. */
export interface Arac { name: string; why: Record<Locale, string>; url?: string; icon?: string; primary?: boolean }
export interface Grup { id: string; label: Record<Locale, string>; items: Arac[] }

export const USES: Grup[] = [
  {
    id: 'makine', label: { en: 'Machine', tr: 'Makine' },
    items: [
      { name: 'Apple silicon Mac', icon: 'siApple', why: { en: 'macOS 26. I stopped caring about this layer.', tr: 'macOS 26. Bu katmanı umursamayı bıraktım.' } },
      { name: 'zsh', icon: 'siZsh', why: { en: 'The shell. Nothing exotic on top.', tr: 'Kabuk. Üstünde egzotik bir şey yok.' } },
    ],
  },
  {
    id: 'ajanlar', label: { en: 'Editor and agents', tr: 'Editör ve ajanlar' },
    items: [
      { name: 'Claude Code', icon: 'siClaude', primary: true, url: 'https://claude.com/claude-code',
        why: { en: 'Where the work actually happens — in the terminal, not the editor.', tr: 'İşin geçtiği yer — editörde değil, terminalde.' } },
      { name: 'Cursor', icon: 'siCursor', why: { en: 'Open for reading and the occasional hand edit.', tr: 'Okumak ve ara sıra elle düzeltmek için açık.' } },
      { name: 'VS Code', why: { en: 'Same role as Cursor; the work no longer lives here.', tr: 'Cursor ile aynı rol; iş artık burada geçmiyor.' } },
    ],
  },
  {
    id: 'terminal', label: { en: 'Terminal', tr: 'Terminal' },
    items: [
      { name: 'iTerm', icon: 'siIterm2', why: { en: 'The window everything else runs in.', tr: 'Her şeyin içinde koştuğu pencere.' } },
      { name: 'ripgrep', url: 'https://github.com/BurntSushi/ripgrep', why: { en: 'For search.', tr: 'Arama için.' } },
      { name: 'fzf', url: 'https://github.com/junegunn/fzf', why: { en: 'For anything that is a list.', tr: 'Liste olan her şey için.' } },
      { name: 'gh', icon: 'siGithub', url: 'https://cli.github.com', why: { en: 'For anything GitHub.', tr: 'GitHub’la ilgili her şey için.' } },
      { name: 'docker', icon: 'siDocker', why: { en: 'When a dependency insists.', tr: 'Bir bağımlılık ısrar ederse.' } },
    ],
  },
  {
    id: 'calisma-zamani', label: { en: 'Runtime', tr: 'Çalışma zamanı' },
    items: [
      { name: 'Node 22', icon: 'siNodedotjs', why: { en: 'Pinned with packageManager so CI and laptop cannot drift. They did once.', tr: 'packageManager ile sabit — CI ile dizüstü ayrışamasın. Bir kez ayrıştılar.' } },
      { name: 'pnpm', icon: 'siPnpm', url: 'https://pnpm.io', why: { en: 'Version pinned for the same reason.', tr: 'Aynı sebeple sürümü sabit.' } },
    ],
  },
  {
    id: 'baska', label: { en: 'Elsewhere', tr: 'Başka' },
    items: [
      { name: 'Obsidian', icon: 'siObsidian', url: 'https://obsidian.md', why: { en: 'Notes not ready to be public yet.', tr: 'Henüz herkese açık olmaya hazır olmayan notlar.' } },
      { name: 'Notion', icon: 'siNotion', url: 'https://www.notion.so', why: { en: 'Anything someone else needs to read.', tr: 'Başka birinin okuması gereken her şey.' } },
    ],
  },
];
