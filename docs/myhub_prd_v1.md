# MyHub — 정현수 CV PRD

> PRD = Product Requirements Document (제품 요구사항 정의서)
> 본 문서는 **구현 완료 이후 역산(Implementation-to-Specification)** 방식으로 작성되었습니다.

| 항목 | 내용 |
|---|---|
| 문서 ID | `PRD-MYHUB-001` |
| 버전 | v1.0 |
| 작성일 | 2026-08-20 |
| 상태 | 배포완료 |
| 작성자 | 정현수 |
| 저장소 | https://github.com/hyun9758/cv-myhub |

## 1. 개요

**배경.** 채용 담당자·협업 파트너가 지원자의 이력을 빠르고 신뢰성 있게 확인할 수 있는 개인 CV 페이지가 필요하다.

**목적.** 정적 파일만으로 배포 가능한 한/영 이중언어 CV 웹 애플리케이션(MyHub)을 구축하여, `data.json` 수정만으로 이력서 내용을 손쉽게 갱신할 수 있도록 한다.

**대상 사용자.** (1) 채용 담당자, (2) 협업 파트너/동료 개발자

## 2. 범위

**In Scope**
- 단일 페이지 CV(프로필, 소개, 학력, 경력, 프로젝트, 논문/특허, 수상, 스킬)
- 한/영 언어 전환, 라이트/다크 모드, 인쇄, 모바일 반응형
- GitHub Pages 정적 배포

**Out of Scope**
- 서버/DB, 로그인, 관리자용 콘텐츠 편집 UI
- 방문자 분석/모니터링

## 3. 정보 구조 — 섹션 ID

| ID | 섹션 | 앵커/경로 | 데이터 소스 | 데이터 없을 때 |
|---|---|---|---|---|
| SEC-01 | 프로필 패널 | `#profile` | `profile`, `meta` | 필드 단위로 숨김 |
| SEC-02 | 소개 | `#intro` | `intro` | 섹션 숨김 |
| SEC-03 | 학력 | `#education` | `education[]` | 섹션 숨김 |
| SEC-04 | 경력 | `#experience` | `experience[]` | 섹션 숨김 |
| SEC-05 | 프로젝트 | `#projects` | `projects[]` | 섹션 숨김 |
| SEC-06 | 논문 및 특허 | (nav 미노출, 데이터 발생 시 자동 노출) | `publications[]` | 섹션 숨김 |
| SEC-07 | 수상 | `#awards` | `awards[]` | 섹션 숨김 |
| SEC-08 | 스킬 | `#skills` | `skills[]` | 섹션 숨김 |

## 4. 데이터 스키마

한글/영어가 필요한 텍스트 필드는 `{ "ko": "...", "en": "..." }` 객체로, 언어 무관 데이터(기간·이메일·URL)는 단일 값으로 저장한다. 배열이 비거나 문자열이 빈 값이면 해당 섹션/필드는 자동 숨김된다.

| 키 | 필드 구성 |
|---|---|
| `meta` | `nameKo`, `nameEn`, `roleBadges[]{ko,en}` |
| `profile` | `photo`, `birthDate`, `militaryStatus`, `address`, `contact{email,mobile}`, `affiliation{ko,en}`, `social[]{label,url}` |
| `intro` | `{ko,en}` |
| `education[]` | `school{ko,en}`, `major{ko,en}`, `degree{ko,en}`, `period`, `gpa` |
| `experience[]` | `period`, `org{ko,en}`, `description{ko,en}` |
| `projects[]` | `category{ko,en}`, `year`, `period`, `role{ko,en}`, `name`, `description{ko,en}`, `links[]{label,url}` |
| `publications[]` | `year`, `title{ko,en}`, `description{ko,en}`, `url` |
| `awards[]` | `year`, `name{ko,en}` |
| `skills[]` | `category{ko,en}`, `items[]` |

## 5. 요구사항 명세

### 5.1 기술 요구사항 (TR)

| ID | 요구사항 | 상태 |
|---|---|---|
| TR-01 | 프레임워크/빌드 도구 없이 순수 HTML+CSS+Vanilla JS만 사용 | Done |
| TR-02 | 파일 구조: `index.html`, `style.css`, `script.js` 분리 | Done |

### 5.2 데이터 요구사항 (DR)

| ID | 요구사항 | 상태 |
|---|---|---|
| DR-01 | 이력서 데이터는 `data.json`으로 분리 관리 | Done |
| DR-02 | 텍스트 필드는 `{ko,en}` 객체, 언어 무관 데이터는 단일 값 | Done |
| DR-03 | `data.json`은 최초 1회만 fetch, 언어 전환 시 캐시 재렌더링 | Done |
| DR-04 | fetch 경로는 상대경로(`fetch('data.json')`) | Done |
| DR-05 | 프로젝트 참조 링크(GitHub 등)를 `links[]`로 구조화 관리 | Done (v1.1) |

### 5.3 UI/UX 요구사항 (UR)

| ID | 요구사항 | 상태 |
|---|---|---|
| UR-01 | 단일 페이지 + 앵커 기반 스크롤 네비게이션 | Done |
| UR-02 | 레이아웃: 네비게이션 헤더 / 프로필 패널 / 컨텐츠 패널, 푸터 없음 | Done |
| UR-03 | 라이트 모드 기본, 다크 모드 토글(SVG 아이콘) | Done |
| UR-04 | 무채색 베이스 + 단일 액센트 컬러(`#3b5bdb`), 그라데이션 금지 | Done |
| UR-05 | shadcn/ui 느낌의 미니멀 스타일, 절제된 애니메이션 | Done |
| UR-06 | 한글/영어 모두 Noto Sans KR 폰트 | Done |
| UR-07 | 768px 기준 반응형, 모바일은 좌측 햄버거 + 우측 컨트롤 | Done |
| UR-08 | 링크 버튼·포커스 아웃라인 등 접근성 세부 다듬기 | Done (v1.1) |

### 5.4 기능 요구사항 (FR)

| ID | 요구사항 | 상태 |
|---|---|---|
| FR-01 | 탭 제목 `'이름 CV'`, 헤더 타이틀 `'이름'` | Done |
| FR-02 | 전 영역 한/영 언어 전환, `localStorage`에 마지막 언어 저장 | Done |
| FR-03 | 브라우저 인쇄 기능(라이트 모드 강제) | Done |
| FR-04 | 섹션 데이터가 비어있으면 해당 섹션 숨김 | Done |
| FR-05 | Open Graph 메타 태그 제공(프로필 사진/이름/소개 요약) | Done (v1.1) |
| FR-06 | 프로젝트/논문 항목에 외부 URL 링크 버튼 제공 | Done (v1.1) |

### 5.5 배포 요구사항 (DPR)

| ID | 요구사항 | 상태 |
|---|---|---|
| DPR-01 | `python -m http.server`로 로컬 렌더링/기능 검증 | Done |
| DPR-02 | GitHub Pages(`main` 브랜치, `/` 루트)로 배포 | Done |
| DPR-03 | README에 섹션별 필드 요약 포함 | Done |

## 6. 비기능 요구사항 (NFR)

| ID | 요구사항 |
|---|---|
| NFR-01 | 외부 라이브러리 의존 없이 순수 웹 표준 API(fetch, localStorage)만 사용 |
| NFR-02 | 정적 파일만으로 어떤 정적 호스팅 환경에도 이식 가능해야 함 |
| NFR-03 | 데이터 갱신은 코드 변경 없이 `data.json` 수정만으로 가능해야 함 |

## 7. 파일 구조

```
myhub_01_static/
├── index.html
├── style.css
├── script.js
├── data.json
├── res/
│   └── my_profile.svg
├── docs/
│   ├── myhub_prd_v1.md              (this file)
│   ├── myhub_data_schema_def_v1.md
│   ├── diagrams/
│   │   └── myhub_dataload_sequence_diagram_v1.md
│   └── template/
│       └── prd_template.md
├── README.md
└── .gitignore
```

## 변경 이력

| 날짜 | 버전 | 변경 내용 |
|---|---|---|
| 2026-08-20 | v1.0 | 최초 작성 (구현 완료 후 역산) |
| 2026-08-20 | v1.1 | Open Graph 태그, 프로젝트 링크(`links[]`) 기능 반영 |
