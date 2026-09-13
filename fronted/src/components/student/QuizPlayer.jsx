import React, { useState, useEffect } from 'react';
import { quizService } from '../../services/quizService';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import './QuizPlayer.css';

const QuizPlayer = ({ quizId, userId, onComplete }) => {
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState({}); // { questionId: selectedOptionId }
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuiz = async () => {
            setLoading(true);
            setResult(null);
            setAnswers({}); // Reset answers on new quiz
            const data = await quizService.getQuiz(quizId);
            if (data) {
                setQuiz(data);
            } else {
                setError("Failed to load quiz.");
            }
            setLoading(false);
        };
        fetchQuiz();
    }, [quizId]);

    const handleOptionSelect = (questionId, optionId) => {
        if (result) return; // Prevent changing after submission
        setAnswers(prev => ({
            ...prev,
            [questionId]: optionId
        }));
    };

    const handleSubmit = async () => {
        if (Object.keys(answers).length < quiz.questions.length) {
            alert("Please answer all questions before submitting.");
            return;
        }

        const submission = Object.entries(answers).map(([qId, oId]) => ({
            questionId: parseInt(qId),
            selectedOptionId: oId
        }));

        try {
            const res = await quizService.submitQuiz(quizId, userId, submission);
            setResult(res);
            if (res.passed && onComplete) {
                onComplete(res);
            }
        } catch (err) {
            alert("Failed to submit quiz. Please try again.");
        }
    };

    if (loading) return <div className="quiz-loading">Loading quiz...</div>;
    if (error) return <div className="quiz-error">{error}</div>;
    if (!quiz) return null;

    return (
        <div className="quiz-player-container">
            <div className="quiz-header">
                <h2>{quiz.title}</h2>
                <div className="quiz-meta">
                    <span>Passing Score: {quiz.passingScore}%</span>
                    <span>Questions: {quiz.questions.length}</span>
                </div>
            </div>

            {result ? (
                <div className={`quiz-result ${result.passed ? 'passed' : 'failed'}`}>
                    <div className="result-icon">
                        {result.passed ? <CheckCircle size={48} /> : <XCircle size={48} />}
                    </div>
                    <h3>{result.passed ? "Congratulations! You Passed!" : "You didn't pass this time."}</h3>
                    <div className="result-score">
                        Your Score: <strong>{result.score}%</strong>
                    </div>
                    {!result.passed && (
                        <button className="btn-retry" onClick={() => setResult(null)}>Try Again</button>
                    )}
                </div>
            ) : null}

            <div className="quiz-questions">
                {quiz.questions.map((q, index) => (
                    <div key={q.id} className="question-card">
                        <h4 className="question-text">
                            <span className="question-number">{index + 1}.</span> {q.text}
                        </h4>
                        <div className="options-list">
                            {q.options.map((option) => (
                                <div
                                    key={option.id}
                                    className={`option-item ${answers[q.id] === option.id ? 'selected' : ''} ${result ? (option.isCorrect ? 'correct' : (answers[q.id] === option.id ? 'incorrect' : '')) : ''}`}
                                    onClick={() => handleOptionSelect(q.id, option.id)}
                                >
                                    <div className="option-radio"></div>
                                    <span className="option-text">{option.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {!result && (
                <div className="quiz-footer">
                    <button className="btn-submit-quiz" onClick={handleSubmit}>
                        Submit Quiz
                    </button>
                </div>
            )}
        </div>
    );
};

export default QuizPlayer;
