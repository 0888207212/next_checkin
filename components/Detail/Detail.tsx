import { UserDetail } from "@/interfaces/user";
import dayjs from "dayjs";

const Detail = ({ userAttendance }: any) => {
  const convertDateTime = (date?: string, format?: string) => {
    if (!date) return "";

    return dayjs(date).format(format || "HH:mm:ss");
  };

  return (
    <div className="container mx-auto w-full sm:w-2/3">
      <div className="flex flex-col border rounded-md shadow-md">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <table className="min-w-full text-center text-xs sm:text-sm font-light">
                <tbody>
                  <tr>
                    <td className="flex items-start px-3 sm:px-6 py-4 font-medium float-left w-[100px] sm:w-[150px]">
                      Nhân viên
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 float-left font-normal">
                      {userAttendance?.user?.full_name}
                    </td>
                  </tr>
                  <tr>
                    <td className="flex items-start px-3 sm:px-6 py-4 font-medium float-left w-[100px] sm:w-[150px]">
                      Bộ phận
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 float-left font-normal">
                      {userAttendance?.user?.center}
                    </td>
                  </tr>
                  <tr>
                    <td className="flex items-start px-3 sm:px-6 py-4 font-medium float-left w-[100px] sm:w-[150px]">
                      ID
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 float-left font-normal">
                      {userAttendance?.user?.code}
                    </td>
                  </tr>
                  <tr>
                    <td className="flex items-start px-3 sm:px-6 py-4 font-medium float-left w-[100px] sm:w-[150px]">
                      Giờ vào
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 float-left font-normal">
                      {convertDateTime(userAttendance?.check_in_time || "")}
                    </td>
                  </tr>
                  <tr>
                    <td className="flex items-start px-3 sm:px-6 py-4 font-medium float-left w-[100px] sm:w-[150px]">
                      Giờ ra
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 float-left font-normal">
                      {convertDateTime(userAttendance?.check_out_time || "")}
                    </td>
                  </tr>
                  <tr className="flex flex-row">
                    <td className="whitespace-nowrap flex items-start px-3 sm:px-6 py-4 font-medium float-left w-[100px] sm:w-[150px]">
                      Vị trí check in
                    </td>
                    <td className=" px-6 py-4 float-left font-normal">
                      {userAttendance?.check_in_location || ""}
                    </td>
                  </tr>
                  <tr className="flex flex-row">
                    <td className=" whitespace-nowrap flex items-start px-3 sm:px-6 py-4 font-medium float-left w-[100px] sm:w-[150px]">
                      Vị trí check out
                    </td>
                    <td className=" px-6 py-4 float-left font-normal">
                      {userAttendance?.check_out_location || ""}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
