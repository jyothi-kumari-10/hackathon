export default function Sidebar({ user, onQuestionClick }) {
  const suggestedQueries = [
    "What's my leave balance?",
    "Who is my manager?",
    "When did I join?",
    "Show my payroll details",
    "What are the company policies?"
  ];

  const handleQuestionClick = (question) => {
    if (onQuestionClick) {
      onQuestionClick(question);
    }
  };

  return (
    <div className="sidebar">
      <div className="user-info">
        <h3>Welcome, {user.name}!</h3>
        <p>{user.email}</p>
        <p>Employee ID: {user.userId}</p>
      </div>

      <div className="suggested-queries">
        <h4>Quick Questions</h4>
        {suggestedQueries.map((query, index) => (
          <button 
            key={index} 
            className="query-button"
            onClick={() => handleQuestionClick(query)}
          >
            {query}
          </button>
        ))}
      </div>
    </div>
  );
}