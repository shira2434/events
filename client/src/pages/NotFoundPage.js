import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="not-found">
      <div className="not-found-content">
        <div className="not-found-emoji">🎉</div>
        <h1>404</h1>
        <p>אופס! העמוד שחיפשת לא נמצא</p>
        <Link to="/" className="btn-primary">חזרה לדף הבית</Link>
      </div>
    </div>
  );
}
