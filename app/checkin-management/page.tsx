"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { Select } from "antd";
import apiAttendences from "@/api/attendances";
import TableAttendances from "@/components/table/Attendances";
import { SortDate } from "../checkin-list/page";
import OutsideClickHandler from "react-outside-click-handler";
import { showToastMessage } from "@/utils/helper";
import apiAuth from "@/api/auth";
import { User } from "@/interfaces/user";
import { countryZones } from "@/utils/contants";

const { Option } = Select;

interface SelectedOptionUser {
  value: number;
  label: string;
}

const SELECTED_ALL = -1;

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
      text: "Không check out",
      value: 1,
      key: "check_out_null",
      isCheck: false,
    },
    {
      text: "Không checkin, checkout",
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

  const listUsersOption: SelectedOptionUser[] = useMemo(() => {
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
      };
      if (userSelected.length > 0) {
        const userIds = userSelected.filter((item) => item !== SELECTED_ALL);
        params.user_id = userIds.toString();
      }
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
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const countryZone = countryZones.find((item) => item.value === timeZone);
    try {
      const payload: any = {
        time: filterByMonth,
        zone_name: countryZone?.name
      };
      if (userSelected.length > 0) {
        const userIds = userSelected.filter((item) => item !== SELECTED_ALL);
        payload.user_id = userIds;
      }
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
        a.download = "Attendances.xls"; // Change the filename as needed
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

  const handleDetailAttendances = (id: number) => {
    router.push(`/checkin-management/${id}`);
  };

  return (
    <div className="w-[90%] mx-auto">
      <div className="sm:flex sm:gap-10 sm:items-center my-4 lg:h-10">
        <Select
          mode="multiple"
          style={{ width: "100%", height: "100%" }}
          className="filter-attendances"
          maxTagCount="responsive"
          placeholder="Chọn nhân viên..."
          value={userSelected}
          onChange={(newValue: number[]) => {
            if (newValue.length === listUsersOption.length) {
              newValue.push(SELECTED_ALL);
              setUserSelected(newValue);
              return;
            }
            setUserSelected(newValue);
          }}
          onSelect={(value: any) => {
            if (value === SELECTED_ALL) {
              const idsUser = listUsersOption.map((item) => item.value);
              idsUser.push(value);
              setUserSelected(idsUser);
            }
          }}
          onDeselect={(value: number) => {
            if (value === SELECTED_ALL) {
              setUserSelected([]);
            } else if (
              value !== SELECTED_ALL &&
              userSelected.includes(SELECTED_ALL)
            ) {
              const result = userSelected.filter(
                (item) => item !== value && item !== SELECTED_ALL
              );
              setUserSelected(result);
            }
          }}
        >
          <Option value={SELECTED_ALL}>Chọn tất cả</Option>
          {listUsersOption.map((option: any) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
        <div className="flex items-center justify-between flex-1 mt-4 gap-5 sm:mt-0">
          <div className="flex items-center gap-5 sm:gap-10">
            <OutsideClickHandler onOutsideClick={() => setShowFilter(false)}>
              <div className="relative">
                <button
                  className="w-[70px] sm:w-[100px] border border-[rgb(107,114,128)] text-center py-1 cursor-pointer filter-attendances rounded-md h-10"
                  onClick={() => setShowFilter(!showPopupFilter)}
                >
                  Bộ lọc
                </button>
                {showPopupFilter && (
                  <div className="absolute top-full z-30 bg-white dropdown-menu-filter min-w-[150px] mt-1 rounded-lg">
                    <ul className="py-1">
                      {listFilterAttendances.map((item, index) => (
                        <>
                          <li
                            className={`flex items-center gap-3 hover:bg-[#e9ecef] cursor-pointer py-[3px] px-[20px] w-[250px] ${
                              item.isCheck
                                ? "text-[#333232] font-bold "
                                : "text-[#4c4c4c]"
                            }`}
                            key={item.value}
                            onClick={() => handleFilterAttendances(index)}
                          >
                            <div className="min-w-[10px] max-w-[10px]">
                              {item.isCheck && (
                                <Image
                                  src="/icon-check.png"
                                  alt="icon-check"
                                  width="10"
                                  height="10"
                                />
                              )}
                            </div>
                            <span>{item.text}</span>
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
            <input
              type="month"
              className="w-[150px] sm:w-full border border-[rgb(107,114,128)] py-1 rounded-md h-10 filter-attendances"
              value={filterByMonth}
              onChange={onHandleChangeMonth}
            />
          </div>
          <button
            className="bg-[#5D8DA8] hover:bg-[#4e7991] text-white font-bold py-2 px-4 rounded"
            onClick={handleExport}
          >
            Export
          </button>
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
