# MyHub — 정현수 CV

정적 HTML/CSS/JS 기반 개인 이력서(CV) 웹 애플리케이션입니다. 프레임워크·빌드 도구 없이 순수 HTML + CSS + Vanilla JS로만 구성되어 있으며, `data.json` 파일만 수정하면 이력서 내용을 갱신할 수 있습니다.

## 실행 방법

```bash
python -m http.server 8000
```

이후 브라우저에서 `http://localhost:8000` 접속.

## 파일 구조

```
.
├── index.html      # 페이지 구조 (렌더링 대상 빈 컨테이너)
├── style.css        # 라이트/다크 테마, 반응형, 인쇄용 스타일
├── script.js         # data.json을 fetch하여 동적으로 렌더링하는 로직
├── data.json         # 실제 이력서 데이터 (한/영 동시 관리) — 이 파일만 수정하면 됨
├── res/
│   └── my_profile.svg   # 프로필 사진 겸 파비콘 (실사진 미제공으로 이니셜 아바타로 대체)
└── README.md
```

## data.json 수정 가이드 (섹션별 필드 요약)

| 섹션 | 필드 | 설명 |
| --- | --- | --- |
| `meta` | `nameKo`, `nameEn`, `roleBadges[]` | 이름(한/영), 직무 뱃지(칩) 목록 |
| `profile` | `photo`, `birthDate`, `militaryStatus`, `address`, `contact.email`, `contact.mobile`, `affiliation`, `social[]` | 프로필 패널: 사진, 생년월일, 병역, 주소, 연락처, 소속, 소셜 링크. 값이 비어있으면(`""`) 자동으로 숨김 |
| `intro` | `{ ko, en }` | 한 문단 자기소개 |
| `education[]` | `school`, `major`, `degree`, `period`, `gpa` | 학력: 학교명, 학과, 학위, 기간, 평점(선택) |
| `experience[]` | `period`, `org`, `description` | 경력: 기간, 기관, 내용 |
| `projects[]` | `category`, `year`, `period`, `role`, `name`, `description` | 프로젝트: 구분(팀/개인), 연도, 기간, 역할, 프로젝트명, 설명 |
| `publications[]` | `year`, `title`, `description` | 논문 및 특허 (없으면 빈 배열 `[]` → 섹션 자동 숨김) |
| `awards[]` | `year`, `name` | 수상 내역 |
| `skills[]` | `category`, `items[]` | 기술/언어 스킬 그룹 |

- 언어별 텍스트가 필요한 필드는 `{ "ko": "...", "en": "..." }` 형태의 객체로 저장합니다.
- 기간·이메일·링크 등 언어 무관 데이터는 중복 없이 단일 값으로 저장합니다.
- 배열이 비어 있거나(`[]`) 값이 빈 문자열(`""`)이면 해당 섹션/필드는 화면에서 자동으로 숨겨집니다.

## 주요 기능

- 한글/영어 전체 언어 전환 (헤더 토글 버튼, `localStorage`에 마지막 선택 언어 저장, `data.json`은 최초 1회만 fetch)
- 라이트 모드 기본 + 다크 모드 토글 (`localStorage`에 테마 저장)
- 이력서 전체 인쇄 (브라우저 인쇄 기능 활용, 인쇄 시 라이트 모드로 강제 전환)
- 768px 기준 모바일/데스크톱 반응형 (모바일: 좌측 햄버거 메뉴, 우측 언어/다크모드/인쇄 버튼)
- 단일 페이지 + 앵커 기반 스크롤 네비게이션

## 배포

GitHub Pages를 통해 배포됩니다. `main` 브랜치 루트(`/`)를 소스로 사용합니다.
