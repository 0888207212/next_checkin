import { UserDetail } from "@/interfaces/user";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import GoogleMaps from "@/components/GoogleMap/GoogleMap";
import { useLocation } from "@/hook/useLocation";
import { GetAllLocation } from "@/interfaces/location";
import Loading from "@/components/loading/index";
import { useEffect, useState } from "react";
import apiLocation from "@/api/geo-location";

const Detail = ({ userAttendance, backRouter }: any) => {
  const { lat, lng } = useLocation();
  const [location, setLocation] = useState<GetAllLocation>();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const convertDateTime = (date?: string, format?: string) => {
    if (!date) return "";

    return dayjs(date).format(format || "HH:mm:ss");
  };
  const handleBackCheckin = () => {
    return router.push(backRouter);
  };

  useEffect(() => {
    if (lat && lng) {
      getLocation();
    }
  }, [lat, lng]);

  const getLocation = async () => {
    const coordinates = {
      lat: lat,
      lng: lng,
    };
    try {
      setIsLoading(true);
      const res = await apiLocation.getLocation(coordinates);
      if (res.status === 200) {
        setLocation(res.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto w-full sm:w-2/3">
      <div className="flex flex-row items-center">
        <button
          className="flex items-center justify-center border rounded w-[50px] my-4 p-1 shadow-sm text-[#757575]  bg-[#ECEFF1] transition duration-200 hover:bg-[#CFD8DC] active:bg-[#CFD8DC] dark:text-white"
          onClick={() => handleBackCheckin()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 sm:w-6 h-4 sm:h-6 "
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>{" "}
        </button>
        <span className="font-medium ml-5 text-xs sm:text-base">{`Chấm công ngày ${convertDateTime(
          userAttendance?.check_in_time || "",
          "DD/MM/YYYY"
        )} - ${userAttendance?.user?.full_name}`}</span>
      </div>

      <GoogleMaps
        lat={location ? location?.lat : ""}
        lng={location ? location?.lon : ""}
        style={
          "w-full h-[600px] sm:h-[600px] md:h-[400px] xl:h-[500px]  2xl:h-[600px] rounded-lg shadow-md z-0 relative mb-4 sm:mb-5"
        }
      />

      <div className="flex flex-col border rounded-md shadow-md">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <table className="min-w-full text-center text-xs sm:text-base font-light">
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
                  <tr className="flex flex-row">
                    <td className=" whitespace-nowrap flex items-start px-3 sm:px-6 py-4 font-medium float-left w-[100px] sm:w-[150px]">
                      Note
                    </td>
                    <td className=" px-6 py-4 float-left font-normal">
                      {userAttendance?.note || ""}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {isLoading && <Loading />}
    </div>
  );
};

export default Detail;
