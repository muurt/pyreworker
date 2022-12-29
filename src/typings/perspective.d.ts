/**
 * The type of score.
 * @typedef {'PROBABILIY'} ScoreType
 */
export type ScoreType = "PROBABILIY";

/**
 * The short code for a language.
 * @typedef {'en' | 'es' | 'fr' | 'de' | 'pt' | 'it' | 'ru'} LanguageShort
 */
export type LanguageShort = "en" | "es" | "fr" | "de" | "pt" | "it" | "ru";

/**
 * The perspective attribute to analyze.
 * @typedef {'TOXICITY' | 'SEVERE_TOXICITY' | 'IDENTITY_ATTACK' | 'INSULT' | 'PROFANITY' | 'THREAT' | 'SEXUALLY_EXPLICIT' | 'FLIRTATION' | 'INCOHERENT' | 'SPAM'} PerspectiveAttribute
 */
export type PerspectiveAttribute =
  | "TOXICITY"
  | "SEVERE_TOXICITY"
  | "IDENTITY_ATTACK"
  | "INSULT"
  | "PROFANITY"
  | "THREAT"
  | "SEXUALLY_EXPLICIT"
  | "FLIRTATION"
  | "INCOHERENT"
  | "SPAM";

/**
 * The score for a given attribute.
 * @interface Score
 */
export interface Score {
  /**
   * The value of the score.
   * @type {number}
   */
  value: number;
  /**
   * The type of score.
   * @type {ScoreType}
   */
  type: ScoreType;
}

/**
 * The score for a given span of text.
 * @interface SpanScore
 */
export interface SpanScore {
  /**
   * The beginning index of the span.
   * @type {number}
   */
  begin: number;
  /**
   * The ending index of the span.
   * @type {number}
   */
  end: number;
  /**
   * The score for the span.
   * @type {Score}
   */
  score: Score;
}

/**
 * The scores for a given attribute.
 * @interface Scores
 */
export interface Scores {
  /**
   * The span scores for the attribute.
   * @type {SpanScore[]}
   */
  spanScores: SpanScore[];
  /**
   * The summary score for the attribute.
   * @type {Score}
   */
  summaryScore: Score;
}

/**
 * The scores for all attributes.
 * @interface AttributeScores
 */
export interface AttributeScores {
  /**
   * The scores for the INSULT attribute.
   * @type {Scores}
   */
  INSULT: Scores;
  /**
   * The scores for the PROFANITY attribute.
   * @type {Scores}
   */
  PROFANITY: Scores;
  /**
   * The scores for the THREAT attribute.
   * @type {Scores}
   */
  THREAT: Scores;
  /**
   * The scores for the SPAM attribute.
   * @type {Scores}
   */
  SPAM: Scores;
  /**
   * The scores for the INCOHERENT attribute.
   * @type {Scores}
   */
  INCOHERENT: Scores;
  /**
   * The scores for the IDENTITY_ATTACK attribute.
   * @type {Scores}
   */
  IDENTITY_ATTACK: Scores;
  /**
   * The scores for the TOXICITY attribute.
   * @type {Scores}
   */
  TOXICITY: Scores;
  /**
   * The scores for the SEVERE_TOXICITY attribute.
   * @type {Scores}
   */
  SEVERE_TOXICITY: Scores;
  /**
   * The scores for the FLIRTATION attribute.
   * @type {Scores}
   */
  FLIRTATION: Scores;
  /**
   * The scores for the SEXUALLY_EXPLICIT attribute.
   * @type {Scores}
   */
  SEXUALLY_EXPLICIT: Scores;
}

/**
 * The response data from the Perspective API.
 * @interface PerspectiveResponseData
 */
export interface PerspectiveResponseData {
  /**
   * The scores for all attributes.
   * @type {AttributeScores}
   */
  attributeScores: AttributeScores;
  /**
   * The list of languages that the text can be analyzed in.
   * @type {LanguageShort[]}
   */
  languages: LanguageShort[];
  /**
   * The list of languages that the text was detected to be in.
   * @type {LanguageShort[]}
   */
  detectedLanguages: LanguageShort[];
}

/**
 * The response from the Perspective API.
 * @interface PerspectiveResponse
 */
export interface PerspectiveResponse {
  /**
   * The response data.
   * @type {PerspectiveResponseData}
   */
  data: PerspectiveResponseData;
}
