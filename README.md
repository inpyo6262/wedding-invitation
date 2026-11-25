# 홍인표 ♥ 황주은 모바일 청첩장

**https://inpyo6262.github.io/wedding-invitation/**

2027년 3월 13일 토요일 오후 12시 30분 · 아벤티움 서울 3층 단독홀

바닐라 HTML / CSS / JavaScript 로 만든 모바일 청첩장입니다.
빌드 과정이 없어서 GitHub Pages 에 파일을 올리면 바로 동작합니다.

```
index.html          화면 구조
css/style.css       디자인
js/config.js        ★ 내용(이름·날짜·장소·계좌 등) — 보통 이 파일만 고치면 됩니다
js/main.js          화면 그리기 / 갤러리 / 지도 / 공유
js/guestbook.js     방명록 (Firebase Firestore)
images/main.jpg     메인 사진
images/gallery/     갤러리 사진 (1.jpg, 2.jpg, …)
```

---

## 1. 내용 수정하기

`js/config.js` 한 파일에 모든 내용이 들어 있습니다.
값을 비워두면(`''`) 해당 항목이나 버튼은 **자동으로 숨겨집니다.**

| 항목 | 설명 |
| --- | --- |
| `groom` / `bride` | 이름, 영문 이름, 장남·장녀 표기, 전화번호, 부모님, 계좌 |
| `wedding` | 날짜(`YYYY-MM-DD`), 시간(`HH:MM`), 웨딩홀, 홀 이름, 주소, 지도 검색어, 교통편 |
| `greeting` | 인사말 문구 (배열의 `''` 는 한 줄 띄기) |
| `photos` | 메인 사진 경로, 갤러리 장수 |
| `kakao` | 카카오 공유 / 카카오맵 키 (선택) |
| `firebase` | 방명록용 Firebase 설정 |

부모님이 돌아가신 경우 `late: true` 로 두면 이름 앞에 `故` 가 붙습니다.

> ⚠️ **이름·날짜·장소를 바꾸면 `index.html` 윗부분의 `<title>` 과 `og:` 태그도 같이 고쳐주세요.**
> 카카오톡·문자의 링크 미리보기를 만드는 쪽은 자바스크립트를 실행하지 않아서,
> HTML에 직접 적힌 값만 읽어갑니다.

---

## 2. 사진 넣기

- 메인 사진 → `images/main.jpg`
- 갤러리 → `images/gallery/1.jpg`, `2.jpg`, … 순서대로
- 장수는 `config.js` 의 `photos.galleryCount` 로 맞춰주세요.

사진이 없으면 자리 표시만 보이고 오류는 나지 않습니다.

> **지금 들어 있는 사진은 샘플입니다.**
> 종이 청첩장 PDF 표지의 원본 사진(3840×5760)을 잘라서 만들었습니다.
> 본식·스튜디오 사진이 나오면 같은 파일명으로 덮어쓰면 됩니다.

**권장 사이즈** — 메인 1200×1600 내외, 갤러리 1200×1200 내외, 각 500KB 이하.
사진이 크면 휴대폰에서 느려집니다.

---

## 3. 방명록 (Firebase) — 설정 완료 ✅

| | |
| --- | --- |
| 프로젝트 | `inpyo-f9105` (표시 이름 `inpyo`) |
| 요금제 | Spark (무료) — 하루 읽기 5만 / 쓰기 2만 건 |
| 데이터베이스 | Firestore Native, `asia-northeast3` (서울) |
| 컬렉션 | `guestbook` |
| 콘솔 | https://console.firebase.google.com/project/inpyo-f9105 |

키는 `js/config.js` 의 `firebase` 항목에 들어 있습니다.
**이 키들은 웹에 공개되는 값이 맞습니다.** Firebase 웹 SDK는 원래 그렇게 동작하고,
실제 보안은 아래 규칙이 담당합니다.

### 보안 규칙

규칙은 [`firestore.rules`](firestore.rules) 파일로 관리합니다.
콘솔에서 직접 고치지 말고 파일을 수정한 뒤 배포하세요.

```powershell
firebase deploy --only firestore:rules
```

현재 걸려 있는 제한:

- 이름 1~12자, 메시지 1~300자
- 지정한 4개 필드(`name`, `msg`, `pw`, `createdAt`) 외에는 저장 불가
- 작성 시각은 **서버 시각만** 인정 (조작 방지)
- 수정 불가
- `guestbook` 외 다른 경로는 전부 차단

> 규칙을 배포해도 적용까지 **1분 정도** 걸립니다. 바로 안 되면 잠시 기다리세요.

### 글 삭제

비밀번호는 평문이 아니라 **SHA-256 해시**로 저장됩니다.
다만 정적 사이트라 삭제 판정은 브라우저에서 이뤄지므로, 마음먹은 사람은 우회할 수 있습니다.
하객 방명록 수준에서는 충분하지만, 엄격히 막으려면 Cloud Functions 로 옮겨야 합니다.

`config.js` 의 `guestbook.adminPassword` 를 정해두면 어떤 글이든 그 비밀번호로 지울 수 있습니다.
글을 통째로 지우려면 [콘솔의 Firestore Database](https://console.firebase.google.com/project/inpyo-f9105/firestore)
에서 문서를 삭제하면 됩니다.

---

## 4. 카카오톡 공유 / 지도

### 카카오톡 공유 — 설정 완료 ✅

| | |
| --- | --- |
| 앱 이름 | 홍인표 황주은 청첩장 |
| 앱 ID | 1665214 |
| 등록 도메인 | `https://inpyo6262.github.io` |
| 콘솔 | https://developers.kakao.com/console/app/1665214 |

JavaScript 키는 `config.js` 의 `kakao.jsKey` 에 들어 있습니다.
**이 키는 웹에 공개되는 값이 맞습니다.** 등록한 도메인에서만 동작하도록 카카오가 막아줍니다.

> 링크를 붙여넣었을 때 나오는 미리보기는 **키와 무관합니다.**
> 그건 `index.html` 의 `og:` 태그를 카카오가 읽어가는 것이고, 키가 없어도 나옵니다.
> 키가 하는 일은 청첩장 안의 **카카오톡 공유 버튼**입니다.

### 지도 — 아직 안 켬

`kakao.mapKey` 가 비어 있어서 **오시는 길에 지도 그림이 없습니다.**
주소 카드 + 지도앱 버튼만 나옵니다.

켜려면 [콘솔 → 제품 설정 → 카카오맵](https://developers.kakao.com/console/app/1665214/product/kakao-map)
에서 사용 설정을 켜고, 같은 JavaScript 키를 `kakao.mapKey` 에 넣으면 됩니다. 좌표는 이미 입력되어 있습니다.

> ⚠️ 카카오맵은 **처음 활성화한 앱 하나만** 일간 무료 쿼터를 받고, 그 뒤로는 되돌릴 수 없습니다.

### 지도앱 버튼

카카오맵 · 네이버지도 · 티맵 세 버튼은 모두 `config.js` 의 **`wedding.searchName`** 으로 검색합니다.
주소로 검색하면 건물(브라운스톤서울)만 나와서 예식장을 다시 찾아야 하므로, 상호명으로 검색합니다.

```js
searchName: '채플웨딩홀 아벤티움'
```

---

## 검색엔진 노출

연락처·계좌번호가 들어가므로 `robots.txt` 와 `<meta name="robots" content="noindex">` 로
검색엔진 수집을 막아두었습니다. 링크를 아는 사람은 그대로 볼 수 있습니다.
검색에도 노출되길 원하시면 두 곳을 지우면 됩니다.

---

## 5. 로컬에서 확인하기

```powershell
python tools/devserver.py
```

브라우저에서 `http://localhost:4173` 으로 접속합니다.

- `index.html` 을 더블클릭해서 열면 **방명록이 동작하지 않습니다.** 반드시 서버로 여세요.
- 이 서버는 캐시를 꺼두기 때문에, 파일을 고치고 새로고침하면 바로 반영됩니다.

---

## 6. GitHub Pages 배포

```powershell
git add -A; git commit -m "update"; git push
```

푸시하면 GitHub Pages 가 자동으로 다시 배포합니다. 보통 1~2분 걸립니다.
