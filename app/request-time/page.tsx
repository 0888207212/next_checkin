"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { Select } from "antd";
import apiAttendences from "@/api/attendances";
import TableRequestTimes from "@/components/table/RequestTime";
import { SortDate } from "../checkin-list/page";
import OutsideClickHandler from "react-outside-click-handler";
import apiAuth from "@/api/auth";
import { User } from "@/interfaces/user";
const { Option } = Select;

interface SelectedOptionUser {
  value: number;
  label: string;
}

const SELECTED_ALL = -1;

const RequestTime = () => {
  const [requestTimes, setRequestTimes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [sortDate, setSortDate] = useState<SortDate>("DESC");
  const [filterByMonth, setFilterByMonth] = useState(() =>
    dayjs(new Date()).format("YYYY-MM")
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isShowSearchFilter, setIsShowSearchFilter] = useState(false);
  const [showPopupFilter, setShowFilter] = useState(false);
  const [showPopupStatus, setShowFilterStatus] = useState(false);
  const [listUsers, setListUsers] = useState<User[]>([]);
  const [userSelected, setUserSelected] = useState<number[]>([]);
  const [confirmExplanation, setConfirmExplanation] = useState(0);
  const [listFilterRequestTimes, setListFilterAttendances] = useState([
    {
      text: "Xin nghỉ",
      value: 1,
      key: "request_off",
      isCheck: false,
    },
    {
      text: "Quên chấm công",
      value: 2,
      key: "request_explanation",
      isCheck: false,
    },
    {
      text: "Không làm đủ 8h",
      value: 3,
      key: "request_not_enough_time",
      isCheck: false,
    },
  ]);

  const [listFilterRequestStatus, setListFilterRequestStatus] = useState([
    {
      text: "Chờ phê duyệt",
      value: 1,
      key: "request_pending",
      isCheck: false,
    },
    {
      text: "Đã phê duyệt",
      value: 2,
      key: "request_approved",
      isCheck: false,
    },
    {
      text: "Đã từ chối",
      value: 3,
      key: "request_rejected",
      isCheck: false,
    },
  ]);

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
    (async () => {
      await getListRequestTimesForAdmin();
    })();
  }, [
    currentPage,
    sortDate,
    filterByMonth,
    listFilterRequestTimes,
    listFilterRequestStatus,
    userSelected,
    confirmExplanation,
  ]);

  const getListFilterRequestTimes = useMemo(() => {
    const result: number[] = [];
    listFilterRequestTimes.forEach((item) => {
      if (item.isCheck) result.push(item.value);
    });
    return result;
  }, [listFilterRequestTimes]);

  const getListFilterRequestStatus = useMemo(() => {
    const result: number[] = [];
    listFilterRequestStatus.forEach((item) => {
      if (item.isCheck) result.push(item.value);
    });
    return result;
  }, [listFilterRequestStatus]);

  const listUsersOption: SelectedOptionUser[] = useMemo(() => {
    if (!listUsers.length) return [];
    return listUsers.map((item) => {
      return {
        value: item.id,
        label: item.full_name,
      };
    });
  }, [listUsers]);

  const getListRequestTimesForAdmin = async () => {
    try {
      const params: any = {
        month: filterByMonth,
        order_by_date: sortDate,
        page: currentPage,
      };
      if (userSelected.length > 0) {
        const userIds = userSelected.filter((item) => item !== SELECTED_ALL);
        params.user_ids = userIds.toString();
      }
      if (getListFilterRequestTimes.length > 0) {
        params.request_type = getListFilterRequestTimes.toString();
      }
      if (getListFilterRequestStatus.length > 0) {
        params.request_status = getListFilterRequestStatus.toString();
      }
      setIsLoading(true);
      const response = await apiAttendences.getRequestTimeUser(params);
      if (response.status === 200) {
        setRequestTimes(response.data.request_times || []);
        setTotalPage(response.data.meta.total_pages || 1);
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

  const handleChangeShowFilter = (isShow: boolean) => {
    setIsShowSearchFilter(isShow);
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

  const handleFilterRequestTime = (index: number) => {
    const cloneListFilterRequestTimes = [...listFilterRequestTimes];
    cloneListFilterRequestTimes[index].isCheck =
      !cloneListFilterRequestTimes[index].isCheck;
    setListFilterAttendances(cloneListFilterRequestTimes);
  };

  const handleFilterStatus = (index: number) => {
    const cloneListFilterStatus = [...listFilterRequestStatus];
    cloneListFilterStatus[index].isCheck =
      !cloneListFilterStatus[index].isCheck;
    setListFilterRequestStatus(cloneListFilterStatus);
  };

  const handleExplanation = () => {
    setConfirmExplanation(Math.random());
  };

  return (
    <div className="w-[90%] mx-auto">
      {!isShowSearchFilter && (
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
          <div className="flex items-center justify-between flex-1 mt-4 sm:gap-5 sm:mt-0">
            <div className="flex items-center gap-2 sm:gap-10 justify-between">
              <input
                type="month"
                className="w-[115px] sm:w-full border border-[rgb(107,114,128)] py-1 rounded-md h-10 filter-attendances"
                value={filterByMonth}
                onChange={onHandleChangeMonth}
              />
              <OutsideClickHandler onOutsideClick={() => setShowFilter(false)}>
                <div className="relative">
                  <button
                    className="w-[120px] sm:w-[120px] border border-[rgb(107,114,128)] text-center py-1 cursor-pointer filter-attendances rounded-md h-10 "
                    onClick={() => setShowFilter(!showPopupFilter)}
                  >
                    Loại giải trình
                  </button>
                  {showPopupFilter && (
                    <div className="absolute top-full z-30 bg-white dropdown-menu-filter min-w-[150px] mt-1 rounded-lg">
                      <ul className="py-1">
                        {listFilterRequestTimes.map((item, index) => (
                          <>
                            <li
                              className={`flex items-center gap-3 hover:bg-[#e9ecef] cursor-pointer py-[3px] px-[20px] w-[200px] sm:w-[250px] ${
                                item.isCheck
                                  ? "text-[#333232] font-bold "
                                  : "text-[#4c4c4c]"
                              }`}
                              key={item.value}
                              onClick={() => handleFilterRequestTime(index)}
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
                            {listFilterRequestTimes.length - 1 !== index && (
                              <div className="border-t border-t-[#e9ecef] my-[0.5rem]"></div>
                            )}
                          </>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </OutsideClickHandler>
              <OutsideClickHandler
                onOutsideClick={() => setShowFilterStatus(false)}
              >
                <div className="relative">
                  <button
                    className="w-[100px] sm:w-[100px] border border-[rgb(107,114,128)] text-center py-1 cursor-pointer filter-attendances rounded-md h-10 "
                    onClick={() => setShowFilterStatus(!showPopupStatus)}
                  >
                    Trạng thái
                  </button>
                  {showPopupStatus && (
                    <div className="absolute top-full left-[-99px] md:left-[-150px] xl:left-0 z-30 bg-white dropdown-menu-filter min-w-[120px] mt-1 rounded-lg">
                      <ul className="py-1">
                        {listFilterRequestStatus.map((item, index) => (
                          <>
                            <li
                              className={`flex items-center gap-3 hover:bg-[#e9ecef] cursor-pointer py-[3px] px-[10px] sm:px-[20px] w-[200px] sm:w-[250px] ${
                                item.isCheck
                                  ? "text-[#333232] font-bold "
                                  : "text-[#4c4c4c]"
                              }`}
                              key={item.value}
                              onClick={() => handleFilterStatus(index)}
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
                            {listFilterRequestStatus.length - 1 !== index && (
                              <div className="border-t border-t-[#e9ecef] my-[0.5rem]"></div>
                            )}
                          </>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </OutsideClickHandler>
            </div>
          </div>
        </div>
      )}
      <TableRequestTimes
        isShowSearchFilter={isShowSearchFilter}
        changIsShowSearchFilter={handleChangeShowFilter}
        requestTimes={requestTimes}
        isLoading={isLoading}
        totalPage={totalPage}
        currentPage={currentPage}
        sortDate={sortDate}
        handleSortDate={handleSortDate}
        changeCurrentPage={handleChangeCurrentPage}
        handleExplanation={handleExplanation}
      />
    </div>
  );
};

export default RequestTime;
