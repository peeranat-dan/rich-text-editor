import { Extension } from '@tiptap/core';
import { ReactRenderer } from '@tiptap/react';
import Suggestion from '@tiptap/suggestion';
import tippy, { Instance, type Props as TippyProps } from 'tippy.js';
import { CommandsList } from './commands-list';

export const SlashCommandsExtension = Extension.create({
  name: 'slashCommands',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        allowSpaces: false,
        startOfLine: true,
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
        render: () => {
          let component: ReactRenderer | null = null;
          let popup: Instance<TippyProps>[] | null = null;

          return {
            onStart: (props) => {
              const { editor, clientRect } = props;
              component = new ReactRenderer(CommandsList, {
                props,
                editor: editor,
              });

              popup = tippy('body', {
                getReferenceClientRect: () => clientRect?.() as DOMRect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start',
              });
            },

            onUpdate(props) {
              component?.updateProps(props);

              popup?.[0]?.setProps({
                // @ts-expect-error Tiptap types are not fully compatible with tippy.js
                getReferenceClientRect: props.clientRect,
              });
            },

            onKeyDown(props) {
              if (props.event.key === 'Escape') {
                popup?.[0]?.hide();
                return true;
              }

              // @ts-expect-error Tiptap types are not fully compatible with tippy.js
              return component?.ref?.onKeyDown(props);
            },

            onExit() {
              popup?.[0]?.destroy();
              component?.destroy();
            },
          };
        },
      }),
    ];
  },
});
