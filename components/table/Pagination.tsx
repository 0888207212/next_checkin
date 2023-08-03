import ReactPaginate from "react-paginate";
import "./style.css";

interface Props {
  totalPage: number;
  changeCurrentPage: (currentPage: number) => void;
}

const Pagination = (props: Props) => {
  const { totalPage, changeCurrentPage } = props;

  const handlePageClick = ({ selected }: any) => {
    const indexPage = selected;
    const currentPage = indexPage + 1;
    changeCurrentPage(currentPage);
  };

  return (
    <ReactPaginate
      previousLabel={"«"}
      nextLabel={"»"}
      pageCount={totalPage}
      onPageChange={handlePageClick}
      containerClassName={"pagination flex items-center justify-center mb-10"}
      previousLinkClassName={
        "flex justify-center items-center w-auto h-[40px] px-2 text-center mx-2 shadow-lg rounded-lg cursor-pointer"
      }
      nextLinkClassName={
        "flex justify-center items-center w-auto h-[40px] px-2 text-center mx-2 shadow-lg rounded-lg cursor-pointer"
      }
      disabledClassName={"pagination__link--disabled"}
      activeClassName={"pagination__link--active"}
    />
  );
};

export default Pagination;
