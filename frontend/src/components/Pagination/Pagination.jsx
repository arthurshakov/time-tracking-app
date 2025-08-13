import { Link, useLocation } from 'react-router-dom';
import styles from './pagination.module.scss';

export const Pagination = ({currentPage = 1, lastPage = 1}) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // Generate link with preserved url params
  const getPaginatedLink = (page) => {
    searchParams.set('page', page);

    return `${location.pathname}?${searchParams.toString()}`;
  };

  return (
    <div className={styles.pagination}>
      {currentPage > 1 && (
        // <Link to={`?page=${currentPage - 1}`} className={styles.pagination__link}>
        <Link to={getPaginatedLink(currentPage - 1)} className={styles.pagination__link}>
          &lt;&lt;Prev
        </Link>
      )}

      <span className={styles.pagination__info}>
        Page {currentPage} of {lastPage}
      </span>

      {currentPage < lastPage && (
        <Link to={getPaginatedLink(currentPage + 1)} className={styles.pagination__link}>
          Next&gt;&gt;
        </Link>
      )}
    </div>
  );
}

