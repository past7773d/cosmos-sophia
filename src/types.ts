/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ConceptNode {
  id: string;
  name: string;
  summary: string;
  coordinates: {
    x: number;
    y: number;
  };
  dependencies: string[];
  symbol: string;
}

export interface LessonDiagram {
  formula: string;
  labelX: string;
  labelY: string;
  svgTemplate: "wave" | "orbit" | "grid" | "spiral" | "fractal";
  parameters: {
    name: string;
    value: string;
    desc: string;
  }[];
}

export interface Lesson {
  conceptId: string;
  title: string;
  feynman: string;
  sagan: string;
  believeItOrNot: string;
  solomon: string[];
  diagram: LessonDiagram;
  narration: {
    text: string;
    estimatedDuration: number; // in seconds
  };
}

export interface LessonResponse {
  subject: string;
  nodes: ConceptNode[];
  lessons: Record<string, Lesson>;
}
