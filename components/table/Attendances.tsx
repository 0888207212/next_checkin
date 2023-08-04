import dayjs from "dayjs";
import Image from "next/image";
import { User } from "@/interfaces/user";
import Pagination from "./Pagination";
import Loading from "../loading";
import { SortDate } from "@/app/checkin-list/page";

interface Props {
  attendances: AttendancesUser<User>[];
  isLoading: boolean;
  totalPage: number;
  currentPage: number;
  sortDate: SortDate;
  handleSortDate: () => void;
  changeCurrentPage: (currentPage: number) => void;
}

interface AttendancesUser<T> {
  check_in_lat?: string;
  check_in_lng?: string;
  check_in_location?: string;
  check_in_time?: string;
  check_out_lat?: string;
  check_out_lng?: string;
  check_out_location?: string;
  check_out_time?: string;
  id: number;
  user: T;
  user_id: number;
  working_time?: string;
}

const TableAttendances = (props: Props) => {
  const {
    attendances,
    isLoading,
    totalPage,
    sortDate,
    handleSortDate,
    changeCurrentPage,
  } = props;

  const convertDateTime = (date?: string, format?: string) => {
    if (!date) return "";

    return dayjs(date).format(format || "HH:mm:ss");
  };

  return (
    <div>
      <div className="mx-auto mb-10 relative min-h-[600px] max-h-[600px] overflow-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="sticky top-0 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th
                scope="col"
                className="px-3 py-3 sm:px-6 sm:py-3 w-[100px] whitespace-nowrap overflow-hidden text-ellipsis"
              >
                <div className="flex items-center gap-2">
                  Ngày
                  <Image
                    src="/sort-date.png"
                    alt="icon-sort"
                    width="10"
                    height="10"
                    className={`cursor-ns-resize ${
                      sortDate === "ASC" && "transform rotate-180"
                    }`}
                    onClick={handleSortDate}
                  />
                </div>
              </th>
              <th
                scope="col"
                className="px-3 py-3 sm:px-6 sm:py-3 w-[100px] whitespace-nowrap overflow-hidden text-ellipsis"
              >
                Tên nhân viên
              </th>
              <th
                scope="col"
                className="px-3 py-3 sm:px-6 sm:py-3 w-[120px] whitespace-nowrap overflow-hidden text-ellipsis"
              >
                ID nhân viên
              </th>
              <th
                scope="col"
                className="px-3 py-3 sm:px-6 sm:py-3 w-[100px] whitespace-nowrap overflow-hidden text-ellipsis"
              >
                Giờ vào
              </th>
              <th
                scope="col"
                className="px-3 py-3 sm:px-6 sm:py-3 w-[100px] whitespace-nowrap overflow-hidden text-ellipsis"
              >
                Địa điểm vào
              </th>
              <th
                scope="col"
                className="px-3 py-3 sm:px-6 sm:py-3 w-[100px] whitespace-nowrap overflow-hidden text-ellipsis"
              >
                Giờ ra
              </th>
              <th
                scope="col"
                className="px-3 py-3 sm:px-6 sm:py-3 w-[100px] whitespace-nowrap overflow-hidden text-ellipsis"
              >
                Địa điểm ra
              </th>
              <th
                scope="col"
                className="px-3 py-3 sm:px-6 sm:py-3 w-[100px] whitespace-nowrap overflow-hidden text-ellipsis"
              >
                Tổng giờ làm
              </th>
              <th
                scope="col"
                className="px-3 py-3 sm:px-6 sm:py-3 w-[100px] whitespace-nowrap overflow-hidden text-ellipsis"
              >
                Trạng thái
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <Loading />}
            {attendances.length > 0 ? (
              attendances.map((item) => (
                <tr
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  key={item.id}
                >
                  <td className="px-3 py-2 sm:px-6 sm:py-4">
                    {convertDateTime(item.check_in_time, "DD/MM/YYYY")}
                  </td>
                  <td className="px-3 py-2 sm:px-6 sm:py-4">
                    {item.user?.full_name}
                  </td>
                  <td className="px-3 py-2 sm:px-6 sm:py-4">
                    {item.user?.code}
                  </td>
                  <td className="px-3 py-2 sm:px-6 sm:py-4">
                    {convertDateTime(item.check_in_time, "")}
                  </td>
                  <td className="px-3 py-2 sm:px-6 sm:py-4">
                    {item.check_in_location}
                  </td>
                  <td className="px-3 py-2 sm:px-6 sm:py-4">
                    {convertDateTime(item.check_out_time, "")}
                  </td>
                  <td className="px-3 py-2 sm:px-6 sm:py-4">
                    {item.check_out_location}
                  </td>
                  <td className="px-3 py-2 sm:px-6 sm:py-4">
                    {item.working_time}
                  </td>
                  <td className="flex items-center px-3 py-2 sm:px-6 sm:py-4 space-x-3"></td>
                </tr>
              ))
            ) : (
              <div className="absolute top-1/2 left-1/2">
                Không có dữ liệu nào
              </div>
            )}
          </tbody>
        </table>
      </div>
      <Pagination totalPage={totalPage} changeCurrentPage={changeCurrentPage} />
    </div>
  );
};

export default TableAttendances;
