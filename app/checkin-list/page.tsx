"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import OutsideClickHandler from "react-outside-click-handler";
import apiAttendences from "@/api/attendances";
import TableAttendances from "@/components/table/Attendances";
import { showToastMessage } from "@/utils/helper";

export type SortDate = "DESC" | "ASC";

const CheckinList = () => {
  const [filterMonth, setFilterMonth] = useState(() =>
    dayjs(new Date()).format("YYYY-MM")
  );
  const [attendances, setAttendances] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [sortDate, setSortDate] = useState<SortDate>("DESC");
  const [isLoading, setIsLoading] = useState(false);
  const [showPopupFilter, setShowFilter] = useState(false);
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
    getListAttendencesUser();
  }, [filterMonth, currentPage, sortDate, listFilterAttendances]);

  const getListFilterAttendences = useMemo(() => {
    const result: number[] = [];
    listFilterAttendances.forEach((item) => {
      if (item.isCheck) result.push(item.value);
    });
    return result;
  }, [listFilterAttendances]);

  const getListAttendencesUser = async () => {
    try {
      const params: any = {
        month: filterMonth,
        page: currentPage,
        checkin_sort: sortDate,
      };

      if (getListFilterAttendences.length > 0) {
        params.filter = getListFilterAttendences.toString();
      }
      setIsLoading(true);
      const response = await apiAttendences.getAttendencesUser(params);
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
    setFilterMonth(month);
  };

  const handleFilterAttendances = (index: number) => {
    const cloneListFilterAttendances = [...listFilterAttendances];
    cloneListFilterAttendances[index].isCheck =
      !cloneListFilterAttendances[index].isCheck;
    setListFilterAttendances(cloneListFilterAttendances);
  };

  const handleDetailAttendances = (id: number) => {
    router.push(`/checkin-list/${id}`);
  };

  return (
    <div className="w-[90%] mx-auto">
      <div className="sm:flex sm:justify-end sm:items-center my-4">
        <div className="sm:flex sm:items-center">
          <OutsideClickHandler onOutsideClick={() => setShowFilter(false)}>
            <div className="relative">
              <button
                className="w-[100px] border border-[#dee2e6] text-center py-1 cursor-pointer filter-attendances mr-40"
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
              value={filterMonth}
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

export default CheckinList;
