import { Editor } from '@tiptap/core';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { CodeIcon, HeadingIcon, ListBulletIcon, QuoteIcon } from '@radix-ui/react-icons';
import { cn } from '../../utils/cn';

interface SlashCommandListProps {
  editor: Editor;
  query: string;
}

export interface CommandItemProps {
  title: string;
  description: string;
  icon: React.ElementType;
  command: (editor: Editor) => void;
}

export const CommandsList = forwardRef(({ editor, query }: SlashCommandListProps, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Define your commands with Lucide icons
  const commands: CommandItemProps[] = [
    {
      title: 'Heading 1',
      description: 'Large section heading',
      icon: HeadingIcon,
      command: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      title: 'Heading 2',
      description: 'Medium section heading',
      icon: HeadingIcon,
      command: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      title: 'Bullet List',
      description: 'Create a simple bullet list',
      icon: ListBulletIcon,
      command: (editor) => editor.chain().focus().toggleBulletList().run(),
    },
    {
      title: 'Numbered List',
      description: 'Create a numbered list',
      icon: ListBulletIcon,
      command: (editor) => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      title: 'Blockquote',
      description: 'Insert a blockquote',
      icon: QuoteIcon,
      command: (editor) => editor.chain().focus().toggleBlockquote().run(),
    },
    {
      title: 'Code Block',
      description: 'Insert a code block',
      icon: CodeIcon,
      command: (editor) => editor.chain().focus().toggleCodeBlock().run(),
    },
  ];

  // Filter commands based on query
  const filteredCommands = commands.filter((command) =>
    command.title.toLowerCase().includes(query.toLowerCase()),
  );

  const selectCommand = (index: number) => {
    const selectedCommand = filteredCommands[index];

    if (selectedCommand) {
      selectedCommand.command(editor);

      // Close the slash commands popup
      editor.commands.deleteRange({
        from: editor.state.selection.from - query.length - 1,
        to: editor.state.selection.from,
      });
    }
  };

  // Handle keyboard navigation
  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      event.stopPropagation();
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedIndex((prevIndex) => (prevIndex + 1) % filteredCommands.length);
        return true;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : filteredCommands.length - 1,
        );
        return true;
      }

      if (event.key === 'Enter') {
        event.preventDefault();
        selectCommand(selectedIndex);
        return true;
      }

      return false;
    },
  }));

  // Render the commands list with Tailwind CSS
  return (
    <div className="w-72 max-h-96 overflow-y-auto bg-white rounded-lg shadow-xl border border-gray-200 p-1 space-y-1">
      {filteredCommands.length > 0 ? (
        filteredCommands.map((command, index) => {
          const Icon = command.icon;
          return (
            <div
              key={command.title}
              className={cn(
                'flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors duration-100',
                index === selectedIndex ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100',
              )}
              onClick={() => selectCommand(index)}
            >
              <Icon
                className={cn(
                  'w-5 h-5',
                  index === selectedIndex ? 'text-primary/60' : 'text-primary/50',
                )}
              />
              <div className="flex flex-col">
                <span className="font-medium text-sm">{command.title}</span>
                <span className="text-xs text-gray-500">{command.description}</span>
              </div>
            </div>
          );
        })
      ) : (
        <div className="p-4 text-center text-gray-500 text-sm">No commands found</div>
      )}
    </div>
  );
});
