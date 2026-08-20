# MyHub — 최초 페이지 로드 시퀀스 다이어그램 v1

**액터**: 방문자, 브라우저, JS(`script.js`), GitHub Pages
**시작 이벤트**: URL 접속
**종료 이벤트**: 렌더링된 이력서 표시

```mermaid
sequenceDiagram
    actor Visitor as 방문자
    participant Browser as 브라우저
    participant JS as JS (script.js)
    participant Pages as GitHub Pages

    Visitor->>Browser: URL 접속 (https://hyun9758.github.io/cv-myhub/)
    Browser->>Pages: GET index.html
    Pages-->>Browser: index.html 응답
    Browser->>Pages: GET style.css
    Pages-->>Browser: style.css 응답
    Browser->>Pages: GET script.js
    Pages-->>Browser: script.js 응답
    Browser->>JS: script.js 실행 (IIFE 초기화)

    JS->>JS: localStorage에서 cv_lang, cv_theme 읽기
    JS->>Browser: applyTheme() — data-theme 속성 적용

    JS->>Pages: fetch('data.json') (최초 1회)
    Pages-->>JS: data.json 응답 (CV 데이터)
    JS->>JS: cvData 변수에 캐시

    JS->>JS: renderAll() 호출
    JS->>Browser: renderProfile() — 프로필 패널 DOM 생성
    JS->>Browser: renderIntro/Education/Experience/Projects/Publications/Awards/Skills()
    Browser-->>Visitor: 렌더링된 이력서 표시

    Note over Visitor,Browser: 언어 전환/다크모드 토글 시에는<br/>data.json을 재요청하지 않고<br/>캐시된 cvData로 재렌더링
```

## 변경 이력

| 날짜 | 버전 | 변경 내용 |
|---|---|---|
| 2026-08-20 | v1 | 최초 작성 |
