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
    id: 'makine', label: { en: 'Machine', tr: 'Donanım ve Sistem' },
    items: [
      { name: 'Apple silicon Mac', icon: 'siApple', url: 'https://www.apple.com/mac/', why: { en: 'macOS 26. I stopped caring about this layer.', tr: 'İşletim sistemi katmanında sessiz, kararlı ve yüksek performanslı bir çalışma ortamı sunuyor.' } },
      { name: 'zsh', icon: 'siZsh', url: 'https://www.zsh.org', why: { en: 'The shell. Nothing exotic on top.', tr: 'Gereksiz eklentilerden arındırılmış, sade ve hızlı bir kabuk ortamı.' } },
    ],
  },
  {
    id: 'ajanlar', label: { en: 'Editor and agents', tr: 'Editör ve Ajanlar' },
    items: [
      { name: 'Claude Code', icon: 'siClaude', primary: true, url: 'https://claude.com/claude-code',
        why: { en: 'Where the work actually happens — in the terminal, not the editor.', tr: 'Yazılım geliştirme sürecinin kalbi, işler editörden ziyade doğrudan terminalde ajanlarla yürüyor.' } },
      { name: 'Cursor', icon: 'siCursor', url: 'https://cursor.com', why: { en: 'Open for reading and the occasional hand edit.', tr: 'Kod tabanını genel hatlarıyla incelemek ve hızlı manuel müdahaleler yapmak için.' } },
      { name: 'VS Code', url: 'https://code.visualstudio.com', why: { en: 'Same role as Cursor; the work no longer lives here.', tr: 'Geniş eklenti desteği ve ikincil geliştirme ortamı olarak hazırda duruyor.' } },
    ],
  },
  {
    id: 'terminal', label: { en: 'Terminal', tr: 'Terminal Araçları' },
    items: [
      { name: 'iTerm', icon: 'siIterm2', url: 'https://iterm2.com', why: { en: 'The window everything else runs in.', tr: 'Geliştirme süreçlerinin ve arka plan görevlerinin çalıştığı ana terminal penceresi.' } },
      { name: 'ripgrep', url: 'https://github.com/BurntSushi/ripgrep', why: { en: 'For search.', tr: 'Büyük kod depolarında anında ve hassas metin aramaları yapmak için.' } },
      { name: 'fzf', url: 'https://github.com/junegunn/fzf', why: { en: 'For anything that is a list.', tr: 'Dosya, dal ve komut geçmişi listelerinde bulanık arama ve filtreleme için.' } },
      { name: 'gh', icon: 'siGithub', url: 'https://cli.github.com', why: { en: 'For anything GitHub.', tr: 'GitHub depolarını, issue ve PR akışlarını terminalden yönetmek için.' } },
    ],
  },
  {
    id: 'baska', label: { en: 'Elsewhere', tr: 'Diğer' },
    items: [
      { name: 'Obsidian', icon: 'siObsidian', url: 'https://obsidian.md', why: { en: 'Notes not ready to be public yet.', tr: 'Kişisel araştırmalar ve henüz yayına hazır olmayan ham düşünceler için.' } },
    ],
  },
];
