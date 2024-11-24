import {
	BlockTypeSelect,
	BoldItalicUnderlineToggles,
	CreateLink,
	MDXEditor,
	UndoRedo,
	headingsPlugin,
	listsPlugin,
	markdownShortcutPlugin,
	quotePlugin,
	thematicBreakPlugin,
	toolbarPlugin,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

interface MDXEditorProps {
	value: string;
	onChange: (value: string) => void;
}

export function MDXEditorComponent({ value, onChange }: MDXEditorProps) {
	return (
		<div className="prose prose-sm">
			<MDXEditor
				markdown={value}
				onChange={onChange}
				plugins={[
					headingsPlugin(),
					listsPlugin(),
					quotePlugin(),
					thematicBreakPlugin(),
					markdownShortcutPlugin(),
					toolbarPlugin({
						toolbarContents: () => (
							<>
								<UndoRedo />
								<BoldItalicUnderlineToggles />
								<BlockTypeSelect />
								<CreateLink />
							</>
						),
					}),
				]}
				className="w-full min-h-[200px] border rounded-md p-2"
			/>
		</div>
	);
}
