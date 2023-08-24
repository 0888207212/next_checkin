"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import apiCompleteProfile from "@/api/complete-profile";
import { Department, Departments } from "@/interfaces/profile";
import Loading from "@/components/loading/index";
import { useAppSelector } from "@/redux/store";
import { useRouter } from "next/navigation";

interface FormData {
  full_name: string;
  code: number;
  department_id: number;
  center: string;
}
interface ValueDepartment {
  value: number;
  label: string;
}

interface PropsSubmit {
  handleForm: (value: any) => void;
}

export default function FormUpdateProfile({ handleForm }: PropsSubmit) {
  const user = useAppSelector((state) => state.authReducer.value);
  const [disabled, setDisabled] = useState(true);
  const [optionDepartment, setOptionDepartment] = useState<ValueDepartment[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const schema = yup
    .object()
    .shape({
      full_name: yup
        .string()
        .min(10, "Họ và tên phải lớn hơn 10 kí tự")
        .max(30, "Họ và tên phải nhỏ hơn 30 kí tự")
        .required(),
      code: yup
        .number()
        .typeError("ID nhân viên Không được để trống")
        .min(2, "ID nhân viên phải lớn hơn 2 kí tự")
        .integer("ID nhân viên phải là số nguyên")
        .required(),
      department_id: yup.number().integer().required(),
      center: yup.string().required(),
    })
    .required("Không được để trống");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    getDepartment();
  }, []);

  useEffect(() => {
    if (user && user?.user) {
      setValue("full_name", String(user?.user?.full_name));
      setValue("code", Number(user?.user?.code));
      setValue("department_id", Number(user?.user?.department_id));
      setValue("center", String(user?.user?.center));
    }
  }, [user, optionDepartment]);

  const onSubmit = (data: FormData) => {
    handleForm(data);
  };

  const getDepartment = async () => {
    try {
      setIsLoading(true);
      const departments = await apiCompleteProfile.getDepartMent();
      if (departments) {
        optionSelect(departments?.data?.departments);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const optionSelect = (departments: any) => {
    const result = departments.map((value: Department) => {
      return {
        value: value.id,
        label: value.name,
      };
    });
    setOptionDepartment(result);
  };

  const handleOnChangeName = (e: any) => {
    if (user?.user?.full_name !== e.target.value) {
      setDisabled(false);
    } else return setDisabled(true);
  };

  const handleOnChangeId = (e: any) => {
    if (user?.user?.code !== e.target.value) {
      setDisabled(false);
    } else return setDisabled(true);
  };

  const handleOnChangeCenter = (e: any) => {
    if (user?.user?.center !== e.target.value) {
      setDisabled(false);
    } else return setDisabled(true);
  };

  const handleOnChangeDepartment = (e: any) => {
    if (Number(user?.user?.department_id) !== Number(e.target.value)) {
      setDisabled(false);
    } else return setDisabled(true);
  };

  const cancelForm = (e: any) => {
    e.preventDefault();
    router.push(`/user-detail`);
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit((e) => onSubmit(e))}
        className="flex flex-col pb-12 pt-8 px-5 sm:px-10 border rounded-lg bg-[#FAFAFA] w-[380px] sm:w-[460px] mx-auto my-10 sm:my-16 max-w-screen-xl shadow-lg"
      >
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
        <div className="flex justify-start text-[#00C853] font-bold text-xl sm:text-xl mb-8">
          UPDATE PROFILE
        </div>
        <div className="flex flex-col mb-4 sm:mb-8">
          <label className="text-sm sm:text-md font-bold">Họ và tên</label>
          <input
            className="outline-none p-2 sm:p-2 border mt-2 text-sm sm:text-md"
            type="text"
            placeholder="Họ và tên"
            {...register("full_name")}
            onChange={handleOnChangeName}
          />
          {errors.full_name && (
            <span className="text-[red]">{errors.full_name?.message}</span>
          )}
        </div>
        <div className="flex flex-col mb-4 sm:mb-8">
          <label className="text-sm sm:text-md font-bold">ID nhân viên</label>
          <input
            className="outline-none p1 sm:p-2 border mt-2 text-sm sm:text-md"
            type="number"
            placeholder="ID nhân viên"
            {...register("code")}
            onChange={handleOnChangeId}
          />
          {errors.code && (
            <span className="text-[red]">{errors.code?.message}</span>
          )}
        </div>
        <div className="flex flex-col mb-4 sm:mb-8">
          <label className="text-sm sm:text-md font-bold">Nơi làm việc</label>
          <select
            {...register("department_id")}
            className="outline-none p-2 border mt-2"
            onChange={handleOnChangeDepartment}
          >
            {optionDepartment &&
              optionDepartment.length &&
              Array.isArray(optionDepartment) &&
              optionDepartment.map((value, index) => {
                return (
                  <option value={value?.value} key={index}>
                    {value?.label}
                  </option>
                );
              })}
          </select>
          {errors.department_id && (
            <span className="text-[red]">{errors.department_id?.message}</span>
          )}
        </div>
        <div className="flex flex-col mb-8 sm:mb-16">
          <label className="text-sm sm:text-md font-bold">
            Bộ phận làm việc
          </label>
          <select
            {...register("center")}
            className="outline-none p-2 border mt-2"
            onChange={handleOnChangeCenter}
          >
            <option value="DU10">DU10</option>
            <option value="DU11">DU11</option>
            <option value="DU12">DU12</option>
            <option value="SALE">SALE</option>
            <option value="SAMURAI">SAMURAI</option>
          </select>
          {errors.center && (
            <span className="text-[red]">{errors.center?.message}</span>
          )}
        </div>
        <input
          type="submit"
          className={`p-2 border text-[white] bg-[#66a166]  ${
            disabled ? "cursor-not-allowed" : "hover:bg-[green] cursor-pointer"
          }`}
          disabled={disabled}
        />
      </form>
      {isLoading && <Loading />}
    </div>
  );
}
