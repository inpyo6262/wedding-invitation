/* ============================================================
   모바일 청첩장 설정 파일
   ------------------------------------------------------------
   이 파일의 값만 고치면 청첩장 내용이 전부 바뀝니다.
   값을 비워두면("") 해당 항목/버튼은 자동으로 숨겨집니다.
   ============================================================ */

const CONFIG = {
  /* ---------- 1. 신랑 ---------- */
  groom: {
    name: '홍인표',
    nameEn: 'Inpyo',
    relation: '아들',
    phone: '010-2777-6262',
    father: { name: '홍태훈', phone: '010-6886-5900', late: false }, // late:true 면 '故'
    mother: { name: '유필순', phone: '010-3480-6262', late: false },
    // 계좌는 여러 개 넣을 수 있습니다. number 가 비어 있으면 그 줄은 표시되지 않습니다.
    accounts: [
      { label: '신랑 홍인표',   bank: '', number: '', holder: '홍인표', kakaopay: '' },
      { label: '아버지 홍태훈', bank: '농협', number: '312-01090404-61', holder: '홍태훈', kakaopay: '' },
      { label: '어머니 유필순', bank: '국민', number: '402601-04-027400', holder: '유필순', kakaopay: '' }
    ],
    wreathUrl: '' // 화환 보내기 링크 (없으면 '')
  },

  /* ---------- 2. 신부 ---------- */
  bride: {
    name: '황주은',
    nameEn: 'Jueun',
    relation: '딸',
    phone: '010-7938-0604',
    father: { name: '황동한', phone: '', late: false },
    mother: { name: '김혜란', phone: '', late: false },
    accounts: [
      { label: '신부 황주은',   bank: '', number: '', holder: '황주은', kakaopay: '' },
      { label: '아버지 황동한', bank: '', number: '', holder: '황동한', kakaopay: '' },
      { label: '어머니 김혜란', bank: '', number: '', holder: '김혜란', kakaopay: '' }
    ],
    wreathUrl: ''
  },

  /* ---------- 3. 예식 ---------- */
  wedding: {
    date: '2027-03-13',        // YYYY-MM-DD (토요일)
    time: '12:30',             // 24시간 표기 HH:MM
    venue: '아벤티움 서울',
    hall: '3층 단독홀',
    tel: '02-313-2480',
    // 지도 앱 버튼이 검색할 말 (비우면 venue 로 검색)
    searchName: '채플웨딩홀 아벤티움',
    addressRoad: '서울특별시 중구 청파로 464 브라운스톤서울 3층',
    addressJibun: '중구 중림동 355',
    lat: 37.560983,            // 지도 표시용 — 카카오맵에 등록된 '채플웨딩홀 아벤티움' 좌표
    lng: 126.968151,
    mapLevel: 6,               // 지도 기본 축척 (4=100m, 5=250m, 6=500m, 7=1km)
    transport: [
      {
        icon: '🚇', title: '지하철',
        lines: [
          '2·5호선 충정로역 4번 출구 — 도보 5분',
          '출구 방향으로 70m 직진 후 횡단보도 건너편 브라운스톤서울 3층',
          '1·4호선·공항철도 서울역 15번 출구 — 도보 15분',
          '“서울역 서부광장” 방향으로 나오신 후 한국경제신문사 방향 맞은편'
        ]
      },
      {
        icon: '🚌', title: '버스',
        lines: [
          '한국경제신문사 하차 — 마을 서대문06 / 간선 370, 603 / 지선 7011, 7013A, 7013B, 7017 / 공항 6015',
          '종근당·충정로역 하차 — 간선 172, 472, 603 / 지선 7011, 7013A, 7013B, 7017',
          '서울역 서부 하차 — 간선 173, 261, 262, 463, 503, 604 / 지선 7021, 7024',
          '경찰청·동북아역사재단 하차 — 간선 103, 150, 701, 704, 708, 709, 742, 750A, 750B, 752'
        ]
      },
      {
        icon: '🚗', title: '자가용 · 주차',
        lines: [
          '본관주차장 — 브라운스톤서울 (중구 청파로 464)',
          '별관주차장 — 서소문공원 (중구 칠패로 5)',
          '별관(서소문공원) 주차장을 이용하시면 더 여유롭게 주차하실 수 있습니다'
        ]
      }
    ]
  },

  /* ---------- 4. 인사말 ---------- */
  greeting: {
    eyebrow: 'Invite you',
    subtitle: '소중한 당신을 초대합니다.',
    // acrostic: true 면 각 줄 첫 글자가 강조됩니다 (인 · 표 · 주 · 은)
    acrostic: true,
    body: [
      '인도하시는 하나님의 손길 안에서',
      '표현할 수 없는 기쁨으로 만난 두 사람이',
      '주님 앞에 언약을 맺습니다',
      '은혜로 세워질 가정의 시작을 함께 축복해주세요'
    ]
  },

  /* ---------- 5. 사진 ---------- */
  photos: {
    main: 'images/main.jpg',              // 메인 사진
    galleryPath: 'images/gallery/',       // images/gallery/1.jpg ~ N.jpg
    galleryExt: '.jpg',
    galleryCount: 12
  },

  /* ---------- 6. 배경음악 (사용 안 함) ---------- */
  bgm: {
    enabled: false,
    src: 'assets/bgm.mp3'
  },

  /* ---------- 7. 카카오 (선택) ---------- */
  kakao: {
    jsKey: '5aed5c4fb377d084285e8fd03d3f3ca1',     // 카카오 JavaScript 키 → 넣으면 카카오톡 공유 활성화
    mapKey: '5aed5c4fb377d084285e8fd03d3f3ca1',    // 카카오맵 JavaScript 키 → 넣으면 실제 지도 표시
    // 공유 썸네일 (1200x630 가로 이미지) — index.html 의 og:image 와 같은 값이어야 합니다
    shareImage: 'https://inpyo6262.github.io/wedding-invitation/images/share.jpg'
  },

  /* ---------- 8. Firebase 방명록 ---------- */
  // Firebase 콘솔 > 프로젝트 설정 > 내 앱(웹) 의 값입니다.
  // 이 키들은 웹에 공개되는 값이며, 실제 보안은 firestore.rules 가 담당합니다.
  firebase: {
    apiKey: 'AIzaSyDbZph_XP3-xHgWiC9j9AMJ5wUVjBeVCR4',
    authDomain: 'inpyo-f9105.firebaseapp.com',
    projectId: 'inpyo-f9105',
    storageBucket: 'inpyo-f9105.firebasestorage.app',
    messagingSenderId: '901781141982',
    appId: '1:901781141982:web:45c16d294f8f6f0579454f'
  },
  guestbook: {
    collection: 'guestbook',
    pageSize: 5,
    adminPassword: '' // 정해두면 어떤 글이든 이 비밀번호로 삭제 가능
  }
};

/* 전역 노출 */
window.CONFIG = CONFIG;
