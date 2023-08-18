import { useEffect, useState } from "react";
import Modal from ".";
import apiAttendences from "@/api/attendances";
import { AttendancesUser } from "@/components/table/Attendances";
import Loading from "../loading";
import { User } from "@/interfaces/user";
import { showToastMessage } from "@/utils/helper";

interface Props {
  isShowModal: boolean;
  attendaceSelected?: AttendancesUser<User> | null;
  handleCloseModal: () => void;
  handleNote?: () => void;
}

const ModalNote = ({
  isShowModal,
  attendaceSelected,
  handleCloseModal,
  handleNote,
}: Props) => {
  const [explanationContent, setExplanationContent] = useState("");
  const [errorMes, setErrorMes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isShowModal) return setErrorMes("");
  }, [isShowModal, errorMes]);

  const handleExplanationContent = (e: any) => {
    setExplanationContent(e.target.value);
  };

  const onHandleConfirm = async () => {
    if (!explanationContent) return setErrorMes("Bạn chưa điền đủ thông tin");
    setErrorMes("");

    const id: number = 1
    const payload: any = {
      note: explanationContent,
    };
    try {
      setIsLoading(true);
      const res = await apiAttendences.explainPosition(id, payload);
      if (res.status === 200) {
        setIsLoading(false);
        handleCloseModal();
        setExplanationContent("");
        showToastMessage("Gửi yêu cầu thành công!", "success");
        handleNote && handleNote();
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
      <Modal
        isShowModal={isShowModal}
        handleCloseModal={handleCloseModal}
        onHandleConfirm={onHandleConfirm}
      >
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
            className="flex-1 p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Nội dung giải trình sai vị trí"
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

export default ModalNote;
