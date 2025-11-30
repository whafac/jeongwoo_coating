# Google NotebookLM 챗봇 통합 가이드

## 개요
정우코팅 사이트에 Google NotebookLM에서 생성한 챗봇을 통합하는 방법입니다.

## 설정 방법

### 1. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
NEXT_PUBLIC_NOTEBOOKLM_URL=https://notebooklm.google.com/your-notebook-url
```

**중요**: 
- `NEXT_PUBLIC_` 접두사가 필요합니다 (클라이언트 컴포넌트에서 접근 가능하도록)
- Google NotebookLM에서 공유 링크를 복사하여 URL에 입력하세요

### 2. Google NotebookLM 링크 가져오기

1. Google NotebookLM에서 챗봇을 생성합니다
2. 공유 설정에서 "웹에 공개" 또는 "임베드 가능" 옵션을 활성화합니다
3. 공유 링크를 복사합니다
4. 링크를 `.env.local` 파일의 `NEXT_PUBLIC_NOTEBOOKLM_URL`에 입력합니다

### 3. 배포 시 환경 변수 설정

#### Vercel 배포 시:
1. Vercel 대시보드로 이동
2. 프로젝트 설정 > Environment Variables
3. `NEXT_PUBLIC_NOTEBOOKLM_URL` 변수 추가
4. 값에 NotebookLM 링크 입력
5. 재배포

#### 다른 플랫폼:
해당 플랫폼의 환경 변수 설정 방법에 따라 `NEXT_PUBLIC_NOTEBOOKLM_URL`을 설정하세요.

## 사용 방법

### 챗봇 선택 기능
환경 변수가 설정되면:
- 화면 하단에 챗봇 토글 버튼이 표시됩니다
- 챗봇 버튼 위에 "정우코팅 챗봇"과 "NotebookLM" 선택 버튼이 나타납니다
- 원하는 챗봇을 선택하여 사용할 수 있습니다

### 기본 챗봇만 사용
환경 변수가 설정되지 않으면:
- 기존 정우코팅 챗봇만 표시됩니다
- NotebookLM 관련 UI는 표시되지 않습니다

## 통합 방식

### 옵션 1: iframe 임베드 (현재 구현)
- NotebookLM 챗봇을 iframe으로 임베드
- 간단하고 빠른 통합
- NotebookLM의 모든 기능 사용 가능

### 옵션 2: API 연동 (향후 가능)
- NotebookLM이 API를 제공하는 경우
- 더 깊은 통합 가능
- 커스터마이징 가능

## 주의사항

1. **보안**: NotebookLM 링크가 공개되어 있어야 iframe으로 임베드할 수 있습니다
2. **CORS**: NotebookLM이 iframe 임베드를 허용해야 합니다
3. **반응형**: 모바일 환경에서도 잘 작동하는지 확인하세요

## 문제 해결

### 챗봇이 표시되지 않는 경우:
1. 환경 변수가 올바르게 설정되었는지 확인
2. NotebookLM 링크가 공개되어 있는지 확인
3. 브라우저 콘솔에서 오류 메시지 확인

### iframe이 차단되는 경우:
- NotebookLM의 공유 설정에서 "임베드 허용" 옵션을 확인하세요
- 일부 브라우저는 iframe을 차단할 수 있습니다

## 추가 기능

필요에 따라 다음 기능을 추가할 수 있습니다:
- 챗봇 전환 시 대화 기록 유지
- 챗봇별 통계 수집
- 사용자 선호도 저장

