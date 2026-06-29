import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { evaluatePersona, schoolwalkQuestions, type PersonaAnswers } from "../schoolwalkData";
import type { PersonaResult } from "../types";

type Props = {
  onBack: () => void;
  onDone: (result: PersonaResult) => void;
};

const labels = ["A", "B", "C", "D"];

export function PersonaTest({ onBack, onDone }: Props) {
  const [answers, setAnswers] = useState<PersonaAnswers>({});
  const complete = schoolwalkQuestions.every((question) => answers[question.id] !== undefined);

  return (
    <section className="page test-page">
      <header className="summary-header">
        <div>
          <span>Schoolwalk 人格测试</span>
          <h1>测测你的 Schoolwalk 人格</h1>
          <p>10 个问题，看看你适合哪条校园 Walk 路线。</p>
        </div>
        <button className="icon-button" onClick={onBack} aria-label="返回">
          <ArrowLeft size={20} />
        </button>
      </header>

      <div className="question-list">
        {schoolwalkQuestions.map((question, index) => (
          <article className="question-card" key={question.id}>
            <span>问题 {index + 1}/10</span>
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

      <button className="primary-button full sticky-action" disabled={!complete} onClick={() => onDone(evaluatePersona(answers))}>
        生成人格图鉴
        <ArrowRight size={18} />
      </button>
    </section>
  );
}
