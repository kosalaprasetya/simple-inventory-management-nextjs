type SortButtonProps = {
  sort: "asc" | "desc";
  onToggle: () => void;
};

export default function SortButton({ sort, onToggle }: SortButtonProps) {
  return (
    <button
      onClick={onToggle}
      className="cursor-pointer rounded-md bg-gray-700 px-3 py-2 text-sm text-white hover:bg-gray-600"
    >
      Sort {sort === "asc" ? "A-Z" : "Z-A"}
    </button>
  );
}
