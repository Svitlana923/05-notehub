import ReactPaginate from 'react-paginate';
import css from './Pagination.module.css';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
} 

const Pagination = ({ totalPages, currentPage, onPageChange }: PaginationProps) => {
  return (
    <ReactPaginate
      pageCount={totalPages}
      onPageChange={(event) => onPageChange(event.selected + 1)}
      forcePage={currentPage - 1}
      marginPagesDisplayed={1}
      pageRangeDisplayed={5}
      containerClassName={css.pagination}
      activeClassName={css.active}
      nextLabel="→"
      previousLabel="←"
    />
  )
}
export default Pagination;