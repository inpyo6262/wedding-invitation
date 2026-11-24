# 모바일 청첩장

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
| `wedding` | 날짜(`YYYY-MM-DD`), 시간(`HH:MM`), 웨딩홀, 홀 이름, 주소, 교통편 |
| `greeting` | 인사말 문구 (배열의 `''` 는 한 줄 띄기) |
| `photos` | 메인 사진 경로, 갤러리 장수 |
| `kakao` | 카카오 공유 / 카카오맵 키 (선택) |
| `firebase` | 방명록용 Firebase 설정 |

부모님이 돌아가신 경우 `late: true` 로 두면 이름 앞에 `故` 가 붙습니다.

---

## 2. 사진 넣기

- 메인 사진 → `images/main.jpg`
- 갤러리 → `images/gallery/1.jpg`, `2.jpg`, … 순서대로
- 장수는 `config.js` 의 `photos.galleryCount` 로 맞춰주세요.

사진이 없으면 자리 표시만 보이고 오류는 나지 않습니다.

**권장 사이즈** — 메인 1200×1600 내외, 갤러리 1200×1200 내외, 각 500KB 이하.
사진이 크면 휴대폰에서 느려집니다.

---

## 3. 방명록 (Firebase) 설정

1. [Firebase 콘솔](https://console.firebase.google.com) → **프로젝트 추가**
2. 좌측 **빌드 → Firestore Database → 데이터베이스 만들기**
   - 위치는 `asia-northeast3 (서울)` 권장
   - 모드는 **프로덕션 모드**로 시작 (규칙은 아래 4번에서 교체)
3. **프로젝트 설정 → 내 앱 → 웹(`</>`)** 추가 → `firebaseConfig` 값 복사
4. 복사한 값을 `js/config.js` 의 `firebase` 항목에 붙여넣기
5. Firestore **규칙** 탭에 아래 내용을 붙여넣고 게시:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /guestbook/{doc} {
      allow read: if true;
      allow create: if request.resource.data.keys().hasOnly(['name','msg','pw','createdAt'])
                    && request.resource.data.name is string
                    && request.resource.data.name.size() <= 12
                    && request.resource.data.msg is string
                    && request.resource.data.msg.size() <= 300;
      allow delete: if true;
      allow update: if false;
    }
  }
}
```

6. **프로젝트 설정 → 일반 → 승인된 도메인**에 `<아이디>.github.io` 추가

> 비밀번호는 평문이 아니라 SHA-256 해시로 저장됩니다.
> 다만 정적 사이트 특성상 삭제 자체는 클라이언트에서 처리되므로,
> 완전한 보안이 필요하면 Cloud Functions 로 옮기는 편이 좋습니다.
> `config.js` 의 `guestbook.adminPassword` 를 정해두면 어떤 글이든 지울 수 있습니다.

---

## 4. 카카오톡 공유 / 지도 (선택)

1. [Kakao Developers](https://developers.kakao.com) → 애플리케이션 추가
2. **앱 키 → JavaScript 키** 를 `config.js` 의 `kakao.jsKey` 에 입력
3. **플랫폼 → Web → 사이트 도메인**에 `https://<아이디>.github.io` 등록
4. 카카오맵을 쓰려면 같은 키를 `kakao.mapKey` 에 넣고,
   **카카오맵 JavaScript SDK** 사용 설정을 켠 뒤 `wedding.lat` / `wedding.lng` 를 채워주세요.

키가 없으면 카카오 공유 버튼은 숨겨지고, 지도는 주소 카드 + 지도앱 버튼으로 표시됩니다.

공유 썸네일은 `kakao.shareImage` 에 **절대 주소**로 넣어야 합니다.
예: `https://<아이디>.github.io/<레포>/images/main.jpg`

---

## 5. 로컬에서 확인하기

```powershell
python -m http.server 4173
```

브라우저에서 `http://localhost:4173` 으로 접속합니다.
(`index.html` 을 더블클릭해서 열면 방명록 모듈이 동작하지 않습니다.)

---

## 6. GitHub Pages 배포

```powershell
git add -A; git commit -m "update"; git push
```

푸시하면 GitHub Pages 가 자동으로 다시 배포합니다. 보통 1~2분 걸립니다.
