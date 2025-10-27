export interface QuestionOption {
  text: string;
  type: number;
  emoji: string;
  name: string;
}

export interface Question {
  id: number;
  title: string;
  question: string;
  options: QuestionOption[];
}

export const QUESTIONS: Question[] = [
  {
    id: 1,
    title: '시작 방향성',
    question: '새로운 프로젝트나 일을 시작할 때, 나는 보통 이렇게 행동해요.',
    options: [
      { text: '일의 큰 방향과 목표부터 정리한다.', type: 0, emoji: '🌳', name: '리더형' },
      { text: '일단 해보면서 감을 잡는 편이다.', type: 1, emoji: '🔥', name: '실행형' },
      { text: '계획표와 일정을 세워 두는 게 먼저다.', type: 2, emoji: '🪨', name: '안정형' },
      { text: '정보를 찾아보고 분석하면서 방향을 잡는다.', type: 3, emoji: '⚙️', name: '분석형' },
      { text: '사람들에게 의견을 듣거나 피드백을 받아본다.', type: 4, emoji: '💧', name: '공감형' },
    ]
  },
  {
    id: 2,
    title: '아이디어 접근',
    question: '어떤 아이디어가 떠올랐을 때, 나는 먼저 생각하는 건…',
    options: [
      { text: '이게 장기적으로 어떤 가치가 있을까?', type: 0, emoji: '🌳', name: '리더형' },
      { text: '바로 시도해보면 어떤 결과가 나올까?', type: 1, emoji: '🔥', name: '실행형' },
      { text: '현실적으로 가능할까? 일정이나 리소스는 충분할까?', type: 2, emoji: '🪨', name: '안정형' },
      { text: '근거가 있을까? 데이터로 확인해봐야겠어.', type: 3, emoji: '⚙️', name: '분석형' },
      { text: '사람들이 진짜 좋아할까? 필요한 걸까?', type: 4, emoji: '💧', name: '공감형' },
    ]
  },
  {
    id: 3,
    title: '문제 대응',
    question: '예기치 못한 문제가 생기면, 나는 이렇게 반응해요.',
    options: [
      { text: '팀이나 친구들을 격려하면서 다시 방향을 잡는다.', type: 0, emoji: '🌳', name: '리더형' },
      { text: '바로 행동으로 옮기며 해결책을 찾아본다.', type: 1, emoji: '🔥', name: '실행형' },
      { text: '무엇이 문제인지 정리하고 계획을 다시 세운다.', type: 2, emoji: '🪨', name: '안정형' },
      { text: '데이터나 원인을 분석해 근본적인 이유를 찾는다.', type: 3, emoji: '⚙️', name: '분석형' },
      { text: '관련 사람들과 대화하며 조율하려고 한다.', type: 4, emoji: '💧', name: '공감형' },
    ]
  },
  {
    id: 4,
    title: '의견 조율',
    question: '함께 일하는 사람과 의견이 다를 때, 나는…',
    options: [
      { text: '큰 목표에 맞는 방향으로 가자며 정리한다.', type: 0, emoji: '🌳', name: '리더형' },
      { text: '일단 지금 가능한 방법부터 해보자고 제안한다.', type: 1, emoji: '🔥', name: '실행형' },
      { text: '서로의 입장을 정리해서 중간 지점을 찾자고 한다.', type: 2, emoji: '🪨', name: '안정형' },
      { text: '논리적 근거로 생각을 비교해보자고 한다.', type: 3, emoji: '⚙️', name: '분석형' },
      { text: '상대의 감정을 먼저 이해하려고 한다.', type: 4, emoji: '💧', name: '공감형' },
    ]
  },
  {
    id: 5,
    title: '중요 가치',
    question: '일이 잘 되려면, 가장 중요한 건 뭐라고 생각하나요?',
    options: [
      { text: '명확한 목표와 방향', type: 0, emoji: '🌳', name: '리더형' },
      { text: '빠른 실행과 피드백', type: 1, emoji: '🔥', name: '실행형' },
      { text: '체계적인 계획과 안정감', type: 2, emoji: '🪨', name: '안정형' },
      { text: '데이터와 근거 있는 판단', type: 3, emoji: '⚙️', name: '분석형' },
      { text: '사람과의 공감과 소통', type: 4, emoji: '💧', name: '공감형' },
    ]
  }
];

export const TYPE_NAMES = ['리더형', '실행형', '안정형', '분석형', '공감형'];
export const TYPE_EMOJIS = ['🌳', '🔥', '🪨', '⚙️', '💧'];


