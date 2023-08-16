interface Props {
  text?: string;
  classColor?: string;
}

const TableStatus = ({ text, classColor }: Props) => {
  return (
    <span className="py-1 px-2 bg-[#dc354580] rounded-xl text-xs text-[#333333] max-w-max font-medium whitespace-nowrap">
      Cần giải trình
    </span>
  );
};

export default TableStatus;
