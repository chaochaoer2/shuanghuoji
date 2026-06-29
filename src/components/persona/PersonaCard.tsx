import type { PersonaResult } from "../../types";
import { PersonaMascot } from "./PersonaMascot";

type PersonaLike = Pick<PersonaResult, "personaId" | "personaName">;

type Props = {
  persona: PersonaLike;
  compact?: boolean;
  onClick?: () => void;
};

export function PersonaCard({ persona, compact, onClick }: Props) {
  const Wrapper = onClick ? "button" : "article";

  return (
    <Wrapper className={`persona-card image-persona-card${compact ? " persona-card-compact" : ""}`} onClick={onClick as never}>
      <PersonaMascot personaId={persona.personaId} alt={persona.personaName} compact={compact} />
    </Wrapper>
  );
}
