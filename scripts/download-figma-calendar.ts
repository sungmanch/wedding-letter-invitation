import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const FIGMA_API_KEY = process.env.FIGMA_API_KEY!;
console.log('API Key loaded:', FIGMA_API_KEY ? 'Yes' : 'No');
const FILE_KEY = 'mXoLNYyxild18B7tqDRSR6';
const OUTPUT_BASE = 'public/assets/calendar/months/calendar-months';

interface FigmaNode {
  id: string;
  name: string;
  type: string;
  children?: FigmaNode[];
}

async function fetchFigmaFile(): Promise<FigmaNode> {
  console.log('Fetching Figma file structure...');
  const res = await fetch(`https://api.figma.com/v1/files/${FILE_KEY}`, {
    headers: { 'X-Figma-Token': FIGMA_API_KEY }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch file: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data.document;
}

interface CalendarFrames {
  months: Map<number, FigmaNode>;      // CalendarTitleX (월 이미지)
  dates: Map<number, FigmaNode>;       // CalendarTitleX-Date (날짜/요일 이미지)
}

function findCalendarFrames(node: FigmaNode, frames: CalendarFrames = { months: new Map(), dates: new Map() }): CalendarFrames {
  // CalendarTitle1 ~ CalendarTitle11 패턴 매칭 (월 이미지)
  const monthMatch = node.name.match(/^CalendarTitle(\d+)$/);
  if (monthMatch) {
    const titleNum = parseInt(monthMatch[1], 10);
    if (titleNum >= 1 && titleNum <= 11) {
      frames.months.set(titleNum, node);
      console.log(`Found month frame: ${node.name} (id: ${node.id})`);
    }
  }

  // CalendarTitleX-Date 패턴 매칭 (날짜/요일 이미지)
  const dateMatch = node.name.match(/^CalendarTitle(\d+)-Date$/);
  if (dateMatch) {
    const titleNum = parseInt(dateMatch[1], 10);
    if (titleNum >= 1 && titleNum <= 11) {
      frames.dates.set(titleNum, node);
      console.log(`Found date frame: ${node.name} (id: ${node.id})`);
    }
  }

  if (node.children) {
    for (const child of node.children) {
      findCalendarFrames(child, frames);
    }
  }

  return frames;
}

function findMonthImages(frame: FigmaNode): Map<number, string> {
  const months = new Map<number, string>();

  function search(node: FigmaNode) {
    // 1~12 이름의 노드 찾기
    const monthNum = parseInt(node.name, 10);
    if (!isNaN(monthNum) && monthNum >= 1 && monthNum <= 12) {
      months.set(monthNum, node.id);
    }

    if (node.children) {
      for (const child of node.children) {
        search(child);
      }
    }
  }

  search(frame);
  return months;
}

// 요일 목록
const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

function findDateImages(frame: FigmaNode): Map<string, string> {
  const dates = new Map<string, string>();

  function search(node: FigmaNode) {
    // "Calendar Dates" AutoLayout 찾기
    if (node.name === 'Calendar Dates') {
      // 하위에서 요일(SUN-SAT)과 날짜(1-31) 찾기
      searchDatesInCalendarDates(node);
      return;
    }

    if (node.children) {
      for (const child of node.children) {
        search(child);
      }
    }
  }

  function searchDatesInCalendarDates(node: FigmaNode) {
    // 요일 체크 (SUN, MON, TUE, WED, THU, FRI, SAT)
    if (WEEKDAYS.includes(node.name)) {
      dates.set(node.name, node.id);
    }

    // 날짜 체크 (1-31)
    const dayNum = parseInt(node.name, 10);
    if (!isNaN(dayNum) && dayNum >= 1 && dayNum <= 31) {
      dates.set(String(dayNum), node.id);
    }

    if (node.children) {
      for (const child of node.children) {
        searchDatesInCalendarDates(child);
      }
    }
  }

  search(frame);
  return dates;
}

async function downloadImages(nodeIds: string[], retries = 3): Promise<Record<string, string>> {
  console.log(`Requesting images for ${nodeIds.length} nodes...`);

  const ids = nodeIds.join(',');
  const res = await fetch(
    `https://api.figma.com/v1/images/${FILE_KEY}?ids=${encodeURIComponent(ids)}&format=png&scale=2`,
    { headers: { 'X-Figma-Token': FIGMA_API_KEY } }
  );

  if (res.status === 429 && retries > 0) {
    const waitTime = 60000; // 1분 대기
    console.log(`Rate limited. Waiting ${waitTime / 1000}s before retry... (${retries} retries left)`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
    return downloadImages(nodeIds, retries - 1);
  }

  if (!res.ok) {
    throw new Error(`Failed to get images: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data.images;
}

async function saveImage(url: string, filePath: string): Promise<void> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to download image: ${res.status}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  const dir = path.dirname(filePath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(filePath, buffer);
  console.log(`Saved: ${filePath}`);
}

async function main() {
  try {
    // 1. Figma 파일 구조 가져오기
    const document = await fetchFigmaFile();

    // 2. CalendarTitle 프레임 찾기
    const calendarFrames = findCalendarFrames(document);
    console.log(`\nFound ${calendarFrames.months.size} month frames, ${calendarFrames.dates.size} date frames\n`);

    // 3. 각 프레임에서 이미지 노드 찾기 (이미 존재하는 파일은 제외)
    const allNodeIds: string[] = [];
    const nodeMapping: Map<string, { title: number; name: string; type: 'month' | 'date'; filePath: string }> = new Map();
    let skippedCount = 0;

    // 3-1. 월별 이미지 노드 (CalendarTitleX)
    for (const [titleNum, frame] of calendarFrames.months) {
      const months = findMonthImages(frame);
      let addedCount = 0;

      for (const [monthNum, nodeId] of months) {
        const filePath = path.join(OUTPUT_BASE, String(titleNum), `${monthNum}.png`);
        if (fs.existsSync(filePath)) {
          skippedCount++;
          continue;
        }
        allNodeIds.push(nodeId);
        nodeMapping.set(nodeId, { title: titleNum, name: String(monthNum), type: 'month', filePath });
        addedCount++;
      }
      console.log(`CalendarTitle${titleNum}: ${addedCount} to download, ${months.size - addedCount} already exist`);
    }

    // 3-2. 날짜/요일 이미지 노드 (CalendarTitleX-Date)
    for (const [titleNum, frame] of calendarFrames.dates) {
      const dates = findDateImages(frame);
      let addedCount = 0;

      for (const [dateName, nodeId] of dates) {
        const filePath = path.join(OUTPUT_BASE, String(titleNum), 'dates', `${dateName}.png`);
        if (fs.existsSync(filePath)) {
          skippedCount++;
          continue;
        }
        allNodeIds.push(nodeId);
        nodeMapping.set(nodeId, { title: titleNum, name: dateName, type: 'date', filePath });
        addedCount++;
      }
      console.log(`CalendarTitle${titleNum}-Date: ${addedCount} to download, ${dates.size - addedCount} already exist`);
    }

    console.log(`\nTotal: ${allNodeIds.length} to download, ${skippedCount} skipped (already exist)\n`);

    if (allNodeIds.length === 0) {
      console.log('All images already downloaded!');
      return;
    }

    // 4. 이미지 URL 가져오기 (배치로 처리, Figma API 제한 고려)
    const BATCH_SIZE = 30;
    const DELAY_MS = 2000; // 배치 간 2초 딜레이
    const imageUrls: Record<string, string> = {};

    for (let i = 0; i < allNodeIds.length; i += BATCH_SIZE) {
      const batch = allNodeIds.slice(i, i + BATCH_SIZE);
      const urls = await downloadImages(batch);
      Object.assign(imageUrls, urls);

      // 마지막 배치가 아니면 딜레이 추가
      if (i + BATCH_SIZE < allNodeIds.length) {
        console.log(`Waiting ${DELAY_MS}ms before next batch...`);
        await new Promise(resolve => setTimeout(resolve, DELAY_MS));
      }
    }

    // 5. 이미지 다운로드 및 저장
    console.log('\nDownloading images...\n');

    for (const [nodeId, url] of Object.entries(imageUrls)) {
      if (!url) {
        console.warn(`No URL for node ${nodeId}`);
        continue;
      }

      const mapping = nodeMapping.get(nodeId);
      if (!mapping) continue;

      await saveImage(url, mapping.filePath);
    }

    console.log('\nDone!');

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
