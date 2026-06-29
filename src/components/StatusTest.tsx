import { ArrowLeft, ArrowRight } from "lucide-react";
import { testQuestions, type TestAnswers } from "../recommendations";
import { useState } from "react";

type Props = {
  onBack: () => void;
  onSubmit: (answers: TestAnswers) => void;
};

const labels = ["A", "B", "C", "D"];

export function StatusTest({ onBack, onSubmit }: Props) {
  const [answers, setAnswers] = useState<TestAnswers>({});
  const complete = testQuestions.every((question) => answers[question.id] !== undefined);

  return (
    <section className="page test-page">
      <header className="summary-header">
        <div>
          <span>今日爽活状态测试</span>
          <h1>测测你今天适合哪条 Walk</h1>
          <p>用 5 个问题，帮你找到今天最适合的校园路线。</p>
        </div>
        <button className="icon-button" onClick={onBack} aria-label="返回首页">
          <ArrowLeft size={20} />
        </button>
      </header>

      <div className="question-list">
        {testQuestions.map((question, questionIndex) => (
          <article className="question-card" key={question.id}>
            <span>问题 {questionIndex + 1}/5</span>
            <h2>{question.title}</h2>
            <div className="answer-list">
              {question.options.map((option, optionIndex) => (
                <button
                  className={answers[question.id] === optionIndex ? "active" : ""}
                  key={option}
                  onClick={() => setAnswers((current) => ({ ...current, [question.id]: optionIndex }))}
                >
                  <strong>{labels[optionIndex]}</strong>
                  {option}
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>

      <button className="primary-button full sticky-action" disabled={!complete} onClick={() => onSubmit(answers)}>
        查看今日推荐
        <ArrowRight size={18} />
      </button>
    </section>
  );
}
