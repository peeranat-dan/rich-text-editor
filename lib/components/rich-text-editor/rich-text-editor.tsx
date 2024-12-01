import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { SlashCommandsExtension } from '../../extensions';

const extensions = [StarterKit, SlashCommandsExtension];

const content = '<p>Hello World!</p>';

const RichTextEditor = () => {
  const editor = useEditor({
    extensions,
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none',
      },
    },
  });

  return <EditorContent editor={editor} className="w-full border rounded-md" />;
};

export { RichTextEditor };
