type PaginationControlsProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationControlsProps) {
  if (totalPages <= 0) return null;

  return (
    <div className="flex items-center justify-between rounded-lg bg-gray-800 p-4">
      <span className="text-sm text-gray-400">
        Page {currentPage} of {totalPages}
      </span>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="cursor-pointer rounded-md bg-gray-700 px-3 py-1 text-sm text-white hover:bg-gray-600 disabled:opacity-40"
        >
          Prev
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="cursor-pointer rounded-md bg-gray-700 px-3 py-1 text-sm text-white hover:bg-gray-600 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
