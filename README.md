# 원 드래그 및 연결 앱

React로 만든 인터랙티브한 원 드래그 및 연결 애플리케이션입니다.

## 🚀 기능

### 기본 기능
- **16개의 원**: 4x4 격자로 배치된 다양한 색상의 원들
- **원 이동**: 원을 클릭하고 2초 후 드래그하여 이동
- **원 연결**: 원을 클릭하고 2초 전에 드래그하여 다른 원과 연결
- **이름 편집**: 원을 더블클릭하여 이름 변경

### 상세 기능
- **이중 모드 시스템**:
  - 2초 후 드래그: 원 이동 모드
  - 2초 전 드래그: 연결 모드
- **시각적 피드백**:
  - 클릭된 원: 주황색 테두리
  - 드래그 중인 원: 빨간색 테두리와 확대 효과
  - 편집 중인 원: 주황색 테두리와 text 커서
- **연결 관리**:
  - 실시간 연결선 표시
  - 중복 연결 방지
  - 연결 개수 표시

## 🛠️ 기술 스택

- **React 18.2.0**
- **JavaScript (ES6+)**
- **CSS3**
- **HTML5 Canvas**

## 📦 설치 및 실행

### 로컬 개발 환경

1. **저장소 클론**
   ```bash
   git clone https://github.com/[your-username]/[your-repo-name].git
   cd [your-repo-name]
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **개발 서버 실행**
   ```bash
   npm start
   ```

4. **브라우저에서 확인**
   ```
   http://localhost:3000
   ```

### 배포

1. **GitHub Pages 배포**
   ```bash
   npm run deploy
   ```

## 🎮 사용 방법

### 원 이동
1. 원을 클릭합니다
2. 2초 동안 마우스를 누르고 있습니다
3. 2초 후 원이 빨간색 테두리로 변경되면 드래그하여 이동

### 원 연결
1. 원을 클릭합니다
2. 2초 전에 마우스를 드래그합니다
3. 빨간 점선이 나타나면 다른 원 위에서 마우스를 놓아 연결

### 이름 편집
1. 원을 더블클릭합니다
2. 입력 필드에 새 이름을 입력합니다
3. Enter 키를 누르거나 다른 곳을 클릭하여 완료

## 🌐 라이브 데모

[GitHub Pages에서 확인하기](https://[your-github-username].github.io/[your-repo-name])

## 📁 프로젝트 구조

```
my-react-app/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── App.js          # 메인 컴포넌트
│   ├── App.css         # 스타일시트
│   └── index.js        # 앱 진입점
├── package.json
└── README.md
```

## 🔧 주요 컴포넌트

### App.js
- 원들의 상태 관리
- 마우스 이벤트 처리
- 드래그 및 연결 로직
- Canvas를 이용한 연결선 렌더링

### 주요 기능
- `handleMouseDown`: 클릭 이벤트 처리
- `handleMouseMove`: 드래그 및 연결 처리
- `handleDoubleClick`: 이름 편집 모드
- `drawConnections`: 연결선 그리기

## 🎨 스타일링

- **반응형 디자인**: 모바일과 데스크톱 모두 지원
- **부드러운 애니메이션**: CSS 트랜지션과 transform 활용
- **직관적인 UI**: 색상과 크기로 상태 표시

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 연락처

프로젝트 링크: [https://github.com/[your-username]/[your-repo-name]](https://github.com/[your-username]/[your-repo-name])
