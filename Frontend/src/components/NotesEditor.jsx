export default function NotesEditor({ content, onNoteChange }) {
    return (
        <div className="flex flex-col h-full bg-gray-800 rounded-lg p-4 shadow-inner">
            <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">Shared Notes</h3>
            <textarea
                value={content}
                onChange={(e) => onNoteChange(e.target.value)}
                className="flex-1 w-full bg-gray-700 text-white p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono"
                placeholder="Start typing your shared notes here... Supports Markdown!"
            />
        </div>
    );
}
