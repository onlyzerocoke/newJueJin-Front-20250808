// quill-emoji.js
import EmojiBlot from './format-emoji-blot';
import ShortNameEmoji from './module-emoji';
import ToolbarEmoji from './module-toolbar-emoji';
import TextAreaEmoji from './module-textarea-emoji';
import './scss/quill-emoji.scss';

// 导出一个注册函数，让外部传入 Quill
export function registerEmoji(Quill) {
  Quill.register({
    'formats/emoji': EmojiBlot,
    'modules/emoji-shortname': ShortNameEmoji,
    'modules/emoji-toolbar': ToolbarEmoji,
    'modules/emoji-textarea': TextAreaEmoji
  }, true);
}

export default { EmojiBlot, ShortNameEmoji, ToolbarEmoji, TextAreaEmoji };
