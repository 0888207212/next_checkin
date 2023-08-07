"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { Select } from "antd";
import type { SelectProps } from "antd";
import apiAttendences from "@/api/attendances";
import TableAttendances from "@/components/table/Attendances";
import { SortDate } from "../checkin-list/page";
import OutsideClickHandler from "react-outside-click-handler";
import { showToastMessage } from "@/utils/helper";
import apiAuth from "@/api/auth";
import { User } from "@/interfaces/user";

const CheckinManagement = () => {
  const [attendances, setAttendances] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [sortDate, setSortDate] = useState<SortDate>("DESC");
  const [filterByMonth, setFilterByMonth] = useState(() =>
    dayjs(new Date()).format("YYYY-MM")
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showPopupFilter, setShowFilter] = useState(false);
  const [listUsers, setListUsers] = useState<User[]>([]);
  const [userSelected, setUserSelected] = useState<number[]>([]);
  const [listFilterAttendances, setListFilterAttendances] = useState([
    {
      text: "không check out",
      value: 1,
      key: "check_out_null",
      isCheck: false,
    },
    {
      text: "không checkin, checkout",
      value: 2,
      key: "check_in_null",
      isCheck: false,
    },
    // {
    //   text: "làm dưới 8h",
    //   value: 3,
    //   key: "less_than_eight",
    //   isCheck: false,
    // },
    // {
    //   text: "làm trên 8h",
    //   value: 4,
    //   key: "more_than_eight",
    //   isCheck: false,
    // },
  ]);

  const router = useRouter();

  useEffect(() => {
    (async () => {
      const response = await apiAuth.listUser();
      if (response.status === 200) {
        const listUsers = response.data.users || [];
        setListUsers(listUsers);
        const idsUser = listUsers.map((item: User) => item.id);
        setUserSelected(idsUser);
      }
    })();
  }, []);

  useEffect(() => {
    getListAttendencesManagementForAdmin();
  }, [
    currentPage,
    sortDate,
    filterByMonth,
    listFilterAttendances,
    userSelected,
  ]);

  const getListFilterAttendences = useMemo(() => {
    const result: number[] = [];
    listFilterAttendances.forEach((item) => {
      if (item.isCheck) result.push(item.value);
    });
    return result;
  }, [listFilterAttendances]);

  const listUsersOption = useMemo(() => {
    if (!listUsers.length) return [];
    return listUsers.map((item) => {
      return {
        value: item.id,
        label: item.full_name,
      };
    });
  }, [listUsers]);

  const getListAttendencesManagementForAdmin = async () => {
    try {
      const params: any = {
        month: filterByMonth,
        checkin_sort: sortDate,
        page: currentPage,
        user_id: userSelected.toString(),
      };
      if (getListFilterAttendences.length > 0) {
        params.filter = getListFilterAttendences.toString();
      }
      setIsLoading(true);
      const response = await apiAttendences.getAttendencesManagementForAdmin(
        params
      );
      if (response.status === 200) {
        setAttendances(response.data.attendances || []);
        setTotalPage(response.data.meta.total_pages || 1);
        setIsLoading(false);
      }
    } catch (error: any) {
      console.log("error", error.response);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeCurrentPage = (currentPageValue: number) => {
    setCurrentPage(currentPageValue);
  };

  const handleSortDate = () => {
    if (sortDate === "DESC") {
      setSortDate("ASC");
    } else {
      setSortDate("DESC");
    }
  };

  const onHandleChangeMonth = (event: any) => {
    let month = event.target.value;
    if (!month) {
      month = dayjs(new Date()).format("YYYY-MM");
    }
    setFilterByMonth(month);
  };

  const handleFilterAttendances = (index: number) => {
    const cloneListFilterAttendances = [...listFilterAttendances];
    cloneListFilterAttendances[index].isCheck =
      !cloneListFilterAttendances[index].isCheck;
    setListFilterAttendances(cloneListFilterAttendances);
  };

  const handleExport = async () => {
    try {
      const payload: any = {
        time: filterByMonth,
        user_id: userSelected,
      };
      listFilterAttendances.forEach((item) => {
        payload[item.key] = item.isCheck;
      });
      const response = await apiAttendences.exportExcel(payload);
      if (response.status === 200) {
        // Create a temporary URL to the Blob data
        const url = URL.createObjectURL(response.data);

        // Create a temporary anchor element to trigger the download
        const a = document.createElement("a");
        a.href = url;
        a.download = "Danh sách chấm công.xls"; // Change the filename as needed
        a.click();

        // Clean up the temporary objects
        URL.revokeObjectURL(url);

        showToastMessage("Download file thành công", "success");
      }
    } catch (error) {
      console.log("error", error);
      showToastMessage("Download file thất bại", "error");
    }
  };

  const selectProps: SelectProps = {
    mode: "multiple",
    style: { width: "100%" },
    value: userSelected,
    options: listUsersOption,
    onChange: (newValue: number[]) => {
      setUserSelected(newValue);
    },
    placeholder: "Chọn nhân viên...",
    maxTagCount: "responsive",
  };

  const handleDetailAttendances = (id: number) => {
    router.push(`/checkin-management/${id}`);
  };

  return (
    <div className="w-[90%] mx-auto">
      <div className="sm:flex sm:justify-between sm:items-center my-4">
        <button
          className="bg-[#5D8DA8] hover:bg-[#4e7991] text-white font-bold py-2 px-4 rounded"
          onClick={handleExport}
        >
          Xuất chấm công
        </button>
        <div className="sm:flex sm:items-center">
          <div className="flex items-center justify-between gap-2 my-4">
            <span className="text-sm sm:text-base">Lọc theo member</span>
            <Select {...selectProps} />
          </div>
          <OutsideClickHandler onOutsideClick={() => setShowFilter(false)}>
            <div className="relative">
              <button
                className="w-[100px] border border-[#dee2e6] text-center py-1 cursor-pointer filter-attendances mr-32"
                onClick={() => setShowFilter(!showPopupFilter)}
              >
                Bộ lọc
              </button>
              {showPopupFilter && (
                <div className="absolute top-full z-30 bg-white dropdown-menu-filter min-w-[150px] mt-1">
                  <ul className="py-2">
                    {listFilterAttendances.map((item, index) => (
                      <>
                        <li
                          className={`flex items-center gap-3 hover:bg-[#e9ecef] cursor-pointer py-[3px] px-[20px] ${
                            item.isCheck
                              ? "text-[#333232] font-bold "
                              : "text-[#4c4c4c]"
                          }`}
                          key={item.value}
                          onClick={() => handleFilterAttendances(index)}
                        >
                          <div className="w-[10px]">
                            {item.isCheck && (
                              <Image
                                src="/icon-check.png"
                                alt="icon-check"
                                width="10"
                                height="10"
                              />
                            )}
                          </div>
                          {item.text}
                        </li>
                        {listFilterAttendances.length - 1 !== index && (
                          <div className="border-t border-t-[#e9ecef] my-[0.5rem]"></div>
                        )}
                      </>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </OutsideClickHandler>
          <div className="flex items-center gap-2 mt-4 sm:mt-0">
            <label htmlFor="">Lọc theo tháng: </label>
            <input
              type="month"
              className="border py-1"
              value={filterByMonth}
              onChange={onHandleChangeMonth}
            />
          </div>
        </div>
      </div>
      <TableAttendances
        attendances={attendances}
        isLoading={isLoading}
        totalPage={totalPage}
        currentPage={currentPage}
        sortDate={sortDate}
        handleSortDate={handleSortDate}
        changeCurrentPage={handleChangeCurrentPage}
        handleDetailAttendances={handleDetailAttendances}
      />
    </div>
  );
};

export default CheckinManagement;
