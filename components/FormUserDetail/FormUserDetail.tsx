"use client";

import { useAppSelector } from "@/redux/store";
import Image from "next/image";
import apiCompleteProfile from "@/api/complete-profile";
import Loading from "@/components/loading/index";
import { useEffect, useState } from "react";
import { Department } from "@/interfaces/department";
import { useRouter } from "next/navigation";
import avatar from "@/public/avatar.png";

const FormUserDetail = () => {
  const user = useAppSelector((state) => state.authReducer.value);
  const [isLoading, setIsLoading] = useState(false);
  const [department, setDepartment] = useState<Department[]>([]);
  const router = useRouter();

  useEffect(() => {
    getDepartment();
  }, []);

  const handleDepartmentId = (department_id: number | null) => {
    let departmentId = "";
    if (department.length && Array.isArray(department)) {
      department.map((value: any) => {
        if (department_id === value.id) {
          departmentId = value.name;
        } else return "";
      });
      return departmentId;
    }
  };

  const handleDepartmentAddress = (department_id: number | null) => {
    let departmentAddress = "";
    if (department.length && Array.isArray(department)) {
      department.map((value: any) => {
        if (department_id === value.id) {
          departmentAddress = value.address;
        } else return "";
      });
      return departmentAddress;
    }
  };

  const getDepartment = async () => {
    try {
      setIsLoading(true);
      const departments = await apiCompleteProfile.getDepartMent();
      if (departments) {
        setDepartment(departments?.data?.departments);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProfile = () => {
    router.push("/update-profile");
  };

  const cancelForm = (e: any) => {
    e.preventDefault();
    router.push(`/checkin`);
  };

  return (
    <div className="relative 2xl:min-h-[735px] max-h-full overflow-auto pt-8 pb-20 sm:py-12 dark:bg-gray-800 flex flex-col items-center mx-4 sm:mx-auto">
      <div className="container sm:mx-auto flex flex-col justify-start items-start border shadow-lg w-full md:w-1/2 xl:w-1/3 px-10 pt-5 pb-10 rounded-lg bg-[#FAFAFA]">
        <div className="flex w-full justify-end">
          <button onClick={cancelForm}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="w-full flex justify-center items-center">
          <Image
            src={user.user?.avatar_url || `${avatar.src}`}
            alt="avatar-user"
            width="90"
            height="90"
            className="rounded-full border-4"
          />
        </div>
        <div className="flex flex-col py-3 border-b-2 w-full">
          <p className="font-bold">Họ và tên:&nbsp; </p>
          <p className="text-base text-[black]">{user.user?.full_name}</p>
        </div>
        <div className="flex flex-col py-3 border-b-2 w-full">
          <p className="font-bold">Email:&nbsp; </p>
          <p className="text-base text-[black]">{user.user?.email}</p>
        </div>
        <div className="flex flex-col py-3 border-b-2 w-full">
          <p className="font-bold">Mã nhân viên:&nbsp; </p>
          <p className="text-base text-[black]">{user.user?.code}</p>
        </div>
        <div className="flex flex-col py-3 border-b-2 w-full">
          <p className="font-bold">Bộ phận làm việc:&nbsp; </p>
          <p className="text-base text-[black]">{user.user?.center}</p>
        </div>
        <div className="flex flex-col py-3 border-b-2 w-full">
          <p className="font-bold">Nơi làm việc:&nbsp; </p>
          <p className="text-base text-[black]">
            {user && user.user
              ? handleDepartmentId(user.user?.department_id)
              : ""}
          </p>
        </div>
        <div className="flex flex-col py-3 border-b-2 w-full">
          <p className="font-bold">Địa chỉ:&nbsp; </p>
          <p className="text-base text-[black]">
            {" "}
            {user && user.user
              ? handleDepartmentAddress(user.user?.department_id)
              : ""}
          </p>
        </div>
        <div className="w-full flex justify-center items-center pt-10">
          <button
            className="linear flex flex-row items-center rounded-xl text-white transition duration-200 bg-green-500  hover:bg-green-600 active:bg-green-700 dark:bg-green-400 dark:text-white font-bold text-sm sm:text-md px-5 py-3 sm:px-8 sm:py-4"
            onClick={() => handleEditProfile()}
          >
            Sửa thông tin cá nhân
          </button>
        </div>
      </div>
      {isLoading && <Loading />}
    </div>
  );
};

export default FormUserDetail;
