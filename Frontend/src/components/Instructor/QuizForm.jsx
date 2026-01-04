import React, { useState } from 'react';
import { Plus, Trash2, X, CheckCircle } from 'lucide-react';
import './QuizForm.css';

const QuizForm = ({ onSave, onCancel }) => {
    const [title, setTitle] = useState('');
    const [passingScore, setPassingScore] = useState(70);
    const [questions, setQuestions] = useState([
        {
            text: '',
            options: [
                { text: '', isCorrect: true },
                { text: '', isCorrect: false }
            ]
        }
    ]);

    const handleQuestionTextChange = (qIndex, text) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].text = text;
        setQuestions(newQuestions);
    };

    const handleOptionTextChange = (qIndex, oIndex, text) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex].text = text;
        setQuestions(newQuestions);
    };

    const handleCorrectOptionChange = (qIndex, oIndex) => {
        const newQuestions = [...questions];
        // Reset all options to false for this question
        newQuestions[qIndex].options.forEach(o => o.isCorrect = false);
        // Set selected to true
        newQuestions[qIndex].options[oIndex].isCorrect = true;
        setQuestions(newQuestions);
    };

    const addOption = (qIndex) => {
        const newQuestions = [...questions];
        if (newQuestions[qIndex].options.length >= 6) {
            alert("Maximum 6 options allowed per question.");
            return;
        }
        newQuestions[qIndex].options.push({ text: '', isCorrect: false });
        setQuestions(newQuestions);
    };

    const removeOption = (qIndex, oIndex) => {
        const newQuestions = [...questions];
        if (newQuestions[qIndex].options.length <= 2) {
            alert("Minimum 2 options required.");
            return;
        }
        // If removing the correct answer, set the first remaining one as correct
        if (newQuestions[qIndex].options[oIndex].isCorrect) {
            const nextCorrect = oIndex === 0 ? 1 : 0;
            if (newQuestions[qIndex].options[nextCorrect]) {
                newQuestions[qIndex].options[nextCorrect].isCorrect = true;
            }
        }
        newQuestions[qIndex].options.splice(oIndex, 1);
        setQuestions(newQuestions);
    };

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                text: '',
                options: [
                    { text: '', isCorrect: true },
                    { text: '', isCorrect: false }
                ]
            }
        ]);
    };

    const removeQuestion = (qIndex) => {
        if (questions.length <= 1) {
            alert("At least one question is required.");
            return;
        }
        const newQuestions = [...questions];
        newQuestions.splice(qIndex, 1);
        setQuestions(newQuestions);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic Validation
        if (!title.trim()) return alert("Quiz Title is required");
        for (let i = 0; i < questions.length; i++) {
            if (!questions[i].text.trim()) return alert(`Question ${i + 1} text is required`);
            for (let j = 0; j < questions[i].options.length; j++) {
                if (!questions[i].options[j].text.trim()) return alert(`Option ${j + 1} in Question ${i + 1} cannot be empty`);
            }
        }

        const quizData = {
            title,
            passingScore: Number(passingScore),
            questions
        };

        onSave(quizData);
    };

    return (
        <div className="quiz-form-container">
            <div className="quiz-form-header">
                <h3>Create New Quiz</h3>
                <button type="button" onClick={onCancel} className="btn-close"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="quiz-form">
                <div className="form-group-row">
                    <div className="form-group flex-1">
                        <label>Quiz Title</label>
                        <input
                            type="text"
                            className="admin-input"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Chapter 1 Review"
                            autoFocus
                        />
                    </div>
                    <div className="form-group w-100px">
                        <label>Pass Score (%)</label>
                        <input
                            type="number"
                            className="admin-input"
                            value={passingScore}
                            onChange={(e) => setPassingScore(e.target.value)}
                            min="0" max="100"
                        />
                    </div>
                </div>

                <div className="questions-section">
                    <label className="section-label">Questions</label>

                    {questions.map((q, qIndex) => (
                        <div key={qIndex} className="question-block">
                            <div className="question-header">
                                <span className="q-num">Q{qIndex + 1}</span>
                                <input
                                    type="text"
                                    className="question-input"
                                    value={q.text}
                                    onChange={(e) => handleQuestionTextChange(qIndex, e.target.value)}
                                    placeholder="Enter question text..."
                                />
                                <button type="button" className="btn-icon-danger" onClick={() => removeQuestion(qIndex)} title="Remove Question">
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="options-container">
                                {q.options.map((opt, oIndex) => (
                                    <div key={oIndex} className="option-row">
                                        <div
                                            className={`radio-circle ${opt.isCorrect ? 'checked' : ''}`}
                                            onClick={() => handleCorrectOptionChange(qIndex, oIndex)}
                                            title="Mark as correct answer"
                                        >
                                            {opt.isCorrect && <div className="inner-dot"></div>}
                                        </div>
                                        <input
                                            type="text"
                                            className={`option-input ${opt.isCorrect ? 'correct-highlight' : ''}`}
                                            value={opt.text}
                                            onChange={(e) => handleOptionTextChange(qIndex, oIndex, e.target.value)}
                                            placeholder={`Option ${oIndex + 1}`}
                                        />
                                        <button type="button" className="btn-icon-sm" onClick={() => removeOption(qIndex, oIndex)}>
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                                <button type="button" className="btn-text-add" onClick={() => addOption(qIndex)}>
                                    <Plus size={14} /> Add Option
                                </button>
                            </div>
                        </div>
                    ))}

                    <button type="button" className="btn-add-question" onClick={addQuestion}>
                        <Plus size={18} /> Add New Question
                    </button>
                </div>

                <div className="form-actions">
                    <button type="button" className="btn-admin-secondary" onClick={onCancel}>Cancel</button>
                    <button type="submit" className="btn-admin-primary">Save Quiz</button>
                </div>
            </form>
        </div>
    );
};

export default QuizForm;
