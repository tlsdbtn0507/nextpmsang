/**
 * 간단한 마크다운을 HTML로 변환하는 함수
 */

export function markdownToHtml(markdown: string): string {
  let html = markdown;

  // 코드 블록 처리 (```로 감싸진 부분) - 먼저 처리해야 함
  html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-3 rounded-lg overflow-x-auto my-2"><code class="text-sm font-mono">$1</code></pre>');

  // 인라인 코드 처리 (`로 감싸진 부분) - 코드 블록 이후에 처리
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>');

  // 볼드 처리 (**text** 또는 __text__)
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>');
  html = html.replace(/__(.*?)__/g, '<strong class="font-bold">$1</strong>');

  // 이탤릭 처리 (*text* 또는 _text_) - 볼드 이후에 처리
  html = html.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em class="italic">$1</em>');
  html = html.replace(/(?<!_)_([^_]+)_(?!_)/g, '<em class="italic">$1</em>');

  // 링크 처리 [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>');

  // 헤딩 처리 (# ## ###)
  html = html.replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mt-4 mb-2">$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>');

  // 리스트 처리 - 더 정확한 패턴
  const lines = html.split('\n');
  let inList = false;
  let listType = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // 번호 리스트 감지
    if (/^\s*\d+\.\s+/.test(line)) {
      if (!inList || listType !== 'ol') {
        if (inList) lines[i-1] += '</ul>';
        lines[i] = line.replace(/^\s*\d+\.\s+(.*)$/, '<ol class="list-decimal list-inside space-y-1 my-2"><li class="ml-4">$1</li>');
        inList = true;
        listType = 'ol';
      } else {
        lines[i] = line.replace(/^\s*\d+\.\s+(.*)$/, '<li class="ml-4">$1</li>');
      }
    }
    // 불릿 리스트 감지
    else if (/^\s*[-*]\s+/.test(line)) {
      if (!inList || listType !== 'ul') {
        if (inList) lines[i-1] += '</ol>';
        lines[i] = line.replace(/^\s*[-*]\s+(.*)$/, '<ul class="list-disc list-inside space-y-1 my-2"><li class="ml-4">$1</li>');
        inList = true;
        listType = 'ul';
      } else {
        lines[i] = line.replace(/^\s*[-*]\s+(.*)$/, '<li class="ml-4">$1</li>');
      }
    }
    // 빈 줄이면 리스트 종료
    else if (line.trim() === '') {
      if (inList) {
        lines[i-1] += listType === 'ul' ? '</ul>' : '</ol>';
        inList = false;
        listType = '';
      }
    }
    // 일반 텍스트면 리스트 종료
    else {
      if (inList) {
        lines[i-1] += listType === 'ul' ? '</ul>' : '</ol>';
        inList = false;
        listType = '';
      }
    }
  }
  
  // 마지막에 리스트가 열려있으면 닫기
  if (inList) {
    lines[lines.length - 1] += listType === 'ul' ? '</ul>' : '</ol>';
  }
  
  html = lines.join('\n');

  // 줄바꿈 처리
  html = html.replace(/\n\n/g, '<br><br>');
  html = html.replace(/\n/g, '<br>');

  return html;
}
