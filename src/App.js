import React, { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const [circles, setCircles] = useState([]);
  const [draggedCircle, setDraggedCircle] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [clickedCircle, setClickedCircle] = useState(null);
  const [canDrag, setCanDrag] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connections, setConnections] = useState([]);
  const [tempConnection, setTempConnection] = useState(null);
  const [editingCircle, setEditingCircle] = useState(null);
  const timerRef = useRef(null);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // 16개의 원 생성
  useEffect(() => {
    const initialCircles = [];
    const cols = 4; // 4열
    const rows = 4; // 4행
    const spacingX = (window.innerWidth - 200) / (cols - 1);
    const spacingY = 200;
    
    for (let i = 0; i < 16; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      
      const randomOffsetX = (Math.random() - 0.5) * 40;
      const randomOffsetY = (Math.random() - 0.5) * 40;
      
      initialCircles.push({
        id: i,
        name: `원 ${i + 1}`,
        x: 100 + col * spacingX + randomOffsetX,
        y: 150 + row * spacingY + randomOffsetY,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`
      });
    }
    setCircles(initialCircles);
  }, []);

  // 마우스 다운 - 클릭 시작
  const handleMouseDown = (e, circle) => {
    e.preventDefault();
    e.stopPropagation();
    
    // 편집 중이면 드래그/연결 기능 비활성화
    if (editingCircle) return;
    
    // 이전 타이머가 있다면 제거
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    setClickedCircle(circle);
    setCanDrag(false);
    setIsConnecting(false);
    
    // 2초 후에 드래그 가능하도록 설정
    timerRef.current = setTimeout(() => {
      setCanDrag(true);
      
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      // 드래그 오프셋 계산 (마우스 위치와 원 중심점의 차이)
      setDragOffset({
        x: mouseX - circle.x,
        y: mouseY - circle.y
      });
      
      setDraggedCircle(circle);
    }, 2000);
  };

  // 더블 클릭 - 이름 편집
  const handleDoubleClick = (e, circle) => {
    e.preventDefault();
    e.stopPropagation();
    
    // 타이머 제거
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    setClickedCircle(null);
    setCanDrag(false);
    setIsConnecting(false);
    setDraggedCircle(null);
    setEditingCircle(circle);
  };

  // 이름 편집 완료
  const finishNameEdit = (newName) => {
    if (newName && newName.trim() && editingCircle) {
      setCircles(prev => prev.map(c => 
        c.id === editingCircle.id ? { ...c, name: newName.trim() } : c
      ));
    }
    setEditingCircle(null);
  };

  // 마우스 이동 - 드래그 중
  const handleMouseMove = (e) => {
    if (canDrag && draggedCircle) {
      // 2초 후 드래그 모드
      requestAnimationFrame(() => {
        const container = containerRef.current;
        const rect = container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // 마우스 위치에서 오프셋을 빼서 원의 새로운 중심점 계산
        const newX = mouseX - dragOffset.x;
        const newY = mouseY - dragOffset.y;
        
        // 화면 경계 제한
        const maxX = window.innerWidth - 100;
        const maxY = 1000 - 100;
        const clampedX = Math.max(50, Math.min(newX, maxX));
        const clampedY = Math.max(50, Math.min(newY, maxY));
        
        // 원 위치 업데이트
        setCircles(prev => prev.map(c => 
          c.id === draggedCircle.id ? { ...c, x: clampedX, y: clampedY } : c
        ));
      });
    } else if (clickedCircle && !canDrag) {
      // 2초 전 연결 모드
      setIsConnecting(true);
      
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      // 임시 연결선 업데이트
      setTempConnection({
        from: clickedCircle,
        to: { x: mouseX, y: mouseY }
      });
    }
  };

  // 마우스 업 - 드래그 종료
  const handleMouseUp = (e) => {
    if (isConnecting && clickedCircle) {
      // 연결 모드에서 마우스 업
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      // 가장 가까운 원 찾기
      const targetCircle = circles.find(circle => {
        const distance = Math.sqrt(
          Math.pow(circle.x - mouseX, 2) + Math.pow(circle.y - mouseY, 2)
        );
        return distance < 60 && circle.id !== clickedCircle.id;
      });
      
      if (targetCircle) {
        // 연결 추가
        const newConnection = {
          id: Date.now(),
          from: clickedCircle.id,
          to: targetCircle.id
        };
        
        // 중복 연결 방지
        const isDuplicate = connections.some(conn => 
          (conn.from === newConnection.from && conn.to === newConnection.to) ||
          (conn.from === newConnection.to && conn.to === newConnection.from)
        );
        
        if (!isDuplicate) {
          setConnections(prev => [...prev, newConnection]);
        }
      }
    }
    
    // 타이머 제거
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    setDraggedCircle(null);
    setClickedCircle(null);
    setCanDrag(false);
    setIsConnecting(false);
    setTempConnection(null);
    setDragOffset({ x: 0, y: 0 });
  };

  // 연결선 그리기
  const drawConnections = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 기존 연결선 그리기
    connections.forEach(connection => {
      const fromCircle = circles.find(c => c.id === connection.from);
      const toCircle = circles.find(c => c.id === connection.to);
      
      if (fromCircle && toCircle) {
        ctx.beginPath();
        ctx.moveTo(fromCircle.x, fromCircle.y);
        ctx.lineTo(toCircle.x, toCircle.y);
        ctx.strokeStyle = '#4ecdc4';
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    });
    
    // 임시 연결선 그리기
    if (tempConnection) {
      ctx.beginPath();
      ctx.moveTo(tempConnection.from.x, tempConnection.from.y);
      ctx.lineTo(tempConnection.to.x, tempConnection.to.y);
      ctx.strokeStyle = '#ff6b6b';
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  };

  // 연결선 다시 그리기
  useEffect(() => {
    drawConnections();
  }, [connections, circles, tempConnection]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="App">
      <div className="header">
        <h1>원 드래그 테스트</h1>
        <p>원을 클릭하고 2초 후에 드래그하거나, 2초 전에 드래그하여 연결하세요!</p>
        <p>원을 더블클릭하면 이름을 편집할 수 있습니다.</p>
        <div style={{ marginTop: '10px' }}>
          <span style={{ background: '#4ecdc4', color: 'white', padding: '5px 10px', borderRadius: '10px' }}>
            연결: {connections.length}개
          </span>
        </div>
      </div>

      <div 
        ref={containerRef}
        className="canvas-container"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <canvas
          ref={canvasRef}
          width={window.innerWidth}
          height={1000}
          style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
        />
        
        {circles.map(circle => (
          <div
            key={circle.id}
            className="circle"
            style={{
              left: circle.x - 50,
              top: circle.y - 50,
              backgroundColor: circle.color,
              position: 'absolute',
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: editingCircle?.id === circle.id ? 'text' :
                     canDrag && draggedCircle?.id === circle.id ? 'grabbing' : 
                     clickedCircle?.id === circle.id ? 'crosshair' : 'grab',
              border: editingCircle?.id === circle.id ? '4px solid #ffa500' :
                     canDrag && draggedCircle?.id === circle.id ? '4px solid #ff6b6b' : 
                     clickedCircle?.id === circle.id ? '4px solid #ffa500' : '3px solid #333',
              fontSize: '16px',
              fontWeight: 'bold',
              color: 'white',
              textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
              userSelect: 'none',
              transform: editingCircle?.id === circle.id ? 'scale(1.1)' :
                        canDrag && draggedCircle?.id === circle.id ? 'scale(1.1)' : 
                        clickedCircle?.id === circle.id ? 'scale(1.05)' : 'scale(1)',
              transition: (canDrag && draggedCircle?.id === circle.id) || editingCircle?.id === circle.id ? 'none' : 'all 0.2s ease',
              zIndex: (canDrag && draggedCircle?.id === circle.id) || clickedCircle?.id === circle.id || editingCircle?.id === circle.id ? 10 : 1
            }}
            onMouseDown={(e) => handleMouseDown(e, circle)}
            onDoubleClick={(e) => handleDoubleClick(e, circle)}
            title={circle.name}
          >
            {editingCircle?.id === circle.id ? (
              <input
                type="text"
                value={circle.name}
                onChange={(e) => {
                  setCircles(prev => prev.map(c => 
                    c.id === circle.id ? { ...c, name: e.target.value } : c
                  ));
                }}
                onBlur={() => finishNameEdit(circle.name)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    finishNameEdit(circle.name);
                  }
                }}
                autoFocus
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  width: '80px',
                  outline: 'none'
                }}
              />
            ) : (
              circle.name
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
