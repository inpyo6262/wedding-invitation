/* ============================================================
   모바일 청첩장 설정 파일
   ------------------------------------------------------------
   이 파일의 값만 고치면 청첩장 내용이 전부 바뀝니다.
   값을 비워두면("") 해당 항목/버튼은 자동으로 숨겨집니다.
   ============================================================ */

const CONFIG = {
  /* ---------- 1. 신랑 ---------- */
  groom: {
    name: '김민준',            // 이름
    nameEn: 'Minjun',          // 영문 이름 (푸터용)
    relation: '장남',          // 장남 / 차남 / 아들 ...
    phone: '010-1234-5678',
    father: { name: '김영수', phone: '010-1111-1111', late: false }, // late:true 면 '故'
    mother: { name: '이정희', phone: '010-2222-2222', late: false },
    // 계좌는 여러 개 넣을 수 있습니다.
    accounts: [
      { label: '신랑',        bank: '국민은행', number: '123456-01-123456', holder: '김민준', kakaopay: '' },
      { label: '아버지 김영수', bank: '신한은행', number: '110-123-456789',   holder: '김영수', kakaopay: '' },
      { label: '어머니 이정희', bank: '농협은행', number: '302-1234-5678-01', holder: '이정희', kakaopay: '' }
    ],
    // 화환 보내기 링크 (없으면 '')
    wreathUrl: ''
  },

  /* ---------- 2. 신부 ---------- */
  bride: {
    name: '박서연',
    nameEn: 'Seoyeon',
    relation: '장녀',
    phone: '010-8765-4321',
    father: { name: '박성호', phone: '010-3333-3333', late: false },
    mother: { name: '최은주', phone: '010-4444-4444', late: false },
    accounts: [
      { label: '신부',        bank: '카카오뱅크', number: '3333-01-1234567',  holder: '박서연', kakaopay: '' },
      { label: '아버지 박성호', bank: '우리은행',   number: '1002-123-456789', holder: '박성호', kakaopay: '' },
      { label: '어머니 최은주', bank: '하나은행',   number: '123-456789-01234', holder: '최은주', kakaopay: '' }
    ],
    wreathUrl: ''
  },

  /* ---------- 3. 예식 ---------- */
  wedding: {
    date: '2027-05-15',        // YYYY-MM-DD
    time: '12:30',             // 24시간 표기 HH:MM
    venue: '그랜드 컨벤션',      // 웨딩홀 이름
    hall: '3층 그랜드볼룸',      // 홀 이름 / 층
    tel: '02-123-4567',        // 웨딩홀 대표번호 (없으면 '')
    addressRoad: '서울특별시 강남구 테헤란로 123',  // 도로명 주소
    addressJibun: '역삼동 123-45',                 // 지번 주소
    lat: 37.5006,              // 위도 (카카오맵 키 넣었을 때 사용)
    lng: 127.0366,             // 경도
    transport: [
      { icon: '🚇', title: '지하철', lines: ['2호선 역삼역 3번 출구에서 도보 5분', '9호선 언주역 7번 출구에서 도보 10분'] },
      { icon: '🚌', title: '버스',   lines: ['간선 146, 360, 740 — 역삼역 하차', '지선 4412, 6411 — 테헤란로 하차'] },
      { icon: '🚗', title: '자가용', lines: ['내비게이션에 "그랜드 컨벤션" 검색', '건물 지하 2~5층 주차장 2시간 무료'] }
    ]
  },

  /* ---------- 4. 인사말 ---------- */
  greeting: {
    eyebrow: 'Invite you',
    subtitle: '소중한 당신을 초대합니다.',
    body: [
      '오월의 어느 봄날,',
      '늘 곁에서 아껴주셨던 고마운 분들을 모십니다.',
      '',
      '있는 그대로 사랑하고',
      '서로의 존재를 감사하며',
      '인연이었던 저희 두 사람',
      '',
      '같이 있으면 기분 좋아지는 그대와 함께',
      '인생의 길을 걸어가겠습니다.'
    ]
  },

  /* ---------- 5. 사진 ---------- */
  photos: {
    // 메인 사진 (images/main.jpg 로 넣어주세요)
    main: 'images/main.jpg',
    // 갤러리: images/gallery/1.jpg ~ N.jpg
    galleryPath: 'images/gallery/',
    galleryExt: '.jpg',
    galleryCount: 12
  },

  /* ---------- 6. 배경음악 (현재 사용 안 함) ---------- */
  bgm: {
    enabled: false,
    src: 'assets/bgm.mp3'
  },

  /* ---------- 7. 카카오 (선택) ---------- */
  kakao: {
    jsKey: '',   // 카카오 JavaScript 키 → 넣으면 카카오톡 공유 활성화
    mapKey: '',  // 카카오맵 JavaScript 키 → 넣으면 실제 지도 표시
    shareImage: '' // 공유 썸네일 이미지 절대 URL (예: https://아이디.github.io/레포/images/main.jpg)
  },

  /* ---------- 8. Firebase 방명록 ---------- */
  // Firebase 콘솔 > 프로젝트 설정 > 내 앱(웹) 에서 복사한 값을 넣어주세요.
  firebase: {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: ''
  },
  guestbook: {
    collection: 'guestbook',
    pageSize: 5,
    adminPassword: '' // 비우면 글쓴이가 입력한 비밀번호로만 삭제 가능
  }
};

/* 전역 노출 */
window.CONFIG = CONFIG;
