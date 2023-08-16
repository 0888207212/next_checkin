import Image from "next/image";
import styles from "./styles.module.css";

interface Props {
  isShowModal: boolean;
  width?: string | number;
  height?: string | number;
  titleHeader?: string;
  children: React.ReactNode;
  handleCloseModal: () => void;
  onHandleConfirm: () => void;
}

const Modal = ({
  isShowModal,
  width,
  height,
  titleHeader,
  children,
  handleCloseModal,
  onHandleConfirm,
}: Props) => {
  return (
    <>
      {isShowModal && (
        <div className={styles.modalBackDrop}>
          <div className={styles.modalContainer} style={{ width, height }}>
            <div className={styles.modalHeader}>
              <span>{titleHeader || "Giải trình chấm công"}</span>
              <Image
                src="/icon-close.png"
                alt="icon-close"
                width="20"
                height="10"
                className="cursor-pointer opacity-50 hover:opacity-100 w-5 h-5"
                onClick={handleCloseModal}
              />
            </div>
            <div className={styles.modalBody}>{children}</div>
            <div className={styles.modalFooter}>
              <button
                className="bg-[#5D8DA8] text-white px-2 py-1 hover:bg-[#4e7991]"
                onClick={onHandleConfirm}
              >
                Xác nhận
              </button>
              <button
                className="bg-white text-black px-2 py-1 border border-[#dee2e6]"
                onClick={handleCloseModal}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
