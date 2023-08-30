import { useEffect, useState } from "react";
import Modal from ".";
import apiAttendences from "@/api/attendances";
import { AttendancesUser } from "@/components/table/Attendances";
import Loading from "../loading";
import { User } from "@/interfaces/user";
import { showToastMessage } from "@/utils/helper";
import Head from "next/head";

interface Props {
  isShowModal: boolean;
  attendaceSelected?: AttendancesUser<User> | null;
  handleCloseModal: () => void;
  handleExplanation?: () => void;
}

const OPTIONS_REQUEST_TIME = [
  {
    label: "Quên chấm công",
    value: 2,
    selected: true,
  },
  {
    label: "Không làm đủ 8h",
    value: 3,
    selected: false,
  },
  {
    label: "Xin nghỉ",
    value: 1,
    selected: false,
  },
];

const ModalExplanation = ({
  isShowModal,
  attendaceSelected,
  handleCloseModal,
  handleExplanation,
}: Props) => {
  const [explanationSelected, setExplanationSelected] = useState(
    () => OPTIONS_REQUEST_TIME.find((item) => item.selected)?.value
  );
  const [explanationContent, setExplanationContent] = useState("");
  const [errorMes, setErrorMes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isShowModal) return setErrorMes("");
  }, [isShowModal, errorMes]);

  const handleExplanationSelect = (e: any) => {
    setExplanationSelected(e.target.value);
  };

  const handleExplanationContent = (e: any) => {
    e.stopPropagation();
    setExplanationContent(e.target.value);
  };

  const onHandleConfirm = async () => {
    if (!explanationContent) return setErrorMes("Bạn chưa điền đủ thông tin");
    setErrorMes("");

    const payload: any = {
      attendance_id: attendaceSelected?.id,
      request_type: explanationSelected,
      note: explanationContent,
    };
    try {
      setIsLoading(true);
      const res = await apiAttendences.requestTimeUser(payload);
      if (res.status === 200) {
        setIsLoading(false);
        handleCloseModal();
        setExplanationContent("");
        setExplanationSelected(
          () => OPTIONS_REQUEST_TIME.find((item) => item.selected)?.value
        );
        showToastMessage("Gửi yêu cầu thành công!", "success");
        handleExplanation && handleExplanation();
      }
    } catch (error) {
      setIsLoading(false);
      showToastMessage("Gửi yêu cầu thất bại!", "error");
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        ></meta>
      </Head>
      <Modal
        isShowModal={isShowModal}
        handleCloseModal={handleCloseModal}
        onHandleConfirm={onHandleConfirm}
      >
        <div className="flex items-center gap-3">
          <label
            htmlFor="countries"
            className="w-24 mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Cần giải trình
          </label>
          <select
            id="countries"
            className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={explanationSelected}
            onChange={handleExplanationSelect}
          >
            {OPTIONS_REQUEST_TIME.map((option: any) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-3 mt-4">
          <label
            htmlFor="message"
            className="w-24 mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Nội dung giải trình
          </label>
          <textarea
            id="message"
            rows={4}
            className="flex-1 resize-none p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Nội dung giải trình"
            value={explanationContent}
            onChange={handleExplanationContent}
          ></textarea>
        </div>
        {errorMes && (
          <span className="text-red-700 mt-2 font-medium text-sm">
            {errorMes}
          </span>
        )}
      </Modal>
      {isLoading && <Loading />}
    </>
  );
};

export default ModalExplanation;
