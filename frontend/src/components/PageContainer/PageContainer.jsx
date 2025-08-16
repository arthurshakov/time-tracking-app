export const PageContainer = ({ children, className }) => {
  const combinedClassName = ['page', className].filter(Boolean).join(' ');

  return (
    <main className={combinedClassName}>
      <div className="container page__container">
        {children}
      </div>
    </main>
  );
};
