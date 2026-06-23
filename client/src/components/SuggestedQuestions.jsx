import React from 'react';

const SuggestedQuestions = ({ onSelectQuestion }) => {
    const suggestions = [
        { label: "👋 Introduce Yourself", text: "Introduce yourself / Who are you?" },
        { label: "💻 Show Projects", text: "What projects have you built?" },
        { label: "🎓 Education", text: "Where do you study and what is your education?" },
        { label: "🧠 Skills", text: "What technologies and skills do you know?" },
        { label: "🏆 Internship", text: "Tell me about your internship experience." },
        { label: "📜 Certificates", text: "Do you have any certificates?" },
        { label: "📄 Resume", text: "Can I download your resume?" },
        { label: "📞 Contact", text: "How can I contact you?" },
        { label: "♟️ Hobbies", text: "What are your hobbies?" },
        { label: "🚀 Future Goals", text: "What are your future goals?" }
    ];

    return (
        <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            margin: '0.75rem 0',
            padding: '0 0.5rem',
            maxHeight: '120px',
            overflowY: 'auto'
        }}>
            {suggestions.map((item, idx) => (
                <button
                    key={idx}
                    onClick={() => onSelectQuestion(item.text)}
                    style={{
                        background: 'rgba(56, 189, 248, 0.1)',
                        border: '1px solid rgba(56, 189, 248, 0.25)',
                        color: 'var(--accent-blue)',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        fontFamily: 'inherit'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(56, 189, 248, 0.2)';
                        e.currentTarget.style.borderColor = 'var(--accent-cyan)';
                        e.currentTarget.style.color = 'var(--accent-cyan)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(56, 189, 248, 0.1)';
                        e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.25)';
                        e.currentTarget.style.color = 'var(--accent-blue)';
                    }}
                >
                    {item.label}
                </button>
            ))}
        </div>
    );
};

export default SuggestedQuestions;
