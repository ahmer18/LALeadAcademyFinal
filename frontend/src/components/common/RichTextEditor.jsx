// src/components/common/RichTextEditor.jsx
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Underline } from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { TextAlign } from '@tiptap/extension-text-align';
import {
  FaBold, FaItalic, FaUnderline, FaStrikethrough,
  FaListUl, FaListOl, FaQuoteLeft, FaCode,
  FaAlignLeft, FaAlignCenter, FaAlignRight,
  FaHeading, FaEraser
} from 'react-icons/fa';

// Toolbar button helper
const ToolbarBtn = ({ onClick, isActive, title, children }) => (
  <button
    type="button"
    onMouseDown={(e) => { e.preventDefault(); onClick(); }}
    title={title}
    className={`p-1.5 rounded-lg text-sm transition-all duration-300 ${
      isActive
        ? 'bg-[#8d6e3e] text-white shadow-lg shadow-[#8d6e3e]/20'
        : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
    }`}
  >
    {children}
  </button>
);

const Divider = () => <div className="w-px h-5 bg-slate-200 mx-1 self-center" />;

const RichTextEditor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // StarterKit
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[150px] p-4 text-slate-700 leading-relaxed',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="tiptap-wrapper border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm transition-all focus-within:border-[#8d6e3e] focus-within:ring-4 focus-within:ring-[#8d6e3e]/5">
      {/* Toolbar */}
      <div className="bg-slate-50 border-b border-slate-100 p-3 flex flex-wrap items-center gap-1">
        {/* Headings */}
        <ToolbarBtn
          onClick={() => editor.chain().focus().setParagraph().run()}
          isActive={editor.isActive('paragraph')}
          title="Normal text"
        >
          <span className="text-xs font-bold px-1">P</span>
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          <span className="text-xs font-bold px-0.5">H1</span>
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          <span className="text-xs font-bold px-0.5">H2</span>
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          <span className="text-xs font-bold px-0.5">H3</span>
        </ToolbarBtn>

        <Divider />

        {/* Text formatting */}
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold"><FaBold /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic"><FaItalic /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Underline"><FaUnderline /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} title="Strikethrough"><FaStrikethrough /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleCode().run()} isActive={editor.isActive('code')} title="Inline Code"><FaCode /></ToolbarBtn>

        <Divider />

        {/* Lists */}
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet List"><FaListUl /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Numbered List"><FaListOl /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Block Quote"><FaQuoteLeft /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')} title="Code Block"><span className="text-xs font-mono">{`</>`}</span></ToolbarBtn>

        <Divider />

        {/* Alignment */}
        <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} title="Align Left"><FaAlignLeft /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} title="Align Center"><FaAlignCenter /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} title="Align Right"><FaAlignRight /></ToolbarBtn>

        <Divider />

        {/* Clear formatting */}
        <ToolbarBtn onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} isActive={false} title="Clear Formatting"><FaEraser /></ToolbarBtn>
      </div>

      {/* Editor Area */}
      <EditorContent
        editor={editor}
        className="tiptap-editor"
      />
    </div>
  );
};

export default RichTextEditor;
