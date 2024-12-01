import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { SlashCommandsExtension } from '../../extensions';
import { cn } from '../../utils/cn';

const extensions = [StarterKit, SlashCommandsExtension];

interface RichTextEditorProps {
  content?: string;
  className?: string;
}

const RichTextEditor = ({ content = '', className = 'border rounded-md' }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions,
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none',
      },
    },
  });

  return <EditorContent editor={editor} className={cn('w-full', className)} />;
};

export { RichTextEditor };
