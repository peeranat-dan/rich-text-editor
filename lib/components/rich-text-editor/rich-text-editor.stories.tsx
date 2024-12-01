import type { Meta, StoryObj } from '@storybook/react';

import { RichTextEditor } from './rich-text-editor';

const meta = {
  title: 'Components/RichTextEditor',
  component: RichTextEditor,
} satisfies Meta<typeof RichTextEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
