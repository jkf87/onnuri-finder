(async () => {
  // 추출할 총 페이지 수를 알고 있다고 가정
  const totalPages = 10;

  let allData = [];
  const headers = ['번호', '시장명', '상호명', '주소', '연락처', '취급품목(업종)'];

  // 현재 화면의 테이블에서 데이터를 추출하는 함수
  function extractDataFromTable() {
    let data = [];
    const table = document.querySelector('table[bgcolor="#CCCCCC"]');
    if(!table) return data;

    const rows = table.querySelectorAll('tr');
    rows.forEach((row, rowIndex) => {
      if (rowIndex === 0) return; // 첫 번째 행은 헤더이므로 건너뛰기
      const cols = row.querySelectorAll('td');
      if (cols.length) {
        let rowData = [];
        cols.forEach(col => {
          rowData.push(col.textContent.trim());
        });
        data.push(rowData);
      }
    });
    return data;
  }

  for (let i = 1; i <= totalPages; i++) {
    // fnPage 함수 호출로 페이지 변경 요청
    fnPage(i);

    // 페이지가 전환되고 테이블이 갱신될 시간을 기다림 (AJAX 응답 대기)
    // 시간은 상황에 맞게 조정 필요 (예: 2초)
    await new Promise(r => setTimeout(r, 2000));

    // 갱신된 테이블에서 데이터 추출
    const pageData = extractDataFromTable();
    allData.push(...pageData);
  }

  // CSV 생성
  let csvContent = '\ufeff' + headers.join(',') + '\n';
  csvContent += allData.map(row => row.join(',')).join('\n');

  // CSV 다운로드
  let blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  let link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "table_data_all_pages.csv";
  link.click();
})();
