interface RequestTimeStatus {
  value: number;
  text: string;
  bgColor: string;
}

interface Props {
  requestTimeStatus: RequestTimeStatus | null;
}

const TableStatus = ({ requestTimeStatus }: Props) => {
  return (
    <>
      {requestTimeStatus?.text && (
        <span
          className={`py-1 px-2 ${requestTimeStatus?.bgColor} rounded-xl text-xs text-[#333333] max-w-max font-medium whitespace-nowrap`}
        >
          {requestTimeStatus?.text}
        </span>
      )}
    </>
  );
};

export default TableStatus;
